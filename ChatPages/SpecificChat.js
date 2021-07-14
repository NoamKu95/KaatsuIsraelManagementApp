//Outer Imports
import React, { useState, useEffect, useCallback } from 'react'
import { View, StyleSheet, Text, StatusBar } from 'react-native'
import { GiftedChat, Bubble, Send, Composer, InputToolbar, Time } from 'react-native-gifted-chat';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as Linking from 'expo-linking';

//Inner Imports:
import Header from '../Components/Header';

//Icons:
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';




export default function SpecificChat(props) {

    //Data of the user (me):
    const [userID, setUserID] = useState(props.route.params.chatterInfo.myID);


    //Data of the person I'm chatting with (my contact):
    const [contactID, setChatWithID] = useState(props.route.params.chatterInfo.chatWith);
    const [contactFullName, setContactFullName] = useState('');
    const [contactPhone, setContactPhone] = useState('');

    //Messages of the chat:
    const [messages, setMessages] = useState([]);


    //Alerts:
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');


    var name = '';



    useEffect(() => {

        const checkFocus = props.navigation.addListener('focus', () => {

            fetchUserDetails(); // get the name & token of the user (me)
            fetchContactDetails(); // get the name, phone & token of who we are chatting with
            fetchMessages();    // get the messages we sent to each other
            markMessagesAsRead();   // update the DB that all the messages were read
        });

        return () => {
            checkFocus;
        };

    }, [])


    useEffect(() => {

        // Every 7 seconds refresh the page to see if a new message was received while page is in focus
        const interval = setInterval(() => {
            fetchMessages();
        }, 7000);

        return () => clearInterval(interval);
    }, []);


    //Get the details of the contact the user is chatting with:
    const fetchContactDetails = async () => {

        const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/distributer/${contactID}`;
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

                        setContactFullName(result.d_FirstName + " " + result.d_LastName);
                        setContactPhone(result.d_PhoneNumber);

                    }
                    else if (result == 404) {

                        setShowAlert(true);
                        setAlertTitle('אופס!');
                        setAlertMessage('לא נמצאה התאמה במסד הנתונים לנתוני איש הקשר');

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
                    setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית             ' + error);
                }
            );
    }


    //Get the details of the user who is using the system (me):
    const fetchUserDetails = async () => {

        const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/distributer/${userID}`;
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

                        name = result.d_FirstName + " " + result.d_LastName;
                    }
                    else if (result == 404) {

                        setShowAlert(true);
                        setAlertTitle('אופס!');
                        setAlertMessage('לא נמצאה התאמה במסד הנתונים לנתוני המשתמש');
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
                    setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית             ' + error);
                }
            );
    }


    // Get all the messages that were exchanged between the two:
    const fetchMessages = async () => {

        const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/message/sent/${userID}/${contactID}`;
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

                        // result = [{
                        //     m_ID
                        //     m_Time
                        //     m_Content
                        //     m_Sender
                        //     m_Reciever
                        //     m_LastMessageID
                        //     m_MyContactFullName
                        //     m_MyContactPhone
                        //  }, {}, {}]

                        //Save the details of the person the chat is with:
                        setContactFullName(result[0].m_MyContactFullName);
                        setContactPhone(result[0].m_MyContactPhone);

                        //Create an array of the messages:
                        let messagesInChat = [];
                        result.forEach(element => {

                            let time = element.m_Time.substring(11, 16)

                            messagesInChat.push({

                                _id: element.m_ID, // id of the message
                                text: element.m_Content, // content of the message
                                createdAt: element.m_Time,  // time the message was sent
                                user: {
                                    _id: element.m_Sender, // who wrote the message
                                },
                            });
                        });

                        setMessages(messagesInChat);
                    }
                    else if (result == 404) {

                        //Even though there are no messages - we will still pull the contact's details:
                        fetchContactDetails();
                    }
                    else if (result == 500) {

                        setShowAlert(true);
                        setAlertTitle('שגיאה');
                        setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');

                        //Even though there was an error - we will still pull the contact's details:
                        fetchContactDetails();
                    }
                    else {

                        setShowAlert(true);
                        setAlertTitle('שגיאה');
                        setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');

                        //Even though there was an error - we will still pull the contact's details:
                        fetchContactDetails();
                    }
                },
                (error) => {

                    setShowAlert(true);
                    setAlertTitle('שגיאה');
                    setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית             ' + error);

                    //Even though there was an error - we will still pull the contact's details:
                    fetchContactDetails();
                }
            );
    }


    const markMessagesAsRead = async () => {

        const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/markasread/${userID}/${contactID}`;
        await fetch(apiUrl,
            {
                method: 'PUT',
                headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json; chartset=UTF-8',
                })
            })
            .then(res => {

                return res.status == 500 ?
                    500
                    :
                    res.status == 404 ?
                        404
                        :
                        res.status == 200 ?
                            200
                            :
                            null;
            })
            .then(
                (result) => {

                    if (result == 200) {

                        // Messages were marked as read 
                    }
                    else if (result == 404) {

                        // No unread messages between the two
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
                    setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית             ' + error);
                }
            );
    }


    // What to do when sending a message:
    const onSend = useCallback((messages = []) => {

        //Fix the time to be IL time (and not UTC):
        let todayMonth = `${new Date().getMonth() + 1}`.padStart(2, '0');
        let todayDay = `${new Date().getDate()}`.padStart(2, '0');
        let nowHour = `${new Date().getHours()}`.padStart(2, '0');
        let nowMinutes = `${new Date().getMinutes()}`.padStart(2, '0');
        let nowSeconds = `${new Date().getSeconds()}`.padStart(2, '0');

        let now = `${new Date().getFullYear()}-${todayMonth}-${todayDay}T${nowHour}:${nowMinutes}:${nowSeconds}`;

        //Turn the message to an object that fits the DB:
        let newMessage = {
            m_Time: now,
            m_Content: messages[0].text,
            m_Sender: userID,
            m_Reciever: contactID,
        }

        //Add the message to the DB:
        addMessageToDB(newMessage);

    }, [])


    const addMessageToDB = async (newMessage) => {

        const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/message`;
        await fetch(apiUrl,
            {
                method: 'POST',
                body: JSON.stringify(newMessage),
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
                            res.status == 409 ?
                                409
                                :
                                null;
            })
            .then(
                (result) => {

                    if (result != null && result != 404 && result != 500 && result != 409) {

                        //Send notification to the other person about the new message he got:
                        let notification = {
                            title: `KAATSU || הודעה חדשה מ${name}`,
                            body: newMessage.m_Content,
                            to: [result],
                            data: {
                                action: "chat",
                                contactID: userID,  // to the other person, I (the current user) will be the contact
                                userID: contactID, // to the other person, Him (the current contact) will be the user
                            }
                        };

                        schedulePushNotification(notification);
                        fetchMessages();
                    }
                    else if (result == 404) { // message added successfully but cotact has no expo token

                        setShowAlert(true);
                        setAlertTitle('אופס!');
                        setAlertMessage('איש הקשר אינו מחובר לאפליקציה ועל כן לא קיבל את הודעתך');

                        fetchMessages();
                    }
                    else if (result == 409) {

                        setShowAlert(true);
                        setAlertTitle('אופס!');
                        setAlertMessage('ההודעה שהוזנה אינה עומדת בתנאי השרת ומסד הנתונים. נא לבדוק את התוכן שהוזן ולנסות שנית');
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
                    setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית             ' + error);
                }
            );
    }



    async function schedulePushNotification(pushNotification) {

        let apiUrl = `https://exp.host/--/api/v2/push/send`;    // Expo's API
        fetch(apiUrl,
            {
                method: 'POST',
                body: JSON.stringify(pushNotification),
                headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json; chartset=UTF-8',
                })
            })
            .then(res => {

                return res.status == 200 ?
                    res.json()
                    :
                    null;
            })
            .then(
                (result) => {

                    if (result == null) {

                        setAlertMessage('התרחשה תקלה במהלך שליחת ההתראה לאיש הקשר. נא לרענן ולנסות שנית');
                        setAlertTitle('שגיאה');
                        setShowAlert(true);
                    }
                },
                (error) => {

                    setAlertMessage('התרחשה תקלה בתקשורת עם מסד הנתונים. נא לנסות שנית             ' + error);
                    setAlertTitle('שגיאה');
                    setShowAlert(true);
                }
            );
    }





    //Design of the chat bubbles:
    const renderBubble = (props) => {

        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: { // user
                        backgroundColor: '#e6e6e6',
                        borderRadius: 20,
                        borderTopRightRadius: 0,
                        borderWidth: 1,
                        borderColor: 'black',
                        marginVertical: 3
                    },
                    left: { // other person
                        backgroundColor: 'white',
                        borderRadius: 20,
                        borderTopLeftRadius: 0,
                        borderWidth: 1,
                        borderColor: 'black',
                        marginVertical: 3
                    }
                }}
                textStyle={{
                    right: { // user
                        color: '#3a3b40',
                        padding: 5,
                        textAlign: 'left'
                    },
                    left: { // other person
                        color: '#3a3b40',
                        padding: 5,
                        textAlign: 'left'
                    }
                }}
            />
        )
    }

    //Design of the send button:
    const renderSend = (props) => {
        return (
            <Send {...props}>

                <View style={{ rotate: '180deg' }}>
                    <MaterialCommunityIcons name="send-circle" size={36} color={'#3a3b40'} style={styles.sendButton} />
                </View>

            </Send>
        )
    }

    //Design of the "back to bottom" button: 
    const scrollToBottomComponent = (prop) => {

        return (
            <FontAwesome name="angle-double-down" size={32} color={'#3a3b40'} style={{ paddingTop: 2 }} />
        );
    }

    //Design of the text writing area:
    const renderComposer = (props) => (
        <Composer
            {...props}
            textInputStyle={{
                color: '#222B45',
                backgroundColor: 'white',
                paddingTop: 8.5,
                paddingHorizontal: 12,
                marginLeft: 0,
            }}
        />
    );

    //Design of the bottom part of the chat:
    const renderInputToolbar = (props) => (
        <InputToolbar
            {...props}
            containerStyle={{
                backgroundColor: 'white',
                paddingTop: 6,
            }}
            primaryStyle={{ alignItems: 'center' }}
        />
    );



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

            <View style={styles.mainContainer}>

                <View style={styles.upperPartContainer}>

                    <Text style={styles.mainHeading}>{contactFullName}</Text>

                    <Ionicons name="md-call" size={25} color='white' style={styles.phoneIconStyle}
                        onPress={() => Linking.openURL(`tel:${contactPhone}`)}
                    />

                </View>



                <GiftedChat
                    placeholder={'הקלד/י...'}
                    messages={messages}
                    user={{ _id: userID }}

                    renderBubble={renderBubble}
                    renderSend={renderSend}
                    scrollToBottomComponent={scrollToBottomComponent}
                    renderComposer={renderComposer}
                    renderInputToolbar={renderInputToolbar}

                    renderTime={(props) => (
                        <View style={props.containerStyle}>
                            <Text size={10} style={styles.bubbleTimeStyle}>
                                {`${props.currentMessage.createdAt.substring(11, 16)} // ${props.currentMessage.createdAt.substring(8, 10)}-${props.currentMessage.createdAt.substring(5, 7)}-${props.currentMessage.createdAt.substring(2, 4)}`}
                            </Text>
                        </View>
                    )}

                    onSend={messages => onSend(messages)}
                    scrollToBottom
                    alwaysShowSend
                    renderAvatar={null}
                    maxInputLength={250} // max length of a message to be typed in
                    renderDay={(props) => (<></>)} //make the saperating dates to disappear
                    dateFormat={'DD-MM-YYYY'}
                />
            </View>
        </>
    )
}


const styles = StyleSheet.create({

    //Containers:
    mainContainer:
    {
        backgroundColor: '#3a3b40',
        flex: 1
    },
    upperPartContainer:
    {
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 2,
        borderBottomColor: '#dfe0e4'
    },


    //Headers:
    mainHeading:
    {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'left',
        color: '#3a3b40',
    },


    //Chat:
    bubbleTimeStyle:
    {
        marginHorizontal: 20,
        marginBottom: 8,
        color: '#3a3b40',
        fontSize: 12,
        textAlign: 'right'
    },


    //BUTTONS:
    sendButton:
    {
        marginBottom: 5,
        marginLeft: 5,
        transform: [{ rotate: '180deg' }]
    },
    phoneIconStyle:
    {
        backgroundColor: "#e95344",
        borderRadius: 20,
        width: 40,
        height: 40,
        padding: 7,
        marginLeft: 6
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