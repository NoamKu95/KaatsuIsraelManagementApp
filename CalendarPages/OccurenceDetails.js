//Outer Imports:
import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as Linking from 'expo-linking';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

//Inner Imports:
import Header from '../Components/Header';

//Icons:
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';




export default function OccurenceDetails(props) {

    //Types of events:
    //      1. Occurence of type תזכורת
    //      2. Occurence of type אירוע -
    //          2.1 אירוע עם לקוח = includes the customer's details
    //          2.2 אירוע של מפיץ = doesn't include a customer


    //Determine the Occurrence:
    const [occurenceID, setOccurenceID] = useState(props.route.params.thisEvent.occurenceID);
    const [occurenceType, setOccurenceType] = useState(props.route.params.thisEvent.occurenceType); //אירוע או תזכורת

    //If Occurence is of type אירוע :
    const [isWithCustomer, setIsWithCustomer] = useState(props.route.params.thisEvent.isCOcc);    // event related to a customer
    const [isDistOcc, setIsDistOcc] = useState(props.route.params.thisEvent.isDOcc); // event isn't related to a customer



    //______Details about the Occurrences______//
    //  Date: 
    const [oDate, setoDate] = useState('');
    const [oDate_Year, setoDate_Year] = useState(null);
    const [oDate_Month, setoDate_Month] = useState(null);
    const [oDate_Day, setoDate_Day] = useState(null);

    //  Hour:
    const [oStartHour, setoStartHour] = useState(null);
    const [oEndHour, setoEndHour] = useState(null);
    const [oStartHour_Hour, setoStartHour_Hour] = useState('00');
    const [oStartHour_Minutes, setoStartHour_Minutes] = useState('00');
    const [oEndHour_Hour, setoEndHour_Hour] = useState('00');
    const [oEndHour_Minutes, setoEndHour_Minutes] = useState('00');

    //  Location:
    const [oLocation, setoLocation] = useState('');
    const [oLocationEncoded, setoLocationEncoded] = useState(null);


    //  Mandatory fields:
    const [oSubject, setoSubject] = useState('');
    const [oContent, setoContent] = useState('');


    //  Customer:
    const [customerID, setCustomerID] = useState(props.route.params.thisEvent.customerID);
    const [customerFullName, setCustomerFullName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');


    //Is the page on edit mode? :
    const [isEditable, setIsEditable] = useState(false);


    //Dropdown Lists:
    const [ddListYears, setddListYears] = useState([]);
    const [ddListMonths, setddListMonths] = useState([]);
    const [ddListDays, setddListDays] = useState([]);
    const [ddListCustomers, setddListCustomers] = useState([]);
    const [ddListSubjects, setddListSubjects] = useState([]);

    //Alerts:
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');

    //Loading animation:
    const [spinner, setSpinner] = useState(true);



    useEffect(() => {

        //prepare the numbers for the years-drop-down-list:
        let endyear = new Date().getFullYear() + 5;
        let startyear = new Date().getFullYear() - 5;

        let ddListY = [];
        for (let i = startyear; i <= endyear; i++) {
            ddListY.push({ label: `${i}`, value: `${i}` });
        }
        setddListYears(ddListY);

        //-------------------------------------------------

        //prepare the numbers for the month-drop-down-list:
        let ddListM = [];
        for (let i = 1; i <= 12; i++) {
            ddListM.push({ label: `${i}`, value: `${i}` });
        }
        setddListMonths(ddListM);

        //-------------------------------------------------

        //prepare the numbers for the days-drop-down-list:
        let ddListD = [];
        for (let i = 1; i <= 31; i++) {
            ddListD.push({ label: `${i}`, value: `${i}` });
        }
        setddListDays(ddListD);


        const checkFocus = props.navigation.addListener('focus', () => {

            fetchAllCustomers();
            fetchOccurenceDetails();
            fetchAllInteractionsSubjects();
        });

        return checkFocus;

    }, []);



    //Get all the details about the specific occurence we are looking at:
    const fetchOccurenceDetails = async () => {

        const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/getoccurrence/${occurenceID}/${isDistOcc}`;
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

                        //Details all occurences have:
                        setOccurenceType(result.o_Type);
                        setoSubject(result.o_Subject);
                        setoContent(result.o_Description);

                        //Prepare Date Format:
                        let dateArr = result.o_Date.split("T")[0].split("-");
                        setoDate(`${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`);

                        //Dates for the dd list:
                        let month = dateArr[1];
                        let day = dateArr[2];
                        if (month.substring(0, 1)[0] == "0") {
                            month = (month.substring(0, 2)[1]).toString();
                        }
                        if (day.substring(0, 1)[0] == "0") {
                            day = (day.substring(0, 2)[1]).toString();
                        }
                        setoDate_Year(dateArr[0]);
                        setoDate_Month(month);
                        setoDate_Day(day);


                        if (result.o_Type == 'אירוע') {


                            //Get the location:
                            if (result.o_Location != null) {
                                setoLocation(result.o_Location);
                                let encoded = encodeURI(result.o_Location);
                                setoLocationEncoded(encoded);
                            }

                            //Prepare start & end hours:
                            setoStartHour(result.o_StartTime.split("T")[1].substring(0, 5));
                            setoStartHour_Hour(result.o_StartTime.split("T")[1].substring(0, 2));
                            setoStartHour_Minutes(result.o_StartTime.split("T")[1].substring(3, 5));

                            setoEndHour(result.o_EndTime.split("T")[1].substring(0, 5));
                            setoEndHour_Hour(result.o_EndTime.split("T")[1].substring(0, 2));
                            setoEndHour_Minutes(result.o_EndTime.split("T")[1].substring(3, 5));


                            //If the event is related to a customer
                            if (result.o_CustomerFullName != null) {

                                setIsWithCustomer(true);
                                setCustomerFullName(result.o_CustomerFullName);
                                setCustomerID(`${result.o_Customer}`);
                                setCustomerPhone(result.o_CustomerPhone);
                            }
                        }

                        setSpinner(false); // Stop loading animation as the data is ready to be displayed
                    }
                    else if (result == 404) {

                        setSpinner(false);
                        setAlertMessage('לא נמצאה התאמה במסד הנתונים לנתוני האירוע');
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


    // Get the types of interactions that can be a subject to an event with customer:
    const fetchAllInteractionsSubjects = async () => {

        let apiUrl = 'https://proj.ruppin.ac.il/bgroup12/prod/api/typeofinteraction';
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

                        let ddList = [];
                        result.forEach(interaction => {

                            if (![6, 2, 7, 8, 3].includes(interaction.toi_ID)) { // we want only interactions that are NOT: כניסת ליד למערכת / מכירת מוצר / צימוד למפיץ / קבלת מוצר

                                ddList.push({ value: `${interaction.toi_ID}`, label: `${interaction.toi_TypeName}` });
                            }
                        });
                        setddListSubjects(ddList);
                    }
                    else if (result != 404) {

                        setAlertMessage('לא נמצאו סוגי אינטראקציות במסד הנתונים');
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



    const fetchAllCustomers = async () => {

        //Get the user's Personal Code from the AS:
        let userID = 0;
        try {
            const jsonValue = await AsyncStorage.getItem('userDetails')

            if (jsonValue != null) {
                let user = JSON.parse(jsonValue);

                userID = user.d_PersonalCode;

                if (user.d_Status == 'מנהל') { userID = -1; }
            }
        } catch {

            setAlertMessage("התרחשה שגיאה בשליפת מידע אודות המשתמש מהאחסון המקומי");
            setAlertTitle("שגיאה");
            setShowAlert(true);
        }


        if (userID != 0) { // we managed to get the user's id from the AS

            let apiUrl = '';
            userID != -1 ?
                apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/mycustomers/${userID}`
                :
                apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/customers/`;

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

                            let ddList = [];
                            result.forEach(cust => {

                                ddList.push({ value: `${cust.c_PersonalCode}`, label: `${cust.c_FirstName} ${cust.c_LastName} (${cust.c_PhoneNumber})` });
                            });
                            setddListCustomers(ddList);

                        }
                        else if (result == 404) {

                            setAlertMessage('לא נמצאו לקוחות במסד הנתונים');
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
    }



    const checkInputs = async () => {

        // Check that the mandatory fields are filled:
        let mandatoryFieldsOK = false;


        let day = parseInt(oDate_Day); let month = parseInt(oDate_Month); let year = parseInt(oDate_Year);
        let isLegit = true;

        if (day == 31) {

            if ([2, 4, 6, 9, 11].includes(parseInt(month))) {

                isLegit = false;
            }
        }
        else if (month == 2) {

            if (day == 30 || day == 31) {

                isLegit = false;
            }
            else if (day == 29) {

                parseInt(year) % 4 == 0 ? isLegit = true : isLegit = false;
            }
        }


        if (!isLegit) {

            setAlertTitle("שגיאה");
            setAlertMessage("התאריך שהוזן אינו קיים");
            setShowAlert(true);
        }
        else {

            // -- Check if the date inserted is from today forward (no past dates can be inserted to the DB) -- //
            let isFuture = true;
            let todayDay = new Date().getDate(); let todayMonth = new Date().getMonth() + 1; let todayYear = new Date().getFullYear();

            if (year > todayYear) {

                isFuture = true
            }
            else if (month > todayMonth && year >= todayYear) {

                isFuture = true;
            }
            else if (month < todayMonth && year == todayYear) {

                isFuture = false;
            }
            else if (year == todayYear && month == todayMonth) {

                if (day >= todayDay) {

                    isFuture = true;
                }
                else {

                    isFuture = false;
                }
            }
            else {

                isFuture = false;
            }

            if (!isFuture) {

                setAlertTitle("שגיאה");
                setAlertMessage("לא ניתן להזין תאריך הקטן מהתאריך של היום");
                setShowAlert(true);
            }
            else {
                if (oSubject == '') {
                    setAlertTitle("שגיאה");
                    setAlertMessage("נא להזין נושא");
                    setShowAlert(true);
                }
                else {

                    if (oContent == '' && occurenceType == 'אירוע') {
                        setAlertTitle("שגיאה");
                        setAlertMessage("נא להזין תוכן");
                        setShowAlert(true);
                    }
                    else {

                        mandatoryFieldsOK = true;
                    }
                }
            }
        }



        let optionalCheckOK = true;
        // Check the following fields if the occurrence is an אירוע:
        if (occurenceType == "אירוע") {

            if (parseInt(oStartHour_Hour) >= 24 || parseInt(oStartHour_Hour) < 0 || parseInt(oStartHour_Minutes) > 59 || parseInt(oStartHour_Minutes) < 0) {

                setAlertTitle("שגיאה");
                setAlertMessage("שעת ההתחלה שהוזנה אינה תקינה");
                setShowAlert(true);
                optionalCheckOK = false;
            }
            else {

                if (parseInt(oEndHour_Hour) >= 24 || parseInt(oEndHour_Hour) < 0 || parseInt(oEndHour_Minutes) > 59 || parseInt(oEndHour_Minutes) < 0) {

                    setAlertTitle("שגיאה");
                    setAlertMessage("שעת הסיום שהוזנה אינה תקינה");
                    setShowAlert(true);
                    optionalCheckOK = false;
                }
                else {

                    if (parseInt(oEndHour_Hour) < parseInt(oStartHour_Hour)) {

                        setAlertTitle("שגיאה");
                        setAlertMessage("על שעת הסיום להיות לאחר שעת ההתחלה");
                        setShowAlert(true);
                        optionalCheckOK = false;
                    }
                    else {

                        if ((parseInt(oEndHour_Hour) == parseInt(oStartHour_Hour) && parseInt(oEndHour_Minutes) <= parseInt(oStartHour_Minutes))) {

                            setAlertTitle("שגיאה");
                            setAlertMessage("על שעת הסיום להיות לאחר שעת ההתחלה");
                            setShowAlert(true);
                            optionalCheckOK = false;
                        }
                        else {

                            let nowHour = new Date().getHours();
                            let nowMinutes = new Date().getMinutes();

                            if (nowHour > parseInt(oStartHour_Hour)) {

                                setAlertTitle("שגיאה");
                                setAlertMessage("על שעת ההתחלה להיות גדולה מהשעה הנוכחית");
                                setShowAlert(true);
                                optionalCheckOK = false;
                            }
                            else {

                                if (nowHour == parseInt(oStartHour_Hour) && nowMinutes > parseInt(oStartHour_Minutes)) {

                                    setAlertTitle("שגיאה");
                                    setAlertMessage("על שעת ההתחלה להיות גדולה מהשעה הנוכחית");
                                    setShowAlert(true);
                                    optionalCheckOK = false;
                                }
                            }
                        }
                    }
                }
            }
        }

        if (mandatoryFieldsOK && optionalCheckOK) {

            updateOccurenceInDB();
        }
    }


    //Send the updated occurrence to the DB:
    const updateOccurenceInDB = async () => {

        // Prepare the date in the right format:
        let date = `${oDate_Year}-${oDate_Month}-${oDate_Day}`;

        let updatedOcc = {};

        if (occurenceType == "תזכורת") {

            updatedOcc = {
                o_ID: occurenceID,
                o_Date: date,
                o_Subject: oSubject,
                o_Description: oContent,
                o_Type: 'תזכורת',
            }
        }
        else if (occurenceType == "אירוע") {

            let startTime = `${date}T${oStartHour_Hour}:${oStartHour_Minutes}:00`;
            let endTime = `${date}T${oEndHour_Hour}:${oEndHour_Minutes}:00`;

            if (isWithCustomer) { // occurrence involves a customer

                updatedOcc = {
                    o_ID: occurenceID,
                    o_Date: date,
                    o_Subject: oSubject,
                    o_Description: oContent,
                    o_Type: 'אירוע',
                    o_Customer: customerID,
                    o_StartTime: startTime,
                    o_EndTime: endTime,
                    o_Location: oLocation
                }
            }
            else if (isDistOcc) { // occurence is of the user solo

                updatedOcc = {
                    o_ID: occurenceID,
                    o_Date: date,
                    o_Subject: oSubject,
                    o_Description: oContent,
                    o_Type: 'אירוע',
                    o_StartTime: startTime,
                    o_EndTime: endTime,
                    o_Location: oLocation,
                }
            }
        }


        // Send the data to be updated in the DB:
        const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/occurrences/${occurenceID}/${isDistOcc}`;
        fetch(apiUrl,
            {
                method: 'PUT',
                body: JSON.stringify(updatedOcc),
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
                        409
                        :
                        res.status == 500 ?
                            500
                            :
                            null;
            })
            .then(
                (result) => {

                    if (result != null && result != 404 && result != 500) {

                        setAlertMessage('פרטי ההתרחשות עודכנו בהצלחה במסד הנתונים');
                        setAlertTitle('פעולה בוצעה בהצלחה');
                        setShowAlert(true);
                        setIsEditable(false);
                        fetchOccurenceDetails();
                    }
                    else if (result == 404) {

                        setAlertMessage('לא נמצאה התאמה במסד הנתונים לנתוני ההתרחשות');
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


    //Remove the occurence from the DB:
    const deleteOccurence = async () => {

        const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/occurrences/${parseInt(occurenceID)}/${isDistOcc}`;
        await fetch(apiUrl,
            {
                method: 'DELETE',
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

                        setSpinner(false);
                        setAlertMessage(result);
                        setAlertTitle('אישור');
                        setShowAlert(true);

                        var timeout = setTimeout(() => { setShowAlert(false); props.navigation.goBack() }, 1500)
                    }
                    else if (result == 404) {

                        setSpinner(false);
                        setAlertMessage('לא נמצאה התאמה במסד הנתונים לנתוני ההתרחשות');
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

            <ScrollView>

                <View style={styles.mainContainer} >

                    {/* BUTTONS */}
                    {
                        isEditable ?
                            <></>
                            :
                            <View style={styles.iconsContainer}>

                                <TouchableOpacity onPress={() => setIsEditable(!isEditable)} >
                                    <MaterialCommunityIcons name="pencil-circle" size={40} color="#e95344" />
                                </TouchableOpacity>

                            </View>
                    }

                    {/* HEADING */}
                    {
                        isEditable ?
                            <Text style={styles.mainHeading}>  עריכת {occurenceType}  </Text>
                            :
                            <Text style={styles.mainHeading}>  פרטי ה{occurenceType}  </Text>
                    }


                    {/* DATE */}
                    <Text style={styles.fieldText}>תאריך:</Text>
                    {
                        isEditable ?
                            <View style={styles.viewContainer}>
                                <DropDownPicker
                                    items={ddListYears}
                                    placeholder="שנה"
                                    defaultValue={oDate_Year}
                                    containerStyle={styles.yearsContainer}
                                    itemStyle={{ justifyContent: 'flex-start' }}
                                    style={styles.ddYearsStyle}
                                    dropDownStyle={styles.dropDownStyle}
                                    onChangeItem={item => setoDate_Year(item.value)}
                                />

                                <DropDownPicker
                                    items={ddListMonths}
                                    placeholder="חודש"
                                    defaultValue={oDate_Month}
                                    containerStyle={styles.monthsContainer}
                                    itemStyle={{ justifyContent: 'flex-start' }}
                                    style={styles.ddMonthsStyle}
                                    dropDownStyle={styles.dropDownStyle}
                                    onChangeItem={item => setoDate_Month(item.value)}
                                />

                                <DropDownPicker
                                    items={ddListDays}
                                    placeholder="יום"
                                    defaultValue={oDate_Day}
                                    containerStyle={styles.daysContainer}
                                    itemStyle={{ justifyContent: 'flex-start' }}
                                    style={styles.ddDaysStyle}
                                    dropDownStyle={styles.dropDownStyle}
                                    onChangeItem={item => setoDate_Day(item.value)}
                                />
                            </View>
                            :
                            <View >
                                <TextInput editable={false} style={styles.txtInput} placeholder={oDate} />
                            </View>
                    }


                    {/* HOURS */}
                    {
                        occurenceType == 'תזכורת' ?
                            <></>
                            :
                            isEditable ?
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                    <View style={styles.hourContainer}>
                                        <Text style={styles.hourText}>התחלה:</Text>
                                        <TextInput
                                            editable={true} style={styles.clockMinutesStyle} keyboardType='number-pad' maxLength={2}
                                            defaultValue={oStartHour_Minutes} onChangeText={(e) => setoStartHour_Minutes(e)}
                                        ></TextInput>
                                        <TextInput
                                            editable={false} style={styles.clockDotsStyle} defaultValue={":"}
                                        ></TextInput>
                                        <TextInput
                                            editable={true} style={styles.clockHoursStyle} keyboardType='number-pad' maxLength={2}
                                            defaultValue={oStartHour_Hour} onChangeText={(e) => setoStartHour_Hour(e)}
                                        ></TextInput>
                                    </View>

                                    <View style={styles.hourContainer}>
                                        <Text style={styles.hourText}>סיום:</Text>
                                        <TextInput
                                            editable={true} style={styles.clockMinutesStyle} keyboardType='number-pad' maxLength={2}
                                            defaultValue={oEndHour_Minutes} onChangeText={(e) => setoEndHour_Minutes(e)}
                                        ></TextInput>
                                        <TextInput
                                            editable={false} style={styles.clockDotsStyle} defaultValue={":"}
                                        ></TextInput>
                                        <TextInput
                                            editable={true} style={styles.clockHoursStyle} keyboardType='number-pad' maxLength={2}
                                            defaultValue={oEndHour_Hour} onChangeText={(e) => setoEndHour_Hour(e)}
                                        ></TextInput>
                                    </View>
                                </View>
                                :
                                <View style={styles.hoursContainer}>

                                    <View style={styles.hourContainer}>
                                        <Text style={styles.hourText}>התחלה:</Text>
                                        <TextInput
                                            editable={false} style={styles.shortTxtInput}
                                            placeholder={oStartHour}
                                        ></TextInput>
                                    </View>

                                    <View style={styles.hourContainer}>
                                        <Text style={styles.hourText}>סיום:</Text>
                                        <TextInput
                                            editable={false} style={styles.shortTxtInput}
                                            placeholder={oEndHour}
                                        ></TextInput>
                                    </View>
                                </View>
                    }


                    {/* SUBJECT */}
                    <Text style={styles.fieldText}>נושא:</Text>
                    {
                        isWithCustomer ?
                            isEditable ?
                                <DropDownPicker
                                    placeholder={oSubject}
                                    items={ddListSubjects}
                                    containerStyle={styles.ddListContainer}
                                    style={styles.ddGeneralStyle}
                                    itemStyle={{ justifyContent: 'flex-start' }}
                                    style={styles.ddListGeneralStyle}
                                    dropDownStyle={styles.ddListDropdownStyle}
                                    onChangeItem={item => { setoSubject(item.label) }}
                                />
                                :
                                <View>
                                    <TextInput
                                        editable={false} style={styles.oSubjectText} placeholder={oSubject}
                                    ></TextInput>
                                </View>
                            :
                            isEditable ?
                                <View>
                                    <TextInput
                                        editable={true} style={styles.editableSubjectText} defaultValue={oSubject} onChangeText={(e) => setoSubject(e)}
                                    ></TextInput>
                                </View>
                                :
                                <View>
                                    <TextInput
                                        editable={false} style={styles.oSubjectText} placeholder={oSubject}
                                    ></TextInput>
                                </View>
                    }


                    {/* ADRESS */}
                    {
                        occurenceType == 'תזכורת' ?
                            <></>
                            :
                            isEditable ?
                                <View >
                                    <Text style={styles.fieldText}>כתובת:</Text>
                                    <TextInput
                                        defaultValue={oLocation} editable={true}
                                        style={styles.editableDescription} onChangeText={(e) => setoLocation(e)}
                                    >
                                    </TextInput>
                                </View>
                                :
                                <View>
                                    <Text style={styles.fieldText}>כתובת:</Text>

                                    <View style={styles.viewContainer}>
                                        <TextInput
                                            editable={false}
                                            style={styles.textInputWithIcon}
                                            editable={false}
                                            placeholder={oLocation}
                                            multiline={true}
                                            numberOfLines={oLocation.length > 25 ? 2 : 1}
                                            style={oLocation.length > 25 ? styles.adressTextInputLONG : styles.textInputWithIcon}
                                        >
                                        </TextInput>
                                        <Ionicons name="location-sharp" size={30} color="#e95344"
                                            style={oLocation.length > 25 ? styles.mapsIconTwoLinesStyle : styles.mapsIconStyle}
                                            onPress={() => Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${oLocationEncoded}&travelmode=driving&dir_action=navigate`)} />
                                    </View>
                                </View>
                    }


                    {/* CONTENT / DESCRIPTION */}
                    {
                        occurenceType == 'תזכורת' ?

                            isEditable ?
                                <View>
                                    <Text style={styles.fieldText}>תוכן התזכורת:</Text>
                                    <TextInput
                                        defaultValue={oContent}
                                        editable={true} scrollEnabled multiline
                                        numberOfLines={5} maxLength={225}
                                        style={styles.editableMultilineInput}
                                        onChangeText={(e) => setoContent(e)}
                                    >
                                    </TextInput>
                                </View>
                                :
                                <View>
                                    <Text style={styles.fieldText}>תוכן התזכורת:</Text>
                                    <TextInput
                                        placeholder={oContent}
                                        editable={false} scrollEnabled multiline
                                        numberOfLines={5} maxLength={225}
                                        style={styles.multilineInput}
                                    >
                                    </TextInput>
                                </View>
                            :
                            isEditable ?
                                <View>
                                    <Text style={styles.fieldText}>תיאור:</Text>
                                    <TextInput
                                        editable={true}
                                        style={styles.editableDescription}
                                        defaultValue={oContent}
                                        onChangeText={(e) => setoContent(e)}
                                    ></TextInput>
                                </View>
                                :
                                <View>
                                    <Text style={styles.fieldText}>תיאור:</Text>
                                    <TextInput
                                        editable={false} style={styles.txtInput}
                                        placeholder={oContent}
                                    ></TextInput>
                                </View>
                    }


                    {/* THE CUSTOMER INVOLVED */}
                    {
                        occurenceType == 'תזכורת' ?
                            <></>
                            :
                            isWithCustomer ?

                                isEditable ?
                                    <View>
                                        <Text style={styles.fieldText}>עבור לקוח:</Text>
                                        <DropDownPicker

                                            //Searchable dropdown list:
                                            searchableStyle={styles.searchableDDListStyle}
                                            searchablePlaceholderTextColor="silver"
                                            searchable={true}
                                            searchablePlaceholder="הקלד לחיפוש.."
                                            searchableError={() => <Text>לא נמצאו תוצאות</Text>}

                                            placeholder="הקלד.."
                                            defaultValue={customerID}
                                            items={ddListCustomers}
                                            containerStyle={styles.ddListContainer}
                                            style={styles.ddGeneralStyle}
                                            itemStyle={{ justifyContent: 'flex-start' }}
                                            style={styles.ddListGeneralStyle}
                                            dropDownStyle={styles.ddListDropdownStyle}
                                            onChangeItem={item => { setCustomerID(item.value) }}
                                        />
                                    </View>
                                    :
                                    <View>
                                        <Text style={styles.fieldText}>עבור לקוח:</Text>
                                        <View style={styles.viewContainer}>
                                            <TextInput
                                                style={styles.textInputWithIcon}
                                                editable={false} placeholder={`${customerFullName} (${customerPhone})`}
                                            ></TextInput>
                                            <Ionicons name="md-call" size={30} color="#e95344" style={styles.phoneIconStyle}
                                                onPress={() => Linking.openURL(`tel:${customerPhone}`)}
                                            />
                                        </View>
                                    </View>
                                :
                                <></>
                    }


                    {/* BUTTONS */}
                    {
                        isEditable ?
                            <TouchableOpacity
                                onPress={checkInputs}
                                style={styles.saveButton}>
                                <Text style={styles.saveButtonText}>
                                    שמור
                                </Text>
                            </TouchableOpacity>
                            :
                            <View style={styles.iconsContainer}>

                                <TouchableOpacity style={styles.binIcon} onPress={() => deleteOccurence()} >
                                    <Fontisto name="trash" size={20} color="white" style={{ alignSelf: 'center', }} />
                                </TouchableOpacity>

                            </View>
                    }

                </View>

            </ScrollView>

        </>
    );
}



const styles = StyleSheet.create({

    //Containers:
    mainContainer: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        minHeight: Dimensions.get('window').height - 45
    },
    viewContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    hoursContainer:
    {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between'
    },
    hourContainer: {
        width: Dimensions.get('window').width * 0.4,
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    iconsContainer:
    {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 15,
    },


    //General
    mainHeading:
    {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10
    },
    fieldText: {
        fontWeight: 'bold',
        marginBottom: 10
    },
    hourText:
    {
        fontWeight: 'bold',
        flex: 1,
        alignSelf: 'center',
    },


    //Text Inputs:
    txtInput: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 15,
        width: Dimensions.get('window').width * 0.9,
        height: 50,
        backgroundColor: '#dfe0e4',
        borderRadius: 20,
        textAlign: 'right',
        color: 'black',
        marginBottom: 15
    },
    oSubjectText:
    {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 15,
        width: Dimensions.get('window').width * 0.9,
        height: 50,
        backgroundColor: '#dfe0e4',
        borderRadius: 20,
        flex: 1,
        color: 'black',
        fontSize: 15,
    },
    editableSubjectText:
    {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 15,
        width: Dimensions.get('window').width * 0.9,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'black',
        flex: 1,
        color: 'black',
        fontSize: 15
    },
    shortTxtInput:
    {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 15,
        minWidth: 70,
        maxWidth: 100,
        height: 50,
        backgroundColor: '#dfe0e4',
        borderRadius: 20,
        flex: 1,
        textAlign: 'right',
        color: 'black'
    },
    multilineInput: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginVertical: 15,
        minWidth: 200,
        maxWidth: 350,
        height: 230,
        backgroundColor: '#dfe0e4',
        borderRadius: 20,
        flex: 1,
        textAlign: 'right',
        textAlignVertical: 'top',
        minHeight: 100
    },
    editableMultilineInput: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginVertical: 15,
        width: Dimensions.get('window').width * 0.9,
        height: 230,
        backgroundColor: 'white',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'black',
        flex: 1,
        textAlign: 'right',
        textAlignVertical: 'top',
        minHeight: 100
    },
    editableDescription:
    {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 15,
        width: Dimensions.get('window').width * 0.9,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'black',
        flex: 1,
        textAlign: 'right',
        color: 'black'
    },
    textInputWithIcon:
    {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 15,
        minWidth: 142,
        height: 50,
        backgroundColor: '#dfe0e4',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        flex: 1,
        textAlign: 'right',
    },
    adressTextInputLONG:
    {
        paddingVertical: 10,
        paddingHorizontal: 20,
        paddingRight: 25,
        marginVertical: 15,
        width: Dimensions.get('window').width * 0.9,
        height: 65,
        backgroundColor: '#dfe0e4',
        // borderRadius: 20,
        flex: 1,
        textAlign: 'right',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
    },


    //Icons:
    mapsIconStyle: {
        backgroundColor: '#dfe0e4',
        paddingLeft: 15,
        paddingTop: 8,
        borderBottomLeftRadius: 20,
        borderTopLeftRadius: 20,
        height: 50
    },
    mapsIconTwoLinesStyle: {
        backgroundColor: '#dfe0e4',
        paddingLeft: 15,
        paddingTop: 16,
        borderBottomLeftRadius: 20,
        borderTopLeftRadius: 20,
        height: 65
    },
    phoneIconStyle: {
        backgroundColor: '#dfe0e4',
        paddingLeft: 15,
        paddingTop: 8,
        borderBottomLeftRadius: 20,
        borderTopLeftRadius: 20,
        height: 50
    },
    binIcon:
    {
        backgroundColor: '#e95344',
        height: 35,
        width: 35,
        borderRadius: 20,
        marginVertical: 10,
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },


    //Dropdown Lists:
    dropDownStyle: {
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
        backgroundColor: '#f8f8f8', borderColor: '#3a3b40',
        height: 80
    },
    ddListGeneralStyle:
    {
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
        backgroundColor: 'white', borderColor: '#3a3b40',
    },
    ddGeneralStyle: {
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
        backgroundColor: 'white', borderColor: '#3a3b40',
    },
    ddListContainer:
    {
        height: 50,
        width: Dimensions.get('window').width * 0.9,
        flex: 1,
        marginVertical: 10
    },
    ddListDropdownStyle:
    {
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
        backgroundColor: '#f8f8f8', borderColor: '#3a3b40',
        height: 100
    },
    searchableDDListStyle:
    {
        borderColor: '#3a3b40',
        textAlign: 'right',
        marginBottom: 7, // paddingVertical: 10,
        paddingHorizontal: 20,
        height: 30,
    },


    //Birthdate Dropdown Lists:
    yearsContainer: {
        height: 50,
        width: 110,
        flex: 1,
        marginVertical: 10
    },
    monthsContainer: {
        height: 50,
        width: 67,
        flex: 1,
        marginVertical: 10
    },
    daysContainer: {
        height: 50,
        width: 57,
        flex: 1,
        marginVertical: 10
    },
    ddYearsStyle: {
        borderTopLeftRadius: 20, borderTopRightRadius: 0,
        borderBottomLeftRadius: 20, borderBottomRightRadius: 0,
        backgroundColor: 'white', borderColor: '#3a3b40'
    },
    ddMonthsStyle: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        backgroundColor: 'white',
        borderBottomColor: '#3a3b40',
        borderLeftColor: 'white',
        borderRightColor: 'white',
        borderTopColor: '#3a3b40'
    },
    ddDaysStyle: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 20,
        backgroundColor: 'white',
        borderColor: '#3a3b40'
    },


    //Time Inputs:
    clockMinutesStyle:
    {
        paddingVertical: 10,
        marginVertical: 15,
        minWidth: 25,
        maxWidth: 40,
        height: 50,
        backgroundColor: 'white',
        borderLeftColor: 'white',
        borderRightColor: 'black',
        borderTopColor: 'black',
        borderBottomColor: 'black',
        borderWidth: 1,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        flex: 1,
        textAlign: 'center',
        color: 'black'
    },
    clockDotsStyle:
    {
        paddingVertical: 10,
        marginVertical: 15,
        minWidth: 3,
        maxWidth: 5,
        height: 50,
        backgroundColor: 'white',
        borderLeftColor: 'white',
        borderRightColor: 'white',
        borderTopColor: 'black',
        borderBottomColor: 'black',
        borderWidth: 1,
        flex: 1,
        textAlign: 'center',
        color: 'black'
    },
    clockHoursStyle:
    {
        paddingVertical: 10,
        marginVertical: 15,
        minWidth: 25,
        maxWidth: 40,
        height: 50,
        backgroundColor: 'white',
        borderLeftColor: 'black',
        borderRightColor: 'white',
        borderTopColor: 'black',
        borderBottomColor: 'black',
        borderWidth: 1,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        flex: 1,
        textAlign: 'center',
        color: 'black'
    },


    //Save Button:
    saveButton: {
        backgroundColor: '#e95344',
        borderRadius: 50,
        padding: 7,
        width: Dimensions.get('window').width * 0.9,
        height: 45,
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 30,
        marginTop: 20
    },
    saveButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
        alignSelf: 'center',
        fontWeight: 'bold'
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