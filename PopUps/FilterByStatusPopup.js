//Outer Imports:
import React from 'react';
import { useState, useEffect } from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity, Switch } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Dimensions } from 'react-native';

//Icons:
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';




export default function FilterByStatusPopup(props) {

    //Modal:
    const [modalVisible, setModalVisible] = useState(false); //For opening and closing the popup


    //Statuses:
    const [allStatuses, setAllStatuses] = useState([]); //the customer status selection
    const [status, setStatus] = useState(null); //the customer status selection

    //What was chosen from the dd list:
    const [selection, setSelection] = useState(null);

    //Switch:
    const [switchValue, setSwitchValue] = useState(false); // switch can be on (true) or off (false)

    //Which statuses list to show - customers' / distributers' :
    const [whoStatus, setWhoStatus] = useState('לקוח');


    //Alerts:
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');




    useEffect(() => {

        fetchStatuses();

    }, []);


    //Change the switche's state - on / off :
    const toggleSwitch = value => {

        if (status != null) {

            props.sendDataToParent(-1); //send -1 for clean the switch

            setSwitchValue(value);
            setStatus(null);
            setSelection(null);
        }

        //state changes according to switch
        //which will result in re-rendering the text
    };



    //Get all customer statuses from the DB:
    const fetchStatuses = () => {

        if (props.whoI == 'distributer') {
            setAllStatuses(['מפיץ פעיל', 'מפיץ לא פעיל', 'מפיץ בהכשרה', 'מנהל']);
            setWhoStatus('מפיץ');
        }
        else {

            const apiUrl = 'https://proj.ruppin.ac.il/bgroup12/prod/api/customerstatus';
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

                            setAllStatuses(result);
                            setWhoStatus('לקוח')
                        }
                        else if (result == 500) {

                            setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                            setAlertTitle('שגיאה')
                            setShowAlert(true);
                        }
                        else if (result == 404) {

                            setAlertMessage('לא נמצאו סטאטוסי לקוחות במסד הנתונים');
                            setAlertTitle('אופס!')
                            setShowAlert(true);
                        }
                        else {

                            setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                            setAlertTitle('שגיאה')
                            setShowAlert(true);
                        }
                    },
                    (error) => {
                        setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית               ' + error);
                        setAlertTitle('שגיאה')
                        setShowAlert(true);
                    }
                );
        }
    }


    //Send the chosen status back to the main component & close modal:
    const getFilter = () => {

        if (status == '' || status == null) {

            setAlertMessage('יש לבחור סטאטוס');
            setAlertTitle('שגיאה')
            setShowAlert(true);
        }
        else {

            setSwitchValue(true);

            let selectionNum = status;
            props.sendDataToParent(selectionNum);

            setModalVisible(!modalVisible);
        }
    }




    //--------------------Prepare array for Statuses dropdown list----------------------//

    var allStatusesDDArray = []; //will hold all the statuses for the dropdown list
    var StatusObj;

    if (props.whoI == 'distributer') {

        for (let i = 0; i < allStatuses.length; i++) {
            StatusObj = {
                label: allStatuses[i],          // label = Status name
                value: allStatuses[i]           // value = Statuse id
            }
            allStatusesDDArray.push(StatusObj);
        }
    }
    else {

        for (let i = 0; i < allStatuses.length; i++) {
            StatusObj = {
                label: allStatuses[i].cs_Name,  // label = Status name
                value: allStatuses[i].cs_ID     // value = Statuses id
            }
            allStatusesDDArray.push(StatusObj);
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
                                setStatus(null);
                                setSelection(null);
                                setSwitchValue(false);
                                props.sendDataToParent(-1);
                            }}
                        >
                            <FontAwesome5 name="long-arrow-alt-left" size={40} color="#e95344" />
                        </TouchableOpacity>

                        <Text style={styles.modalTitle}>סינון לפי סטאטוס {whoStatus}</Text>

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


                        <Text style={styles.textStyle}>סטטוס {whoStatus}:</Text>
                        <View style={styles.filterContainer}>
                            <DropDownPicker

                                //Searchable dropdown list:
                                searchableStyle={styles.searchableDDListStyle}
                                searchablePlaceholderTextColor="silver"
                                searchable={true}
                                searchablePlaceholder="הקלד לחיפוש..."
                                searchableError={() => <Text>לא נמצאו תוצאות</Text>}

                                placeholder="הקלד.."
                                defaultValue={status}
                                items={allStatusesDDArray}
                                containerStyle={styles.ddListContainer}
                                style={{ backgroundColor: '#fafafa' }}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                style={styles.ddListGeneralStyle}
                                dropDownStyle={styles.ddListDropdownStyle}
                                onChangeItem={item => { setStatus(item.value); setSelection(item.label) }}
                            />

                            <TouchableOpacity
                                style={{ alignSelf: 'baseline' }}
                                onPress={() => {
                                    setStatus(null);
                                    setSelection(null);
                                    setSwitchValue(false);
                                }}
                            >
                                <MaterialIcons name="cancel" size={24} color="#e95344" style={styles.cancelIconStyle} />
                            </TouchableOpacity>
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
                onPress={() => { setModalVisible(true); setStatus(null); }}
                style={switchValue ? styles.sinunimSwitchIsOn : styles.sinunim}
            >

                <Text style={styles.statusHeading}>סטאטוס {whoStatus}: </Text>
                <Text>{selection}</Text>
                <Switch
                    style={{ marginLeft: switchValue ? 80 : 176 }}
                    onValueChange={toggleSwitch}
                    value={switchValue}
                />

            </TouchableOpacity>

        </View>
    );
}


const styles = StyleSheet.create({

    //Containers:
    filterContainer:
    {
        flexDirection: 'row'
    },

    //General:
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 22,
    },
    statusHeading:
    {
        textAlign: 'right',
        paddingRight: 15,
        fontWeight: '700'
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


    //Cancel Icon:
    cancelIconStyle:
    {
        paddingRight: 4,
        paddingTop: 7
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

    //popupstart button
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
});