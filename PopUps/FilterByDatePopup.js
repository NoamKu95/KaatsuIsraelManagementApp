//Outer Imports:
import React from 'react';
import { useState, useEffect } from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity, Switch } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Dimensions } from 'react-native';

//Icons:
import { FontAwesome5 } from '@expo/vector-icons';



export default function FilterByDatePopup(props) {

    //Modal:
    const [modalVisible, setModalVisible] = useState(false); //For opening and closing the popup

    //Dates selected in words:
    const [selection, setSelection] = useState(null);

    //Older Date:
    const [year1, setYear1] = useState(null);
    const [month1, setMonth1] = useState(null);
    const [day1, setDay1] = useState(null);

    //Newer Date:
    const [year2, setYear2] = useState(null);
    const [month2, setMonth2] = useState(null);
    const [day2, setDay2] = useState(null);


    //Dates Dropdown Lists:
    const [ddListYears, setDdListYears] = useState(null);
    const [ddListMonths, setDdListMonths] = useState(null);
    const [ddListDays, setDdListDays] = useState(null);

    //switch:
    const [switchValue, setSwitchValue] = useState(false); // switch can be on (true) or off (false)

    //Title of the popup:
    const [title, setTitle] = useState(null); // תאריך צימוד / תאריך מכירה

    //Alerts:
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');




    useEffect(() => {

        prepareDateTamplate();

    }, []);



    // Create content for the Dropdown Lists
    const prepareDateTamplate = () => {

        //prepare the numbers for the years-drop-down-list:
        let endyear = new Date().getFullYear();
        let startyear = new Date().getFullYear() - 10;

        let ddListY = [];
        for (let i = startyear; i <= endyear; i++) {
            ddListY.push({ label: `${i}`, value: `${i}` });
        }
        setDdListYears(ddListY);

        //-------------------------------------------------

        //prepare the numbers for the month-drop-down-list:
        let ddListM = [];
        for (let i = 1; i <= 12; i++) {
            ddListM.push({ label: `${i}`, value: `${i}` });
        }
        setDdListMonths(ddListM);

        //-------------------------------------------------

        //prepare the numbers for the days-drop-down-list:
        let ddListD = [];
        for (let i = 1; i <= 31; i++) {
            ddListD.push({ label: `${i}`, value: `${i}` });
        }
        setDdListDays(ddListD);

        //-------------------------------------------------

        // set the page & popup title
        let kindOfTitle = props.whoI;
        kindOfTitle == 'matchPage' ?
            setTitle('תאריך צימוד')
            :
            setTitle('תאריך מכירה');
    }



    //Turn the switch OFF from the parent component:
    const toggleSwitch = value => {

        if (selection != null && selection != null) {

            setSwitchValue(value);

            setSelection(null);
            setYear1(null);
            setMonth1(null);
            setDay1(null);

            setYear2(null);
            setMonth2(null);
            setDay2(null);

            props.sendDataToParent(-1, -1);
        }
    };



    // Check if dates are legit:
    const checkDatesInputs = () => {

        if (day1 == null || day2 == null || month1 == null || month2 == null || year1 == null || year2 == null) {

            setAlertMessage('יש לבחור תאריך התחלה ותאריך סיום');
            setAlertTitle('שגיאה')
            setShowAlert(true);
        }
        else {

            let doesBDexists = true;

            if (day1 == '31') {

                if ([2, 4, 6, 9, 11].includes(parseInt(month1))) {

                    doesBDexists = false;
                }
            }
            else if (month1 == '2') {

                if (day1 == '30' || day1 == '31') {

                    doesBDexists = false;
                }
                else if (day1 == '29') {

                    parseInt(year1) % 4 == 0 ? doesBDexists = true : doesBDexists = false;
                }
            }

            if (!doesBDexists) {

                setAlertMessage('תאריך ההתחלה שהוזן אינו קיים');
                setAlertTitle('שגיאה')
                setShowAlert(true);
            }
            else {

                let doesBDexists = true;

                if (day2 == '31') {

                    if ([2, 4, 6, 9, 11].includes(parseInt(month2))) {

                        doesBDexists = false;
                    }
                }
                else if (month2 == '2') {

                    if (day2 == '30' || day2 == '31') {

                        doesBDexists = false;
                    }
                    else if (day2 == '29') {

                        parseInt(year2) % 4 == 0 ? doesBDexists = true : doesBDexists = false;
                    }
                }

                if (!doesBDexists) {

                    setAlertMessage('תאריך הסיום שהוזן אינו קיים');
                    setAlertTitle('שגיאה')
                    setShowAlert(true);
                }
                else {

                    if (parseInt(year1) > parseInt(year2) || (parseInt(year1) == parseInt(year2) && parseInt(month1) > parseInt(month2)) || (parseInt(year1) == parseInt(year2) && parseInt(month1) == parseInt(month2) && parseInt(day1) > parseInt(day2))) {

                        setAlertMessage('תאריך הסיום אינו יכול להיות קטן מתאריך ההתחלה');
                        setAlertTitle('שגיאה')
                        setShowAlert(true);
                    }
                    else {

                        setSwitchValue(true);
                        setModalVisible(!modalVisible);
                        let date1 = `${year1}` + `-` + `${month1}` + `-` + `${day1}`;
                        let date2 = `${year2}` + `-` + `${month2}` + `-` + `${day2}`;

                        setSelection('מ: ' + date1 + '  עד: ' + date2);

                        props.sendDataToParent(date1, date2);
                    }
                }
            }
        }
    }



    //clean all the options
    const cleanAll = () => {

        setSelection(null);
        setSwitchValue(false);
        setYear1(null);
        setMonth1(null);
        setDay1(null);

        setYear2(null);
        setMonth2(null);
        setDay2(null);
    }




    return (

        <View style={styles.centeredView}>

            <Modal animationType="slide" transparent={true} visible={modalVisible} >

                <View style={styles.centeredView}>

                    <View style={styles.modalView}>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => { props.sendDataToParent(-1, -1); cleanAll(); setModalVisible(!modalVisible) }}
                        >
                            <FontAwesome5 name="long-arrow-alt-left" size={40} color="#e95344" />
                        </TouchableOpacity>

                        <Text style={styles.modalTitle}>סינון לפי {title} </Text>

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

                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>מ:</Text>
                            <DropDownPicker
                                items={ddListYears}
                                placeholder="שנה"
                                defaultValue={year1}
                                containerStyle={styles.yearsContainer}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                style={styles.ddYearsStyle}
                                dropDownStyle={styles.dropDownStyle}
                                onChangeItem={item => setYear1(item.value)}
                            />

                            <DropDownPicker
                                items={ddListMonths}
                                placeholder="חודש"
                                defaultValue={month1}
                                containerStyle={styles.monthsContainer}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                style={styles.ddMonthsStyle}
                                dropDownStyle={styles.dropDownStyle}
                                onChangeItem={item => setMonth1(item.value)}
                            />

                            <DropDownPicker
                                items={ddListDays}
                                placeholder="יום"
                                defaultValue={day1}
                                containerStyle={styles.daysContainer}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                style={styles.ddDaysStyle}
                                dropDownStyle={styles.dropDownStyle}
                                onChangeItem={item => setDay1(item.value)}
                            />
                        </View>


                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>עד:</Text>
                            <DropDownPicker
                                items={ddListYears}
                                placeholder="שנה"
                                defaultValue={year2}
                                containerStyle={styles.yearsContainer}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                style={styles.ddYearsStyle}
                                dropDownStyle={styles.dropDownStyle}
                                onChangeItem={item => setYear2(item.value)}
                            />

                            <DropDownPicker
                                items={ddListMonths}
                                placeholder="חודש"
                                defaultValue={month2}
                                containerStyle={styles.monthsContainer}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                style={styles.ddMonthsStyle}
                                dropDownStyle={styles.dropDownStyle}
                                onChangeItem={item => setMonth2(item.value)}
                            />

                            <DropDownPicker
                                items={ddListDays}
                                placeholder="יום"
                                defaultValue={day2}
                                containerStyle={styles.daysContainer}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                style={styles.ddDaysStyle}
                                dropDownStyle={styles.dropDownStyle}
                                onChangeItem={item => setDay2(item.value)}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={() => checkDatesInputs()}>
                            <Text style={styles.saveButtonText}>
                                שמור
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <TouchableOpacity
                onPress={() => { setModalVisible(true); cleanAll(); }}
                style={switchValue ? styles.sinunimSwitchIsOn : styles.sinunim}>

                <Text style={styles.titleContent}>{title}:</Text>
                <Text style={{ fontSize: 10 }}>{selection}</Text>
                <Switch
                    style={{ marginLeft: switchValue ? 50 : 176 }}
                    onValueChange={toggleSwitch}
                    value={switchValue}
                />
            </TouchableOpacity>

        </View>
    );
}


