//Outer Imports:
import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Badge } from 'react-native-elements';
import { Table, Row, Rows } from 'react-native-table-component';
import Spinner from 'react-native-loading-spinner-overlay';

//Inner Imports:
import Header from '../Components/Header';

//Icons:
import { MaterialIcons } from '@expo/vector-icons';



export default function ConfirmDenyMatches(props) {

    //Badge:
    const [badgeNumber, setBadgeNumber] = useState('');

    //Table:
    const [headTable, setHeadTable] = useState(['שם\nמפיץ', 'שם\nליד', 'מידת\nהתאמה', 'דחה', 'אשר']);
    const [dataTable, setDataTable] = useState([]);

    //Alerts:
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');

    //Loading animation:
    const [spinner, setSpinner] = useState(true);



    useEffect(() => {

        const checkFocus = props.navigation.addListener('focus', () => {

            fetchMatchesStatusPending();
            fetchBudgeNum();
        });

        return checkFocus;

    }, []);



    //Get the pairs that their status is "ממתין לאישור"
    const fetchMatchesStatusPending = () => {

        setSpinner(true); // Start loading animation as data is being fetched

        const apiUrl = 'https://proj.ruppin.ac.il/bgroup12/prod/api/assignedto/pending';
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

                        let table = [];  //Table that will hold the data (the rows)

                        //From each object from the DB we create a ROW in the Table:
                        for (let i = 0; i < result.length; i++) {

                            let tableRow = [];      //Row in the Table

                            //Customer & Distributer Names:
                            tableRow.push(<Text onPress={() => openMatchDetails(result[i].at_Distributer, result[i].at_Customer, result[i].at_MatchRate)} style={styles.tableText}> {result[i].at_DistributerName}</Text>);   //first cell: distributer Full Name
                            tableRow.push(<Text onPress={() => openMatchDetails(result[i].at_Distributer, result[i].at_Customer, result[i].at_MatchRate)} style={styles.tableText}> {result[i].at_CustomerName}</Text>);      //second cell: customer Full Name


                            //Match Rate:
                            let newNum = parseFloat(result[i].at_MatchRate).toFixed(2); //shorten the score to only 2 digits after the decimel
                            tableRow.push(<Text onPress={() => openMatchDetails(result[i].at_Distributer, result[i].at_Customer, result[i].at_MatchRate)} style={styles.tableText}>{newNum}</Text>);                          //Third cell: Match Rate


                            //Reject Icon:
                            tableRow.push(
                                <Text                                                                                                                   //Fourth cell: Reject Button
                                    style={{ flexDirection: 'row', alignSelf: 'center', padding: 8 }}
                                    onPress={() => confirmOrRejectMatch(result[i].at_Customer, result[i].at_Distributer, false)}
                                >
                                    <MaterialIcons name="cancel" size={35} color="#e95344" />
                                </Text>
                            );

                            //Confirm Icon:
                            tableRow.push(
                                <Text                                                                                                                   //Fifth cell: Confirm Button
                                    style={{ flexDirection: 'row', alignSelf: 'center', padding: 8 }}
                                    onPress={() => confirmOrRejectMatch(result[i].at_Customer, result[i].at_Distributer, true)}
                                >
                                    <MaterialIcons name="check-circle" size={35} color="#42c181" />
                                </Text>
                            );

                            table.push(tableRow);   //Add the ROW to the Table
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
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        table.push(tableRow);
                        setDataTable(table);
                        setSpinner(false);


                        setAlertMessage('לא נמצאו לידים הממתינים לאישור צימוד במסד הנתונים');
                        setAlertTitle('אופס!');
                        setShowAlert(true);
                    }
                    else if (result == 500) {

                        let table = [];
                        let tableRow = [];
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        table.push(tableRow);
                        setDataTable(table);
                        setSpinner(false);


                        setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה');
                        setShowAlert(true);
                    }
                    else {

                        let table = [];
                        let tableRow = [];
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        table.push(tableRow);
                        setDataTable(table);
                        setSpinner(false);


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
                    tableRow.push(<Text></Text>);
                    tableRow.push(<Text></Text>);
                    table.push(tableRow);
                    setDataTable(table);
                    setSpinner(false);

                    setSpinner(false);
                    setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית             ' + error);
                    setAlertTitle('שגיאה');
                    setShowAlert(true);
                }
            );
    }


    //Get the number of leads that are waiting for manual pairing in the next page:
    const fetchBudgeNum = () => {

        const apiUrl = 'https://proj.ruppin.ac.il/bgroup12/prod/api/assignedto/numberofrejected/';
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

                        setBadgeNumber(result);
                        setSpinner(false); // Stop loading animation as data is ready to be displayed
                    }
                    else if (result == 404) {

                        setAlertMessage('לא נמצאו צימודים הממתינים לצימוד ידני במסד הנתונים');
                        setAlertTitle('אופס!');
                        setShowAlert(true);
                    }
                    else if (result == 500) {

                        setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה');
                        setShowAlert(true);
                    }
                    else {

                        setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה');
                        setShowAlert(true);
                    }
                },
                (error) => {

                    setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית             ' + error);
                    setAlertTitle('שגיאה');
                    setShowAlert(true);
                }
            );
    }


    //Approve or Disapprove a certain pair and update the DB accordingly:
    const confirmOrRejectMatch = (customer, ditributer, isConfirm) => {

        setSpinner(true);

        const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/assignedto/${ditributer}/${customer}`;
        fetch(apiUrl,
            {
                method: 'PUT',
                body: JSON.stringify(isConfirm ? "מאושר" : "לא מאושר"),
                headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json; chartset=UTF-8',
                })
            })
            .then(res => {

                return res.status == 200 ?
                    res.json()
                    :
                    res.status == 409 ?
                        409
                        :
                        res.status == 500 ?
                            500
                            :
                            res.status == 404 ?
                                404
                                :
                                null;
            })
            .then(
                (result) => {

                    if (result != null && result != 409 && result != 500 && result != 404) {

                        setSpinner(false);

                        setAlertMessage(result);
                        setAlertTitle('פעולה בוצעה בהצלחה');
                        setShowAlert(true);

                        //Update the data of the table:
                        fetchMatchesStatusPending();
                        fetchBudgeNum();
                    }
                    else if (result == 404) {

                        setSpinner(false);
                        setAlertMessage('לא נמצאה התאמה במסד הנתונים לנתוני הצימוד');
                        setAlertTitle('אופס!');
                        setShowAlert(true);
                    }
                    else if (result == 409) {

                        setSpinner(false);
                        setAlertMessage('הנתונים שהוזנו אינם עומדים בתנאי השרת ומסד הנתונים. נא לבדוק את הנתונים שהוזנו ולנסות שנית');
                        setAlertTitle('אופס!');
                        setShowAlert(true);
                    }
                    else if (result == 500) {

                        setSpinner(false);
                        setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה');
                        setShowAlert(true);
                    }
                    else {

                        setSpinner(false);
                        setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה');
                        setShowAlert(true);
                    }
                },
                (error) => {

                    setSpinner(false);
                    setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית             ' + error);
                    setAlertTitle('שגיאה');
                    setShowAlert(true);
                }
            );
    }


    //clicking on a row opens moves the user to view the pairing details: 
    const openMatchDetails = (Distributer, Customer, at_MatchRate) => {

        let pair = {
            customerId: Customer,
            disId: Distributer,
            matchRate: at_MatchRate,
            fromWhereI: 'fromPage',
        }
        props.navigation.navigate('MatchDetails', pair);
    }


    //Move to next page - "leads awaiting manual pairing":
    const moveToLeadsAwaitMatch = () => {

        props.navigation.navigate('LeadsAwaitingMatches');
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

                <TouchableOpacity
                    onPress={moveToLeadsAwaitMatch}
                    style={styles.leadButton}
                >
                    <Badge
                        value={badgeNumber} status="error"
                        containerStyle={styles.badgeContainer}
                    />
                    <Text
                        style={styles.leadButtonText}>
                        לידים ממתינים לצימוד
                    </Text>
                </TouchableOpacity>

                <Text style={styles.heading}>ניהול לידים</Text>


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
        minHeight: Dimensions.get('window').height - 45,
    },
    badgeContainer:
    {
        position: 'absolute',
        top: -8,
        right: +4
    },


    //Page name
    heading: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 30,
    },


    //Lead awaiting manual pairing button:
    leadButton: {
        borderWidth: 1,
        borderColor: '#e95344',
        borderRadius: 50,
        padding: 7,
        width: 170,
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        marginTop: 15,
        marginLeft: 8
    },
    leadButtonText:
    {
        color: '#3a3b40',
        textAlign: 'center',
        fontSize: 13,
        alignSelf: 'center',
        fontWeight: 'bold'
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
        height: 68,
        borderWidth: 1,
        borderColor: 'grey'
    },
    tableText: {
        color: 'black',
        textAlign: 'center',
        fontSize: 15,
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