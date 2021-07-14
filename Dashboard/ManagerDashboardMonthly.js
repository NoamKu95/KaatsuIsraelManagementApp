//Outer Imports:
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dimensions } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryAxis } from 'victory-native';

//Icons:
import { MaterialIcons } from '@expo/vector-icons';



export default function ManagerDashboardMonthly(props) {

    return (

        <View style={styles.mainContainer}>

            <View style={styles.totalIncomesChunk}>
                <Text style={styles.textOneStyle}>סה"כ הכנסות החודש:</Text>
                <Text style={styles.earningsText}>{props.earnings}</Text>
                <Text style={styles.textOneStyle}>ש"ח</Text>
            </View>

            <View style={styles.prevMonthRefChunk}>

                <Text style={styles.textOneStyle}>ביחס לחודש קודם: </Text>

                {
                    props.changeStatus ?
                        <Text style={styles.changeRateTextGreen}>{props.changeRate}% </Text>
                        :
                        <Text style={styles.changeRateTextRed}>{props.changeRate}% </Text>
                }

                {
                    props.changeStatus ?
                        <MaterialIcons name="keyboard-arrow-up" size={24} color="#42c181" />
                        :
                        <MaterialIcons name="keyboard-arrow-down" size={24} color="#e95344" />
                }
            </View>

            <View style={styles.twoPiecesChunk}>

                <View style={styles.halfWidthChunk}>
                    <Text style={styles.textOneStyle}>לידים שנכנסו</Text>
                    <Text style={styles.textTwoStyle}> {props.leads} </Text>
                </View>

                <View style={styles.halfWidthChunk}>
                    <Text style={styles.textOneStyle}>סטים שנמכרו</Text>
                    <Text style={styles.textTwoStyle}> {props.sets} </Text>
                </View>

            </View>


            {/* TOP SELLERS OF THIS MONTH - BAR CHART */}
            {
                props.showTopSellers ?
                    <View style={styles.barChartChunk}>

                        <View style={styles.secondaryHeadingContainer}>
                            <Text style={styles.secondaryHeading}>מפיצים מובילים החודש</Text>
                        </View>

                        <VictoryChart
                            horizontal                                                  // bars on the side
                            domainPadding={20}                                          // space on sides to prevent from overlapping the axis
                            width={Dimensions.get('window').width * 0.85}               // graph width
                            height={301}                                                // graph height
                            padding={{ top: 20, bottom: 35, left: 55, right: 30 }}      // graph padding so nothing will get cut
                            theme={VictoryTheme.material}                               // grid & built-in style
                        >

                            {/* create Y axis */}
                            <VictoryAxis />

                            {/* create X axis */}
                            <VictoryAxis
                                dependentAxis
                                tickFormat={(x) => (`₪${x / 1000}K`)}                   //ticks should be displayed
                            />

                            <VictoryBar
                                labels={({ datum }) => `${datum.earnings}`}             // what to display on the ticks
                                data={props.topSellers}                                 // which data to display
                                alignment="middle"
                                animate={{
                                    duration: 2000,
                                    onLoad: { duration: 1000 }
                                }}
                                barRatio={0.8}                                          // makes the bars thicker
                                x="seller"
                                y="earnings"

                                style={{
                                    data: {
                                        fill: ({ datum }) => "#3a3b40",                 // color inside the bars
                                        stroke: ({ index }) => "#3a3b40",               // outline of the bars
                                        fillOpacity: 0.15,                              // opacity of color inside the bars
                                        strokeWidth: 2                                  // width of the outline of the bars
                                    },
                                    labels: {
                                        fontSize: 12,                                   // font size of labels inside the graph
                                        fill: ({ datum }) => "#e95344"                  // color of the labels inside the graph
                                    }
                                }}

                            />
                        </VictoryChart>

                    </View>
                    :
                    <></>
            }


            <View style={styles.gaugeChunk}>

                <View style={styles.secondaryHeadingContainer}>
                    <Text style={styles.secondaryHeading}>לידים מהחודש שהפכו ללקוחות</Text>
                </View>

                <View style={styles.gaugeContainer}>
                    <AnimatedCircularProgress
                        size={167}
                        width={22}
                        rotation={180}                      // start at the bottom of the circle
                        lineCap='butt'                      // shape of endings of the colored part
                        tintColor={props.gauge < 30 ? '#e95344' : props.gauge < 65 ? '#ffcc00' : '#42c181'}
                        fill={props.gauge}                  // precentage to fill the gauge
                        backgroundColor='#3a3b40'           // color of part that isn't filled
                    >
                        {
                            (fill) => (
                                <Text style={styles.gaugeText}>
                                    {props.gauge}%
                                </Text>
                            )
                        }

                    </AnimatedCircularProgress>
                </View>

            </View>

        </View>
    );
}


const styles = StyleSheet.create({

    //Containers:
    mainContainer:
    {
        backgroundColor: '#3a3b40',
        minHeight: Dimensions.get('window').height - 160 // substruct the header's hight & quick buttons' hight
    },
    secondaryHeadingContainer:
    {
        backgroundColor: 'white',
        paddingTop: 15
    },
    gaugeContainer:
    {
        alignSelf: 'center',
        marginVertical: 6
    },


    //Headings:
    secondaryHeading:
    {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18
    },


    //Text Fields:
    textOneStyle:
    {
        textAlign: 'center',
        fontSize: 18,
        padding: 3
    },
    textTwoStyle:
    {
        textAlign: 'center',
        fontSize: 23,
        fontWeight: 'bold'
    },
    changeRateTextGreen:
    {
        textAlign: 'center',
        fontSize: 23,
        color: '#42c181',
        fontWeight: 'bold'
    },
    changeRateTextRed:
    {
        textAlign: 'center',
        fontSize: 23,
        color: '#e95344',
        fontWeight: 'bold'
    },
    gaugeText:
    {
        fontSize: 22,
        fontWeight: 'bold'
    },
    earningsText:
    {
        textAlign: 'center',
        fontSize: 23,
        fontWeight: 'bold',
        padding: 3
    },


    //Chucks:
    totalIncomesChunk:
    {
        backgroundColor: 'white',
        width: Dimensions.get('window').width * 0.95,
        minHeight: 65, marginVertical: 6,
        borderRadius: 15,
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    prevMonthRefChunk:
    {
        backgroundColor: 'white',
        width: Dimensions.get('window').width * 0.95,
        minHeight: 65,
        marginVertical: 6,
        borderRadius: 15,
        padding: 5,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    twoPiecesChunk:
    {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    halfWidthChunk:
    {
        backgroundColor: 'white',
        width: Dimensions.get('window').width / 2.3,
        marginHorizontal: 10,
        marginVertical: 6,
        borderRadius: 15,
        justifyContent: 'center',
        padding: 5
    },
    barChartChunk:
    {
        backgroundColor: 'white', width: Dimensions.get('window').width * 0.95,
        minHeight: 65,
        marginVertical: 6,
        borderRadius: 15,
        padding: 5,
        flex: 1,
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center'
    },
    gaugeChunk:
    {
        backgroundColor: 'white', width: Dimensions.get('window').width * 0.95,
        minHeight: 65,
        marginVertical: 6,
        borderRadius: 15,
        padding: 5,
        flex: 1,
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center'
    },
});