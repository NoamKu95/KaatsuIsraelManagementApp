//Outer Imports:
import React from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import Spinner from 'react-native-loading-spinner-overlay';

//ICONS:
import { FontAwesome5 } from '@expo/vector-icons';



export default function StockReport() {

    //Modal:
    const [modalVisible, setModalVisible] = useState(false); //For opening and closing the popup
    const [product, setProduct] = useState(null); //the user product selection-> ID
    const [allProducts, setAllProducts] = useState([]);

    //Alerts:
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');

    //Loading animation:
    const [spinner, setSpinner] = useState(true);



    useEffect(() => {

        getAllProducts();

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
                    else if (result == 404) {

                        setAlertMessage('לא נמצאו מוצרים במסד הנתונים');
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


    //Send report filters to DB and download the report:
    const getReport = () => {


        if (product == '' || product == null) {

            setAlertMessage('חובה לבחור מוצר לצורך הפקת דוח מלאי. נא לנסות שנית');
            setAlertTitle('שגיאה')
            setShowAlert(true);
        }
        else {

            setSpinner(true);

            //Create object to pass:
            let reportDetails = {
                sr_ProductID: parseInt(product)
            }

            const apiUrl = 'https://proj.ruppin.ac.il/bgroup12/prod/api/getstockreport';
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
                        setAlertMessage(error);
                    }
                );
        }
    }


    //Clear states:
    const resetAll = () => {

        setModalVisible(!modalVisible);
        setProduct('');
    }



    //--------------------prepare array for products' dropdown list----------------------//
    var allProductsArray = []; //will hold all the product for the dropdown list
    var prodObj;

    //Turn each product to {label: xx, value: yy} :
    allProductsArray.push({
        label: 'כל המוצרים',  // add an option that doesn't exist in the DB
        value: 12345
    });
    for (let i = 0; i < allProducts.length; i++) {
        prodObj = {
            label: allProducts[i].p_Name + " מידה: " + allProducts[i].p_Size, // label = product name + size
            value: allProducts[i].p_ID // value = product id
        }
        allProductsArray.push(prodObj);
    }



    return (
        <View style={styles.centeredView}>

            <Modal animationType="slide" transparent={true} visible={modalVisible}>

                <View style={styles.centeredView}>

                    <View style={styles.modalView}>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={resetAll}>
                            <FontAwesome5 name="long-arrow-alt-left" size={40} color="#e95344" />
                        </TouchableOpacity>

                        <Text style={styles.modalTitle}>דוח מלאי</Text>

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
                        </View>

                        <TouchableOpacity
                            style={styles.makeReport}
                            onPress={() => getReport()}>
                            <Text style={styles.reportButtonText}>
                                הפקת דוח
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <TouchableOpacity
                onPress={() => { setModalVisible(true); }}
                style={styles.reportButton}>
                <Text style={styles.stockReportText}>
                    דוח מלאי
                </Text>
            </TouchableOpacity>
        </View>
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
        width: 290
    },

    //Dropdown Lists:
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
    makeReport: {
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
    stockReportText:
    {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    closeButton: {
        textAlign: "left",
        marginLeft: 240,
        zIndex: 2
    },

    //Modal:
    modalView: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#3a3b40',
        borderRadius: 13,
        paddingHorizontal: 23,//הצדדים של הפופאפ
        paddingVertical: 7,
        paddingBottom: 15,
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
        marginBottom: 15,
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