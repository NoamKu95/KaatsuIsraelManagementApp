//Outer Imports:
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Table, Row, Rows } from 'react-native-table-component';
import { Dimensions } from 'react-native';

//Icons:
import { Foundation } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';




export default function GuidingInfoOnLeadPopUp(props) {

    //Modal:
    const [modalVisible, setModalVisible] = useState(false);

    //Table:
    const [headTable, setHeadTable] = useState(['שם מפיץ', 'מידת התאמה', 'מידע נוסף',]); // Kotarot of the table culomns.
    const [dataTable, setDataTable] = useState(
        [
            [
                `${props.nameDist}`, `${parseFloat(props.matchRate).toFixed(2)}`,
                <Text
                    style={{ flexDirection: 'row', alignSelf: 'center', padding: 8, }}
                    onPress={() => {
                        setModalVisible(false);

                        //move the user to the matching info page:
                        let obj = {
                            customerId: props.idCust,
                            disId: props.idDist,
                            matchRate: props.matchRate,
                            fromWhereI: 'fromPopUp',
                        }
                        props.navigation.navigate('MatchDetails', obj);
                    }}
                >
                    <Foundation name="info" size={35} color="grey" style={styles.PopUpInfoIcon} />

                </Text>
            ]
        ]
    );


    //Distributers' DD List:
    const [ddDistributers, setddDistributers] = useState([]);   // distributer's dd list - [{label , value}, {label , value}]
    const [distributerId, setDistributerId] = useState(null);    // chosen dist ID

    //Lead:
    const [lead, setLead] = useState({});               // object of the lead - {first name, last name, birthdate ...}
    const [joinDate, setJoinDate] = useState('');               // lead JOIN DATE

    //Lead SUPs:
    const [leadSUPsNamesLongString, setLeadSUPsNamesLongString] = useState('');     // the SUPs of the lead as a long string of names (one under the other)

    //Lead GUPs:
    const [customerUsePurposeString, setLeadGUPsAsLongString] = useState('');   // gups as a long string

    //Alerts:
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');




    //Fetch all needed data from the DB:
    const allFetches = async () => {

        await getAllLeadDetails(props.idCust);
        await fetchDistributers();

        setModalVisible(true);
    }


    //Get all the DISTRIBUTERS from the DB:
    const fetchDistributers = () => {

        const apiUrl = 'https://proj.ruppin.ac.il/bgroup12/prod/api/distributers';
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

                        //result = a list of all the distributers

                        let ddList = [];
                        let details = '';
                        result.forEach(element => { //take each fullName and add to temp arr in the format of a dropdown list

                            if (element.d_PersonalCode != props.idDist && element.d_Status == "מפיץ פעיל") {

                                details = `${element.d_FirstName}` + " " + `${element.d_LastName}` + " (" + `${element.d_PhoneNumber}` + ")"; // each line in the dd list is like: yossi cohen (0586196198)
                                ddList.push({ label: details, value: `${element.d_PersonalCode}` });
                            }
                        });

                        setddDistributers(ddList);
                    }
                    else if (result == 404) {

                        setAlertMessage('לא נמצאו מפיצים במסד הנתונים');
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


    //Get the details of the LEAD:
    const getAllLeadDetails = async (idCust) => {

        const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/customer/${idCust}/`;
        await fetch(apiUrl,
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

                        //----------PREPARE JOIN DATE----------------//
                        let datePart = result.c_JoinDate.split("T")[0];
                        let datePartsArr = datePart.split("-");
                        let reverseDate = datePartsArr[2] + "-" + datePartsArr[1] + "-" + datePartsArr[0];
                        setJoinDate(reverseDate);   // save the join date on its new format

                        //save obj of the lead:
                        setLead(result);

                        //-----------GENERALUSE--------------//
                        let allGenerals = [];
                        let generalString = '';

                        if (result.c_GeneralUsePurposes_STRINGS.length > 1) {

                            allGenerals = result.c_GeneralUsePurposes_STRINGS;

                            for (let i = 0; i < allGenerals.length; i++) {
                                generalString += allGenerals[i] + ', ';
                            }
                            setLeadGUPsAsLongString(generalString.substring(0, generalString.length - 2));

                        }
                        else {
                            let oneGeneral = result.c_GeneralUsePurposes_STRINGS[0];
                            setLeadGUPsAsLongString(oneGeneral);
                        }


                        //-----------SUBUSE--------------//

                        let allSubs = [];
                        let subsString = '';

                        if (result.c_SubUsePurposes_STRINGS.length > 1) {

                            allSubs = result.c_SubUsePurposes_STRINGS;

                            for (let i = 0; i < allSubs.length; i++) {
                                subsString += allSubs[i] + ', ';
                            }
                            setLeadSUPsNamesLongString(subsString.substring(0, subsString.length - 2));
                        }
                        else {
                            let oneSub = result.c_SubUsePurposes_STRINGS[0];
                            setLeadSUPsNamesLongString(oneSub);
                        }
                    }
                    else if (result == 404) {

                        setAlertMessage('לא נמצאה התאמה במסד הנתונים לנתוני הליד');
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

                    setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית             ' + error);
                    setAlertTitle('שגיאה');
                    setShowAlert(true);
                }
            )
    }



    //Updating the pairing in the DB:
    const updatePairingInDB = (leadID, distributerID) => {

        if (distributerID == null) {

            setAlertMessage('נא לבחור מפיץ מתוך הרשימה');
            setAlertTitle('שגיאה');
            setShowAlert(true);
        }
        else {

            const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/editpairing/${parseInt(distributerId)}/${leadID}`;
            fetch(apiUrl,
                {
                    method: 'PUT',
                    headers: new Headers({
                        'Content-Type': 'application/json; charset=UTF-8',
                        'Accept': 'application/json; chartset=UTF-8',
                    })
                })
                .then(res => {

                    return res.status == 200 ?
                        res.json()
                        :
                        res.status == 500 ?
                            500
                            :
                            res.status == 404 ?
                                404
                                :
                                null;
                })
                .then(
                    (result) => {

                        if (result != null && result != 500 && result != 404) {

                            setAlertMessage(result);
                            setAlertTitle('פעולה בוצעה בהצלחה');
                            setShowAlert(true);

                            var timeout = setTimeout(() => {

                                //Clear dd list & close popup:
                                props.sendDataFromChild(true);
                                setDistributerId(null);
                                setModalVisible(false);

                            }, 2000)
                        }
                        else if (result == 404) {

                            setAlertMessage('לא נמצאה התאמה במסד הנתונים לנתוני הליד');
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

                        setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית             ' + error);
                        setAlertTitle('שגיאה');
                        setShowAlert(true);
                    }
                );
        }
    }




    return (
        <View style={styles.centeredView}>

            <Modal animationType="slide" transparent={true} visible={modalVisible} >

                <View style={styles.centeredView}>

                    <View style={styles.modalView}>

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

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>


                            <Text style={styles.dateModalText1}> כניסה למערכת: </Text>

                            <Text style={styles.dateModalText2}>{joinDate}</Text>

                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                    setDistributerId(null);
                                }}>
                                <FontAwesome5 name="long-arrow-alt-left" size={40} color="#e95344" />
                            </TouchableOpacity>

                        </View>


                        <Text style={styles.modalText}> {lead.c_FirstName + ' ' + lead.c_LastName}</Text>


                        <View style={styles.infoContainer}>

                            <MaterialIcons name="home" size={37} color='#e95344' />
                            <Text style={styles.infoText} > {lead.c_CityName} </Text>

                        </View>

                        <View style={styles.infoContainer}>

                            <MaterialIcons name="emoji-people" size={37} color="#e95344" />
                            <Text style={styles.infoText}> {customerUsePurposeString} </Text>

                        </View>

                        <View style={styles.infoContainer}>

                            <MaterialCommunityIcons name="sign-direction" size={37} color='#e95344' />
                            <Text style={styles.inforLongText}>  {leadSUPsNamesLongString} </Text>
                        </View>



                        <Text style={styles.tableKoteret}> המלצת המערכת לצימוד: </Text>

                        <View style={styles.tableContainer}>
                            <Table borderStyle={styles.tableBorderStyle}>
                                <Row data={headTable} style={styles.tableHeaderStyle} textStyle={styles.tableHeaderTextStyle} />
                                <Rows
                                    data={dataTable}
                                    textStyle={styles.tableContentTextStyle}
                                    style={styles.rowStyle}
                                />
                            </Table>
                        </View>


                        <Text style={styles.manualMatchingKoteret}> צימוד מותאם אישית: </Text>

                        <DropDownPicker
                            //Searchable dropdown list:
                            searchableStyle={styles.searchInDDListStyle}
                            searchablePlaceholderTextColor="silver"
                            searchable={true}
                            searchablePlaceholder="הקלד לחיפוש.."
                            searchableError={() => <Text>לא נמצאו תוצאות</Text>}

                            containerStyle={styles.ddListContainer}
                            itemStyle={{ justifyContent: 'flex-start' }}
                            style={styles.ddGeneralStyle}
                            dropDownStyle={styles.dropDownNamesStyle}
                            placeholder="בחר..."
                            defaultValue={distributerId}
                            items={ddDistributers}
                            onChangeItem={item => setDistributerId(item.value)}
                        />

                        <TouchableOpacity
                            style={styles.confirmMatchButton}
                            onPress={() => updatePairingInDB(lead.c_PersonalCode, distributerId)} >
                            <Text style={styles.confirmMatchButtonText}>
                                אישור צימוד
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>


            </Modal >
            <Text
                style={{ flexDirection: 'row', alignSelf: 'center', padding: 8, }}
                onPress={() => allFetches()}
            >
                <Foundation name="info" size={35} color="grey" style={styles.PopUpInfoIcon} />
            </Text>

        </View >
    );
}


