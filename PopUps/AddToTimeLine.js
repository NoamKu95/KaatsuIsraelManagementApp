//Outer Imports:
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import AwesomeAlert from 'react-native-awesome-alerts';

//Icons:
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';




export default function AddToTimeline(props) {

    const [modalVisible, setModalVisible] = useState(false);            //Opening and closing the popup

    //Fields of the popup:
    const [interactionID, setInteractionID] = useState('');             //Name of the interaction chosen
    const [notes, setNotes] = useState('');                             //Notes regarding the interaction

    //DropdownList Data:
    const [allInteractions, setAllInteractions] = useState([]);   //List of Interactions for the dropdown list.

    //Alerts:
    const [showAlert, setShowAlert] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');



    //Fetch all interaction types from DB:
    const fetchInteractions = () => {

        const apiUrl = 'https://proj.ruppin.ac.il/bgroup12/prod/api/typeofinteraction';
        fetch(apiUrl,
            {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json; chartset=UTF-8',
                })
            }
        ).then(res => {

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

        }).then(
            (result) => {

                if (result != null && result != 404 && result != 500) {

                    let tempArr = [];   // temp to hold the objects of the dd list
                    result.forEach(element => {

                        if (element.toi_ID != 7 && element.toi_ID != 6 && element.toi_ID != 2) {    // filter away automatic interactions that we don't want the distributer to be able to add

                            tempArr.push({ label: `${element.toi_TypeName}`, value: `${element.toi_ID}` }); // Prepare for the dropdown list
                        }

                    });
                    setAllInteractions(tempArr);
                }
                else if (result == 404) {

                    setShowAlert(true);
                    setAlertTitle('אופס!');
                    setAlertMessage('לא נמצאו סוגי אינטראקציות במסד הנתונים');
                }
                else if (result == 500) {

                    setShowAlert(true);
                    setAlertTitle('שגיאה');
                    setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                }
                else {

                    setShowAlert(true);
                    setAlertTitle('שגיאה');
                    setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                }
            },
            (error) => {
                
                setShowAlert(true);
                setAlertTitle('שגיאה');
                setAlertMessage('התרחשה תקלה בתקשורת עם מסד הנתונים. נא לנסות שנית             ' + error);
            }
        );
    }


    //When clicking on the SAVE button:
    const insertInteraction = () => {

        //Check that the use chose an interaction type:
        if (interactionID == '') {

            setShowAlert(true);
            setAlertMessage('יש לבחור סוג אינטראקציה מתוך הרשימה הנפתחת');
            setAlertTitle('שגיאה');
        }
        else {

            sendTheDataToParent();          //uplift the data
            setInteractionID('');           //Reset states
            setNotes('');                   //Reset states

            setModalVisible(!modalVisible); //Close popup
        }
    }


    //Uplift the new Interaction:
    const sendTheDataToParent = () => {

        //Prepare the object to uplift:
        let dateFormat = new Date().toLocaleDateString();

        let newInteraction = {
            iwc_Date: dateFormat,
            iwc_Customer: props.customerPersonalCode,
            iwc_InteractionID: parseInt(interactionID),
            iwc_Notes: notes
        }
        props.sendDataFromChild(newInteraction);
    }




    return (
        <View style={styles.centeredView}>

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
                                setInteractionID('');             //Reset the interaction Name
                                setNotes('');
                            }}
                        >
                            <FontAwesome5 name="long-arrow-alt-left" size={40} color="#e95344" />
                        </TouchableOpacity>


                        <Text style={styles.modalText}>הוספת אינטראקציה</Text>

                        <View style={styles.elementContainer}>

                            <Text style={styles.textStyle}>נושא:</Text>

                            <DropDownPicker
                                placeholder="בחר..."
                                items={allInteractions}
                                style={{ backgroundColor: '#fafafa' }}
                                containerStyle={styles.ddListContainer}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                style={styles.ddGeneralStyle}
                                dropDownStyle={styles.dropDownStyle}
                                onChangeItem={item => setInteractionID(item.value)}
                            />

                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                            <Text style={styles.textStyle}>הערות:</Text>

                            <TextInput
                                scrollEnabled
                                multiline
                                numberOfLines={5}
                                maxLength={225}
                                style={styles.multilineInput}
                                onChangeText={(e) => { setNotes(e) }}
                            >
                            </TextInput>

                        </View>

                        <TouchableOpacity
                            style={styles.saveButtonStyle}
                            onPress={insertInteraction}>
                            <Text style={styles.saveButtonText}>שמור</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>

            <TouchableOpacity
                style={styles.modalOuterButton}
                onPress={() => {
                    setModalVisible(true);
                    fetchInteractions();
                }}>
                <AntDesign name="pluscircle" size={28} color="#e95344" style={styles.plusButtonStyle} />
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
        alignItems: 'baseline'
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
        margin: 5
    },
    modalText: {
        marginBottom: 30,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold'
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


    //Outer Button:
    modalOuterButton:
    {
        alignSelf: 'flex-end',
        paddingBottom: 27,
        marginTop: 7
    },
    plusButtonStyle:
    {
        backgroundColor: '#f8f8f8',
        borderRadius: 35,
        marginRight: 2
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


    //Dropdown List:
    dropDownStyle: {
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
        backgroundColor: '#f8f8f8', borderColor: '#3a3b40',
        width: 230, marginLeft: 10, height: 100
    },
    ddGeneralStyle: {
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
        backgroundColor: 'white', borderColor: '#3a3b40',
        width: 230, marginLeft: 10
    },
    ddListContainer:
    {
        height: 40,
        width: 230,
        flex: 1,
        marginVertical: 10
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