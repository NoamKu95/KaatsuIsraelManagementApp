//Outer Imports:
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Dimensions } from 'react-native';

//Icons:
import { FontAwesome5 } from '@expo/vector-icons';


export default function AdressPopup(props) {

    //Modal:
    const [modalVisible, setModalVisible] = useState(false); //For opening and closing the popup   

    //API Key:
    const [apiKey, setApiKey] = useState('');          //Google API key

    //Adress:
    const [fullAddress, setFullAddress] = useState('');             //the user's  selection
    //Adress - street & city:
    const [cityName, setcityName] = useState('');                   //city name from the address    
    const [streetName, setStreetName] = useState('');               //street name from the adreess
    //Adress - house & building:
    const [houseNumber, setHouseNumber] = useState('');             //house number from the adreess   
    const [appartmentNumber, setAppartmentNumber] = useState('');   //appartment number from the adress

    //Dropdown Lists:
    const [allHouseNumbers, setAllHouseNumbers] = useState([]);     //house numbers for dropdown list
    const [allAppNumbers, setAllAppNumbers] = useState([]);         //appartment numbers for dropdown list

    //Alerts:
    const [showAlert, setShowAlert] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    //Placeholder:
    const [placeholder, setPlaceholder] = useState(props.placeholder);



    React.useEffect(() => {

        prepareDDNumbers();
        getApiKey();

        placeholder == 'none' ? setPlaceholder('לחץ להוספת כתובת מדויקת') : '';

    }, []);


    const getApiKey = async () => {

        const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/googleapi`;
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

                        setApiKey(result)
                    }
                    else if (result == 404) {

                        setAlertMessage('לא נמצא המפתח הנדרש במסד הנתונים');
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

                    setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית               ' + error);
                    setAlertTitle('שגיאה');
                    setShowAlert(true);
                }
            );
    }


    //Prepare the house & appartment numbers for the drop down lists:
    const prepareDDNumbers = () => {
        
        let ddHouses = [];
        for (let i = 1; i <= 200; i++) {

            ddHouses.push({ label: `${i}`, value: `${i}` });
        }
        setAllHouseNumbers(ddHouses);

        let ddApps = [];
        for (let j = 1; j <= 70; j++) {

            ddApps.push({ label: `${j}`, value: `${j}` });
        }
        setAllAppNumbers(ddApps);
    }


    //Take out the desired data from the API's response:
    const handleChosenAdress = (data) => {

        if (data.terms.length == 3) {

            setcityName(data.terms[1].value);
            setStreetName(data.terms[0].value);
            setFullAddress(data.description);
        }
    }


    //Send all the adress details back to the main page:
    const sendAdressToParent = () => {

        if (cityName == '' || streetName == '' || houseNumber == '' || appartmentNumber == '') {

            setAlertTitle('שגיאה');
            setAlertMessage('נא להזין כתובת מלאה');
            setShowAlert(true);
        }
        else {

            let adressObj = {
                fullAdress: fullAddress,
                city: cityName,
                street: streetName,
                appartmentNum: appartmentNumber,
                houseNum: houseNumber
            }

            let placeholderAdress = `${streetName} ${houseNumber}, ${cityName} (דירה ${appartmentNumber})`;
            setPlaceholder(placeholderAdress);
            setModalVisible(false);
            props.sendDataFromChild(adressObj);
            resetAll();
        }
    }


    //Clear all the states:
    const resetAll = () => {

        setModalVisible(!modalVisible);
        setFullAddress('');
        setcityName('');
        setStreetName('');
        setHouseNumber('');

        setAlertMessage('');
        setAlertTitle('');
        setShowAlert(false);
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
                            onPress={resetAll}
                        >
                            <FontAwesome5 name="long-arrow-alt-left" size={40} color="#e95344" />
                        </TouchableOpacity>

                        <Text style={styles.modalText}>הזן כתובת רצויה</Text>

                        <View style={styles.viewContainer}>

                            <Text style={styles.fieldTextAdress}>רחוב ועיר:</Text>

                            <GooglePlacesAutocomplete
                                placeholder="הקלד כתובת.."
                                minLength={5}
                                query={{
                                    key: apiKey,
                                    language: 'he',       // language of the results
                                    types: 'address'      //the results we get should be adresses only
                                }}
                                onPress={(data, details = null) => handleChosenAdress(data)} //what happens when we press on the desired adress from the suggestions
                                onFail={(error) => console.error(error)}
                                enablePoweredByContainer={false}

                                styles={
                                    {
                                        container: {
                                            //holds everything
                                            flex: 1,
                                            backgroundColor: 'white',
                                            marginTop: 10,
                                            maxHeight: 150 // helps to determine the length of the visible results list
                                        },
                                        textInputContainer: {
                                            //almost invisible container around the searchbox
                                            flexDirection: 'row',
                                            backgroundColor: 'white',
                                            height: 50,

                                            marginVertical: 15,
                                        },

                                        textInput: {
                                            //the searchbox itself
                                            fontSize: 15,
                                            paddingVertical: 10,
                                            paddingHorizontal: 20,
                                            width: Dimensions.get('window').width * 0.5,
                                            height: 50,
                                            backgroundColor: 'white',
                                            borderRadius: 20,
                                            borderColor: '#3a3b40',
                                            borderWidth: 1,
                                            flex: 1,
                                            textAlign: 'right'
                                        },

                                        listView: {
                                            backgroundColor: 'red',
                                            margin: 0,
                                            textAlign: 'center'
                                        },
                                        row: {
                                            //each of the adress-results we get back
                                            padding: 8,
                                            height: 40,
                                            flexDirection: 'row',
                                            borderWidth: 1,
                                            borderLeftColor: 'lightgrey',
                                            borderTopColor: 'white',
                                            borderRightColor: 'lightgrey'
                                        },
                                        separator: {
                                            //the line that separates one result from the next
                                            height: 0.3,
                                            backgroundColor: '#c8c7cc',
                                        },
                                    }
                                }
                            />
                        </View>

                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>מספר בניין:</Text>

                            <DropDownPicker
                                items={allHouseNumbers}
                                placeholder='בחר..'
                                searchableStyle={styles.searchDDListStyle}
                                searchablePlaceholderTextColor="#3a3b40"
                                searchable={true}
                                searchablePlaceholder="הקלד לחיפוש.."
                                searchableError={() => <Text>לא נמצאו תוצאות</Text>}

                                containerStyle={styles.ddListContainer}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                style={styles.ddListGeneralStyle}
                                dropDownStyle={styles.dropDownStyle}
                                onChangeItem={item => setHouseNumber(item.label)}
                            />
                        </View>

                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>מספר דירה:</Text>
                            <DropDownPicker
                                items={allAppNumbers}
                                placeholder='בחר..'
                                searchableStyle={styles.searchDDListStyle}
                                searchablePlaceholderTextColor="#3a3b40"
                                searchable={true}
                                searchablePlaceholder="הקלד לחיפוש.."
                                searchableError={() => <Text>לא נמצאו תוצאות</Text>}

                                containerStyle={styles.ddListContainer}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                style={styles.ddListGeneralStyle}
                                dropDownStyle={styles.dropDownStyle}
                                onChangeItem={item => setAppartmentNumber(item.label)}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.saveAddressButton}
                            onPress={sendAdressToParent}>
                            <Text style={styles.saveButtonText}>אישור</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>


            <TouchableOpacity
                onPress={() => { setModalVisible(true); }}
                style={styles.popupMainButton}
            >
                <Text style={styles.popupMainButtonText}>
                    {placeholder}
                </Text>
            </TouchableOpacity>
        </View >
    );
}


const styles = StyleSheet.create({

    //Containers:
    viewContainer: {
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


    //Dropdown List:
    ddListContainer:
    {
        height: 50,
        width: 75,
        flex: 1,
        marginVertical: 10
    },
    dropDownStyle: {
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
        backgroundColor: '#f8f8f8', borderColor: '#3a3b40',
        height: 100
    },
    ddListGeneralStyle: {
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
        backgroundColor: 'white', borderColor: '#3a3b40'
    },

    searchDDListStyle: {
        backgroundColor: '#fafafa', borderColor: 'lightgrey', textAlign: 'right', marginBottom: 7, // paddingVertical: 10,
        paddingHorizontal: 20,
        height: 30,
        borderColor: '#3a3b40',
    },


    //Buttons:
    popupMainButton:
    {
        paddingVertical: 15,
        paddingHorizontal: 20,
        width: Dimensions.get('window').width * 0.6,
        height: 65,
        backgroundColor: 'white',
        borderRadius: 20,
        borderColor: '#3a3b40',
        borderWidth: 1,
        textAlign: 'right',
        //marginRight: 70
    },
    popupMainButtonText:
    {
        color: 'grey',
        textAlign: 'left',
        fontSize: 14,
        alignSelf: 'flex-start',
        fontWeight: 'bold'
    },
    addButton: {
        backgroundColor: '#e95344',
        padding: 12,
        alignSelf: 'center',
        minWidth: 180,
        height: 50,
        margin: 15,
        padding: 5,
        borderRadius: 50,
        borderColor: '#3a3b40',
        borderWidth: 1,
        flex: 1,
        textAlign: 'right'
    },
    saveAddressButton: {
        backgroundColor: '#e95344',
        borderRadius: 50,
        width: 290,
        height: 45,
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
    },
    modalText: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold'
    },


    inputTitle: {
        textAlign: 'left',
        marginBottom: 10,
        marginTop: 15,
        fontSize: 16
    },



    fieldText: {
        fontWeight: 'bold',
        paddingTop: 15,
        paddingHorizontal: 7,
        width: Dimensions.get('window').width * 0.25
    },

    fieldTextAdress: {
        fontWeight: 'bold',
        paddingBottom: 15,
        paddingHorizontal: 7,
        width: Dimensions.get('window').width * 0.25
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