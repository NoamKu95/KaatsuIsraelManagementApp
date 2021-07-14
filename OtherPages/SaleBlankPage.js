//Outer Imports:
import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, StatusBar } from 'react-native';
import { Dimensions } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Inner Imports:
import SalePopupWhoBuys from '../PopUps/SalePopupWhoBuys';
import Header from '../Components/Header';




export default function SaleBlankPage(props) {

    //Uuser Details:
    const [statusOfTheUser, setStatusOfTheUser] = useState('');

    //Alerts:
    const [showAlert, setShowAlert] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');


    useEffect(() => {

        const checkRememberMe = props.navigation.addListener('focus', () => {

            checkUserStatus();
        });

        return checkRememberMe;
    }, []);


    const checkUserStatus = async () => {

        try {

            //import the user from the AS 
            const value = await AsyncStorage.getItem('userDetails');

            if (value !== null) {

                let workerObj = await JSON.parse(value);

                let statusOf = workerObj.d_Status;
                await setStatusOfTheUser(workerObj.d_Status);

                if (statusOf != 'מנהל') {

                    if (statusOf == 'מפיץ פעיל') {

                        props.navigation.navigate('MakeSale', { buyer: 'customer', isInSystem: true });
                    }
                    else {

                        setAlertMessage('רק מפיץ שסטטוסו פעיל רשאי לבצע מכירה');
                        setAlertTitle('שגיאה');
                        setShowAlert(true);

                        var timeout = setTimeout(() => { props.navigation.goBack(); setShowAlert(false); }, 2500)
                    }
                }
            }
            else {

                setAlertMessage('התרחשה שגיאה בשליפה מהאחסון המקומי');
                setAlertTitle('שגיאה');
                setShowAlert(true);
            }
        }
        catch (e) {

            setAlertMessage('התרחשה שגיאה בשליפה מהאחסון המקומי');
            setAlertTitle('שגיאה');
            setShowAlert(true);
        }
    }


    
    return (
        <View style={styles.mainContainer}>

            <Header navigation={props.navigation} showArrow={true} showMenu={true} />

            <StatusBar backgroundColor='#e95344' barStyle='light-content' />

            <AwesomeAlert
                show={showAlert}
                showProgress={false}
                title={alertTitle}
                message={alertMessage}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={false}
                showConfirmButton={false}
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

            {
                statusOfTheUser == 'מנהל' ?
                    <SalePopupWhoBuys navigation={props.navigation} />
                    :
                    <Text></Text>
            }

        </View>
    );
}

const styles = StyleSheet.create({

    //Containers:
    mainContainer:
    {
        backgroundColor: '#3a3b40',
        height: Dimensions.get('window').height,
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