const styles = StyleSheet.create({

    //Containers:
    viewContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',

    },
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

    //General:
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 22,
    },
    fieldText: {
        fontWeight: 'bold',
        flex: 1,
        marginLeft: 6,
        alignSelf: 'center'
    },
    titleContent:
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
    yearsContainer: {
        height: 40,
        width: 80,
        marginVertical: 10
    },
    ddYearsStyle: {
        borderTopLeftRadius: 20, borderTopRightRadius: 0,
        borderBottomLeftRadius: 20, borderBottomRightRadius: 0,
        backgroundColor: 'white', borderColor: '#3a3b40'
    },
    dropDownStyle: {
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
        backgroundColor: '#f8f8f8', borderColor: '#3a3b40',
        height: 80
    },
    monthsContainer: {
        height: 40,
        width: 80,
        marginVertical: 10
    },
    ddMonthsStyle: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        backgroundColor: 'white',
        borderBottomColor: '#3a3b40',
        borderLeftColor: 'white',
        borderRightColor: 'white',
        borderTopColor: '#3a3b40'
    },
    daysContainer: {
        height: 40,
        width: 80,
        // flex: 1,
        marginVertical: 10
    },
    ddDaysStyle: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 20,
        backgroundColor: 'white',
        borderColor: '#3a3b40'
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