//Outer Imports:
import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, StatusBar } from 'react-native';
import { Dimensions } from 'react-native';
import Timeline from 'react-native-timeline-flatlist'
import * as Linking from 'expo-linking';
import AwesomeAlert from 'react-native-awesome-alerts';
import Spinner from 'react-native-loading-spinner-overlay';

//Inner Imports:
import Header from '../Components/Header';
import AddToTimeline from '../PopUps/AddToTimeLine';

//Icons:
import { Ionicons } from '@expo/vector-icons';




export default function CustomerTimeline(props) {

    const [customerPersonalCode, setCustomerPersonalCode] = useState(props.route.params.thisCustomer.customerPersonalCode); // props.route.params.thisCustomer.customerPersonalCode,            //Personal Identifying Code
    const [customerFirstName, setCustomerFirstName] = useState('');              // first name
    const [customerLastName, setCustomerLastName] = useState('');               // last name
    const [customerEmail, setCustomerEmail] = useState('');                  //email,
    const [customerPhone, setCustomerPhone] = useState('');                  //phone
    const [customerGender, setCustomerGender] = useState('');                 //gender

    const [customerFullAdress, setCustomerFullAdress] = useState('');             //adress
    const [customerCity, setCustomerCity] = useState('');
    const [customerStreet, setCustomerStreet] = useState('');
    const [customerHouse, setCustomerHouse] = useState('');
    const [customerAppartment, setCustomerAppartment] = useState('');

    const [customerBirthDate, setCustomerBirthDate] = useState('');              //birth date
    const [customerHealthStatus, setCustomerHealthStatus] = useState('');           //health
    const [customerNotes, setCustomerNotes] = useState('');                  //notes
    const [customerStatus, setCustomerStatus] = useState('');                 //status
    const [todayDate, setTodayDate] = useState('');
    const [data, setData] = useState([]);

    const [customerUsePurposeString, setCustomerUsePurposeString] = useState('');       //GENERAL use purpose(s) of the customer - string


    const [customerSubUsePurposeString, setCustomerSubUsePurposeString] = useState('');       //SUB use purpose(s) of the customer - string

    const [customerRowVersion, setCustomerRowVersion] = useState('');

    //Alerts:
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');

    //Loading animation:
    const [spinner, setSpinner] = useState(true);




    useEffect(() => {

        const checkFocus = props.navigation.addListener('focus', () => {

            setCustomerPersonalCode(props.route.params.thisCustomer.customerPersonalCode);

            //Get today's date:
            const date = new Date().getDate();
            const month = new Date().getMonth() + 1;
            const year = new Date().getFullYear();
            setTodayDate(date + '-' + month + '-' + year);

            callAllFetches();
        });

        return checkFocus;

    }, []);


    //Fetch neccessary data from the DB:
    const callAllFetches = async () => {

        await fetchCustomerDetails();
        await fetchCustomerEvents();
    }


    //Get all customer's details based on his personal code:
    const fetchCustomerDetails = async () => {

        const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/customer/${customerPersonalCode}/`;
        await fetch(apiUrl,
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

                        //Make the customer's adress:
                        let adress = result.c_StreetName + " " + result.c_HouseNumber + ", " + result.c_CityName + " (" + "דירה " + result.c_AppartmentNumber + ")";

                        setCustomerFirstName(result.c_FirstName);
                        setCustomerLastName(result.c_LastName);
                        setCustomerEmail(result.c_Email);

                        setCustomerPhone(result.c_PhoneNumber);                //phone
                        setCustomerGender(result.c_Gender);                    //gender
                        setCustomerBirthDate(result.c_BirthDate);              //birth date
                        setCustomerHealthStatus(result.c_HealthStatusName);    //health
                        setCustomerNotes(result.c_Notes);                      //notes
                        setCustomerStatus(result.c_StatusName);                //status

                        setCustomerFullAdress(adress);                         //adress
                        setCustomerCity(result.c_CityName);                    //city
                        setCustomerStreet(result.c_StreetName);                //street
                        setCustomerHouse(result.c_HouseNumber);                //house number
                        setCustomerAppartment(result.c_AppartmentNumber);      //appartment number

                        setCustomerRowVersion(result.RowVersion);               //row version

                        //Turn the sups into a long string:
                        let textSups = '';
                        let arrSubs = result.c_SubUsePurposes_STRINGS;
                        arrSubs.forEach(element => {
                            textSups += element;
                            textSups += ", ";
                        });
                        setCustomerSubUsePurposeString(textSups.substring(0, textSups.length - 2));

                        //Turn the sups into a long string:
                        let textGups = '';
                        let arrGups = result.c_GeneralUsePurposes_STRINGS
                        arrGups.forEach(element => {
                            textGups += element;
                            textGups += ", ";
                        });
                        setCustomerUsePurposeString(textGups.substring(0, textGups.length - 2));
                    }
                    else if (result == 404) {

                        setAlertMessage('לא נמצאה התאמה ללקוח במסד הנתונים');
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

                    setAlertMessage('התרחשה תקלה בתקשורת עם מסד הנתונים. נא לנסות שנית             ' + error);
                    setAlertTitle('שגיאה');
                    setShowAlert(true);
                }
            )
    }


    //Get all the customer-events this customer has in the DB:
    const fetchCustomerEvents = () => {

        const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/interactionwithcustomer/${customerPersonalCode}/`;
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

                        let eventsArr = []; // temp to hold the time-line events objects
                        result.forEach(element => {

                            //Create properties for the time-line event object:
                            //Date -
                            let dateOfEvent = element.iwc_Date;
                            let tempArr = dateOfEvent.split("T");

                            //Notes -
                            let notes = '';
                            element.iwc_Notes == null ? notes = '' : notes = element.iwc_Notes;

                            //Combine them together into the object:
                            eventsArr.push({ time: `${tempArr[0]}`, title: `${element.iwc_InteractionName}`, description: `${notes}` })
                        });

                        setSpinner(false); //Stop loading animation as data is ready to be displayed
                        setData(eventsArr);
                    }
                    else if (result == 404) {

                        setSpinner(false);
                        setAlertMessage('התרחשה תקלה בהבאת האירועים ממסד הנתונים. נא לנסות שנית');
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
                    setAlertMessage('התרחשה תקלה בתקשורת עם מסד הנתונים. נא לנסות שנית             ' + error);
                    setAlertTitle('שגיאה');
                    setShowAlert(true);
                }
            );
    }


    //The user wants to add a new event:
    const getDataFromChild = (newEvent) => {

        const apiUrl = 'https://proj.ruppin.ac.il/bgroup12/prod/api/interactionwithcustomer/';
        fetch(apiUrl,
            {
                method: 'POST',
                body: JSON.stringify(newEvent),
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

                        setAlertMessage(result);
                        setAlertTitle('פעולה בוצעה בהצלחה');
                        setShowAlert(true);

                        fetchCustomerEvents();
                    }
                    else if (result == 404) {
                        setAlertMessage('לא נמצאה התאמה ללקוח זה במסד הנתונים');
                        setAlertTitle('שגיאה');
                        setShowAlert(true);
                    }
                    else if (result == 500) {
                        setAlertMessage('התרחשה תקלה בהוספת האינטראקציה לציר הזמן של הלקוח. נא לנסות שנית');
                        setAlertTitle('שגיאה');
                        setShowAlert(true);
                    }
                    else {

                        setAlertMessage('התרחשה שגיאה לא צפויה. נא לרענן את העמוד ולנסות שנית');
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


    //Move to next page and take customer data with us:
    const moveToViewCustomer = () => {

        let c = {
            customerPersonalCode: customerPersonalCode,
            customerFirstName: customerFirstName,
            customerLastName: customerLastName,
            customerEmail: customerEmail,
            customerPhone: customerPhone,
            customerGender: customerGender,

            customerFullAdress: customerFullAdress,
            customerCity: customerCity,
            customerStreet: customerStreet,
            customerHouse: customerHouse,
            customerAppartment: customerAppartment,

            customerBirthDate: customerBirthDate,
            customerHealthStatus: customerHealthStatus,
            customerNotes: customerNotes,
            customerStatus: customerStatus,


            customerUsePurposeString: customerUsePurposeString, // text "שיקום, פיטנס"
            customerSubUsePurposeString: customerSubUsePurposeString, // text "חיזוק שירים, חיטוב ירכיים"

            customerRowVersion: customerRowVersion,
        }

        props.navigation.navigate('ViewCustomer', { thisCustomer: c });
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

            <View style={styles.upperPartContainer}>

                <TouchableOpacity onPress={() => moveToViewCustomer()}>
                    <View style={styles.upperRightSectionContainer}>

                        <View style={styles.customerDetailsContainer}>

                            <Text style={styles.boldText}>
                                {customerFirstName} {customerLastName}
                            </Text>

                        </View>

                        <Text style={styles.adressTextStyle}>{customerStreet} {customerHouse}, {customerCity}</Text>

                    </View>
                </TouchableOpacity>

                <View style={styles.upperLeftSectionContainer}>

                    <Text style={styles.phoneText} >{customerPhone}</Text>

                    <Ionicons
                        name="md-call" size={18} color="white" style={styles.phoneIcon}
                        onPress={() => Linking.openURL(`tel:${customerPhone}`)}
                    />

                </View>

            </View>

            <View style={styles.timelineBackground}>

                <AddToTimeline sendDataFromChild={getDataFromChild} customerPersonalCode={customerPersonalCode} />

            </View>

            <View style={styles.datePlus}>

                <Text style={styles.dateStyle}>
                    {todayDate}
                </Text>

            </View>

            <Timeline

                circleColor='#f8f8f8'
                lineColor='#f8f8f8'

                //style of the whole <Timeline/>
                style={{ marginTop: 0 }}

                //surrounds the whole timeline - from side to side and top to bottom
                listViewContainerStyle={styles.listViewContainerStyle}

                //style of the time-box
                timeContainerStyle={
                    [
                        data.length == 1 ?
                            styles.one :
                            data.length == 2 ?
                                styles.two :
                                data.length == 3 ?
                                    styles.three :
                                    styles.four
                    ]
                }

                //style of the written time
                timeStyle={styles.timeStyle}

                //style of each event-box
                detailContainerStyle={styles.detailContainerStyle}

                //style of the title of the event
                titleStyle={styles.titleStyle}

                //style of the notes text
                descriptionStyle={{ fontSize: 12, color: '#3a3b40' }}

                data={data}
            />
        </>
    )
}

const styles = StyleSheet.create({

    //Styles for Timeline:
    timelineBackground:
    {
        backgroundColor: '#3a3b40'
    },
    dateStyle: {
        color: '#f8f8f8',
        fontSize: 18,
        fontWeight: 'bold',
        borderRadius: 50,
        borderWidth: 1,
        borderColor: 'white',
        paddingHorizontal: 8,
        marginTop: 10,
        marginLeft: '15%'
    },
    one: {
        paddingHorizontal: 2,
        height: Dimensions.get('window').height * 0.7
    },
    two: {
        paddingHorizontal: 2,
        minHeight: Dimensions.get('window').height * 0.35
    },
    three: {
        paddingHorizontal: 2,
        minHeight: Dimensions.get('window').height * 0.25
    },
    four: {
        paddingHorizontal: 2,
    },
    listViewContainerStyle: {
        backgroundColor: '#3a3b40',
        padding: 5,
    },
    timeStyle: {
        color: '#f8f8f8',
        fontWeight: 'bold',
        fontSize: 13,
        paddingHorizontal: 5
    },
    detailContainerStyle: {
        backgroundColor: '#f8f8f8',
        borderRadius: 20,
        width: 205,
        padding: 15,
        marginTop: 20,
        marginVertical: 20
    },
    titleStyle: {
        fontSize: 20,
        color: '#3a3b40'
    },

    //Upper screen elements:
    upperPartContainer:
    {
        flexDirection: 'row'
    },
    upperRightSectionContainer:
    {
        backgroundColor: '#f8f8f8',
        borderWidth: 1, borderColor: '#3a3b40',
        width: Dimensions.get('window').width / 2,
        paddingTop: 5, paddingLeft: 10,
        minHeight: 70, justifyContent: 'center'
    },
    customerDetailsContainer:
    {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    upperLeftSectionContainer:
    {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
        backgroundColor: '#f8f8f8', padding: 15,
        borderWidth: 1, borderColor: '#3a3b40',
        width: Dimensions.get('window').width / 2, paddingRight: 25,
        minHeight: 70
    },

    //General:
    boldText: {
        fontWeight: 'bold',
        fontSize: 20,
        paddingRight: 5
    },
    phoneText:
    {
        fontWeight: 'bold',
        fontSize: 20,
        paddingRight: 5
    },
    adressTextStyle:
    {
        paddingRight: 5
    },

    //Icons:
    phoneIcon: {
        backgroundColor: "#e95344",
        borderRadius: 20,
        width: 30,
        height: 30,
        padding: 6,
        marginLeft: 6
    },

    datePlus: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#3a3b40'
    },


    //Spinner:
    spinnerTextStyle:
    {
        color: 'white',
        fontSize: 26,
        fontWeight: 'bold'
    },

    //Alert:
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
    }
});