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
import FilterByStatusPopup from '../PopUps/FilterByStatusPopup';

//Icons:
import { MaterialIcons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';




export default function CustomerStatusesHistory(props) {

    //Table:
    const [headTable, setHeadTable] = useState([, 'שם\nלקוח', 'תאריך\nהתחלה', 'תאריך\nסיום', 'סטאטוס']);
    const [dataTable, setDataTable] = useState([]);


    //Filters:
    const [filterName, setFilterName] = useState(-1);
    const [filterStatus, setFilterStatus] = useState(-1);


    //Alerts:
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');


    //Loading animation:
    const [spinner, setSpinner] = useState(true);



    useEffect(() => {

        const checkFocus = props.navigation.addListener('focus', () => {

            fetchFilteredList(-1, -1);
        });

        return checkFocus;

    }, []);



    //Filter by NAME:
    const getFilterOfName = async (data) => {

        await setFilterName(data);

        let filter_status = filterStatus;

        fetchFilteredList(data, filter_status);
    }

    //Filter by STATUS:
    const getFilterOfStatus = async (data) => {

        await setFilterStatus(data);

        let filter_name = filterName;

        fetchFilteredList(filter_name, data);
    }




    // Get the filtered dtat from the DB:
    const fetchFilteredList = (name, stat) => {

        //Let the user know the system is working
        setSpinner(true);

        let apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/getfilteredcustomerstatuses/${name}/${stat}`;
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

                            //customer name & last name
                            tableRow.push(<Text style={styles.tableText}>{result[i].sh_CustomerFullName}</Text>);


                            //start date
                            let cutdate = result[i].sh_StartDate.split("T")[0];
                            let bdArr = cutdate.split("-");
                            let bDay = bdArr[2];
                            let bMonth = bdArr[1];
                            let bYear = bdArr[0];
                            let bdReverse = `${bDay}-${bMonth}-${bYear}`;
                            tableRow.push(<Text style={styles.tableText}>{bdReverse}</Text>);


                            //end date
                            if (result[i].sh_EndDate == null) {
                                tableRow.push(<Text style={styles.tableText}>סטאטוס נוכחי</Text>);
                            }
                            else {
                                let cutdate2 = result[i].sh_EndDate.split("T")[0];
                                let bdArr2 = cutdate2.split("-");
                                let bDay2 = bdArr2[2];
                                let bMonth2 = bdArr2[1];
                                let bYear2 = bdArr2[0];
                                let bdReverse2 = `${bDay2}-${bMonth2}-${bYear2}`;
                                tableRow.push(<Text style={styles.tableText}>{bdReverse2}</Text>);
                            }


                            tableRow.push(
                                <Text style={{ alignSelf: 'center' }} >

                                    <View style={{ flexDirection: 'column', flex: 1, alignContent: 'center', alignItems: 'center' }}>

                                        <View style={{ padding: 4, width: 35, height: 35, borderRadius: 20, backgroundColor: '#e95344', flex: 1, alignItems: 'center', justifyContent: 'center', }} >

                                            {
                                                result[i].sh_StatusName == 'ליד חם' ?
                                                    <MaterialIcons name="local-fire-department" size={20} color="white" /> :
                                                    result[i].sh_StatusName == 'לקוח פעיל' ?
                                                        <Fontisto name="heartbeat-alt" size={20} color="white" /> :
                                                        result[i].sh_StatusName == 'לקוח לא פעיל' ?
                                                            <MaterialIcons name="cancel" size={20} color="white" /> :
                                                            result[i].sh_StatusName == 'ליד רדום' ?
                                                                <Ionicons name="alarm-sharp" size={20} color="white" /> :
                                                                result[i].sh_StatusName == 'ליד אבוד' ?
                                                                    <MaterialCommunityIcons name="timer-sand" size={20} color="white" /> :
                                                                    <Text></Text>
                                            }
                                        </View>

                                        <View style={{ margin: 3, flex: 1, }}>

                                            {
                                                result[i].sh_StatusName == 'ליד חם' ?
                                                    <Text style={{ fontSize: 9, }}>ליד חם</Text> :
                                                    result[i].sh_StatusName == 'לקוח פעיל' ?
                                                        <Text style={{ fontSize: 9, }}> לקוח פעיל</Text> :
                                                        result[i].sh_StatusName == 'לקוח לא פעיל' ?
                                                            <Text style={{ fontSize: 9 }}>לקוח לא פעיל</Text> :
                                                            result[i].sh_StatusName == 'ליד רדום' ?
                                                                <Text style={{ fontSize: 9 }}>ליד רדום</Text> :
                                                                result[i].sh_StatusName == 'ליד אבוד' ?
                                                                    <Text style={{ fontSize: 9 }}>ליד אבוד</Text> :
                                                                    <Text></Text>
                                            }

                                        </View>

                                    </View>
                                </Text>
                            );


                            table.push(tableRow);   //Add the ROW to the Table
                        }

                        setSpinner(false); //Stop loading animation as the data is ready to be displayed
                        setDataTable(table);
                    }
                    else if (result == 500) {
                        let table = [];
                        let tableRow = [];      //Row in the Table

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
                    else if (result == 404) {
                        let table = [];
                        let tableRow = [];      //Row in the Table

                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);

                        table.push(tableRow);   //Add the ROW to the Table
                        setDataTable(table);

                        setSpinner(false);
                        setAlertMessage('לא נמצאה הסטוריית סטאטוסים במסד הנתונים');
                        setAlertTitle('אופס!')
                        setShowAlert(true);
                    }
                    else {

                        setSpinner(false);
                        setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה')
                        setShowAlert(true);

                        let table = [];
                        let tableRow = [];      //Row in the Table

                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);

                        table.push(tableRow);   //Add the ROW to the Table
                        setDataTable(table);
                    }
                },
                (error) => {

                    setSpinner(false);
                    setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית               ' + error);
                    setAlertTitle('שגיאה')
                    setShowAlert(true);

                    let table = [];
                    let tableRow = [];      //Row in the Table

                    tableRow.push(<Text></Text>);
                    tableRow.push(<Text></Text>);
                    tableRow.push(<Text></Text>);
                    tableRow.push(<Text></Text>);

                    table.push(tableRow);   //Add the ROW to the Table
                    setDataTable(table);
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

                <View >
                    <Text style={styles.heading}> היסטוריית סטאטוסי לקוחות </Text>
                </View>


                <View >

                    <FilterByNamePopup whoI='customer' sendDataToParent={getFilterOfName} myID={-1} myType={'מנהל'} />
                    <FilterByStatusPopup whoI='customer' sendDataToParent={getFilterOfStatus} myID={-1} myType={'מנהל'} />

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


    //Spinner
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