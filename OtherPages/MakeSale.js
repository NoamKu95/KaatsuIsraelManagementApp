//Outer Imports:
import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, TextInput, StatusBar } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';
import { CheckBox } from 'react-native-elements'
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import { Dimensions } from 'react-native';

//Inner Imports:
import Header from '../Components/Header';
import AdressPopup from '../PopUps/AdressPopup';




export default class MakeSale extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

            //Which customer type:
            isSaleForCustomer: this.props.route.params.buyer != 'distributer' ? true : false,
            isCustomerInSystem: this.props.route.params.isInSystem != undefined ? true : false,

            //Details on the product:
            productToPurchase: null,
            productSize: null,
            productAmount: '1',

            allProducts: [],        //Data on all products from the DB - [{pID, pName, pSize}]

            //Lists for DDs:
            ddDistributers: [],     // [{label, value}]
            ddCustomers: [],        // [{label, value}]
            ddProducts: [],         // [{label, value}]
            ddSizes: [
                { label: 'S', value: 'S', }, //placeholder to be replaced
                { label: 'M', value: 'M', },
                { label: 'L', value: 'L', },
                { label: 'XL', value: 'XL', }
            ],

            //Details on the buyer:
            phone: 'ימולא אוטומטית',
            email: 'ימולא אוטומטית',
            adress: 'ימולא אוטומטית',
            shippingAdress: null,
            deliveryNotes: null,
            payMethod: null,
            totalToPay: 'ימולא אוטומטית',


            //The ID of a buyer in the system (customer/distributer)
            distributerBuyerID: '',
            customerBuyerID: '',

            //The ID of the seller:
            sellerID: '',               //Identifier
            isSellerManager: false,

            buyerDetailsDeme: null,


            //Details on customer NOT in the system:
            newCustFirstName: null,           //first name
            newCustLastName: null,            //last name
            newCustGender: '',
            checkedM: false,                //male
            checkedF: false,                //female
            newCustPhone: null,
            newCustEmail: null,

            newCustAdressAPI: '',           // object of adress
            newCustAppartment: '',
            newCustHouse: '',
            newCustStreet: '',
            newCustCity: '',
            newCustHealth: null,              //health status

            newCustBirthdate_DAY: null,
            newCustBirthdate_MONTH: null,
            newCustBirthdate_YEAR: null,



            //Alerts:
            showAlert: false,
            alertMessage: '',
            alertTitle: '',

            //DD Lists:
            ddListYears: [],            //1935-2003
            ddListMonths: [],           //1-12
            ddListDays: [],             //1-31
            healthStatusesList: [],

            //Loading Animation:
            spinner: false,
        }
    }




    //Determine the type of the buyer and fetch the relevant lists accordingly:
    componentDidMount() {

        this.getAllFetch();

        //-------------------------------------------------
        //prepare the numbers for the years-drop-down-list:
        let endyear = new Date().getFullYear() - 19;
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


    getAllFetch = async () => {

        await this.getFromAS();

        await this.fetchProducts();           // to populate the dd list
        await this.fetchHealthStatuses();     // to populate the dd list


        if (!this.state.isSaleForCustomer) {

            await this.fetchDistributers();
        }
        else {

            if (this.state.isCustomerInSystem) {

                await this.fetchCustomers();
            }
        }
    }


    //Get user info from the AS:
    getFromAS = async () => {

        //Get the ID of the SELLER from the Async Storage: (to know if he's a MANAGER)
        try {

            let jsonValue = await AsyncStorage.getItem('userDetails');

            if (jsonValue != null) {
                let value = JSON.parse(jsonValue);

                if (value.d_Status == 'מנהל') {

                    await this.setState({ sellerID: value.d_PersonalCode, isSellerManager: true })

                }
                else {

                    await this.setState({ sellerID: value.d_PersonalCode })
                }
            }

        } catch (e) {

            this.setState({
                showAlert: true,
                alertMessage: 'התרחשה תקלה בשליפת פרטי המוכר מהאחסון המקומי',
                alertTitle: 'שגיאה'
            })
        }
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

                        //result = a list of all the names of the health statuses

                        let ddList = [];
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


    //Get all the DISTRIBUTERS from the DB:
    fetchDistributers = () => {

        const apiUrl = 'https://proj.ruppin.ac.il/bgroup12/prod/api/distributers';
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
                        //result = a list of all the distributers

                        let ddList = [];
                        let details = '';

                        result.forEach(element => { //take each fullName and add to temp arr in the format of a dropdown list
                            details = `${element.d_FirstName}` + " " + `${element.d_LastName}` + " (" + `${element.d_PhoneNumber}` + ")";
                            ddList.push({ label: details, value: `${element.d_PersonalCode}` });
                        });

                        this.setState({ ddDistributers: ddList });
                    }
                    else if (result == 404) {

                        this.setState({
                            alertMessage: 'לא נמצאו מפיצים במסד הנתונים',
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


    //Get all the CUSTOMERS from the DB:
    fetchCustomers = () => {

        let apiUrl = '';
        if (this.state.isSellerManager) { // manager can sell to all customers

            apiUrl = 'https://proj.ruppin.ac.il/bgroup12/prod/api/customers';
        }
        else { // distributer can sell only to his customers

            let dId = parseInt(this.state.sellerID);
            apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/mycustomers/${dId}`;

        }
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
                        //result = a list of all the customers

                        let ddList = [];
                        let details = '';
                        result.forEach(element => {
                            details = `${element.c_FirstName}` + " " + `${element.c_LastName}` + " - " + `${element.c_PhoneNumber}`; //take each full name and add to temp arr in the format of a dropdown list
                            element.c_StatusName == 'מפיץ לא פעיל' ? details += ` (ל"פ)` : "";
                            ddList.push({ label: details, value: `${element.c_PersonalCode}` });
                        });

                        this.setState({ ddCustomers: ddList });

                    }
                    else if (result == 404) {

                        this.setState({
                            alertMessage: 'לא נמצאו לקוחות במסד הנתונים',
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


    //Get all the PRODUCTS from the DB:
    fetchProducts = () => {

        const apiUrl = 'https://proj.ruppin.ac.il/bgroup12/prod/api/product';
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
                        //result = a list of all the products

                        let allInfoList = [];
                        let ddList = [];
                        result.forEach(element => {

                            if (element.p_IsActive) // only if the product wasn't "deleted"
                            {
                                ddList.push({ label: `${element.p_Name}`, value: `${element.p_Name}` }); //take each product name and add to a temp arr in the format of a dropdown list
                            }

                            let product = {
                                pID: element.p_ID,
                                pName: element.p_Name,
                                pSize: element.p_Size,
                                pRowVersion: element.RowVersion
                            }
                            allInfoList.push(product);
                        });



                        //get a unique array of products (because we have 4 of each name e.g. "סט קומפלט")
                        let uniqueProdsArr = [];
                        ddList.forEach(obj => {
                            if (!uniqueProdsArr.some(o => o.label === obj.label)) { //check if in the unique arr we already have this product name or not

                                uniqueProdsArr.push({ ...obj }); // add the product to the unique arr cuz its not in there yet
                            }
                        });


                        //insert the unique array to the state:
                        this.setState({
                            ddProducts: uniqueProdsArr, // for products dd list
                            allProducts: allInfoList    // arr of all products [{product},{product}]
                        });

                    }
                    else if (result == 404) {

                        this.setState({
                            alertMessage: 'לא נמצאו מוצרים במסד הנתונים',
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




    //Choose the buyer and put his ID in a state:
    chooseSpecificPerson = async (item) => {

        this.setState({ buyerDetailsDeme: item.value });

        if (this.state.isSaleForCustomer == true) {

            await this.setState({ customerBuyerID: item.value });
        }
        else {

            await this.setState({ distributerBuyerID: item.value });
        }

        this.getDataOfBuyer();
    }


    //Get the details on the person who's buying:
    getDataOfBuyer = () => {

        let typeOfBuyer = this.props.route.params.buyer;
        let apiUrl;
        let id;

        if (typeOfBuyer == 'distributer') {
            id = parseInt(this.state.distributerBuyerID);

            apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/distributer/${id}`;
        }
        else {
            id = parseInt(this.state.customerBuyerID);
            apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/customer/${id}`;

        }
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

                        if (typeOfBuyer == 'distributer') {

                            this.setState({
                                phone: result.d_PhoneNumber,
                                email: result.d_Email,
                                adress: result.d_StreetName + " " + result.d_HouseNumber + ", " + result.d_CityName + " (דירה " + result.d_AppartmentNumber + ")"
                            })
                        }
                        else { // buyer is customer

                            this.setState({
                                phone: result.c_PhoneNumber,
                                email: result.c_Email,
                                adress: result.c_StreetName + " " + result.c_HouseNumber + ", " + result.c_CityName + " (דירה " + result.c_AppartmentNumber + ")"

                            })
                        }
                    }
                    else if (result == 404) {

                        this.setState({
                            alertMessage: 'לא נמצאה התאמה במסד הנתונים לנתוני הרוכש',
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
                            alertMessage: 'התרחשה תקלה בשליפת נתוני האדם שנבחר ממסד הנתונים. נא לנסות שנית',
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


    updateDesiredProduct = async (item) => {

        await this.setState({ productToPurchase: item.value });
        this.getTotalPay();
    }


    //Get from the DB the sizes that exist from this product:
    fetchAvailableSizes = (item) => {

        this.setState({ productSize: null });

        const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/getvailablesizes/${item.label}`;
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
                    res.status == 200 ?
                        res.json()
                        :
                        null;
            })
            .then(
                (result) => {

                    if (result != null && result != 404) {

                        //result = array of sizes available for this type of product

                        let ddList = []; // will hold the sizes for the dropdown list
                        result.forEach(size => {

                            ddList.push({ value: `${size}`, label: `${size}` });
                        });

                        this.setState({ ddSizes: ddList });
                    }
                    else if (result == 404) {
                        this.setState({
                            alertMessage: 'לא קיימת מידה זו מהמוצר הנבחר',
                            alertTitle: 'שגיאה',
                            showAlert: true
                        });
                    }
                    else {

                        this.setState({
                            alertMessage: 'התרחשה תקלה בשליפת המחיר הסופי של המכירה ממסד הנתונים. נא לנסות שנית',
                            alertTitle: 'שגיאה',
                            showAlert: true
                        });
                    }
                },
                (error) => {

                    this.setState({
                        alertMessage: 'התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית             ' + error,
                        alertTitle: 'שגיאה',
                        showAlert: true
                    });
                }
            );
    }


    updateDesiredSize = async (item) => {

        await this.setState({ productSize: item.value });
        this.getTotalPay();
    }


    updateDesiredAmount = async (item) => {

        await this.setState({ productAmount: item.value });
        this.getTotalPay();
    }


    //Get how much the buyer needs to pay:
    getTotalPay = () => {

        //We can calculate total to pay only after we have both product ID & amount & size
        if (this.state.productToPurchase != null && this.state.productSize != null && this.state.productAmount != null) {

            let amount = parseInt(this.state.productAmount);

            const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/gettotalofpurchase/${this.state.productToPurchase}/${this.state.productSize}/${amount}`;
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
                        res.status == 200 ?
                            res.json()
                            :
                            res.status == 500 ?
                                500
                                :
                                null;
                })
                .then(
                    (result) => {

                        if (result != null && result != 404 && result != 500) {

                            //result = the price the buyer needs to pay (without any discount)
                            this.setState({ totalToPay: `${result}` });
                        }
                        else if (result == 404) {

                            this.setState({
                                alertMessage: 'לא נמצא במסד הנתונים מוצר זה במידה זו',
                                alertTitle: 'אופס!',
                                showAlert: true
                            });
                        }
                        else if (result == 500) {

                            this.setState({
                                alertMessage: 'התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית',
                                alertTitle: 'שגיאה',
                                showAlert: true
                            });
                        }
                        else {

                            this.setState({
                                alertMessage: 'התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית',
                                alertTitle: 'שגיאה',
                                showAlert: true
                            });
                        }
                    },
                    (error) => {

                        this.setState({
                            alertMessage: 'התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית             ' + error,
                            alertTitle: 'שגיאה',
                            showAlert: true
                        });
                    }
                );
        }
    }


    //Get the full adress from the popup:
    getDataFromChild = (adressObj) => {

        this.setState({
            newCustAdressAPI: adressObj.fullAdress,
            newCustCity: adressObj.city,
            newCustStreet: adressObj.street,
            newCustAppartment: adressObj.appartmentNum,
            newCustHouse: adressObj.houseNum
        });
    }


    //Check each of the fields on the page:
    checkInputs = () => {

        let specificCheck = false;

        //Checks we need to make when the buyer is a CUSTOMER NOT IN SYSTEM:
        if (this.state.isSaleForCustomer && !this.state.isCustomerInSystem) {

            if (this.state.newCustFirstName == null || this.state.newCustLastName == null || this.state.newCustFirstName == '' || this.state.newCustLastName == '') {

                this.setState({
                    showAlert: true,
                    alertTitle: 'שגיאה',
                    alertMessage: 'יש להזין שם מלא'
                })
            }
            else {

                if (this.state.newCustBirthdate_DAY == null || this.state.newCustBirthdate_MONTH == null || this.state.newCustBirthdate_YEAR == null) {

                    this.setState({
                        showAlert: true,
                        alertTitle: 'שגיאה',
                        alertMessage: 'יש להזין תאריך לידה מלא'
                    })
                }
                else {

                    if (this.state.newCustGender == '') {

                        this.setState({
                            showAlert: true,
                            alertTitle: 'שגיאה',
                            alertMessage: 'יש לבחור מגדר'
                        })
                    }
                    else {

                        if (this.state.newCustPhone == null || this.state.newCustPhone == '') {
                            this.setState({
                                showAlert: true,
                                alertTitle: 'שגיאה',
                                alertMessage: 'יש להזין מספר טלפון'
                            })
                        }
                        else {

                            if (this.state.newCustPhone.length != 10) {

                                this.setState({
                                    showAlert: true,
                                    alertTitle: 'שגיאה',
                                    alertMessage: 'יש להזין מספר טלפון תקני'
                                })
                            }
                            else {

                                if (this.state.newCustEmail == null) {

                                    this.setState({
                                        showAlert: true,
                                        alertTitle: 'שגיאה',
                                        alertMessage: 'יש להזין כתובת אימייל'
                                    })
                                }
                                else {

                                    let reg = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
                                    let email = this.state.newCustEmail;
                                    if (reg.test(email) === false) {

                                        this.setState({
                                            showAlert: true,
                                            alertTitle: 'שגיאה',
                                            alertMessage: 'כתובת המייל שהוזנה אינה תקינה'
                                        })
                                    }
                                    else {

                                        if (this.state.newCustAdressAPI == '') {

                                            this.setState({
                                                showAlert: true,
                                                alertTitle: 'שגיאה',
                                                alertMessage: 'יש להזין כתובת מגורים'
                                            })
                                        }
                                        else {

                                            if (this.state.newCustHealth == null) {

                                                this.setState({
                                                    showAlert: true,
                                                    alertTitle: 'שגיאה',
                                                    alertMessage: 'יש להזין מצב בריאותי'
                                                })
                                            }
                                            else {

                                                specificCheck = true;
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

        //Checks we need to make when the buyer is a DISTRIBUTER or a CUSTOMER IN THE SYSTEM:
        if ((this.state.isSaleForCustomer && this.state.isCustomerInSystem) || !this.state.isSaleForCustomer) {

            if (this.state.distributerBuyerID == '' && this.state.customerBuyerID == '') {

                this.setState({
                    showAlert: true,
                    alertTitle: 'שגיאה',
                    alertMessage: 'יש לבחור קונה מהרשימה'
                })
            }
            else {

                if (this.state.phone == '' || this.state.email == '' || this.state.adress == '' || this.state.phone == 'ימולא אוטומטית' || this.state.email == 'ימולא אוטומטית' || this.state.adress == 'ימולא אוטומטית') {

                    this.setState({
                        showAlert: true,
                        alertTitle: 'שגיאה',
                        alertMessage: 'מילוי הנתונים האוטומטי נכשל. יש לבחור בשנית קונה מהרשימה'
                    })
                }
                else {

                    specificCheck = true;
                }
            }
        }



        //Checks we need to make for ALL TYPES of buyers:
        if (specificCheck) {

            if (this.state.productToPurchase == null) {

                this.setState({
                    showAlert: true,
                    alertTitle: 'שגיאה',
                    alertMessage: 'יש להזין מוצר'
                })
            }
            else {

                if (this.state.productSize == null) {

                    this.setState({
                        showAlert: true,
                        alertTitle: 'שגיאה',
                        alertMessage: 'יש להזין מידה'
                    })
                }
                else {

                    if (this.state.productAmount == null) {

                        this.setState({
                            showAlert: true,
                            alertTitle: 'שגיאה',
                            alertMessage: 'יש להזין כמות רצויה'
                        })
                    }
                    else {

                        if (this.state.payMethod == null) {

                            this.setState({
                                showAlert: true,
                                alertTitle: 'שגיאה',
                                alertMessage: 'יש להזין אופן תשלום'
                            })
                        }
                        else {

                            if (this.state.isSellerManager) {

                                if (this.state.totalToPay == 'ימולא אוטומטית' || this.state.totalToPay == '') {

                                    this.setState({
                                        showAlert: true,
                                        alertTitle: 'שגיאה',
                                        alertMessage: 'יש להזין סך הכל לתשלום'
                                    })
                                }
                                else {
                                    this.placePurchace();
                                }
                            }
                            else {
                                this.placePurchace();
                            }
                        }
                    }
                }
            }
        }
    }


    //Send all purchase details to the DB:
    placePurchace = async () => {

        this.setState({ spinner: true });

        //Get the ID of the Product & the Row Version of the product:
        let pID = '';
        let pRowVersion = '';
        let tempStateArr = this.state.allProducts;
        for (let i = 0; i < tempStateArr.length; i++) {

            //both the Name & the Size of what we chose in dd list need to match the product obj
            if (tempStateArr[i].pName == this.state.productToPurchase && tempStateArr[i].pSize == this.state.productSize) {
                pID = tempStateArr[i].pID;
                pRowVersion = tempStateArr[i].pRowVersion;
                break;
            }
        }

        if (pID == '' && pRowVersion == '') { // there is no product in the desired size in the db

            this.setState({
                spinner: false,

                alertMessage: 'לא קיימת המידה הרצוייה מהמוצר הנבחר',
                alertTitle: 'שגיאה',
                showAlert: true
            })
        }
        else {

            //Get a Delivery Adress:
            let dAdress = '';
            if (this.state.shippingAdress == null || this.state.shippingAdress == '') { //Did we insert a different delivery adress?

                if (this.state.adress == 'ימולא אוטומטית') {
                    //Sale is to a passerby + he didn't give delivery adrees => we take his home adress as delivery adress
                    dAdress = `${this.state.newCustStreet} ${this.state.newCustHouse}, דירה ${this.state.newCustAppartment}, ${this.state.newCustCity}`;
                }
                else {
                    //We chose a customer from the dd list and it's details were automatically filled
                    dAdress = this.state.adress;
                }
            }
            else { //We did get a specific delivery adress
                dAdress = this.state.shippingAdress;
            }


            let newPurchase;
            //Build the obj to send:
            if (this.state.isSaleForCustomer && !this.state.isCustomerInSystem) { // to Customer NOT in system

                //Prepare fields to use:
                let birthdate = new Date(this.state.newCustBirthdate_YEAR + "/" + this.state.newCustBirthdate_MONTH + "/" + this.state.newCustBirthdate_DAY);

                //Create SaleOptionsDto:
                newPurchase = {
                    so_DeliveryAdress: dAdress,
                    so_TotalToPay: parseInt(this.state.totalToPay),
                    so_PayType: this.state.payMethod,
                    so_DeliveryNotes: this.state.deliveryNotes,
                    so_Quantity: parseInt(this.state.productAmount),
                    so_ProductID: parseInt(pID),
                    so_Seller: parseInt(this.state.sellerID),
                    so_isToCustomer: true,
                    so_Buyer: -1,
                    ProductRowVersion: pRowVersion,

                    //Fields for new customer:
                    so_Email: this.state.newCustEmail,
                    so_FirstName: this.state.newCustFirstName,
                    so_LastName: this.state.newCustLastName,
                    so_BirthDate: birthdate,
                    so_PhoneNumber: this.state.newCustPhone,
                    so_Gender: this.state.checkedF ? 'נ' : 'ז',
                    so_AppartmentNumber: this.state.newCustAppartment,
                    so_HouseNumber: this.state.newCustHouse,
                    so_StreetName: this.state.newCustStreet,
                    so_CityName: this.state.newCustCity,
                    so_IsInSystem: false,
                    so_AddedByDistributer: parseInt(this.state.sellerID),
                    so_HealthStatusName: this.state.newCustHealth
                }
            }
            else { // to customer or distributer

                //Get the ID of the BUYER:
                var buyerID = '';
                if (!this.state.isSaleForCustomer) { // buyer = distributer
                    buyerID = this.state.distributerBuyerID
                }
                else {  // buyer = customer in system
                    buyerID = this.state.customerBuyerID
                }

                newPurchase = {

                    so_DeliveryAdress: dAdress,
                    so_TotalToPay: parseInt(this.state.totalToPay),
                    so_PayType: this.state.payMethod,
                    so_DeliveryNotes: this.state.deliveryNotes,
                    so_Quantity: parseInt(this.state.productAmount),
                    so_ProductID: parseInt(pID),
                    so_Seller: parseInt(this.state.sellerID),
                    so_Buyer: parseInt(buyerID),
                    so_isToCustomer: this.state.isSaleForCustomer ? true : false,
                    ProductRowVersion: pRowVersion
                }
            }

            //Send the new sale to the DB:
            const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/addnewsale`;
            fetch(apiUrl,
                {
                    method: 'POST',
                    body: JSON.stringify(newPurchase),
                    headers: new Headers({
                        'Content-Type': 'application/json; charset=UTF-8',
                        'Accept': 'application/json; chartset=UTF-8',
                    })
                })
                .then(res => {

                    return res.status == 200 ?
                        res.json()
                        :
                        res.status == 300 ?
                            300
                            :
                            res.statis == 400 ?
                                400
                                :
                                res.status == 409 ?
                                    409
                                    :
                                    res.status == 412 ?
                                        412
                                        :
                                        res.status == 417 ?
                                            417
                                            :
                                            res.status == 500 ?
                                                500
                                                :
                                                res.status == 502 ?
                                                    502
                                                    :
                                                    null;
                })
                .then(
                    (result) => {

                        if (result != null && result != 300 && result != 400 && result != 409 && result != 412 && result != 417 && result != 500 && result != 502) {

                            this.setState({
                                spinner: false,

                                alertMessage: result,
                                alertTitle: 'פעולה בוצעה בהצלחה',
                                showAlert: true,
                            })

                            var timeout = setTimeout(() => {

                                this.setState({
                                    //Clear fields:
                                    phone: 'ימולא אוטומטית',
                                    email: 'ימולא אוטומטית',
                                    adress: 'ימולא אוטומטית',
                                    shippingAdress: null,
                                    deliveryNotes: null,
                                    payMethod: null,
                                    totalToPay: 'ימולא אוטומטית',
                                    productToPurchase: null,
                                    productSize: null,
                                    productAmount: '1',
                                    newCustFirstName: null,           //first name
                                    newCustLastName: null,            //last name
                                    newCustGender: '',
                                    newCustPhone: null,
                                    newCustEmail: null,
                                    newCustAdressAPI: '',           // object of adress
                                    newCustAppartment: '',
                                    newCustHouse: '',
                                    newCustStreet: '',
                                    newCustCity: '',
                                    newCustHealth: null,              //health status
                                    checkedM: false,                //male
                                    checkedF: false,                //female
                                    newCustBirthdate_DAY: null,
                                    newCustBirthdate_MONTH: null,
                                    newCustBirthdate_YEAR: null,
                                    buyerDetailsDeme: null,
                                })

                            }, 1500)

                        }
                        else if (result == 300) {

                            this.setState({
                                spinner: false,

                                alertMessage: 'המכירה בוצעה בהצלחה אך שליחת אימייל סיכום רכישה ללקוח נכשלה',
                                alertTitle: 'אופס!',
                                showAlert: true
                            })
                        }
                        else if (result == 400) {

                            this.setState({
                                spinner: false,

                                alertMessage: 'מישהו נוסף מבצע עדכון מלאי במקביל. נא לרענן את העמוד ולנסות שנית',
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
                        else if (result == 412) {

                            this.setState({
                                spinner: false,

                                alertMessage: 'אזל המלאי ממוצר זה במידה זו',
                                alertTitle: 'אופס!',
                                showAlert: true
                            })
                        }
                        else if (result == 417) {

                            this.setState({
                                spinner: false,

                                alertMessage: 'המכירה בוצעה בהצלחה אך שליחת אימייל סיכום רכישה ללקוח ולמנהל נכשלה',
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
                        else if (result == 502) {

                            this.setState({
                                spinner: false,

                                alertMessage: 'מכירה בוצעה בהצלחה אך שליחת אימייל סיכום רכישה למנהל נכשלה',
                                alertTitle: 'אופס!',
                                showAlert: true
                            })
                        }
                        else { // status 500

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

                        <Text style={styles.heading}>ביצוע מכירה</Text>

                        <Text style={styles.secondaryHeading}>
                            {
                                !this.state.isSaleForCustomer ?
                                    'למפיץ של החברה'
                                    :
                                    this.state.isCustomerInSystem ?
                                        'ללקוח קיים במערכת'
                                        :
                                        'ללקוח שאינו במערכת'
                            }
                        </Text>



                        <View style={styles.viewContainer}>

                            {
                                this.state.isSaleForCustomer && !this.state.isCustomerInSystem ?
                                    <></>
                                    :
                                    <Text style={styles.fieldText}>
                                        {this.state.isSaleForCustomer ? 'שם לקוח:' : 'שם מפיץ:'}
                                    </Text>
                            }

                            {/* Check who's gonna be the buyer: */}
                            {
                                !this.state.isSaleForCustomer || this.state.isCustomerInSystem ?

                                    //if you sale for customer/distributer that is in the system:
                                    <DropDownPicker
                                        //Searchable dropdown list:
                                        searchableStyle={styles.searchInDDListStyle}
                                        searchablePlaceholderTextColor="silver"
                                        searchable={true}
                                        searchablePlaceholder="הקלד לחיפוש.."
                                        searchableError={() => <Text>לא נמצאו תוצאות</Text>}

                                        placeholder="בחר..."
                                        defaultValue={this.state.buyerDetailsDeme}
                                        items={this.state.isSaleForCustomer ? this.state.ddCustomers : this.state.ddDistributers}
                                        containerStyle={styles.ddListContainer}
                                        style={styles.ddGeneralStyle}
                                        itemStyle={{ justifyContent: 'flex-start' }}
                                        dropDownStyle={styles.dropDownNamesStyle}
                                        onChangeItem={item => this.chooseSpecificPerson(item)}
                                    />
                                    :
                                    //If the sale isn't for a customer in the system:
                                    <></>
                            }
                        </View>


                        {
                            this.state.isSaleForCustomer && !this.state.isCustomerInSystem ?
                                <View style={styles.viewContainer}>
                                    <Text style={styles.fieldText}>שם פרטי:</Text>
                                    <TextInput
                                        onChangeText={(e) => this.setState({ newCustFirstName: e })}
                                        maxLength={40}
                                        style={styles.txtInput}
                                        defaultValue={this.state.newCustFirstName}
                                    >
                                    </TextInput>
                                </View>
                                :
                                <></>
                        }

                        {
                            this.state.isSaleForCustomer && !this.state.isCustomerInSystem ?
                                <View style={styles.viewContainer}>
                                    <Text style={styles.fieldText}>שם משפחה:</Text>
                                    <TextInput
                                        onChangeText={(e) => this.setState({ newCustLastName: e })}
                                        maxLength={40}
                                        style={styles.txtInput}
                                        defaultValue={this.state.newCustLastName}
                                    >
                                    </TextInput>
                                </View>
                                :
                                <></>
                        }

                        {/* Birthdate of the customer who isn't in the system */}
                        {
                            this.state.isSaleForCustomer && !this.state.isCustomerInSystem ?
                                <View style={styles.viewContainer}>
                                    <Text style={styles.fieldText}>ת. לידה:</Text>
                                    <DropDownPicker
                                        items={this.state.ddListYears}
                                        placeholder="שנה"
                                        defaultValue={this.state.newCustBirthdate_YEAR}
                                        containerStyle={styles.yearsDateContainer}
                                        itemStyle={{ justifyContent: 'flex-start' }}
                                        style={styles.yearsDateStyle}
                                        dropDownStyle={styles.dropDownStyle}
                                        onChangeItem={item => this.setState({ newCustBirthdate_YEAR: item.value })}
                                    />

                                    <DropDownPicker
                                        items={this.state.ddListMonths}
                                        placeholder="חודש"
                                        defaultValue={this.state.newCustBirthdate_MONTH}
                                        containerStyle={styles.monthsDateContainer}
                                        itemStyle={{ justifyContent: 'flex-start' }}
                                        style={styles.monthsDateStyle}
                                        dropDownStyle={styles.dropDownStyle}
                                        onChangeItem={item => this.setState({ newCustBirthdate_MONTH: item.value })}
                                    />

                                    <DropDownPicker
                                        items={this.state.ddListDays}
                                        placeholder="יום"
                                        defaultValue={this.state.newCustBirthdate_DAY}
                                        containerStyle={styles.daysDateContainer}
                                        itemStyle={{ justifyContent: 'flex-start' }}
                                        style={styles.daysDateStyle}
                                        dropDownStyle={styles.dropDownStyle}
                                        onChangeItem={item => this.setState({ newCustBirthdate_DAY: item.value })}
                                    />
                                </View>
                                :
                                <></>
                        }


                        {/* Gender of the customer who isn't in the system */}
                        {
                            this.state.isSaleForCustomer && !this.state.isCustomerInSystem ?
                                <View style={styles.viewContainer}>

                                    <Text style={styles.fieldText}>מגדר:</Text>

                                    <CheckBox
                                        onPress={
                                            () => this.state.checkedM ?
                                                this.setState({ checkedM: false, checkedF: true, newCustGender: 'נ' })
                                                :
                                                this.setState({ checkedM: true, checkedF: false, newCustGender: 'ז' })
                                        }
                                        center
                                        title='זכר'
                                        checked={this.state.checkedM}
                                        checkedColor='#e95344'
                                        containerStyle={styles.chbContainerStyle}
                                        textStyle={{ color: 'black' }}
                                    />

                                    <CheckBox
                                        onPress={
                                            () => (this.state.checkedF ?
                                                this.setState({ checkedF: false, checkedM: true, newCustGender: 'ז' })
                                                :
                                                this.setState({ checkedF: true, checkedM: false, newCustGender: 'נ' }))
                                        }
                                        center
                                        title='נקבה'
                                        checked={this.state.checkedF}
                                        checkedColor='#e95344'
                                        containerStyle={styles.chbContainerStyle}
                                        textStyle={{ color: 'black' }}
                                    />
                                </View>
                                :
                                <></>
                        }


                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>טלפון:</Text>

                            {
                                this.state.isSaleForCustomer && !this.state.isCustomerInSystem ?
                                    <TextInput
                                        onChangeText={(e) => this.setState({ newCustPhone: e })}
                                        maxLength={10} keyboardType='phone-pad' style={styles.txtInput}
                                        defaultValue={this.state.newCustPhone}
                                    >
                                    </TextInput>
                                    :
                                    <TextInput
                                        defaultValue={this.state.phone}
                                        editable={false}
                                        style={styles.txtInput}
                                    >
                                    </TextInput>
                            }
                        </View>

                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>אימייל:</Text>

                            {
                                this.state.isSaleForCustomer && !this.state.isCustomerInSystem ?
                                    <TextInput
                                        onChangeText={(e) => this.setState({ newCustEmail: e })}
                                        maxLength={40} keyboardType='email-address' style={styles.txtInput}
                                        defaultValue={this.state.newCustEmail}
                                    >
                                    </TextInput>
                                    :
                                    <TextInput
                                        defaultValue={this.state.email}
                                        editable={false} maxLength={40}
                                        style={styles.txtInput}
                                    >
                                    </TextInput>
                            }
                        </View>

                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>כתובת:</Text>

                            {
                                this.state.isSaleForCustomer && !this.state.isCustomerInSystem ?
                                    <AdressPopup navigation={this.props.navigation} sendDataFromChild={this.getDataFromChild} placeholder={'none'} />
                                    :
                                    <TextInput
                                        defaultValue={this.state.adress}
                                        editable={false}
                                        multiline={true}
                                        numberOfLines={this.state.adress.length > 27 ? 2 : 1}
                                        style={this.state.adress.length > 27 ? styles.longTextInput : styles.txtInput}
                                    >
                                    </TextInput>
                            }
                        </View>


                        {/* Health status of the customer who isn't in the system */}
                        {
                            this.state.isSaleForCustomer && !this.state.isCustomerInSystem ?
                                <View style={styles.viewContainer}>
                                    <Text style={styles.fieldText}>מצב בריאותי:</Text>
                                    <DropDownPicker
                                        placeholder="בחר.."
                                        defaultValue={this.state.newCustHealth}
                                        items={this.state.healthStatusesList}
                                        //containerStyle={{ height: 50, minWidth: 200, maxWidth: 350, flex: 1, marginVertical: 10 }}
                                        containerStyle={styles.ddListContainer}
                                        itemStyle={{ justifyContent: 'flex-start' }}
                                        style={styles.ddGeneralStyle}
                                        dropDownStyle={styles.dropDownStyle}
                                        onChangeItem={item => this.setState({ newCustHealth: item.label })}
                                    />
                                </View>
                                :
                                <></>
                        }


                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>מוצר:</Text>
                            <DropDownPicker
                                items={this.state.ddProducts}
                                placeholder="בחר.."
                                defaultValue={this.state.productToPurchase}
                                containerStyle={styles.ddListContainer}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                style={styles.ddGeneralStyle}
                                dropDownStyle={styles.dropDownStyle}
                                onChangeItem={item => this.updateDesiredProduct(item).then(this.fetchAvailableSizes(item))}
                            />
                        </View>


                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>מידה:</Text>
                            <DropDownPicker
                                items={this.state.ddSizes}
                                placeholder="בחר.."
                                defaultValue={this.state.productSize}
                                containerStyle={styles.ddListContainer}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                style={styles.ddGeneralStyle}
                                dropDownStyle={styles.dropDownStyle}
                                onChangeItem={item => this.updateDesiredSize(item)}
                            />
                        </View>

                        {
                            this.state.isSellerManager ?
                                <View style={styles.viewContainer}>
                                    <Text style={styles.fieldText}>כמות:</Text>
                                    <DropDownPicker
                                        items={[
                                            { label: '1', value: '1', },
                                            { label: '2', value: '2', },
                                            { label: '3', value: '3', },
                                            { label: '4', value: '4', },
                                            { label: '5', value: '5', },
                                        ]}
                                        placeholder="בחר.."
                                        defaultValue={this.state.productAmount}
                                        containerStyle={styles.ddListContainer}
                                        itemStyle={{ justifyContent: 'flex-start' }}
                                        style={styles.ddGeneralStyle}
                                        dropDownStyle={styles.dropDownStyle}
                                        onChangeItem={item => this.updateDesiredAmount(item)}
                                    />
                                </View>
                                :
                                <></>
                        }


                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>אופן תשלום:</Text>
                            <DropDownPicker
                                items={[
                                    { label: 'מזומן', value: 'מזומן', },
                                    { label: 'אשראי', value: 'אשראי', },
                                    { label: 'העברה בנקאית', value: 'העברה בנקאית', },
                                    { label: 'העברה בביט', value: 'העברה בביט', },
                                    { label: 'צק מזומן', value: 'צק מזומן', },
                                ]}
                                placeholder="בחר.."
                                defaultValue={this.state.payMethod}
                                containerStyle={styles.ddListContainer}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                style={styles.ddGeneralStyle}
                                dropDownStyle={styles.dropDownStyle}
                                onChangeItem={item => this.setState({ payMethod: item.value })}
                            />
                        </View>

                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>כתובת למשלוח:</Text>
                            <TextInput
                                defaultValue={this.state.shippingAdress}
                                onChangeText={(e) => this.setState({ shippingAdress: e })}
                                maxLength={40} style={styles.txtInput}
                            >
                            </TextInput>
                        </View>

                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>הערות למשלוח:</Text>
                            <TextInput
                                onChangeText={(e) => this.setState({ deliveryNotes: e })}
                                maxLength={30} style={styles.txtInput}
                                defaultValue={this.state.deliveryNotes}
                            >
                            </TextInput>
                        </View>


                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>סה"כ לתשלום:</Text>
                            <TextInput
                                defaultValue={this.state.totalToPay}
                                onChangeText={(e) => this.setState({ totalToPay: e })}
                                style={styles.txtInput}
                                keyboardType='number-pad'
                                editable={this.state.isSellerManager ? true : false} //manager can give discounts
                            >
                            </TextInput>
                        </View>

                        <TouchableOpacity
                            onPress={this.checkInputs}
                            style={styles.savebutton}>
                            <Text style={styles.saveButtonText}>אישור מכירה</Text>
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
    chbContainerStyle: {
        backgroundColor: 'white', borderWidth: 0
    },


    //Headings:
    heading: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10
    },
    secondaryHeading: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16
    },
    fieldText: {
        alignSelf: 'center',
        fontWeight: 'bold',
        width: Dimensions.get('window').width * 0.3,
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
    longTextInput: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 15,
        width: Dimensions.get('window').width * 0.6,
        height: 65,
        backgroundColor: 'white',
        borderRadius: 20,
        borderColor: '#3a3b40',
        borderWidth: 1,
        flex: 1,
        textAlign: 'right'
    },

    //Dropdown Lists:
    dropDownStyle: {
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
        backgroundColor: '#f8f8f8', borderColor: '#3a3b40',
        height: 100,
        width: Dimensions.get('window').width * 0.6,
    },
    ddGeneralStyle: {
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
        borderColor: '#3a3b40',
    },
    ddListContainer: {
        height: 50,
        minWidth: 190,
        flex: 1,
        marginVertical: 10,
    },


    //Searchable Lists:
    searchInDDListStyle: {
        backgroundColor: '#fafafa',
        borderColor: 'lightgrey',
        textAlign: 'right',
        marginBottom: 7, // paddingVertical: 10,
        paddingHorizontal: 20,
        height: 30,
        borderColor: '#3a3b40',
    },


    //Proffessional Backgrounds DD Lists:
    dropDownNamesStyle: {
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
        backgroundColor: '#f8f8f8', borderColor: '#3a3b40',
        height: 200
    },


    //Birthdate Dropdown Lists:
    daysDateContainer:
    {
        height: 50,
        width: 57,
        flex: 1,
        marginVertical: 10
    },
    daysDateStyle: {
        borderTopLeftRadius: 0, borderTopRightRadius: 20,
        borderBottomLeftRadius: 0, borderBottomRightRadius: 20,
        backgroundColor: 'white', borderColor: '#3a3b40'
    },
    monthsDateContainer:
    {
        height: 50,
        width: 67,
        flex: 1,
        marginVertical: 10
    },
    monthsDateStyle: {
        borderTopLeftRadius: 0, borderTopRightRadius: 0,
        borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
        backgroundColor: 'white', borderBottomColor: '#3a3b40', borderLeftColor: 'white', borderRightColor: 'white', borderTopColor: '#3a3b40'
    },
    yearsDateContainer:
    {
        height: 50,
        width: 110,
        flex: 1,
        marginVertical: 10
    },
    yearsDateStyle: {
        borderTopLeftRadius: 20, borderTopRightRadius: 0,
        borderBottomLeftRadius: 20, borderBottomRightRadius: 0,
        backgroundColor: 'white', borderColor: '#3a3b40'
    },


    //Save Button:
    savebutton: {
        backgroundColor: '#e95344',
        borderRadius: 50,
        padding: 7,
        width: Dimensions.get('window').width * 0.9,
        height: 45,
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 30
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