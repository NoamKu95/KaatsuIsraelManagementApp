//Outer Imports:
import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import { Dimensions } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Spinner from 'react-native-loading-spinner-overlay';

//Inner Imports:
import Header from '../Components/Header';

//Icons:
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';




export default function ManagerDashboard(props) {

    //User Personal Code:
    const [userCode, setUserCode] = useState('');

    //Desired Salary:
    const [isEditing, setIsEditing] = useState(false);
    const [destination, setDestination] = useState(0);
    const [newDestination, setNewDestination] = useState(null);

    //Data to display:
    const [nextCommission, setNextCommission] = useState(0);
    const [currentSalary, setCurrentSalary] = useState(0);
    const [precentage, setPrecentage] = useState(0);
    const [setsLeft, setSetsLeft] = useState(0);
    const [itemsSold, setItemsSold] = useState(0);

    //Alerts:
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');

    //Loading animation:
    const [spinner, setSpinner] = useState(false);




    useEffect(() => {

        const checkFocus = props.navigation.addListener('focus', () => {
            //The screen is focused -> check who's the user & fetch data to be up-to-date

            getUserCode();
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return checkFocus;
    }, []);


    //Pull the user's personal code from the AS:
    const getUserCode = async () => {

        const jsonValue = await AsyncStorage.getItem('userDetails')

        if (jsonValue != null) {

            let user = JSON.parse(jsonValue);

            await setUserCode(user.d_PersonalCode);
            fetchData(user.d_PersonalCode)
        }
        else {

            setAlertMessage('התרחשה תקלה בשליפת פרטי המשתמש מהאחסון המקומי. נא לרענן ולנסות שנית');
            setAlertTitle('שגיאה');
            setShowAlert(true);
        }
    }


    //Get all the needed data to display from the DB:
    const fetchData = async (code) => {

        setSpinner(true);

        const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/salarycalculator/${code}`;
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

                        setSpinner(false);

                        setDestination(`${result.desiredSalary}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                        setNextCommission(result.nextCommission);
                        setCurrentSalary(`${result.currentSalary}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                        setPrecentage(Math.round(result.currentSalary / result.desiredSalary * 100));
                        setSetsLeft(result.setsLeftToSell);
                        setItemsSold(result.itemsSoldThisMonth);
                    }
                    else if (result != 500) {

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


    //Update the desired salary in the DB to the new sum:
    const updateDesiredSalary = () => {

        if (newDestination != null) { //only if desired salary was changed

            //Check that the new desired salary contains numbers only:
            let numbers = /^[0-9]+$/;
            if (!newDestination.match(numbers)) {

                setAlertMessage('על משכורת היעד לכלול מספרים שלמים בלבד');
                setAlertTitle('שגיאה');
                setShowAlert(true);
            }
            else {

                if (userCode != '') {

                    setSpinner(true);


                    //Update the new desired salary in the DB:
                    const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/salarycalculator/${userCode}/${newDestination}`;
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

                                    setSpinner(false);
                                    setAlertMessage('משכורת היעד החדשה עודכנה בהצלחה');
                                    setAlertTitle('פעולה בוצעה בהצלחה');
                                    setShowAlert(true);
                                    setIsEditing(false);

                                    fetchData(userCode);
                                }
                                else if (result == 404) {

                                    setSpinner(false);
                                    setAlertMessage('לא נמצאה התאמה במסד הנתונים לנתוני המשתמש');
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
                else {

                    setSpinner(false);
                    setAlertMessage('בשל תקלה בשליפת נתוני המשתמש מהאחסון המקומי לא ניתן לעדכן את משכורת היעד. נא לרענן את העמוד ולנסות שנית');
                    setAlertTitle('שגיאה');
                    setShowAlert(true);
                }
            }
        }
        else {

            setIsEditing(false);
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

            <View style={styles.mainContainer}>

                <View style={styles.topChunk}>

                    <View style={styles.salaryDestinationContainer}>

                        <Text style={styles.salarydestinationHeading}>משכורת יעד</Text>

                        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>

                            <TextInput
                                editable={isEditing ? true : false}
                                placeholder={`${destination}`}
                                style={isEditing ? styles.txtInputWithIconEditing : styles.txtInputWithIcon}
                                onChangeText={(e) => setNewDestination(e)}
                                keyboardType={'number-pad'}
                            >
                            </TextInput>

                            {
                                isEditing ?
                                    <AntDesign name="checkcircle" size={28} color="#42c181" style={styles.checkIconStyle} onPress={() => updateDesiredSalary()} />
                                    :
                                    <MaterialCommunityIcons name="pencil-circle" size={35} color="#e95344" style={styles.pencilIconStyle} onPress={() => setIsEditing(true)} />
                            }

                        </View>

                    </View>


                    <View style={styles.nextCommissionContainer}>

                        <Text>סך העמלה הבאה</Text>

                        <View style={styles.commissionWrapper}>
                            <Text style={styles.commissionContent}>{nextCommission}</Text>
                            <Text> ש"ח </Text>
                        </View>

                    </View>

                </View>


                <View style={styles.gaugeContainer}>
                    <AnimatedCircularProgress
                        size={285}
                        width={22}
                        rotation={180}                      // start at the bottom of the circle
                        lineCap='butt'                      // shape of endings of the colored part
                        tintColor={'#42c181'}
                        fill={precentage}                  // precentage to fill the gauge
                        backgroundColor='#3a3b40'           // color of part that isn't filled
                    >
                        {
                            (fill) => (
                                <Text>

                                    <Text style={styles.gaugeText}>
                                        {currentSalary}
                                    </Text>
                                    <Text>
                                        ש"ח
                                    </Text>

                                </Text>
                            )
                        }

                    </AnimatedCircularProgress>
                </View>


                <View style={styles.twoPiecesChunk}>

                    <View style={styles.halfWidthChunk}>
                        <Text style={styles.textOneStyle}>סטים שנותר למכור</Text>
                        <Text style={styles.textTwoStyle}> {setsLeft} </Text>
                    </View>

                    <View style={styles.halfWidthChunk}>
                        <Text style={styles.textOneStyle}>פריטים שנמכרו החודש</Text>
                        <Text style={styles.textTwoStyle}> {itemsSold} </Text>
                    </View>
                </View>

            </View>

        </>
    )
}

const styles = StyleSheet.create({

    //Containers:
    mainContainer:
    {
        backgroundColor: 'white',
        paddingHorizontal: 10,
        minHeight: Dimensions.get('window').height - 45
    },
    nextCommissionContainer:
    {
        flexDirection: 'column',
        width: Dimensions.get('window').width * 0.3,
        height: 100
    },
    salaryDestinationContainer:
    {
        flexDirection: 'column',
        width: Dimensions.get('window').width * 0.42,
        height: 100
    },
    commissionWrapper:
    {
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center'
    },

    //Texts:
    textOneStyle:
    {
        textAlign: 'center',
        fontSize: 18,
        padding: 3
    },
    textTwoStyle:
    {
        textAlign: 'center',
        fontSize: 23,
        fontWeight: 'bold'
    },
    commissionContent:
    {
        fontWeight: 'bold',
        fontSize: 30
    },
    salarydestinationHeading:
    {
        fontWeight: 'bold',
        textAlign: 'center'
    },


    //Chunks:
    topChunk:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 25
    },
    twoPiecesChunk:
    {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    halfWidthChunk:
    {
        backgroundColor: '#dfe0e4',
        height: 150,
        width: Dimensions.get('window').width / 2.3,
        marginHorizontal: 10,
        borderRadius: 15,
        justifyContent: 'center',
        padding: 5,
        textAlign: 'center'
    },



    //Text Input:
    txtInputWithIcon: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 15,
        height: 50,
        backgroundColor: '#dfe0e4',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        flex: 1,
        textAlign: 'right',
        fontSize: 18,
        fontWeight: 'bold',
    },
    txtInputWithIconEditing:
    {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 15,
        height: 50,
        backgroundColor: 'white',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderColor: 'black',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        textAlign: 'right',
        fontSize: 18,
        fontWeight: 'bold',
    },
    checkIconStyle: {
        backgroundColor: 'white',
        paddingLeft: 15,
        paddingTop: 10,
        borderWidth: 1,
        borderRightWidth: 0,
        borderColor: 'black',
        borderBottomLeftRadius: 20,
        borderTopLeftRadius: 20,
        height: 50
    },
    pencilIconStyle:
    {
        backgroundColor: '#dfe0e4',
        paddingLeft: 15,
        paddingTop: 8,
        borderBottomLeftRadius: 20,
        borderTopLeftRadius: 20,
        height: 50
    },


    //Gauge:
    gaugeText:
    {
        fontSize: 52,
        fontWeight: 'bold'
    },
    gaugeContainer:
    {
        alignSelf: 'center',
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