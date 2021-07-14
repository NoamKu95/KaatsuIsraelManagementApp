//Outer Imports:
import React from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import Spinner from 'react-native-loading-spinner-overlay';

//Icons:
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';




export default function CustomersReport(props) {

    //Modal:
    const [modalVisible, setModalVisible] = useState(false); //For opening and closing the popup

    //Times:
    var timesArray = [
        {
            label: '7 ימים אחרונים',
            value: '7 ימים אחרונים'
        },
        {
            label: '30 ימים אחרונים',
            value: '30 ימים אחרונים'
        },
        {
            label: 'שנה אחרונה',
            value: 'שנה אחרונה'
        },
        {
            label: 'מתחילת החודש',
            value: 'מתחילת החודש'
        },
        {
            label: 'מתחילת השנה',
            value: 'מתחילת השנה'
        },
        {
            label: 'כל הזמנים',
            value: 'כל הזמנים'
        },
    ];
    const [startTime, setStartTime] = useState('');             //desired start time for the report (yyyy-mm-dd)
    const [endTime, setEndTime] = useState('');                 //desired end time for the report (yyyy-mm-dd)

    //Customers:
    const [allCustomers, setAllCustomers] = useState([]); //all the customers from db
    const [customer, setCustomer] = useState(null); //the customer selection

    //Distributers:
    const [allDistributers, setAllDistributers] = useState([]); //all the distributer from db 
    const [distributer, setDistributer] = useState(null); //the user distributer selection    

    //General Use Purposes:
    const [allGeneralUsePurposes, setAllGeneralUsePurposes] = useState([]); //the user usepurpose selection    
    const [generalUsePurpose, setGeneralUsePurpose] = useState(null); //the user usepurpose selection    

    //Customer Statuses:
    const [allCustomerStatuses, setAllCustomerStatuses] = useState([]); //the customer status selection
    const [customerStatus, setCstomerStatus] = useState(null); //the customer status selection

    //Alerts:
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');

    //Loading animation:
    const [spinner, setSpinner] = useState(false);



    useEffect(() => {

        fetchDistributers();
        fetchCustomers();
        fetchGeneralUsePurpuse();
        fetchCustomerStatuses();

    }, []);


    //Get all the DISTRIBUTERS from the DB:
    const fetchDistributers = () => {

        const apiUrl = 'https://proj.ruppin.ac.il/bgroup12/prod/api/distributers';
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
                            null; //Check the data we got from the DB is OK.
            })
            .then(
                (result) => {

                    if (result != null && result != 404 && result != 500) {
                        //result = list of all the distributers

                        setAllDistributers(result);
                    }
                    else if (result == 404) {

                        setAlertMessage('לא נמצאו מפיצים במסד הנתונים');
                        setAlertTitle('אופס!')
                        setShowAlert(true);
                    }
                    else if (result == 500) {

                        setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה')
                        setShowAlert(true);
                    }
                    else {

                        setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה')
                        setShowAlert(true);
                    }
                },
                (error) => {
                    setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית               ' + error);
                    setAlertTitle('שגיאה')
                    setShowAlert(true);
                }
            );
    }


    //Get all the CUSTOMERS from the DB:
    const fetchCustomers = () => {

        const apiUrl = 'https://proj.ruppin.ac.il/bgroup12/prod/api/customers';
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

                    if (result != null && result != 400 && result != 500) {

                        setAllCustomers(result);
                    }
                    else if (result == 404) {

                        setAlertMessage('לא נמצאו לקוחות במסד הנתונים');
                        setAlertTitle('אופס!')
                        setShowAlert(true);
                    }
                    else if (result == 500) {

                        setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה')
                        setShowAlert(true);
                    }
                    else {

                        setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה')
                        setShowAlert(true);
                    }
                },
                (error) => {
                    setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית               ' + error);
                    setAlertTitle('שגיאה')
                    setShowAlert(true);
                }
            );
    }


    //Get all the GeneralUsePurpuse from the DB:
    const fetchGeneralUsePurpuse = () => {

        const apiUrl = 'https://proj.ruppin.ac.il/bgroup12/prod/api/generalusepurpose';
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

                        setAllGeneralUsePurposes(result);
                    }
                    else if (result == 404) {

                        setAlertMessage('לא נמצאו מטרות שימוש כלליות במסד הנתונים');
                        setAlertTitle('אופס!')
                        setShowAlert(true);
                    }
                    else if (result == 500) {

                        setAlertMessage('התרחשה תקלה בהבאת רשימת מטרות השימוש הכלליות ממסד הנתונים. נא לנסות שנית');
                        setAlertTitle('שגיאה')
                        setShowAlert(true);
                    }
                    else {

                        setAlertMessage('התרחשה תקלה בהבאת רשימת מטרות השימוש הכלליות ממסד הנתונים. נא לנסות שנית');
                        setAlertTitle('שגיאה')
                        setShowAlert(true);
                    }
                },
                (error) => {

                    setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית               ' + error);
                    setAlertTitle('שגיאה')
                    setShowAlert(true);
                }
            );
    }


    //Get all the GeneralUsePurpuse from the DB:
    const fetchCustomerStatuses = () => {

        const apiUrl = 'https://proj.ruppin.ac.il/bgroup12/prod/api/customerstatus';
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

                        setAllCustomerStatuses(result);
                    }
                    else if (result == 404) {

                        setAlertMessage('לא נמצאו סטאטוסי לקוחות במסד הנתונים');
                        setAlertTitle('אופס!')
                        setShowAlert(true);
                    }
                    else if (result == 500) {

                        setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה')
                        setShowAlert(true);
                    }
                    else {

                        setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה')
                        setShowAlert(true);
                    }
                },
                (error) => {

                    setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית               ' + error);
                    setAlertTitle('שגיאה')
                    setShowAlert(true);
                }
            );
    }


    //Get the start & end dates from the selected range:
    const handleTimeRange = (item) => {

        //Get today's date for manipulations:
        var today = new Date();
        var today_day = String(today.getDate()).padStart(2, '0');

        //In all cases the latest date in the range is today:
        setEndTime(new Date().toISOString().slice(0, 10));

        if (item == '7 ימים אחרונים') {

            var date = new Date();
            date.setDate(date.getDate() - 7);
            setStartTime(date);
        }
        else if (item == '30 ימים אחרונים') {

            var date = new Date();
            date.setDate(date.getDate() - 30);
            setStartTime(date);
        }
        else if (item == 'שנה אחרונה') {

            var date = new Date();
            date.setDate(date.getDate() - 365);
            setStartTime(date);
        }
        else if (item == 'מתחילת החודש') {

            var date = new Date();
            date.setDate(date.getDate() - today_day + 1);
            setStartTime(date);

        }
        else if (item == 'מתחילת השנה') {

            var d = new Date();
            var thisYear = d.getFullYear();
            var date = new Date(thisYear, 0, 1);
            setStartTime(date);
        }
        else if (item == 'כל הזמנים') {

            var date = new Date(1995, 0, 1);
            setStartTime(date);
        }
    }


    //Send report filters to DB and download the report:
    const getReport = () => {

        if (startTime == '' || endTime == '') {

            setAlertMessage('יש לבחור תקופה לדוח. נא לנסות שנית');
            setAlertTitle('שגיאה')
            setShowAlert(true);
        }
        else {

            setSpinner(true); // Start loading animation as the data is being proccessed

            let c;
            customer == null ? c = -1 : c = customer; // if customer filter wasn't chosen - send (-1)
            let d;
            distributer == null ? d = -1 : d = distributer; // if distributer filter wasn't chosen - send (-1)
            let g;
            generalUsePurpose == null ? g = -1 : g = generalUsePurpose; // if gup filter wasn't chosen - send (-1)
            let cs;
            customerStatus == null ? cs = -1 : cs = customerStatus; // if customer status filter wasn't chosen - send (-1)


            //Gather all filters as relevant DTO:
            let reportDetails = {
                cr_DistributerID: d,
                cr_CustomerID: c,
                cr_GUPID: g,
                cr_CustomerStatusID: cs,
                cr_StartDate: startTime,
                cr_EndDate: endTime
            }

            const apiUrl = 'https://proj.ruppin.ac.il/bgroup12/prod/api/getcustomersreport';
            fetch(apiUrl,
                {
                    method: 'POST',
                    body: JSON.stringify(reportDetails),
                    headers: new Headers({
                        'Content-Type': 'application/json; charset=UTF-8',
                        'Accept': 'application/json; chartset=UTF-8',
                    })
                })
                .then(res => {

                    return res.status == 200 ?
                        res.json()
                        :
                        res.status == 201 ?
                            201
                            :
                            res.status == 500 ?
                                500
                                :
                                null;
                })
                .then(
                    (result) => {

                        if (result != null && result != 201 && result != 500) {

                            setSpinner(false);
                            setShowAlert(true);
                            setAlertTitle('פעולה בוצעה בהצלחה');
                            setAlertMessage(result);
                        }
                        else if (result == 201) {

                            setSpinner(false);
                            setShowAlert(true);
                            setAlertTitle('אופס!');
                            setAlertMessage('הדוח נוצר בהצלחה אך התרחשה שגיאה בעת שליחתו לכתובת המייל השמורה במערכת');
                        }
                        else if (result == 500) {

                            setSpinner(false);
                            setShowAlert(true);
                            setAlertTitle('שגיאה');
                            setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        }
                        else {

                            setSpinner(false);
                            setShowAlert(true);
                            setAlertTitle('שגיאה');
                            setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        }
                    },
                    (error) => {

                        setSpinner(false);
                        setShowAlert(true);
                        setAlertTitle('שגיאה');
                        setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית             ' + error);
                    }
                );
        }
    }


    //clean all the states
    const resetAll = () => {

        setModalVisible(!modalVisible);
        setCustomer(null);
        setDistributer(null);
        setGeneralUsePurpose(null);
        setCstomerStatus(null);
        setStartTime('');
        setEndTime('');
    }



    //--------------------prepare array for distributers' dropdown list----------------------//

    var allDestributersDDArray = []; //will hold all the Destributers for the dropdown list
    var destributeObj;

    //Turn each distributer to {label: xx, value: yy} :
    for (let i = 0; i < allDistributers.length; i++) {
        destributeObj = {
            label: allDistributers[i].d_FirstName + " " + allDistributers[i].d_LastName + " " + "(" + allDistributers[i].d_PhoneNumber + ")", // label = first name + last name + phone
            value: allDistributers[i].d_PersonalCode // value = distributer personal code
        }
        allDestributersDDArray.push(destributeObj);
    }



    //--------------------prepare array for customers' dropdown list----------------------//

    var allCustomersDDArray = []; //will hold all the customers for the dropdown list
    var customerObj;

    //Turn each customer to {label: xx, value: yy} :
    for (let i = 0; i < allCustomers.length; i++) {
        customerObj = {
            label: allCustomers[i].c_FirstName + " " + allCustomers[i].c_LastName + " " + "(" + allCustomers[i].c_PhoneNumber + ")", // label = first name + last name + phone
            value: allCustomers[i].c_PersonalCode // value = distributer personal code
        }
        allCustomersDDArray.push(customerObj);
    }



    //--------------------prepare array for generalUsePurpose dropdown list----------------------//

    var allGeneralUsePurposesDDArray = []; //will hold all the generalUsePurpose for the dropdown list
    var generalUsePObj;

    //Turn each gup to {label: xx, value: yy} :
    for (let i = 0; i < allGeneralUsePurposes.length; i++) {
        generalUsePObj = {
            label: allGeneralUsePurposes[i].gup_Name, // label =  name
            value: allGeneralUsePurposes[i].gup_ID // value = generalUsePurpose id
        }
        allGeneralUsePurposesDDArray.push(generalUsePObj);
    }



    //--------------------prepare array for CustomerStatuses dropdown list----------------------//

    var allCustomerStatusesDDArray = []; //will hold all the CustomerStatuses for the dropdown list
    var StatusObj;

    for (let i = 0; i < allCustomerStatuses.length; i++) {
        StatusObj = {
            label: allCustomerStatuses[i].cs_Name, // label = name
            value: allCustomerStatuses[i].cs_ID // value = CustomerStatuses id
        }
        allCustomerStatusesDDArray.push(StatusObj);
    }



    return (

        <View style={styles.centeredView}>

            <Modal animationType="slide" transparent={true} visible={modalVisible} >

                <View style={styles.centeredView}>

                    <View style={styles.modalView}>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={resetAll}
                        >
                            <FontAwesome5 name="long-arrow-alt-left" size={40} color="#e95344" />
                        </TouchableOpacity>

                        <Text style={styles.modalTitle}>דוח לקוחות</Text>

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

                        <Text style={styles.textStyle}>מועד כניסת הלקוח למערכת:</Text>

                        <DropDownPicker
                            placeholder="בחר תקופה רלוונטית"
                            items={timesArray}
                            containerStyle={styles.ddListContainer}
                            style={{ backgroundColor: '#fafafa' }}
                            itemStyle={{ justifyContent: 'flex-start' }}
                            style={styles.ddListGeneralStyle}
                            dropDownStyle={styles.ddListDropdownStyle}
                            onChangeItem={item => handleTimeRange(item.value)}
                        />

                        <Text style={styles.textStyle}>שם הלקוח:</Text>
                        <View style={styles.filterContainer}>

                            <DropDownPicker

                                //Searchable dropdown list:
                                searchableStyle={styles.searchableDDListStyle}
                                searchablePlaceholderTextColor="silver"
                                searchable={true}
                                searchablePlaceholder="הקלד לחיפוש..."
                                searchableError={() => <Text>לא נמצאו תוצאות</Text>}

                                placeholder="הקלד.."
                                defaultValue={customer}
                                items={allCustomersDDArray}
                                containerStyle={styles.ddListContainer}
                                style={{ backgroundColor: '#fafafa' }}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                style={styles.ddListGeneralStyle}
                                dropDownStyle={styles.ddListDropdownStyle}
                                onChangeItem={item => setCustomer(item.value)}
                            />

                            <TouchableOpacity
                                style={{ alignSelf: 'baseline' }}
                                onPress={() => setCustomer(null)}
                            >
                                <MaterialIcons name="cancel" size={24} color="#e95344" style={styles.cancelIconStyle} />
                            </TouchableOpacity>

                        </View>


                        <Text style={styles.textStyle}>שם המפיץ:</Text>
                        <View style={styles.filterContainer}>
                            <DropDownPicker

                                //Searchable dropdown list:
                                searchableStyle={styles.searchableDDListStyle}
                                searchablePlaceholderTextColor="silver"
                                searchable={true}
                                searchablePlaceholder="הקלד לחיפוש..."
                                searchableError={() => <Text>לא נמצאו תוצאות</Text>}

                                placeholder="הקלד.."
                                defaultValue={distributer}
                                items={allDestributersDDArray}
                                containerStyle={styles.ddListContainer}
                                style={{ backgroundColor: '#fafafa' }}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                style={styles.ddListGeneralStyle}
                                dropDownStyle={styles.ddListDropdownStyle}
                                onChangeItem={item => setDistributer(item.value)}
                            />

                            <TouchableOpacity
                                style={{ alignSelf: 'baseline' }}
                                onPress={() => setDistributer(null)}
                            >
                                <MaterialIcons name="cancel" size={24} color="#e95344" style={styles.cancelIconStyle} />
                            </TouchableOpacity>
                        </View>


                        <Text style={styles.textStyle}>מטרת שימוש כללית</Text>
                        <View style={styles.filterContainer}>

                            <DropDownPicker
                                placeholder="בחר.."
                                defaultValue={generalUsePurpose}
                                items={allGeneralUsePurposesDDArray}
                                containerStyle={styles.ddListContainer}
                                style={{ backgroundColor: '#fafafa' }}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                style={styles.ddListGeneralStyle}
                                dropDownStyle={styles.ddListDropdownStyle}
                                onChangeItem={item => setGeneralUsePurpose(item.value)}
                            />

                            <TouchableOpacity
                                style={{ alignSelf: 'baseline' }}
                                onPress={() => setGeneralUsePurpose(null)}
                            >
                                <MaterialIcons name="cancel" size={24} color="#e95344" style={styles.cancelIconStyle} />
                            </TouchableOpacity>

                        </View>


                        <Text style={styles.textStyle}>סטטוס הלקוח:</Text>
                        <View style={styles.filterContainer}>

                            <DropDownPicker
                                placeholder="בחר.."
                                items={allCustomerStatusesDDArray}
                                defaultValue={customerStatus}
                                containerStyle={styles.ddListContainer}
                                style={{ backgroundColor: '#fafafa' }}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                style={styles.ddListGeneralStyle}
                                dropDownStyle={styles.ddListDropdownStyle}
                                onChangeItem={item => setCstomerStatus(item.value)}
                            />

                            <TouchableOpacity
                                style={{ alignSelf: 'baseline' }}
                                onPress={() => setCstomerStatus(null)}
                            >
                                <MaterialIcons name="cancel" size={24} color="#e95344" style={styles.cancelIconStyle} />
                            </TouchableOpacity>

                        </View>

                        <TouchableOpacity
                            style={styles.makeReportButton}
                            onPress={() => getReport()}
                        >
                            <Text style={styles.reportButtonText}>
                                הפקת דוח
                            </Text>

                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <TouchableOpacity
                onPress={() => { setModalVisible(true); }}
                style={styles.reportButton}
            >
                <Text style={styles.customersReportText} >
                    דוח לקוחות
                </Text>

            </TouchableOpacity>

        </View>
    );
}


