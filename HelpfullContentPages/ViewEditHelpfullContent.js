//Outer Imports:
import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import Spinner from 'react-native-loading-spinner-overlay';

//Inner Imports:
import Header from '../Components/Header';

//Icons:
import { Ionicons } from '@expo/vector-icons';




export default function ViewEditHelpfullContent(props) {

    //Content:
    const [contentID, setContentID] = useState(props.route.params.thisContent.hcID);
    const [contentType, setContentType] = useState(props.route.params.thisContent.hcType);     // סרטונים / מאמרים / שאלות ותשובות
    const [shownTo, setShownTo] = useState(props.route.params.thisContent.hcShownTo);          // שיווק / פיטנס / שיקום / פיק פרפורמנס

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




    useEffect(() => {

        const checkFocus = props.navigation.addListener('focus', () => {

            fetchHelpfullContentDetails();
        });

        return checkFocus;
    }, []);



    const fetchHelpfullContentDetails = async () => {

        if (contentType == 'סרטונים') {

            let apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/video/${contentID}`;
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

                            setVidName(result.hc_Subject);
                            setVidLink(result.hc_Link);
                            setVidSummary(result.hc_Summary);
                        }
                        else if (result == 404) {

                            setAlertMessage('לא נמצאה התאמה במסד הנתונים לנתוני הסרטון');
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

                        setAlertMessage('התרחשה תקלה בתקשורת עם מסד הנתונים. נא לנסות שנית             ' + error);
                        setAlertTitle('שגיאה');
                        setShowAlert(true);
                    }
                )
        }
        else if (contentType == 'מאמרים') {

            let apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/article/${contentID}`;
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

                            setArtName(result.hc_Subject);
                            setArtLink(result.hc_FileURI);
                            setArtSummary(result.hc_Summary);
                        }
                        else if (result == 404) {

                            setAlertMessage('ךא נמצאה התאמה במסד הנתונים לנתוני המאמר');
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

                        setAlertMessage('התרחשה תקלה בתקשורת עם מסד הנתונים. נא לנסות שנית             ' + error);
                        setAlertTitle('שגיאה');
                        setShowAlert(true);
                    }
                )
        }
        else // contentType == 'שאלות ותשובות'
        {
            let apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/questionsanswer/${contentID}`;
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

                            setQuestion(result.hc_Question);
                            setAnswer(result.hc_Answer);
                        }
                        else if (result == 404) {

                            setAlertMessage('לא נמצאה התאמה במסד הנתונים לנתוני השאלה והתשובה');
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

                        setAlertMessage('התרחשה תקלה בתקשורת עם מסד הנתונים. נא לנסות שנית             ' + error);
                        setAlertTitle('שגיאה');
                        setShowAlert(true);
                    }
                )
        }
    }


    // Toggle between creating a new תזכורת and creating a new אירוע:
    const changeViewerType = (newViewerType) => {

        newViewerType == 'שיווק' ?
            setShownTo('שיווק')
            :
            newViewerType == 'שיקום' ?
                setShownTo('שיקום')
                :
                newViewerType == 'פיטנס' ?
                    setShownTo('פיטנס')
                    :
                    setShownTo('פיק פרפורמנס');
    }


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


        allGood ? updateContentInDB() : '';
    }



    // Send the updated data to the DB:
    const updateContentInDB = () => {

        setSpinner(true);

        if (contentType == 'סרטונים') {

            let updatedVid = {
                hc_Subject: vidName,
                hc_Summary: vidSummary,
                hc_Link: vidLink,
                hc_shownTo: shownTo
            }

            let apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/updatevideo/${contentID}`;
            fetch(apiUrl,
                {
                    method: 'PUT',
                    body: JSON.stringify(updatedVid),
                    headers: new Headers({
                        'Content-Type': 'application/json; charset=UTF-8',
                        'Accept': 'application/json; chartset=UTF-8',
                    })
                })
                .then(res => {

                    return res.status == 404 ?
                        404
                        :
                        res.status == 409 ?
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

                        if (result != null && result != 404 && result != 409 && result != 500) {

                            //Let the user know the details were saved:
                            setSpinner(false);
                            setAlertTitle('פעולה בוצעה בהצלחה');
                            setAlertMessage('פרטי הסרטון עודכנו בהצלחה במסד הנתונים');
                            setShowAlert(true);
                        }
                        else if (result == 404) {

                            setSpinner(false);
                            setAlertMessage('לא נמצאה התאמה במסד הנתונים לנתוני הסרטון');
                            setAlertTitle('אופס!');
                            setShowAlert(true);
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

            let updatedArt = {
                hc_Subject: artName,
                hc_Summary: artSummary,
                hc_Link: artLink,
                hc_shownTo: shownTo
            }

            let apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/updatearticle/${contentID}`;
            fetch(apiUrl,
                {
                    method: 'PUT',
                    body: JSON.stringify(updatedArt),
                    headers: new Headers({
                        'Content-Type': 'application/json; charset=UTF-8',
                        'Accept': 'application/json; chartset=UTF-8',
                    })
                })
                .then(res => {

                    return res.status == 404 ?
                        404
                        :
                        res.status == 409 ?
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

                        if (result != null && result != 404 && result != 409 && result != 500) {

                            //Let the user know the details were saved:
                            setSpinner(false);
                            setAlertTitle('פעולה בוצעה בהצלחה');
                            setAlertMessage('פרטי המאמר עודכנו בהצלחה במסד הנתונים');
                            setShowAlert(true);
                        }
                        else if (result == 404) {

                            setSpinner(false);
                            setAlertMessage('לא נמצאה התאמה במסד הנתונים לנתוני המאמר');
                            setAlertTitle('אופס!');
                            setShowAlert(true);
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

            let updatedQA = {
                hc_Question: question,
                hc_Answer: answer,
                hc_shownTo: shownTo
            }

            let apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/updateqa/${contentID}`;
            fetch(apiUrl,
                {
                    method: 'PUT',
                    body: JSON.stringify(updatedQA),
                    headers: new Headers({
                        'Content-Type': 'application/json; charset=UTF-8',
                        'Accept': 'application/json; chartset=UTF-8',
                    })
                })
                .then(res => {

                    return res.status == 404 ?
                        404
                        :
                        res.status == 409 ?
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

                        if (result != null && result != 404 && result != 409 && result != 500) {

                            //Let the user know the details were saved:
                            setSpinner(false);
                            setAlertTitle('פעולה בוצעה בהצלחה');
                            setAlertMessage('פרטי השאלה והתשובה עודכנו בהצלחה במסד הנתונים');
                            setShowAlert(true);
                        }
                        else if (result == 404) {

                            setSpinner(false);
                            setAlertMessage('לא נמצאה התאמה במסד הנתוניםלנתוני השאלה והתשובה');
                            setAlertTitle('אופס!');
                            setShowAlert(true);
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


    // Remove the helpfull content from the DB:
    const deleteContent = () => {

        setSpinner(true);

        let apiUrl = '';

        contentType == "סרטונים" ?
            apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/video/${contentID}`
            :
            contentType == 'מאמרים' ?
                apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/article/${contentID}`
                :
                apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/questionsanswer/${contentID}`


        fetch(apiUrl,
            {
                method: 'DELETE',
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

                        setSpinner(false);
                        setAlertMessage('תוכן העזר נמחק בהצלחה ממסד הנתונים');
                        setAlertTitle('פעולה בוצעה בהצלחה');
                        setShowAlert(true);

                        var timeout = setTimeout(() => {

                            props.navigation.navigate('MoreOptionsStack', {
                                screen: 'ViewAllAvailableHelpfullContent',
                            });

                        }, 2000)
                    }
                    else if (result == 404) {

                        setSpinner(false);
                        setAlertMessage('לא נמצאה התאמה במסד הנתונים לנתוני תוכן העזר');
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

            <View style={styles.mainContainer}>
                <ScrollView>

                    {/* TRASH ICON */}
                    <TouchableOpacity
                        onPress={() => { deleteContent() }}
                        style={styles.binIcon}>
                        <Ionicons name="ios-trash" size={23} color="white" />
                    </TouchableOpacity>


                    {/* HEADING */}
                    {
                        contentType == 'סרטונים' ?
                            <Text style={styles.mainHeading}>עריכת פרטי סרטון</Text>
                            :
                            contentType == 'מאמרים' ?
                                <Text style={styles.mainHeading}>עריכת פרטי מאמר</Text>
                                :
                                <Text style={styles.mainHeading}>עריכת שאלה ותשובה</Text>
                    }


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


                    {/* RADIO BUTTONS AREA */}
                    <Text style={styles.secondaryHeading}>מוצג עבור:</Text>

                    <View style={styles.radioButtonsWrapper}>

                        <View style={styles.radioButtonContainer}>

                            <TouchableOpacity onPress={() => changeViewerType('שיווק')}
                                style={styles.singleRadioButton}
                            >
                                {
                                    shownTo == 'שיווק' ?
                                        <View style={styles.radioButtonInnerCircle} />
                                        :
                                        null
                                }
                            </TouchableOpacity>

                            <Text style={styles.radioButtonText}>שיווק</Text>

                        </View>

                        <View style={styles.radioButtonContainer}>

                            <TouchableOpacity onPress={() => changeViewerType('שיקום')}
                                style={styles.singleRadioButton}
                            >
                                {
                                    shownTo == 'שיקום' ?
                                        <View style={styles.radioButtonInnerCircle} />
                                        :
                                        null
                                }
                            </TouchableOpacity>

                            <Text style={styles.radioButtonText}>שיקום</Text>

                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
                        <View style={styles.radioButtonContainer}>

                            <TouchableOpacity onPress={() => changeViewerType('פיטנס')}
                                style={styles.singleRadioButton}
                            >
                                {
                                    shownTo == 'פיטנס' ?
                                        <View style={styles.radioButtonInnerCircle} />
                                        :
                                        null
                                }
                            </TouchableOpacity>

                            <Text style={styles.radioButtonText}>פיטנס</Text>

                        </View>

                        <View style={styles.radioButtonContainer}>

                            <TouchableOpacity onPress={() => changeViewerType('פיק פרפורמנס')}
                                style={styles.singleRadioButton}
                            >
                                {
                                    shownTo == 'פיק פרפורמנס' ?
                                        <View style={styles.radioButtonInnerCircle} />
                                        :
                                        null
                                }
                            </TouchableOpacity>

                            <Text style={styles.radioButtonText}>פיק פרפורמנס</Text>

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

                </ScrollView>

            </View>
        </>
    );
}


const styles = StyleSheet.create({

    //Containers:
    mainContainer:
    {
        backgroundColor: 'white',
        minHeight: Dimensions.get('window').height - 45,
        paddingHorizontal: 20
    },
    viewContainer: {
        flexDirection: 'row',
        alignItems: 'baseline'
    },
    topBaselineContainer:
    {
        flexDirection: 'row',
    },
    radioButtonsWrapper:
    {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10
    },
    radioButtonContainer:
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
        fontSize: 16,
        marginHorizontal: 7
    },


    //Icons:
    binIcon:
    {
        backgroundColor: '#e95344',
        height: 32,
        width: 32,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
        marginTop: 20
    },


    singleRadioButton:
    {
        height: 20,
        width: 20,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#3a3b40',
        alignItems: 'center',
        justifyContent: 'center',
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