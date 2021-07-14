//Outer Imports:
import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Table, Row, Rows } from 'react-native-table-component';
import Spinner from 'react-native-loading-spinner-overlay';
import { useIsFocused } from '@react-navigation/native';

//Inner Imports:
import Header from '../Components/Header';
import FilterByStatusPopup from '../PopUps/FilterByStatusPopup';
import FilterByNamePopup from '../PopUps/FilterByNamePopup';
import FilterByPbgPopup from '../PopUps/FilterByPbgPopup';


//Icons:
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Zocial } from '@expo/vector-icons';
import { Dimensions } from 'react-native';




export default function DistributersLists(props) {

    const isFocused = useIsFocused();

    //Alerts:
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');

    //Table:
    const [headTable, setHeadTable] = useState(['שם\nהמפיץ', 'רקע\nמקצועי', 'סטאטוס']);
    const [dataTable, setDataTable] = useState([]);

    //filters
    const [filterName, setFilterName] = useState(-1);
    const [filterBackground, setFilterBackground] = useState(-1);
    const [filterStatus, setFilterStatus] = useState(-1);

    //Loading animation:
    const [spinner, setSpinner] = useState(true);




    useEffect(() => {

        const checkFocus = props.navigation.addListener('focus', () => {

            resetAllFilters();
            fetchFilteredList(-1, -1, -1);
        });

        return checkFocus;
    }, []);



    //clicking on a row moves the user to view the distributer's details: 
    const showDist = (distID) => {

        let d = {
            distributerPersonalCode: parseInt(distID),
        }

        props.navigation.navigate('ViewDistributer', { thisDistributer: d });
    }


    //----------------filters functions-------------------//

    //filter by NAME
    const getFilterOfName = async (data) => {

        await setFilterName(data);

        let filter_pbg = filterBackground;
        let filter_status = filterStatus;

        fetchFilteredList(data, filter_status, filter_pbg);
    }

    //filter by Background
    const getFilterOfBackground = async (data) => {

        await setFilterBackground(data);

        let filter_name = filterName;
        let filter_status = filterStatus;

        fetchFilteredList(filter_name, filter_status, data);
    }

    //filter by STATUS 
    const getFilterOfStatus = async (data) => {

        await setFilterStatus(data);

        let filter_name = filterName;
        let filter_pbg = filterBackground;

        fetchFilteredList(filter_name, data, filter_pbg);
    }


    const fetchFilteredList = (name, stat, pbg) => {

        setSpinner(true); // Start loading animation while data is being fetched

        let apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/getfiltereddistributers/${name}/${pbg}/${stat}`;
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
                    res.status == 200
                        ? res.json()
                        :
                        res.status == 500 ?
                            500
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

                            //distributer first & last name
                            tableRow.push(<Text onPress={() => showDist(result[i].d_PersonalCode)} style={styles.tableText}>{result[i].d_FirstName} {result[i].d_LastName}</Text>);   //first cell: distributer Full Name


                            let ProfBackground = result[i].d_ProfessionalBackgrounds;
                            let backgroundString = '';
                            for (let i = 0; i < ProfBackground.length; i++) {
                                backgroundString += ProfBackground[i].has_BgName + ', ';

                            }
                            backgroundString = backgroundString.substring(0, backgroundString.length - 2);
                            tableRow.push(<Text onPress={() => showDist(result[i].d_PersonalCode)} style={styles.tableText}>{backgroundString}</Text>); // second cell: list of proffessional backgrounds

                            tableRow.push(
                                <Text style={{ alignSelf: 'center', }} onPress={() => showDist(result[i].d_PersonalCode)}>

                                    <View style={{ flexDirection: 'column', flex: 1, alignContent: 'center', alignItems: 'center' }}>

                                        <View style={{ padding: 4, width: 35, height: 35, borderRadius: 20, backgroundColor: '#e95344', flex: 1, alignItems: 'center', justifyContent: 'center', }}>

                                            {
                                                result[i].d_Status == 'מנהל' ?
                                                    <Zocial name="persona" size={20} color="white" /> :
                                                    result[i].d_Status == 'מפיץ פעיל' ?
                                                        <FontAwesome5 name="money-bill-wave" size={20} color="white" /> :
                                                        result[i].d_Status == 'מפיץ לא פעיל' ?
                                                            <MaterialCommunityIcons name="account-off" size={20} color="white" /> :
                                                            result[i].d_Status == 'מפיץ בהכשרה' ?
                                                                <Ionicons name="school-sharp" size={20} color="white" /> :
                                                                <Text></Text>
                                            }

                                        </View>

                                        <View style={{ margin: 3, flex: 1, }}>

                                            {result[i].d_Status == 'מנהל' ?
                                                <Text style={{ fontSize: 9, }}>מנהל</Text> :
                                                result[i].d_Status == 'מפיץ פעיל' ?
                                                    <Text style={{ fontSize: 9, }}>מפיץ פעיל</Text> :
                                                    result[i].d_Status == 'מפיץ לא פעיל' ?
                                                        <Text style={{ fontSize: 9 }}>מפיץ לא פעיל</Text> :
                                                        result[i].d_Status == 'מפיץ בהכשרה' ?
                                                            <Text style={{ fontSize: 9 }}>מפיץ בהכשרה</Text> :
                                                            <Text></Text>
                                            }

                                        </View>
                                    </View>
                                </Text>
                            ); // third cell: status (name + icon;)

                            table.push(tableRow);   //Add the ROW to the Table
                        }

                        setSpinner(false); // Stop loading animation as data is ready to be displayed
                        setDataTable(table);
                    }
                    else if (result == 404) {

                        let table = [];
                        let tableRow = [];      //Row in the Table

                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);

                        table.push(tableRow);   //Add the ROW to the Table
                        setDataTable(table);

                        setSpinner(false);
                        setAlertMessage('לא נמצאו מפיצים במסד הנתונם');
                        setAlertTitle('אופס!');
                        setShowAlert(true);

                    }
                    else if (result == 500) {

                        let table = [];
                        let tableRow = [];      //Row in the Table

                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);

                        table.push(tableRow);   //Add the ROW to the Table
                        setDataTable(table);

                        setSpinner(false);
                        setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה');
                        setShowAlert(true);

                    }
                    else {

                        let table = [];
                        let tableRow = [];      //Row in the Table

                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);
                        tableRow.push(<Text></Text>);

                        table.push(tableRow);   //Add the ROW to the Table
                        setDataTable(table);

                        setSpinner(false);
                        setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה');
                        setShowAlert(true);
                    }
                },
                (error) => {

                    let table = [];
                    let tableRow = [];      //Row in the Table

                    tableRow.push(<Text></Text>);
                    tableRow.push(<Text></Text>);
                    tableRow.push(<Text></Text>);

                    table.push(tableRow);   //Add the ROW to the Table
                    setDataTable(table);


                    setSpinner(false);
                    setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית             ' + error);
                    setAlertTitle('שגיאה');
                    setShowAlert(true);
                }
            );
    }


    const resetAllFilters = () => {

        setFilterName(-1);
        setFilterBackground(-1);
        setFilterStatus(-1);
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
                <Text style={styles.heading}> רשימת מפיצים </Text>


                {
                    isFocused ?
                        <View style={{ backgroundColor: 'white' }}>

                            <FilterByNamePopup whoI='distributer' sendDataToParent={getFilterOfName} />
                            <FilterByPbgPopup sendDataToParent={getFilterOfBackground} />
                            <FilterByStatusPopup whoI='distributer' sendDataToParent={getFilterOfStatus} />
                        </View>
                        :
                        <></>
                }


                <View style={{ marginBottom: 240 }}>
                    <Table borderStyle={styles.tableBorder}>
                        <Row
                            data={headTable}
                            style={styles.headStyle}
                            textStyle={styles.tableHeaderText}
                        />
                        <ScrollView style={{ marginBottom: 110 }}>
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
        height: Dimensions.get('window').height - 45
    },


    //Heading:
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
        borderColor: 'grey',
        backgroundColor: 'white'
    },
    tableText: {
        color: 'black',
        textAlign: 'center',
        fontSize: 14,
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