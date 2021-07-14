//Outer Imports:
import React from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useState, useEffect } from 'react';
import AwesomeAlert from 'react-native-awesome-alerts';
import Spinner from 'react-native-loading-spinner-overlay';

//Icons:
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';



export default function SalesReport(props) {

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
        }
    ];
    const [startTime, setStartTime] = useState('');             //desired start time for the report (yyyy-mm-dd)
    const [endTime, setEndTime] = useState('');                 //desired end time for the report (yyyy-mm-dd)

    //Distributers:
    const [allDistributers, setAllDistributers] = useState([]);  //all the distributer from db 
    const [distributer, setDistributer] = useState(null); //the user mafich selection    

    //Products:
    const [allProducts, setAllProducts] = useState([]);  //מערך זמני לבנתיים
    const [product, setProduct] = useState(null); //the user product selection

    //Alerts:
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');

    //Loading animation:
    const [spinner, setSpinner] = useState(false);




    useEffect(() => {

        getAllProducts();
        fetchDistributers();

    }, []);



    //get all products from DB
    const getAllProducts = () => {

        const apiUrl = 'https://proj.ruppin.ac.il/bgroup12/prod/api/product';
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

                        setAllProducts(result);
                    }
                    else if (result == 500) {

                        setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה')
                        setShowAlert(true);
                    }
                    else if (result == 404) {

                        setAlertMessage('לא נמצאו מוצרים במסד הנתונים');
                        setAlertTitle('אופס!')
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
                            null;
            })
            .then(

                (result) => {

                    if (result != null && result != 404 && result != 500) {

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

            setSpinner(true);

            let d;
            distributer == null ? d = -1 : d = distributer;  // if distributer filter wasn't chosen - send (-1)
            let p;
            product == null ? p = -1 : p = product;  // if product filter wasn't chosen - send (-1)


            //Gather all filters as relevant DTO:
            let reportDetails = {
                sr_DistribterID: d,
                sr_ProductID: p,
                sr_StartDate: startTime,
                sr_EndDate: endTime
            }

            const apiUrl = 'https://proj.ruppin.ac.il/bgroup12/prod/api/getsalesreport';
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
                            setAlertMessage('יצירת הדוח בוצעה בהצלחה אך התרחשה תקלה בשליחתו למייל השמור במערכת');
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


    //Clear states:
    const resetAll = () => {

        setModalVisible(!modalVisible);
        setDistributer(null);
        setProduct(null);
        setStartTime('');
        setEndTime('');
    }




    //--------------------prepare array for products' dropdown list----------------------//

    var allProductsArray = []; //will hold all the product for the dropdown list
    var prodObj;

    //Turn each product to {label: xx, value: yy} :
    for (let i = 0; i < allProducts.length; i++) {
        prodObj = {
            label: allProducts[i].p_Name + " מידה: " + allProducts[i].p_Size, // label = product name + size
            value: allProducts[i].p_ID // value = product id
        }
        allProductsArray.push(prodObj);
    }


    //--------------------prepare array for distributers dropdown list----------------------//

    var allDistributersDDArray = []; //will hold all the Destributers for the dropdown list
    var destributeObj;

    //Turn each distributer to {label: xx, value: yy} :
    for (let i = 0; i < allDistributers.length; i++) {
        destributeObj = {
            label: allDistributers[i].d_FirstName + " " + allDistributers[i].d_LastName + " " + "(" + allDistributers[i].d_PhoneNumber + ")", // label = first name + last name + phone
            value: allDistributers[i].d_PersonalCode // value = distributer personal code
        }
        allDistributersDDArray.push(destributeObj);
    }


    return (
        <View style={styles.centeredView}>

            <Modal animationType="slide" transparent={true} visible={modalVisible} >

                <View style={styles.centeredView}>

                    <View style={styles.modalView}>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={resetAll}>
                            <FontAwesome5 name="long-arrow-alt-left" size={40} color="#e95344" />
                        </TouchableOpacity>

                        <Text style={styles.modalTitle}>דוח מכירות</Text>

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

                        <Text style={styles.textStyle}>תקופת הדוח:</Text>

                        <DropDownPicker
                            placeholder="בחר תקופה רלוונטית"
                            items={timesArray}
                            containerStyle={styles.ddListContainer}
                            style={{ backgroundColor: '#fafafa' }}
                            itemStyle={{ justifyContent: 'flex-start' }}
                            style={styles.ddListGeneralStyle}
                            dropDownStyle={styles.dropDownStyle}
                            onChangeItem={item => handleTimeRange(item.value)}
                        />

                        <Text style={styles.textStyle}>שם המפיץ:</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <DropDownPicker

                                //Searchable dropdown list:
                                searchableStyle={styles.searchableDDListStyle}
                                searchablePlaceholderTextColor="silver"
                                searchable={true}
                                searchablePlaceholder="הקלד לחיפוש..."
                                searchableError={() => <Text>לא נמצאו תוצאות</Text>}

                                placeholder="הקלד..."
                                items={allDistributersDDArray}
                                defaultValue={distributer}
                                containerStyle={styles.ddListContainer}
                                style={{ backgroundColor: '#fafafa' }}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                style={styles.ddListGeneralStyle}
                                dropDownStyle={styles.dropDownStyle}
                                onChangeItem={item => setDistributer(item.value)}
                            />
                            <TouchableOpacity
                                style={{ alignSelf: 'baseline' }}
                                onPress={() => setDistributer(null)}
                            >
                                <MaterialIcons name="cancel" size={24} color="#e95344" style={styles.cancelIcon} />
                            </TouchableOpacity>
                        </View>


                        <Text style={styles.textStyle}>סוג המוצר:</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <DropDownPicker

                                //Searchable dropdown list:
                                searchableStyle={styles.searchableDDListStyle}
                                searchablePlaceholderTextColor="silver"
                                searchable={true}
                                searchablePlaceholder="הקלד לחיפוש..."
                                searchableError={() => <Text>לא נמצאו תוצאות</Text>}

                                placeholder="בחר.."
                                items={allProductsArray}
                                defaultValue={product}
                                containerStyle={styles.ddListContainer}
                                style={{ backgroundColor: '#fafafa' }}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                style={styles.ddListGeneralStyle}
                                dropDownStyle={styles.dropDownStyle}
                                onChangeItem={item => setProduct(item.value)}
                            />
                            <TouchableOpacity
                                style={{ alignSelf: 'baseline' }}
                                onPress={() => setProduct(null)}
                            >
                                <MaterialIcons name="cancel" size={24} color="#e95344" style={styles.cancelIcon} />
                            </TouchableOpacity>
                        </View>


                        <TouchableOpacity
                            style={styles.makeReportButton}
                            onPress={() => getReport()}>
                            <Text style={styles.reportButtonText}>
                                הפקת דוח
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>


            <TouchableOpacity
                onPress={() => { setModalVisible(true) }}
                style={styles.reportButton}>
                <Text
                    style={styles.salesReportText}>
                    דוח מכירות
                </Text>
            </TouchableOpacity>

        </View >
    );
}


const styles = StyleSheet.create({

    //General:
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 22,
    },


    //Dropdown Lists:
    ddListGeneralStyle:
    {
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
        backgroundColor: 'white', borderColor: '#3a3b40'
    },
    dropDownStyle:
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
        backgroundColor: '#fafafa',
        borderColor: 'lightgrey',
        textAlign: 'right',
        marginBottom: 7, // paddingVertical: 10,
        paddingHorizontal: 20,
        height: 30,
        borderColor: '#3a3b40',
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
        left: 30, //only for align the button in the center of the page
        marginRight: 45
    },
    buttonText: {
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
    salesReportText:
    {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    cancelIcon:
    {
        paddingRight: 4,
        paddingTop: 7
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