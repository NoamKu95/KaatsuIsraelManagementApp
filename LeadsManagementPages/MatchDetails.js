//Outer Imports:
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Table, Row, Rows } from 'react-native-table-component';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AirbnbRating } from 'react-native-ratings';
import Slider from '@react-native-community/slider';
import { ScrollView } from 'react-native-gesture-handler';

//Inner Imports:
import Header from '../Components/Header';




export default function MatchDetails(props) {

    const navigation = useNavigation();

    //Pair object (ids, match rate & origin of the navigation to here)
    const [obj, setObj] = useState(props.route.params);

    //Lead details:
    const [joinDate, setJoinDate] = useState('');           // lead JOIN DATE
    const [notes, setNotes] = useState('');                  // lead NOTES
    const [leadGender, setLeadGender] = useState('');       //lead GENDER

    //Lead SUPs:
    const [leadSUPsNamesLongString, setLeadSUPsNamesLongString] = useState('');     // the SUPs of the lead as a long string of names (one under the other)

    //Left table of lead:
    const [leadHeadTable, setLeadHeadTable] = useState(['ליד']);    //Kotarot of the table.
    const [leadDataTable, setLeadDataTable] = useState([]);         //Data inside the table

    //Distributer details:
    const [distributer, setDistributer] = useState({});
    const [distGender, setDistGender] = useState('');               //distributer GENDER

    //Right table of distributer:
    const [distHeadTable, setDistHeadTable] = useState(['מפיץ']); // Kotarot of the table culomns.
    const [distDataTable, setDistDataTable] = useState([]);

    //Middle table of circles:
    const [circleHeader, setCircleHeader] = useState([]);
    const [circleDateTable, setCircleDateTable] = useState([]);

    //Slider:
    const [sliderAvailability, setSliderAvailability] = useState(0);

    //Alerts:
    const [showAlert, setShowAlert] = useState();
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');


    useEffect(() => {

        allFetches();

    }, []);



    // for checking gender match
    useEffect(() => {

        insertToCircle();

    }, [distGender]);



    //Fetch all needed data from the DB:
    const allFetches = async () => {

        await getAllLeadDetails(obj.customerId);
        await getAllDistDetails(obj.disId);
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

                        let allSubString = '';
                        let allSubs = [];
                        if (result.c_SubUsePurposes_STRINGS.length > 1) {
                            allSubs = result.c_SubUsePurposes_STRINGS;
                            for (let i = 0; i < allSubs.length; i++) {

                                allSubString += allSubs[i] + ', ';
                            }
                            setLeadSUPsNamesLongString(allSubString.substring(0, allSubString.length - 2));
                        }
                        else {
                            let oneSub = result.c_SubUsePurposes_STRINGS[0];
                            setLeadSUPsNamesLongString(oneSub);
                        }



                        let all = [];
                        let generalString = '';
                        let allLeadData;


                        if (result.c_GeneralUsePurposes_STRINGS.length > 1) {
                            all = result.c_GeneralUsePurposes_STRINGS;

                            for (let i = 0; i < all.length; i++) {
                                generalString += all[i] + ', ';

                            }

                            allLeadData = [
                                [result.c_FirstName + ' ' + result.c_LastName],
                                [result.c_Gender == 'ז' ? 'זכר' : 'נקבה'],
                                [generalString.substring(0, generalString.length - 2)],
                                [result.c_CityName]
                            ];
                        }
                        else {
                            allLeadData = [
                                [result.c_FirstName + ' ' + result.c_LastName],
                                [result.c_Gender == 'ז' ? 'זכר' : 'נקבה'],
                                [result.c_GeneralUsePurposes_STRINGS],
                                [result.c_CityName]
                            ];

                        }

                        setLeadDataTable(allLeadData);

                        //lead data
                        setNotes(result.c_Notes);

                        //GENDER
                        if (result.c_Gender == 'ז') {
                            setLeadGender('זכר');
                        }
                        else {
                            setLeadGender('נקבה');
                        }
                    }
                    else if (result == 404) {

                        setAlertMessage('לא נמצאה התאמה במסד הנתונים לנתוני הלקוח');
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


    //Get the distributer's details based on his ID that we got into the component
    const getAllDistDetails = async (idDist) => {

        const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/distributer/${idDist}/`;
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

                        let pbgObjectsArr = result.d_ProfessionalBackgrounds;
                        let allHisPbgNames = '';
                        for (let i = 0; i < pbgObjectsArr.length; i++) {
                            allHisPbgNames += pbgObjectsArr[i].has_BgName + ', ';
                        }

                        //GENDER
                        if (result.d_Gender == 'ז') {

                            setDistGender('זכר');
                        }
                        else {

                            setDistGender('נקבה');
                        }

                        // save obj of the lead:
                        setDistributer(result);

                        setDistDataTable(
                            [
                                [result.d_FirstName + ' ' + result.d_LastName],
                                [result.d_Gender == 'ז' ? 'זכר' : 'נקבה'],
                                [allHisPbgNames.substring(0, allHisPbgNames.length - 2)],
                                [result.d_CityName]
                            ]
                        );
                    }
                    else if (result == 404) {

                        setAlertMessage('לא נמצאה התאמה במסד הנתונים לנתוני המפיץ');
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


    //fetch all data about match from assign to table
    const insertToCircle = async () => {

        const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/assignedto/getspecificpairing/${obj.disId}/${obj.customerId}/`;
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

                    if (result != null && result != 404 && result != 500) {

                        setSliderAvailability(result.d_Availability); // level of availability

                        let km = result.adress_DistanceKM;  // distance between the two people

                        let adressCircleColor = 'green';
                        if (result.adress_Match < 3) {

                            adressCircleColor = 'red';
                        }
                        else if (result.adress_Match == 3) {

                            adressCircleColor = 'yellow';
                        }

                        let bgCircleColor = 'green';
                        if (result.sup_Match < 3) {

                            bgCircleColor = 'red';
                        }
                        else if (result.sup_Match == 3) {

                            bgCircleColor = 'yellow';
                        }

                        let genderCircleColor = 'green';
                        if (leadGender != distGender) {

                            genderCircleColor = 'red';
                        }

                        setCircleDateTable([
                            [], // no koteret so empty cell
                            [<Text style={styles.circleContainer}><View style={[genderCircleColor == 'green' ? styles.greenCircle : styles.redCircle]}></View></Text>],
                            [<Text style={styles.circleContainer} ><View style={[bgCircleColor == 'green' ? styles.greenCircle : bgCircleColor == 'yellow' ? styles.yellowCircle : styles.redCircle]}></View></Text>],
                            [<Text style={styles.circleContainer} ><View style={[adressCircleColor == 'green' ? styles.greenCircle : adressCircleColor == 'yellow' ? styles.yellowCircle : styles.redCircle]}><Text style={styles.distanceTextStyle}>{Math.round(km * 100) / 100} ק״מ</Text></View></Text>]
                        ]);
                    }
                    else if (result == 404) {

                        setAlertMessage('לא נמצאה התאמה במסד הנתונים לנתוני הצימוד');
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
    const updatePairingInDB = (booleani, leadID, distributerID) => {

        if (booleani) {

            const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/editpairing/${distributerID}/${leadID}`;
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
                        res.status == 404 ?
                            404
                            :
                            res.status == 409 ?
                                409
                                :
                                res.status == 500 ?
                                    500
                                    :
                                    null;
                })
                .then(
                    (result) => {

                        if (result != null && result != 404 && result != 409 && result != 500) {

                            setAlertMessage(result);
                            setAlertTitle('פעולה בוצעה בהצלחה');
                            setShowAlert(true);

                            var timeout = setTimeout(() => {
                                navigation.goBack();
                            }, 2000)
                        }
                        else if (result == 404) {

                            setAlertMessage('לא נמצאה התאמה במסד הנתונים לנתוני הצימוד');
                            setAlertTitle('אופס!');
                            setShowAlert(true);
                        }
                        else if (result == 409) {

                            setAlertMessage('הנתונים שהוזנו אינם עומדים בתנאי השרת ומסד הנתונים. נא לבדוק את הנתונים שהוזנו ולנסות שנית');
                            setAlertTitle('שגיאה');
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
        else {
            const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/assignedto/${distributerID}/${leadID}`;
            fetch(apiUrl,
                {
                    method: 'PUT',
                    body: JSON.stringify("לא מאושר"),
                    headers: new Headers({
                        'Content-Type': 'application/json; charset=UTF-8',
                        'Accept': 'application/json; chartset=UTF-8',
                    })
                })
                .then(res => {

                    return res.status == 200 ? res.json() : null; //Check if we got an OK from the server.
                })
                .then(
                    (result) => {

                        if (result != null) {

                            setAlertMessage(result);
                            setAlertTitle('פעולה בוצעה בהצלחה');
                            setShowAlert(true);

                            var timeout = setTimeout(() => {
                                navigation.goBack();
                            }, 2000)

                        }
                        else {

                            setAlertMessage('התרחשה תקלה בביצוע הפעולה שנבחרה. נא לנסות שנית');
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

            <ScrollView>

                <View style={styles.mainContainer}>


                    <View style={{ flexDirection: 'row' }}>


                        <Text style={styles.enterSystemDateText}> כניסה למערכת: </Text>

                        <Text style={styles.enterSystemText}>{joinDate}</Text>

                    </View>


                    <Text style={styles.mainHeading}> מידע מנחה צימוד</Text>

                    <View style={styles.matchRateContainer}>

                        <Text style={styles.matchKoteret}> ציון התאמה כללי: </Text>
                        <Text style={styles.matchKoteretNumber}>{Math.round(obj.matchRate * 100) / 100}</Text>

                    </View>


                    {/*  טבלאות השוואה */}
                    <View style={styles.tablesMainContainer}>

                        {/* צד מפיץ */}
                        <View style={styles.tableContainer}>

                            <Table borderStyle={styles.tableBorderStyle}>
                                <Row data={distHeadTable} style={styles.tableHeaderStyle} textStyle={styles.tableHeaderTextStyle} />
                                <Rows
                                    data={distDataTable}
                                    textStyle={styles.tableContentTextStyle}
                                    style={styles.rowStyle}
                                />
                            </Table>

                        </View>

                        {/* טבלת עיגולים */}
                        <View style={styles.circlesTableContainer}>

                            <Table borderStyle={styles.circlesTableBorderStyle}>
                                <Row data={circleHeader} style={styles.circleTableHeaderStyle} textStyle={styles.tableHeaderTextStyle} />
                                <Rows
                                    data={circleDateTable}
                                    textStyle={styles.circlesTableContentTextStyle}
                                    style={styles.circlesTableRowStyle}
                                />
                            </Table>

                        </View>


                        {/* צד לקוח */}
                        <View style={styles.tableContainer}>

                            <Table borderStyle={styles.tableBorderStyle}>
                                <Row data={leadHeadTable} style={styles.tableHeaderStyle} textStyle={styles.tableHeaderTextStyle} />
                                <Rows
                                    data={leadDataTable}
                                    textStyle={styles.tableContentTextStyle}
                                    style={styles.rowStyle}
                                />
                            </Table>

                        </View>

                    </View>


                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, }}>

                        <View style={styles.ratingContainer}>

                            <Text style={styles.ratingHeading}>דירוג מפיץ:</Text>

                            {
                                distributer.d_Rating < 0 || distributer.d_Rating == null ?
                                    <AirbnbRating
                                        defaultRating={0} // His rating
                                        count={5} //Amount of total starts
                                        showRating={false} //Don't show words
                                        size={20} // Size of stars
                                        isDisabled={true} // Unpressable
                                    />
                                    :
                                    <AirbnbRating
                                        defaultRating={distributer.d_Rating} // His rating
                                        count={5} //Amount of total starts
                                        showRating={false} //Don't show words
                                        size={20} // Size of stars
                                        isDisabled={true} // Unpressable
                                    />
                            }

                            {
                                distributer.d_Rating < 0 || distributer.d_Rating == null ?
                                    <Text style={{ fontSize: 9 }}>* מפיץ זה לא דורג עדיין</Text>
                                    :
                                    <Text></Text>
                            }

                        </View>


                        <View style={styles.subsContainer}>

                            <Text style={styles.subsHeading}>תת-מטרות שימוש:</Text>

                            <Text style={styles.subsContent}>{leadSUPsNamesLongString}</Text>

                        </View>
                    </View>


                    <View style={{ marginTop: 15, }} >

                        <Text style={styles.availabilityHeading}>רמת פניות המפיץ:</Text>

                        <Slider
                            style={styles.sliderStyle}
                            value={sliderAvailability}
                            step={0.5}
                            minimumValue={1}
                            maximumValue={5}
                            minimumTrackTintColor="black"
                            maximumTrackTintColor="black"
                            disabled={true}
                            thumbTintColor='#42c181'
                            inverted
                        />

                        <View style={styles.availabilityTextsContainer}>
                            <Text style={styles.redColor}>עמוס</Text>
                            <Text style={styles.yellowColor}>ממוצע</Text>
                            <Text style={styles.greenColor}>פנוי</Text>
                        </View>
                    </View>



                    <View style={{ marginTop: 20 }}>

                        <Text style={styles.notesHeading}>הערות נוספות:</Text>

                        <Text style={styles.notesContent}>{notes == '' ? ' אין הערות נכון לרגע זה' : notes}</Text>

                    </View>

                    {
                        obj.fromWhereI == 'fromPopUp' ?
                            <TouchableOpacity
                                style={styles.confirmMatchButton1}
                                onPress={() => updatePairingInDB(true, obj.customerId, obj.disId)} >
                                <Text style={styles.confirmMatchButtonText}> אישור צימוד </Text>

                            </TouchableOpacity>
                            :
                            <View >

                                <TouchableOpacity
                                    style={styles.confirmMatchButton}
                                    onPress={() => updatePairingInDB(true, obj.customerId, obj.disId)} >
                                    <Text style={styles.confirmMatchButtonText}> אישור צימוד</Text>

                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.rejectMatchButton}
                                    onPress={() => updatePairingInDB(false, obj.customerId, obj.disId)} >
                                    <Text style={styles.confirmMatchButtonText}> דחיית צימוד</Text>
                                </TouchableOpacity>
                            </View>
                    }
                </View>

            </ScrollView>
        </>
    );
}


const styles = StyleSheet.create({

    //Containers:
    mainContainer: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        minHeight: Dimensions.get('window').height
    },
    matchRateContainer:
    {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 15
    },
    tablesMainContainer:
    {
        alignSelf: 'center',
        flexDirection: 'row',
        marginTop: 13
    },
    tableContainer: {
        paddingHorizontal: 3,
    },
    ratingContainer:
    {
        width: Dimensions.get('window').width * 0.35,
        alignItems: 'center',
        marginLeft: 7
    },
    subsContainer:
    {
        width: Dimensions.get('window').width * 0.35,
        marginRight: 7
    },



    //General:
    mainHeading: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 30,
        marginBottom: 7
    },
    notesContent:
    {
        fontSize: 13,
        textAlign: 'left',
        marginTop: 7
    },
    subsContent:
    {
        fontSize: 13,
        textAlign: 'justify'
    },

    //Headings:
    matchKoteret: {
        marginTop: 6,
        textAlign: 'center',
        fontSize: 16,
    },
    matchKoteretNumber: {
        marginTop: 6,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#42c181'
    },
    ratingHeading:
    {
        fontWeight: 'bold',
        marginBottom: 5
    },
    notesHeading:
    {
        fontWeight: 'bold',
        fontSize: 15
    },
    subsHeading:
    {
        fontWeight: 'bold',
        marginBottom: 5
    },
    availabilityHeading:
    {
        fontWeight: 'bold',
        fontSize: 15
    },

    //Table:
    tableBorderStyle:
    {
        borderWidth: 1,
        borderColor: 'grey'
    },
    tableContentTextStyle: {
        color: 'black',
        textAlign: 'center',
        fontSize: 15,
        padding: 2
    },
    rowStyle:
    {
        height: 60,
        width: Dimensions.get('window').width * 0.35
    },
    distanceTextStyle:
    {
        fontSize: 8.5,
        alignSelf: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontWeight: 'bold',
        padding: 2
    },


    //Tables' Headers:
    tableHeaderStyle: {
        height: 50,
        alignContent: "center",
        backgroundColor: '#3a3b40',
        borderColor: 'grey',
        width: Dimensions.get('window').width * 0.35

    },
    tableHeaderTextStyle: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 17
    },



    //the center table (for the circles)
    circleContainer:
    {
        alignContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    circlesTableContainer: {
        paddingHorizontal: 10,
    },
    circlesTableBorderStyle: {
        borderWidth: 1,
        borderColor: 'white'
    },
    circleTableHeaderStyle: {
        height: 50,
        width: Dimensions.get('window').width * 0.1
    },
    circlesTableRowStyle: {
        height: 60,
        width: Dimensions.get('window').width * 0.1
    },
    circlesTableContentTextStyle: {
        alignContent: 'center',
        textAlign: 'center',
        alignItems: 'center', alignSelf: 'center',

    },

    //Join Date Texts:
    enterSystemDateText: {
        fontSize: 15,
        marginTop: 20

    }, enterSystemText: {
        fontSize: 15,
        marginTop: 20,
    },


    //Buttons:
    //Confirm Match Button:
    confirmMatchButton: {
        backgroundColor: '#42c181',
        borderRadius: 50,
        width: Dimensions.get('window').width * 0.9,
        height: 45,
        display: 'flex',
        justifyContent: 'center',
        marginTop: 20,
        alignSelf: 'center',
        margin: 7

    },

    //if you come from another popup, the button needs to be longer
    confirmMatchButton1: {
        backgroundColor: '#42c181',
        borderRadius: 50,
        width: Dimensions.get('window').width * 0.9,
        height: 45,
        justifyContent: 'center',
        marginVertical: 20,
        alignSelf: 'center',
    },

    //Reject Match Button:
    rejectMatchButton: {
        backgroundColor: '#e95344',
        borderRadius: 50,
        width: Dimensions.get('window').width * 0.9,
        height: 45,
        justifyContent: 'center',
        marginVertical: 20,
        alignSelf: 'center',
    },

    confirmMatchButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 20,
        alignSelf: 'center',
        fontWeight: 'bold',
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


    //circles color
    greenCircle: { backgroundColor: '#42c181', height: 30, width: 30, borderRadius: 50 },
    redCircle: { backgroundColor: '#e95344', height: 30, width: 30, borderRadius: 50 },
    yellowCircle: { backgroundColor: '#fcd12a', height: 30, width: 30, borderRadius: 50 },



    //Slider
    availabilityTextsContainer: {
        width: Dimensions.get('window').width * 0.8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center'
    },
    sliderStyle:
    {
        width: Dimensions.get('window').width * 0.8,
        height: 15,
        padding: 16,
        alignSelf: 'center'
    },
    greenColor: {
        color: '#42c181'
    },
    yellowColor: {
        color: '#FCD12A'
    },
    redColor: {
        color: '#e95344'
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