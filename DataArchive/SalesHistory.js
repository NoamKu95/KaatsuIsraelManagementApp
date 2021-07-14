//Outer Imports:
import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Table, Row, Rows } from 'react-native-table-component';
import Spinner from 'react-native-loading-spinner-overlay';

//Inner Imports:
import Header from '../Components/Header';
import FilterByNamePopup from '../PopUps/FilterByNamePopup';
import FilterByProductPopup from '../PopUps/FilterByProductPopup';
import FilterBySalePricePopup from '../PopUps/FilterBySalePricePopup';
import FilterByDatePopup from '../PopUps/FilterByDatePopup';





export default function SalesHistory(props) {

    //Table:
    const [headTable, setHeadTable] = useState([, 'שם\nמפיץ', 'שם\nלקוח', 'מוצר', , 'תאריך\nמכירה', 'סכום']);
    const [dataTable, setDataTable] = useState([]);

    //Filters:
    const [filterName, setFilterName] = useState(-1);
    const [filterProduct, setFilterProduct] = useState(-1);
    const [filterFromDate, setFilterFromDate] = useState(-1);
    const [filterToDate, setFilterToDate] = useState(-1);
    const [filterMinTotalSum, setFilterMinTotalSum] = useState(-1);
    const [filterMaxTotalSum, setFilterMaxTotalSum] = useState(-1);

    //Alerts:
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');


    //Loading animation:
    const [spinner, setSpinner] = useState(true);


    // -----------------------------------------------------------------------------------------------------------------------------------



    useEffect(() => {

        const checkFocus = props.navigation.addListener('focus', () => {

            fetchFilteredList(-1, -1, -1, -1, -1, -1);
        });

        return checkFocus;

    }, []);




    // Get the filtered data from the DB:
    const fetchFilteredList = (dId, product, fromD, toD, totalMIN, totalMAX) => {

        //Let the user know the system is working
        setSpinner(true);

        if (fromD == -1 || toD == -1) {

            fromD = '1900-01-01T00:00:00';
            toD = '9999-01-01T00:00:00';
        }

        let times = {

            fromDate: fromD,
            toDate: toD
        }


        let apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/getfilteredsales/${dId}/${product}/${totalMIN}/${totalMAX}`;
        fetch(apiUrl,
            {
                method: 'POST',
                body: JSON.stringify(times),
                headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json; chartset=UTF-8',
                })
            })
            .then(res => {

                return res.status == 404 ?
                    404
                    :
                    res.status == 500 ?
                        500
                        :
                        res.status == 200 ?
                            res.json()
                            :
                            null;
            })
            .then(

                (result) => {

                    if (result != null && result != 404 && result != 500) {

                        let table = [];  //Table that will hold the data (the rows)

                        //From each object from the DB we create a ROW in the Table:
                        for (let i = 0; i < result.length; i++) {

                            let tableRow = [];      //Row in the Table

                            //NAMES
                            tableRow.push(<Text style={styles.tableText}>{result[i].s_SellerFullName}</Text>);   //first cell: seller Full Name
                            tableRow.push(<Text style={styles.tableText}>{result[i].s_BuyerFullName}</Text>);   //second cell: buyer Full Name
                            tableRow.push(<Text style={styles.tableText}>{result[i].s_ProductName}</Text>);     //third cell: product name


                            //SALE DATE
                            //Cut the date we got from the db:
                            let cutBD = result[i].s_Date.split("T")[0];
                            let bdArr = cutBD.split("-");
                            let bDay = bdArr[2];
                            let bMonth = bdArr[1];
                            let bYear = bdArr[0];
                            let bdReverse = `${bDay}-${bMonth}-${bYear}`;
                            tableRow.push(<Text style={styles.tableText}>{bdReverse}</Text>);   //fourth cell: sale date


                            //PRICE
                            tableRow.push(<Text style={styles.tableText}>{`${result[i].s_TotalToPay}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>); // fifth cell: sale total price

                            table.push(tableRow);   //Add the ROW to the Table
                        }

                        setSpinner(false);
                        setDataTable(table);
                    }
                    else if (result == 404) {

                        let table = [];
                        let tableRow = [];      //Row in the Table

                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);

                        table.push(tableRow);   //Add the ROW to the Table
                        setDataTable(table);

                        setSpinner(false);
                        setAlertMessage('לא נמצאו מכירות במסד הנתונים');
                        setAlertTitle('אופס!')
                        setShowAlert(true);
                    }
                    else if (result == 500) {

                        setSpinner(false);
                        setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה')
                        setShowAlert(true);
                    }
                    else {

                        setSpinner(false);
                        setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה')
                        setShowAlert(true);
                    }
                },
                (error) => {

                    setSpinner(false);
                    setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית               ' + error);
                    setAlertTitle('שגיאה')
                    setShowAlert(true);
                }
            );
    }




    //________FILTERS________//

    //Filter by NAME:
    const getFilterOfName = async (data) => {

        await setFilterName(data);

        let filter_product = filterProduct;
        let filter_fromDate = filterFromDate;
        let filter_toDate = filterToDate;
        let filter_MINtotal = filterMinTotalSum;
        let filter_MAXtotal = filterMaxTotalSum;

        fetchFilteredList(data, filter_product, filter_fromDate, filter_toDate, filter_MINtotal, filter_MAXtotal);
    }


    //Filter by PRODUCT:
    const getFilterOfProduct = async (data) => {

        await setFilterProduct(data);

        let filter_name = filterName;
        let filter_fromDate = filterFromDate;
        let filter_toDate = filterToDate;
        let filter_MINtotal = filterMinTotalSum;
        let filter_MAXtotal = filterMaxTotalSum;


        fetchFilteredList(filter_name, data, filter_fromDate, filter_toDate, filter_MINtotal, filter_MAXtotal);
    }


    //Filter by DATE:
    const getFilterOfDate = async (olderDate, newerDate) => {

        await setFilterFromDate(olderDate);
        await setFilterToDate(newerDate);

        let filter_name = filterName;
        let filter_product = filterProduct;
        let filter_MINtotal = filterMinTotalSum;
        let filter_MAXtotal = filterMaxTotalSum;


        fetchFilteredList(filter_name, filter_product, olderDate, newerDate, filter_MINtotal, filter_MAXtotal);
    }


    //Filter by TOTAL SUM:
    const getFilterOfTotalSum = async (minNum, maxNum) => {

        await setFilterMinTotalSum(minNum);
        await setFilterMaxTotalSum(maxNum);

        let filter_name = filterName;
        let filter_product = filterProduct;
        let filter_fromDate = filterFromDate;
        let filter_toDate = filterToDate;

        fetchFilteredList(filter_name, filter_product, filter_fromDate, filter_toDate, minNum, maxNum);
    }

    // -----------------------------------------------------------------------------------------------------------------------------------




    return (
        <>
            <StatusBar backgroundColor='#e95344' barStyle='light-content' />

            <Header navigation={props.navigation} showArrow={true} showMenu={true} />

            <AwesomeAlert
                show={showAlert}
                showProgress={false}
                title={alertTitle}
                message={alertMessage}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={false}
                showConfirmButton={true}
                confirmText="אישור"
                confirmButtonColor="#e95344"
                onConfirmPressed={() => { setShowAlert(false) }}
                messageStyle={styles.alertMessageStyle}
                titleStyle={styles.alertTitleStyle}
                overlayStyle={{ backgroundColor: 'rgba(76, 76, 76, 0.69)' }}
                confirmButtonStyle={styles.alertConfirmBtnStyle}
                confirmButtonTextStyle={styles.alertConfirmBtnTxtStyle}
                contentContainerStyle={styles.alertContentContainerStyle}
            />

            <Spinner
                visible={spinner}
                textContent={'טוען...'}
                textStyle={styles.spinnerTextStyle}
                color={'white'}
                animation={'fade'}
                overlayColor={'rgba(58, 59, 64, 0.65)'}
            />

            <View style={styles.mainContainer}>

                <View >
                    <Text style={styles.heading}> היסטוריית מכירות </Text>
                </View>


                <View style={{ backgroundColor: 'white' }}>

                    <FilterByNamePopup whoI='distributer' sendDataToParent={getFilterOfName} />
                    <FilterByProductPopup sendDataToParent={getFilterOfProduct} />
                    <FilterByDatePopup whoI='salePage' sendDataToParent={getFilterOfDate} />
                    <FilterBySalePricePopup sendDataToParent={getFilterOfTotalSum} />
                </View>


                <View style={{ marginBottom: 50 }}>
                    <Table borderStyle={styles.tableBorder}>
                        <Row
                            data={headTable}
                            style={styles.headStyle}
                            textStyle={styles.tableHeaderText}
                        />
                        <ScrollView>

                            <Rows
                                data={dataTable}
                                textStyle={styles.tableText}
                                style={styles.rowStyle}
                            />
                        </ScrollView>
                    </Table>
                </View>
            </View>

        </>
    );
}


