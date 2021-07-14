//Outer Imports:
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

//Inner Imports:
import Header from '../Components/Header';
import ManagerDashboardMonthly from './ManagerDashboardMonthly';
import ManagerDashboardYearly from './ManagerDashboardYearly';
import DistributerDashboard from './DistributerDashboard';
import SendPushNotification from '../PopUps/SendPushNotificationPopup';

//Icons:
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

//Expo Notifications:
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({

    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});




export default function ManagerDashboard(props) {

    //Notifications:
    const [expoPushToken, setExpoPushToken] = useState('');

    //User Details:
    const [userType, setUserType] = useState('');
    const [userPersonalCode, setUserPersonalCode] = useState('');
    const [viewType, setViewType] = useState('monthly');                        //Which dashboard to display - of this month or of this year


    //___MANAGER DASHBOARDS___//
    //Monthly Dashboard:
    const [totalEarningsMonthly, setTotalEarningsMonthly] = useState(0);       //How much money was earned from the beginning of the month
    const [prevMonthChangeRate, setPrevMonthChangeRate] = useState(0);         //What is the % of change from last month (double)
    const [prevMonthChangeStatus, setPrevMonthChangeStatus] = useState(true);   // Incoms are better (true) or worse (false) than last month [bool];
    const [leadsEnteredMonthly, setLeadsEnteredMonthly] = useState(0);         //How many new leads entered the system this month
    const [setsSoldMonthly, setSetsSoldMonthly] = useState(0);                 //How many sets of products were sold from the beginning of the month
    const [topSellersData, setTopSellersData] = useState([]);                   //Best 5 Sellers of this month
    const [showTopSellers, setShowTopSellers] = useState(true);
    const [gaugeFillMonthly, setGaugeFillMonthly] = useState(0);                //Leads that entered this month & already bought - %


    //Yearly Dashboard:
    const [totalEarningsYearly, setTotalEarningsYearly] = useState(0);         //How much money earned from the beginning of the year
    const [setsSoldYearly, setSetsSoldYearly] = useState(0);                   //How many sets of products were sold from the beginning of the year
    const [totalCustomers, setTotalCustomers] = useState(0);                   //How many customers we got from the beginning of the year (people who bought)
    const [areaData, setAreGraphData] = useState([]);
    const [gaugeFillYearly, setGaugeFillYearly] = useState(0);                  // leads turned into customers (%)
    const [piedata, setPieData] = useState([]);


    //___DISTRIBUTER DASHBOARD___//
    const [thisMonthSalary, setThisMonthSalary] = useState(0);
    const [changeRate, setChangeRate] = useState(0);
    const [setsISold, setSetsISold] = useState(0);
    const [myHotLeads, setMyHotLeads] = useState(0);
    const [myActiveCustomers, setMyActivecustomers] = useState(0);
    const [myPrevSalaries, setMyPrevSalaries] = useState([]);


    //Alerts:
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');


    //Loading animation:
    const [spinner, setSpinner] = useState(true);




    useEffect(() => {

        const checkFocus = props.navigation.addListener('focus', () => {

            fetchData();
        });

        Notifications.addNotificationReceivedListener(_handleNotification);
        Notifications.addNotificationResponseReceivedListener(_handleNotificationResponse);


        return () => {
            checkFocus;
        };

    }, []);



    const fetchData = async () => {

        //Check if the user is a manager or a regular distributer:
        try {

            const jsonValue = await AsyncStorage.getItem('userDetails')

            if (jsonValue != null) {
                let user = JSON.parse(jsonValue);

                setUserType(user.d_Status);
                setUserPersonalCode(user.d_PersonalCode);

                fetchDashboradData(user.d_Status, user.d_PersonalCode);


                //Now that we have the user's ID - get him a token & save to db:
                registerForPushNotificationsAsync(user.d_PersonalCode).then(token => setExpoPushToken(token));
            }
        } catch {

            setSpinner(false);
            setAlertTitle("שגיאה")
            setAlertMessage("התרחשה שגיאה בשליפת סוג המשתמש מהאחסון המקומי");
            setShowAlert(true);
        }
    }


    //Ask permission from the user & get him a token:
    async function registerForPushNotificationsAsync(id) {

        let token;
        if (Constants.isDevice) {

            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {

                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {

                console.log('Failed to get push token for push notification');
                return;
            }

            token = (await Notifications.getExpoPushTokenAsync()).data;


            //Save the updated Token to the DB:
            saveTokenToDB(id, token);

        }
        else { // accessing the app not through a mobile phone

            console.log('Must use physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {

            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        return token;
    }



    //Listen to incoming push notifications:
    const _handleNotification = notification => {

        //setNotification(notification);
    }

    const _handleNotificationResponse = response => {

        let chattingWith = response.notification.request.content.data.contactID;
        let userID = response.notification.request.content.data.userID;
        if (response.notification.request.content.data.action == "chat") {

            userID = 1;
            let c = {
                myID: userID,
                chatWith: chattingWith,
            }

            props.navigation.navigate('ChatStack');
        }
    }




    // Save the user's token into the DB:
    const saveTokenToDB = async (id, token) => {

        const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/updatetoken/${id}/${token}`;
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
                    200
                    :
                    res.status == 400 ?
                        400
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

                    if (result == 404) {

                        setAlertMessage('לא נמצאה התאמה במסד הנתונים לנתוני המשתמש');
                        setAlertTitle('אופס!');
                        setShowAlert(true);
                    }
                    else if (result == 409) {

                        setAlertMessage('הנתונים שהוזנו אינם עומדים בתנאי השרת ומסד הנתונים. נא לבדוק את הנתונים שהוזנו ולנסות שנית');
                        setAlertTitle('אופס!');
                        setShowAlert(true);
                    }
                    else if (result == 500) {

                        setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה');
                        setShowAlert(true);
                    }
                    else if (result == 200) {

                        // Token was updated succesfully
                        // No need to alert the user
                    }
                    else if (result == null) {

                        setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה');
                        setShowAlert(true);
                    }
                },
                (error) => {

                    setSpinner(false); // Stop loading animation as data is ready to be displayed
                    setAlertMessage('התרחשה תקלה בתקשורת עם מסד הנתונים. נא לנסות שנית             ' + error);
                    setAlertTitle('שגיאה');
                    setShowAlert(true);
                }
            )
    }



    //Toggle the dashboard type that is displayed:
    const changeViewType = () => {

        if (viewType == 'yearly') {
            setViewType('monthly');
        }
        else if (viewType == 'monthly') {
            setViewType('yearly');
        }
    }


    //Get the needed data to show in both dashboards:
    const fetchDashboradData = async (user_type, user_id) => {

        if (user_type == "מנהל") {

            const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/managerdashboard`;
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

                            //Monthly:
                            setPrevMonthChangeRate(Math.round(result.changeFromPrevMonth));
                            result.changeFromPrevMonth >= 100 ? setPrevMonthChangeStatus(true) : setPrevMonthChangeStatus(false);
                            setLeadsEnteredMonthly(result.leadsEnteredMonthly);
                            setSetsSoldMonthly(`${result.setsSoldMonthly}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                            setTotalEarningsMonthly(`${result.totalMonthlyEarnings}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                            setGaugeFillMonthly(result.leadsTurnedCustomersMonthly);

                            //Prepare the data for the top sellers bar graph:
                            if (result.totalMonthlyEarnings == 0) // if nothing was sold then there's no need to show top sellers as all will be on 0$
                            {
                                setShowTopSellers(false);
                            }
                            else {
                                let allSellersZero = true;
                                let topSellersData = [];
                                for (let i = 0; i < result.topSellersGraphDataArray.length; i++) {

                                    result.topSellersGraphDataArray[i].distributerMonthlySales != 0 ? allSellersZero = false : ''; // if at least one person sold then we want to show bar graph

                                    topSellersData.push(
                                        {
                                            seller: result.topSellersGraphDataArray[i].distributerName,
                                            earnings: result.topSellersGraphDataArray[i].distributerMonthlySales
                                        }
                                    )
                                }

                                if (allSellersZero) {
                                    setShowTopSellers(false);
                                }
                                else {

                                    setShowTopSellers(true);
                                    setTopSellersData(topSellersData);
                                }
                            }




                            //Yearly:
                            setGaugeFillYearly(result.leadsTurnedCustomersYearly);
                            setSetsSoldYearly(`${result.setsSoldYearly}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                            setTotalCustomers(`${result.totalCustomers}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                            setTotalEarningsYearly(`${result.totalYearlyEarnings}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","))

                            //Prepare the data for the pie chart:
                            let pieData = [];
                            for (let i = 0; i < result.customersPieChartDataArray.length; i++) {

                                if (result.customersPieChartDataArray[i].precentageFromTotal != 0) {
                                    let nameArray = result.customersPieChartDataArray[i].statusName.split(" ");
                                    pieData.push(
                                        {
                                            x: nameArray.length == 2 ?
                                                nameArray[1] + " - " + `${result.customersPieChartDataArray[i].precentageFromTotal}%`
                                                :
                                                nameArray[1] + " " + nameArray[2] + " - " + `${result.customersPieChartDataArray[i].precentageFromTotal}%`, // לקוח פעיל הופך ל-פעיל ולקוח לא פעיל הופל ל-לא פעיל
                                            y: result.customersPieChartDataArray[i].precentageFromTotal
                                        }
                                    );
                                }
                            }
                            setPieData(pieData);


                            //Prepare the data for the years sales in months graph:
                            let areaData = [];
                            for (let i = 0; i < result.salesGraphDataArray.length; i++) {

                                areaData.push(
                                    {
                                        x: result.salesGraphDataArray[i].monthName,
                                        y: result.salesGraphDataArray[i].totalMonthlySales
                                    }
                                );
                            }
                            setAreGraphData(areaData);

                            setSpinner(false); // Stop loading animation as data is ready to be displayed
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
                )
        }
        else { // user is a regular distributer

            const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/distributerdashboard/${user_id}`;
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

                            setThisMonthSalary(`${result.thisMonthCommission}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                            setChangeRate(Math.round(result.changeFromPrevMonth));
                            result.changeFromPrevMonth >= 100 ? setPrevMonthChangeStatus(true) : setPrevMonthChangeStatus(false);
                            setSetsISold(result.setsSoldThisMonth);
                            setMyHotLeads(result.hotLeads);
                            setMyActivecustomers(result.activeCustomers);

                            //Prepare the data for the top sellers bar graph:
                            let mySellsLastMonths = [];
                            for (let i = 0; i < result.mysalariesPrevMonths.length; i++) {

                                mySellsLastMonths.push(
                                    {
                                        y: result.mysalariesPrevMonths[i].totalMonthlyCommissions,
                                        x: result.mysalariesPrevMonths[i].monthName
                                    }
                                )
                            }
                            setMyPrevSalaries(mySellsLastMonths);

                            setSpinner(false); // Stop loading animation as data is ready to be displayed
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
                )
        }
    }


    // Send a push notification to all of the active distributers:
    async function schedulePushNotification(title_, content_, distributers) {

        let notification = {
            title: `KAATSU || ${title_}`,
            body: content_,
            to: distributers
        };

        let apiUrl = `https://exp.host/--/api/v2/push/send`;    // Expo's API
        fetch(apiUrl,
            {
                method: 'POST',
                body: JSON.stringify(notification),
                headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json; chartset=UTF-8',
                })
            })
            .then(res => {

                return res.status == 200 ?
                    res.json()
                    :
                    null;
            })
            .then(
                (result) => {

                    if (result != null) {

                        //Let the user know the details were saved:
                        setSpinner(false);
                        setAlertTitle('פעולה בוצעה בהצלחה');
                        setAlertMessage('הודעת הדחיפה נשלחה בהצלחה למפיצים הפעילים השמורים במערכת');
                        setShowAlert(true);
                    }
                    else {

                        setSpinner(false);
                        setAlertMessage('התרחשה תקלה במהלך שליחת הודעת הדחיפה. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה');
                        setShowAlert(true);
                    }
                },
                (error) => {

                    setSpinner(false);
                    setAlertMessage('התרחשה תקלה בתקשורת עם שרת השליחה החיצוני. נא לנסות שנית             ' + error);
                    setAlertTitle('שגיאה');
                    setShowAlert(true);
                }
            );
    }




    return (
        <>
            <StatusBar backgroundColor='#e95344' barStyle='light-content' />

            <Header navigation={props.navigation} showArrow={false} showMenu={true} />

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

            {/* Quick Access Buttons (only for managaer)*/}
            <View style={[userType == "מנהל" ? styles.mainContainerManager : styles.mainContainerDistributer]}>
                <View style={styles.quickAccessButtonsContainer}>

                    {
                        userType == "מנהל" ?
                            <TouchableOpacity
                                onPress={() =>
                                    props.navigation.navigate('DashboardStack', {
                                        screen: 'ConfirmDenyMatches',
                                        params: { userID: userPersonalCode }
                                    })}
                                style={styles.topShortcutButton}
                            >
                                <Text style={styles.shortcutButtonsText}>לידים</Text>
                                <Ionicons name="ios-people-circle" size={30} color="white" />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                style={styles.topShortcutButton2}
                                onPress={() => {
                                    if (userType == "מפיץ פעיל") {

                                        props.navigation.navigate('DashboardStack', {
                                            screen: 'MakeSale',
                                            params: { buyer: 'customer', isInSystem: true }
                                        })
                                    }
                                    else {

                                        setAlertMessage('רק מפיץ שסטטוסו פעיל רשאי לבצע מכירה');
                                        setAlertTitle('שגיאה');
                                        setShowAlert(true);
                                    }
                                }}

                            >
                                <Text style={styles.shortcutButtonsText2}>מכירה</Text>

                                <View style={styles.topShortcutButton3}>
                                    <FontAwesome5 name="shekel-sign" size={18} color="black" />
                                </View>

                            </TouchableOpacity>
                    }

                    {
                        userType == 'מנהל' ?
                            <TouchableOpacity
                                onPress={() =>
                                    props.navigation.navigate('DashboardStack', {
                                        screen: 'DeploymentMap',
                                        params: { userID: userPersonalCode }
                                    })}
                                style={styles.topShortcutButton}
                            >
                                <Text style={styles.shortcutButtonsText}>מפיצים</Text>
                                <Ionicons name="person-circle-sharp" size={30} color="white" />

                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                style={styles.topShortcutButton2}
                                onPress={() =>
                                    props.navigation.navigate('DashboardStack', { screen: 'CalendarPage', })}
                            >
                                <Text style={styles.shortcutButtonsText2}>לו"ז</Text>

                                <View style={styles.topShortcutButton3}>
                                    <Ionicons name="calendar" size={22} color="black" />
                                </View>

                            </TouchableOpacity>
                    }

                    {
                        userType == 'מנהל' ?
                            <View>
                                <SendPushNotification sendDataToParent={schedulePushNotification} />
                            </View>
                            :
                            <TouchableOpacity
                                style={styles.topShortcutButton2}
                                onPress={() =>
                                    props.navigation.navigate('DashboardStack', { screen: 'AddNewLead', })}
                            >
                                <Text style={styles.shortcutButtonsText2}>ליד חדש</Text>

                                <View style={styles.topShortcutButton3}>
                                    <Ionicons name="person-add-sharp" size={20} color="black" />
                                </View>

                            </TouchableOpacity>
                    }

                </View >


                {/* switch between dashboard views */}
                {
                    userType != 'מנהל' ?
                        <></>
                        :
                        <View style={{ flex: 1, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                            <MaterialIcons name="keyboard-arrow-right" size={44} color="white" onPress={() => changeViewType()} />
                            <Text style={styles.calendarViewText}>{viewType == 'monthly' ? 'תצוגה חודשית' : 'תצוגה שנתית'}</Text>
                            <MaterialIcons name="keyboard-arrow-left" size={44} color="white" onPress={() => changeViewType()} />

                        </View>
                }

            </View>

            {/* Dashboard Area */}
            <ScrollView>

                {
                    userType != "מנהל" ?
                        <DistributerDashboard
                            earnings={thisMonthSalary}
                            changeStatus={prevMonthChangeStatus}
                            changeRate={changeRate}
                            sets={setsISold}
                            leads={myHotLeads}
                            actives={myActiveCustomers}
                            prevSalaries={myPrevSalaries}
                        />
                        :
                        viewType == "monthly" ?
                            <ManagerDashboardMonthly
                                earnings={totalEarningsMonthly}
                                changeStatus={prevMonthChangeStatus}
                                changeRate={prevMonthChangeRate}
                                leads={leadsEnteredMonthly}
                                sets={setsSoldMonthly}
                                showTopSellers={showTopSellers}
                                topSellers={topSellersData}
                                gauge={gaugeFillMonthly}
                            />
                            :
                            <ManagerDashboardYearly
                                earnings={totalEarningsYearly}
                                sets={setsSoldYearly}
                                customers={totalCustomers}
                                sellsByMonths={areaData}
                                gauge={gaugeFillYearly}
                                customerDevideStatuses={piedata}
                            />
                }

            </ScrollView>
        </>
    );
}


const styles = StyleSheet.create({

    //Containers:
    mainContainerDistributer: {
        backgroundColor: '#3a3b40',
        height: 85
    },
    mainContainerManager:
    {
        backgroundColor: '#3a3b40',
        height: 108
    },


    //Quick Access Buttons:
    quickAccessButtonsContainer:
    {
        flex: 1,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    topShortcutButton:
    {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15
    },
    topShortcutButton2:
    {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12
    },
    topShortcutButton3:
    {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 50,
        width: 32,
        height: 32
    },
    shortcutButtonsText:
    {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 10
    },
    shortcutButtonsText2:
    {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 10,
        paddingBottom: 4
    },
    calendarViewText:
    {
        fontSize: 26,
        fontWeight: 'bold',
        color: 'white'
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
    }

});