//Outer Imports:
import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, TextInput, StatusBar, ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { CheckBox } from 'react-native-elements';
import AwesomeAlert from 'react-native-awesome-alerts';
import AdressPopup from '../PopUps/AdressPopup';
import Spinner from 'react-native-loading-spinner-overlay';
import { Dimensions } from 'react-native';

//Inner Imports:
import Header from '../Components/Header';

//Icons:
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';




export default class AddNewDistributer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

            distributerID: '',                  //ID
            distributerFirstName: '',           // first name
            distributerLastName: '',            // last name
            distributerEmail: '',               //email
            distributerPhone: '',               //phone
            distributerGender: '',              //gender
            distributerNotes: '',               //notes

            distributerAdress: '',              //full adress
            distributerCity: '',                //name of city
            distributerStreet: '',              //name of street
            distributerAppartment: '',          //appartment number
            distributerHouse: '',               //house number

            distributerBirthDate_day: null,      //day of birth
            distributerBirthDate_month: null,    //month of birth
            distributerBirthDate_year: null,     //year of birth
            doesBDexists: false,

            proffBgList: [],                                    //list of all proffessional backgrounds

            amountOfBgs: [{ bgID: null, bgYear: null }],        //array of prof bgs Objects - [{ bgID , bgYear },{ bgID , bgYear }]

            statusesList: [
                { value: 'מפיץ בהכשרה', label: 'מפיץ בהכשרה' },
                { value: 'מפיץ פעיל', label: 'מפיץ פעיל' },
                { value: 'מפיץ לא פעיל', label: 'מפיץ לא פעיל' }
            ],                                                      //list of all possible statuses
            distributerStatus: null,              //status


            checkedM: false,    //male
            checkedF: false,    //female
            ddListYears: [],    //1935-2003
            ddListMonths: [],   //1-12
            ddListDays: [],     //1-31
            ddListBgsYears: [], //1935-2021


            //Alerts:
            showAlert: false,
            alertTitle: '',
            alertMessage: '',

            //Loading Animation:
            spinner: false,
        }
    }




    componentDidMount() {

        this.fetchProffBackgrounds();

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

        //-------------------------------------------------
    }


    //Get the list of proffessional backgrounds from the DB so we can display it in the droplist.
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

                    if (result != null && result != 500 && result != 404) {

                        //result = list of all the names of the proffessional backgrounds

                        let ddList = [];
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
                        alertMessage: 'התרחשה תקלה בהבאת נתונים ממסד הנתונים. נא לנסות שנית             ' + error,
                        alertTitle: 'שגיאה',
                        showAlert: true
                    })
                }
            );
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


    //----- Proffessional Backgrounds Adding Section -----//

    //Add another slot to add another proffessional background:
    addAnotherBgToDisplay = () => {

        let tempStateArr = this.state.amountOfBgs;
        tempStateArr.push({ bgID: null, bgYear: null });
        this.setState({ amountOfBgs: tempStateArr });
    }


    //Manage the professional background chosen:
    handleBgPicking = (id, index) => {

        let tempStateArr = this.state.amountOfBgs;
        let exists = false;
        for (let i = 0; i < tempStateArr.length; i++) {

            if (tempStateArr[i].bgID == id) {

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
            tempStateArr[index].bgID = id;

            this.setState({ amountOfBgs: tempStateArr });
        }
    }


    //Manage the year from which the user has this proffessional background:
    handleBgYearPicking = (year, index) => {

        let tempStateArr = this.state.amountOfBgs;
        tempStateArr[index].bgYear = year;

        this.setState({ amountOfBgs: tempStateArr });
    }


    //Delete specific bg & year that were added:
    removePbgUnit = (index) => {
        
        let tempStateArr = this.state.amountOfBgs;
        let removedBG = tempStateArr.splice(index, 1);
        this.setState({ amountOfBgs: tempStateArr });
    }


    //----- Adding Distributer to DB Section -----//

    //Check the data inserted by the user:
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

                    if (this.state.distributerBirthDate_year == null || this.state.distributerBirthDate_month == null || this.state.distributerBirthDate_day == null) {
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
                                                    alertMessage: "כתובת האימייל שהוזנה אינה תקינה",
                                                    showAlert: true
                                                })
                                            }
                                            else {

                                                if (this.state.distributerAdress == '') {
                                                    this.setState({
                                                        alertTitle: "שגיאה",
                                                        alertMessage: "נא להזין כתובת מגורים",
                                                        showAlert: true
                                                    })
                                                }
                                                else {

                                                    if (this.state.distributerStatus == null) {
                                                        this.setState({
                                                            alertTitle: "שגיאה",
                                                            alertMessage: "נא לבחור סטאטוס",
                                                            showAlert: true
                                                        })
                                                    }
                                                    else {

                                                        if (this.state.amountOfBgs.length == 0) { // he doesn't have even 1 slot of pbg

                                                            this.setState({
                                                                alertTitle: "שגיאה",
                                                                alertMessage: "חובה להזין רקע מקצועי אחד לפחות",
                                                                showAlert: true
                                                            });
                                                        }
                                                        else {

                                                            let found = false;
                                                            let yearsProblem = false;
                                                            let tempStateArr = this.state.amountOfBgs;

                                                            for (let i = 0; i < tempStateArr.length; i++) {

                                                                if (tempStateArr[i].bgID == null || tempStateArr[i].bgYear == null) {

                                                                    found = true;
                                                                    break;
                                                                }

                                                                if (tempStateArr[i].bgYear != null) {
                                                                    if (tempStateArr[i].bgYear < this.state.distributerBirthDate_year) {

                                                                        yearsProblem = true;
                                                                        break;
                                                                    }
                                                                }
                                                            }

                                                            if (found) {

                                                                this.setState({
                                                                    alertTitle: "שגיאה",
                                                                    alertMessage: "נא להזין תוכן בכל אחת משורות הרקע המקצועי שהוספו",
                                                                    showAlert: true,
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

                                                                    this.addDistributerToDB();
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
        let day = this.state.distributerBirthDate_day;
        let month = this.state.distributerBirthDate_month;
        let year = this.state.distributerBirthDate_year;
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


    //Send the new distributer to the DB:
    addDistributerToDB() {

        this.setState({ spinner: true }); // Start loadign animation while the data is being proccessed

        //Arrange BD in format for the DB:
        let birthdate = new Date(this.state.distributerBirthDate_year + '/' + this.state.distributerBirthDate_month + '/' + this.state.distributerBirthDate_day).toISOString().slice(0, 10);

        // Arrange an array of the proffessional backgrounds:
        let backgroundsObjsArr = [];
        let temp = this.state.amountOfBgs;
        for (let i = 0; i < temp.length; i++) {

            //Create the PBG start date:
            var sinceDate = new Date();
            sinceDate.setDate("1");
            sinceDate.setMonth("0");
            sinceDate.setFullYear(temp[i].bgYear);

            //Create the PBG object:
            let bgObj = {
                has_BgID: temp[i].bgID,
                has_SinceDate: sinceDate
            }

            //Add the PBG object to the array that is sent to the DB:
            backgroundsObjsArr.push(bgObj);
        }

        //Create the new Distributer:
        let newDistributer = {

            d_ID: this.state.distributerID,
            d_FirstName: this.state.distributerFirstName,
            d_LastName: this.state.distributerLastName,
            d_Email: this.state.distributerEmail.toLowerCase(),
            d_BirthDate: birthdate,
            d_PhoneNumber: this.state.distributerPhone,
            d_Gender: this.state.checkedF ? 'נ' : 'ז',
            d_Notes: this.state.distributerNotes,
            d_Status: this.state.distributerStatus,

            //Distributer adress details:
            d_AppartmentNumber: this.state.distributerAppartment,
            d_HouseNumber: this.state.distributerHouse,
            d_StreetName: this.state.distributerStreet,
            d_CityName: this.state.distributerCity,

            d_ProfessionalBackgrounds: backgroundsObjsArr
        }

        //Add the new distributer to the DB:
        const apiUrl = 'https://proj.ruppin.ac.il/bgroup12/prod/api/distributer';
        fetch(apiUrl,
            {
                method: 'POST',
                body: JSON.stringify(newDistributer),
                headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json; chartset=UTF-8',
                })
            })
            .then(res => {

                return res.status == 200 ?
                    res.json()
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

                    if (result != null && result != 201 && result != 409 && result != 500) {

                        //Clear all the states and inform the user:
                        this.setState({
                            spinner: false,

                            alertMessage: result,
                            alertTitle: 'פעולה בוצעה בהצלחה',
                            showAlert: true,

                            distributerID: '',
                            distributerFirstName: '',
                            distributerLastName: '',
                            distributerEmail: '',
                            distributerPhone: '',
                            distributerGender: '',

                            distributerAdress: '',
                            distributerCity: '',
                            distributerStreet: '',
                            distributerAppartment: '',
                            distributerHouse: '',

                            distributerBirthDate_day: null,
                            distributerBirthDate_month: null,
                            distributerBirthDate_year: null,
                            distributerStatus: null,
                            distributerNotes: '',
                            checkedM: false,
                            checkedF: false,
                        })



                        //Reset proffessional backgrounds:
                        this.setState({ amountOfBgs: [] });
                        this.addAnotherBgToDisplay();       // Add one PBG slot as placeholder
                    }
                    else if (result == 201) {

                        this.setState({
                            spinner: false,

                            alertMessage: 'הוספת המפיץ למסד הנתונים התבצעה בהצלחה אך שליחת המייל עם סיסמתו לכניסה למערכת נכשלה',
                            alertTitle: 'אופס!',
                            showAlert: true
                        })
                    }
                    else if (result == 409) {

                        this.setState({
                            spinner: false,

                            alertMessage: 'הנתונים שהוזנו אינם עומדים בתנאי השרת ומסד הנתונים. נא לבדוק את הנתונים שהוזנו ולנסות שנית',
                            alertTitle: 'אופס!',
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

                            alertMessage: 'התרחשה תקלה בשמירת הנתונים למסד הנתונים. נא לנסות שנית',
                            alertTitle: 'שגיאה',
                            showAlert: true
                        })
                    }
                },
                (error) => {

                    this.setState({
                        spinner: false,

                        alertMessage: 'התרחשה תקלה בתקשורת עם מסד הנתונים. נא לנסות שנית             ' + error,
                        alertTitle: 'שגיאה',
                        showAlert: true
                    })
                }
            );
    }




    render() {

        let addingProffessionalBgs =
            this.state.amountOfBgs.map((bg, key) => {

                return <View style={styles.viewContainer} key={key}>

                    <TouchableOpacity
                        onPress={() => this.removePbgUnit(key)}
                        style={{ marginRight: 3 }}
                    >
                        <MaterialIcons name="cancel" size={24} color="#e95344" />
                    </TouchableOpacity>

                    <DropDownPicker
                        items={this.state.proffBgList}
                        placeholder="בחר.."
                        defaultValue={this.state.amountOfBgs[key].bgID}
                        containerStyle={styles.pbgNamesContainer}
                        itemStyle={{ justifyContent: 'flex-start' }}
                        style={styles.pbgNameDDList}
                        dropDownStyle={styles.dropDownStyle}
                        onChangeItem={item => this.handleBgPicking(item.value, key)}
                    />

                    <DropDownPicker
                        items={this.state.ddListBgsYears}
                        placeholder="שנה"
                        defaultValue={this.state.amountOfBgs[key].bgYear}
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
                    textStyle={{ color: 'white', fontSize: 26, fontWeight: 'bold' }}
                    color={'white'}
                    animation={'fade'}
                    overlayColor={'rgba(58, 59, 64, 0.65)'}
                />

                <ScrollView keyboardShouldPersistTaps={'handled'}>

                    <View style={styles.mainContainer}>

                        <Text style={styles.heading}>הוספת מפיץ חדש</Text>

                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>ת.ז:</Text>
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
                                placeholder="שנה"
                                defaultValue={this.state.distributerBirthDate_year}
                                containerStyle={styles.yearsContainer}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                style={styles.ddYearsStyle}
                                dropDownStyle={styles.dropDownStyle}
                                onChangeItem={item => this.setState({ distributerBirthDate_year: item.value })}
                            />

                            <DropDownPicker
                                items={this.state.ddListMonths}
                                placeholder="חודש"
                                defaultValue={this.state.distributerBirthDate_month}
                                containerStyle={styles.monthsContainer}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                style={styles.ddMonthsStyle}
                                dropDownStyle={styles.dropDownStyle}
                                onChangeItem={item => this.setState({ distributerBirthDate_month: item.value })}
                            />

                            <DropDownPicker
                                items={this.state.ddListDays}
                                placeholder="יום"
                                defaultValue={this.state.distributerBirthDate_day}
                                containerStyle={styles.daysContainer}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                style={styles.ddDaysStyle}
                                dropDownStyle={styles.dropDownStyle}
                                onChangeItem={item => this.setState({ distributerBirthDate_day: item.value })}
                            />
                        </View>

                        <View style={styles.viewContainer}>

                            <Text style={styles.fieldText}>מגדר:</Text>

                            <CheckBox
                                onPress={
                                    () => this.state.checkedM ?
                                        this.setState({ checkedM: false, checkedF: true })
                                        :
                                        this.setState({ checkedM: true, checkedF: false })
                                }
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
                                        this.setState({ checkedF: false, checkedM: true })
                                        :
                                        this.setState({ checkedF: true, checkedM: false }))
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
                                maxLength={40} keyboardType='email-address' style={styles.txtInput}
                                defaultValue={this.state.distributerEmail}
                            >
                            </TextInput>
                        </View>

                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>כתובת:</Text>
                            <AdressPopup navigation={this.props.navigation} sendDataFromChild={this.getDataFromChild} placeholder={'none'} />
                        </View>

                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>סטאטוס:</Text>
                            <DropDownPicker
                                items={this.state.statusesList}
                                placeholder="בחר.."
                                defaultValue={this.state.distributerStatus}
                                containerStyle={styles.ddListContainer}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                style={styles.ddListGeneralStyle}
                                dropDownStyle={styles.dropDownStyle}
                                onChangeItem={item => this.setState({ distributerStatus: item.label })}
                            />
                        </View>

                        <View style={styles.viewContainer}>
                            <Text style={styles.notesTextField}>הערות:</Text>
                            <TextInput
                                onChangeText={(e) => this.setState({ distributerNotes: e })}
                                scrollEnabled
                                multiline
                                numberOfLines={5}
                                maxLength={225}
                                style={styles.notesTextInput}
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

                        {addingProffessionalBgs}

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
        alignItems: 'baseline'
    },
    pbgsContainer:
    {
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between'
    },
    notesTextField:
    {
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginTop: 27,
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
    notesTextInput: {
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


    //Headings:
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


    //Dropdown Lists:
    dropDownStyle: {
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
        backgroundColor: '#f8f8f8', borderColor: '#3a3b40',
        height: 80
    },
    ddListGeneralStyle:
    {
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
        backgroundColor: 'white', borderColor: '#3a3b40'
    },
    ddListContainer:
    {
        height: 50,
        minWidth: 200,
        maxWidth: 350,
        flex: 1,
        marginVertical: 10
    },

    //Birthdate Dropdown Lists:
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
    ddYearsStyle: {
        borderTopLeftRadius: 20, borderTopRightRadius: 0,
        borderBottomLeftRadius: 20, borderBottomRightRadius: 0,
        backgroundColor: 'white', borderColor: '#3a3b40'
    },
    ddMonthsStyle: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        backgroundColor: 'white',
        borderBottomColor: '#3a3b40',
        borderLeftColor: 'white',
        borderRightColor: 'white',
        borderTopColor: '#3a3b40'
    },
    ddDaysStyle: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 20,
        backgroundColor: 'white',
        borderColor: '#3a3b40'
    },


    //Gender Checkbox:
    chbContainer: {
        backgroundColor: 'white',
        borderWidth: 0
    },


    //Professional Backgrounds DD Lists:
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