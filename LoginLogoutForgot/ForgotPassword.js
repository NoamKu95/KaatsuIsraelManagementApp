//Outer Imports:
import React, { useState } from 'react';
import Header from '../Components/Header';
import { StyleSheet, TouchableOpacity, View, Text, TextInput, StatusBar, Image, KeyboardAvoidingView } from 'react-native';
import { Dimensions } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';



export default function ForgotPassword(props) {


    const sHeight = Dimensions.get('window').height;
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0;      //Lift the screen when keyboard is open

    //User Details:
    const [distributerId, setDistributerId] = useState(null);


    //Alerts:
    const [showAlert, setShowAlert] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');




    //Check the user typed a valid idL
    const checkIdInput = () => {

        if (distributerId == '' || distributerId == null) {

            setAlertTitle('שגיאה');
            setAlertMessage('נא להזין מספר תעודת זהות');
            setShowAlert(true);

        }
        else if (distributerId.length < 9) {

            setAlertTitle('שגיאה');
            setAlertMessage('מספר תעודת הזהות שהוקלד קצר מדי');
            setShowAlert(true);

        }
        else {

            checkIdInDB();
        }
    }

    // Look the id up in the DB & send the password again via email:
    const checkIdInDB = () => {

        const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/resendpassword/${distributerId}`;
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

                        setAlertTitle('פעולה בוצעה בהצלחה');
                        setAlertMessage(result);
                        setShowAlert(true);
                        setDistributerId(null);
                    }
                    else if (result == 404) {

                        setAlertTitle('אופס!');
                        setAlertMessage('לא נמצאה התאמה במסד הנתונים לתעודת הזהות שהוקלדה');
                        setShowAlert(true);
                    }
                    else if (result == 500) {

                        setAlertTitle('שגיאה');
                        setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setShowAlert(true);
                    }
                    else {

                        setAlertTitle('שגיאה');
                        setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setShowAlert(true);
                    }
                },
                (error) => {

                    setAlertTitle('שגיאה');
                    setAlertMessage('התרחשה תקלה בהבאת נתונים ממסד הנתונים. נא לנסות שנית             ' + error);
                    setShowAlert(true);
                }
            );
    }



    return (
        <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={keyboardVerticalOffset}>

            <View style={{ backgroundColor: 'black', height: sHeight }}>

                <StatusBar backgroundColor='#e95344' barStyle='light-content' />

                <Header navigation={props.navigation} showArrow={true} />

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

                <Image
                    source={require('../assets/kaatsu_logo.jpeg')}
                    style={styles.imageStyle}
                />

                <View style={styles.viewContainer}>
                    <TextInput
                        onChangeText={(e) => { setDistributerId(e); }}
                        keyboardType='number-pad'
                        maxLength={9}

                        style={{
                            paddingVertical: 10,
                            paddingHorizontal: 20,
                            marginVertical: 15,
                            minWidth: 190,
                            height: 50,
                            backgroundColor: 'white',
                            borderRadius: 50,
                            borderColor: '#3a3b40',
                            borderWidth: 1,
                            flex: 1,
                            textAlign: 'center'
                        }}
                        defaultValue={distributerId}
                        placeholder={'הקלד מספר ת.ז'}
                    >
                    </TextInput>
                </View>

                <TouchableOpacity
                    onPress={checkIdInput}
                    style={styles.sendPassButton}>
                    <Text
                        style={styles.sendPassText}>
                        שלח סיסמא חדשה
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({

    //General:
    viewContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginRight: 46,
        marginLeft: 46
    },
    imageStyle: {
        height: 260,
        width: 320,
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 40
    },

    //Button:
    sendPassButton: {
        backgroundColor: '#e95344',
        borderRadius: 50,
        padding: 7,
        width: 268,
        height: 52,
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'center',
        margin: 18
    },
    sendPassText:
    {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
        alignSelf: 'center',
        fontWeight: 'bold'
    },


    //Alert:
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