const styles = StyleSheet.create({

    //Containers:
    filterContainer:
    {
        flexDirection: 'row'
    },


    //General:
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 22,
    },


    //Buttons:
    reportButton: {
        backgroundColor: '#e95344',
        borderRadius: 50,
        padding: 7,
        width: 335,
        height: 60,
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    buttonStyle: {
        backgroundColor: '#e95344',
        borderRadius: 50,
        padding: 7,
        width: 300,
        height: 45,
        display: 'flex',
        justifyContent: 'center',
        left: 30, //to align the button to the center of the page
        marginRight: 45
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    customersReportText:
    {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    makeReportButton: {
        backgroundColor: '#e95344',
        borderRadius: 50,
        width: 290,
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 20,
        marginTop: 20
    },
    reportButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 20,
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    closeButton: {
        textAlign: "left",
        marginLeft: 240,
    },


    //Modal:
    modalView: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#3a3b40',
        borderRadius: 13,
        paddingHorizontal: 23,//הצדדים של הפופאפ
        paddingVertical: 7,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 10,
    },
    modalTitle: {
        marginBottom: 5,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold'
    },
    textStyle: {
        textAlign: 'left',
        marginBottom: 10,
        marginTop: 15,
        fontSize: 16
    },


    //Dropdown Lists:
    ddListGeneralStyle:
    {
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
        backgroundColor: 'white', borderColor: '#3a3b40'
    },
    ddListDropdownStyle:
    {
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
        backgroundColor: '#f8f8f8', borderColor: '#3a3b40',
        height: 110
    },
    ddListContainer:
    {
        height: 35,
        width: 260
    },


    //Searchable Dropdown List:
    searchableDDListStyle:
    {
        backgroundColor: '#fafafa', borderColor: 'lightgrey', textAlign: 'right', marginBottom: 7, // paddingVertical: 10,
        paddingHorizontal: 20,
        height: 30,
        borderColor: '#3a3b40',
    },


    //Cancel Icon:
    cancelIconStyle:
    {
        paddingRight: 4,
        paddingTop: 7
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