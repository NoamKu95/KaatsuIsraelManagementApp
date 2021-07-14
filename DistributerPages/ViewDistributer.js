//Outer Imports:
import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, TextInput, StatusBar, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as Linking from 'expo-linking';
import AwesomeAlert from 'react-native-awesome-alerts';

//Inner Imports:
import Header from '../Components/Header';

//Icons:
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';




export default class ViewDistributer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

            distributerPersonalCode: this.props.route.params.thisDistributer.distributerPersonalCode,  //Identifier 
            distributerID: '',                      //ID
            distributerFirstName: '',               // first name
            distributerLastName: '',                // last name
            distributerEmail: '',                   //email 
            distributerPhone: '',                   //phone
            distributerGender: '',                  //gender

            distributerBirthDate: '',               //Birth date
            distributerBirthDate_Day: '',
            distributerBirthDate_Month: '',
            distributerBirthDate_Year: '',

            distributerFullAdress: '',                  //adress
            distributerCity: '',
            distributerStreet: '',
            distributerHouseNumber: '',
            distributerAppartmentNumber: '',
            distributerEncodedAdress: '',           //for google maps navigation app

            distributerAppartmentNumber: '',        //appartment number
            distributerHouseNumber: '',             //house number
            distributerStreet: '',                  //street
            distributerCity: '',                    //city

            distributerJoinDate: '',
            distributerStatus: '',                  //status
            distributerNotes: '',                   //notes
            distributerRating: '',                  //rating - double

            professionalBackgroundsList: [],        //list of ALL profbgs [{ pbg_ID, pbg_Name }]
            distributerProffBgList: [],             //his profbgs - [ {has_BgID , has_SinceDate} , { }]
            distributerProffBgListNames: [],        //his profbgs - string["מאמן כושר",",תזונאי"]
            distributerPBGstring: '',

            workAreasList: [],                      //list of all work areas [{ wa_ID, wa_Name}]
            distributerWorkArea: '',                //work area - int
            distributerWorkAreaString: '',          //work area - name - string

            distributerRowVersion: '',
        }
    }


    componentDidMount() {

        this.fetchAllData();
        this.onPageFocus();
    }


    //Call all fetches:
    fetchAllData = async () => {

        await this.getInfoOnDistributer();
        await this.fetchProfessionalBackgrounds();
        await this.fetchWorkAreas();
        await this.turnPbgsToLongString();
    }


    //Get the distributer's details based on his ID that we got into the component
    getInfoOnDistributer = async () => {

        const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/distributer/${this.state.distributerPersonalCode}/`;
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

                        //Arrange the adress details into a long string:
                        let adress = `${result.d_StreetName} ${result.d_HouseNumber}, ${result.d_CityName} (דירה ${result.d_AppartmentNumber})`;

                        //Cut the birthdate we got from the db:
                        let cutBD = result.d_BirthDate.split("T")[0];
                        let bdArr = cutBD.split("-");
                        let bDay = bdArr[2];
                        let bMonth = bdArr[1];
                        let bYear = bdArr[0];
                        let bdReverse = `${bDay}-${bMonth}-${bYear}`;

                        // //Cut the joindate we got from the db:
                        let cutJD = result.d_JoinDate.split("T")[0];
                        let jdArr = cutJD.split("-");
                        let jDay = jdArr[2];
                        let jMonth = jdArr[1];
                        let jYear = jdArr[0];
                        let jdReverse = `${jDay}-${jMonth}-${jYear}`;

                        let encodedURI = encodeURI(`${result.d_StreetName} ${result.d_HouseNumber}, ${result.d_CityName}`);

                        this.setState({
                            distributerID: result.d_ID,
                            distributerFirstName: result.d_FirstName,
                            distributerLastName: result.d_LastName,

                            distributerBirthDate: bdReverse,
                            distributerBirthDate_Day: bDay,
                            distributerBirthDate_Month: bMonth,
                            distributerBirthDate_Year: bYear,

                            distributerEmail: result.d_Email,
                            distributerPhone: result.d_PhoneNumber,
                            distributerGender: result.d_Gender,

                            distributerJoinDate: jdReverse,

                            distributerStatus: result.d_Status,
                            distributerNotes: result.d_Notes,
                            distributerProffBgList: result.d_ProfessionalBackgrounds,   //[ {has_BgID , has_SinceDate, has_BgName, has_Distributer} ]
                            distributerRating: result.d_Rating,                         //double
                            distributerWorkArea: result.d_WorkArea,                     //int[]

                            distributerFullAdress: adress,
                            distributerAppartmentNumber: result.d_AppartmentNumber,
                            distributerHouseNumber: result.d_HouseNumber,
                            distributerStreet: result.d_StreetName,
                            distributerCity: result.d_CityName,
                            distributerEncodedAdress: encodedURI,

                            distributerRowVersion: result.RowVersion
                        });
                    }
                    else if (result == 404) {

                        this.setState({
                            alertMessage: 'לא נמצאה התאמה במסד הנתונים לנתוני המפיץ',
                            alertTitle: 'אופס!',
                            showAlert: true
                        })
                    }
                    else if (result == 500) {

                        this.setState({
                            alertMessage: 'התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית',
                            alertTitle: 'שגיאה',
                            showAlert: true
                        })
                    }
                    else {

                        this.setState({
                            alertMessage: 'התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית',
                            alertTitle: 'שגיאה',
                            showAlert: true
                        })
                    }
                },
                (error) => {
                    this.setState({
                        alertMessage: 'התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית             ' + error,
                        alertTitle: 'שגיאה',
                        showAlert: true
                    })
                }
            );
    }


    //Get all professional backgrounds from the DB: (for us to have)
    fetchProfessionalBackgrounds = async () => {

        const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/professionalbackground`;
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

                        this.setState({ professionalBackgroundsList: result });
                    }
                    else if (result == 404) {

                        this.setState({
                            alertMessage: 'לא נמצאו רקעים מקצועיים במסד הנתונים',
                            alertTitle: 'אופס!',
                            showAlert: true
                        })
                    }
                    else if (result == 500) {

                        this.setState({
                            alertMessage: 'התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית',
                            alertTitle: 'שגיאה',
                            showAlert: true
                        })
                    }
                    else {

                        this.setState({
                            alertMessage: 'התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית',
                            alertTitle: 'שגיאה',
                            showAlert: true
                        })
                    }
                },
                (error) => {
                    this.setState({
                        alertMessage: 'התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית             ' + error,
                        alertTitle: 'שגיאה',
                        showAlert: true
                    })
                }
            );
    }


    //Get all work areas from the DB:
    fetchWorkAreas = async () => {

        const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/workarea`;
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

                        let waTemp = [];    // temp to hold objects of work areas
                        result.forEach(element => {
                            waTemp.push({ wa_ID: element.wa_ID, wa_Name: element.wa_Name });

                            parseInt(element.wa_ID) == parseInt(this.state.distributerWorkArea) ?
                                this.setState({ distributerWorkAreaString: element.wa_Name })
                                :
                                '';
                        });

                        this.setState({ workAreasList: waTemp });
                    }
                    else if (result == 404) {

                        this.setState({
                            alertMessage: 'לא נמצאו אזורי עבודה במסד הנתונים',
                            alertTitle: 'אופס!',
                            showAlert: true
                        })
                    }
                    else if (result == 500) {

                        this.setState({
                            alertMessage: 'התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית',
                            alertTitle: 'שגיאה',
                            showAlert: true
                        })
                    }
                    else {

                        this.setState({
                            alertMessage: 'התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית',
                            alertTitle: 'שגיאה',
                            showAlert: true
                        })
                    }
                },
                (error) => {

                    this.setState({
                        alertMessage: 'התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית             ' + error,
                        alertTitle: 'שגיאה',
                        showAlert: true
                    })
                }
            );
    }


    //Turn the IDs array of proffessional backgrounds into a long string
    turnPbgsToLongString = () => {

        //Save the states into temp variables:
        let ourBgsList = this.state.distributerProffBgList;
        let allBgsList = this.state.professionalBackgroundsList;


        let distributerBgsInWords = []; // for the names of our professional bgs

        //Find the name that matches each pbg ID:
        ourBgsList.forEach(element => {

            for (let i = 0; i < allBgsList.length; i++) {

                if (element.has_BgID == allBgsList[i].pbg_ID) {

                    distributerBgsInWords.push(allBgsList[i].pbg_Name);
                    break;
                }
            }
        });
        this.setState({ distributerProffBgListNames: distributerBgsInWords });


        //Take the string[] and transfer it to a long string:
        let bgs = '';
        distributerBgsInWords.forEach(element => {
            bgs += (element + ', ');
        });
        let len = bgs.length;
        this.setState({ distributerPBGstring: bgs.substring(0, len - 2) })
    }


    //Add a listener to the page's focus:
    onPageFocus = () => {

        this.props.navigation.addListener('focus', () => {

            this.fetchAllData();
        })
    }


    componentWillUnmount() {

        this.onPageFocus();
    }


    moveToEditDistributer = () => {

        let d = {
            distributerPersonalCode: this.state.distributerPersonalCode,
            distributerFirstName: this.state.distributerFirstName,
            distributerLastName: this.state.distributerLastName,
            distributerEmail: this.state.distributerEmail,
            distributerPhone: this.state.distributerPhone,
            distributerGender: this.state.distributerGender,

            distributerFullAdress: this.state.distributerFullAdress,
            distributerCity: this.state.distributerCity,
            distributerStreet: this.state.distributerStreet,
            distributerAppartmentNumber: this.state.distributerAppartmentNumber,
            distributerHouseNumber: this.state.distributerHouseNumber,

            distributerNotes: this.state.distributerNotes,
            distributerStatus: this.state.distributerStatus,
            distributerID: this.state.distributerID,

            distributerBirthDate: this.state.distributerBirthDate,
            distributerBirthDate_Day: this.state.distributerBirthDate_Day,
            distributerBirthDate_Month: this.state.distributerBirthDate_Month,
            distributerBirthDate_Year: this.state.distributerBirthDate_Year,

            distributerProffBgListNames: this.state.distributerProffBgListNames,
            distributerProffBgList: this.state.distributerProffBgList,

            distributerRowVersion: this.state.distributerRowVersion
        }

        this.props.navigation.navigate('EditDistributerDetails', { thisDistributer: d })
    }



    
    render() {
        return (
            <>
                <StatusBar backgroundColor='#e95344' barStyle='light-content' />

                <Header navigation={this.props.navigation} showArrow={true} showMenu={true} />

                <AwesomeAlert
                    show={this.state.showAlert}
                    showProgress={false}
                    title={this.state.alertTitle}
                    message={this.state.alertMessage}
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={false}
                    showCancelButton={false}
                    showConfirmButton={true}
                    confirmText="אישור"
                    confirmButtonColor="#e95344"
                    onConfirmPressed={() => { this.setState({ showAlert: false }) }}
                    messageStyle={styles.alertMessageStyle}
                    titleStyle={styles.alertTitleStyle}
                    overlayStyle={{ backgroundColor: 'rgba(76, 76, 76, 0.69)' }}
                    confirmButtonStyle={styles.alertConfirmBtnStyle}
                    confirmButtonTextStyle={styles.alertConfirmBtnTxtStyle}
                    contentContainerStyle={styles.alertContentContainerStyle}
                />

                <ScrollView>
                    <View style={styles.mainContainer}>

                        <View style={styles.editIconContainer}>
                            <TouchableOpacity onPress={() => this.moveToEditDistributer()} >
                                <MaterialCommunityIcons name="pencil-circle" size={35} color="#e95344" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.heading}>{this.state.distributerFirstName + " " + this.state.distributerLastName}</Text>


                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>ת.ז.:</Text>
                            <TextInput
                                editable={false} style={styles.txtInput}
                                placeholder={this.state.distributerID}
                            ></TextInput>
                        </View>


                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>ת. לידה:</Text>
                            <TextInput
                                editable={false} style={styles.txtInput}
                                placeholder={this.state.distributerBirthDate}
                            ></TextInput>
                        </View>


                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>מגדר:</Text>
                            <TextInput
                                style={styles.txtInput}
                                editable={false} placeholder={this.state.distributerGender == 'ז' ? "זכר" : "נקבה"}
                            ></TextInput>
                        </View>


                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>טלפון:</Text>
                            <TextInput
                                style={styles.txtInputWithIcon}
                                editable={false} placeholder={this.state.distributerPhone}
                            ></TextInput>
                            <Ionicons
                                onPress={() => Linking.openURL(`tel:${this.state.distributerPhone}`)}
                                name="md-call" size={30} color="#e95344" style={styles.phoneIconStyle}
                            />
                        </View>


                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>אימייל:</Text>
                            <TextInput
                                style={styles.txtInput}
                                editable={false}
                                placeholder={this.state.distributerEmail}
                            ></TextInput>
                        </View>


                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>כתובת:</Text>
                            <TextInput
                                editable={false}
                                placeholder={this.state.distributerFullAdress}
                                multiline={true}
                                numberOfLines={this.state.distributerFullAdress.length > 25 ? 2 : 1}
                                style={this.state.distributerFullAdress.length > 25 ? styles.longTextInput : styles.txtInputWithIcon}
                            >
                            </TextInput>
                            <Ionicons
                                onPress={() => Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${this.state.distributerEncodedAdress}&travelmode=driving&dir_action=navigate`)}
                                name="location-sharp" size={30} color="#e95344" style={this.state.distributerFullAdress.length > 25 ? styles.mapsIconTwoLinesStyle : styles.mapsIconStyle}
                            />
                        </View>


                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>אזור עבודה:</Text>
                            <TextInput
                                style={styles.txtInput}
                                editable={false}
                                placeholder={this.state.distributerWorkAreaString}
                            ></TextInput>
                        </View>


                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>רקע מקצועי:</Text>
                            <TextInput
                                editable={false}
                                placeholder={this.state.distributerPBGstring}
                                multiline={true}
                                numberOfLines={this.state.distributerPBGstring.length > 30 ? 2 : 1}
                                style={this.state.distributerPBGstring.length > 30 ? styles.longBackgroundTextInput : styles.txtInput}
                            ></TextInput>
                        </View>


                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>תחילת עבודה:</Text>
                            <TextInput
                                editable={false} style={styles.txtInput}
                                placeholder={this.state.distributerJoinDate}
                            ></TextInput>
                        </View>


                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>סטאטוס:</Text>
                            <TextInput
                                editable={false} style={styles.txtInput}
                                placeholder={this.state.distributerStatus}
                            ></TextInput>
                        </View>


                        <View style={styles.viewContainer}>
                            <Text style={styles.notesHeading}>הערות:</Text>
                            <TextInput
                                placeholder={this.state.distributerNotes}
                                editable={false}
                                scrollEnabled
                                multiline
                                numberOfLines={5}
                                maxLength={225}
                                style={styles.multilineInput}>
                            </TextInput>

                        </View>

                    </View>
                </ScrollView>
            </>
        )
    }
}

