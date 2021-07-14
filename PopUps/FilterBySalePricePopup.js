//Outer Imports:
import React from 'react';
import { useState } from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity, Switch, TextInput } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Dimensions } from 'react-native';

//Icons:
import { FontAwesome5 } from '@expo/vector-icons';




export default function FilterBySalePricePopup(props) {

    //Modal:
    const [modalVisible, setModalVisible] = useState(false); //For opening and closing the popup

    // Min total: 
    const [minNum, setMinNum] = useState(null);

    // Max total:
    const [maxNum, setMaxNum] = useState(null);

    // Selected range in words:
    const [selection, setSelection] = useState(null);

    //switch
    const [switchValue, setSwitchValue] = useState(false); // switch can be on (true) or off (false)

    //Alerts:
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');


    //Turn the switch OFF from the parent component:
    const toggleSwitch = value => {
        //onValueChange of the switch this function will be called

        if (minNum != null && maxNum != null) {

            setSwitchValue(value);
            setMaxNum(null);
            setMinNum(null);
            setSelection(null);

            props.sendDataToParent(-1, -1);
        }
    };



    //Send the selected range to the parent component & close modal:
    const getFilter = () => {

        if (minNum == '' || minNum == null || maxNum == '' || maxNum == null) {

            setAlertMessage('יש לבחור טווח עליון וטווח תחתון');
            setAlertTitle('שגיאה');
            setShowAlert(true);
        }
        else if (parseInt(minNum) < 0 || parseInt(maxNum) < 0) {

            setAlertMessage('יש לבחור מספר מינימלי ומקסימלי חיובי');
            setAlertTitle('שגיאה');
            setShowAlert(true);
        }
        else if (parseInt(minNum) > parseInt(maxNum)) {

            setAlertMessage('לא ניתן לבחור מספר מינימלי הגדול מהמקסימלי');
            setAlertTitle('שגיאה');
            setShowAlert(true);
        }
        else if (minNum.includes('.') || maxNum.includes('.')) {

            setAlertMessage('לא ניתן לבחור מספר לא שלם');
            setAlertTitle('שגיאה');
            setShowAlert(true);
        }
        else {

            setSwitchValue(true);
            setModalVisible(!modalVisible);
            setSelection('מ: ' + minNum + '  עד: ' + maxNum);

            props.sendDataToParent(minNum, maxNum);
        }
    }



    return (
        <View style={styles.centeredView}>

            <Modal animationType="slide" transparent={true} visible={modalVisible} >

                <View style={styles.centeredView}>

                    <View style={styles.modalView}>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                                setMinNum(null);
                                setMaxNum(null);
                                setSwitchValue(false);
                                setSelection(null);
                                props.sendDataToParent(-1, -1);
                            }}
                        >
                            <FontAwesome5 name="long-arrow-alt-left" size={40} color="#e95344" />
                        </TouchableOpacity>

                        <Text style={styles.modalTitle}>סינון לפי סכום מכירה </Text>

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

                        <View style={styles.min_max_container}>

                            <Text style={styles.fromtoHeading}>מ: </Text>
                            <TextInput
                                onChangeText={(text => setMinNum(text))}
                                keyboardType='number-pad'
                                maxLength={10}
                                style={styles.theInput}>
                            </TextInput>

                            <Text style={styles.fromtoHeading}>עד: </Text>
                            <TextInput
                                onChangeText={(text => setMaxNum(text))}
                                keyboardType='number-pad'
                                maxLength={10}
                                style={styles.theInput}>
                            </TextInput>
                        </View>


                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={() => getFilter()}>
                            <Text style={styles.saveButtonText}>
                                שמור
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>


            <TouchableOpacity
                onPress={() => { setModalVisible(true); setMaxNum(null); setMinNum(null); }}
                style={switchValue ? styles.sinunimSwitchIsOn : styles.sinunim}>

                <Text style={{ textAlign: 'right', paddingRight: 15, fontWeight: '700' }}>סכום מכירה: </Text>

                <Text>{selection} </Text>
                <Switch
                    style={{ marginLeft: switchValue ? 50 : 180 }}
                    onValueChange={toggleSwitch}
                    value={switchValue}
                />
            </TouchableOpacity>

        </View>
    );
}


const styles = StyleSheet.create({

    //Containers:
    //Switch Container:
    sinunim: {
        backgroundColor: 'white',
        width: Dimensions.get('window').width * 0.97,
        minHeight: 35,
        borderRadius: 20,
        borderColor: 'black',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center',
        borderWidth: 1,
        marginBottom: 5,
        textAlign: 'right',
        flexDirection: 'row',
    },
    sinunimSwitchIsOn: {
        backgroundColor: 'white',
        width: Dimensions.get('window').width * 0.97,
        minHeight: 35,
        borderRadius: 20,
        borderColor: 'green',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center',
        borderWidth: 2,
        marginBottom: 5,
        textAlign: 'right',
        flexDirection: 'row',
    },
    min_max_container: {
        backgroundColor: 'white',
        marginTop: 30,
        margin: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 15,
        textAlign: 'right',
        flexDirection: 'row',
    },

    //General:
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 22,
    },
    fromtoHeading:
    {
        fontSize: 17,
        fontWeight: 'bold'
    },

    //Buttons:
    saveButton: {
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
    closeButton: {
        textAlign: "left",
        marginLeft: 240,
    },


    //Modal:
    modalView: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#3a3b40',
        borderRadius: 13,
        paddingHorizontal: 23,//הצדדים של הפופאפ
        paddingVertical: 27,
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
        marginBottom: 10,
        marginTop: 15,
        fontSize: 16
    },


    //Dropdown Lists:
    ddListGeneralStyle:
    {
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
        backgroundColor: 'white', borderColor: '#3a3b40'
    },
    ddListDropdownStyle:
    {
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
        backgroundColor: '#f8f8f8', borderColor: '#3a3b40',
        height: 110
    },
    ddListContainer:
    {
        height: 35,
        width: 260
    },
    //Searchable Dropdown List:
    searchableDDListStyle:
    {
        backgroundColor: '#fafafa', borderColor: 'lightgrey', textAlign: 'right', marginBottom: 7, // paddingVertical: 10,
        paddingHorizontal: 20,
        height: 30,
        borderColor: '#3a3b40',
    },


    //Text Input:
    theInput: {
        paddingHorizontal: 20,
        width: 95,
        height: 40,
        backgroundColor: 'white',
        textAlign: 'center',
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 20,
        marginRight: 6,
        margin: 8
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