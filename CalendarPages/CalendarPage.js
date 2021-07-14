//Outer Imports:
import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import { Dimensions } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import { FlatList, SafeAreaView, } from "react-native";
import Timeline from 'react-native-timeline-flatlist'

//Inner Imports:
import Header from '../Components/Header';

//Icons:
import { SimpleLineIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';



import { LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales['he'] = {
    monthNames: ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'],
    monthNamesShort: [`ינ'`, `פב'`, `מרץ`, `אפריל`, `מאי`, `יוני`, `יולי`, `אוג'`, `ספט'`, `אוק'`, `נוב'`, `דצ'`],
    dayNames: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'],
    dayNamesShort: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'],
    today: 'היום'
};
LocaleConfig.defaultLocale = 'he';





export default function CalendarPage(props) {

    // The user reading the calender:
    const [userID, setUserID] = useState('');


    // View Mode:
    const [viewType, setViewType] = useState('חודשי');


    // Date parts:
    const [currentDate, setCurrentDate] = useState(''); // to focus the calender on today
    const [selectedDate, setSelectedDate] = useState('');


    // Events to display:
    const [allMonthEvents, setAllMonthEvents] = useState([]); // array of the distributer's events he has on the focused month
    const [events, setEvents] = useState({}); // a single object that has the following fields: '2021-05-16': { dots: [], marked: true, selectedColor: '#dfe0e4' }, '2021-04-13' : {...}
    const [specificDayEvents, setSpecificDayEvents] = useState([]); // array of the distributer's evens he has on the focused day
    const [eventsOfSpecificDate, setEventsOfSpecificDate] = useState([]); // array of events to display in the timeline of daily-view


    // Reminders to display:
    const [todaysReminders, setTodaysReminders] = useState([]); // reminders to display at the bottom of the daily-view


    //Alerts:
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');






    useEffect(() => {

        const checkFocus = props.navigation.addListener('focus', () => {

            setViewType('חודשי');

            fetchAllData();
        });

        return checkFocus;

    }, []);


    //Get user ID & set selected date on TODAY:
    const fetchAllData = async () => {

        fetchUserPersonalCode(); // find out who is the user and then get his events

        //We always open the calender on today's date:
        let thisDay = `${new Date().getDate()}`.padStart(2, '0');
        let thisMonth = `${new Date().getMonth() + 1}`.padStart(2, '0');
        let thisYear = new Date().getFullYear();
        setCurrentDate(`${thisYear}-${thisMonth}-${thisDay}`);   // התאריך של היום

        //Selected date = today
        setSelectedDate(`${thisYear}-${thisMonth}-${thisDay}`); // התאריך שבחרו
    }


    //Get the user's details from the AS:
    const fetchUserPersonalCode = async () => {

        try {
            const jsonValue = await AsyncStorage.getItem('userDetails')

            if (jsonValue != null) {
                let user = JSON.parse(jsonValue);

                setUserID(user.d_PersonalCode);

                fetchMonthlyCalender(user.d_PersonalCode); // get the events that are relevant to this particular user
            }
            else {

                setAlertMessage('לא נמצא מידע אודות המשתמש באחסון המקומי');
                setAlertTitle('שגיאה');
                setShowAlert(true);
            }
        } catch {

            setAlertMessage('התרחשה שגיאה בשליפת מידע אודות המשתמש מהאחסון המקומי');
            setAlertTitle('שגיאה');
            setShowAlert(true);
        }
    }



    // -----------------------MONTHLY CALENDAR FUNCTIONS-------------------------------------------- //


    const fetchMonthlyCalender = async (userID) => {

        let thisDay = `${new Date().getDate()}`.padStart(2, '0');
        let thisMonth = `${new Date().getMonth() + 1}`.padStart(2, '0');
        let thisYear = new Date().getFullYear();

        getMyMonthlyCalenderEvents(userID, thisDay, thisMonth, thisYear);
    }



    // Fetch the occurences of the displayed month (which is passed to the function) and put DOTS in the calendar:
    const getMyMonthlyCalenderEvents = async (id, day, month, year) => {

        let apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/myoccurrences/${id}/${month}/${year}`;
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
                            null //Check if what we get back from the server is OK 
            })
            .then(
                (result) => {

                    if (result != null && result != 404 && result != 500) {

                        setAllMonthEvents(result); // save all month events so we can display relevant events in the list under the calendar

                        let datesArray = {};

                        //The object 'datesArray' represents the occurrences the user has in the selected month.
                        //Each property of the object is a date (e.g. '2021-05-16')
                        //For each property a small dot will appear in the calendar to let the user know he has something in this date


                        //Start marking dates with occurrences with dots:
                        result.forEach(element => { // go over all of the occurrences that we got from the db

                            // check if 'datesArray' already has the property of a certain date
                            datesArray.hasOwnProperty(`${element.o_Date.split("T")[0]}`) ?
                                '' // date already exists as a property
                                :
                                datesArray[`${element.o_Date.split("T")[0]}`] = { marked: true }; // date didn't exist as property so we added it
                        });

                        setEvents(datesArray);

                        let dateToMark = {
                            "dateString": `${year}-${month}-${day}`,
                            "day": parseInt(day),
                            "month": parseInt(month),
                            "year": parseInt(year),
                        }
                        handleSelectedDate(result, dateToMark);
                    }
                    else if (result == 404) {

                        // there are no events in the chosen month
                        // no need to alert the user as this is isn't an abnormality
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
            )
    }


    // When pressing on a date in the calender - show the events he has on the chosen day:
    const handleSelectedDate = (allEvents, dateToMark) => {

        //How does the object look? :
        //dateToMark = {
        //   "dateString": "2021-06-10",
        //   "day": 10,
        //   "month": 6,
        //   "timestamp": 1623283200000,
        //   "year": 2021,
        // }


        // Save the new chosen date as a state with the right format:
        setSelectedDate(`${dateToMark.day}-${dateToMark.month}-${dateToMark.year}`);

        //From all the events of the month - find those who occure in the chosen date:
        let thisDayEvents = []; // will hold the events
        allEvents.forEach(event => {

            if (event.o_Date.substring(0, 10) == dateToMark.dateString) { // if the date of the even is the same day as the user pressed

                thisDayEvents.push(event);  // add to chosen-date-events-list
            }
        });


        // If there are no events on the date he chose, let the use know -
        if (thisDayEvents.length == 0) {

            thisDayEvents.push({ o_Type: 'אין', o_Subject: 'לא נקבעו התרחשויות' })
        }

        setSpecificDayEvents(thisDayEvents);
    }


    // Determine how to display each item in the FlatList:
    const renderItem = ({ item }) => {

        let textToDisplay = '';
        if (item.o_Type == 'תזכורת') {

            let e = {
                occurenceType: 'תזכורת',
                isDOcc: false,
                occurenceID: item.o_ID,
                isCOcc: false,
                customerID: null
            }

            textToDisplay =
                <Text onPress={() => props.navigation.navigate('OccurenceDetails', { thisEvent: e })} style={{ fontWeight: 'bold', fontSize: 16, paddingHorizontal: 10 }}>
                    תזכורת: <Text style={{ fontWeight: 'normal', flex: 1 }}> {item.o_Subject}</Text>
                </Text>
        }
        else if (item.o_Type == 'אירוע') {

            if (item.o_Customer != null) { // אירוע שקשור ללקוח

                let e = {
                    occurenceType: 'אירוע',
                    isDOcc: false,
                    occurenceID: item.o_ID,
                    isCOcc: true,
                    customerID: `${item.o_Customer}`
                }

                textToDisplay =
                    <Text onPress={() => props.navigation.navigate('OccurenceDetails', { thisEvent: e })} style={{ fontWeight: 'bold', fontSize: 16, paddingHorizontal: 10 }}> {item.o_StartTime.substring(11, 16)}
                        <Text style={{ fontWeight: 'normal', flex: 1 }}> {item.o_Subject}</Text>
                        <Text style={{ fontWeight: 'normal', flex: 1 }}>{`\n\t\t\t\t\t\t\tעם: ${item.o_CustomerFullName}`}</Text>
                    </Text>
            }
            else { // אירוע שלא קשוח ללקוח אלא למשתמש עצמו בלבד

                let e = {
                    occurenceType: 'אירוע',
                    isDOcc: true,
                    occurenceID: item.o_ID,
                    isCOcc: false,
                    customerID: null
                }

                textToDisplay =
                    <Text onPress={() => props.navigation.navigate('OccurenceDetails', { thisEvent: e })} style={{ fontWeight: 'bold', fontSize: 16, paddingHorizontal: 10 }}>
                        <Text> {item.o_StartTime.substring(11, 16)} </Text>
                        <Text style={{ fontWeight: 'normal', flex: 1 }}> {item.o_Subject}</Text>
                    </Text>
            }
        }
        else { // אם אין אירועים ואין תזכורות subject = אין

            textToDisplay =
                <Text style={{ fontSize: 16, fontStyle: 'normal', color: '#dfe0e4', paddingHorizontal: 10 }}> {item.o_Subject}</Text>
        }


        return (

            <View
                style={{ minHeight: 50, borderWidth: 1, borderColor: 'white', borderBottomColor: '#dfe0e4', justifyContent: 'center', flex: 1, borderStyle: 'dashed' }}
            >
                {textToDisplay}
            </View>
        );
    };




    // -----------------------DAILY CALENDAR FUNCTIONS-------------------------------------------- //


    // Fetch the occurences of the displayed date (inside daily view) :
    const getMyDailyCalenderEvents = async () => {

        //We always open the daily calender on today's date:
        let thisDay = `${new Date().getDate()}`.padStart(2, '0');
        let thisMonth = `${new Date().getMonth() + 1}`.padStart(2, '0');
        let thisYear = new Date().getFullYear();
        setCurrentDate(`${thisYear}-${thisMonth}-${thisDay}`);   // התאריך של היום

        //Selected date = today
        setSelectedDate(`${parseInt(thisDay)}-${parseInt(thisMonth)}-${thisYear}`); // התאריך שבחרו


        let apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/myoccurrencesdaily/${userID}/${thisDay}/${thisMonth}/${thisYear}`;
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
                    res.status == 500 ?
                        500
                        :
                        null;
            })
            .then(
                (result) => {

                    if (result != null && result != 500) {

                        let eventsArr = []; // temp to hold the time-line events objects
                        let remindersArr = []; // temp to hold the flatlist's items

                        result.forEach(event => {

                            if (event.o_Type == 'אירוע') {

                                // Build the content of the event -
                                let content = '';
                                event.o_Description == null ? content = '' : content += event.o_Description;
                                event.o_Location == '' ? content += '' : content += `\nמיקום: ${event.o_Location}`;
                                event.o_Customer == null ? content += '' : content += `\nעם לקוח: ${event.o_CustomerFullName}`;

                                let custID = '';
                                event.o_Customer != null ? custID = event.o_Customer : custID = null;

                                let isDistOcc = false;
                                event.o_Customer == null && event.o_Type == 'אירוע' ? isDistOcc = true : '';

                                let isCustOcc = false;
                                event.o_Customer != null && event.o_Type == 'אירוע' ? isCustOcc = true : '';

                                //Combine them together into the object:
                                eventsArr.push({ time: `${event.o_StartTime.substring(11, 16)}`, title: `${event.o_Subject}`, description: `${content}`, id: event.o_ID, isDOcc: isDistOcc, customerID: custID, isCOcc: isCustOcc })
                            }
                            else { // o_Type == 'תזכורת'

                                remindersArr.push(event);
                            }
                        });

                        setEventsOfSpecificDate(eventsArr);
                        remindersArr.length == 0 ?
                            setTodaysReminders([{ o_Type: 'אין', o_Subject: 'לא הוספו תזכורות לתאריך זה' }])
                            :
                            setTodaysReminders(remindersArr);

                        setViewType('יומי');
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
            )
    }


    // ------------------------------------------------------------------------------------------ //


    // Toggle between MONTHLY and DAILY:
    const changeCalenderType = () => {

        viewType == 'חודשי' ?
            getMyDailyCalenderEvents()
            :
            fetchAllData().then(setViewType('חודשי'));
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

            <View style={styles.mainContainer}>

                <Text style={styles.mainHeading}> ניהול לו"ז </Text>


                <View style={styles.viewTypesContainer}>

                    <TouchableOpacity onPress={() => changeCalenderType()}>
                        <Text style={viewType == 'חודשי' ? styles.viewTypeSelectedText : styles.viewTypeNotSelectedText}>חודשי</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => changeCalenderType()}>
                        <Text style={viewType == 'יומי' ? styles.viewTypeSelectedText : styles.viewTypeNotSelectedText}>יומי</Text>
                    </TouchableOpacity>

                </View>


                {
                    viewType == 'חודשי' ?
                        <>
                            {/* LINE ABOVE THE CALENDER */}
                            <View style={styles.topSectionContainer}>
                                <TouchableOpacity onPress={() => props.navigation.navigate('AddOccurence')} >
                                    <AntDesign name="pluscircleo" size={28} color="white" />
                                </TouchableOpacity>
                            </View>


                            {/* CALENDER */}
                            <Calendar
                                style={{ height: 360 }}

                                current={currentDate}
                                renderArrow={
                                    (direction) => direction === 'right' ?
                                        <SimpleLineIcons name="arrow-left" size={20} color="#3a3b40" />
                                        :
                                        <SimpleLineIcons name="arrow-right" size={20} color="#3a3b40" />
                                }

                                enableSwipeMonths={false}

                                onDayPress={(day) => handleSelectedDate(allMonthEvents, day)}
                                onMonthChange={(dateObj) => getMyMonthlyCalenderEvents(userID, dateObj.day, dateObj.month, dateObj.year)}

                                markedDates={events}
                            />


                            {/* SELECTED DATE */}
                            <Text style={styles.selectedDateText}>
                                {selectedDate}
                            </Text>


                            {/* FLATLIST */}
                            <View style={{ flex: 1, marginBottom: 20 }}>
                                <SafeAreaView>
                                    <FlatList
                                        contentContainerStyle={styles.contentContainer}
                                        data={specificDayEvents}
                                        renderItem={renderItem}
                                        keyExtractor={(item) => `${item.o_ID}_${item.o_Date}`}
                                    />
                                </SafeAreaView>
                            </View>
                        </>
                        :
                        <>

                            {/* LINE ABOVE THE TIMELINE */}
                            <View style={{
                                paddingVertical: 7,
                                paddingHorizontal: 20,
                                backgroundColor: '#3a3b40',
                                height: 45
                            }}>

                                <TouchableOpacity onPress={() => props.navigation.navigate('AddOccurence')} >
                                    <AntDesign name="pluscircleo" size={28} color="white" />
                                </TouchableOpacity>

                            </View>


                            {/* TIMELINE */}
                            <View style={styles.timelineSurroundingContainer}>
                                <Timeline

                                    onEventPress={(event) =>
                                        event.id == 0 ?
                                            ''
                                            :
                                            props.navigation.navigate('OccurenceDetails', {
                                                thisEvent: {
                                                    occurenceType: 'אירוע',
                                                    isDOcc: event.isDOcc,
                                                    occurenceID: event.id,
                                                    isCOcc: false,
                                                    customerID: event.customerID
                                                }
                                            })}

                                    circleColor='#3a3b40'
                                    lineColor='#3a3b40'

                                    //style of the whole <Timeline/>
                                    style={{ marginTop: 0 }}

                                    //surrounds the whole timeline - from side to side and top to bottom
                                    listViewContainerStyle={styles.listViewContainerStyle}

                                    //style of the area of the times
                                    timeContainerStyle={{ paddingHorizontal: 2 }}

                                    //style of the written time
                                    timeStyle={styles.timeStyle}

                                    //style of each event-box
                                    detailContainerStyle={styles.detailContainerStyle}

                                    //style of the title of the event
                                    titleStyle={styles.titleStyle}

                                    //style of the notes text
                                    descriptionStyle={styles.descriptionTextStyle}

                                    //Where to get the data from
                                    data={eventsOfSpecificDate}
                                />

                            </View>



                            {/* LINE UNDER TIMELINE */}
                            <View style={styles.selectedDateContainer}>

                                <Text
                                    style={styles.selectedDateText}
                                >
                                    {selectedDate}
                                </Text>

                            </View>


                            {/* FLATLIST */}
                            <View style={{ flex: 1, marginBottom: 20 }}>
                                <SafeAreaView>
                                    <FlatList
                                        contentContainerStyle={styles.contentContainer}
                                        data={todaysReminders}
                                        renderItem={renderItem}
                                        keyExtractor={(item) => `${item.o_ID}`}
                                    />
                                </SafeAreaView>
                            </View>

                        </>
                }

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
    viewTypesContainer:
    {
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        borderWidth: 1.5,
        borderColor: 'white',
        borderBottomColor: '#3a3b40'
    },
    viewTypeNotSelectedText:
    {
        color: '#3a3b40',
        fontSize: 20,
        fontWeight: 'normal',
        paddingBottom: 5
    },
    selectedDateContainer:
    {
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        backgroundColor: '#3a3b40',
        justifyContent: 'center',
        height: 35
    },
    topSectionContainer:
    {
        justifyContent: 'flex-end',
        flexDirection: 'row',
        paddingVertical: 7,
        paddingHorizontal: 20,
        backgroundColor: '#3a3b40',
        height: 45
    },
    contentContainer: {
        borderColor: 'white',
        flexGrow: 1,
        paddingBottom: 20,
    },



    //General:
    selectedDateText:
    {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        backgroundColor: '#3a3b40',
        color: 'white',
        letterSpacing: 1,
        paddingVertical: 3,
        borderColor: 'white',
        height: 35
    },
    mainHeading:
    {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 15,
        marginBottom: 10
    },
    viewTypeSelectedText:
    {
        color: '#e95344',
        fontSize: 20,
        fontWeight: 'bold',
        paddingBottom: 5
    },



    // ------------------------------------------------

    //Timeline:
    timelineSurroundingContainer:
    {
        height: 350,
        borderBottomColor: '#3a3b40',
        borderBottomWidth: 2
    },
    listViewContainerStyle: {
        backgroundColor: 'white',
        padding: 5,
    },
    timeStyle: {
        color: '#3a3b40',
        fontWeight: 'bold',
        fontSize: 13,
        paddingHorizontal: 5
    },
    detailContainerStyle: {
        backgroundColor: '#f8f8f8',
        borderRadius: 20,
        width: Dimensions.get('window').width * 0.65,
        padding: 15,
        marginTop: 20,
        marginVertical: 20,
        borderWidth: 1.5,
        borderColor: '#3a3b40'
    },
    titleStyle: {
        fontSize: 17,
        color: '#3a3b40'
    },
    descriptionTextStyle:
    {
        fontSize: 12,
        color: '#3a3b40'
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