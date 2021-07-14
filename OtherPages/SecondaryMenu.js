//Outer Imports:
import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Inner Imports:
import Header from '../Components/Header';

//Icons:
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';




export default function SecondaryMenu(props) {

    //User:
    const [userType, setUserType] = useState('מנהל');


    //Alerts:
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');



    useEffect(() => {

        const checkFocus = props.navigation.addListener('focus', () => {

            checkUserType();
        });

        return checkFocus;

    }, []);



    const checkUserType = async () => {

        try {

            const jsonValue = await AsyncStorage.getItem('userDetails')

            if (jsonValue != null) {

                let user = JSON.parse(jsonValue);

                await setUserType(user.d_Status);
            }
            else {

                setAlertMessage('התרחשה שגיאה בשליפת סוג המשתמש מהאחסון המקומי');
                setShowAlert(true);
                setAlertTitle('שגיאה')
            }

        } catch {

            setAlertMessage('התרחשה שגיאה בשליפת סוג המשתמש מהאחסון המקומי');
            setShowAlert(true);
            setAlertTitle('שגיאה')
        }
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


            <ScrollView>

                <View style={styles.mainContainer} >

                    <View>
                        <Text style={styles.heading}> פעולות נוספות </Text>
                    </View>

                    {
                        userType == 'מנהל' ?
                            <View>

                                <View style={styles.squaresContainer}>

                                    <TouchableOpacity style={styles.square} onPress={() => props.navigation.navigate('ConfirmDenyMatches')}>

                                        <FontAwesome5 name="people-arrows" size={50} color='#3a3b40' />
                                        <Text style={styles.textStyle}>ניהול לידים</Text>

                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.square} onPress={() => props.navigation.navigate('DeploymentMap')}>

                                        <MaterialIcons name="person-pin" size={50} color='#3a3b40' />
                                        <Text style={styles.textStyle}>ניהול מפיצים</Text>

                                    </TouchableOpacity>

                                </View>

                                <View style={styles.squaresContainer}>
                                    <TouchableOpacity style={styles.square} onPress={() => props.navigation.navigate('ViewAllAvailableHelpfullContent')}>

                                        <Entypo name="folder-video" size={50} color='#3a3b40' />
                                        <Text style={styles.textStyle}>תוכן עזר</Text>

                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.square} onPress={() => props.navigation.navigate('ManageStock')}>

                                        <MaterialIcons name="inventory" size={50} color="#3a3b40" />
                                        <Text style={styles.textStyle}>ניהול מלאי</Text>

                                    </TouchableOpacity>

                                </View>

                                <View style={styles.squaresContainer}>

                                    <TouchableOpacity style={styles.square} onPress={() => props.navigation.navigate('DownloadReports')}>

                                        <Ionicons name="newspaper-sharp" size={50} color="#3a3b40" />
                                        <Text style={styles.textStyle}>הפקת דוחות</Text>

                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.square} onPress={() => props.navigation.navigate('HistoryDataMenu')}>

                                        <FontAwesome name="table" size={50} color={'#3a3b40'} />
                                        <Text style={styles.textStyle}>ארכיון נתונים</Text>

                                    </TouchableOpacity>
                                </View>

                                <View style={styles.logoutBlockContainer}>

                                    <TouchableOpacity style={styles.square} onPress={() => props.navigation.navigate('UserPersonalInfo')}>

                                        <MaterialCommunityIcons name="account-details" size={50} color="#3a3b40" />
                                        <Text style={styles.textStyle}>עדכון פרטים אישיים</Text>

                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.square} onPress={() => props.navigation.navigate('SystemConstants')}>

                                        <FontAwesome name="gear" size={50} color={'#3a3b40'} />
                                        <Text style={styles.textStyle}>קבועי מערכת</Text>

                                    </TouchableOpacity>
                                </View>

                                <View style={styles.logoutBlockContainer}>

                                    <TouchableOpacity style={styles.logoutBlock} onPress={() => props.navigation.navigate('Logout')}>

                                        <AntDesign name="logout" size={30} color="#3a3b40" />
                                        <Text style={styles.logoutTextStyle}>התנתקות</Text>

                                    </TouchableOpacity>

                                </View>
                            </View>
                            :
                            <View>

                                <View style={styles.squaresContainer}>
                                    <TouchableOpacity style={styles.square} onPress={() => props.navigation.navigate('ViewAllAvailableHelpfullContent')}>

                                        <Entypo name="folder-video" size={50} color={'#3a3b40'} />
                                        <Text style={styles.textStyle}>תוכן עזר</Text>

                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.square} onPress={() => props.navigation.navigate('SalaryCalculator')}>

                                        <FontAwesome5 name="calculator" size={50} color="#3a3b40" />
                                        <Text style={styles.textStyle}>מחשבון שכר</Text>

                                    </TouchableOpacity>

                                </View>

                                <View style={styles.squaresContainer}>

                                    <TouchableOpacity style={styles.square} onPress={() => props.navigation.navigate('UserPersonalInfo')}>

                                        <MaterialCommunityIcons name="account-details" size={50} color="#3a3b40" />
                                        <Text style={styles.textStyle}>עדכון פרטים אישיים</Text>

                                    </TouchableOpacity>

                                </View>

                                <View style={styles.logoutBlockContainer}>
                                    <TouchableOpacity style={styles.logoutBlock} onPress={() => props.navigation.navigate('Logout')}>

                                        <AntDesign name="logout" size={30} color="#3a3b40" />
                                        <Text style={styles.logoutTextStyle}>התנתקות</Text>

                                    </TouchableOpacity>
                                </View>

                            </View>
                    }

                </View>

            </ScrollView>
        </>
    );
}


const styles = StyleSheet.create({

    //Containers:
    mainContainer: {
        backgroundColor: '#3a3b40',
        minHeight: Dimensions.get('window').height - 45,
        paddingBottom: 20
    },
    squaresContainer:
    {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 30
    },
    square:
    {
        backgroundColor: 'white',
        height: Dimensions.get('window').width / 3,
        width: Dimensions.get('window').width / 3,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logoutBlockContainer:
    {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 30,
    },
    logoutBlock:
    {
        backgroundColor: 'white',
        width: Dimensions.get('window').width / 3,
        height: 70,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },


    //Page name
    heading: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 40,
        marginBottom: 10,
        color: 'white'
    },


    //Texts:
    textStyle:
    {
        fontWeight: 'bold',
        marginVertical: 7,
        textAlign: 'center'
    },
    logoutTextStyle:
    {
        fontWeight: 'bold',
        margin: 7,
        textAlign: 'center'
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
    },
});