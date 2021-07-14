//Outer Imports:
import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, TextInput, StatusBar, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AwesomeAlert from 'react-native-awesome-alerts';
import DropDownPicker from 'react-native-dropdown-picker';
import { CheckBox } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import { Dimensions } from 'react-native';

//Icons:
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

//Inner Imports:
import Header from '../Components/Header';
import AdressPopup from '../PopUps/AdressPopup';




export default class EditDistributerDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

            distributerPersonalCode: props.route.params.thisDistributer.distributerPersonalCode,    //Identifier
            distributerID: props.route.params.thisDistributer.distributerID,                        //ID
            distributerFirstName: props.route.params.thisDistributer.distributerFirstName,          // first name
            distributerLastName: props.route.params.thisDistributer.distributerLastName,            // last name
            distributerEmail: props.route.params.thisDistributer.distributerEmail,                  //email
            distributerPhone: props.route.params.thisDistributer.distributerPhone,                  //phone
            distributerGender: props.route.params.thisDistributer.distributerGender,                //gender
            distributerNotes: props.route.params.thisDistributer.distributerNotes,                  //notes

            distributerFullAdress: props.route.params.thisDistributer.distributerFullAdress,                //adress
            distributerCity: props.route.params.thisDistributer.distributerCity,
            distributerStreet: props.route.params.thisDistributer.distributerStreet,
            distributerAppartmentNumber: props.route.params.thisDistributer.distributerAppartmentNumber,
            distributerHouseNumber: props.route.params.thisDistributer.distributerHouseNumber,

            distributerBirthDate: props.route.params.thisDistributer.distributerBirthDate,              //full birthdate (25-07-1995)
            distributerBirthDate_DAY: props.route.params.thisDistributer.distributerBirthDate_Day,      //day of birth
            distributerBirthDate_MONTH: props.route.params.thisDistributer.distributerBirthDate_Month,  //month of birth
            distributerBirthDate_YEAR: props.route.params.thisDistributer.distributerBirthDate_Year,    //year of birth
            doesBDexists: false,

            proffBgList: [],                                                                            //list of all pbgs [{label: name, value: id}]
            distributerProffBgList: props.route.params.thisDistributer.distributerProffBgList,          //array of his pbgs - [{has_BgID , has_SinceDate , has_BgName , has_Distributer} , { }]
            distributerProffBgListNames: props.route.params.thisDistributer.distributerProffBgListNames,//array of his pbgs - string["מאמן כושר","תזונאי"]

            statusesList: [                                                                 //list of all possible statuses
                { label: 'מפיץ בהכשרה', value: 'מפיץ בהכשרה' },
                { label: 'מפיץ פעיל', value: 'מפיץ פעיל' },
                { label: 'מפיץ לא פעיל', value: 'מפיץ לא פעיל' },
                { label: 'מנהל', value: 'מנהל' }
            ],
            distributerStatus: props.route.params.thisDistributer.distributerStatus,        //status

            checkedM: false,                                                                //male
            checkedF: false,                                                                //female
            ddListYears: [],                                                                //1935-2003
            ddListMonths: [],                                                               //1-12
            ddListDays: [],                                                                 //1-31
            ddListBgsYears: [],                                                             //1935-2021

            distributerRowVersion: props.route.params.thisDistributer.distributerRowVersion,

            //Loading Animation:
            spinner: false,
        }
    }


    //Fetch data & prepare data for display:
    componentDidMount() {

        this.fetchProffBackgrounds();

        //-------------------------------------------------

        //prepare the checkboxes based on the distributer gender
        this.state.distributerGender == 'נ' ? this.setState({ checkedF: true }) : this.setState({ checkedM: true });

        //-------------------------------------------------

        //prepare the month and day to be displayed in the DD List:
        let month = this.state.distributerBirthDate_MONTH;
        let day = this.state.distributerBirthDate_DAY;

        if (month.substring(0, 1)[0] == "0") {
            month = (month.substring(0, 2)[1]).toString();
        }
        if (day.substring(0, 1)[0] == "0") {
            day = (day.substring(0, 2)[1]).toString();
        }

        this.setState({
            distributerBirthDate_DAY: day,
            distributerBirthDate_MONTH: month,
        })

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

        //-------------------------------------------------

        //prepare the numbers for the BGS YEARS-drop-down-list:
        endyear = new Date().getFullYear();
        startyear = new Date().getFullYear() - 85;

        let ddListBgsYears = [];
        for (let i = startyear; i <= endyear; i++) {
            ddListBgsYears.push({ label: `${i}`, value: `${i}` });
        }
        this.setState({ ddListBgsYears: ddListBgsYears });
    }


    //Get all proff bgs from the DB so we can display it in the droplist:
    fetchProffBackgrounds() {

        const apiUrl = 'https://proj.ruppin.ac.il/bgroup12/prod/api/professionalbackground';
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
                        //result = list of all the names of the proffessional backgrounds

                        let ddList = [];    // temp to hold objects of pbgs
                        result.forEach(element => { //take each name and add to temp arr in the format of a dropdown list

                            ddList.push({ label: `${element.pbg_Name}`, value: `${element.pbg_ID}` });
                        });

                        this.setState({ proffBgList: ddList });
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



    //----- Proffessional Backgrounds Adding Secction -----//

    //Add another slot to add another proffessional background:
    addAnotherBgToDisplay = () => {

        let tempStateArr = this.state.distributerProffBgList;
        tempStateArr.push({ has_BgID: -1, has_SinceDate: 'בחר..', has_BgName: 'בחר..', has_Distributer: this.state.distributerPersonalCode });
        this.setState({ distributerProffBgList: tempStateArr });
    }


    //Manage the professional background chosen:
    handleBgPicking = (bg, index) => {

        let tempStateArr = this.state.distributerProffBgList;
        let exists = false;
        for (let i = 0; i < tempStateArr.length; i++) {

            if (tempStateArr[i].has_BgID == bg.value) {

                this.setState({
                    showAlert: true,
                    alertTitle: 'שגיאה',
                    alertMessage: 'לא ניתן לבחור פעמיים באותו רקע מקצועי',
                });
                this.removePbgUnit(index);
                exists = true;

                break;
            }
        }
        if (!exists) {
            tempStateArr[index].has_BgID = bg.value;
            tempStateArr[index].has_BgName = bg.label;

            this.setState({ distributerProffBgList: tempStateArr });
        }
    }


    //Manage the year from which the user has this proffessional background:
    handleBgYearPicking = (year, index) => {

        let tempStateArr = this.state.distributerProffBgList;
        tempStateArr[index].has_SinceDate = year;

        this.setState({ distributerProffBgList: tempStateArr });
    }


    //Delete specific bg & year that were added:
    removePbgUnit = (index) => {

        let tempStateArr = this.state.distributerProffBgList;
        let removedBG = tempStateArr.splice(index, 1);
        this.setState({ distributerProffBgList: tempStateArr });
    }


    //Check the details that the user put in the fields:
    checkInputs = async () => {

        if (this.state.distributerID == '') {

            this.setState({
                alertTitle: "שגיאה",
                alertMessage: "נא להזין מספר תעודת זהות",
                showAlert: true
            })
        }
        else {

            if (this.state.distributerID.length != 9) {

                this.setState({
                    alertTitle: "שגיאה",
                    alertMessage: "מספר תעודת הזהות שהוקלד אינו תקין",
                    showAlert: true
                })
            }
            else {

                if (this.state.distributerFirstName == '' || this.state.distributerLastName == '') {

                    this.setState({
                        alertTitle: "שגיאה",
                        alertMessage: "נא להזין שם מלא",
                        showAlert: true
                    })
                }
                else {

                    if (this.state.distributerBirthDate_YEAR == '' || this.state.distributerBirthDate_MONTH == '' || this.state.distributerBirthDate_DAY == '') {

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

                                if (this.state.distributerPhone == '') {

                                    this.setState({
                                        alertTitle: "שגיאה",
                                        alertMessage: "נא להזין מספר טלפון",
                                        showAlert: true
                                    })
                                }
                                else {

                                    if (this.state.distributerPhone.length != 10) {

                                        this.setState({
                                            alertTitle: "שגיאה",
                                            alertMessage: "מספר הטלפון שהוזן אינו תקין",
                                            showAlert: true
                                        })
                                    }
                                    else {

                                        if (this.state.distributerEmail == '') {

                                            this.setState({
                                                alertTitle: "שגיאה",
                                                alertMessage: "נא להזין כתובת אימייל",
                                                showAlert: true
                                            })
                                        }
                                        else {

                                            let reg = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
                                            let email = this.state.distributerEmail;
                                            if (reg.test(email) === false) {

                                                this.setState({
                                                    alertTitle: "שגיאה",
                                                    alertMessage: "כתובת המייל שהוזנה אינה תקינה",
                                                    showAlert: true
                                                })
                                            }
                                            else {

                                                if (this.state.distributerFullAdress == '') {

                                                    this.setState({
                                                        alertTitle: "שגיאה",
                                                        alertMessage: "נא להזין כתובת מגורים",
                                                        showAlert: true
                                                    })
                                                }
                                                else {

                                                    if (this.state.distributerProffBgList.length == 0) { // he doesn't have even 1 slot of pbg

                                                        this.setState({
                                                            alertTitle: "שגיאה",
                                                            alertMessage: "חובה להזין רקע מקצועי אחד לפחות",
                                                            showAlert: true
                                                        });

                                                    }
                                                    else {

                                                        let found = false;
                                                        let yearsProblem = false;
                                                        let tempStateArr = this.state.distributerProffBgList;

                                                        for (let i = 0; i < tempStateArr.length; i++) {

                                                            if (tempStateArr[i].has_BgID == -1 || tempStateArr[i].has_SinceDate == "בחר.." || tempStateArr[i].has_BgName == "בחר..") {

                                                                found = true;
                                                                break;
                                                            }
                                                            if (tempStateArr[i].has_SinceDate != "בחר..") {

                                                                if (parseInt(tempStateArr[i].has_SinceDate) <= parseInt(this.state.distributerBirthDate_YEAR) || parseInt(tempStateArr[i].has_SinceDate.split("-")[0]) <= parseInt(this.state.distributerBirthDate_YEAR)) {

                                                                    yearsProblem = true;
                                                                    break;
                                                                }
                                                            }
                                                        }

                                                        if (found) {

                                                            this.setState({
                                                                alertTitle: "שגיאה",
                                                                alertMessage: "נא להזין תוכן בכל אחת משורות הרקע המקצועי שהוספו",
                                                                showAlert: true
                                                            });
                                                        }
                                                        else {

                                                            if (yearsProblem) {

                                                                this.setState({
                                                                    alertTitle: "שגיאה",
                                                                    alertMessage: "ישנה אי התאמה בין שנת הלידה לבין שנת קבלת ההכשרה המקצועית",
                                                                    showAlert: true,
                                                                });
                                                            }
                                                            else {

                                                                if (this.state.distributerStatus == '') {

                                                                    this.setState({
                                                                        alertTitle: "שגיאה",
                                                                        alertMessage: "נא לבחור סטאטוס",
                                                                        showAlert: true
                                                                    })
                                                                }
                                                                else {

                                                                    this.updateDistributerDetailsInDB();
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
                }
            }
        }
    }


    //Check if the birthdate actually exists in the calender:
    checkBirthdateExists = async () => {

        await this.setState({ doesBDexists: false });
        let day = this.state.distributerBirthDate_DAY;
        let month = this.state.distributerBirthDate_MONTH;
        let year = this.state.distributerBirthDate_YEAR;
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


    //Get the full adress from the popup:
    getDataFromChild = (adressObj) => {

        this.setState({
            distributerAdress: adressObj.fullAdress,
            distributerCity: adressObj.city,
            distributerStreet: adressObj.street,
            distributerAppartment: adressObj.appartmentNum,
            distributerHouse: adressObj.houseNum
        });
    }


    //Send the updated data to the DB:
    updateDistributerDetailsInDB() {

        this.setState({ spinner: true }); // Start the loading animation as the data is being proccessed

        //Re-arrange his BD in the right format to the DB:
        let dBirthdate = this.state.distributerBirthDate_YEAR + "-" + this.state.distributerBirthDate_MONTH + "-" + this.state.distributerBirthDate_DAY;

        let tempStateArr = this.state.distributerProffBgList;
        let backgroundsObjsArr = [];    // will  hold the PBG objects that are sent to the DB

        for (let i = 0; i < tempStateArr.length; i++) {

            //Create the start date:
            var sinceDate = new Date();
            sinceDate.setDate("1");
            sinceDate.setMonth("0");

            //If the time format is from the DB then substring the first part:
            tempStateArr[i].has_SinceDate.length > 4 ?
                sinceDate.setFullYear(tempStateArr[i].has_SinceDate.substring(0, 4)) //the pbgs that come directly from the database have time format of '2019-01-01T00:00:00' and the year has to be extracted.
                :
                sinceDate.setFullYear(tempStateArr[i].has_SinceDate);

            //Create the PBG current object:
            let bgObj = {
                has_BgID: tempStateArr[i].has_BgID,
                has_SinceDate: sinceDate
            }

            //Add this PBG object to the Array of objects that will be sent to the DB:
            backgroundsObjsArr.push(bgObj);
        }

        //Build the Distributer to send to the DB:
        let distributerDetails = {

            d_ID: this.state.distributerID,
            d_FirstName: this.state.distributerFirstName,
            d_LastName: this.state.distributerLastName,
            d_PhoneNumber: this.state.distributerPhone,
            d_Email: this.state.distributerEmail.toLowerCase(),
            d_Gender: this.state.checkedF ? 'נ' : 'ז',
            d_Status: this.state.distributerStatus,
            d_BirthDate: dBirthdate.toString(),
            d_Notes: this.state.distributerNotes,

            //Distributer adress details:
            d_AppartmentNumber: this.state.distributerAppartmentNumber,
            d_HouseNumber: this.state.distributerHouseNumber,
            d_StreetName: this.state.distributerStreet,
            d_CityName: this.state.distributerCity,

            d_ProfessionalBackgrounds: backgroundsObjsArr,

            RowVersion: this.state.distributerRowVersion,
        }


        const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/editdistributer/${this.state.distributerPersonalCode}/`;
        fetch(apiUrl,
            {
                method: 'PUT',
                body: JSON.stringify(distributerDetails),
                headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json; chartset=UTF-8',
                })
            })
            .then(res => {

                return res.status == 200 ?
                    res.json()
                    :
                    res.status == 409 ?
                        409
                        :
                        res.status == 500 ?
                            500
                            :
                            res.status == 400 ?
                                400
                                :
                                res.status == 404 ?
                                    404
                                    :
                                    null;
            })
            .then(
                (result) => {

                    if (result != null && result != 400 & result != 404 && result != 409 && result != 500) {

                        this.setState({
                            spinner: false,

                            alertMessage: result,
                            alertTitle: 'פעולה בוצעה בהצלחה',
                            showAlert: true,
                        })

                        let c = {
                            distributerPersonalCode: this.state.distributerPersonalCode
                        }

                        var timeoutAlert = setTimeout(
                            () => {
                                //Move the user back to view distributer:
                                this.props.navigation.navigate('MoreOptionsStack', {
                                    screen: 'ViewDistributer',
                                    params: { thisDistributer: c }
                                });
                            }, 2000);
                    }
                    else if (result != 400) {

                        this.setState({
                            spinner: false,

                            alertMessage: 'מישהו נוסף מבצע שמירה במקביל. נא לרענן את העמוד ולנסות שנית',
                            alertTitle: 'אופס!',
                            showAlert: true
                        })
                    }
                    else if (result != 404) {

                        this.setState({
                            spinner: false,

                            alertMessage: 'לא נמצאה התאמה במסד הנתונים לנתוני המפיץ',
                            alertTitle: 'אופס!',
                            showAlert: true
                        })
                    }
                    else if (result != 409) {

                        this.setState({
                            spinner: false,

                            alertMessage: 'הנתונים שהוזנו אינם עומדים בתנאי השרת ומסד הנתונים. נא לבדוק את הנתונים שהוזנו ולנסות שנית',
                            alertTitle: 'שגיאה',
                            showAlert: true
                        })
                    }
                    else if (result != 500) {

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
                        spnner: false,

                        alertMessage: 'התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית             ' + error,
                        alertTitle: 'שגיאה',
                        showAlert: true
                    })
                }
            );
    }


    render() {

        let editProffessionalBgs = this.state.distributerProffBgList.map((bg, key) => {

            return <View style={styles.viewContainer} key={key}>

                <TouchableOpacity
                    onPress={() => this.removePbgUnit(key)}
                    style={{ marginRight: 3 }}
                >
                    <MaterialIcons name="cancel" size={24} color="#e95344" />
                </TouchableOpacity>

                <DropDownPicker
                    items={this.state.proffBgList}
                    placeholder={bg.has_BgName}
                    containerStyle={styles.pbgNamesContainer}
                    itemStyle={{ justifyContent: 'flex-start' }}
                    style={styles.pbgNameDDList}
                    dropDownStyle={styles.dropDownStyle}
                    onChangeItem={item => this.handleBgPicking(item, key)}
                />

                <DropDownPicker
                    items={this.state.ddListBgsYears}
                    placeholder={bg.has_SinceDate.substring(0, 4)}
                    containerStyle={styles.pbgYearsContainer}
                    itemStyle={{ justifyContent: 'flex-start' }}
                    style={styles.pbgYearDDList}
                    dropDownStyle={styles.dropDownStyle}
                    onChangeItem={item => this.handleBgYearPicking(item.value, key)}
                />
            </View>
        })




        
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

                        <Text style={styles.heading}>עריכת פרטי מפיץ</Text>

                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>ת.ז.:</Text>
                            <TextInput
                                onChangeText={(e) => this.setState({ distributerID: e })}
                                maxLength={9} keyboardType='number-pad' style={styles.txtInput}
                                defaultValue={this.state.distributerID}
                            ></TextInput>
                        </View>

                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>שם פרטי:</Text>
                            <TextInput
                                onChangeText={(e) => this.setState({ distributerFirstName: e })}
                                maxLength={20} style={styles.txtInput}
                                defaultValue={this.state.distributerFirstName}
                            ></TextInput>
                        </View>

                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>שם משפחה:</Text>
                            <TextInput
                                onChangeText={(e) => this.setState({ distributerLastName: e })}
                                maxLength={20} style={styles.txtInput}
                                defaultValue={this.state.distributerLastName}
                            ></TextInput>
                        </View>

                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>ת. לידה:</Text>
                            <DropDownPicker
                                items={this.state.ddListYears}
                                placeholder={this.state.distributerBirthDate_YEAR}
                                containerStyle={styles.yearsContainer}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                style={styles.birthDateStyle_Years}
                                dropDownStyle={styles.dropDownStyle}
                                onChangeItem={item => this.setState({ distributerBirthDate_YEAR: item.value })}
                            />

                            <DropDownPicker
                                items={this.state.ddListMonths}
                                placeholder={this.state.distributerBirthDate_MONTH}
                                containerStyle={styles.monthsContainer}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                style={styles.birthDateStyle_Months}
                                dropDownStyle={styles.dropDownStyle}
                                onChangeItem={item => this.setState({ distributerBirthDate_MONTH: item.value })}
                            />

                            <DropDownPicker
                                items={this.state.ddListDays}
                                placeholder={this.state.distributerBirthDate_DAY}
                                containerStyle={styles.daysContainer}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                style={styles.birthDateStyle_Days}
                                dropDownStyle={styles.dropDownStyle}
                                onChangeItem={item => this.setState({ distributerBirthDate_DAY: item.value })}
                            />
                        </View>


                        <View style={styles.viewContainer}>

                            <Text style={styles.fieldText}>מגדר:</Text>

                            <CheckBox
                                onPress={
                                    () => this.state.checkedM ?
                                        this.setState({ checkedM: false, checkedF: true, distributerGender: 'נ' })
                                        :
                                        this.setState({ checkedM: true, checkedF: false, distributerGender: 'ז' })}
                                center
                                title='זכר'
                                checked={this.state.checkedM}
                                checkedColor='#e95344'
                                containerStyle={styles.chbContainer}
                                textStyle={{ color: 'black' }}
                            />

                            <CheckBox
                                onPress={
                                    () => (this.state.checkedF ?
                                        this.setState({ checkedF: false, checkedM: true, distributerGender: 'ז' })
                                        :
                                        this.setState({ checkedF: true, checkedM: false, distributerGender: 'נ' }))
                                }
                                center
                                title='נקבה'
                                checked={this.state.checkedF}
                                checkedColor='#e95344'
                                containerStyle={styles.chbContainer}
                                textStyle={{ color: 'black' }}
                            />
                        </View>

                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>טלפון:</Text>
                            <TextInput
                                onChangeText={(e) => this.setState({ distributerPhone: e })}
                                maxLength={10} keyboardType='number-pad' style={styles.txtInput}
                                defaultValue={this.state.distributerPhone}
                            >
                            </TextInput>
                        </View>

                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>אימייל:</Text>
                            <TextInput
                                onChangeText={(e) => this.setState({ distributerEmail: e })}
                                maxLength={30} keyboardType='email-address' style={styles.txtInput}
                                defaultValue={this.state.distributerEmail}
                            >
                            </TextInput>
                        </View>

                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>כתובת:</Text>
                            <AdressPopup navigation={this.props.navigation} sendDataFromChild={this.getDataFromChild} placeholder={this.state.distributerFullAdress} />
                        </View>

                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>סטאטוס:</Text>
                            <DropDownPicker
                                items={this.state.statusesList}
                                placeholder={this.state.distributerStatus}
                                containerStyle={styles.dropdownContainerStyles}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                style={styles.dropdownGeneralStyle}
                                dropDownStyle={styles.dropDownStyle}
                                onChangeItem={item => this.setState({ distributerStatus: item.label })}
                            />
                        </View>

                        <View style={styles.viewContainer}>
                            <Text style={styles.notesHeading}>הערות:</Text>
                            <TextInput
                                onChangeText={(e) => this.setState({ distributerNotes: e })}
                                scrollEnabled multiline numberOfLines={5} maxLength={225}
                                style={styles.notesInput}
                                defaultValue={this.state.distributerNotes}
                            >
                            </TextInput>
                        </View>


                        <View style={styles.pbgsContainer}>
                            <Text style={styles.fieldText}>רקעים מקצועיים:</Text>

                            <TouchableOpacity onPress={() => this.addAnotherBgToDisplay()}>
                                <AntDesign name="pluscircle" size={24} color="#3a3b40" />
                            </TouchableOpacity>
                        </View>

                        {editProffessionalBgs}

                        <TouchableOpacity
                            onPress={this.checkInputs}
                            style={styles.saveButton}>
                            <Text
                                style={styles.saveButtonText}
                            >
                                שמור
                            </Text>
                        </TouchableOpacity>
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
        backgroundColor: 'white',
        minHeight: Dimensions.get('window').height
    },
    viewContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        alignContent: 'center',
    },
    pbgsContainer:
    {
        flexDirection: 'row',
        alignItems: 'baseline',
        alignContent: 'center',
        justifyContent: 'space-between',
        marginTop: 15
    },


    //Headings:
    heading: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10
    },
    notesHeading: {
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginTop: 27,
        width: Dimensions.get('window').width * 0.3,
    },
    fieldText: {
        alignSelf: 'center',
        fontWeight: 'bold',
        width: Dimensions.get('window').width * 0.3,
    },


    //Text Inputs:
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
    notesInput: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginVertical: 15,
        width: Dimensions.get('window').width * 0.6,
        height: 90,
        backgroundColor: 'white',
        borderRadius: 20,
        borderColor: '#3a3b40',
        borderWidth: 1,
        textAlign: 'right',
        textAlignVertical: 'top',
        minHeight: 100
    },


    //Gender Checkboxes:
    chbContainer: {
        backgroundColor: 'white',
        borderWidth: 0
    },


    //Birth Date Dropdown Lists:
    yearsContainer: {
        height: 50,
        width: 110,
        flex: 1,
        marginVertical: 10
    },
    monthsContainer: {
        height: 50,
        width: 67,
        flex: 1,
        marginVertical: 10
    },
    daysContainer: {
        height: 50,
        width: 57,
        flex: 1,
        marginVertical: 10
    },
    birthDateStyle_Years: {
        borderTopLeftRadius: 20, borderTopRightRadius: 0,
        borderBottomLeftRadius: 20, borderBottomRightRadius: 0,
        backgroundColor: 'white', borderColor: '#3a3b40'
    },
    birthDateStyle_Months: {
        borderTopLeftRadius: 0, borderTopRightRadius: 0,
        borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
        backgroundColor: 'white', borderBottomColor: '#3a3b40', borderLeftColor: 'white', borderRightColor: 'white', borderTopColor: '#3a3b40'
    },
    birthDateStyle_Days: {
        borderTopLeftRadius: 0, borderTopRightRadius: 20,
        borderBottomLeftRadius: 0, borderBottomRightRadius: 20,
        backgroundColor: 'white', borderColor: '#3a3b40'
    },


    //Dropdown Lists:
    dropDownStyle: {
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
        backgroundColor: '#f8f8f8', borderColor: '#3a3b40',
        height: 80
    },
    dropdownGeneralStyle: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        backgroundColor: 'white',
        borderColor: '#3a3b40'
    },
    pbgNamesContainer: {
        height: 50,
        minWidth: 100,
        maxWidth: 250,
        flex: 1,
        marginVertical: 10
    },
    pbgNameDDList: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 0,
        backgroundColor: 'white',
        borderColor: '#3a3b40',
    },
    pbgYearsContainer: {
        height: 50,
        width: 75,
        flex: 1,
        marginVertical: 10
    },
    pbgYearDDList: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 20,
        backgroundColor: 'white',
        borderColor: '#3a3b40',
    },
    dropdownContainerStyles: {
        height: 50,
        minWidth: 190,
        flex: 1,
        marginVertical: 10
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
    },
});