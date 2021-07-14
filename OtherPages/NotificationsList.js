//Outer Imports:
import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableHighlight, View, } from 'react-native';
import { Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import { StatusBar, Switch } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SwipeListView } from 'react-native-swipe-list-view';

//Inner Imports:
import Header from '../Components/Header';

//Icons:
import { Entypo } from '@expo/vector-icons';




export default function NotificationsList(props) {

    const [listData, setListData] = useState([]);

    //Alerts:
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');

    //Loading animation:
    const [spinner, setSpinner] = useState(true);





    useEffect(() => {

        const checkFocus = props.navigation.addListener('focus', () => {

            getUserPersonalCode();
        });

        return checkFocus;
    }, []);


    //Get the user's personal code from the AS:
    const getUserPersonalCode = async () => {

        try {

            const jsonValue = await AsyncStorage.getItem('userDetails')

            if (jsonValue != null) {

                let user = JSON.parse(jsonValue);

                if (user != null) {

                    fetchMyNotifications(user.d_PersonalCode);
                }
                else {

                    setSpinner(false);
                }
            }
            else {

                setSpinner(false);
                setAlertTitle("שגיאה");
                setAlertMessage("התרחשה שגיאה בשליפת מידע אודות המשתמש מהאחסון המקומי");
                setShowAlert(true);
            }
        }
        catch {

            setSpinner(false);
            setAlertTitle("שגיאה");
            setAlertMessage("התרחשה שגיאה בשליפת מידע אודות המשתמש מהאחסון המקומי");
            setShowAlert(true);
        }
    }



    //Get the notifications this user got today:
    const fetchMyNotifications = async (userPersonalCode) => {

        const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/notification/${userPersonalCode}`;
        fetch(apiUrl,
            {
                method: 'GET',
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

                        let notifications = [];

                        result.forEach(element => {

                            notifications.push({

                                key: element.n_ID.toString(),
                                text: element.n_Content,
                            })
                        });

                        setSpinner(false);
                        setListData(notifications);
                    }
                    else if (result == 404) {

                        // tell the user he currently doesn't have notifications

                        setSpinner(false);
                        setListData([{ key: '-1', text: 'לא קיימות נוטיפיקציות' }]);
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
                    setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית             ' + error);
                    setAlertTitle('שגיאה');
                    setShowAlert(true);
                }
            );
    }



    // Kick the row back to its original place:
    const closeRow = (rowMap, rowKey) => {

        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };



    //Clicking the "בוצע" button:
    const deleteRow = (rowMap, rowKey, color) => {

        if (rowKey != -1) { // -1 is when there are no notifications

            closeRow(rowMap, rowKey);
            const newData = [...listData];
            const prevIndex = listData.findIndex(item => item.key === rowKey);
            newData.splice(prevIndex, 1);
            setListData(newData);

            let apiUrl = ''; let fetchMethod = '';
            if (color == 'green') {

                apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/confirmnotification/${rowKey}`;
                fetchMethod = 'GET'
            }
            else if (color == 'red') {

                apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/removenotification/${rowKey}`;
                fetchMethod = 'DELETE'
            }

            //Send request to the DB:
            fetch(apiUrl,
                {
                    method: fetchMethod,
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

                            //All is good
                            // no need to alert the user
                        }
                        else if (result == 404) {

                            setSpinner(false);
                            setAlertMessage('לא נמצאה התאמה במסד הנתונים לנתוני הנוטיפיקציה');
                            setAlertTitle('אופס!');
                            setShowAlert(true);
                        }
                        else if (result == 500) {

                            setSpinner(false);
                            setAlertMessage('התרחשה תקלה במחיקת הנוטיפיקציה ממסד הנתונים. נא לנסות שנית');
                            setAlertTitle('שגיאה');
                            setShowAlert(true);
                        }
                        else {

                            setSpinner(false);
                            setAlertMessage('התרחשה שגיאה לא צפויה. נא לרענן את העמוד ולנסות שנית');
                            setAlertTitle('שגיאה');
                            setShowAlert(true);
                        }
                    },
                    (error) => {

                        setSpinner(false);
                        setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית             ' + error);
                        setAlertTitle('שגיאה');
                        setShowAlert(true);
                    }
                );
        }
    };



    const renderItem = data => (

        <TouchableHighlight
            style={styles.rowFront}
            underlayColor={'white'} // color when touching the item
        >
            <View >
                <Text>{data.item.text}</Text>
            </View>
        </TouchableHighlight>
    );



    const renderHiddenItem = (data, rowMap) => (

        <View style={styles.rowBack}>

            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnLeft]}
                onPress={() => deleteRow(rowMap, data.item.key, 'red')}
            >
                <Entypo name="cross" size={35} color="white" />
                <Text style={styles.buttonText}>לא בוצע</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnRight]}
                onPress={() => deleteRow(rowMap, data.item.key, 'green')}
            >
                <Entypo name="check" size={35} color="white" />
                <Text style={styles.buttonText}>בוצע</Text>
            </TouchableOpacity>
        </View>
    );




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

                <Text style={styles.mainHeading}> נוטיפיקציות יומיות </Text>

                <SwipeListView
                    data={listData}
                    renderItem={renderItem}
                    renderHiddenItem={renderHiddenItem}
                    leftOpenValue={Dimensions.get('window').width * 0.5}
                    rightOpenValue={0}
                    previewRowKey={'0'}
                    previewOpenValue={-40}
                    previewOpenDelay={3000}
                />

            </View>
        </>
    );
}




const styles = StyleSheet.create({

    //Containers:
    mainContainer: {
        minHeight: Dimensions.get('window').height - 45,
        backgroundColor: '#3a3b40',
        flex: 1,
        paddingBottom: 30
    },

    //Headers:
    mainHeading:
    {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: 'white',
        marginVertical: 30
    },



    rowFront: {
        backgroundColor: 'white',
        borderBottomWidth: 4,
        borderColor: '#3a3b40',
        justifyContent: 'center',   // align the text to to middle (vertically)
        height: 80,
        paddingHorizontal: 25
    },
    noNotificationsRow: {
        backgroundColor: 'white',
        borderBottomWidth: 4,
        borderColor: '#3a3b40',
        justifyContent: 'center',   // align the text to to middle (vertically)
        height: 80,
        paddingHorizontal: 25,
        alignItems: 'center'
    },
    rowBack: {
        height: 130,
        alignItems: 'center',
        backgroundColor: '#3a3b40',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',   // place the text in the middle of the button (horizontally)
        bottom: 0,
        justifyContent: 'center',   // place the text in the middle of the button (vertically)
        position: 'absolute',
        top: 0,
        width: 75,
    },



    //BUTTONS:

    buttonText: {
        color: '#FFF',
        fontSize: 10
    },

    //DONE Button
    backRightBtnLeft: {
        backgroundColor: '#e95344',
        right: Dimensions.get('window').width * 0.25,
        width: Dimensions.get('window').width * 0.25,
        borderBottomWidth: 4,
        borderRightWidth: 1,
        borderColor: '#3a3b40',
    },

    //NOT DONE Button
    backRightBtnRight: {
        backgroundColor: '#42c181',
        right: 0,
        width: Dimensions.get('window').width * 0.25,
        borderBottomWidth: 4,
        borderColor: '#3a3b40',
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