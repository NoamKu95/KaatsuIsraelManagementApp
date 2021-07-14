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




export default function FilterByGupPopup(props) {

    //Modal:
    const [modalVisible, setModalVisible] = useState(false); //For opening and closing the popup

    //General use purpose:
    const [allGeneralUsePurposes, setAllGeneralUsePurposes] = useState([]); //all the General use purposes from db
    const [generalUsePurpose, setGeneralUsePurpose] = useState(null); //the General use purpose selection

    //General use purpose in words
    const [selection, setSelection] = useState(null);

    //switch
    const [switchValue, setSwitchValue] = useState(false);


    //Alerts:
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');


    useEffect(() => {

        fetchGeneralUsePurpuse();

    }, []);


    const toggleSwitch = value => {

        if (generalUsePurpose != null) {
            props.sendDataToParent(-1); //send -1 for clean the switch

            setSwitchValue(value);
            setGeneralUsePurpose(null);
            setSelection(null);
        }

        //state changes according to switch
        //which will result in re-render the text
    };


    //Get all the GeneralUsePurpuse from the DB:
    const fetchGeneralUsePurpuse = () => {

        const apiUrl = 'https://proj.ruppin.ac.il/bgroup12/prod/api/generalusepurpose';
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

                        setAllGeneralUsePurposes(result);
                    }
                    else if (result == 404) {

                        setAlertMessage('לא נמצאו מטרות שימוש כלליות במסד הנתונים');
                        setAlertTitle('אופס!')
                        setShowAlert(true);
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



    //Send report filters to DB and download the report:
    const getFilter = () => {

        if (generalUsePurpose == '' || generalUsePurpose == null) {

            setAlertMessage('יש לבחור מטרת שימוש');
            setAlertTitle('שגיאה')
            setShowAlert(true);
        }
        else {

            setSwitchValue(true);

            let selectionNum = generalUsePurpose;
            props.sendDataToParent(selectionNum);

            setModalVisible(!modalVisible);
        }
    }


    //--------------------prepare array for generalUsePurpose dropdown list----------------------//

    var allGeneralUsePurposesDDArray = []; //will hold all the generalUsePurpose for the dropdown list
    var generalUsePObj;

    //Turn each gup to {label: xx, value: yy} :
    for (let i = 0; i < allGeneralUsePurposes.length; i++) {
        generalUsePObj = {
            label: allGeneralUsePurposes[i].gup_Name, // label =  name
            value: allGeneralUsePurposes[i].gup_ID // value = generalUsePurpose id
        }
        allGeneralUsePurposesDDArray.push(generalUsePObj);
    }




    return (

        <View style={styles.centeredView}>

            <Modal animationType="slide" transparent={true} visible={modalVisible} >

                <View style={styles.centeredView}>

                    <View style={styles.modalView}>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <FontAwesome5 name="long-arrow-alt-left" size={40} color="#e95344" />
                        </TouchableOpacity>

                        <Text style={styles.modalTitle}>סינון לפי מטרת שימוש לקוח</Text>

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


                        <Text style={styles.textStyle}>מטרת שימוש כללית</Text>
                        <View style={styles.filterContainer}>
                            <DropDownPicker

                                //Searchable dropdown list:
                                searchableStyle={styles.searchableDDListStyle}
                                searchablePlaceholderTextColor="silver"
                                searchable={true}
                                searchablePlaceholder="הקלד לחיפוש..."
                                searchableError={() => <Text>לא נמצאו תוצאות</Text>}

                                placeholder="הקלד.."
                                defaultValue={generalUsePurpose}
                                items={allGeneralUsePurposesDDArray}
                                containerStyle={styles.ddListContainer}
                                style={{ backgroundColor: '#fafafa' }}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                style={styles.ddListGeneralStyle}
                                dropDownStyle={styles.ddListDropdownStyle}
                                onChangeItem={item => { setGeneralUsePurpose(item.value); setSelection(item.label) }}
                            />

                            <TouchableOpacity
                                style={{ alignSelf: 'baseline' }}
                                onPress={() => { setGeneralUsePurpose(null); setSelection(null); setSwitchValue(false); }}
                            >
                                <MaterialIcons name="cancel" size={24} color="#e95344" style={styles.cancelIconStyle} />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.makeReportButton}
                            onPress={() => getFilter()}>
                            <Text style={styles.reportButtonText}>
                                שמור
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <TouchableOpacity
                onPress={() => { setModalVisible(true); setGeneralUsePurpose(null); }}
                style={switchValue ? styles.sinunimSwitchIsOn : styles.sinunim}>

                <Text style={styles.gupHeading}>מטרת שימוש: </Text>
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
    containerSwitch: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },

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
    gupHeading:
    {
        textAlign: 'right',
        paddingRight: 15,
        fontWeight: '700'
    },


    //Buttons:
    makeReportButton: {
        backgroundColor: '#e95344',
        borderRadius: 50,
        width: 290,
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 20,
        marginTop: 20
    },
    reportButtonText: {
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