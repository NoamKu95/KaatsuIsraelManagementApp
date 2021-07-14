//Outer Imports:
import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Switch } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Table, Row, Rows } from 'react-native-table-component';
import * as Linking from 'expo-linking';
import Spinner from 'react-native-loading-spinner-overlay';

//Inner Imports:
import Header from '../Components/Header';

//Icons:
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';



export default function ViewAvailableHelpfullContent(props) {

    // User Details:
    const [userPersonalCode, setUserPersonalCode] = useState('');
    const [userType, setUserType] = useState('');

    // Content Type:
    const [viewType, setViewType] = useState('סרטונים');           //Which content type to display - סרטונים / מאמרים / שאלות ותשובות

    //Table:
    const [headTable, setHeadTable] = useState([]);      // heading of the table

    //Videos:
    const [videos, setVideos] = useState([]);            // table, in which each row is a video

    //Articles:
    const [articles, setArticles] = useState([]);        // table, in which each row is an article

    //Q & A s:
    const [qas, setQAs] = useState([]);             // all the QAs for the collapsable



    //Switches
    const [switchMarketing, setSwitchMarketing] = useState(true);
    const [switchFitness, setSwitchFitness] = useState(true);
    const [switchPeakPerformance, setSwitchPeakPerformance] = useState(true);
    const [switchRehabilitation, setSwitchRehabilitation] = useState(true);


    //Alerts:
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');


    //Loading animation:
    const [spinner, setSpinner] = useState(true);



    useEffect(() => {

        const checkFocus = props.navigation.addListener('focus', () => {

            //---start all the switches---//
            setSwitchMarketing(true);
            setSwitchFitness(true);
            setSwitchPeakPerformance(true);
            setSwitchRehabilitation(true);
            //-----------------------------//

            checkUserType();
        });

        return checkFocus;
    }, []);



    //Check if the user is a manager or a regular distributer:
    const checkUserType = async () => {

        try {

            const jsonValue = await AsyncStorage.getItem('userDetails')

            if (jsonValue != null) {

                let user = JSON.parse(jsonValue);

                await setUserType(user.d_Status);
                await setUserPersonalCode(user.d_PersonalCode);

                setViewType('סרטונים');
                fetchDataToDisplay(user.d_Status, user.d_PersonalCode, 'סרטונים', switchMarketing, switchPeakPerformance, switchRehabilitation, switchFitness);
            }
        } catch {

            this.setState({
                alertTitle: "שגיאה",
                alertMessage: "התרחשה שגיאה בשליפת סוג המשתמש מהאחסון המקומי",
                showAlert: true
            })
        }
    }




    const fetchDataToDisplay = async (myType, myID, view, swMarketing, swPerformance, swRehab, swFitness) => {

        setSpinner(true); // Start loading animation as the data is being fetched

        //Prepare filters (only if user is manager):
        let filters = [];
        if (myType == 'מנהל') {

            swMarketing ? filters.push('שיווק') : '';
            swPerformance ? filters.push('פיק פרפורמנס') : '';
            swRehab ? filters.push('שיקום') : '';
            swFitness ? filters.push('פיטנס') : '';
        }

        // Find out which tab is open:
        if (view == 'סרטונים') {

            if (myType == 'מנהל') {

                let apiUrl = 'https://proj.ruppin.ac.il/bgroup12/prod/api/getfilteredvideos';
                await fetch(apiUrl,
                    {
                        method: 'PUT',
                        body: JSON.stringify(filters),
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

                                setHeadTable(['שם הסרטון', 'תיאור', 'לצפייה']);

                                let table = [];  //Table that will hold the data (the rows)

                                //From each object from the DB we create a ROW in the Table:
                                for (let i = 0; i < result.length; i++) {

                                    let tableRow = [];      //Row in the Table

                                    //Video Name:
                                    tableRow.push(<Text onLongPress={() => moveToEditScreen(result[i].hc_ID, result[i].hc_shownTo, 'סרטונים')} style={styles.tableCenterText}>{result[i].hc_Subject}</Text>);   //first cell: name of the video

                                    //Video Description:
                                    tableRow.push(<Text onLongPress={() => moveToEditScreen(result[i].hc_ID, result[i].hc_shownTo, 'סרטונים')} style={styles.tableText}>{result[i].hc_Summary}</Text>);   //second cell: summary of the video

                                    //Video Link (through icon):
                                    tableRow.push(
                                        <Text style={{ alignSelf: 'center', }} onPress={() => Linking.openURL(`${result[i].hc_Link}`)} onLongPress={() => moveToEditScreen(result[i].hc_ID, result[i].hc_shownTo, 'סרטונים')}>

                                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>

                                                <FontAwesome name="youtube-play" size={50} color="#e95344" />

                                            </View>
                                        </Text>
                                    ); //third cell: link to the video

                                    table.push(tableRow);   //Add the ROW to the Table
                                }

                                setSpinner(false); // Stop loading animation as the data is ready to be displayed
                                setVideos(table);
                            }
                            else if (result == 404) {

                                setSpinner(false);
                                setAlertMessage('לא נמצאו סרטונים במסד הנתונים');
                                setAlertTitle('אופס!');
                                setShowAlert(true);

                                setHeadTable(['שם הסרטון', 'תיאור', 'לצפייה']);
                                let table = [];
                                let tableRow = [];
                                tableRow.push(<Text></Text>);
                                tableRow.push(<Text></Text>);
                                tableRow.push(<Text></Text>);
                                table.push(tableRow);
                                setVideos(table);
                            }
                            else if (result == 500) {

                                setSpinner(false);
                                setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                                setAlertTitle('שגיאה');
                                setShowAlert(true);

                                setHeadTable(['שם הסרטון', 'תיאור', 'לצפייה']);
                                let table = [];
                                let tableRow = [];
                                tableRow.push(<Text></Text>);
                                tableRow.push(<Text></Text>);
                                tableRow.push(<Text></Text>);
                                table.push(tableRow);
                                setVideos(table);
                            }
                            else {

                                setSpinner(false);
                                setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                                setAlertTitle('שגיאה');
                                setShowAlert(true);

                                setHeadTable(['שם הסרטון', 'תיאור', 'לצפייה']);
                                let table = [];
                                let tableRow = [];
                                tableRow.push(<Text></Text>);
                                tableRow.push(<Text></Text>);
                                tableRow.push(<Text></Text>);
                                table.push(tableRow);
                                setVideos(table);
                            }
                        },
                        (error) => {

                            setHeadTable(['שם הסרטון', 'תיאור', 'לצפייה']);
                            let table = [];
                            let tableRow = [];
                            tableRow.push(<Text></Text>);
                            tableRow.push(<Text></Text>);
                            tableRow.push(<Text></Text>);
                            table.push(tableRow);
                            setVideos(table);

                            setSpinner(false);
                            setAlertMessage('התרחשה תקלה בתקשורת עם מסד הנתונים. נא לנסות שנית             ' + error);
                            setAlertTitle('שגיאה');
                            setShowAlert(true);
                        }
                    )
            }
            else {

                let apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/getvideosforme/${myID}/${myType}`;
                await fetch(apiUrl,
                    {
                        method: 'PUT',
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

                                setHeadTable(['שם הסרטון', 'תיאור', 'לצפייה']);

                                let table = [];  //Table that will hold the data (the rows)

                                //From each object from the DB we create a ROW in the Table:
                                for (let i = 0; i < result.length; i++) {

                                    let tableRow = [];      //Row in the Table

                                    //Video Name:
                                    tableRow.push(<Text style={styles.tableCenterText}>{result[i].hc_Subject}</Text>);   //first cell: name of the video

                                    //Video Description:
                                    tableRow.push(<Text style={styles.tableText}>{result[i].hc_Summary}</Text>);   //second cell: summary of the video

                                    //Video Link (through icon):
                                    tableRow.push(
                                        <Text style={{ alignSelf: 'center', }} onPress={() => Linking.openURL(`${result[i].hc_Link}`)}>

                                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>

                                                <FontAwesome name="youtube-play" size={50} color="#e95344" />

                                            </View>
                                        </Text>
                                    ); //third cell: link to the video

                                    table.push(tableRow);   //Add the ROW to the Table
                                }

                                setSpinner(false); // Stop loading animation as the data is ready to be displayed
                                setVideos(table);
                            }
                            else if (result == 404) {

                                setHeadTable(['שם הסרטון', 'תיאור', 'לצפייה']);
                                let table = [];
                                let tableRow = [];
                                tableRow.push(<Text></Text>);
                                tableRow.push(<Text></Text>);
                                tableRow.push(<Text></Text>);
                                table.push(tableRow);
                                setVideos(table);

                                setSpinner(false);
                                setAlertMessage('לא נמצאו סרטונים במסד הנתונים');
                                setAlertTitle('אופס!');
                                setShowAlert(true);
                            }
                            else if (result == 500) {

                                setHeadTable(['שם הסרטון', 'תיאור', 'לצפייה']);
                                let table = [];
                                let tableRow = [];
                                tableRow.push(<Text></Text>);
                                tableRow.push(<Text></Text>);
                                tableRow.push(<Text></Text>);
                                table.push(tableRow);
                                setVideos(table);

                                setSpinner(false);
                                setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                                setAlertTitle('שגיאה');
                                setShowAlert(true);
                            }
                            else {

                                setHeadTable(['שם הסרטון', 'תיאור', 'לצפייה']);
                                let table = [];
                                let tableRow = [];
                                tableRow.push(<Text></Text>);
                                tableRow.push(<Text></Text>);
                                tableRow.push(<Text></Text>);
                                table.push(tableRow);
                                setVideos(table);

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

                            setHeadTable(['שם הסרטון', 'תיאור', 'לצפייה']);
                            let table = [];
                            let tableRow = [];
                            tableRow.push(<Text></Text>);
                            tableRow.push(<Text></Text>);
                            tableRow.push(<Text></Text>);
                            table.push(tableRow);
                            setVideos(table);
                        }
                    )
            }
        }
        else if (view == 'מאמרים') {

            if (myType == 'מנהל') {

                let apiUrl = 'https://proj.ruppin.ac.il/bgroup12/prod/api/getfilteredarticles';
                await fetch(apiUrl,
                    {
                        method: 'PUT',
                        body: JSON.stringify(filters),
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

                                setHeadTable(['שם המאמר', 'תקציר', 'לקריאה']);

                                let table = [];  //Table that will hold the data (the rows)

                                //From each object from the DB we create a ROW in the Table:
                                for (let i = 0; i < result.length; i++) {

                                    let tableRow = [];      //Row in the Table

                                    //Article Name:
                                    tableRow.push(<Text onLongPress={() => moveToEditScreen(result[i].hc_ID, result[i].hc_shownTo, 'מאמרים')} style={styles.tableCenterText}>{result[i].hc_Subject}</Text>);   //first cell: name of the article

                                    //Article Link (uri):
                                    tableRow.push(<Text onLongPress={() => moveToEditScreen(result[i].hc_ID, result[i].hc_shownTo, 'מאמרים')} style={styles.tableText}>{result[i].hc_Summary}</Text>);   //second cell: summary of the article

                                    //Article Download (through icon):
                                    tableRow.push(
                                        <Text style={{ alignSelf: 'center', }} onPress={() => Linking.openURL(`${result[i].hc_FileURI}`)} onLongPress={() => moveToEditScreen(result[i].hc_ID, result[i].hc_shownTo, 'מאמרים')}>

                                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>

                                                <Ionicons name="reader-sharp" size={45} color="#e95344" />

                                            </View>
                                        </Text>
                                    ); //third cell: link to where the article sits on the server

                                    table.push(tableRow);   //Add the ROW to the Table
                                }

                                setSpinner(false); // Stop loading animation as the data is ready to be displayed
                                setArticles(table);
                            }
                            else if (result == 404) {

                                setHeadTable(['שם המאמר', 'תקציר', 'לקריאה']);
                                let table = [];
                                let tableRow = [];
                                tableRow.push(<Text></Text>);
                                tableRow.push(<Text></Text>);
                                tableRow.push(<Text></Text>);
                                table.push(tableRow);
                                setArticles(table);

                                setSpinner(false);
                                setAlertMessage('לא נמצאו מאמרים במסד הנתונים');
                                setAlertTitle('אופס!');
                                setShowAlert(true);
                            }
                            else if (result == 500) {

                                setHeadTable(['שם המאמר', 'תקציר', 'לקריאה']);
                                let table = [];
                                let tableRow = [];
                                tableRow.push(<Text></Text>);
                                tableRow.push(<Text></Text>);
                                tableRow.push(<Text></Text>);
                                table.push(tableRow);
                                setArticles(table);

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

                                setHeadTable(['שם המאמר', 'תקציר', 'לקריאה']);
                                let table = [];
                                let tableRow = [];
                                tableRow.push(<Text></Text>);
                                tableRow.push(<Text></Text>);
                                tableRow.push(<Text></Text>);
                                table.push(tableRow);
                                setArticles(table);
                            }
                        },
                        (error) => {

                            setSpinner(false); // Stop loading animation as the data is ready to be displayed
                            setAlertMessage('התרחשה תקלה בתקשורת עם מסד הנתונים. נא לנסות שנית             ' + error);
                            setAlertTitle('שגיאה');
                            setShowAlert(true);

                            setHeadTable(['שם המאמר', 'תקציר', 'לקריאה']);
                            let table = [];
                            let tableRow = [];
                            tableRow.push(<Text></Text>);
                            tableRow.push(<Text></Text>);
                            tableRow.push(<Text></Text>);
                            table.push(tableRow);
                            setArticles(table);
                        }
                    )
            }
            else {

                let apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/getarticlesforme/${myID}/${myType}`;
                await fetch(apiUrl,
                    {
                        method: 'PUT',
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

                                setHeadTable(['שם המאמר', 'תקציר', 'לקריאה']);

                                let table = [];  //Table that will hold the data (the rows)

                                //From each object from the DB we create a ROW in the Table:
                                for (let i = 0; i < result.length; i++) {

                                    let tableRow = [];      //Row in the Table

                                    //Article Name:
                                    tableRow.push(<Text style={styles.tableCenterText}>{result[i].hc_Subject}</Text>);   //first cell: name of the article

                                    //Article Link (uri):
                                    tableRow.push(<Text style={styles.tableText}>{result[i].hc_Summary}</Text>);   //second cell: summary of the article

                                    //Article Download (through icon):
                                    tableRow.push(
                                        <Text style={{ alignSelf: 'center', }} onPress={() => Linking.openURL(`${result[i].hc_FileURI}`)}>

                                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>

                                                <Ionicons name="reader-sharp" size={45} color="#e95344" />

                                            </View>
                                        </Text>
                                    ); //third cell: link to where the article sits on the server

                                    table.push(tableRow);   //Add the ROW to the Table
                                }

                                setSpinner(false); // Stop loading animation as the data is ready to be displayed
                                setArticles(table);
                            }
                            else if (result == 404) {

                                setSpinner(false);
                                setAlertMessage('לא נמצאו מאמרים במסד הנתונים');
                                setAlertTitle('אופס!');
                                setShowAlert(true);


                                setHeadTable(['שם המאמר', 'תקציר', 'לקריאה']);
                                let table = [];
                                let tableRow = [];
                                tableRow.push(<Text></Text>);
                                tableRow.push(<Text></Text>);
                                tableRow.push(<Text></Text>);
                                table.push(tableRow);
                                setArticles(table);
                            }
                            else if (result == 500) {

                                setSpinner(false);
                                setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                                setAlertTitle('שגיאה');
                                setShowAlert(true);


                                setHeadTable(['שם המאמר', 'תקציר', 'לקריאה']);
                                let table = [];
                                let tableRow = [];
                                tableRow.push(<Text></Text>);
                                tableRow.push(<Text></Text>);
                                tableRow.push(<Text></Text>);
                                table.push(tableRow);
                                setArticles(table);
                            }
                            else {

                                setSpinner(false);
                                setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                                setAlertTitle('שגיאה');
                                setShowAlert(true);


                                setHeadTable(['שם המאמר', 'תקציר', 'לקריאה']);
                                let table = [];
                                let tableRow = [];
                                tableRow.push(<Text></Text>);
                                tableRow.push(<Text></Text>);
                                tableRow.push(<Text></Text>);
                                table.push(tableRow);
                                setArticles(table);
                            }
                        },
                        (error) => {

                            setSpinner(false);
                            setAlertMessage('התרחשה תקלה בתקשורת עם מסד הנתונים. נא לנסות שנית             ' + error);
                            setAlertTitle('שגיאה');
                            setShowAlert(true);

                            setHeadTable(['שם המאמר', 'תקציר', 'לקריאה']);
                            let table = [];
                            let tableRow = [];
                            tableRow.push(<Text></Text>);
                            tableRow.push(<Text></Text>);
                            tableRow.push(<Text></Text>);
                            table.push(tableRow);
                            setArticles(table);
                        }
                    )
            }
        }
        else if (view == 'שאלות ותשובות') {

            if (myType == 'מנהל') {

                let apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/getfilteredqas/`;
                await fetch(apiUrl,
                    {
                        method: 'PUT',
                        body: JSON.stringify(filters),
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

                                setHeadTable(['שאלה', 'תשובה']);

                                let table = [];  //Table that will hold the data (the rows)

                                //From each object from the DB we create a ROW in the Table:
                                for (let i = 0; i < result.length; i++) {

                                    let tableRow = [];      //Row in the Table

                                    //Question:
                                    tableRow.push(<Text onLongPress={() => moveToEditScreen(result[i].hc_ID, result[i].hc_shownTo, 'שאלות ותשובות')} style={styles.questionsText}>{result[i].hc_Question}</Text>);   //first cell: question

                                    //Answer:
                                    tableRow.push(<Text onLongPress={() => moveToEditScreen(result[i].hc_ID, result[i].hc_shownTo, 'שאלות ותשובות')} style={styles.questionsText}>{result[i].hc_Answer}</Text>);   //second cell: answer

                                    table.push(tableRow);   //Add the ROW to the Table
                                }

                                setSpinner(false); // Stop loading animation as the data is ready to be displayed
                                setQAs(table);

                            }
                            else if (result == 404) {

                                setSpinner(false); // Stop loading animation as the data is ready to be displayed
                                setAlertMessage('לא נמצאו שאלות ותשובות במסד הנתונים');
                                setAlertTitle('אופס!');
                                setShowAlert(true);

                                setHeadTable(['שאלה', 'תשובה']);
                                let table = [];
                                let tableRow = [];
                                tableRow.push(<Text></Text>);
                                tableRow.push(<Text></Text>);
                                table.push(tableRow);
                                setQAs(table);
                            }
                            else if (result == 500) {

                                setSpinner(false);
                                setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                                setAlertTitle('שגיאה');
                                setShowAlert(true);

                                setHeadTable(['שאלה', 'תשובה']);
                                let table = [];
                                let tableRow = [];
                                tableRow.push(<Text></Text>);
                                tableRow.push(<Text></Text>);
                                table.push(tableRow);
                                setQAs(table);
                            }
                            else {

                                setSpinner(false);
                                setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                                setAlertTitle('שגיאה');
                                setShowAlert(true);

                                setHeadTable(['שאלה', 'תשובה']);
                                let table = [];
                                let tableRow = [];
                                tableRow.push(<Text></Text>);
                                tableRow.push(<Text></Text>);
                                table.push(tableRow);
                                setQAs(table);
                            }
                        },
                        (error) => {

                            setSpinner(false);
                            setAlertMessage('התרחשה תקלה בתקשורת עם מסד הנתונים. נא לנסות שנית             ' + error);
                            setAlertTitle('שגיאה');
                            setShowAlert(true);

                            setHeadTable(['שאלה', 'תשובה']);
                            let table = [];
                            let tableRow = [];
                            tableRow.push(<Text></Text>);
                            tableRow.push(<Text></Text>);
                            table.push(tableRow);
                            setQAs(table);
                        }
                    )
            }
            else {

                let apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/getqasforme/${myID}/${myType}`;
                await fetch(apiUrl,
                    {
                        method: 'PUT',
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

                                setHeadTable(['שאלה', 'תשובה']);

                                let table = [];  //Table that will hold the data (the rows)

                                //From each object from the DB we create a ROW in the Table:
                                for (let i = 0; i < result.length; i++) {

                                    let tableRow = [];      //Row in the Table

                                    //Question:
                                    tableRow.push(<Text style={styles.questionsText}>{result[i].hc_Question}</Text>);   //first cell: question

                                    //Answer:
                                    tableRow.push(<Text style={styles.questionsText}>{result[i].hc_Answer}</Text>);   //second cell: answer

                                    table.push(tableRow);   //Add the ROW to the Table
                                }

                                setSpinner(false); // Stop loading animation as the data is ready to be displayed
                                setQAs(table);
                            }
                            else if (result == 404) {

                                setSpinner(false);
                                setAlertMessage('לא נמצאו שאלות ותשובות במסד הנתונים');
                                setAlertTitle('אופס!');
                                setShowAlert(true);

                                setHeadTable(['שאלה', 'תשובה']);
                                let table = [];
                                let tableRow = [];
                                tableRow.push(<Text></Text>);
                                tableRow.push(<Text></Text>);
                                table.push(tableRow);
                                setQAs(table);
                            }
                            else if (result == 500) {

                                setSpinner(false);
                                setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                                setAlertTitle('שגיאה');
                                setShowAlert(true);

                                setHeadTable(['שאלה', 'תשובה']);
                                let table = [];
                                let tableRow = [];
                                tableRow.push(<Text></Text>);
                                tableRow.push(<Text></Text>);
                                table.push(tableRow);
                                setQAs(table);
                            }
                            else {

                                setSpinner(false);
                                setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                                setAlertTitle('שגיאה');
                                setShowAlert(true);

                                setHeadTable(['שאלה', 'תשובה']);
                                let table = [];
                                let tableRow = [];
                                tableRow.push(<Text></Text>);
                                tableRow.push(<Text></Text>);
                                table.push(tableRow);
                                setQAs(table);
                            }
                        },
                        (error) => {

                            setSpinner(false);
                            setAlertMessage('התרחשה תקלה בתקשורת עם מסד הנתונים. נא לנסות שנית             ' + error);
                            setAlertTitle('שגיאה');
                            setShowAlert(true);

                            setHeadTable(['שאלה', 'תשובה']);
                            let table = [];
                            let tableRow = [];
                            tableRow.push(<Text></Text>);
                            tableRow.push(<Text></Text>);
                            table.push(tableRow);
                            setQAs(table);
                        }
                    )
            }
        }
    }




    //Toggle the dashboard type that is displayed:
    const changeViewType = async (contentType) => {

        let id = userPersonalCode;
        let type = userType;

        let swMarketing = switchMarketing;
        let swPerformance = switchPeakPerformance;
        let swRehab = switchRehabilitation;
        let swFitness = switchFitness;

        if (contentType == 'סרטונים') {

            await setViewType('סרטונים');
        }
        else if (contentType == 'מאמרים') {

            await setViewType('מאמרים');
        }
        else if (contentType == 'שאלות ותשובות') {

            await setViewType('שאלות ותשובות');
        }


        fetchDataToDisplay(type, id, contentType, swMarketing, swPerformance, swRehab, swFitness);
    }




    // Turn On / Off a switch that was pressed:
    const toggleSwitch = async (value) => {

        let id = userPersonalCode;
        let type = userType;
        let view = viewType;

        let swMarketing = switchMarketing;
        let swPerformance = switchPeakPerformance;
        let swRehab = switchRehabilitation;
        let swFitness = switchFitness;


        if (value == 'marketing') {

            setSwitchMarketing(!switchMarketing);
            fetchDataToDisplay(type, id, view, !switchMarketing, swPerformance, swRehab, swFitness);

        }
        else if (value == 'rehabilitation') {

            setSwitchRehabilitation(!switchRehabilitation);
            fetchDataToDisplay(type, id, view, swMarketing, swPerformance, !switchRehabilitation, swFitness);
        }
        else if (value == 'fitness') {

            setSwitchFitness(!switchFitness);
            fetchDataToDisplay(type, id, view, swMarketing, swPerformance, swRehab, !switchFitness);
        }
        else { // value == peak performance

            setSwitchPeakPerformance(!switchPeakPerformance);
            fetchDataToDisplay(type, id, view, swMarketing, !switchPeakPerformance, swRehab, swFitness);
        }
    };




    //clicking on a row moves the user to edit the HC details: 
    const moveToEditScreen = (contentID, meantFor, type) => {

        let hc = {
            hcID: parseInt(contentID),  // the id of the content to edit
            hcType: type,               // if it's a video, an article or a q&a
            hcShownTo: meantFor,        // to which gup it's shown - שיווק, פיטנס, שיקום, פיק פרפורמנס
        }

        props.navigation.navigate('ViewEditHelpfullContent', { thisContent: hc });
    }



    //Navigate to adding a new helpfull content:
    const moveToAddNewContent = () => {

        props.navigation.navigate('AddNewHelpfullContent');
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

                {
                    userType == 'מנהל' ?
                        <TouchableOpacity style={{ margin: 7, marginBottom: 0 }} onPress={() => { moveToAddNewContent() }}
                        >
                            <AntDesign name="pluscircle" size={35} color="#e95344" />
                        </TouchableOpacity>
                        :
                        <></>
                }

                <Text style={styles.mainHeading}> תוכן עזר </Text>

                {
                    userType == 'מנהל' ?
                        <View style={{ height: 130 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 5, marginTop: 15, flex: 1 }}>

                                <View style={switchMarketing ? styles.filterContainerActive : styles.filterContainerNotActive}>

                                    <Text>שיווק</Text>

                                    <Switch
                                        onValueChange={() => toggleSwitch('marketing')}
                                        value={switchMarketing}
                                    />

                                </View>

                                <View style={switchFitness ? styles.filterContainerActive : styles.filterContainerNotActive}>

                                    <Text>פיטנס</Text>

                                    <Switch
                                        onValueChange={() => toggleSwitch('fitness')}
                                        value={switchFitness}
                                    />

                                </View>

                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 5, marginBottom: 25 }}>

                                <View style={switchPeakPerformance ? styles.filterContainerActive : styles.filterContainerNotActive}>

                                    <Text>פיק פרפורמנס</Text>

                                    <Switch
                                        onValueChange={() => toggleSwitch('peak performance')}
                                        value={switchPeakPerformance}
                                    />
                                </View>

                                <View style={switchRehabilitation ? styles.filterContainerActive : styles.filterContainerNotActive}>

                                    <Text>שיקום</Text>

                                    <Switch
                                        onValueChange={() => toggleSwitch('rehabilitation')}
                                        value={switchRehabilitation}
                                    />
                                </View>
                            </View>

                        </View>
                        :
                        <View style={{ height: 25 }}></View>
                }

                <View style={styles.tabsContainer}>

                    <TouchableOpacity onPress={() => changeViewType('סרטונים')} style={viewType == 'סרטונים' ? styles.tabChosen : styles.tabNotChosen}>
                        <Text style={viewType == 'סרטונים' ? styles.textChosen : styles.textNotChosen}>
                            סרטונים
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => changeViewType('מאמרים')} style={viewType == 'מאמרים' ? styles.tabChosen : styles.tabNotChosen}>

                        <Text style={viewType == 'מאמרים' ? styles.textChosen : styles.textNotChosen}>
                            מאמרים
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => changeViewType('שאלות ותשובות')} style={viewType == 'שאלות ותשובות' ? styles.tabChosen : styles.tabNotChosen}>
                        <Text style={viewType == 'שאלות ותשובות' ? styles.textChosen : styles.textNotChosen}>
                            שאלות ותשובות
                        </Text>
                    </TouchableOpacity>

                </View>



                {
                    viewType == 'שאלות ותשובות' ?
                        <View style={[userType == 'מנהל' ? styles.tableContainerManager : styles.tableContainerDistributer]}>

                            <Table borderStyle={styles.tableBorder}>

                                <Row
                                    data={headTable}
                                    style={styles.headStyle}
                                    textStyle={styles.tableHeaderText}
                                />

                                <ScrollView style={styles.scrollViewStyle}>
                                    <Rows
                                        data={qas}
                                        textStyle={styles.tableText}
                                        style={styles.rowStyle}
                                    />
                                </ScrollView>
                            </Table>

                        </View>
                        :
                        viewType == 'מאמרים' ?
                            <View style={[userType == 'מנהל' ? styles.tableContainerManager : styles.tableContainerDistributer]}>

                                <Table borderStyle={styles.tableBorder}>

                                    <Row
                                        data={headTable}
                                        style={styles.headStyle}
                                        textStyle={styles.tableHeaderText}
                                    />

                                    <ScrollView style={styles.scrollViewStyle}>
                                        <Rows
                                            data={articles}
                                            textStyle={styles.tableText}
                                            style={styles.rowStyle}
                                        />
                                    </ScrollView>
                                </Table>

                            </View>
                            :
                            <View style={[userType == 'מנהל' ? styles.tableContainerManager : styles.tableContainerDistributer]}>

                                <Table borderStyle={styles.tableBorder}>

                                    <Row
                                        data={headTable}
                                        style={styles.headStyle}
                                        textStyle={styles.tableHeaderText}
                                    />

                                    <ScrollView style={styles.scrollViewStyle}>
                                        <Rows
                                            data={videos}
                                            textStyle={styles.tableText}
                                            style={styles.rowStyle}
                                        />
                                    </ScrollView>
                                </Table>

                            </View>
                }

            </View>
        </>
    );
}