const styles = StyleSheet.create({

    //Containers:
    mainContainer: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: 'white'
    },
    viewContainer: {
        flexDirection: 'row',
        alignItems: 'baseline'
    },
    editIconContainer:
    {
        flexDirection: 'row-reverse',
        marginTop: 10,
        marginLeft: 0
    },


    //Fields Headers:
    heading: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10
    },
    notesHeading: {
        fontWeight: 'bold',
        flex: 1,
        alignSelf: 'flex-start',
        marginTop: 27
    },
    fieldText: {
        fontWeight: 'bold',
        flex: 1,
        alignSelf: 'center'
    },


    //Text Inputs:
    txtInput: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 15,
        minWidth: 190,
        height: 50,
        backgroundColor: '#dfe0e4',
        borderRadius: 20,
        flex: 1,
        textAlign: 'right',
        color: 'black'
    },
    longTextInput: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        paddingRight: 25,
        marginVertical: 15,
        minWidth: 142,
        height: 65,
        backgroundColor: '#dfe0e4',
        // borderRadius: 20,
        flex: 1,
        textAlign: 'right',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
    },
    longBackgroundTextInput:
    {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 15,
        minWidth: 190,
        height: 65,
        backgroundColor: '#dfe0e4',
        borderRadius: 20,
        flex: 1,
        textAlign: 'right',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
    },
    txtInputWithIcon: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 15,
        minWidth: 142,
        height: 50,
        backgroundColor: '#dfe0e4',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        flex: 1,
        textAlign: 'right',
    },
    multilineInput: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginVertical: 15,
        minWidth: 190,
        height: 90,
        backgroundColor: '#dfe0e4',
        borderRadius: 20,
        flex: 1,
        textAlign: 'right',
        textAlignVertical: 'top',
    },


    //Icons:
    phoneIconStyle: {
        backgroundColor: '#dfe0e4',
        paddingLeft: 15,
        paddingTop: 8,
        borderBottomLeftRadius: 20,
        borderTopLeftRadius: 20,
        height: 50
    },
    mapsIconStyle: {
        backgroundColor: '#dfe0e4',
        paddingLeft: 15,
        paddingTop: 8,
        borderBottomLeftRadius: 20,
        borderTopLeftRadius: 20,
        height: 50
    },
    mapsIconTwoLinesStyle: {
        backgroundColor: '#dfe0e4',
        paddingLeft: 15,
        paddingTop: 16,
        borderBottomLeftRadius: 20,
        borderTopLeftRadius: 20,
        height: 65
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