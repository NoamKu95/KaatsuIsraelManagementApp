//Outer Imports:
import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, StatusBar } from 'react-native';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';
import AwesomeAlert from 'react-native-awesome-alerts';

//Inner Imports:
import Header from '../Components/Header';



export default function Logout(props) {

    const [userID, setUserID] = useState('');

    //Alerts:
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');



    useEffect(() => {

        const checkFocus = props.navigation.addListener('focus', () => {

            getUserPersonalCode();

        });

        return checkFocus;

    }, []);



    const getUserPersonalCode = async () => {

        try {
            const jsonValue = await AsyncStorage.getItem('userDetails')

            if (jsonValue != null) {

                let user = JSON.parse(jsonValue);

                setUserID(user.d_PersonalCode);
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



    //Delete data from AS:
    const logUserOut = async () => {

        try {

            const jsonValue = await AsyncStorage.getItem('userDetails')

            if (jsonValue != null) {

                //Remove the details of the user from the Async Storage:
                await AsyncStorage.setItem('userDetails', '');

                //Remove the (remember me = true) from the Async Storage:
                await AsyncStorage.setItem('rememberUser', JSON.stringify(false));

                props.navigation.navigate('loginStack', { screen: 'Login' });
            }
            else {

                setShowAlert(true);
                setAlertTitle('שגיאה');
                setAlertMessage('התרחשה שגיאה במחיקת נתוני המשתמש מהזיכרון. נא לרענן את העמוד ולנסות שנית')
            }
        } catch {

            setSpinner(false);
            setAlertMessage('התרחשה שגיאה בשליפה מהאחסון המקומי');
            setAlertTitle('שגיאה');
            setShowAlert(true);
        }
    }



    //Delete token from DB:
    const deleteToken = async (userID) => {

        const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/removetoken/${userID}`;
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

                        logUserOut();
                    }
                    else if (result == 404) {

                        setShowAlert(true);
                        setAlertTitle('אופס!');
                        setAlertMessage('לא נמצאה התאמה במסד הנתונים לנתוני המשתמש')
                    }
                    else if (result == 500) {

                        setShowAlert(true);
                        setAlertTitle('שגיאה');
                        setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית')
                    }
                    else {

                        setShowAlert(true);
                        setAlertTitle('שגיאה');
                        setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית')
                    }
                },
                (error) => {

                    setShowAlert(true);
                    setAlertTitle('שגיאה');
                    setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית             ' + error)
                }
            );
    }


    return (

        <View style={styles.mainContainer}>

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

            <View style={styles.containerStyle}>

                <TouchableOpacity
                    style={styles.backArrowStyle}
                    onPress={() => props.navigation.navigate('SecondaryMenu')}
                >
                    <FontAwesome5 name="long-arrow-alt-left" size={40} color="#e95344" />

                </TouchableOpacity>

                <View>
                    <Text style={styles.headerText}>
                        האם להתנתק מהאפליקציה?
                    </Text>
                </View>

                <View style={styles.buttonsContainer}>

                    <TouchableOpacity
                        style={styles.yesLogoutButton}
                        onPress={() => deleteToken(userID)}
                    >
                        <Text style={styles.buttonText}>
                            כן
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.noLogoutButton}
                        onPress={() => props.navigation.navigate('SecondaryMenu')}
                    >
                        <Text style={styles.buttonText}>
                            לא
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({

    //Container
    mainContainer:
    {
        backgroundColor: '#3a3b40',
        height: Dimensions.get('window').height
    },
    containerStyle: {
        backgroundColor: 'white',
        marginTop: Dimensions.get('window').height / 4,
        marginHorizontal: 15,
        borderRadius: 13,
        paddingHorizontal: 23,
        paddingVertical: 7,
    },

    //Heading text
    headerText: {
        color: 'black',
        marginBottom: 30,
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold'
    },

    // Yes No Buttons
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    yesLogoutButton: {
        backgroundColor: '#42c181',
        borderRadius: 50,
        width: 130,
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        margin: 8,
        marginBottom: 15
    },

    noLogoutButton: {
        backgroundColor: '#e95344',
        borderRadius: 50,
        width: 130,
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        margin: 8,
        marginBottom: 15
    },

    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 20,
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
    }
})