const styles = StyleSheet.create({

    //Containers:
    mainContainer:
    {
        backgroundColor: 'white',
        minHeight: Dimensions.get('window').height - 45
    },
    tabsContainer:
    {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    filterContainerActive:
    {
        width: Dimensions.get('window').width / 2.5,
        height: 40,
        borderWidth: 1,
        borderColor: '#42c181',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8
    },
    filterContainerNotActive:
    {
        width: Dimensions.get('window').width / 2.5,
        height: 40,
        borderWidth: 1,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8
    },
    tableContainerManager:
    {
        marginBottom: 300
    },
    tableContainerDistributer:
    {
        marginBottom: 30
    },

    scrollViewStyle:
    {
        marginBottom: 450
    },


    //Headers:
    mainHeading:
    {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10
    },


    //Tabs:
    tabNotChosen:
    {
        borderWidth: 1,
        borderColor: 'black',
        height: 35,
        borderTopLeftRadius: 15,
        width: Dimensions.get('window').width / 3,
        justifyContent: 'center'
    },
    textNotChosen:
    {
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'black'
    },
    tabChosen:
    {
        borderWidth: 1,
        borderColor: 'black',
        height: 35,
        borderTopLeftRadius: 15,
        width: Dimensions.get('window').width / 3,
        justifyContent: 'center',
        backgroundColor: '#e95344'
    },
    textChosen:
    {
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'white'
    },


    //Table:
    tableBorder:
    {
        borderWidth: 1,
        borderColor: 'white',
    },
    headStyle: {
        height: 55,
        alignContent: "center",
        backgroundColor: '#3a3b40',
        borderColor: 'grey',
        borderTopColor: 'black'
    },
    tableHeaderText: {
        padding: 5,
        color: 'white',
        alignContent: "center",
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 14
    },
    rowStyle:
    {
        height: 115,
        borderWidth: 1,
        borderColor: 'grey'
    },
    tableText:
    {
        color: 'black',
        textAlign: 'left',
        fontSize: 12,
        marginVertical: 3,
        marginHorizontal: 5,
        textAlign: 'justify',
    },
    tableCenterText:
    {
        color: 'black',
        textAlign: 'center',
        fontSize: 13,
        margin: 10
    },
    questionsText:
    {
        color: 'black',
        textAlign: 'left',
        fontSize: 12,
        marginVertical: 3,
        marginHorizontal: 17,
        textAlign: 'justify'
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