//Outer Imports:
import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Switch } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

//Inner Imports:
import Header from '../Components/Header';


export default function AddOccurence(props) {

    //Types of events:
    //      1. Occurence of type תזכורת
    //      2. Occurence of type אירוע -
    //          2.1 אירוע עם לקוח = includes the customer's details
    //          2.2 אירוע של מפיץ = doesn't include anyone but the user


    // User Details:
    const [userPersonalCode, setUserPersonalCode] = useState('');
    const [userType, setUserType] = useState('');

    //Determine the Occurrence:
    const [occurenceType, setOccurenceType] = useState('אירוע');


    //If Occurence is of type אירוע :
    const [isWithCustomer, setIsWithCustomer] = useState(false);


    //___________Details about the Occurrences___________//

    //  Date:
    const [oDate_Year, setoDate_Year] = useState(null);
    const [oDate_Month, setoDate_Month] = useState(null);
    const [oDate_Day, setoDate_Day] = useState(null);


    //  Hour:
    const [oStartHour_Hour, setoStartHour_Hour] = useState('00');
    const [oStartHour_Minutes, setoStartHour_Minutes] = useState('00');
    const [oEndHour_Hour, setoEndHour_Hour] = useState('00');
    const [oEndHour_Minutes, setoEndHour_Minutes] = useState('00');


    //  Location:
    const [oLocation, setoLocation] = useState('');


    //  Customer:
    const [customerID, setCustomerID] = useState('');
    const [customerSwitchValue, setCustomerSwitchValue] = useState(false);


    //____Details for both תזכורת and אירוע ____//

    const [oSubject, setoSubject] = useState('');
    const [oContent, setoContent] = useState('');



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
    const [spinner, setSpinner] = useState(false);





    useEffect(() => {

        //prepare the numbers for the years-drop-down-list:
        let endyear = new Date().getFullYear() + 5;
        let startyear = new Date().getFullYear();

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

            // Reset all fields:
            setIsWithCustomer(false);
            setoDate_Year(null);
            setoDate_Month(null);
            setoDate_Day(null);
            setoStartHour_Hour('00');
            setoStartHour_Minutes('00');
            setoEndHour_Hour('00');
            setoEndHour_Minutes('00');
            setoSubject('');
            setoContent('');
            setoLocation('');
            setCustomerID('');

            fetchUserPersonalCode();
        });


        // Return the function to unsubscribe from the event so it gets removed on unmount
        return checkFocus;

    }, []);



    // Toggle between creating a new תזכורת and creating a new אירוע:
    const changeOccurenceType = () => {

        occurenceType == 'אירוע' ?
            setOccurenceType('תזכורת')
            :
            setOccurenceType('אירוע')
    }



    // Turn on / off the switch relating the occurrence to a customer:
    const toggleCustomerSwitch = async (value) => {

        if (value) { // user wants to add a customer

            setoSubject('');
            setCustomerSwitchValue(value);
            setIsWithCustomer(true);

            fetchAllCustomers();
            fetchAllInteractionsSubjects();
        }
        else { // user doesn't want to add a customer

            setCustomerID('');
            setCustomerSwitchValue(value);
            setIsWithCustomer(false);
        }
    };



    // Get the user's ID from the AS:
    const fetchUserPersonalCode = async () => {

        //Get the user's Personal Code from the AS:
        try {

            const jsonValue = await AsyncStorage.getItem('userDetails')

            if (jsonValue != null) {

                let user = JSON.parse(jsonValue);

                if (user != null) {

                    setUserPersonalCode(user.d_PersonalCode); // save his personal code
                    setUserType(user.d_Status); // save his status
                }
            }
            else {

                setAlertMessage("לא נמצא מידע אודות המשתמש באחסון המקומי");
                setAlertTitle("שגיאה");
                setShowAlert(true);
            }
        } catch {

            setAlertMessage("התרחשה שגיאה בשליפת מידע אודות המשתמש מהאחסון המקומי");
            setAlertTitle("שגיאה");
            setShowAlert(true);
        }
    }



    // Get the names and IDs of the relevant customers from the DB:
    const fetchAllCustomers = async () => {

        if (userPersonalCode != '') {

            let apiUrl = '';
            userType != 'מנהל' ?
                apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/mycustomers/${userPersonalCode}`
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
                            null;
                })
                .then(
                    (result) => {

                        if (result != null && result != 404) {

                            let ddList = [];
                            result.forEach(cust => {

                                ddList.push({ value: `${cust.c_PersonalCode}`, label: `${cust.c_FirstName} ${cust.c_LastName} (${cust.c_PhoneNumber})` });
                            });

                            setddListCustomers(ddList);
                        }
                        else if (result == 404) {

                            setAlertMessage('לא נמצאו לקוחות');
                            setAlertTitle('אופס!');
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

                            if ([1, 4, 5].includes(interaction.toi_ID)) { // we want only interactions that are: אימון אישי / פגישת הדרכה / שיחת היכרות

                                ddList.push({ value: `${interaction.toi_ID}`, label: `${interaction.toi_TypeName}` });
                            }
                        });
                        setddListSubjects(ddList);
                    }
                    else if (result == 404) {

                        setAlertMessage('לא נמצאו סוגי אינטראקציות במסד הנתונים');
                        setAlertTitle('אופס!');
                        setShowAlert(true);
                    }
                    else if (result != 500) {

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



    // Check the user's inputs before sending them to the DB:
    const checkInputs = async () => {

        // Check that the mandatory fields are filled: (date, subject, content)
        let mandatoryFieldsOK = false;

        // -- Check if the date inserted actually exists on the calender -- //
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


        if (oDate_Day == null || oDate_Month == null || oDate_Year == null) {

            setAlertTitle("שגיאה");
            setAlertMessage("יש להזין תאריך מלא");
            setShowAlert(true);
        }
        else {

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

                        if (oSubject.length < 3) {

                            setAlertTitle("שגיאה");
                            setAlertMessage("על הנושא להיות באורך של 3 תווים לפחות");
                            setShowAlert(true);
                        }
                        else {

                            if (oContent == '' && occurenceType == 'אירוע') { // in a reminder the content isn't mandatory

                                setAlertTitle("שגיאה");
                                setAlertMessage("נא להזין תיאור");
                                setShowAlert(true);
                            }
                            else {

                                mandatoryFieldsOK = true;
                            }
                        }
                    }
                }
            }
        }

        if (mandatoryFieldsOK) {

            let eventMandatoryFieldsOK = true;

            // Check the following fields that are MANDATORY if the occurrence is an אירוע: (start time, end time)
            if (occurenceType == "אירוע") {

                if (oStartHour_Hour.length != 2 || oStartHour_Minutes.length != 2 || oEndHour_Hour.length != 2 || oEndHour_Minutes.length != 2) {

                    setAlertTitle("שגיאה");
                    setAlertMessage("יש להזין שעות בפורמט מלא");
                    setShowAlert(true);
                    eventMandatoryFieldsOK = false;
                }
                else if (parseInt(oStartHour_Hour) >= 24 || parseInt(oStartHour_Hour) < 0 || parseInt(oStartHour_Minutes) > 59 || parseInt(oStartHour_Minutes) < 0) {

                    setAlertTitle("שגיאה");
                    setAlertMessage("שעת ההתחלה שהוזנה אינה תקינה");
                    setShowAlert(true);
                    eventMandatoryFieldsOK = false;
                }
                else {

                    if (parseInt(oEndHour_Hour) >= 24 || parseInt(oEndHour_Hour) < 0 || parseInt(oEndHour_Minutes) > 59 || parseInt(oEndHour_Minutes) < 0) {

                        setAlertTitle("שגיאה");
                        setAlertMessage("שעת הסיום שהוזנה אינה תקינה");
                        setShowAlert(true);
                        eventMandatoryFieldsOK = false;
                    }
                    else {

                        if (parseInt(oEndHour_Hour) < parseInt(oStartHour_Hour)) {

                            setAlertTitle("שגיאה");
                            setAlertMessage("על שעת הסיום להיות לאחר שעת ההתחלה");
                            setShowAlert(true);
                            eventMandatoryFieldsOK = false;
                        }
                        else {
                            if ((parseInt(oEndHour_Hour) == parseInt(oStartHour_Hour) && parseInt(oEndHour_Minutes) <= parseInt(oStartHour_Minutes))) {

                                setAlertTitle("שגיאה");
                                setAlertMessage("על שעת הסיום להיות לאחר שעת ההתחלה");
                                setShowAlert(true);
                                eventMandatoryFieldsOK = false;
                            }
                            else {

                                let nowHour = new Date().getHours();
                                let nowMinutes = new Date().getMinutes();

                                if (nowHour > parseInt(oStartHour_Hour)) {

                                    setAlertTitle("שגיאה");
                                    setAlertMessage("על שעת ההתחלה להיות גדולה מהשעה הנוכחית");
                                    setShowAlert(true);
                                    eventMandatoryFieldsOK = false;
                                }
                                else {

                                    if (nowHour == parseInt(oStartHour_Hour) && nowMinutes > parseInt(oStartHour_Minutes)) {

                                        setAlertTitle("שגיאה");
                                        setAlertMessage("על שעת ההתחלה להיות גדולה מהשעה הנוכחית");
                                        setShowAlert(true);
                                        eventMandatoryFieldsOK = false;
                                    }
                                }
                            }
                        }
                    }
                }
            }


            let eventWithCustomerFieldsOK = true;
            // Check the following fields with the occurence is an אירוע and it involves a customer: (customer ID)
            if (occurenceType == "אירוע" && isWithCustomer) {

                if (customerID == '' || customerID == null) {

                    eventWithCustomerFieldsOK = false;

                    setAlertTitle("שגיאה");
                    setAlertMessage("יש לבחור לקוח");
                    setShowAlert(true);
                    eventMandatoryFieldsOK = false;
                }
            }


            // If all checks came out ok then we can procceed:
            if (eventMandatoryFieldsOK && eventWithCustomerFieldsOK) {

                addOccurenceToDB();
            }
        }
    }



    //Send the updated occurrence to the DB:
    const addOccurenceToDB = async () => {

        setSpinner(true);

        // If we got the ID we can procceed:
        if (userPersonalCode != -1) {

            let apiUrl = '';

            // Prepare the date in the right format:
            let date = `${oDate_Year}-${oDate_Month}-${oDate_Day}`;

            let newOcc = {};

            if (occurenceType == "תזכורת") {

                apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/occurrence/newreminder/${userPersonalCode}/`;

                newOcc = {
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

                    apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/occurrence/neweventwithcustomer/${userPersonalCode}/`;

                    newOcc = {
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
                else // occurence is of the user solo
                {
                    apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/occurrence/neweventsolo/${userPersonalCode}/`;

                    newOcc = {
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

            // Send the data to be added to the DB:
            fetch(apiUrl,
                {
                    method: 'POST',
                    body: JSON.stringify(newOcc),
                    headers: new Headers({
                        'Content-Type': 'application/json; charset=UTF-8',
                        'Accept': 'application/json; chartset=UTF-8',
                    })
                })
                .then(res => {

                    return res.status == 200 ?
                        res.json()
                        :
                        res.status == 500 ?
                            500
                            :
                            res.status == 409 ?
                                409
                                :
                                null;
                })
                .then(
                    (result) => {

                        if (result != null && result != 500 && result != 409) {

                            setSpinner(false); // Stop loading animation as the data is ready to be displayed
                            setAlertMessage('פרטי ההתרחשות נשמרו בהצלחה במסד הנתונים');
                            setAlertTitle('פעולה בוצעה בהצלחה');
                            setShowAlert(true);

                            var timeout = setTimeout(() => { props.navigation.navigate('CalendarPage') }, 1500);
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
        else {

            setSpinner(false);
            setAlertMessage('התרחשה תקלה בזיהוי המשתמש ועל כן לא בוצעה שמירה למסד הנתונים');
            setAlertTitle('שגיאה');
            setShowAlert(true);
        }
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


                    {/* HEADING */}
                    <Text style={styles.mainHeading}> הוספת התרחשות </Text>



                    {/* RADIO BUTTONS */}
                    <View style={styles.radioButtonsContainer}>

                        <View style={styles.radioButtonContainer} onPress={() => setValue('second')}>

                            <TouchableOpacity onPress={() => changeOccurenceType()}
                                style={styles.radioButtonSecondaryContainer}
                            >
                                {
                                    occurenceType == 'אירוע' ?
                                        <View style={styles.radioButtonInnerCircle} />
                                        :
                                        null
                                }
                            </TouchableOpacity>

                            <Text style={styles.radioButtonOptionText}>אירוע</Text>

                        </View>

                        <View style={styles.radioButtonContainer} onPress={() => setValue('first')}>

                            <TouchableOpacity onPress={() => changeOccurenceType()}
                                style={styles.radioButtonSecondaryContainer}
                            >
                                {
                                    occurenceType == 'תזכורת' ?
                                        <View style={styles.radioButtonInnerCircle} />
                                        :
                                        null
                                }
                            </TouchableOpacity>

                            <Text style={styles.radioButtonOptionText}>תזכורת</Text>

                        </View>

                    </View>


                    {/* DATE */}
                    <Text style={styles.fieldText}>תאריך:</Text>
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



                    {/* HOURS */}
                    {
                        occurenceType == 'תזכורת' ?
                            <></>
                            :
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
                                    <Text style={styles.endHourText}>סיום:</Text>
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
                    }


                    {/* SUBJECT */}
                    {
                        occurenceType == 'אירוע' && isWithCustomer ?
                            <View style={{ marginTop: 13 }}>
                                <Text style={styles.fieldText}>נושא:</Text>
                                <DropDownPicker

                                    placeholder="הקלד.."
                                    items={ddListSubjects}
                                    containerStyle={styles.ddListContainer}
                                    style={styles.ddGeneralStyle}
                                    itemStyle={{ justifyContent: 'flex-start' }}
                                    style={styles.ddListGeneralStyle}
                                    dropDownStyle={styles.ddListDropdownStyle}
                                    onChangeItem={item => { setoSubject(item.label) }}
                                />
                            </View>
                            :
                            <>
                                <Text style={styles.fieldText}>נושא:</Text>
                                <View>
                                    <TextInput
                                        editable={true} style={styles.editableSubjectText} defaultValue={oSubject} onChangeText={(e) => setoSubject(e)}
                                    ></TextInput>
                                </View>
                            </>
                    }



                    {/* ADRESS */}
                    {
                        occurenceType == 'תזכורת' ?
                            <></>
                            :
                            <View >
                                <Text style={styles.fieldText}>כתובת:</Text>
                                <TextInput
                                    defaultValue={oLocation} editable={true}
                                    style={styles.editableDescription} onChangeText={(e) => setoLocation(e)}
                                >
                                </TextInput>
                            </View>
                    }



                    {/* CONTENT / DESCRIPTION */}
                    {
                        occurenceType == 'תזכורת' ?

                            <View style={{ marginTop: 20 }}>
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
                                <Text style={styles.fieldText}>תיאור:</Text>
                                <TextInput
                                    editable={true}
                                    style={styles.editableDescription}
                                    defaultValue={oContent}
                                    onChangeText={(e) => setoContent(e)}
                                ></TextInput>
                            </View>
                    }


                    {/* IF CUSTOMER IS INVOLVED */}
                    {
                        occurenceType == 'אירוע' && isWithCustomer ?
                            <View style={{ marginTop: 13 }}>
                                <Text style={styles.fieldText}>עבור לקוח:</Text>
                                <DropDownPicker

                                    //Searchable dropdown list:
                                    searchableStyle={styles.searchableDDListStyle}
                                    searchablePlaceholderTextColor="silver"
                                    searchable={true}
                                    searchablePlaceholder="הקלד לחיפוש.."
                                    searchableError={() => <Text>לא נמצאו תוצאות</Text>}

                                    placeholder="הקלד.."
                                    //defaultValue={customerID}
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
                            <></>
                    }

                    {/* TOGGLE BUTTON */}
                    {
                        occurenceType == 'אירוע' ?
                            <View style={{ marginVertical: 15 }}>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>

                                    <Text>האם לקשר לקוח להתרחשות?</Text>

                                    <Switch
                                        onValueChange={toggleCustomerSwitch}
                                        value={customerSwitchValue}
                                    />
                                </View>
                            </View>
                            :
                            <></>
                    }

                    {/* BUTTONS */}
                    <TouchableOpacity
                        onPress={checkInputs}
                        style={styles.saveButton}>
                        <Text style={styles.saveButtonText}>
                            שמור
                        </Text>
                    </TouchableOpacity>

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
        flex: 1,
    },
    hourContainer: {
        width: Dimensions.get('window').width * 0.4,
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between'
    },
    radioButtonsContainer:
    {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginVertical: 10
    },
    radioButtonContainer:
    {
        flexDirection: 'row',
        alignItems: 'center'
    },
    radioButtonSecondaryContainer:
    {
        height: 20,
        width: 20,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#3a3b40',
        alignItems: 'center',
        justifyContent: 'center',
    },

    //Radio Buttons:
    radioButtonInnerCircle:
    {
        height: 9,
        width: 9,
        borderRadius: 6,
        backgroundColor: '#3a3b40',
    },
    radioButtonOptionText:
    {
        fontSize: 16,
        marginHorizontal: 7
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
        flex: 1,
    },
    hourText:
    {
        fontWeight: 'bold',
        flex: 1,
        alignSelf: 'center',
    },
    endHourText:
    {
        marginLeft: 17,
        fontWeight: 'bold',
        flex: 1,
        alignSelf: 'center',
    },

    //Spinner:
    spinnerTextStyle:
    {
        color: 'white',
        fontSize: 26,
        fontWeight: 'bold'
    },


    //Text Inputs:
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
    multilineInput: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginVertical: 15,
        width: Dimensions.get('window').width * 0.9,
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
        marginTop: 30,
        color: 'black'
    },
    editableDescription:
    {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 15,
        minWidth: 190,
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


    //Dropdown Lists:
    dropDownStyle: {
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
        backgroundColor: '#f8f8f8', borderColor: '#3a3b40',
        height: 60
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
    ddListDropdownStyle:
    {
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
        backgroundColor: '#f8f8f8', borderColor: '#3a3b40',
        height: 100
    },
    ddListContainer: // the whole dropdownlist circle
    {
        height: 50,
        width: Dimensions.get('window').width * 0.9,
        flex: 1,
        marginVertical: 10,
    },
    searchableDDListStyle:
    {
        backgroundColor: '#fafafa',
        borderColor: 'lightgrey',
        textAlign: 'right',
        marginBottom: 7, // paddingVertical: 10,
        paddingHorizontal: 20,
        height: 30,
        borderColor: '#3a3b40',
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