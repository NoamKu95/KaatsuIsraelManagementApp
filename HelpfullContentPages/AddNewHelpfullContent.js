//Outer Imports:
import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, KeyboardAvoidingView } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import Spinner from 'react-native-loading-spinner-overlay';

//Inner Imports:
import Header from '../Components/Header';


export default function AddNewHelpfullContent(props) {

    // View \ Edit Mode:
    const [contentType, setContentType] = useState('סרטונים');     // סרטונים / מאמרים / שאלות ותשובות
    const [shownTo, setShownTo] = useState('שיווק');          // שיווק / פיטנס / שיקום / פיק פרפורמנס

    //Video 
    const [vidName, setVidName] = useState(null);
    const [vidSummary, setVidSummary] = useState(null);
    const [vidLink, setVidLink] = useState(null);


    //Article
    const [artName, setArtName] = useState(null);
    const [artSummary, setArtSummary] = useState(null);
    const [artLink, setArtLink] = useState(null);


    //Q&A
    const [question, setQuestion] = useState(null);
    const [answer, setAnswer] = useState(null);


    //Alerts:
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');


    //Loading animation:
    const [spinner, setSpinner] = useState(false);

    const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0;      // To lift the screen when keyboard is open




    // Check all fields have valid content in them:
    const checkInputs = () => {

        let allGood = false;

        if (contentType == 'סרטונים') {

            if (vidName == null || vidName == '') {

                setAlertMessage('יש להזין שם לסרטון');
                setAlertTitle('שגיאה');
                setShowAlert(true);
            }
            else if (vidName.length < 5) {

                setAlertMessage('יש להזין שם לסרטון באורך של 5 תווים לפחות');
                setAlertTitle('שגיאה');
                setShowAlert(true);
            }
            else {

                if (vidSummary == null || vidSummary == '') {

                    setAlertMessage('יש להזין תיאור לסרטון');
                    setAlertTitle('שגיאה');
                    setShowAlert(true);
                }

                else if (vidSummary.length < 5) {

                    setAlertMessage('יש להזין תיאור לסרטון באורך של 5 תווים לפחות');
                    setAlertTitle('שגיאה');
                    setShowAlert(true);
                }
                else {

                    if (vidLink == null || vidLink == '') {

                        setAlertMessage('יש להזין קישור לצפייה לסרטון');
                        setAlertTitle('שגיאה');
                        setShowAlert(true);
                    }
                    else {

                        if (!vidLink.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/)) {

                            setAlertMessage('יש להזין כתובת קישור מלאה ותקנית');
                            setAlertTitle('שגיאה');
                            setShowAlert(true);
                        }
                        else {

                            allGood = true;
                        }
                    }
                }
            }
        }
        else if (contentType == 'מאמרים') {

            if (artName == null || artName == '') {

                setAlertMessage('יש להזין שם למאמר');
                setAlertTitle('שגיאה');
                setShowAlert(true);
            }
            else if (artName.length < 5) {

                setAlertMessage('יש להזין שם למאמר באורך של 5 תווים לפחות');
                setAlertTitle('שגיאה');
                setShowAlert(true);
            }
            else {

                if (artSummary == null || artSummary == '') {

                    setAlertMessage('יש להזין תקציר למאמר');
                    setAlertTitle('שגיאה');
                    setShowAlert(true);
                }
                else if (artSummary.length < 5) {

                    setAlertMessage('יש להזין תקציר למאמר באורך של 5 תווים לפחות');
                    setAlertTitle('שגיאה');
                    setShowAlert(true);
                }
                else {

                    if (artLink == null || artLink == '') {

                        setAlertMessage('יש להזין קישור לקריאת המאמר');
                        setAlertTitle('שגיאה');
                        setShowAlert(true);
                    }
                    else {

                        if (!artLink.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/)) {

                            setAlertMessage('יש להזין כתובת קישור מלאה ותקנית');
                            setAlertTitle('שגיאה');
                            setShowAlert(true);
                        }
                        else {

                            allGood = true;
                        }
                    }
                }
            }
        }
        else if (contentType == 'שאלות ותשובות') {

            if (question == null || question == '') {

                setAlertMessage('יש להזין תוכן לשאלה');
                setAlertTitle('שגיאה');
                setShowAlert(true);
            }
            else if (question.length < 10) {

                setAlertMessage('יש להזין תוכן לשאלה באורך של 10 תווים לפחות');
                setAlertTitle('שגיאה');
                setShowAlert(true);
            }
            else {

                if (answer == null || answer == '') {

                    setAlertMessage('יש להזין תוכן לתשובה ');
                    setAlertTitle('שגיאה');
                    setShowAlert(true);
                }
                else if (answer.length < 5) {

                    setAlertMessage('יש להזין תוכן לתשובה באורך של 5 תווים לפחות');
                    setAlertTitle('שגיאה');
                    setShowAlert(true);
                }
                else {

                    allGood = true;
                }
            }
        }


        allGood ? uploadContentToDB() : '';
    }



    // Send the updated data to the DB:
    const uploadContentToDB = () => {

        setSpinner(true);

        if (contentType == 'סרטונים') {

            let newVido = {
                hc_Subject: vidName,
                hc_Summary: vidSummary,
                hc_Link: vidLink,
                hc_shownTo: shownTo
            }

            let apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/video`;
            fetch(apiUrl,
                {
                    method: 'POST',
                    body: JSON.stringify(newVido),
                    headers: new Headers({
                        'Content-Type': 'application/json; charset=UTF-8',
                        'Accept': 'application/json; chartset=UTF-8',
                    })
                })
                .then(res => {

                    return res.status == 409 ?
                        409
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

                        if (result != null && result != 409 && result != 500) {

                            //Let the user know the details were saved:
                            setSpinner(false);
                            setAlertTitle('פעולה בוצעה בהצלחה');
                            setAlertMessage('הוידאו התווסף בהצלחה למסד הנתונים');
                            setShowAlert(true);

                            setVidName(null);
                            setVidSummary(null);
                            setVidLink(null);

                            var timeout = setTimeout(() => {

                                props.navigation.navigate('MoreOptionsStack', {
                                    screen: 'ViewAllAvailableHelpfullContent',
                                });

                            }, 2000)
                        }
                        else if (result == 409) {

                            setSpinner(false);
                            setAlertMessage('הנתונים שהוזנו אינם עומדים בתנאי השרת ומסד הנתונים. נא לבדוק את הנתונים שהוזנו ולנסות שנית');
                            setAlertTitle('אופס!');
                            setShowAlert(true);
                        }
                        else if (result == 500) {

                            setSpinner(false);
                            setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                            setAlertTitle('שגיאה');
                            setShowAlert(true);
                        }
                        else {

                            setSpinner(false);
                            setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                            setAlertTitle('שגיאה');
                            setShowAlert(true);
                        }
                    },
                    (error) => {

                        setSpinner(false);
                        setAlertMessage('התרחשה תקלה בתקשורת עם מסד הנתונים. נא לנסות שנית             ' + error);
                        setAlertTitle('שגיאה');
                        setShowAlert(true);
                    }
                );
        }
        else if (contentType == 'מאמרים') {

            let newArticle = {
                hc_Subject: artName,
                hc_Summary: artSummary,
                hc_FileURI: artLink,
                hc_shownTo: shownTo
            }

            let apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/article`;
            fetch(apiUrl,
                {
                    method: 'POST',
                    body: JSON.stringify(newArticle),
                    headers: new Headers({
                        'Content-Type': 'application/json; charset=UTF-8',
                        'Accept': 'application/json; chartset=UTF-8',
                    })
                })
                .then(res => {

                    return res.status == 409 ?
                        409
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

                        if (result != null && result != 409 && result != 500) {

                            //Let the user know the details were saved:
                            setSpinner(false);
                            setAlertTitle('פעולה בוצעה בהצלחה');
                            setAlertMessage('המאמר התווסף בהצלחה למסד הנתונים');
                            setShowAlert(true);

                            setArtName(null);
                            setArtSummary(null);
                            setArtLink(null);

                            var timeout = setTimeout(() => {

                                props.navigation.navigate('MoreOptionsStack', {
                                    screen: 'ViewAllAvailableHelpfullContent',
                                });

                            }, 2000)
                        }
                        else if (result == 409) {

                            setSpinner(false);
                            setAlertMessage('הנתונים שהוזנו אינם עומדים בתנאי השרת ומסד הנתונים. נא לבדוק את הנתונים שהוזנו ולנסות שנית');
                            setAlertTitle('אופס!');
                            setShowAlert(true);
                        }
                        else if (result == 500) {

                            setSpinner(false);
                            setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                            setAlertTitle('שגיאה');
                            setShowAlert(true);
                        }
                        else {

                            setSpinner(false);
                            setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                            setAlertTitle('שגיאה');
                            setShowAlert(true);
                        }
                    },
                    (error) => {

                        setSpinner(false);
                        setAlertMessage('התרחשה תקלה בתקשורת עם מסד הנתונים. נא לנסות שנית             ' + error);
                        setAlertTitle('שגיאה');
                        setShowAlert(true);
                    }
                );
        }
        else if (contentType == 'שאלות ותשובות') {

            let newQA = {
                hc_Question: question,
                hc_Answer: answer,
                hc_shownTo: shownTo
            }

            let apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/questionsanswer`;
            fetch(apiUrl,
                {
                    method: 'POST',
                    body: JSON.stringify(newQA),
                    headers: new Headers({
                        'Content-Type': 'application/json; charset=UTF-8',
                        'Accept': 'application/json; chartset=UTF-8',
                    })
                })
                .then(res => {

                    return res.status == 409 ?
                        409
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

                        if (result != null && result != 409 && result != 500) {

                            //Let the user know the details were saved:
                            setSpinner(false);
                            setAlertTitle('פעולה בוצעה בהצלחה');
                            setAlertMessage('השאלה והתשובה התווספו בהצלחה למסד הנתונים');
                            setShowAlert(true);

                            setQuestion(null);
                            setAnswer(null);

                            var timeout = setTimeout(() => {

                                props.navigation.navigate('MoreOptionsStack', {
                                    screen: 'ViewAllAvailableHelpfullContent',
                                });

                            }, 2000)
                        }
                        else if (result == 409) {

                            setSpinner(false);
                            setAlertMessage('הנתונים שהוזנו אינם עומדים בתנאי השרת ומסד הנתונים. נא לבדוק את הנתונים שהוזנו ולנסות שנית');
                            setAlertTitle('אופס!');
                            setShowAlert(true);
                        }
                        else if (result == 500) {

                            setSpinner(false);
                            setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                            setAlertTitle('שגיאה');
                            setShowAlert(true);
                        }
                        else {

                            setSpinner(false);
                            setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                            setAlertTitle('שגיאה');
                            setShowAlert(true);
                        }
                    },
                    (error) => {

                        setSpinner(false);
                        setAlertMessage('התרחשה תקלה בתקשורת עם מסד הנתונים. נא לנסות שנית             ' + error);
                        setAlertTitle('שגיאה');
                        setShowAlert(true);
                    }
                );
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


            <ScrollView style={{ backgroundColor: 'white', minHeight: Dimensions.get('window').height - 45 }}>

                <View style={styles.mainContainer}>

                    <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={keyboardVerticalOffset}>

                        {/* HEADING */}
                        <Text style={styles.mainHeading}>הוספת תוכן עזר חדש</Text>


                        {/* RADIO BUTTONS TO CHOOSE THE CONTENT TYPE */}
                        <View style={styles.radioButtonsMainContainer}>

                            <View style={styles.radioButtonWrapper}>

                                <TouchableOpacity onPress={() => setContentType('סרטונים')}
                                    style={styles.singleRadioButtonContainer}
                                >
                                    {
                                        contentType == 'סרטונים' ?
                                            <View style={styles.radioButtonInnerCircle} />
                                            :
                                            null
                                    }
                                </TouchableOpacity>

                                <Text style={styles.radioButtonText}>סרטון</Text>

                            </View>

                            <View style={styles.radioButtonWrapper}>

                                <TouchableOpacity onPress={() => setContentType('מאמרים')}
                                    style={styles.singleRadioButtonContainer}
                                >
                                    {
                                        contentType == 'מאמרים' ?
                                            <View style={styles.radioButtonInnerCircle} />
                                            :
                                            null
                                    }
                                </TouchableOpacity>

                                <Text style={styles.radioButtonText}>מאמר</Text>

                            </View>

                            <View style={styles.radioButtonWrapper}>

                                <TouchableOpacity onPress={() => setContentType('שאלות ותשובות')}
                                    style={styles.singleRadioButtonContainer}
                                >
                                    {
                                        contentType == 'שאלות ותשובות' ?
                                            <View style={styles.radioButtonInnerCircle} />
                                            :
                                            null
                                    }
                                </TouchableOpacity>

                                <Text style={styles.radioButtonText}>שאלה ותשובה</Text>

                            </View>
                        </View>


                        {/* NAME OF HC */}
                        {
                            contentType == 'סרטונים' ?
                                <View style={styles.viewContainer}>
                                    <Text style={styles.fieldText}>שם סרטון:</Text>
                                    <TextInput
                                        defaultValue={vidName}
                                        onChangeText={(e) => setVidName(e)}
                                        maxLength={70} style={styles.txtInput}
                                    ></TextInput>
                                </View>
                                :
                                contentType == 'מאמרים' ?
                                    <View style={styles.viewContainer}>
                                        <Text style={styles.fieldText}>שם המאמר:</Text>
                                        <TextInput
                                            defaultValue={artName}
                                            onChangeText={(e) => setArtName(e)}
                                            maxLength={70} style={styles.txtInput}
                                        ></TextInput>
                                    </View>
                                    :
                                    <></>
                        }


                        {/* SUMMARY / DESCRIPTION */}
                        {
                            contentType == 'סרטונים' ?
                                <View style={styles.viewContainer}>
                                    <Text style={styles.fieldText}>תיאור:</Text>
                                    <TextInput
                                        defaultValue={vidSummary}
                                        onChangeText={(e) => setVidSummary(e)}
                                        scrollEnabled
                                        multiline
                                        numberOfLines={5}
                                        maxLength={225}
                                        style={styles.multilineTextInput}
                                    >
                                    </TextInput>
                                </View>
                                :
                                contentType == 'מאמרים' ?
                                    <View style={styles.viewContainer}>
                                        <Text style={styles.fieldText}>תקציר:</Text>
                                        <TextInput
                                            defaultValue={artSummary}
                                            onChangeText={(e) => setArtSummary(e)}
                                            scrollEnabled
                                            multiline
                                            numberOfLines={5}
                                            maxLength={225}
                                            style={styles.multilineTextInput}
                                        ></TextInput>
                                    </View>
                                    :
                                    <></>
                        }

                        {/* LINK */}
                        {
                            contentType == 'סרטונים' ?
                                <View style={styles.viewContainer}>
                                    <Text style={styles.fieldText}>קישור:</Text>
                                    <TextInput
                                        defaultValue={vidLink}
                                        onChangeText={(e) => setVidLink(e)}
                                        scrollEnabled
                                        multiline
                                        numberOfLines={5}
                                        maxLength={225}
                                        style={styles.multilineTextInput}
                                    >
                                    </TextInput>
                                </View>
                                :
                                contentType == 'מאמרים' ?
                                    <View style={styles.viewContainer}>
                                        <Text style={styles.fieldText}>לינק לקריאה:</Text>
                                        <TextInput
                                            defaultValue={artLink}
                                            onChangeText={(e) => setArtLink(e)}
                                            scrollEnabled
                                            multiline
                                            numberOfLines={5}
                                            maxLength={225}
                                            style={styles.multilineTextInput}
                                        >
                                        </TextInput>
                                    </View>
                                    :
                                    <></>
                        }

                        {/* Q&A */}
                        {
                            contentType == 'שאלות ותשובות' ?
                                <>
                                    <View style={styles.topBaselineContainer}>
                                        <Text style={styles.fieldText}>שאלה:</Text>
                                        <TextInput
                                            defaultValue={question}
                                            onChangeText={(e) => setQuestion(e)}
                                            scrollEnabled
                                            multiline
                                            numberOfLines={5}
                                            maxLength={225}
                                            style={styles.QAmultilineTextInput}
                                        >
                                        </TextInput>
                                    </View>

                                    <View style={styles.topBaselineContainer}>
                                        <Text style={styles.fieldText}>תשובה:</Text>
                                        <TextInput
                                            defaultValue={answer}
                                            onChangeText={(e) => setAnswer(e)}
                                            scrollEnabled
                                            multiline
                                            numberOfLines={5}
                                            maxLength={225}
                                            style={styles.QAmultilineTextInput}
                                        >
                                        </TextInput>
                                    </View>
                                </>
                                :
                                <></>
                        }

                    </KeyboardAvoidingView>

                    {/* RADIO BUTTONS TO CHOOSE WHO THIS CONTENT IS FOR */}
                    <Text style={styles.secondaryHeading}>מוצג עבור:</Text>

                    <View style={styles.bottomRadioButtonsWrapper}>

                        <View style={styles.bottomRadioButtonContainer}>

                            <TouchableOpacity onPress={() => setShownTo('שיווק')}
                                style={styles.singleRadioButtonContainer}
                            >
                                {
                                    shownTo == 'שיווק' ?
                                        <View style={styles.radioButtonInnerCircle} />
                                        :
                                        null
                                }
                            </TouchableOpacity>

                            <Text style={styles.bottomRadioButtonText}>שיווק</Text>

                        </View>

                        <View style={styles.bottomRadioButtonContainer}>

                            <TouchableOpacity onPress={() => setShownTo('שיקום')}
                                style={styles.singleRadioButtonContainer}
                            >
                                {
                                    shownTo == 'שיקום' ?
                                        <View style={styles.radioButtonInnerCircle} />
                                        :
                                        null
                                }
                            </TouchableOpacity>

                            <Text style={styles.bottomRadioButtonText}>שיקום</Text>

                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
                        <View style={styles.bottomRadioButtonContainer}>

                            <TouchableOpacity onPress={() => setShownTo('פיטנס')}
                                style={styles.singleRadioButtonContainer}
                            >
                                {
                                    shownTo == 'פיטנס' ?
                                        <View style={styles.radioButtonInnerCircle} />
                                        :
                                        null
                                }
                            </TouchableOpacity>

                            <Text style={styles.bottomRadioButtonText}>פיטנס</Text>

                        </View>

                        <View style={styles.bottomRadioButtonContainer}>

                            <TouchableOpacity onPress={() => setShownTo('פיק פרפורמנס')}
                                style={styles.singleRadioButtonContainer}
                            >
                                {
                                    shownTo == 'פיק פרפורמנס' ?
                                        <View style={styles.radioButtonInnerCircle} />
                                        :
                                        null
                                }
                            </TouchableOpacity>

                            <Text style={styles.bottomRadioButtonText}>פיק פרפורמנס</Text>

                        </View>
                    </View>


                    {/* SAVE BUTTON */}
                    <TouchableOpacity
                        onPress={checkInputs}
                        style={styles.saveButton}>
                        <Text style={styles.saveButtonText}>
                            שמור
                        </Text>
                    </TouchableOpacity>

                </View>

            </ScrollView>
        </>
    );
}


const styles = StyleSheet.create({

    //Containers:
    mainContainer:
    {
        paddingHorizontal: 20,
        backgroundColor: 'white',
    },
    viewContainer: {
        flexDirection: 'row',
        alignItems: 'baseline'
    },
    topBaselineContainer:
    {
        flexDirection: 'row',
    },
    radioButtonsMainContainer:
    {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10
    },
    radioButtonWrapper:
    {
        flexDirection: 'row',
        alignItems: 'center',
        width: Dimensions.get('window').width / 3.5
    },
    singleRadioButtonContainer:
    {
        height: 20,
        width: 20,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#3a3b40',
        alignItems: 'center',
        justifyContent: 'center'
    },
    bottomRadioButtonsWrapper:
    {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10
    },
    bottomRadioButtonContainer:
    {
        flexDirection: 'row',
        alignItems: 'center',
        width: Dimensions.get('window').width / 3
    },


    //Headers:
    mainHeading:
    {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 15,
        marginBottom: 30
    },
    secondaryHeading:
    {
        fontWeight: 'bold',
        marginVertical: 15
    },



    fieldText: {
        fontWeight: 'bold',
        flex: 1,
        alignSelf: 'center'
    },
    radioButtonText:
    {
        fontSize: 14,
        marginHorizontal: 7
    },
    bottomRadioButtonText:
    {
        fontSize: 16,
        marginHorizontal: 7
    },
    radioButtonInnerCircle:
    {
        height: 9,
        width: 9,
        borderRadius: 6,
        backgroundColor: '#3a3b40',
    },


    //Text Inputs:
    txtInput: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 15,
        minWidth: 190,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 20,
        borderColor: '#3a3b40',
        borderWidth: 1,
        flex: 1,
        textAlign: 'right'
    },
    multilineTextInput:
    {
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginVertical: 15,
        minWidth: 190,
        height: 90,
        backgroundColor: 'white',
        borderRadius: 20,
        borderColor: '#3a3b40',
        borderWidth: 1,
        flex: 1,
        textAlign: 'right',
        textAlignVertical: 'top',
        minHeight: 100
    },
    QAmultilineTextInput:
    {
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginVertical: 15,
        minWidth: 190,
        height: 90,
        backgroundColor: 'white',
        borderRadius: 20,
        borderColor: '#3a3b40',
        borderWidth: 1,
        flex: 1,
        textAlign: 'right',
        textAlignVertical: 'top',
        minHeight: 150
    },


    //Save Button:
    saveButton: {
        backgroundColor: '#e95344',
        borderRadius: 50,
        padding: 7,
        width: Dimensions.get('window').width * 0.9,
        height: 45,
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'center',
        marginVertical: 15
    },
    saveButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
        alignSelf: 'center',
        fontWeight: 'bold'
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