//Outer Imports:
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, StatusBar } from 'react-native';
import { useState } from 'react';
import AwesomeAlert from 'react-native-awesome-alerts';
import { ScrollView } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import { Divider } from 'react-native-elements';

//Inner Imports:
import Header from '../Components/Header';

//ICONS:
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';




export default function AddNewProduct(props) {

    //the new product
    const [prodId, setProdId] = useState('');
    const [prodName, setProdName] = useState('');
    const [prodSize, setProdSize] = useState('');
    const [prodPrice, setProdPrice] = useState(0);
    const [prodDescription, setProdDescription] = useState('');
    const [prodUnitInStock, setProdUnitInStock] = useState(0);
    const [prodDesiredQuantityInStock, setProdDesiredQuantityInStock] = useState(0);


    const [commissionsObj, setcCommissionsObj] = useState([{ price: null, top: null, bottom: null }]); //array of commission Objects - [{ price , top, bottom },{ price , top, bottom }]


    //Alerts:
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');




    //for saveing the new product to DB
    const saveNewProduct = () => {

        let allProd = props.route.params.allProducts.allDBProducts; //get the IDs of all of the prodcuts
        let isIn = false; // to verify the new barcode isn't registered alrady

        for (let i = 0; i < allProd.length; i++) {

            if (parseInt(allProd[i].p_ID) == parseInt(prodId)) { // if we already have such barcode

                setAlertMessage('מק״ט מוצר זה קיים כבר, נסה שנית');
                setAlertTitle('שגיאה')
                setShowAlert(true);
                isIn = true;
                break;
            }
        }

        //check if user filled all details:
        if (prodId == '' || prodName == '' || prodSize == '' || prodPrice == '' || prodDescription == '' || prodUnitInStock == '' || prodDesiredQuantityInStock == '') {

            setAlertMessage('יש להזין תוכן בכל השדות');
            setAlertTitle('שגיאה')
            setShowAlert(true);
            isIn = true;
        }
        else if (parseInt(prodId) > 9999 || parseInt(prodId) <= 1000) { // make sure barcode is valid

            setAlertMessage('מק״ט מוצר יכול להיות רק בין 1000 ל- 9999. נסה שנית');
            setAlertTitle('שגיאה')
            setShowAlert(true);
            isIn = true;
        }
        else if (prodName.length < 2) { //product name must include at last 2 letters

            setAlertMessage('שם מוצר חייב לכלול לפחות 2 ספרות. נסה שנית');
            setAlertTitle('שגיאה')
            setShowAlert(true);
            isIn = true;
        }
        else if (prodPrice.toString().includes('-') || prodUnitInStock.toString().includes('-') || prodDesiredQuantityInStock.toString().includes('-')) { //price must be positive whole number

            setAlertMessage('כמויות ומחירים חייבים להיות חיוביים. נסה שנית');
            setAlertTitle('שגיאה')
            setShowAlert(true);
            isIn = true;
        }
        else if (prodUnitInStock.toString().includes('.') || prodDesiredQuantityInStock.toString().includes('.')) { // ranges must be positive whole numbers

            setAlertMessage('כמויות וטווחים חייבים להיות שלמים. נסה שנית');
            setAlertTitle('שגיאה')
            setShowAlert(true);
            isIn = true;
        }
        else if (prodSize != 'S' && prodSize != 'M' && prodSize != 'L' && prodSize != 'XL') { //check if the size input is s/m/l/xl

            setAlertMessage('המידה שהוזנה לא תואמת את המידות האפשריות. נסה שנית (S/M/L/XL)');
            setAlertTitle('שגיאה')
            setShowAlert(true);
            isIn = true;
        }
        else if (commissionsObj.length == 0) { // check user wrote commission

            setAlertMessage('חובה להזין עמלה אחת לפחות למוצר. נסה שנית');
            setAlertTitle('שגיאה');
            setShowAlert(true);
            isIn = true;
        }
        else {

            let found = false;
            let biggerOrSmaller = false;
            let afterRange = false;
            let checkIfItIsInteger = false;
            let tempStateArr = commissionsObj;

            for (let i = 0; i < tempStateArr.length; i++) {

                if (tempStateArr[i].price == null || tempStateArr[i].top == null || tempStateArr[i].bottom == null || tempStateArr[i].price.toString() == '' || tempStateArr[i].top.toString() == '' || tempStateArr[i].bottom.toString() == '') {

                    found = true;
                    break;
                }
                else if (parseInt(tempStateArr[i].top) < parseInt(tempStateArr[i].bottom)) {

                    biggerOrSmaller = true;
                    break;
                }
                else if (tempStateArr.length > i + 1) {

                    if (parseInt(tempStateArr[i + 1].bottom) < parseInt(tempStateArr[i].top)) {

                        afterRange = true;
                        break;
                    }

                }
                else if (tempStateArr[i].bottom.toString().includes('-') || tempStateArr[i].top.toString().includes('-') || tempStateArr[i].bottom.toString().includes('.') || tempStateArr[i].top.toString().includes('.')) {
                    checkIfItIsInteger = true;
                    break;
                }
            }

            if (found) {

                setAlertMessage('חובה להזין תוכן בכל אחת משורות העמלה שהתווספו. נסה שנית');
                setAlertTitle('שגיאה')
                setShowAlert(true);
                isIn = true;
            }

            if (biggerOrSmaller) {

                setAlertMessage('ערך טווח תחתון חייב להיות קטן מערך טווח עליון בקביעת טווחי עמלה. נסה שנית');
                setAlertTitle('שגיאה')
                setShowAlert(true);
                isIn = true;
            }

            if (afterRange) {

                setAlertMessage('ערך טווח תחתון של טווח נוסף חייב להיות קטן מערך טווח עליון של הטווח שלפנייו. נסה שנית');
                setAlertTitle('שגיאה')
                setShowAlert(true);
                isIn = true;
            }

            if (checkIfItIsInteger) {

                setAlertMessage('טווחים חייבים להיות שלמים וחיוביים. נסה שנית');
                setAlertTitle('שגיאה')
                setShowAlert(true);
                isIn = true;
            }
        }

        if (isIn == false) {
            let allCom = [];
            for (let i = 0; i < commissionsObj.length; i++) {

                let commissionObj = {
                    com_ProductID: prodId,
                    com_Sum: commissionsObj[i].price,
                    com_LowSaleRange: commissionsObj[i].bottom,
                    com_TopSaleRange: commissionsObj[i].top,
                };
                allCom.push(commissionObj);

            }

            let allCommissions = [];
            allCommissions = allCom;

            //prepare the new product object- for sending to the DB
            let prodObj = {
                p_ID: prodId,
                p_Name: prodName,
                p_Size: prodSize,
                p_Price: prodPrice,
                p_Description: prodDescription,
                p_UnitsInStock: prodUnitInStock,
                p_DesiredQuantityInStock: prodDesiredQuantityInStock,
                commissions: allCommissions
            };


            //send new data to DB
            const apiUrl = 'https://proj.ruppin.ac.il/bgroup12/prod/api/product';
            fetch(apiUrl,
                {
                    method: 'POST',
                    body: JSON.stringify(prodObj),
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
                                res.status == 400 ?
                                    400
                                    :
                                    null;
                })
                .then(
                    (result) => {

                        if (result != null && result != 409 && result != 500 && result != 400) {

                            setAlertMessage('פעולה בוצעה בהצלחה');
                            setAlertTitle('אישור');
                            setShowAlert(true);

                            var timeout = setTimeout(() => {

                                //Clear fields:
                                resetAll();
                                props.navigation.goBack();         //sending to the father to refresh the tables and close the option to edit the first table

                            }, 1500)
                        }
                        else if (result == 400) {

                            setAlertMessage('מוצר בשם זה ובמידה זו קיים כבר במסד הנתונים');
                            setAlertTitle('אופס!');
                            setShowAlert(true);
                        }
                        else if (result == 409) {

                            setAlertMessage('הנתונים שהוזנו אינם עומדים בתנאי השרת ומסד הנתונים. נא לבדוק את הנתונים שהוזנו ולנסות שנית');
                            setAlertTitle('שגיאה');
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


    //clean all product states
    const resetAll = () => {

        setProdId(null);
        setProdName(null);
        setProdSize(null);
        setProdPrice(0);
        setProdDescription(null);
        setProdUnitInStock(0);
        setProdDesiredQuantityInStock(0);
    }




    //------------Adding Commission-------------//

    //Add another slot to add another commission:
    const addAnotherCommissionToDisplay = () => {

        let tempStateArr = commissionsObj;
        tempStateArr.push({ price: null, top: null, bottom: null });
        setcCommissionsObj(tempStateArr);

        setAlertMessage('הוספת עמלה חדשה');
        setAlertTitle('אישור');
        setShowAlert(true);
    }


    //insert the commision value on this product
    const insertCommissionValue = (text, index) => {

        let array = commissionsObj;
        array[index].price = text;
        setcCommissionsObj(array);
    }


    //insert the low range of commision
    const insertBottomValue = (text, index) => {

        let array = commissionsObj;
        array[index].bottom = text;
        setcCommissionsObj(array);
    }


    //insert the top range of commission
    const insertTopValue = (text, index) => {

        let array = commissionsObj;
        array[index].top = text;
        setcCommissionsObj(array);
    }


    //delete option of COMMISSION & RANGES
    const removeUnit = (index) => {

        let comArray = commissionsObj;
        let removeThis = comArray.splice(index, 1);
        setcCommissionsObj(comArray);

        setAlertMessage('מחיקה בוצעה בהצלחה');
        setAlertTitle('אישור');
        setShowAlert(true);
    }


    //run on all the commissions, show their inputs and insert values
    let addingCommission =

        commissionsObj.map((x, key) => {

            return <View key={key}>

                <MaterialIcons name="cancel" size={30} color="#e95344" onPress={() => removeUnit(key)} style={styles.cancelIcon} />

                <View style={{ flex: 1 }}>
                    <View style={styles.viewContainer}>
                        <Text style={styles.fieldText}>גובה עמלה:</Text>
                        <TextInput
                            defaultValue={commissionsObj[key].price}
                            onChangeText={(e) => insertCommissionValue(e, key)}
                            maxLength={10} style={styles.commissionTxtInput}
                            keyboardType='number-pad'
                        ></TextInput>
                    </View>


                    <View style={styles.viewContainer}>
                        <Text style={styles.fieldText}>טווח תחתון:</Text>
                        <TextInput
                            defaultValue={commissionsObj[key].bottom}
                            onChangeText={(e) => insertBottomValue(e, key)}
                            maxLength={10} style={styles.commissionTxtInput}
                            keyboardType='number-pad'

                        ></TextInput>
                    </View>

                    <View style={styles.viewContainer}>
                        <Text style={styles.fieldText}>טווח עליון:</Text>
                        <TextInput
                            defaultValue={commissionsObj[key].top}
                            onChangeText={(e) => insertTopValue(e, key)}
                            maxLength={10} style={styles.commissionTxtInput}
                            keyboardType='number-pad'

                        ></TextInput>
                    </View>
                </View>

                {
                    commissionsObj.length > 1 ? // add a devider only if we have more than one commission line
                        <Divider style={styles.deviderStyle} />
                        :
                        <></>
                }

            </View>
        })




    return (

        <>
            <StatusBar backgroundColor='#e95344' barStyle='light-content' />

            <Header navigation={props.navigation} showArrow={true} showMenu={true} />

            <ScrollView keyboardShouldPersistTaps={'handled'}>
                <View style={styles.mainContainer}>

                    <Text style={styles.heading}>הוספת מוצר חדש</Text>

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


                    <ScrollView>

                        <View style={styles.viewContainer}>

                            <Text style={styles.fieldText}>מק״ט:</Text>
                            <TextInput
                                onChangeText={(e) => setProdId(parseInt(e))}
                                keyboardType='number-pad'
                                maxLength={20} style={styles.txtInput}
                            ></TextInput>

                        </View>


                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>שם:</Text>
                            <TextInput
                                onChangeText={(e) => setProdName(e)}
                                maxLength={20} style={styles.txtInput}
                            ></TextInput>
                        </View>


                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>מידה:</Text>
                            <TextInput
                                onChangeText={(e) => setProdSize(e)}
                                maxLength={20} style={styles.txtInput}
                            ></TextInput>
                        </View>


                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>מחיר:</Text>
                            <TextInput
                                onChangeText={(e) => setProdPrice(parseInt(e))}
                                maxLength={10} style={styles.txtInput}
                                keyboardType='number-pad'

                            ></TextInput>
                        </View>


                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>תיאור:</Text>
                            <TextInput
                                onChangeText={(e) => setProdDescription(e)}
                                maxLength={20} style={styles.txtInput}
                            ></TextInput>
                        </View>


                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>כמות במלאי:</Text>
                            <TextInput
                                onChangeText={(e) => setProdUnitInStock(parseInt(e))}
                                maxLength={10} style={styles.txtInput}
                                keyboardType='number-pad'
                            ></TextInput>
                        </View>

                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>כמות רצויה:</Text>
                            <TextInput
                                onChangeText={(e) => setProdDesiredQuantityInStock(parseInt(e))}
                                maxLength={10} style={styles.txtInput}
                                keyboardType='number-pad'
                            ></TextInput>
                        </View>


                        <View style={styles.titleViewContainer}>

                            <Text style={styles.commissionTitle}>הגדרת עמלות:</Text>

                            <TouchableOpacity onPress={() => addAnotherCommissionToDisplay()}>
                                <AntDesign name="pluscircle" size={24} color="#3a3b40" />
                            </TouchableOpacity>
                        </View>

                        {addingCommission}

                        <TouchableOpacity
                            onPress={() => { saveNewProduct() }}
                            style={styles.saveButton}>
                            <Text style={styles.saveButtonText}>שמירה </Text>
                        </TouchableOpacity>

                    </ScrollView>

                </View>
            </ScrollView>
        </>
    );
}


const styles = StyleSheet.create({

    //Containers:
    mainContainer: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: 'white',
        minHeight: Dimensions.get('window').height
    },
    viewContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        alignContent: 'center',
    },
    titleViewContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        flex: 1,
        marginTop: 20
    },

    //General: 
    heading: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10
    },
    fieldText: {
        alignSelf: 'center',
        fontWeight: 'bold',
        width: Dimensions.get('window').width * 0.3,
    },



    //Buttons:
    saveButton: {
        backgroundColor: '#e95344',
        borderRadius: 50,
        padding: 7,
        width: Dimensions.get('window').width * 0.9,
        height: 45,
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 30
    },
    saveButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
        alignSelf: 'center',
        fontWeight: 'bold'
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


    //Genereal:
    textStyle: {
        textAlign: 'left',
        marginBottom: 15,
        fontSize: 16
    },
    deviderStyle:
    {
        backgroundColor: '#3a3b40',
        marginTop: 20,
        height: 1
    },
    cancelIcon:
    {
        alignSelf: 'flex-start',
        marginTop: 10
    },
    commissionTitle: {
        flex: 1,
        alignSelf: 'center',
        fontSize: 17,
        fontWeight: 'bold',

    },


    //Inputs:
    txtInput: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 15,
        width: Dimensions.get('window').width * 0.6,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 20,
        borderColor: 'black',
        borderWidth: 1,
        textAlign: 'right'
    },
    commissionTxtInput: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 5,
        width: Dimensions.get('window').width * 0.6,
        //minWidth: 190,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 20,
        borderColor: 'black',
        borderWidth: 1,
        textAlign: 'right'
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