const styles = StyleSheet.create({

    //Containers:
    infoContainer:
    {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5
    },

    //General:
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        direction: 'ltr'
    },


    startButton: {
        backgroundColor: '#e95344',
        borderRadius: 50,
        padding: 7,
        width: 335,
        height: 45,
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'center'
    },


    //Modal:
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
        width: Dimensions.get('window').width * 0.9
    },
    modalText: {
        textAlign: 'center',
        fontSize: 27,
        fontWeight: 'bold',
        marginTop: 15
    },
    closeButton: {
        textAlign: "left",
        marginTop: 5,
    },


    //Headings:
    manualMatchingKoteret: {
        textAlign: 'left',
        fontSize: 20,
        fontWeight: 'bold'
    },
    tableKoteret: {
        marginTop: 6,
        textAlign: 'left',
        fontSize: 20,
        fontWeight: 'bold'
    },

    infoText:
    {
        maxWidth: Dimensions.get('window').width * 0.7,
        textAlign: 'right',
        fontSize: 13,
        direction: 'rtl'
    },
    inforLongText:
    {
        maxWidth: Dimensions.get('window').width * 0.7,
        textAlign: 'left',
        fontSize: 13,
        direction: 'ltr'
    },


    //Table:
    tableContainer: {
        padding: 15,
        backgroundColor: '#ffffff',
        paddingHorizontal: 10,
    },
    tableBorderStyle:
    {
        borderWidth: 1,
        borderColor: 'grey'
    },
    tableContentTextStyle: {
        color: 'black',
        textAlign: 'center',
        fontSize: 14,
        padding: 5
    },
    tableHeaderTextStyle: {
        margin: 3,
        color: 'white',
        alignContent: "center",
        textAlign: 'center',
        fontWeight: 'bold'
    },
    tableHeaderStyle: {
        height: 45,
        alignContent: "center",
        backgroundColor: '#3a3b40',
        borderColor: 'grey'
    },
    rowStyle:
    {
        height: 45
    },


    //Join Date Texts:
    dateModalText1: {
        fontSize: 15,
        marginTop: 16,

    }, dateModalText2: {
        fontSize: 15,
        marginTop: 16,
        marginRight: 60,
        textAlign: "center"
    },


    //DropDown List:
    searchInDDListStyle: {
        backgroundColor: '#fafafa',
        borderColor: 'lightgrey',
        textAlign: 'right',
        marginBottom: 7,
        paddingHorizontal: 20,
        height: 28,
        borderColor: '#3a3b40',
    },
    ddGeneralStyle: {
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
        backgroundColor: 'white', borderColor: '#3a3b40'
    },
    ddListContainer: {
        height: 50,
        width: 300,
        marginTop: 15,
        alignSelf: 'center',
    },
    dropDownNamesStyle: {
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
        backgroundColor: '#f8f8f8', borderColor: '#3a3b40',
        height: 80
    },



    //Confirm Match Button:
    confirmMatchButton: {
        backgroundColor: '#e95344',
        borderRadius: 50,
        width: 300,
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        marginTop: 20,
        alignSelf: 'center',
        marginBottom: 20
    },
    confirmMatchButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 20,
        alignSelf: 'center',
        fontWeight: 'bold'
    },


    //Icons:
    iconStyleOne:
    {
        textAlign: "center",
        paddingRight: 5,
        fontSize: 12,
    },
    infoIcon: {
        alignSelf: "center",
        flex: 1,
    },
    PopUpInfoIcon: {
        alignSelf: "center",
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