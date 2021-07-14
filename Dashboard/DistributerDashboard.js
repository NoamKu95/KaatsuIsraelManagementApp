//Outer Imports:
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dimensions } from 'react-native';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryAxis } from 'victory-native';

//Icons:
import { MaterialIcons } from '@expo/vector-icons';



export default function ManagerDashMonthly(props) {

    return (

        <View style={styles.mainContainer}>

            <View style={styles.totalIncomesChunk}>
                <Text style={styles.textOneStyle}>עמלות שהרווחתי החודש:</Text>
                <Text style={{ textAlign: 'center', fontSize: 23, fontWeight: 'bold', padding: 3 }}>{props.earnings}</Text>
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


            <View style={styles.totalIncomesChunk}>
                <Text style={styles.textOneStyle}>סטים שמכרתי החודש:</Text>
                <Text style={{ textAlign: 'center', fontSize: 23, fontWeight: 'bold', padding: 3 }}>{props.sets}</Text>
            </View>


            <View style={styles.twoPiecesChunk}>

                <View style={styles.halfWidthChunk}>
                    <Text style={styles.textOneStyle}>לידים חמים</Text>
                    <Text style={styles.textTwoStyle}> {props.leads} </Text>
                </View>

                <View style={styles.halfWidthChunk}>
                    <Text style={styles.textOneStyle}>לקוחות פעילים</Text>
                    <Text style={styles.textTwoStyle}> {props.actives} </Text>
                </View>

            </View>


            <View style={styles.barChartChunk}>

                <View style={styles.secondaryHeadingContainer}>
                    <Text style={styles.secondaryHeading}>המשכורות שלי בחודשים הקודמים</Text>
                </View>

                <VictoryChart
                    domainPadding={0}                                          // space on sides to prevent from overlapping the axis
                    width={Dimensions.get('window').width * 0.85}               // graph width
                    height={301}                                                // graph height
                    padding={{ top: 20, bottom: 35, left: 30, right: 30 }}      // graph padding so nothing will get cut
                    theme={VictoryTheme.material}                               // grid & built-in style
                >

                    {/* create Y axis */}
                    <VictoryAxis />

                    {/* create X axis */}
                    {/* <VictoryAxis
                        dependentAxis
                        tickFormat={(x) => (`₪${x / 1000}K`)}                   //ticks should be displayed
                    /> */}

                    <VictoryBar
                        labels={({ datum }) => `${datum.y}`}                    // what to display on the ticks
                        data={props.prevSalaries}                               // which data to display
                        alignment="middle"
                        animate={{
                            duration: 2000,
                            onLoad: { duration: 1000 }
                        }}
                        barRatio={0.8}                                          // makes the bars thicker

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
        </View>
    );
}


const styles = StyleSheet.create({

    //Containers:
    mainContainer:
    {
        backgroundColor: '#3a3b40',
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