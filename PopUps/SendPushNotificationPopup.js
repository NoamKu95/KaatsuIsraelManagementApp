//Outer Imports:
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';

//Icons:
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';




export default function SendPushNotificationPopup(props) {

    const [modalVisible, setModalVisible] = useState(false);            //Opening and closing the popup

    //Fields of the push notification:
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [distributers, setDistributers] = useState([]);

    //Alerts:
    const [showAlert, setShowAlert] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');






    const fetchActiveDistributers = async () => {

        let apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/distributers/`;
        await fetch(apiUrl,
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
                    res.status == 200 ?
                        res.json()
                        :
                        res.status == 500 ?
                            500
                            :
                            null;
            })
            .then(
                (result) => {

                    if (result != null && result != 404 && result != 500) {

                        let activeDistributers = [];
                        for (let i = 0; i < result.length; i++) {

                            if ((result[i].d_Status == "מפיץ פעיל" || result[i].d_Status == "מנהל") && result[i].d_ExpoToken != null) {

                                activeDistributers.push(result[i].d_ExpoToken);
                            }
                        }

                        setDistributers(activeDistributers);
                    }
                    else if (result == 404) {

                        setAlertMessage('לא נמצאו מפיצים פעילים במסד הנתונים');
                        setAlertTitle('אופס!');
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

                    setAlertMessage('התרחשה תקלה בתקשורת עם מסד הנתונים. נא לנסות שנית             ' + error);
                    setAlertTitle('שגיאה');
                    setShowAlert(true);
                }
            )
    }


    const checkInputs = () => {

        if (title == '') {

            setAlertMessage('יש להזין כותרת להודעה');
            setAlertTitle('שגיאה');
            setShowAlert(true);
        }
        else {

            if (content == '') {

                setAlertMessage('יש להזין תוכן להודעה');
                setAlertTitle('שגיאה');
                setShowAlert(true);
            }
            else {

                if (distributers.length == 0) {

                    setAlertMessage('לא נמצאו מפיצים פעילים במערכת');
                    setAlertTitle('שגיאה');
                    setShowAlert(true);
                }
                else {

                    let titleToPush = title;
                    let contentToPush = content;
                    let allDist = [];
                    allDist = distributers;

                    setContent('');
                    setTitle('');

                    props.sendDataToParent(titleToPush, contentToPush, allDist);
                }
            }
        }
    }

    return (

        <View style={styles.mainContainer}>

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

            <Modal animationType="slide" transparent={true} visible={modalVisible} >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => {

                                setModalVisible(!modalVisible);
                                setTitle('');
                                setContent('');
                            }}
                        >
                            <FontAwesome5 name="long-arrow-alt-left" size={40} color="#e95344" />
                        </TouchableOpacity>


                        <Text style={styles.modalText}>שליחת הודעת דחיפה</Text>

                        <View style={styles.elementContainer}>

                            <Text style={styles.textStyle}>כותרת:</Text>
                            <TextInput
                                defaultValue={title}
                                maxLength={30}
                                style={styles.txtInput}
                                onChangeText={(e) => { setTitle(e) }}
                            >
                            </TextInput>

                        </View>

                        <View style={styles.elementContainer}>

                            <Text style={styles.textStyle}>תוכן:</Text>

                            <TextInput
                                defaultValue={content}
                                scrollEnabled
                                multiline
                                numberOfLines={3}
                                maxLength={70}
                                style={styles.multilineInput}
                                onChangeText={(e) => { setContent(e) }}
                            >
                            </TextInput>

                        </View>

                        <TouchableOpacity
                            style={styles.saveButtonStyle}
                            onPress={() => checkInputs()}>
                            <Text style={styles.saveButtonText}>שליחה</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>

            <TouchableOpacity onPress={() => { setModalVisible(true); fetchActiveDistributers() }} style={{ justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>

                <Text style={styles.pushStyle}>דחיפה</Text>
                <MaterialCommunityIcons name="send-circle" size={30} color="white"
                    style={{ transform: [{ rotate: '180deg' }] }}
                    onPress={() => { setModalVisible(true); fetchActiveDistributers() }} />

            </TouchableOpacity>

        </View>
    );
}


const styles = StyleSheet.create({

    //Containers:
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
    elementContainer:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20
    },


    //General:
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 22,
    },
    textStyle:
    {
        fontSize: 16,
        fontWeight: 'bold',
        margin: 5,
        width: 70
    },
    modalText: {
        marginBottom: 30,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold'
    },
    pushStyle:
    {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 10
    },

    //Save Button:
    savebutton: {
        backgroundColor: '#e95344',
        borderRadius: 50,
        padding: 7,
        width: 335,
        height: 45,
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    saveButtonStyle: {
        backgroundColor: '#e95344',
        borderRadius: 50,
        width: 290,
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 20,
        marginTop: 20
    },
    saveButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 20,
        alignSelf: 'center',
        fontWeight: 'bold'
    },


    //Close Button:
    closeButton: {
        textAlign: "left",
        marginLeft: 240,
    },


    //Text Input:
    multilineInput: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        width: 210,
        height: 90,
        backgroundColor: 'white',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#3a3b40',
        flex: 1,
        textAlign: 'right',
        textAlignVertical: 'top',
    },
    txtInput:
    {
        paddingVertical: 15,
        paddingHorizontal: 20,
        width: 210,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#3a3b40',
        flex: 1,
        textAlign: 'right',
        textAlignVertical: 'top',
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