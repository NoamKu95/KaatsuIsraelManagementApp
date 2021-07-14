//Outer Imports:
import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Table, Row, Rows } from 'react-native-table-component';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import { useIsFocused } from '@react-navigation/native';

//Inner Imports:
import Header from '../Components/Header';
import FilterByStatusPopup from '../PopUps/FilterByStatusPopup';
import FilterByNamePopup from '../PopUps/FilterByNamePopup';
import FilterByGupPopup from '../PopUps/FilterByGupPopup';

//Icons:
import { MaterialIcons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';




export default function CustomersLists(props) {

    const isFocused = useIsFocused();

    const [userID, setUserID] = useState('');
    const [userType, setUserType] = useState('');


    //Table:
    const [headTable, setHeadTable] = useState(['שם\nפרטי', 'שם\n משפחה', 'תקשורת\nאחרונה', 'סטאטוס']);
    const [dataTable, setDataTable] = useState([]);


    //filters
    const [filterName, setFilterName] = useState(-1);
    const [filterGeneralUse, setFilterGeneralUse] = useState(-1);
    const [filterStatus, setFilterStatus] = useState(-1);


    //Alerts:
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');


    //Loading animation:
    const [spinner, setSpinner] = useState(true);





    useEffect(() => {

        const checkFocus = props.navigation.addListener('focus', () => {

            resetAllFilters();
            getUserPersonalCode();
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return checkFocus;

    }, []);


    //get from the AS the user profile -> for check if it manager/distributer
    const getUserPersonalCode = async () => {

        try {

            const jsonValue = await AsyncStorage.getItem('userDetails')

            if (jsonValue != null) {

                let user = JSON.parse(jsonValue);

                //the type of the user
                let userType = '';

                if (user.d_Status == 'מנהל') {

                    userType = 'מנהל';
                    await setUserType('מנהל')
                }
                else {

                    userType = 'מפיץ';
                    await setUserType('מפיץ')
                }

                // Save the ID into state
                await setUserID(user.d_PersonalCode);

                //Fetch the customers that belong to this distributer (or manager):
                fetchFilteredList(-1, -1, -1, userType, user.d_PersonalCode);
            }
            else {

                setSpinner(false);
                setAlertMessage('התרחשה שגיאה בשליפה מהאחסון המקומי');
                setAlertTitle('שגיאה');
                setShowAlert(true);
            }
        } catch {

            setSpinner(false);
            setAlertMessage('התרחשה שגיאה בשליפה מהאחסון המקומי');
            setAlertTitle('שגיאה');
            setShowAlert(true);
        }
    }


    //clicking on a row moves the user to view the customer details: 
    const showCustomer = (customerID) => {

        let c = {
            customerPersonalCode: parseInt(customerID),
        }

        props.navigation.navigate('customerStack', {
            screen: 'CustomerTimeline',
            params: { thisCustomer: c },
        });
    }




    //----------------filters functions-------------------//

    //filter by NAME
    const getFilterOfName = async (data) => {

        await setFilterName(data);

        let filter_gup = filterGeneralUse;
        let filter_status = filterStatus;

        fetchFilteredList(data, filter_gup, filter_status, userType, userID);
    }

    //filter by GENERAL USE PURPOSE
    const getFilterOfGeneralUsePurpose = async (data) => {

        await setFilterGeneralUse(data);

        let filter_name = filterName;
        let filter_status = filterStatus;
        fetchFilteredList(filter_name, data, filter_status, userType, userID);
    }

    //filter by STATUS
    const getFilterOfStatus = async (data) => {

        await setFilterStatus(data);

        let filter_name = filterName;
        let filter_gup = filterGeneralUse;
        fetchFilteredList(filter_name, filter_gup, data, userType, userID);
    }



    const fetchFilteredList = (name, gup, stat, userT, userID) => {

        //Let the user know the system is working
        setSpinner(true);

        // Prepare the url containing all details:
        let distType = ''; let dId = -1;

        if (userT == 'מנהל') {
            distType = 'מנהל';
        }
        else {
            distType = 'מפיץ פעיל';
            dId = userID;
        }

        let apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/getfilteredcustomers/${dId}/${distType}/${name}/${gup}/${stat}`;
        fetch(apiUrl,
            {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json; chartset=UTF-8',
                })
            })
            .then(res => {

                return res.status == 404 ?
                    404
                    :
                    res.status == 200 ?
                        res.json()
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

                            //Customer name & last name
                            tableRow.push(<Text onPress={() => showCustomer(result[i].c_PersonalCode)} style={styles.tableText}> {result[i].c_FirstName}</Text>);   //first cell: distributer Full Name
                            tableRow.push(<Text onPress={() => showCustomer(result[i].c_PersonalCode)} style={styles.tableText}> {result[i].c_LastName}</Text>);      //second cell: customer Full Name


                            //Date of last interaction with customer
                            let reverseJD = result[i].c_LastInteractionDate.split("T")[0];
                            let tableRowArr = reverseJD.split("-");
                            let date = tableRowArr[2] + "-" + tableRowArr[1] + "-" + tableRowArr[0]

                            tableRow.push(
                                <Text
                                    onPress={() => showCustomer(result[i].c_PersonalCode)}
                                    style={styles.tableText}
                                >
                                    {date}
                                </Text>
                            ); //third cell: last date of cummunication


                            // Customer Status (name + icon):
                            tableRow.push(
                                <Text style={{ alignSelf: 'center' }} onPress={() => showCustomer(result[i].c_PersonalCode)} >

                                    <View style={{ flexDirection: 'column', flex: 1, alignContent: 'center', alignItems: 'center' }}>

                                        <View style={{ padding: 4, width: 35, height: 35, borderRadius: 20, backgroundColor: '#e95344', flex: 1, alignItems: 'center', justifyContent: 'center', }} >
                                            {
                                                result[i].c_StatusName == 'ליד חם' ?
                                                    <MaterialIcons name="local-fire-department" size={20} color="white" /> :
                                                    result[i].c_StatusName == 'לקוח פעיל' ?
                                                        <Fontisto name="heartbeat-alt" size={20} color="white" /> :
                                                        result[i].c_StatusName == 'לקוח לא פעיל' ?
                                                            <MaterialIcons name="cancel" size={20} color="white" /> :
                                                            result[i].c_StatusName == 'ליד רדום' ?
                                                                <Ionicons name="alarm-sharp" size={20} color="white" /> :
                                                                result[i].c_StatusName == 'ליד אבוד' ?
                                                                    <MaterialCommunityIcons name="timer-sand" size={20} color="white" /> :
                                                                    <Text></Text>
                                            }
                                        </View>

                                        <View style={{ margin: 3, flex: 1, }}>
                                            {
                                                result[i].c_StatusName == 'ליד חם' ?
                                                    <Text style={{ fontSize: 9, }}>ליד חם</Text> :
                                                    result[i].c_StatusName == 'לקוח פעיל' ?
                                                        <Text style={{ fontSize: 9, }}> לקוח פעיל</Text> :
                                                        result[i].c_StatusName == 'לקוח לא פעיל' ?
                                                            <Text style={{ fontSize: 9 }}>לקוח לא פעיל</Text> :
                                                            result[i].c_StatusName == 'ליד רדום' ?
                                                                <Text style={{ fontSize: 9 }}>ליד רדום</Text> :
                                                                result[i].c_StatusName == 'ליד אבוד' ?
                                                                    <Text style={{ fontSize: 9 }}>ליד אבוד</Text> :
                                                                    <Text></Text>
                                            }
                                        </View>

                                    </View>
                                </Text>
                            ); // fourth cell: customer status

                            table.push(tableRow);   //Add the ROW to the Table
                        }

                        setSpinner(false); //stop the spinner because the data is ready to display
                        setDataTable(table);
                    }
                    else if (result == 404) {

                        let table = [];
                        let tableRow = [];      //Row in the Table

                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);

                        table.push(tableRow);   //Add the ROW to the Table
                        setDataTable(table);

                        setSpinner(false);
                        setAlertMessage('לא נמצאו לקוחות במסד הנתונים');
                        setAlertTitle('אופס!')
                        setShowAlert(true);
                    }
                    else if (result == 500) {

                        let table = [];
                        let tableRow = [];      //Row in the Table

                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);

                        table.push(tableRow);   //Add the ROW to the Table
                        setDataTable(table);

                        setSpinner(false);
                        setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה')
                        setShowAlert(true);
                    }
                    else {

                        let table = [];
                        let tableRow = [];      //Row in the Table

                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);

                        table.push(tableRow);   //Add the ROW to the Table
                        setDataTable(table);

                        setSpinner(false);
                        setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה')
                        setShowAlert(true);
                    }
                },
                (error) => {

                    let table = [];
                    let tableRow = [];      //Row in the Table

                    tableRow.push(<Text></Text>);
                    tableRow.push(<Text></Text>);
                    tableRow.push(<Text></Text>);
                    tableRow.push(<Text></Text>);

                    table.push(tableRow);   //Add the ROW to the Table
                    setDataTable(table);

                    setSpinner(false);
                    setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית               ' + error);
                    setAlertTitle('שגיאה')
                    setShowAlert(true);
                }
            );
    }


    const resetAllFilters = () => {

        setFilterName(-1);
        setFilterGeneralUse(-1);
        setFilterStatus(-1);
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

            <View style={styles.mainContainer}>

                {
                    userType == 'מנהל' ?
                        <Text style={styles.heading}> רשימת לקוחות </Text>
                        :
                        <Text style={styles.heading}> הלקוחות שלי </Text>
                }


                <View style={{ backgroundColor: 'white' }}>

                    {
                        isFocused ?
                            <FilterByNamePopup whoI='customer' sendDataToParent={getFilterOfName} myID={userID} myType={userType} />
                            :
                            <></>
                    }

                    {
                        userType == 'מנהל' ?
                            isFocused ?
                                <FilterByGupPopup sendDataToParent={getFilterOfGeneralUsePurpose} myID={userID} myType={userType} />
                                :
                                <></>
                            :
                            <></>
                    }

                    {
                        isFocused ?
                            <FilterByStatusPopup whoI='customer' sendDataToParent={getFilterOfStatus} myID={userID} myType={userType} />
                            :
                            <></>
                    }

                </View>


                <View style={[userType == 'מנהל' ? styles.tableContainerManager : styles.tableContainerDistributer]}>

                    <Table borderStyle={styles.tableBorder}>
                        <Row
                            data={headTable}
                            style={styles.headStyle}
                            textStyle={styles.tableHeaderText}
                        />

                        <ScrollView style={{ marginBottom: 110 }}>

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
    tableContainerManager:
    {
        marginBottom: 500
    },
    tableContainerDistributer:
    {
        marginBottom: 410
    },



    //Headings:
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
        borderColor: 'white',
    },
    tableHeaderText: {
        padding: 5,
        color: 'white',
        alignContent: "center",
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 14
    },
    headStyle: {
        height: 55,
        alignContent: "center",
        backgroundColor: '#3a3b40',
        borderColor: 'grey',
    },
    rowStyle:
    {
        height: 65,
        borderWidth: 1,
        borderColor: 'grey',
        backgroundColor: 'white'
    },
    tableText: {
        color: 'black',
        textAlign: 'center',
        fontSize: 14,
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