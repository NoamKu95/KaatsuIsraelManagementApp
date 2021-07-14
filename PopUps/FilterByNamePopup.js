//Outer Imports:
import React from 'react';
import { useState, useEffect } from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity, Switch } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Icons:
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';




export default function FilterByNamePopup(props) {

    //Modal:
    const [modalVisible, setModalVisible] = useState(false); //For opening and closing the popup

    // Which DD List to fetch - customers or distributers:
    const [kindOfList, setKindOfList] = useState('לקוח');

    //Names DD List:
    const [allOptions, setAllOptions] = useState([]);       //all the persons from db (customers / distributers)
    const [ddSelection, setDdSelection] = useState(null);   //the ID of the chosen person (customer / distributer)

    //The chosen person's NAME (to display in the parent):
    const [selection, setSelection] = useState(null);

    //Switch:
    const [switchValue, setSwitchValue] = useState(false); // switch can be on (true) or off (false)

    //Alerts:
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');




    useEffect(() => {

        getUserPersonalCode();

    }, []);



    //Get from the user's type from AS (manager/distributer):
    const getUserPersonalCode = async () => {

        try {

            const jsonValue = await AsyncStorage.getItem('userDetails');

            if (jsonValue != null) {

                let user = JSON.parse(jsonValue);

                //Fetch the people that belong to this user:
                fetchAllOptions(user.d_Status, user.d_PersonalCode);
            }
            else {

                setAlertMessage('התרחשה שגיאה בשליפה מהאחסון המקומי');
                setAlertTitle('שגיאה');
                setShowAlert(true);
            }

        } catch {

            setAlertMessage('התרחשה שגיאה בשליפה מהאחסון המקומי');
            setAlertTitle('שגיאה');
            setShowAlert(true);
        }
    }


    // Switching the switch OFF from the parent component:
    const toggleSwitch = value => {

        if (ddSelection != null) { // if the user chose someone

            props.sendDataToParent(-1); //send -1 to clean the filter

            setSwitchValue(value);
            setDdSelection(null);
            setSelection(null);
        }

        //state changes according to switch
        //which will result in re-render the text
    };



    //Get the list of names (customers / distributers) from the DB:
    const fetchAllOptions = (myType, myID) => {

        let apiUrl = '';

        if (props.whoI == 'distributer') { // we came from page 'DistributersLists' & user is manager

            setKindOfList('מפיץ')
            apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/distributers`; // fetch ALL distributers
        }
        else { // we came from page 'CustomersList'

            if (myType == 'מנהל') { // user is a manger

                apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/customers`; // fetch ALL customers
            }
            else { // user is a distributer

                apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/mycustomers/${myID}`; // fetch only THE USER'S customers
            }
        }

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

                        setAllOptions(result);
                    }
                    else if (result == 404) {

                        if (props.whoI == 'distributer') {

                            setAlertMessage('לא נמצאו מפיצים במסד הנתונים');
                            setAlertTitle('אופס!')
                            setShowAlert(true);
                        }
                        else {

                            setAlertMessage('לא נמצאו לקוחות במסד הנתונים');
                            setAlertTitle('אופס!')
                            setShowAlert(true);
                        }
                    }
                    else if (result == 500) {

                        setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה')
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


    //Send the chosen Person back to the parent's component & close the modal:
    const getFilter = () => {

        if (ddSelection == '' || ddSelection == null) {

            setAlertMessage('יש לבחור שם. נא לנסות שנית');
            setAlertTitle('שגיאה')
            setShowAlert(true);
        }
        else {

            setSwitchValue(true);
            let selectionNum = ddSelection;
            props.sendDataToParent(selectionNum);
            resetAll();
        }
    }


    //clean all the states
    const resetAll = () => {

        setModalVisible(!modalVisible);
    }


    //--------------------Prepare array for options dropdown list----------------------//

    var allnamesDDArray = []; //will hold all the distributer for the dropdown list
    var obj;

    //Turn each option to {label: xx, value: yy} :

    if (props.whoI == 'distributer') { // we have a list of distributers

        for (let i = 0; i < allOptions.length; i++) {
            obj = {
                label: allOptions[i].d_FirstName + " " + allOptions[i].d_LastName + " " + "(" + allOptions[i].d_PhoneNumber + ")", // label = first name + last name + phone
                value: allOptions[i].d_PersonalCode // value =  personal code
            }
            allnamesDDArray.push(obj);
        }
    }
    else { // we have a list of customers

        for (let i = 0; i < allOptions.length; i++) {
            obj = {
                label: allOptions[i].c_FirstName + " " + allOptions[i].c_LastName + " " + "(" + allOptions[i].c_PhoneNumber + ")", // label = first name + last name + phone
                value: allOptions[i].c_PersonalCode // value =  personal code
            }
            allnamesDDArray.push(obj);
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
                                resetAll();
                                setDdSelection(null);
                                setSelection(null);
                                setSwitchValue(false);
                                props.sendDataToParent(-1);
                            }}
                        >
                            <FontAwesome5 name="long-arrow-alt-left" size={40} color="#e95344" />
                        </TouchableOpacity>

                        <Text style={styles.modalTitle}>סינון לפי שם {kindOfList}</Text>

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


                        <Text style={styles.textStyle}>שם {kindOfList}:</Text>

                        <View style={styles.filterContainer}>
                            <DropDownPicker

                                //Searchable dropdown list:
                                searchableStyle={styles.searchableDDListStyle}
                                searchablePlaceholderTextColor="silver"
                                searchable={true}
                                searchablePlaceholder="הקלד לחיפוש..."
                                searchableError={() => <Text>לא נמצאו תוצאות</Text>}

                                placeholder="הקלד.."
                                defaultValue={ddSelection}
                                items={allnamesDDArray}
                                containerStyle={styles.ddListContainer}
                                style={{ backgroundColor: '#fafafa' }}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                style={styles.ddListGeneralStyle}
                                dropDownStyle={styles.ddListDropdownStyle}
                                onChangeItem={item => { setDdSelection(item.value); setSelection(item.label.split("(")[0]) }}
                            />

                            <TouchableOpacity
                                style={{ alignSelf: 'baseline' }}
                                onPress={() => {
                                    setDdSelection(null);
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
                onPress={() => { setModalVisible(true); setDdSelection(null); getUserPersonalCode(); }}
                style={switchValue ? styles.sinunimSwitchIsOn : styles.sinunim}
            >

                <Text style={styles.nameHeading}>שם {kindOfList}:  </Text>
                <Text>{selection}</Text>
                <Switch
                    style={{ marginLeft: switchValue ? 50 : 200 }}
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
    nameHeading:
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