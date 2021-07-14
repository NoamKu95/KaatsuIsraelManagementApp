//Outer Imports:
import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, TextInput, StatusBar } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';
import { CheckBox } from 'react-native-elements';
import AwesomeAlert from 'react-native-awesome-alerts';
import Spinner from 'react-native-loading-spinner-overlay';
import { Dimensions } from 'react-native';


//Inner Imports:
import Header from '../Components/Header';
import AdressPopup from '../PopUps/AdressPopup';



export default class EditCustomerDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

            customerPersonalCode: props.route.params.thisCustomer.customerPersonalCode, //Identifier
            customerFirstName: props.route.params.thisCustomer.customerFirstName,       // first name
            customerLastName: props.route.params.thisCustomer.customerLastName,         // last name
            customerEmail: props.route.params.thisCustomer.customerEmail,               //email
            customerPhone: props.route.params.thisCustomer.customerPhone,               //phone
            customerGender: props.route.params.thisCustomer.customerGender,             //gender

            customerFullAdress: props.route.params.thisCustomer.customerFullAdress,     //full adress
            customerCity: props.route.params.thisCustomer.customerCity,
            customerStreet: props.route.params.thisCustomer.customerStreet,
            customerHouse: props.route.params.thisCustomer.customerHouse,
            customerAppartment: props.route.params.thisCustomer.customerAppartment,

            customerHealthStatus: props.route.params.thisCustomer.customerHealthStatus, //health status name
            customerNotes: props.route.params.thisCustomer.customerNotes,               //notes
            customerStatus: props.route.params.thisCustomer.customerStatus,             //status

            customerBirthDate_DB: props.route.params.thisCustomer.customerBirthDate,    //birth date (1995-07-25T00:00:00)
            customerBirthDate_day: '',                                                  //day of birth
            customerBirthDate_month: '',                                                //month of birth
            customerBirthDate_year: '',                                                 //year of birth
            doesBDexists: false,

            healthList: [],                                                             //list of  health conditions for DD LIST
            statusesList: [],                                                           //list of all statuses for DD LIST

            checkedM: false,                                                            //male
            checkedF: false,                                                            //female

            ddListYears: [],                                                            //1935-2003
            ddListMonths: [],                                                           //1-12
            ddListDays: [],                                                             //1-31

            //Alerts:
            showAlert: false,
            alertTitle: '',
            alertMessage: '',

            customerRowVersion: props.route.params.thisCustomer.customerRowVersion,

            //Loaing Animation:
            spinner: false,
        }
    }


    //Fetch data & prepare fields to display them:
    componentDidMount() {

        //Get necessary data from DB for the droplists:
        this.fetchAllData();


        //Prepare dates DD lists:
        this.prepareDaysForDD();
        this.prepareMonthsForDD();
        this.prepareYearsForDD();


        //prepare the date pickers based on the customer birthdate:
        let bDateCUT = this.state.customerBirthDate_DB.split("T");
        let bDateArr = bDateCUT[0].split("-");
        let year = bDateArr[0];
        let month = bDateArr[1];
        let day = bDateArr[2];


        //Update the month & day of BD (if needed) to match the dd list content:
        if (month.substring(0, 1)[0] == "0") {
            month = month[1].toString();
        }
        if (day.substring(0, 1)[0] == "0") {
            day = day[1].toString();
        }

        this.setState({
            customerBirthDate_day: day,
            customerBirthDate_month: month,
            customerBirthDate_year: year
        })


        //prepare the checkboxes based on the customer gender
        this.state.customerGender == 'נ' ? this.setState({ checkedF: true }) : this.setState({ checkedM: true });
    }


    fetchAllData = async () => {

        await this.fetchAllStatuses();
        await this.fetchAllHealth();
    }


    //prepare the numbers for the years-drop-down-list:
    prepareYearsForDD = () => {

        //prepare the numbers for the years-drop-down-list:
        let endyear = new Date().getFullYear() - 18;
        let startyear = new Date().getFullYear() - 85;

        let ddListY = [];
        for (let i = startyear; i <= endyear; i++) {
            ddListY.push({ label: `${i}`, value: `${i}` });
        }
        this.setState({ ddListYears: ddListY });
    }


    //prepare the numbers for the month-drop-down-list:
    prepareMonthsForDD = () => {

        let ddListM = [];
        for (let i = 1; i <= 12; i++) {
            ddListM.push({ label: `${i}`, value: `${i}` });
        }
        this.setState({ ddListMonths: ddListM });
    }


    //prepare the numbers for the days-drop-down-list:
    prepareDaysForDD = () => {

        let ddListD = [];
        for (let i = 1; i <= 31; i++) {
            ddListD.push({ label: `${i}`, value: `${i}` });
        }
        this.setState({ ddListDays: ddListD });
    }


    //Get a list of all possible customer statuses from the DB and make them in a dropdown list format
    fetchAllStatuses() {

        const apiUrl = 'https://proj.ruppin.ac.il/bgroup12/prod/api/customerstatus';
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
                        //result = list of all the statuses a customer can have

                        let ddList = [];
                        result.forEach(element => { //take each name and add to temp arr in the format of a dropdown list

                            ddList.push({ label: `${element.cs_Name}`, value: `${element.cs_ID}` });
                        });

                        this.setState({ statusesList: ddList }); //put the list in the state so we can get it in the dropdown list
                    }
                    else if (result == 404) {

                        this.setState({
                            alertMessage: 'לא נמצאו סטאטוסי לקוחות במסד הנתונים',
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


    //Get a list of all possible customer health statuses from the DB and make them in a dropdown list format
    fetchAllHealth() {

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

                    if (result != null && result != 500 && result != 404) {
                        //result = list of all the statuses a customer can have

                        let ddList = [];
                        result.forEach(element => { //take each name and add to temp arr in the format of a dropdown list

                            ddList.push({ label: `${element.hCondition_Name}`, value: `${element.hCondition_ID}` });
                        });

                        this.setState({ healthList: ddList }); //put the list in the state so we can get it in the dropdown list
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


    //Get the full adress from the popup:
    getDataFromChild = (adressObj) => {

        this.setState({
            customerFullAdress: adressObj.fullAdress,
            customerCity: adressObj.city,
            customerStreet: adressObj.street,
            customerAppartment: adressObj.appartmentNum,
            customerHouse: adressObj.houseNum
        });
    }


    //Check the details that the user put in the fields
    checkInputs = async () => {

        if (this.state.customerFirstName == '' || this.state.customerLastName == '') {
            this.setState({
                alertTitle: "שגיאה",
                alertMessage: "נא להזין שם מלא",
                showAlert: true
            })
        }
        else {

            if (this.state.customerBirthDate_year == '' || this.state.customerBirthDate_month == '' || this.state.customerBirthDate_day == '') {

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
                        alertMessage: "תאריך לידה שהוזן אינו קיים",
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

                        if (this.state.customerPhone == '') {

                            this.setState({
                                alertTitle: "שגיאה",
                                alertMessage: "נא להזין מספר טלפון",
                                showAlert: true
                            })
                        }
                        else {

                            if (this.state.customerPhone.length != 10) {

                                this.setState({
                                    alertTitle: "שגיאה",
                                    alertMessage: "מספר הטלפון שהוזן אינו תקין",
                                    showAlert: true
                                })
                            }
                            else {

                                if (this.state.customerEmail == '') {

                                    this.setState({
                                        alertTitle: "שגיאה",
                                        alertMessage: "נא להזין כתובת אימייל",
                                        showAlert: true
                                    })
                                }
                                else {

                                    let reg = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
                                    let email = this.state.customerEmail;
                                    if (reg.test(email) === false) {

                                        this.setState({
                                            alertTitle: "שגיאה",
                                            alertMessage: "כתובת האימייל שהוזנה אינה תקינה",
                                            showAlert: true
                                        })
                                    }
                                    else {

                                        if (this.state.customerAdress == '') {

                                            this.setState({
                                                alertTitle: "שגיאה",
                                                alertMessage: "נא להזין כתובת מגורים",
                                                showAlert: true
                                            })
                                        }
                                        else {

                                            if (this.state.customerHealthStatus == '') {

                                                this.setState({
                                                    alertTitle: "שגיאה",
                                                    alertMessage: "נא לבחור מצב בריאותי",
                                                    showAlert: true
                                                })
                                            }
                                            else {

                                                if (this.state.customerStatus == '') {

                                                    this.setState({
                                                        alertTitle: "שגיאה",
                                                        alertMessage: "נא לבחור סטאטוס",
                                                        showAlert: true
                                                    })
                                                }
                                                else {

                                                    this.updateCustomerDetailsInDB();
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
        let day = this.state.customerBirthDate_day;
        let month = this.state.customerBirthDate_month;
        let year = this.state.customerBirthDate_year;
        let isLegit = true;

        if (day == '31') {

            if ([2, 4, 6, 9, 11].includes(parseInt(month))) {

                isLegit = false;
            }
        }
        if (month == '2') {

            if (day == '30' || day == '31') {

                isLegit = false;
            }
            else if (day == '29') {

                parseInt(year) % 4 == 0 ? isLegit = true : isLegit = false;
            }
            else {
                isLegit = true;
            }
        }

        await this.setState({ doesBDexists: isLegit });
    }


    //Save the new details of the customer to the DB
    updateCustomerDetailsInDB() {

        this.setState({ spinner: true }); // Start loading animation as data is being proccessed

        let cBirthdate = this.state.customerBirthDate_year + "-" + this.state.customerBirthDate_month + "-" + this.state.customerBirthDate_day;

        let updatedCustomer = {

            c_Email: this.state.customerEmail,
            c_FirstName: this.state.customerFirstName,
            c_LastName: this.state.customerLastName,
            c_PhoneNumber: this.state.customerPhone,
            c_Gender: this.state.customerGender,
            c_BirthDate: cBirthdate.toString(),
            c_HealthStatusName: this.state.customerHealthStatus,
            c_Notes: this.state.customerNotes,
            c_StatusName: this.state.customerStatus,

            //Customer adress details:
            c_CityName: this.state.customerCity,
            c_StreetName: this.state.customerStreet,
            c_HouseNumber: this.state.customerHouse,
            c_AppartmentNumber: this.state.customerAppartment,

            RowVersion: this.state.customerRowVersion
        }


        const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/editcustomer/${this.state.customerPersonalCode}/`;
        fetch(apiUrl,
            {
                method: 'PUT',
                body: JSON.stringify(updatedCustomer),
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
                            res.status == 409 ?
                                409
                                :
                                res.status == 400 ?
                                    400
                                    :
                                    null;
            })
            .then(
                (result) => {

                    if (result != null && result != 400 && result != 404 && result != 409 && result != 500) {

                        this.setState({
                            spinner: false,

                            alertMessage: result,
                            alertTitle: 'פעולה בוצעה בהצלחה',
                            showAlert: true,
                        })

                        var timeout = setTimeout(() => {

                            let custID = this.state.customerPersonalCode;
                            let c = {
                                customerPersonalCode: custID
                            }

                            this.props.navigation.navigate('customerStack', {
                                screen: 'CustomerTimeline',
                                params: { thisCustomer: c }
                            });

                        }, 1500)
                    }
                    else if (result == 400) {

                        this.setState({
                            spinner: false,

                            alertMessage: 'מישהו נוסף מבצע שמירה במקביל. נא לרענן את העמוד ולנסות שנית',
                            alertTitle: 'אופס!',
                            showAlert: true
                        })
                    }
                    else if (result == 404) {

                        this.setState({
                            spinner: false,

                            alertMessage: 'לא נמצאה התאמה ללקוח במסד הנתונים',
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

                        <Text style={styles.heading}>עריכת פרטי לקוח</Text>

                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>שם פרטי:</Text>
                            <TextInput
                                onChangeText={(e) => this.setState({ customerFirstName: e })}
                                maxLength={20} style={styles.txtInput}
                                defaultValue={this.state.customerFirstName}
                            ></TextInput>
                        </View>

                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>שם משפחה:</Text>
                            <TextInput
                                onChangeText={(e) => this.setState({ customerLastName: e })}
                                maxLength={20} style={styles.txtInput}
                                defaultValue={this.state.customerLastName}
                            ></TextInput>
                        </View>

                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>ת. לידה:</Text>
                            <DropDownPicker
                                items={this.state.ddListYears}
                                defaultValue={this.state.customerBirthDate_year}
                                containerStyle={styles.ddListContainer_Years}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                style={styles.ddListStyle_Years}
                                dropDownStyle={styles.dropDownStyle}
                                onChangeItem={item => this.setState({ customerBirthDate_year: item.value })}
                            />

                            <DropDownPicker
                                items={this.state.ddListMonths}
                                defaultValue={this.state.customerBirthDate_month}
                                containerStyle={styles.ddListContainer_Months}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                style={styles.ddListStyle_Months}
                                dropDownStyle={styles.dropDownStyle}
                                onChangeItem={item => this.setState({ customerBirthDate_month: item.value })}
                            />

                            <DropDownPicker
                                items={this.state.ddListDays}
                                defaultValue={this.state.customerBirthDate_day}
                                containerStyle={styles.ddListContainer_Days}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                style={styles.ddListStyle_Days}
                                dropDownStyle={styles.dropDownStyle}
                                onChangeItem={item => this.setState({ customerBirthDate_day: item.value })}
                            />
                        </View>


                        <View style={styles.viewContainer}>

                            <Text style={styles.fieldText}>מגדר:</Text>

                            <CheckBox
                                onPress={
                                    () => this.state.checkedM ?
                                        this.setState({ checkedM: false, checkedF: true, customerGender: 'נ' })
                                        :
                                        this.setState({ checkedM: true, checkedF: false, customerGender: 'ז' })
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
                                        this.setState({ checkedF: false, checkedM: true, customerGender: 'ז' })
                                        :
                                        this.setState({ checkedF: true, checkedM: false, customerGender: 'נ' }))
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
                                onChangeText={(e) => this.setState({ customerPhone: e })}
                                maxLength={10} keyboardType='number-pad' style={styles.txtInput}
                                defaultValue={this.state.customerPhone}
                            >
                            </TextInput>
                        </View>


                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>אימייל:</Text>
                            <TextInput
                                onChangeText={(e) => this.setState({ customerEmail: e })}
                                maxLength={30} keyboardType='email-address' style={styles.txtInput}
                                defaultValue={this.state.customerEmail}
                            >
                            </TextInput>
                        </View>


                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>כתובת:</Text>

                            <AdressPopup
                                sendDataFromChild={this.getDataFromChild}
                                placeholder={this.state.customerFullAdress}
                            />

                        </View>


                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>מצב בריאותי:</Text>
                            <DropDownPicker
                                items={this.state.healthList}
                                placeholder={this.state.customerHealthStatus}
                                containerStyle={styles.ddListContainer}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                style={styles.ddListGeneralStyle}
                                dropDownStyle={styles.dropDownStyle}
                                onChangeItem={item => this.setState({ customerHealthStatus: item.label })}
                            />
                        </View>


                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>סטאטוס:</Text>
                            <DropDownPicker
                                items={this.state.statusesList}
                                placeholder={this.state.customerStatus}
                                containerStyle={styles.ddListContainer}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                style={styles.ddListGeneralStyle}
                                dropDownStyle={styles.dropDownStyle}
                                onChangeItem={item => this.setState({ customerStatus: item.label })}
                            />
                        </View>


                        <View style={styles.viewContainer}>
                            <Text style={styles.notesHeading}>הערות:</Text>
                            <TextInput
                                onChangeText={(e) => this.setState({ customerNotes: e })}
                                scrollEnabled
                                multiline
                                numberOfLines={5}
                                maxLength={225}
                                style={styles.notesInput}
                                defaultValue={this.state.customerNotes}
                            >
                            </TextInput>
                        </View>


                        <TouchableOpacity
                            onPress={() => this.checkInputs()}
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
        alignItems: 'baseline',
        alignContent: 'center',
    },
    chbContainer:
    {
        backgroundColor: 'white',
        borderWidth: 0
    },


    //Dropdown List:
    ddListGeneralStyle: {
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
        backgroundColor: 'white', borderColor: '#3a3b40'
    },
    dropDownStyle: {
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
        backgroundColor: '#f8f8f8', borderColor: '#3a3b40'
    },
    ddListContainer:
    {
        height: 50,
        minWidth: 190,
        flex: 1,
        marginVertical: 10
    },


    //Birthdate Dropdown List:
    ddListContainer_Days:
    {
        height: 50,
        width: 57,
        flex: 1,
        marginVertical: 10
    },
    ddListStyle_Days:
    {
        borderTopLeftRadius: 0, borderTopRightRadius: 20,
        borderBottomLeftRadius: 0, borderBottomRightRadius: 20,
        backgroundColor: 'white', borderColor: '#3a3b40'
    },
    ddListContainer_Months:
    {
        height: 50,
        width: 67,
        flex: 1,
        marginVertical: 10
    },
    ddListStyle_Months:
    {
        borderTopLeftRadius: 0, borderTopRightRadius: 0,
        borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
        backgroundColor: 'white', borderBottomColor: '#3a3b40', borderLeftColor: 'white', borderRightColor: 'white', borderTopColor: '#3a3b40'
    },
    ddListContainer_Years:
    {
        height: 50,
        width: 110,
        flex: 1,
        marginVertical: 10
    },
    ddListStyle_Years:
    {
        borderTopLeftRadius: 20, borderTopRightRadius: 0,
        borderBottomLeftRadius: 20, borderBottomRightRadius: 0,
        backgroundColor: 'white', borderColor: '#3a3b40'
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

    //Headings:
    heading: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10
    },
    notesHeading:
    {
        fontWeight: 'bold',
        flex: 1,
        alignSelf: 'flex-start',
        marginTop: 27,
        width: Dimensions.get('window').width * 0.3,
    },
    fieldText: {
        alignSelf: 'center',
        fontWeight: 'bold',
        width: Dimensions.get('window').width * 0.3,
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