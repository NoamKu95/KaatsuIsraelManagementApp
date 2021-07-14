//Outer Imports:
import * as React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';

//Inner Imports:
import Header from '../Components/Header';
import SalesReport from './SalesReport';
import CustomersReport from './CustomersReport';
import DistributersReport from './DistributersReport';
import StockReport from './StockReport';


const DownloadReports = (props) => {

    return (

        <View style={styles.mainContainer}>

            <StatusBar backgroundColor='#e95344' barStyle='light-content' />

            <Header navigation={props.navigation} showArrow={true} showMenu={true} />

            <ScrollView>

                <View style={styles.secondaryContainer} >

                    <Text style={styles.heading}>
                        הפקת דוחות
                        </Text>
                    <Text
                        style={styles.secondatyHeading}>
                        בחר את סוג הדוח להפקה:
                    </Text>

                    <SalesReport />
                    <CustomersReport />
                    <DistributersReport />
                    <StockReport />

                </View>

            </ScrollView>
        </View>
    )
};
export default DownloadReports;


const styles = StyleSheet.create({

    //Containers:
    mainContainer: {
        height: Dimensions.get('window').height,
        backgroundColor: 'white'
    },
    secondaryContainer:
    {
        flex: 1,
        alignItems: 'center'
    },

    //Headings:
    heading: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10
    },
    secondatyHeading:
    {
        marginTop: 22,
        textDecorationLine: 'underline',
        marginBottom: 18,
        fontSize: 17,
    }
});

