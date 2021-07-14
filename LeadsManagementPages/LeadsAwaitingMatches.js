//Outer Imports:
import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import GuidingInfoOnLeadPopUp from './GuidingInfoOnLeadPopup';
import { Table, Row, Rows } from 'react-native-table-component';
import Spinner from 'react-native-loading-spinner-overlay';

//Inner Imports:
import Header from '../Components/Header';



export default function LeadsAwaitingMatches(props) {

    //Table:
    const [headTable, setHeadTable] = useState(['שם', 'תאריך כניסה למערכת', 'צמד']);        //Columns names in table
    const [dataTable, setDataTable] = useState([]);                                           //Rows of the table


    //Alerts:
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');


    //Loading animation:
    const [spinner, setSpinner] = useState(true);




    useEffect(() => {

        const checkFocus = props.navigation.addListener('focus', () => {

            fetchRejectMatches();
        });

        return checkFocus;

    }, []);



    //Get the leads that are awaiting manual pairing from the DB:
    const fetchRejectMatches = () => {

        const apiUrl = 'https://proj.ruppin.ac.il/bgroup12/prod/api/assignedto/rejected';
        fetch(apiUrl,
            {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json; chartset=UTF-8',
                })
            })
            .then(res => {

                return res.status == 200 ?
                    res.json()
                    :
                    res.status == 404 ?
                        404
                        :
                        res.status == 500 ?
                            500
                            :
                            null;
            })
            .then(

                (result) => {

                    if (result != null && result != 404 && result != 500) {

                        let table = [];   //Table that will hold the data (the rows)

                        //From each object from the DB we create a ROW in the Table:
                        for (let i = 0; i < result.length; i++) {

                            let tableRow = [];

                            tableRow.push(
                                <Text                                               //first cell: Lead's Full Name
                                    style={styles.tableText}
                                >
                                    {result[i].at_CustomerName}
                                </Text>
                            );


                            //Arrange lead's entry date in a better format:
                            let reverseJD = result[i].at_CustomerJoinDate.split("T")[0];
                            let tableRowArr = reverseJD.split("-");
                            let date = tableRowArr[2] + "-" + tableRowArr[1] + "-" + tableRowArr[0]

                            let thisCustID = result[i].at_Customer;

                            tableRow.push(
                                <Text                                               //second cell: Date of entering the system
                                    style={styles.tableText}
                                >
                                    {date}
                                </Text>
                            );


                            //Information Icon:
                            tableRow.push(                                           //Thirs cell: info icon 

                                <GuidingInfoOnLeadPopUp
                                    idCust={result[i].at_Customer}
                                    idDist={result[i].at_Distributer}
                                    nameDist={result[i].at_DistributerName}
                                    matchRate={result[i].at_MatchRate}
                                    sendDataFromChild={getDataFromChild}
                                    navigation={props.navigation}
                                />
                            );

                            table.push(tableRow);   //Insert the row to the Table
                        }

                        setSpinner(false);
                        setDataTable(table);
                    }
                    else if (result == 404) {

                        let table = [];
                        let tableRow = [];
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        table.push(tableRow);
                        setDataTable(table);

                        setSpinner(false);
                        setAlertMessage('לא נמצאו לידים הממתינים לצימוד ידני במסד הנתונים');
                        setAlertTitle('אופס!');
                        setShowAlert(true);
                    }
                    else if (result == 500) {

                        let table = [];
                        let tableRow = [];
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        table.push(tableRow);
                        setDataTable(table);

                        setSpinner(false);

                        setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שניתתרחשה שגיאה בלתי צפוייה בשרת');
                        setAlertTitle('שגיאה');
                        setShowAlert(true);
                    }
                    else {

                        let table = [];
                        let tableRow = [];
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        table.push(tableRow);
                        setDataTable(table);

                        setSpinner(false);
                        setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה');
                        setShowAlert(true);
                    }
                },
                (error) => {

                    let table = [];
                    let tableRow = [];
                    tableRow.push(<Text></Text>);
                    tableRow.push(<Text></Text>);
                    tableRow.push(<Text></Text>);
                    table.push(tableRow);
                    setDataTable(table);

                    setSpinner(false);
                    setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית             ' + error);
                    setAlertTitle('שגיאה');
                    setShowAlert(true);
                }
            );
    }


    function getDataFromChild(toRefresh) {

        toRefresh ? fetchRejectMatches() : '';
    }




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

            <View style={styles.mainContainer} >
                <Text style={styles.heading}>לידים ממתינים לצימוד ידני</Text>


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
        marginTop: 40,
        marginBottom: 30,
    },


    //Table:
    headStyle: {
        height: 55,
        alignContent: "center",
        backgroundColor: '#3a3b40',
        borderColor: 'grey'
    },
    tableHeaderText: {
        margin: 10,
        color: 'white',
        alignContent: "center",
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 14
    },
    tableBorder:
    {
        borderWidth: 1,
        borderColor: 'grey'
    },
    tableText: {
        padding: 5,
        color: 'black',
        textAlign: 'center',
        fontSize: 15,
    },
    rowStyle:
    {
        height: 60
    },


    //infoIcon
    infoIcon: {
        alignSelf: "center"
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