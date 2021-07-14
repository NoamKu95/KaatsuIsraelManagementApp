//Outer Imports:
import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, TextInput, StatusBar } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';
import { CheckBox } from 'react-native-elements'
import AsyncStorage from '@react-native-async-storage/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';
import Spinner from 'react-native-loading-spinner-overlay';
import { Dimensions } from 'react-native';

//Inner Imports:
import Header from '../Components/Header';
import AdressPopup from '../PopUps/AdressPopup';



export default class AddNewLead extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            leadFirstName: '',          // first name
            leadLastName: '',           // last name
            leadEmail: '',              //email
            leadPhone: '',              //phone
            leadGender: '',             //gender

            leadBirthDate_day: null,    //day of birth
            leadBirthDate_month: null,  //month of birth
            leadBirthDate_year: null,   //year of birth
            doesBDexists: false,

            leadAdress: '',             //full adress
            leadCity: '',               //city name
            leadStreet: '',             //street name
            leadAppartment: '',         //appartment number
            leadHouse: '',              //house number

            matchesIDsArr: [],          //matches id of *sub* use purpose with the id of its *general8 use purpose

            generalUsePurposesList: [], //list of all general-use-purposes
            leadUsePurpose: 'ימולא אוטומטית',         //general use purpose(s) of the lead

            subUsePurposesList: [],     //list of all sub-use-purposes
            leadSubUsePurpose: [],      //sub use purposes of the lead

            healthStatusesList: [],     //list of all health-statuses
            leadHealthStatus: null,       //health
            leadNotes: '',              //notes
            checkedM: false,            //male
            checkedF: false,            //female
            ddListYears: [],            //1935-2003
            ddListMonths: [],           //1-12
            ddListDays: [],             //1-31

            //Alerts:
            showAlert: false,
            alertTitle: '',
            alertMessage: '',

            //Loading Animation:
            spinner: false,
        }
    }

    //Fetch data & prepare date-parts for dd lists:
    componentDidMount() {

        this.fetchSubUsePurposes();
        this.fetchHealthStatuses();
        this.fetchGeneralUsePurposes();

        //-------------------------------------------------

        //prepare the numbers for the years-drop-down-list:
        let endyear = new Date().getFullYear() - 18;
        let startyear = new Date().getFullYear() - 85;

        let ddListY = [];
        for (let i = startyear; i <= endyear; i++) {
            ddListY.push({ label: `${i}`, value: `${i}` });
        }
        this.setState({ ddListYears: ddListY });

        //-------------------------------------------------

        //prepare the numbers for the month-drop-down-list:
        let ddListM = [];
        for (let i = 1; i <= 12; i++) {
            ddListM.push({ label: `${i}`, value: `${i}` });
        }
        this.setState({ ddListMonths: ddListM });

        //-------------------------------------------------

        //prepare the numbers for the days-drop-down-list:
        let ddListD = [];
        for (let i = 1; i <= 31; i++) {
            ddListD.push({ label: `${i}`, value: `${i}` });
        }
        this.setState({ ddListDays: ddListD });

    }


    //Get the list of sub-use purposes from the DB so we can display it in the droplist:
    fetchSubUsePurposes() {

        const apiUrl = 'https://proj.ruppin.ac.il/bgroup12/prod/api/subusepurpose/';
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

                        //result = list of all the names of the sub purposes

                        let ddList = [];        // temp to hold objects for dd list
                        let matchesArr = [];    // arr to hold SUP ids + their matching GUP ids

                        result.forEach(element => { //take each name and add to temp arr in the format for the dropdown list

                            ddList.push({ label: `${element.sup_Name}`, value: `${element.sup_ID}` });

                            matchesArr.push({ supID: element.sup_ID, gupID: element.sup_GUPID });
                        });

                        this.setState({
                            subUsePurposesList: ddList,     // for the drop down list
                            matchesIDsArr: matchesArr       // matches id of *sub* use purpose with the id of its *general* use purpose
                        });
                    }
                    else if (result == 404) {

                        this.setState({
                            alertMessage: 'לא נמצאו תת מטרות שימוש במסד הנתונים',
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
                        alertMessage: 'התרחשה תקלה בהבאת נתונים ממסד הנתונים. נא לנסות שנית             ' + error,
                        alertTitle: 'שגיאה',
                        showAlert: true
                    })
                }
            );
    }


    //Get all the General Use Purposes from the DB:
    fetchGeneralUsePurposes() {

        const apiUrl = 'https://proj.ruppin.ac.il/bgroup12/prod/api/generalusepurpose';
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
                        //result = list of all the names of the gups

                        let tempArr = [];       // temp to hold objects of GUPs
                        result.forEach(element => {
                            let x = {
                                gupName: element.gup_Name,
                                gupID: element.gup_ID
                            }
                            tempArr.push(x); //Create an array containing the names and IDs of the general use purposes.
                        });

                        this.setState({ generalUsePurposesList: tempArr });
                    }
                    else if (result == 404) {

                        this.setState({
                            alertMessage: 'לא נמצאו מטרות שימוש כלליות במסד הנתונים',
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
                        alertMessage: 'התרחשה תקלה בהבאת נתונים ממסד הנתונים. נא לנסות שנית             ' + error,
                        alertTitle: 'שגיאה',
                        showAlert: true
                    })
                }
            );
    }


    //Get the list of health conditions from the DB so we can display it in the droplist.
    fetchHealthStatuses() {

        const apiUrl = 'https://proj.ruppin.ac.il/bgroup12/prod/api/healthcondition';
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
                        //result = list of all the names of the health statuses

                        let ddList = [];        // temp to hold objects for dd list
                        result.forEach(element => { //take each name and add to temp arr in the format for the dropdown list

                            ddList.push({ label: `${element.hCondition_Name}`, value: `${element.hCondition_Name}` });
                        });

                        this.setState({ healthStatusesList: ddList });
                    }
                    else if (result == 404) {

                        this.setState({
                            alertMessage: 'לא נמצאו מצבים בריאותיים במסד הנתונים',
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


    //Print automaticlly the General Use Purposes on the screen:
    async matchSupWithGup(item) {

        //Update the state with the new array of subs the user chose:
        await this.setState({ leadSubUsePurpose: item });


        //Fill a temp array with the IDs of the *sub*-use-purposes chosen:
        let supsTempArrr = []; // for the IDs of the *subs*
        for (let i = 0; i < this.state.leadSubUsePurpose.length; i++) {

            supsTempArrr.push(parseInt(this.state.leadSubUsePurpose[i])); // parse it from string to int
        }


        //Fill an array with the *General* Use Purposes Names that match the sups ids:

        let relevantGupsArr = []; // for the IDs of the relevant *generals*
        let indexArr = this.state.matchesIDsArr; // IDs of *subs* + IDs of *generals*

        for (let i = 0; i < supsTempArrr.length; i++) { // take a single ID of *SUB* (int)

            for (let j = 0; j < indexArr.length; j++) { //look for the ID of the *GENERAL* use purpose that matches it in the index array

                if (supsTempArrr[i] == parseInt(indexArr[j].supID)) { // int vs string

                    relevantGupsArr.push(parseInt(indexArr[j].gupID)); // add the ID of the *general* to the array (int)
                    break;
                }
            }
        }

        //We now have an array with the IDs of the *GENERAL* use purposes the lead is intrested in

        let relevantGUPSlist = '';
        let relevantGUPSuniq = [...new Set(relevantGupsArr)];

        relevantGUPSuniq.forEach(element => {

            for (let i = 0; i < this.state.generalUsePurposesList.length; i++) {

                if (element == this.state.generalUsePurposesList[i].gupID) {

                    relevantGUPSlist += this.state.generalUsePurposesList[i].gupName + ", ";
                }
            }
        });

        this.setState({ leadUsePurpose: relevantGUPSlist.substring(0, relevantGUPSlist.length - 2) });
    }


    //Get the full adress from the popup:
    getDataFromChild = (adressObj) => {

        this.setState({

            leadAdress: adressObj.fullAdress,
            leadCity: adressObj.city,
            leadStreet: adressObj.street,
            leadAppartment: adressObj.appartmentNum,
            leadHouse: adressObj.houseNum
        });
    }


    //Check that all mandatory fields are filled
    checkInputs = async () => {

        if (this.state.leadFirstName == '' || this.state.leadLastName == '') {

            this.setState({
                alertTitle: "שגיאה",
                alertMessage: "נא להזין שם מלא",
                showAlert: true
            })
        }
        else {

            if (this.state.leadBirthDate_year == null || this.state.leadBirthDate_month == null || this.state.leadBirthDate_day == null) {
                this.setState({
                    alertTitle: "שגיאה",
                    alertMessage: "נא להזין תאריך לידה",
                    showAlert: true
                })
            }
            else {

                await this.checkBirthdateExists();
                if (!this.state.doesBDexists) {
                    this.setState({
                        alertTitle: "שגיאה",
                        alertMessage: "תאריך הלידה שהוזן אינו קיים",
                        showAlert: true
                    })
                }
                else {

                    if (!this.state.checkedM && !this.state.checkedF) {
                        this.setState({
                            alertTitle: "שגיאה",
                            alertMessage: "נא לבחור מגדר",
                            showAlert: true
                        })
                    }
                    else {

                        if (this.state.leadEmail == '') {
                            this.setState({
                                alertTitle: "שגיאה",
                                alertMessage: "נא להזין כתובת אימייל",
                                showAlert: true
                            })
                        }
                        else {

                            let reg = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
                            let email = this.state.leadEmail;
                            if (reg.test(email) === false) {

                                this.setState({
                                    alertTitle: "שגיאה",
                                    alertMessage: "כתובת האימייל שהוזנה אינה תקינה",
                                    showAlert: true
                                })
                            }
                            else {

                                if (this.state.leadPhone == '') {
                                    this.setState({
                                        alertTitle: "שגיאה",
                                        alertMessage: "נא להזין מספר טלפון",
                                        showAlert: true
                                    })
                                }
                                else {

                                    if (this.state.leadPhone.length != 10) {
                                        this.setState({
                                            alertTitle: "שגיאה",
                                            alertMessage: "מספר הטלפון שהוזן אינו תקין",
                                            showAlert: true
                                        })

                                    }
                                    else {

                                        if (this.state.leadAdress == '') {
                                            this.setState({
                                                alertTitle: "שגיאה",
                                                alertMessage: "נא להזין כתובת מגורים",
                                                showAlert: true
                                            })
                                        }
                                        else {

                                            if (this.state.leadSubUsePurpose.length == 0) {
                                                this.setState({
                                                    alertTitle: "שגיאה",
                                                    alertMessage: "נא לבחור תת-מטרת שימוש אחת לפחות",
                                                    showAlert: true
                                                });
                                            }
                                            else {

                                                if (this.state.leadHealthStatus == null) {
                                                    this.setState({
                                                        alertTitle: "שגיאה",
                                                        alertMessage: "נא לבחור מצב בריאותי",
                                                        showAlert: true
                                                    })
                                                }
                                                else {
                                                    this.addLeadToDB();
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }


    //Check if the birthdate actually exists in the calender:
    checkBirthdateExists = async () => {

        await this.setState({ doesBDexists: false });
        let day = this.state.leadBirthDate_day;
        let month = this.state.leadBirthDate_month;
        let year = this.state.leadBirthDate_year;
        let isLegit = true;

        if (day == '31') {

            if ([2, 4, 6, 9, 11].includes(parseInt(month))) {

                isLegit = false;
            }
        }
        else if (month == '2') {

            if (day == '30' || day == '31') {

                isLegit = false;
            }
            else if (day == '29') {

                parseInt(year) % 4 == 0 ? isLegit = true : isLegit = false;
            }
        }

        await this.setState({ doesBDexists: isLegit });
    }


    //Post the new lead to the DB:
    async addLeadToDB() {

        this.setState({ spinner: true }); // Start loading animation as the data is being proccessed

        let birthdate = new Date(this.state.leadBirthDate_year + "/" + this.state.leadBirthDate_month + "/" + this.state.leadBirthDate_day).toISOString().slice(0, 10);

        //turn the IDs of the *subs* to int from string (to fit the DB):
        let subsIDSint = [];
        this.state.leadSubUsePurpose.forEach(element => {
            subsIDSint.push(parseInt(element));
        });

        // Get from AS the personal code of the user adding the lead:
        const jsonValue = await AsyncStorage.getItem('userDetails');
        if (jsonValue != null) {

            var user = JSON.parse(jsonValue);


            //Create the Object to send to the DB:
            let newLead = {

                c_SubUsePurposes: subsIDSint, // int[]

                c_HealthStatusName: this.state.leadHealthStatus,

                c_FirstName: this.state.leadFirstName,
                c_LastName: this.state.leadLastName,
                c_Email: this.state.leadEmail,
                c_BirthDate: birthdate,
                c_PhoneNumber: this.state.leadPhone,
                c_Gender: this.state.checkedF ? 'נ' : 'ז',
                c_Notes: this.state.leadNotes,

                c_AppartmentNumber: parseInt(this.state.leadAppartment),
                c_HouseNumber: parseInt(this.state.leadHouse),
                c_StreetName: this.state.leadStreet,
                c_CityName: this.state.leadCity,

                c_AddedByDistributer: parseInt(user.d_PersonalCode),
            }

            //Add the new lead to the DB:
            const apiUrl = 'https://proj.ruppin.ac.il/bgroup12/prod/api/customer';
            fetch(apiUrl,
                {
                    method: 'POST',
                    body: JSON.stringify(newLead),
                    headers: new Headers({
                        'Content-Type': 'application/json; charset=UTF-8',
                        'Accept': 'application/json; chartset=UTF-8',
                    })
                })
                .then(res => {

                    return res.status == 200 ? res.json()
                        :
                        res.status == 201 ?
                            201
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

                        if (result != null && result != 409 && result != 400 && result != 500 && result != 201) {

                            this.setState({
                                spinner: false,

                                alertMessage: result,
                                alertTitle: 'פעולה בוצעה בהצלחה',
                                showAlert: true,

                                leadAdress: '',
                                leadCity: '',
                                leadStreet: '',
                                leadHouse: '',
                                leadAppartment: '',

                                leadBirthDate_day: null,
                                leadBirthDate_month: null,
                                leadBirthDate_year: null,
                                leadEmail: '',
                                leadFirstName: '',
                                leadGender: '',
                                leadHealthStatus: null,
                                leadLastName: '',
                                leadNotes: '',
                                leadPhone: '',
                                leadSubUsePurpose: [],
                                leadUsePurpose: '',
                                checkedF: false,
                                checkedM: false,
                            })
                        }
                        else if (result == 201) {

                            this.setState({
                                spinner: false,

                                alertMessage: 'הוספת לקוח התבצעה בהצלחה אך ביצוע הצימוד נכשל',
                                alertTitle: 'אופס!',
                                showAlert: true
                            })
                        }
                        else if (result == 409) {

                            this.setState({
                                spinner: false,

                                alertMessage: 'הנתונים שהוזנו אינם עומדים בתנאי השרת ומסד הנתונים. נא לבדוק את הנתונים שהוזנו ולנסות שנית',
                                alertTitle: 'שגיאה',
                                showAlert: true
                            })
                        }
                        else if (result == 500) {

                            this.setState({
                                spinner: false,

                                alertMessage: 'התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית',
                                alertTitle: 'שגיאה',
                                showAlert: true
                            })
                        }
                        else {

                            this.setState({
                                spinner: false,

                                alertMessage: 'התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית',
                                alertTitle: 'שגיאה',
                                showAlert: true
                            })
                        }
                    },
                    (error) => {

                        this.setState({
                            spinner: false,

                            alertMessage: 'התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית             ' + error,
                            alertTitle: 'שגיאה',
                            showAlert: true
                        })
                    }
                );
        } else {

            this.setState({
                spinner: false,

                alertMessage: '.התרחשה תקלה בשליפת הקוד האישי של היוזר מהאחסון המקומי. נא לנסות שנית',
                alertTitle: 'שגיאה',
                showAlert: true
            })
        }
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

                <Spinner
                    visible={this.state.spinner}
                    textContent={'טוען...'}
                    textStyle={styles.spinnerTextStyle}
                    color={'white'}
                    animation={'fade'}
                    overlayColor={'rgba(58, 59, 64, 0.65)'}
                />

                <ScrollView keyboardShouldPersistTaps={'handled'}>

                    <View style={styles.mainContainer}>

                        <Text style={styles.heading}>הוספת ליד חדש</Text>

                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>שם פרטי:</Text>
                            <TextInput
                                defaultValue={this.state.leadFirstName}
                                onChangeText={(e) => this.setState({ leadFirstName: e })}
                                maxLength={20} style={styles.txtInput}
                            ></TextInput>
                        </View>

                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>שם משפחה:</Text>
                            <TextInput
                                defaultValue={this.state.leadLastName}
                                onChangeText={(e) => this.setState({ leadLastName: e })}
                                maxLength={20} style={styles.txtInput}
                            ></TextInput>
                        </View>

                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>ת. לידה:</Text>
                            <DropDownPicker
                                items={this.state.ddListYears}
                                placeholder="שנה"
                                defaultValue={this.state.leadBirthDate_year}
                                containerStyle={{ height: 50, width: 110, flex: 1, marginVertical: 10 }}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                style={styles.yearsDateStyle}
                                dropDownStyle={styles.dropDownStyle}
                                onChangeItem={item => this.setState({ leadBirthDate_year: item.value })}
                            />

                            <DropDownPicker
                                items={this.state.ddListMonths}
                                placeholder="חודש"
                                defaultValue={this.state.leadBirthDate_month}
                                containerStyle={{ height: 50, width: 67, flex: 1, marginVertical: 10 }}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                style={styles.monthsDateStyle}
                                dropDownStyle={styles.dropDownStyle}
                                onChangeItem={item => this.setState({ leadBirthDate_month: item.value })}
                            />

                            <DropDownPicker
                                items={this.state.ddListDays}
                                placeholder="יום"
                                defaultValue={this.state.leadBirthDate_day}
                                containerStyle={{ height: 50, width: 57, flex: 1, marginVertical: 10 }}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                style={styles.daysDateStyle}
                                dropDownStyle={styles.dropDownStyle}
                                onChangeItem={item => this.setState({ leadBirthDate_day: item.value })}
                            />
                        </View>

                        <View style={styles.viewContainer}>

                            <Text style={styles.fieldText}>מגדר:</Text>

                            <CheckBox
                                onPress={() => this.state.checkedM ? this.setState({ checkedM: false, checkedF: true }) : this.setState({ checkedM: true, checkedF: false })}
                                center
                                title='זכר'
                                checked={this.state.checkedM}
                                checkedColor='#e95344'
                                containerStyle={styles.chbContainerStyle}
                                textStyle={{ color: 'black' }}
                            />

                            <CheckBox
                                onPress={() => (this.state.checkedF ? this.setState({ checkedF: false, checkedM: true }) : this.setState({ checkedF: true, checkedM: false }))}
                                center
                                title='נקבה'
                                checked={this.state.checkedF}
                                checkedColor='#e95344'
                                containerStyle={styles.chbContainerStyle}
                                textStyle={{ color: 'black' }}
                            />
                        </View>


                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>אימייל:</Text>
                            <TextInput
                                defaultValue={this.state.leadEmail}
                                onChangeText={(e) => this.setState({ leadEmail: e })}
                                maxLength={40}
                                keyboardType='email-address'
                                style={styles.txtInput}
                            >
                            </TextInput>
                        </View>

                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>טלפון:</Text>
                            <TextInput
                                defaultValue={this.state.leadPhone}
                                onChangeText={(e) => this.setState({ leadPhone: e })}
                                maxLength={10}
                                keyboardType='number-pad'
                                style={styles.txtInput}
                            >
                            </TextInput>
                        </View>

                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>כתובת:</Text>

                            <AdressPopup navigation={this.props.navigation} sendDataFromChild={this.getDataFromChild} placeholder={'none'} />
                        </View>

                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>תת- מטרות שימוש:</Text>
                            <DropDownPicker
                                placeholder='בחר..'
                                items={this.state.subUsePurposesList}
                                defaultValue={this.state.leadSubUsePurpose}
                                multiple='true'
                                multipleText="%d פריטים נבחרו"
                                min={0}
                                max={50}
                                containerStyle={styles.dropdownContainerStyle}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                style={styles.ddGeneralStyle}
                                dropDownStyle={{
                                    borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
                                    backgroundColor: '#f8f8f8', borderColor: '#3a3b40'
                                }}
                                onChangeItem={item => this.matchSupWithGup(item)}  //array
                            />
                        </View>

                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>מטרות שימוש כלליות:</Text>
                            <TextInput
                                defaultValue={this.state.leadUsePurpose}
                                maxLength={20}
                                editable={false}
                                style={styles.txtInput}
                            ></TextInput>
                        </View>


                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>מצב בריאותי:</Text>
                            <DropDownPicker
                                placeholder="בחר.."
                                defaultValue={this.state.leadHealthStatus}
                                items={this.state.healthStatusesList}
                                containerStyle={styles.dropdownContainerStyle}
                                itemStyle={{
                                    justifyContent: 'flex-start'
                                }}
                                style={styles.ddGeneralStyle}
                                dropDownStyle={styles.dropDownStyle}
                                onChangeItem={item => this.setState({ leadHealthStatus: item.label })}
                            />
                        </View>

                        <View style={styles.viewContainer}>
                            <Text style={styles.notesFieldText}>הערות:</Text>
                            <TextInput
                                defaultValue={this.state.leadNotes}
                                onChangeText={(e) => this.setState({ leadNotes: e })}
                                scrollEnabled
                                multiline
                                numberOfLines={5}
                                maxLength={225}
                                style={styles.notesStyle}
                            >
                            </TextInput>
                        </View>

                        <TouchableOpacity
                            onPress={this.checkInputs}
                            style={styles.saveButton}>
                            <Text
                                style={styles.saveButtonText}>
                                שמור
                            </Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </>
        );
    }
}


const styles = StyleSheet.create({

    //Containers:
    mainContainer: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: 'white',
        minHeight: Dimensions.get('window').height
    },
    viewContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        alignContent: 'center',
    },


    daysDateStyle: {
        borderTopLeftRadius: 0, borderTopRightRadius: 20,
        borderBottomLeftRadius: 0, borderBottomRightRadius: 20,
        backgroundColor: 'white', borderColor: '#3a3b40'
    },
    monthsDateStyle: {
        borderTopLeftRadius: 0, borderTopRightRadius: 0,
        borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
        backgroundColor: 'white', borderBottomColor: '#3a3b40', borderLeftColor: 'white', borderRightColor: 'white', borderTopColor: '#3a3b40'
    },
    yearsDateStyle: {
        borderTopLeftRadius: 20, borderTopRightRadius: 0,
        borderBottomLeftRadius: 20, borderBottomRightRadius: 0,
        backgroundColor: 'white', borderColor: '#3a3b40'
    },


    chbContainerStyle: {
        backgroundColor: 'white', borderWidth: 0
    },


    //Inputs:
    txtInput: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 15,
        width: Dimensions.get('window').width * 0.6,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 20,
        borderColor: 'black',
        borderWidth: 1,
        textAlign: 'right'
    },


    //Headings
    heading: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10
    },
    fieldText: {
        alignSelf: 'center',
        fontWeight: 'bold',
        width: Dimensions.get('window').width * 0.3,
    },
    dropDownStyle: {
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
        backgroundColor: '#f8f8f8', borderColor: '#3a3b40',
        height: 100
    },


    saveButton: {
        backgroundColor: '#e95344',
        borderRadius: 50,
        padding: 7,
        marginBottom: 20,
        width: Dimensions.get('window').width * 0.9,
        height: 45,
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    saveButtonText:
    {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    ddGeneralStyle: {
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
        backgroundColor: 'white', borderColor: '#3a3b40'
    },
    dropdownContainerStyle:
    {
        height: 50,
        minWidth: 200,
        maxWidth: 350,
        flex: 1,
        marginVertical: 10
    },

    notesFieldText: {
        fontWeight: 'bold',
        width: Dimensions.get('window').width * 0.3,
        alignSelf: 'flex-start',
        marginTop: 27
    },
    notesStyle: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginVertical: 15,
        width: Dimensions.get('window').width * 0.6,
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
