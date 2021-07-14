//Outer Imports:
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dimensions } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { VictoryPie, VictoryChart, VictoryTheme, VictoryAxis, VictoryLabel, VictoryArea, LineSegment } from 'victory-native';




export default function ManagerDashboardYearly(props) {

    return (
        <View style={styles.mainContainer}>

            <View style={styles.totalIncomeChunk}>
                <Text style={styles.textOneStyle}> סה"כ הכנסות השנה: </Text>
                <Text style={styles.earningsText}> {props.earnings} </Text>
                <Text style={styles.textOneStyle}> ש"ח </Text>
            </View>

            <View style={styles.twoPiecesChunk}>

                <View style={styles.halfWidthChunk}>
                    <Text style={styles.textThreeStyle}>סטים שנמכרו</Text>
                    <Text style={styles.textFourStyle}> {props.sets} </Text>
                </View>

                <View style={styles.halfWidthChunk}>
                    <Text style={styles.textThreeStyle}>סהכ לקוחות</Text>
                    <Text style={styles.textFourStyle}> {props.customers} </Text>
                </View>

            </View>


            {/* SALES ALONG THE MONTHS - BAR CHART */}
            <View style={styles.areaGraphChunk}>

                <View style={styles.secondaryHeadingContainer}>
                    <Text style={styles.secondaryHeading}>מכירות בחלוקה לחודשים</Text>
                </View>

                <VictoryChart
                    domainPadding={25, 0, 15, 25}                           // outer padding so nothing will get cut
                    theme={VictoryTheme.material}                           // built-in style
                    width={Dimensions.get('window').width * 0.9}            // width of the chart
                    height={250}                                            // height of the chart
                    padding={{ top: 10, bottom: 35, left: 50, right: 30 }}  // chart padding
                    gridComponent={<LineSegment />}                         // grid lines

                >
                    {/* Create X Axis */}
                    <VictoryAxis />

                    {/* Create Y Axis */}
                    <VictoryAxis
                        dependentAxis
                        tickFormat={(y) => (`₪${y / 1000}K`)}               // how to display the ticks of the axis
                    />

                    <VictoryArea
                        data={props.sellsByMonths}                          // data to display
                        animate={{
                            duration: 2000,
                            onLoad: { duration: 1000 }
                        }}
                        style={{
                            data: {
                                fill: ({ datum }) => "#3a3b40",             // color of area under the graph line
                                stroke: ({ index }) => "#3a3b40",           // color of the line
                                fillOpacity: 0.15,                          // opacity of the color under the line
                                strokeWidth: 3                              // width of the line
                            },
                            labels: {
                                fontSize: 12,                               // label font size
                                fill: ({ datum }) => "white",               // color of the text of the labels
                                fontWeight: "600"                           // make the labels' text bold
                            }
                        }}
                        labels={({ datum }) => datum.y}                     // what are the labels
                        labelComponent={
                            <VictoryLabel dy={-7}                           // make a labels appear a bit higher
                                backgroundStyle={{ fill: "#e95344", }}                          // background of the labels - red
                                backgroundPadding={{ top: 5, bottom: 2, left: 5, right: 3 }}    // padding inside the labels
                                angle={15}                                                      // tilt the labels a bit
                                textAnchor="middle"                                             // place the labels in the middle of the place
                            />
                        }
                    />
                </VictoryChart>
            </View>


            {/* LEADS TURNED TO CUSTOMERS - GAUGE */}
            <View style={styles.gaugeChunk}>

                <View style={styles.secondaryHeadingContainer}>
                    <Text style={styles.secondaryHeading}>לידים שהפכו ללקוחות</Text>
                </View>

                <View style={styles.gaugeContainer}>
                    <AnimatedCircularProgress
                        size={167}
                        width={22}
                        rotation={180}                              // start from the bottom of the gauge
                        lineCap='butt'                              // shape of endings of the colored part
                        tintColor={props.gauge < 30 ? '#e95344' : props.gauge < 65 ? '#ffcc00' : '#42c181'}
                        fill={props.gauge}                          // precentage to fill the gauge
                        backgroundColor='#3a3b40'                   // color of part that isn't filled
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


            {/* CUSTOMERS BY STATUSES - PIE CHART */}
            <View style={styles.pieChartChunk}>

                <View style={styles.secondaryHeadingContainer}>
                    <Text style={styles.secondaryHeading}>לקוחות בחלוקה לסטאטוסים</Text>
                </View>

                <VictoryPie
                    data={props.customerDevideStatuses}                                     // data to display
                    animate={{ duration: 2000 }}
                    colorScale={["#cc0000", "#7a0000", "#a30000", "#b70000", "#8e0000",]}   // colors of pie pieces
                    height={220}
                    padAngle={({ datum }) => 1}                                             // space between pie pieces
                    innerRadius={90}                                                        // hole inside pie
                    labelPosition={"centroid"}                                              // label position
                    labelPlacement={"vertical"}                                             // label angle
                    labelRadius={({ innerRadius }) => innerRadius + 20}                     // distance of label from pie
                />

            </View>

        </View>
    );
}


const styles = StyleSheet.create({

    //Containers:
    mainContainer:
    {
        backgroundColor: '#3a3b40'
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
    },
    earningsText:
    {
        textAlign: 'center',
        fontSize: 23,
        fontWeight: 'bold',
        padding: 3
    },
    textThreeStyle:
    {
        textAlign: 'center',
        fontSize: 18,
        padding: 3
    },
    textFourStyle:
    {
        textAlign: 'center',
        fontSize: 23,
        fontWeight: 'bold'
    },
    gaugeText:
    {
        fontSize: 22,
        fontWeight: 'bold'
    },


    //Chucnks:
    totalIncomeChunk:
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
        alignSelf: 'center',
        alignItems: 'center'
    },
    twoPiecesChunk:
    {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    halfWidthChunk:
    {
        backgroundColor: 'white',
        width: Dimensions.get('window').width / 2.3,
        marginVertical: 6,
        borderRadius: 15,
        justifyContent: 'center',
        padding: 5
    },
    areaGraphChunk:
    {
        backgroundColor: 'white',
        width: Dimensions.get('window').width * 0.95,
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
        backgroundColor: 'white',
        width: Dimensions.get('window').width * 0.95,
        minHeight: 65,
        marginVertical: 6,
        borderRadius: 15,
        padding: 5,
        flex: 1,
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center'
    },
    pieChartChunk:
    {
        backgroundColor: 'white',
        width: Dimensions.get('window').width * 0.95, height: 285,
        marginVertical: 6,
        borderRadius: 15,
        padding: 5,
        flex: 1,
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center'
    }
});