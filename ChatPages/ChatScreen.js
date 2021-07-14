//Outer Imports:
import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, FlatList, StatusBar } from 'react-native'
import AwesomeAlert from 'react-native-awesome-alerts';
import Spinner from 'react-native-loading-spinner-overlay';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import { Divider } from 'react-native-paper';

//Inner Imports:
import Header from '../Components/Header';

//Icons:
import { MaterialCommunityIcons } from '@expo/vector-icons';





export default function ChatScreen(props) {

    //The personal code of the person using the app:
    const [userPersonalCode, setUserPersonalCode] = useState('');

    //all distributers for dd list:
    const [allDistributers, setAllDistributers] = useState([]);
    const [chosenDistributerToChatWith, setChosenDistributerToChatWith] = useState(null);

    //The chats he had with other distributers:
    const [messages, setMessages] = useState([]);

    //Alerts:
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');

    //Loading animation:
    const [spinner, setSpinner] = useState(true);




    useEffect(() => {

        const checkFocus = props.navigation.addListener('focus', () => {

            setChosenDistributerToChatWith(null);
            getUserID();
        });

        return () => {

            checkFocus;
        };

    }, []);



    const getUserID = async () => {

        try {

            const jsonValue = await AsyncStorage.getItem('userDetails')

            if (jsonValue != null) {

                let user = JSON.parse(jsonValue);

                // Save the ID into state
                setUserPersonalCode(user.d_PersonalCode);

                //Fetch the conversations he had with others:
                getChatsHistory(user.d_PersonalCode);
                getAllDistributers(user.d_PersonalCode);
            }
            else {

                setSpinner(false);
                setAlertMessage('התרחשה שגיאה בשליפה מהאחסון המקומי');
                setAlertTitle('שגיאה');
                setShowAlert(true);
            }
        } catch {

            setSpinner(false);
            setAlertMessage('התרחשה שגיאה בשליפה מהאחסון המקומי');
            setAlertTitle('שגיאה');
            setShowAlert(true);
        }
    }


    //Get the chats the user had (who he chatted with + lsat message between them):
    const getChatsHistory = async (thisUserID) => {

        const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/chat/getmycontacts/${thisUserID}`;
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
                    res.status == 400 ?
                        400
                        :
                        res.status == 500 ?
                            500
                            :
                            res.status == 200 ?
                                res.json()
                                :
                                res.status == 204 ?
                                    204
                                    :
                                    null;
            })
            .then(
                (result) => {

                    if (result != null && result != 204 && result != 400 && result != 404 && result != 500) {

                        // result = [{
                        //     c_UserID;    //ת.ז
                        //     c_ContactID; //ת.ז
                        //     c_UserPersonalCode;
                        //     c_ContactPersonalCode;
                        //     c_ContactFullName;
                        //     c_LastMessageContent;
                        //     c_MessageTime;
                        //  }]

                        let tempArr = [];
                        result.forEach(element => {

                            // create objects like: { personalCode, id, userFullName, messageTime: '13:49 13-06-2021', messageText}

                            let dateHourArr = element.c_MessageTime.split('T');
                            let hour = dateHourArr[1].substring(0, 5);
                            let dateArr = dateHourArr[0].split('-');
                            let date = dateArr[2] + '-' + dateArr[1] + '-' + dateArr[0].substring(2)

                            tempArr.push({

                                personalCode: `${element.c_ContactPersonalCode}`,
                                id: `${element.c_ContactID}`,     //תעודת זהות המשתמש האחר
                                userFullName: `${element.c_ContactFirstName} ${element.c_ContactLastName}`,
                                userInitials: `${element.c_ContactInitials}`,
                                messageTime: `${date} // ${hour}`,
                                messageText: `${element.c_LastMessageContent}`,
                                threadUnread: element.c_IsUnread,
                                unreadMessagesCount: element.c_UnreadMessagesCount
                            });
                        });

                        setMessages(tempArr);
                        setSpinner(false);
                    }
                    else if (result == 204) {

                        setSpinner(false);
                        setShowAlert(true);
                        setAlertTitle('אופס!');
                        setAlertMessage('לא נמצאו מפיצים במסד הנתונים')
                    }
                    else if (result == 400) {

                        setSpinner(false);
                        setShowAlert(true);
                        setAlertTitle('אופס!');
                        setAlertMessage('לא נמצאה התאמה במסד הנתונים לנתוני המשתמש')
                    }
                    else if (result == 404) {

                        setMessages([{ id: '-1', messageText: `לא נפתחו עדיין צ'טים עם מפיצים` }]);
                        setSpinner(false);
                    }
                    else if (result == 500) {

                        setSpinner(false);
                        setShowAlert(true);
                        setAlertTitle('שגיאה');
                        setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית')
                    }
                    else {

                        setSpinner(false);
                        setShowAlert(true);
                        setAlertTitle('שגיאה');
                        setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית')
                    }
                },
                (error) => {

                    setSpinner(false);
                    setShowAlert(true);
                    setAlertTitle('שגיאה');
                    setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית             ' + error)
                }
            );
    }


    //get all distributers from DB
    const getAllDistributers = (myID) => {

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

                        let ddList = [];

                        result.forEach(element => {

                            if (myID != element.d_PersonalCode) { // user cant chat with himself

                                let ddItem = {
                                    label: element.d_FirstName + ' ' + element.d_LastName + ' (' + element.d_PhoneNumber + ') ', // label = distributer name + lastName
                                    value: element.d_PersonalCode // value = distributer id
                                }

                                ddList.push(ddItem);
                            }
                        });

                        setAllDistributers(ddList);
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


    const renderItem = (item) => {

        if (item.id == '-1') { //no conversations were found

            return (
                <TouchableOpacity>

                    <View style={styles.lineContainer}>

                        <View style={styles.noMessagesContainer} >

                            <Text style={styles.noConvsText}>- {item.messageText} -</Text>
                        </View>
                    </View>

                </TouchableOpacity>
            )
        }
        else { // conversations were found
            return (
                <TouchableOpacity onPress={() => moveToConversationScreen(item.personalCode)}>

                    <View style={styles.lineContainer}>

                        <View style={styles.initialsContainer}>
                            <Text style={styles.initialsText}>{item.userInitials}</Text>
                        </View>

                        <View style={styles.chatContentContainer} >

                            <View style={styles.nameTimeContainer}>
                                <Text style={styles.chatContactName}>{item.userFullName}</Text>
                                <Text style={styles.lasMessageTime}> {item.messageTime} </Text>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 7 }}>
                                {
                                    item.messageText.length > 40 ?
                                        <Text style={styles.lastMessageText}>{item.messageText.substring(0, 33)}...</Text>
                                        :
                                        <Text style={styles.lastMessageText}>{item.messageText}</Text>
                                }
                                {
                                    item.threadUnread ?
                                        <View style={{ backgroundColor: '#e95344', height: 25, width: 25, borderRadius: 50, justifyContent: 'center' }}>
                                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12, alignSelf: 'center' }}>{item.unreadMessagesCount}</Text>
                                        </View>
                                        :
                                        <></>
                                }
                            </View>

                        </View>
                    </View>

                </TouchableOpacity>
            )
        }
    }


    const moveToConversationScreen = (contactID) => {

        if (contactID != null) {

            let c = {
                myID: userPersonalCode,
                chatWith: contactID,
            }
            props.navigation.navigate('SpecificChat', { chatterInfo: c });
        }
        else {

            setAlertMessage('נא לבחור מפיץ מהרשימה');
            setAlertTitle('שגיאה')
            setShowAlert(true);
        }
    }


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


            <View style={{ minHeight: Dimensions.get('window').height - 45, backgroundColor: 'white', }}>

                <Text style={styles.mainHeading}>צ'אט</Text>

                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>

                    <DropDownPicker

                        //Searchable dropdown list:
                        searchableStyle={styles.searchableDDListStyle}
                        searchablePlaceholderTextColor="silver"
                        searchable={true}
                        searchablePlaceholder="הקלד לחיפוש..."
                        searchableError={() => <Text>לא נמצאו תוצאות</Text>}

                        placeholder="התחלת שיחה עם..."
                        defaultValue={chosenDistributerToChatWith}
                        items={allDistributers}
                        containerStyle={styles.ddListContainer}
                        style={{ backgroundColor: '#fafafa' }}
                        itemStyle={{ justifyContent: 'flex-start' }}
                        style={styles.ddListGeneralStyle}
                        dropDownStyle={styles.dropDownStyle}
                        onChangeItem={item => setChosenDistributerToChatWith(item.value)}
                    />

                    <TouchableOpacity onPress={() => moveToConversationScreen(chosenDistributerToChatWith)}>
                        <MaterialCommunityIcons name="send-circle" size={45} color="#3a3b40" style={{ transform: [{ rotate: "180deg" }] }} />
                    </TouchableOpacity>
                </View>


                <Divider style={{ height: 2, elevation: 3, marginTop: 16, }} />

                <View style={{ alignItmes: 'center', flex: 1, marginBottom: 30 }}>

                    <FlatList
                        data={messages}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (renderItem(item))}
                        contentContainerStyle={{ flexGrow: 1 }}
                    />
                </View>
            </View >
        </>
    )
}