const styles = StyleSheet.create({

    //Containers:
    mainContainer: {
        backgroundColor: 'white',
        minHeight: Dimensions.get('window').height - 45
    },


    //Page name
    heading: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10,

    },


    //Table:
    tableBorder:
    {
        borderWidth: 1,
        borderColor: 'white'
    },
    headStyle: {
        height: 55,
        alignContent: "center",
        backgroundColor: '#3a3b40',
        borderColor: 'grey',
    },
    tableHeaderText: {
        padding: 5,
        color: 'white',
        alignContent: "center",
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 14
    },
    rowStyle:
    {
        height: 65,
        borderWidth: 1,
        borderColor: 'grey'
    },
    tableText: {
        color: 'black',
        textAlign: 'center',
        fontSize: 13,
    },

    //Spinner:
    spinnerTextStyle:
    {
        color: 'white',
        fontSize: 26,
        fontWeight: 'bold'
    },


    //Alerts:
    alertMessageStyle: {
        fontSize: 20, color: '#3a3b40', textAlign: 'center'
    },
    alertTitleStyle: {
        fontSize: 22, color: '#3a3b40', textAlign: 'center', fontWeight: 'bold'
    },
    alertConfirmBtnStyle: {
        borderRadius: 50, width: 180
    },
    alertConfirmBtnTxtStyle: {
        fontSize: 17, padding: 5, textAlign: 'center', fontWeight: 'bold'
    },
    alertContentContainerStyle: {
        borderRadius: 15, width: 300
    },
});