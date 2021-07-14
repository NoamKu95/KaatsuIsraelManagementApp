//Outer Imports:
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, TextInput, StatusBar, Image, KeyboardAvoidingView } from 'react-native';
import { Dimensions } from 'react-native';
import { CheckBox } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';
import Spinner from 'react-native-loading-spinner-overlay';

//Inner Imports:
import Header from '../Components/Header';

//Icons:
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';




export default function Login(props) {

    const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0;      // To lift the screen when keyboard is open

    //Remember me Checkbox:
    const [checkedRemember, setCheckedRemember] = useState(false);      // Does the user want to be remembered?

    //Credentials:
    const [userEmail, setUserEmail] = useState(null);                   // Email adress to login
    const [userPass, setUserPass] = useState(null);                     // Password to login

    //Show / Hide the password typed in:
    const [showPassword, setShowPassword] = useState(false);

    //Alerts:
    const [showAlert, setShowAlert] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    //Loading animation:
    const [spinner, setSpinner] = useState(false);




    React.useEffect(() => {

        const checkRememberMe = props.navigation.addListener('focus', () => {

            setShowPassword(false);
            checkIfUnknownUser();
        });

        return checkRememberMe;
    }, []);


    // Check in the AS if they user asked to be remembered:
    const checkIfUnknownUser = async () => {

        try {
            const value = await AsyncStorage.getItem('rememberUser');

            if (value !== null) {

                if (value === 'true') {

                    props.navigation.navigate('DashboardStack', { screen: 'DataDashboard' });
                }
            }
        }
        catch (e) {

            setAlertMessage('התרחשה שגיאה בשליפה מהאחסון המקומי');
            setAlertTitle('שגיאה');
            setShowAlert(true);
        }
    }


    //check both fields have content & that email is in valid structure:
    const validateFields = () => {

        if (userEmail == '' || userEmail == null) {

            setAlertMessage('נא להזין כתובת אימייל');
            setAlertTitle('שגיאה');
            setShowAlert(true);
        }
        else {

            let reg = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
            let email = userEmail;
            if (reg.test(email) === false) {

                setAlertMessage('כתובת האימייל שהוזנה אינה תקינה');
                setAlertTitle('שגיאה');
                setShowAlert(true);
            }
            else {

                if (userPass == '' || userPass == null) {

                    setAlertMessage('נא להזין סיסמא');
                    setAlertTitle('שגיאה');
                    setShowAlert(true);
                }
                else {

                    if (userPass.length < 7) {
                        setAlertMessage('הסיסמא שהוזנה קצרה מדי');
                        setAlertTitle('שגיאה');
                        setShowAlert(true);
                    }
                    else {

                        checkLoginCredentials();
                    }
                }
            }
        }
    }





    //Check in the DB if there is a match to the credentials:
    const checkLoginCredentials = async () => {

        setSpinner(true); //Start loadign animation while data is being proccessed

        const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/checklogincredentials/${userEmail}/${userPass}/`;
        try {

            const dataResponse = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            if (!dataResponse.ok) {

                setSpinner(false);
                setAlertMessage('לא נמצאה התאמה במסד הנתונים לנתוני ההתחברות שהוזנו');
                setAlertTitle('אופס!');
                setShowAlert(true);
            }
            else {

                //Save returned data on the distributer on the Async Storage:
                const resData = await dataResponse.json();
                await AsyncStorage.setItem('userDetails', JSON.stringify(resData));

                //Save the "remmember me" descision to the Async Storage:
                await AsyncStorage.setItem('rememberUser', JSON.stringify(checkedRemember));

                setSpinner(false);
                //Move user into the app:
                props.navigation.navigate('DashboardStack', { screen: 'DashboardData' });

                //Clear fields:
                setUserEmail(null);
                setUserPass(null);
            }
        }
        catch (error) {

            setSpinner(false);
            setAlertMessage('התרחשה שגיאה בגישה למסד הנתונים');
            setAlertTitle('שגיאה');
            setShowAlert(true);
        }
    }



    return (
        <>
            <View style={styles.mainContainer}>

                <StatusBar backgroundColor='#e95344' barStyle='light-content' />

                <Header navigation={props.navigation} />

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

                <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={keyboardVerticalOffset}>

                    <Image source={require('../assets/kaatsu_logo.jpeg')} style={styles.imageStyle} />

                    <View style={styles.viewContainer}>
                        <TextInput
                            style={styles.txtInputWithIcon}
                            placeholder={'אימייל'}
                            onChangeText={(e) => setUserEmail(e)}
                            keyboardType='email-address'
                            defaultValue={userEmail}
                        >
                        </TextInput>
                        <Ionicons name="at" size={28} color="black" style={styles.iconStyle} />
                    </View>

                    {
                        showPassword ?
                            <View style={styles.viewContainer}>

                                <TextInput
                                    style={styles.txtInputWithIcon}
                                    placeholder={'סיסמא'}
                                    onChangeText={(e) => setUserPass(e)}
                                    defaultValue={userPass}
                                >
                                </TextInput>

                                <MaterialCommunityIcons name="eye-outline" size={24} color="#3a3b40" style={styles.iconStyle} onPress={() => { setShowPassword(false) }} />

                            </View>
                            :
                            <View style={styles.viewContainer}>


                                <TextInput secureTextEntry
                                    style={styles.txtInputWithIcon}
                                    placeholder={'סיסמא'}
                                    onChangeText={(e) => setUserPass(e)}
                                    defaultValue={userPass}
                                >
                                </TextInput>

                                <MaterialCommunityIcons name="eye-off-outline" size={24} color="#3a3b40" style={styles.iconStyle} onPress={() => { setShowPassword(true) }} />

                            </View>
                    }
                </KeyboardAvoidingView>

                <TouchableOpacity
                    onPress={() => validateFields()}
                    style={styles.loginButton}
                >
                    <Text
                        style={styles.loginButtonText}>
                        כניסה
                    </Text>
                </TouchableOpacity>


                <View style={styles.bottomContainerStyle}>

                    <TouchableOpacity
                        onPress={() => props.navigation.navigate('ForgotPassword')}
                    >
                        <Text style={styles.textStyle}>
                            שכחתי סיסמא
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <CheckBox
                            onPress={() => checkedRemember ? setCheckedRemember(false) : setCheckedRemember(true)}
                            title='זכור אותי'
                            checked={checkedRemember}
                            checkedColor='#e95344'
                            containerStyle={styles.chContainerStyle}
                            textStyle={styles.chTextStyle}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({

    //Containers:
    mainContainer:
    {
        backgroundColor: 'black',
        height: Dimensions.get('window').height
    },
    viewContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        alignSelf: 'center',
        width: Dimensions.get('window').width * 0.9
    },
    //Forgot pass + chb:
    bottomContainerStyle: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'baseline',
        alignSelf: 'center',
        width: Dimensions.get('window').width * 0.8,
    },


    //Image:
    imageStyle: {
        height: 260,
        width: 320,
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 20
    },


    //Icons:
    iconStyle: {
        backgroundColor: 'white',
        paddingLeft: 15,
        paddingTop: 11,
        borderBottomLeftRadius: 20,
        borderTopLeftRadius: 20,
        height: 50
    },


    //Text Inputs:
    txtInputWithIcon:
    {
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginVertical: 15,
        height: 50,
        backgroundColor: 'white',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        flex: 1,
        textAlign: 'center',
        paddingLeft: 50,
    },


    //Save Button:
    loginButton: {
        backgroundColor: '#e95344',
        borderRadius: 50,
        padding: 7,
        width: Dimensions.get('window').width * 0.9,
        height: 55,
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'center',
        margin: 18
    },
    loginButtonText:
    {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
        alignSelf: 'center',
        fontWeight: 'bold'
    },


    //Checkbox:
    chTextStyle: {
        color: '#fff',
        fontSize: 15
    },
    chContainerStyle: {
        backgroundColor: 'black',
        borderWidth: 0,
    },


    //Forgot Pass:
    textStyle: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold'
    },

    //Spiner:
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
})