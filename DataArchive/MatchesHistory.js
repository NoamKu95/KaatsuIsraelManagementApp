//Outer Imports:
import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Table, Row, Rows } from 'react-native-table-component';
import Spinner from 'react-native-loading-spinner-overlay';


//Inner Imports:
import Header from '../Components/Header';
import FilterByNamePopup from '../PopUps/FilterByNamePopup';
import FilterByMatchRatePopup from '../PopUps/FilterByMatchRatePopup';
import FilterByDatePopup from '../PopUps/FilterByDatePopup';
import FilterByStatusPopup from '../PopUps/FilterByStatusPopup';


//Icons:
import { MaterialIcons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function MatchesHistory(props) {

    //Alerts:
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');

    //Table:
    const [headTable, setHeadTable] = useState([, 'שם\nמפיץ', 'שם\nליד', 'מידת\nהתאמה', , 'תאריך\nצימוד', 'סטאטוס']);
    const [dataTable, setDataTable] = useState([]);

    //Filters:
    const [filterName, setFilterName] = useState(-1);
    const [filterFromMatch, setFilterFromMatch] = useState(-1);
    const [filterToMatch, setFilterToMatch] = useState(-1);
    const [filterFromDate, setFilterFromDate] = useState(-1);
    const [filterToDate, setFilterToDate] = useState(-1);
    const [filterStatus, setFilterStatus] = useState(-1);


    //Loading animation:
    const [spinner, setSpinner] = useState(true);




    useEffect(() => {

        const checkFocus = props.navigation.addListener('focus', () => {

            fetchFilteredList(-1, -1, -1, -1, -1, -1);
        });

        return checkFocus;
    }, []);


    //Filter by NAME:
    const getFilterOfName = async (data) => {

        await setFilterName(data);

        let filter_fromMatch = filterFromMatch;
        let filter_toMatch = filterToMatch;
        let filter_fromDate = filterFromDate;
        let filter_toDate = filterToDate;
        let filter_status = filterStatus;

        fetchFilteredList(data, filter_fromMatch, filter_toMatch, filter_fromDate, filter_toDate, filter_status);
    }


    //Filter by MATCH:
    const getFilterOfMatch = async (minNum, maxNum) => {

        await setFilterFromMatch(minNum);
        await setFilterToMatch(maxNum);

        let filter_name = filterName;
        let filter_fromDate = filterFromDate;
        let filter_toDate = filterToDate;
        let filter_status = filterStatus;


        fetchFilteredList(filter_name, minNum, maxNum, filter_fromDate, filter_toDate, filter_status);
    }


    //Filter by DATE:
    const getFilterOfDate = async (olderDate, newerDate) => {

        await setFilterFromDate(olderDate);
        await setFilterToDate(newerDate);

        let filter_name = filterName;
        let filter_fromMatch = filterFromMatch;
        let filter_toMatch = filterToMatch;
        let filter_status = filterStatus;


        fetchFilteredList(filter_name, filter_fromMatch, filter_toMatch, olderDate, newerDate, filter_status);
    }


    //Filter by STATUS:
    const getFilterOfStatus = async (data) => {

        await setFilterStatus(data);

        let filter_name = filterName;
        let filter_fromMatch = filterFromMatch;
        let filter_toMatch = filterToMatch;
        let filter_fromDate = filterFromDate;
        let filter_toDate = filterToDate;

        fetchFilteredList(filter_name, filter_fromMatch, filter_toMatch, filter_fromDate, filter_toDate, data);
    }




    // Get the filtered dtat from the DB:
    const fetchFilteredList = (name, fromMatch, toMatch, fromD, toD, stat) => {

        //Let the user know the system is working
        setSpinner(true);

        if (fromD == -1 || toD == -1) {

            fromD = '1900-01-01T00:00:00';
            toD = '9999-01-01T00:00:00';
        }

        let times = {

            fromDate: fromD,
            toDate: toD
        }

        let apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/getfilteredmatches/${name}/${fromMatch}/${toMatch}/${stat}`;
        fetch(apiUrl,
            {
                method: 'POST',
                body: JSON.stringify(times),
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

                        let table = [];  //Table that will hold the data (the rows)

                        //From each object from the DB we create a ROW in the Table:
                        for (let i = 0; i < result.length; i++) {

                            let tableRow = [];      //Row in the Table

                            //distributer name:
                            tableRow.push(<Text style={styles.tableText}>{result[i].m_dFullName}</Text>);   //first cell: Seller Full Name

                            //customer name:
                            tableRow.push(<Text style={styles.tableText}>{result[i].m_lFullName}</Text>);     // second cell: Customer Full Name

                            //Match Rate:
                            let newNum = parseFloat(result[i].m_matchRate).toFixed(2); //shorten the score to only 2 digits after the decimel
                            tableRow.push(<Text style={styles.tableText}>{newNum}</Text>);


                            //SALE DATE
                            //Cut the birthdate we got from the db:
                            let cutBD = result[i].m_matchDate.split("T")[0];
                            let bdArr = cutBD.split("-");
                            let bDay = bdArr[2];
                            let bMonth = bdArr[1];
                            let bYear = bdArr[0];
                            let bdReverse = `${bDay}-${bMonth}-${bYear}`;
                            tableRow.push(<Text style={styles.tableText}>{bdReverse}</Text>); // third cell: match date

                            //Status & ICON:
                            tableRow.push(
                                <Text style={{ alignSelf: 'center' }} >

                                    <View style={{ flexDirection: 'column', flex: 1, alignContent: 'center', alignItems: 'center' }}>

                                        <View style={{ padding: 4, width: 35, height: 35, borderRadius: 20, backgroundColor: '#e95344', flex: 1, alignItems: 'center', justifyContent: 'center', }} >

                                            {
                                                result[i].m_statusName == 'ליד חם' ?
                                                    <MaterialIcons name="local-fire-department" size={20} color="white" /> :
                                                    result[i].m_statusName == 'לקוח פעיל' ?
                                                        <Fontisto name="heartbeat-alt" size={20} color="white" /> :
                                                        result[i].m_statusName == 'לקוח לא פעיל' ?
                                                            <MaterialIcons name="cancel" size={20} color="white" /> :
                                                            result[i].m_statusName == 'ליד רדום' ?
                                                                <Ionicons name="alarm-sharp" size={20} color="white" /> :
                                                                result[i].m_statusName == ' ממתין לצימוד' ?
                                                                    <MaterialCommunityIcons name="timer-sand" size={20} color="white" /> :
                                                                    <Text></Text>
                                            }
                                        </View>

                                        <View style={{ margin: 3, flex: 1, }}>

                                            {
                                                result[i].m_statusName == 'ליד חם' ?
                                                    <Text style={{ fontSize: 9, }}>ליד חם</Text> :
                                                    result[i].m_statusName == 'לקוח פעיל' ?
                                                        <Text style={{ fontSize: 9, }}> לקוח פעיל</Text> :
                                                        result[i].m_statusName == 'לקוח לא פעיל' ?
                                                            <Text style={{ fontSize: 9 }}>לקוח לא פעיל</Text> :
                                                            result[i].m_statusName == 'ליד רדום' ?
                                                                <Text style={{ fontSize: 9 }}>ליד רדום</Text> :
                                                                result[i].m_statusName == 'ממתין לצימוד' ?
                                                                    <Text style={{ fontSize: 9 }}>ממתין לצימוד</Text> :
                                                                    <Text></Text>
                                            }

                                        </View>

                                    </View>
                                </Text>
                            );

                            table.push(tableRow);   //Add the ROW to the Table
                        }

                        setSpinner(false);
                        setDataTable(table);
                    }
                    else if (result == 404) {

                        let table = [];
                        let tableRow = [];      //Row in the Table

                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);

                        table.push(tableRow);   //Add the ROW to the Table
                        setDataTable(table);

                        setSpinner(false);
                        setAlertMessage('לא נמצאה היסטוריית צימודים במסד הנתונים');
                        setAlertTitle('אופס!')
                        setShowAlert(true);
                    }
                    else if (result == 500) {

                        let table = [];
                        let tableRow = [];      //Row in the Table

                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);

                        table.push(tableRow);   //Add the ROW to the Table
                        setDataTable(table);

                        setSpinner(false);
                        setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה')
                        setShowAlert(true);
                    }
                    else {

                        let table = [];
                        let tableRow = [];      //Row in the Table

                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);

                        table.push(tableRow);   //Add the ROW to the Table
                        setDataTable(table);

                        setSpinner(false);
                        setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה')
                        setShowAlert(true);
                    }
                },
                (error) => {

                    let table = [];
                    let tableRow = [];      //Row in the Table

                    tableRow.push(<Text></Text>);
                    tableRow.push(<Text></Text>);
                    tableRow.push(<Text></Text>);
                    tableRow.push(<Text></Text>);
                    tableRow.push(<Text></Text>);

                    table.push(tableRow);   //Add the ROW to the Table
                    setDataTable(table);

                    setSpinner(false);
                    setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית               ' + error);
                    setAlertTitle('שגיאה')
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

            <View style={styles.mainContainer} >

                <View>
                    <Text style={styles.heading}> היסטוריית צימודים </Text>
                </View>


                <View>

                    <FilterByNamePopup whoI='distributer' sendDataToParent={getFilterOfName} myID={-1} myType={'מפיץ פעיל'} />
                    <FilterByMatchRatePopup sendDataToParent={getFilterOfMatch} />
                    <FilterByDatePopup whoI='matchPage' sendDataToParent={getFilterOfDate} />
                    <FilterByStatusPopup whoI='customer' sendDataToParent={getFilterOfStatus} />

                </View>


                <View style={{ marginBottom: 55 }}>
                    <Table borderStyle={styles.tableBorder}>

                        <Row
                            data={headTable}
                            style={styles.headStyle}
                            textStyle={styles.tableHeaderText}
                        />

                        <ScrollView>
                            <Rows
                                data={dataTable}
                                textStyle={styles.tableText}
                                style={styles.rowStyle}
                            />
                        </ScrollView>
                    </Table>
                </View>

            </View>

        </>
    );
}


const styles = StyleSheet.create({

    //Containers:
    mainContainer: {
        backgroundColor: 'white',
        minHeight: Dimensions.get('window').height - 45
    },


    //Page name
    heading: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10,

    },


    //Table:
    tableBorder:
    {
        borderWidth: 1,
        borderColor: 'white'
    },
    headStyle: {
        height: 55,
        alignContent: "center",
        backgroundColor: '#3a3b40',
        borderColor: 'grey',
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
        height: 65,
        borderWidth: 1,
        borderColor: 'grey'
    },
    tableText: {
        color: 'black',
        textAlign: 'center',
        fontSize: 13,
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
    },
});