const styles = StyleSheet.create({

    //Containers:
    lineContainer:
    {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
    },
    initialsContainer:
    {
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: '#3a3b40',
        borderRadius: 50,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    chatContentContainer:
    {
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 15,
        paddingLeft: 0,
        marginLeft: 10,
        width: 300,

    },
    nameTimeContainer:
    {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    noMessagesContainer:
    {
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 15,
        paddingLeft: 0,
        marginLeft: 10,
    },



    mainHeading:
    {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 25
    },
    noConvsText:
    {
        fontSize: 16,
        color: '#333333',
        textAlign: 'left'
    },
    chatContactName:
    {
        fontSize: 14,
        fontWeight: 'bold'
    },
    lastMessageText:
    {
        marginTop: 4,
        fontSize: 14,
        color: '#333333',
        textAlign: 'justify'
    },
    lasMessageTime:
    {
        fontSize: 12,
        color: '#666'
    },

    //Initials Icon:
    initialsText:
    {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18
    },


    //Dropdown Lists:
    ddListGeneralStyle:
    {
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
        backgroundColor: 'white', borderColor: '#3a3b40'
    },
    dropDownStyle:
    {
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
        backgroundColor: '#f8f8f8', borderColor: '#3a3b40',
        height: 100
    },
    ddListContainer:
    {
        height: 50,
        width: Dimensions.get('window').width * 0.75,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 19,
    },

    //Dropdown Lists:
    searchableDDListStyle:
    {
        backgroundColor: '#fafafa',
        borderColor: 'lightgrey',
        textAlign: 'right',
        marginBottom: 7, // paddingVertical: 10,
        paddingHorizontal: 20,
        height: 33,
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