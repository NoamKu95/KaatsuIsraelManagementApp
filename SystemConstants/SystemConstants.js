//Outer Imports:
import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Table, Row, Rows } from 'react-native-table-component';
import Spinner from 'react-native-loading-spinner-overlay';

//Inner Imports:
import Header from '../Components/Header';

//Icons:
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';




export default function SystemConstants(props) {

    //Make the textInputs editable / uneditable:
    const [canEditProductsTable, setCanEditProductsTable] = useState(false);
    const [canEditCommissionsTable, setCanEditCommissionsTable] = useState(false);
    const [canEditWeightsTable, setCanEditWeightsTable] = useState(false);
    const [canEditEmails, setCanEditSenderEmail] = useState(false);
    const [canEditMotivationalSentance, setCanEditMotivationalSentance] = useState(false);

    // ---------------------

    //products
    const [allProducts, setAllProducts] = useState(null);
    const [uniqProdForShow, setUniqProdForShow] = useState(null);

    //Products Table:
    const [headProductsTable, setHeadProductsTable] = useState(['שם מוצר', 'מחיר']);
    const [productsTableData, setProductsTableData] = useState([]);
    const [productsTableCanEdit, setProductsTableCanEdit] = useState([]);

    const [prodToDelete, setProdToDelete] = useState(null);
    // ---------------------

    //commissions
    const [allCommisions, setAllCommisions] = useState(null);
    const [allCommisionsInputs, setAllCommisionsInputs] = useState([]);

    //Commissions Table:
    const [headComissionsTable, setHeadComissionsTable] = useState(['שם מוצר', 'טווח תחתון', 'טווח עליון', 'גובה עמלה']);
    const [commissionsTableData, setCommissionTableData] = useState([]);
    const [commissionsTableCanEdit, setCommissionsTableCanEdit] = useState([]);

    // ---------------------

    //Smart Element Weights Table:
    const [headWeightsTable, setHeadWeightsTable] = useState(['שם משקולת', 'ערך']);
    const [weightsTableData, setWeightsTableData] = useState([]);
    const [weightsTableCanEdit, setWeightsTableCanEdit] = useState([]);

    //weights
    const [allWeights, setAllWeights] = useState([]);


    //All Weights Options
    const [AvailabilityWeight, setAvailabilityWeight] = useState(0);
    const [DistanceWeight, setDistanceWeight] = useState(0);
    const [GenderWeight, setGenderWeight] = useState(0);
    const [PbgWeight, setPbgWeight] = useState(0);
    const [RatingWeight, setRatingWeight] = useState(0);
    const [SeniorityWeight, setSeniorityWeight] = useState(0);


    // ---------------------

    //send array inputs
    const [allPriceInputs, setAllPriceInputs] = useState([]);


    //Motivational Sentance:
    const [newSentance, setNewSentance] = useState(null);


    //Emails:
    const [senderEmail, setSenderEmail] = useState('');
    const [senderEmailPassword, setSenderEmailPassword] = useState('');
    const [reportsEmail, setReportsEmail] = useState('');


    //Alerts:
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const [showAlertTwoButtons, setShowAlertTwoButtons] = useState(false);
    const [alertMessageTwoButtons, setAlertMessageTwoButtons] = useState('');
    const [alertTitleTwoButtons, setAlertTitleTwoButtons] = useState('');
    const [showTwoButtons, setShowTwoButtons] = useState(false);

    //Passwords
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    //Loading animation:
    const [spinner, setSpinner] = useState(false);


    useEffect(() => {

        const checkFocus = props.navigation.addListener('focus', () => {

            setCanEditProductsTable(false);
            setCanEditCommissionsTable(false);
            setCanEditWeightsTable(false);
            getAllProducts();
            getAllCommissions();
            getAllWeight();
            getAllEmails();
            setCanEditProductsTable(false);
            setCanEditCommissionsTable(false);
        });

        return checkFocus;

    }, []);



    //----------------------------------------PRODUCTS------------------------------------------//

    //get all products from DB & create unique arr of their names:
    const getAllProducts = () => {

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

                        setAllProducts(result);

                        let activeProducts = [];
                        for (let i = 0; i < result.length; i++) {

                            if (result[i].p_IsActive == true) {
                                activeProducts.push(result[i]);
                            }
                        }

                        let uniqueProducts = []; // array that contains only 1 object of each product type
                        for (let i = 0; i < activeProducts.length; i++) {

                            let wasAdded = false;

                            for (let j = 0; j < uniqueProducts.length; j++) {

                                if (activeProducts[i].p_Name == uniqueProducts[j].p_Name) {
                                    wasAdded = true;
                                    break;
                                }
                            }

                            if (!wasAdded) {
                                uniqueProducts.push(activeProducts[i]);
                            }
                        }

                        setUniqProdForShow(uniqueProducts);

                        // Create the table to present to the user:

                        let table = [];  //Table that will hold the data (the rows)

                        //From each object from the DB we create a ROW in the Table:
                        for (let i = 0; i < uniqueProducts.length; i++) {

                            let tableRow = [];      //Row in the Table

                            //product name & price
                            tableRow.push(<Text style={styles.tableText}>{uniqueProducts[i].p_Name}</Text>);   //first cell: product Name
                            tableRow.push(<Text style={styles.beforeEditProdPrice}>{uniqueProducts[i].p_Price}</Text>);      //second cell: product price
                            table.push(tableRow);   //Add the ROW to the Table
                        }

                        setProductsTableData(table);
                    }
                    else if (result == 404) {

                        setAlertMessage('לא נמצאו מוצרים במסד הנתונים');
                        setAlertTitle('אופס!')
                        setShowAlert(true);
                    }
                    else if (result == 500) {

                        setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה')
                        setShowAlert(true);
                    }
                    else {

                        setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה')
                        setShowAlert(true);
                    }
                },
                (error) => {
                    setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית               ' + error);
                    setAlertTitle('שגיאה')
                    setShowAlert(true);
                }
            );
    }


    //open the option to edit the products table lines
    const startToEditProducts = () => {

        setCanEditProductsTable(true);
        putTextInputsOnProducts();
    }


    //change all the table lines to textInputs for edit the text
    const putTextInputsOnProducts = () => {

        let table = [];  //Table that will hold the data (the rows)


        //From each object from the DB we create a ROW in the Table:
        for (let i = 0; i < uniqProdForShow.length; i++) {
            let tableRow = [];      //Row in the Table

            //------------------------------product name & price------------------------------//

            tableRow.push(
                //first cell: product Name
                <Text style={styles.tableText}>{uniqProdForShow[i].p_Name}</Text>
            );

            tableRow.push(

                //second cell: product price
                <View style={styles.productPriceWrapper}>

                    <TextInput
                        onChangeText={(text => putNewProdPrice(text, uniqProdForShow[i]))}
                        keyboardType='number-pad'
                        placeholder={uniqProdForShow[i].p_Price.toString()}
                        maxLength={20}
                        style={styles.tableText}>

                    </TextInput>

                    <TouchableOpacity
                        onPress={() => {
                            setProdToDelete(uniqProdForShow[i].p_Name);
                            setShowTwoButtons(true);
                            setShowAlertTwoButtons(true);
                            setAlertMessageTwoButtons('האם הנך בטוח שברצונך למחוק את המוצר?');
                            setAlertTitleTwoButtons('נדרש אישור פעולה')
                        }}
                    >
                        <MaterialIcons name="cancel" size={24} color="#e95344" style={styles.deleteIcon} />

                    </TouchableOpacity>

                </View>
            );

            table.push(tableRow);   //Add the ROW to the Table
        }

        setProductsTableCanEdit(table);
    }



    //for editing the products prices and check the inputs
    const putNewProdPrice = (text, product) => {

        // text = typed new price
        // product = object of product (has all product details from db)

        //Check if the user typed a legit price
        text.includes('-') || text == '' || text == '.' ?
            text = parseInt(0)
            :
            text.includes('.') ?
                text = Math.floor(parseFloat(text)) //round down the typed price
                :
                text = parseInt(text);


        //Check if we already edited THIS product's PRICE:
        let exists = false;

        if (allPriceInputs.length > 0) { // we already edited some items

            for (let index = 0; index < allPriceInputs.length; index++) {

                if (parseInt(allPriceInputs[index].p_ID) == parseInt(product.p_ID)) {  // if this product's ID is inside already

                    allPriceInputs[index].p_Price = text;    // edit it's price
                    exists = true;
                    break;

                }
            }
            if (!exists) { // the ID of THIS product wasn't in the edited-items-array
                let allPricesArray = allPriceInputs;
                allPricesArray.push({
                    p_ID: product.p_ID,
                    p_Price: text,
                    RowVersion: product.RowVersion,
                    p_Name: product.p_Name


                });

                setAllPriceInputs(allPricesArray);
            }
        }
        else { // no edited items yet
            let allPricesArray = allPriceInputs;
            allPricesArray.push({
                p_ID: product.p_ID,
                p_Price: text,
                RowVersion: product.RowVersion,
                p_Name: product.p_Name


            });

            setAllPriceInputs(allPricesArray);
        }
    }


    //click on the save button -- stop the editing and send you to prepare the data for sending to DB
    const offEditProducts = () => {

        //check if there was a change in product name
        if (allPriceInputs.length > 0) {

            sendNewPricesOfProductsToDB();
        }
        else {

            setCanEditProductsTable(false);
        }
    }


    //send the new prices
    const sendNewPricesOfProductsToDB = () => {

        setSpinner(true);

        const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/updateproductsprices/`;
        fetch(apiUrl,
            {
                method: 'POST',
                body: JSON.stringify(allPriceInputs),
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
                        res.json == 409 ?
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

                        setAllPriceInputs([]);
                        setAllProducts([]);

                        setSpinner(false);

                        setAlertMessage(result);
                        setAlertTitle('פעולה בוצעה בהצלחה')
                        setShowAlert(true);

                        getAllProducts();

                        setCanEditProductsTable(false);  //close the option to edit after the alert message
                        getAllCommissions();
                    }
                    else if (result == 404) {

                        setSpinner(false);

                        setAlertMessage('לאחד או יותר מהמוצרים לא נמצאה התאמה במסד הנתונים ועל כן התהליך כולו הופסק. השינויים לא נשמרו');
                        setAlertTitle('אופס!')
                        setShowAlert(true);
                        setAllProducts([]);
                        setAllPriceInputs([]);

                        getAllProducts();
                    }
                    else if (result == 409) {

                        setSpinner(false);

                        setAlertMessage('הנתונים שהוזנו אינם עומדים בתנאי השרת ומסד הנתונים. נא לבדוק את הנתונים שהוזנו ולנסות שנית');
                        setAlertTitle('שגיאה')
                        setShowAlert(true);
                        setAllProducts([]);
                        setAllPriceInputs([]);

                        getAllProducts();
                    }
                    else if (result == 500) {

                        setSpinner(false);

                        setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה')
                        setShowAlert(true);
                        setAllProducts([]);
                        setAllPriceInputs([]);

                        getAllProducts();
                    }
                    else {

                        setSpinner(false);

                        setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה')
                        setShowAlert(true);
                        setAllProducts([]);
                        setAllPriceInputs([]);

                        getAllProducts();
                    }
                },
                (error) => {

                    setSpinner(false);

                    setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית               ' + error);
                    setAlertTitle('שגיאה')
                    setShowAlert(true);

                    setAllProducts([]);
                    setAllPriceInputs([]);

                    getAllProducts();
                }
            );
    }


    //Delete a product
    const deleteProduct = () => {

        setShowAlert(false);
        setShowTwoButtons(false);

        let prodName = prodToDelete;

        if (prodName != null) {

            setSpinner(true);

            const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/deleteproduct/${prodName}`;
            fetch(apiUrl,
                {

                    method: 'DELETE',
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

                            setAllProducts([]);
                            setProdToDelete(null);

                            setSpinner(false);

                            setAlertMessage(result);
                            setAlertTitle('פעולה בוצעה בהצלחה')
                            setShowAlert(true);

                            getAllProducts();

                            setCanEditProductsTable(false);  //close the option to edit after the alert message
                            getAllCommissions();          //refresh the second table for names

                        }
                        else if (result == 404) {

                            setSpinner(false);
                            setAlertMessage('לא נמצאה התאמה במסד הנתונים לנתוני המוצר');
                            setAlertTitle('אופס!')
                            setShowAlert(true);
                            setProdToDelete(null);
                        }
                        else if (result == 500) {

                            setSpinner(false);
                            setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                            setAlertTitle('שגיאה')
                            setShowAlert(true);
                            setProdToDelete(null);
                        }
                        else {

                            setSpinner(false);
                            setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                            setAlertTitle('שגיאה')
                            setShowAlert(true);
                            setProdToDelete(null);
                        }
                    },
                    (error) => {

                        setSpinner(false);
                        setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית               ' + error);
                        setAlertTitle('שגיאה')
                        setShowAlert(true);
                        setProdToDelete(null);
                    }
                );
        }
        else {

            setAlertMessage('התרחשה תקלה בזיהוי קוד המוצר. נא לרענן את העמוד ולנסות שנית');
            setAlertTitle('שגיאה')
            setShowAlert(true);
            setProdToDelete(null);
        }
    }



    //-----------------------------------------Commissions----------------------------------------------//

    //get all commissions from DB:
    const getAllCommissions = () => {

        const apiUrl = 'https://proj.ruppin.ac.il/bgroup12/prod/api/getcommissionforediting/';
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

                        setAllCommisions(result);

                        //-----------------------------the db table options---------------//

                        // com_ProductID - איזה מוצר
                        // com_Sum - גובה העמלה
                        // com_LowSaleRange - טווח תחתון של מוצרים
                        // com_TopSaleRange - טווח עליון של מוצרים
                        //com_ProductName - שם מוצר

                        let table = [];  //Table that will hold the data (the rows)

                        //From each object from the DB we create a ROW in the Table:
                        for (let i = 0; i < result.length; i++) {

                            let tableRow = [];      //Row in the Table

                            //commission & ranges
                            tableRow.push(<Text style={styles.tableText}>{result[i].com_ProductName}</Text>);
                            tableRow.push(<Text style={styles.tableText}>{result[i].com_LowSaleRange}</Text>);
                            tableRow.push(<Text style={styles.tableText}>{result[i].com_TopSaleRange}</Text>);
                            tableRow.push(<Text style={styles.beforeEditSecondTable}>{result[i].com_Sum}</Text>);
                            table.push(tableRow);   //Add the ROW to the Table
                        }

                        setCommissionTableData(table);
                    }
                    else if (result == 400) {

                        setAlertMessage('לא נמצאו עמלות במסד הנתונים');
                        setAlertTitle('אופס!')
                        setShowAlert(true);
                    }
                    else if (result == 500) {

                        setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה')
                        setShowAlert(true);
                    }
                    else {

                        setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה')
                        setShowAlert(true);
                    }
                },
                (error) => {

                    setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית               ' + error);
                    setAlertTitle('שגיאה')
                    setShowAlert(true);
                }
            );
    }

    const startToEditCommission = () => {

        setCanEditCommissionsTable(true);
        putTextInputsInCommissionTable();
    }

    const putTextInputsInCommissionTable = () => {

        // com_ProductID - איזה מוצר
        // com_Sum - גובה העמלה
        // com_LowSaleRange - טווח תחתון של מוצרים
        // com_TopSaleRange - טווח עליון של מוצרים
        //com_ProductName - שם מוצר

        let table = [];  //Table that will hold the data (the rows)

        //From each object from the DB we create a ROW in the Table:
        for (let i = 0; i < allCommisions.length; i++) {

            let tableRow = [];      //Row in the Table

            //commission & ranges
            tableRow.push(<Text style={styles.tableText}>{allCommisions[i].com_ProductName}</Text>);
            tableRow.push(<Text style={styles.tableText}>{allCommisions[i].com_LowSaleRange}</Text>);
            tableRow.push(<Text style={styles.tableText}>{allCommisions[i].com_TopSaleRange}</Text>);
            tableRow.push(
                <TextInput
                    onChangeText={(text => putNewCommissionPrice(text, allCommisions[i]))}
                    keyboardType='number-pad'
                    placeholder={allCommisions[i].com_Sum.toString()}
                    maxLength={20}
                    style={styles.editCommissionText}>
                </TextInput>
            );

            table.push(tableRow);   //Add the ROW to the Table
        }
        setCommissionsTableCanEdit(table);
    }

    const putNewCommissionPrice = (text, commission) => {

        //Check if the user typed a legit price
        text.includes('-') || text == '' || text == '.' ?
            text = parseFloat(0)
            :
            text = parseFloat(text);



        let exists = false;
        if (allCommisionsInputs.length > 0) { // we already edited some items

            for (let index = 0; index < allCommisionsInputs.length; index++) {

                if (allCommisionsInputs[index].com_ProductName == commission.com_ProductName) {  // if this product's ID is inside already

                    allCommisionsInputs[index].com_Sum = text;    // edit it's name
                    exists = true;
                    break;
                }
            }


            if (!exists) { // the ID of THIS product wasn't in the edited-items-array

                let allCommArray = allCommisionsInputs;
                allCommArray.push({
                    com_LowSaleRange: parseInt(commission.com_LowSaleRange),
                    com_TopSaleRange: parseInt(commission.com_TopSaleRange),
                    com_Sum: text,
                    com_ProductName: commission.com_ProductName
                });

                setAllCommisionsInputs(allCommArray);
            }
        }
        else { // no edited items yet

            let allCommArray = allCommisionsInputs;
            allCommArray.push({
                com_LowSaleRange: parseInt(commission.com_LowSaleRange),
                com_TopSaleRange: parseInt(commission.com_TopSaleRange),
                com_Sum: text,
                com_ProductName: commission.com_ProductName
            });

            setAllCommisionsInputs(allCommArray);
        }
    }

    //click on the save button -- stop the editing and send you to prepare the data for sending to DB
    const offEditCommission = () => {

        //check if there was a change in product name
        if (allCommisionsInputs.length > 0) {

            sendNewCommissionsOfProductsToDB();
        }
        else {

            setCanEditCommissionsTable(false);
        }
    }


    const sendNewCommissionsOfProductsToDB = () => {

        setSpinner(true);

        const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/commission/`;
        fetch(apiUrl,
            {
                method: 'POST',
                body: JSON.stringify(allCommisionsInputs),
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

                        setAllCommisionsInputs([]);
                        setAllCommisions([]);

                        setSpinner(false);

                        setAlertMessage(result);
                        setAlertTitle('פעולה בוצעה בהצלחה')
                        setShowAlert(true);

                        setCanEditCommissionsTable(false);  //close the option to edit after the alert message

                        // bring again all the commissions from the DB
                        getAllCommissions();
                    }
                    else if (result == 404) {

                        setSpinner(false);

                        setAlertMessage('לא נמצאה התאמה במסדת הנתונים לנתוני העמלה');
                        setAlertTitle('אופס!')
                        setShowAlert(true);
                        setAllCommisions([]);
                        setAllCommisionsInputs([]);

                        // bring again all the commissions from the DB
                        getAllCommissions();
                    }
                    else if (result == 409) {

                        setSpinner(false);

                        setAlertMessage('הנתונים שהוזנו אינם עומדים בתנאי השרת ומסד הנתונים. נא לבדוק את הנתונים שהוזנו ולנסות שנית');
                        setAlertTitle('אופס!')
                        setShowAlert(true);
                        setAllCommisions([]);
                        setAllCommisionsInputs([]);

                        // bring again all the commissions from the DB
                        getAllCommissions();
                    }
                    else if (result == 500) {

                        setSpinner(false);

                        setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה')
                        setShowAlert(true);
                        setAllCommisions([]);
                        setAllCommisionsInputs([]);

                        // bring again all the commissions from the DB
                        getAllCommissions();
                    }
                    else {

                        setSpinner(false);

                        setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה')
                        setShowAlert(true);
                        setAllCommisions([]);
                        setAllCommisionsInputs([]);

                        // bring again all the commissions from the DB
                        getAllCommissions();
                    }
                },
                (error) => {

                    setSpinner(false);

                    setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית               ' + error);
                    setAlertTitle('שגיאה')
                    setShowAlert(true);

                    getAllCommissions();
                    setAllCommisionsInputs([]);
                }
            );
    }



    //----------------------------------SYSTEM WEIGHT----------------------------------------//

    //get all products from DB & create unique arr of their names:
    const getAllWeight = () => {

        const apiUrl = 'https://proj.ruppin.ac.il/bgroup12/prod/api/weights';
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

                        setAllWeights(result);

                        let table = [];  //Table that will hold the data (the rows)

                        //From each object from the DB we create a ROW in the Table:
                        for (let i = 0; i < result.length; i++) {

                            let tableRow = [];      //Row in the Table

                            //product name & value
                            tableRow.push(<Text style={styles.tableText}>{result[i].w_Name}</Text>);   //first cell: weight Name
                            tableRow.push(<Text style={styles.beforeEditTableOneAndTree}>{result[i].w_Value}</Text>);      //second cell: value
                            table.push(tableRow);   //Add the ROW to the Table 
                        }
                        setWeightsTableData(table);
                    }
                    else if (result == 404) {

                        setAlertMessage('לא נמצאו משקולות בבסיס הנתונים');
                        setAlertTitle('אופס!')
                        setShowAlert(true);
                    }
                    else if (result == 500) {

                        setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה')
                        setShowAlert(true);
                    }
                    else {

                        setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה')
                        setShowAlert(true);
                    }
                },
                (error) => {
                    setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית               ' + error);
                    setAlertTitle('שגיאה')
                    setShowAlert(true);
                }
            );
    }


    //open the option to edit the weights table lines
    const startToEditWeight = () => {

        setCanEditWeightsTable(true);
        putTextInputsOnWeights();
    }


    //change all the table lines to textInputs for edit the text
    const putTextInputsOnWeights = () => {

        let table = [];  //Table that will hold the data (the rows)


        //From each object from the DB we create a ROW in the Table:
        for (let i = 0; i < allWeights.length; i++) {
            let tableRow = [];      //Row in the Table


            //------------------------------ name & value------------------------------//


            if (allWeights[i].w_Name == 'Availability_Weight') {
                setAvailabilityWeight(allWeights[i].w_Value);
            }
            else if (allWeights[i].w_Name == 'Distance_Weight') {
                setDistanceWeight(allWeights[i].w_Value);
            }
            else if (allWeights[i].w_Name == 'Gender_Weight') {
                setGenderWeight(allWeights[i].w_Value);
            }
            else if (allWeights[i].w_Name == 'Pbg_Weight') {
                setPbgWeight(allWeights[i].w_Value);
            }
            else if (allWeights[i].w_Name == 'Rating_Weight') {
                setRatingWeight(allWeights[i].w_Value);
            }
            else if (allWeights[i].w_Name == 'Seniority_Weight') {
                setSeniorityWeight(allWeights[i].w_Value);
            }


            tableRow.push(
                //first cell: weight Name
                <Text style={styles.tableText}>{allWeights[i].w_Name}</Text>
            );


            tableRow.push(
                //second cell: weight value
                <View style={styles.insertText}>
                    <TextInput
                        onChangeText={(text => putNewWeightValue(text, allWeights[i].w_Name))}
                        keyboardType='number-pad'
                        defaultValue={allWeights[i].w_Value.toString()}
                        maxLength={20}
                        style={styles.tableTextCanEditWeight}>
                    </TextInput>
                </View>
            );

            table.push(tableRow);   //Add the ROW to the Table
        }

        setWeightsTableCanEdit(table);
    }


    //closing the option of edit the theird table
    const offEditWeights = () => {

        sendNewValuesOfWeightsToDB();
    }


    //for editing the products prices and check the inputs
    const putNewWeightValue = (text, weightObjectName) => {

        // text = typed new price
        // product = object of product (has all product details from db)

        //Check if the user typed a legit price
        text.includes('-') || text == '' || text == '.' ?
            text = parseFloat(0)
            :
            text = parseFloat(text);

        if (weightObjectName == 'Availability_Weight') {
            setAvailabilityWeight(text);
        }
        else if (weightObjectName == 'Distance_Weight') {
            setDistanceWeight(text);
        }
        else if (weightObjectName == 'Gender_Weight') {
            setGenderWeight(text);
        }
        else if (weightObjectName == 'Pbg_Weight') {
            setPbgWeight(text);
        }
        else if (weightObjectName == 'Rating_Weight') {
            setRatingWeight(text);
        }
        else if (weightObjectName == 'Seniority_Weight') {
            setSeniorityWeight(text);
        }
    }


    //send the new values to DB
    const sendNewValuesOfWeightsToDB = () => {

        //sum all the values for checking if it be 1
        let sum = 0;
        sum = AvailabilityWeight + DistanceWeight + GenderWeight + PbgWeight + RatingWeight + SeniorityWeight;

        sum = parseFloat(sum).toFixed(4);


        if (sum < 1) {
            setAlertMessage('סך המשקלים שהוזנו נמוך מ-1, יש לוודא כי סך כל המשקלים משלים ל-1 בדיוק');
            setAlertTitle('שגיאה')
            setShowAlert(true);
        }
        else if (sum > 1) {
            setAlertMessage('סך המשקלים שהוזנו גבוה מ-1, יש לוודא כי סך כל המשקלים משלים ל-1 בדיוק');
            setAlertTitle('שגיאה')
            setShowAlert(true);
        }

        else {

            setSpinner(true);

            let weightInputsForDB = [];
            weightInputsForDB = [
                {
                    w_Name: "Availability_Weight",
                    w_Value: AvailabilityWeight,
                },
                {
                    w_Name: "Distance_Weight",
                    w_Value: DistanceWeight,
                },
                {
                    w_Name: "Gender_Weight",
                    w_Value: GenderWeight,
                },
                {
                    w_Name: "Pbg_Weight",
                    w_Value: PbgWeight,
                },
                {
                    w_Name: "Rating_Weight",
                    w_Value: RatingWeight,
                },
                {
                    w_Name: "Seniority_Weight",
                    w_Value: SeniorityWeight,
                }


            ];

            const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/weights/`;
            fetch(apiUrl,
                {
                    method: 'POST',
                    body: JSON.stringify(weightInputsForDB),
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

                            setAllWeights([]);

                            setSpinner(false);

                            setAlertMessage(result);
                            setAlertTitle('פעולה בוצעה בהצלחה')
                            setShowAlert(true);

                            setCanEditWeightsTable(false);  //close the option to edit after the alert message

                            resetAllWeights();

                            getAllWeight();

                        }
                        else if (result == 400) {

                            setSpinner(false);
                            setAlertMessage('לא נמצאה התאמה בבבסיס הנתונים לנתוני המשקולת');
                            setAlertTitle('אופס!')
                            setShowAlert(true);

                            setAllWeights([]);
                            resetAllWeights();
                            getAllWeight();
                        }
                        else if (result == 500) {

                            setSpinner(false);
                            setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                            setAlertTitle('שגיאה')
                            setShowAlert(true);

                            setAllWeights([]);
                            resetAllWeights();
                            getAllWeight();
                        }
                        else {

                            setSpinner(false);
                            setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                            setAlertTitle('שגיאה')
                            setShowAlert(true);

                            setAllWeights([]);
                            resetAllWeights();
                            getAllWeight();
                        }
                    },
                    (error) => {

                        setSpinner(false);
                        setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית               ' + error);
                        setAlertTitle('שגיאה')
                        setShowAlert(true);

                        setAllWeights([]);
                        resetAllWeights();
                        getAllWeight();
                    }
                );
        }
    }


    //go to add a product
    const moveToAddProduct = () => {

        let c = {
            allDBProducts: allProducts
        }

        props.navigation.navigate('AddNewProduct', { allProducts: c });
    }


    //clean all weights states
    const resetAllWeights = () => {

        setAvailabilityWeight(false);
        setDistanceWeight(false);
        setGenderWeight(false);
        setPbgWeight(false);
        setRatingWeight(false);
        setSeniorityWeight(false);
    }



    //----------------------------------MOTIVATIONAL SENTANCES---------------------------------//

    const addNewSentance = () => {

        if (newSentance == '' || newSentance == null) {

            setAlertMessage('יש להזין טקסט למשפט המוטיבציה');
            setAlertTitle('שגיאה');
            setShowAlert(true);
        }
        else {

            if (newSentance.length < 5) {

                setAlertMessage('על משפט המוטיבציה להיות באורך של 5 תווים לפחות');
                setAlertTitle('שגיאה');
                setShowAlert(true);
            }
            else {

                let format = /[`@#$%^&_+\=\[\]{};':"\\|<>\/~]/;
                if (format.test(`${newSentance}`)) {

                    setAlertMessage('משפט המוטיבציה אינו יכול לכלול תווים מיוחדים כגון [@&^$#]');
                    setAlertTitle('שגיאה');
                    setShowAlert(true);
                }
                else {

                    const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/addnewmotivationalsentance/`;
                    fetch(apiUrl,
                        {
                            method: 'POST',
                            body: JSON.stringify(newSentance),
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
                                        null;
                        })
                        .then(
                            (result) => {

                                if (result != null && result != 409 && result != 500) {

                                    setAlertMessage('משפט המוטיבציה התווסף בהצלחה למסד הנתונים');
                                    setAlertTitle('פעולה בוצעה בהצלחה')
                                    setShowAlert(true);

                                    setNewSentance(null);
                                    setCanEditMotivationalSentance(false);
                                }
                                else if (result == 409) {

                                    setAlertMessage('הנתונים שהוזנו אינם עומדים בתנאי השרת ומסד הנתונים. נא לבדוק את הנתונים שהוזנו ולנסות שנית');
                                    setAlertTitle('אופס!')
                                    setShowAlert(true);
                                }
                                else if (result == 500) {

                                    setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                                    setAlertTitle('שגיאה')
                                    setShowAlert(true);
                                }
                                else {

                                    setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                                    setAlertTitle('שגיאה')
                                    setShowAlert(true);
                                }
                            },
                            (error) => {

                                setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית               ' + error);
                                setAlertTitle('שגיאה')
                                setShowAlert(true);
                            }
                        );
                }
            }
        }
    }



    //----------------------------------SYSTEM EMAIL----------------------------------------//

    //get all system emails from DB:
    const getAllEmails = () => {

        const apiUrl = 'https://proj.ruppin.ac.il/bgroup12/prod/api/EmailAdresses';
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

                        setSenderEmail(result.senderEmail);
                        setSenderEmailPassword(result.senderEmailPassword);
                        setReportsEmail(result.reportsEmail);
                    }
                    else if (result == 404) {

                        setAlertMessage('לא נמצאו נתוני האימיילים במסד הנתונים');
                        setAlertTitle('אופס!')
                        setShowAlert(true);
                    }
                    else if (result == 500) {

                        setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה')
                        setShowAlert(true);
                    }
                    else {

                        setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה')
                        setShowAlert(true);
                    }
                },
                (error) => {

                    setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית               ' + error);
                    setAlertTitle('שגיאה')
                    setShowAlert(true);
                }
            );
    }


    //start to edit the emails data
    const startToEditEmails = () => {

        setCanEditSenderEmail(true);
    }


    //get off the option to edit the data
    const offEditEmails = () => {

        if (senderEmail == '' || senderEmailPassword == '' || reportsEmail == '') {

            setAlertMessage('קיימת חובת הזנת תוכן בכל השדות');
            setAlertTitle('שגיאה');
            setShowAlert(true);
        }
        else {

            let reg = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
            let email1 = senderEmail;
            let email2 = reportsEmail;

            if (reg.test(email1) === false || reg.test(email2) === false) {

                setAlertMessage('כתובת האימייל שהוזנה אינה תקינה');
                setAlertTitle('שגיאה');
                setShowAlert(true);
            }
            else {

                sendDataToDB();
            }
        }
    }


    //send all the inputs to db
    const sendDataToDB = () => {

        let sender = senderEmail.toLowerCase();
        let password = senderEmailPassword;
        let report = reportsEmail.toLowerCase();

        let sendObject = {
            senderEmail: sender,
            senderEmailPassword: password,
            reportsEmail: report,
        }

        const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/emailadresses/`;
        fetch(apiUrl,
            {
                method: 'POST',
                body: JSON.stringify(sendObject),
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

                        setAlertMessage(result);
                        setAlertTitle('פעולה בוצעה בהצלחה')
                        setShowAlert(true);

                        getAllEmails();
                        setCanEditSenderEmail(false);

                    }
                    else if (result == 404) {

                        setAlertMessage('לא נמצאה התאמה במסד הנתונים לנתוני האימייל');
                        setAlertTitle('אופס!')
                        setShowAlert(true);
                        getAllEmails();
                    }
                    else if (result == 500) {

                        setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה')
                        setShowAlert(true);
                        getAllEmails();
                    }
                    else {

                        setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
                        setAlertTitle('שגיאה')
                        setShowAlert(true);
                        getAllEmails();
                    }
                },
                (error) => {

                    setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית               ' + error);
                    setAlertTitle('שגיאה')
                    setShowAlert(true);

                    getAllEmails();
                }
            );
    }




    return (
        <>
            <StatusBar backgroundColor='#e95344' barStyle='light-content' />

            <Header navigation={props.navigation} showArrow={true} showMenu={true} />

            <AwesomeAlert
                show={showTwoButtons ? showAlertTwoButtons : showAlert}
                showProgress={false}
                title={showTwoButtons ? alertTitleTwoButtons : alertTitle}
                message={showTwoButtons ? alertMessageTwoButtons : alertMessage}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={showTwoButtons ? true : false}
                showConfirmButton={true}
                cancelText="ביטול"
                confirmText={showTwoButtons ? "מחיקה" : "אישור"}
                confirmButtonColor="#e95344"
                cancelButtonColor="white"
                onCancelPressed={() => { setShowAlertTwoButtons(false); setProdToDelete(null) }}
                onConfirmPressed={() => { showTwoButtons ? deleteProduct() : setShowAlert(false) }}
                messageStyle={styles.alertMessageStyle}
                titleStyle={styles.alertTitleStyle}
                overlayStyle={{ backgroundColor: 'rgba(76, 76, 76, 0.69)' }}
                confirmButtonStyle={showTwoButtons ? styles.alertCancelBtnStyle : styles.alertConfirmBtnStyle}
                cancelButtonStyle={styles.alertCancelBtnStyle}
                confirmButtonTextStyle={styles.alertConfirmBtnTxtStyle}
                cancelButtonTextStyle={styles.alertCancelBtnTxtStyle}
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

            <ScrollView>

                <View style={styles.mainContainer} >
                    <Text style={styles.heading}> ניהול קבועי מערכת </Text>
                </View>

                <View style={styles.container}>

                    {
                        canEditProductsTable ?
                            <View style={styles.oneLine}>
                                <View>
                                    <Text style={styles.headings}>מוצרים </Text>
                                </View>

                                <View style={styles.twoButtons} >
                                    <TouchableOpacity onPress={() => moveToAddProduct()} >
                                        <AntDesign name="pluscircle" size={30} color="#e95344" style={{ paddingBottom: 3 }} />
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => { setCanEditProductsTable(false); setAllPriceInputs([]); }} >
                                        <MaterialIcons name="cancel" size={36} color="#3a3b40" />
                                    </TouchableOpacity>
                                </View>


                            </View>
                            :
                            <View style={styles.oneLine}>
                                <Text style={styles.headings}>מוצרים </Text>

                                <TouchableOpacity onPress={startToEditProducts} >
                                    <MaterialCommunityIcons name="pencil-circle" size={36} color="#e95344" />
                                </TouchableOpacity>
                            </View>
                    }


                    {
                        canEditProductsTable ?
                            <Table borderStyle={styles.tableBorder}>
                                <Row
                                    data={headProductsTable}
                                    style={styles.headStyle}
                                    textStyle={styles.tableHeaderText}
                                />
                                <Rows
                                    data={productsTableCanEdit}
                                    textStyle={styles.tableText1}
                                    style={styles.rowStyle1}
                                />
                            </Table>

                            :
                            <Table borderStyle={styles.tableBorder}>
                                <Row
                                    data={headProductsTable}
                                    style={styles.headStyle}
                                    textStyle={styles.tableHeaderText}
                                />
                                <Rows
                                    data={productsTableData}
                                    textStyle={styles.tableText1}
                                    style={styles.rowStyle1}
                                />
                            </Table>
                    }


                    {
                        canEditProductsTable ?
                            <TouchableOpacity
                                onPress={offEditProducts}
                                style={styles.saveButton}>
                                <Text
                                    style={styles.saveButtonText}>
                                    שמירת שינויים
                                </Text>
                            </TouchableOpacity>

                            :
                            <Text></Text>
                    }

                </View>



                <View style={styles.container}>

                    <View style={styles.oneLine}>

                        <Text style={styles.headings}>עמלות מפיצים</Text>
                        {
                            canEditCommissionsTable ?

                                <TouchableOpacity onPress={() => { setCanEditCommissionsTable(false); setAllCommisionsInputs([]); }} >
                                    <MaterialIcons name="cancel" size={36} color="#3a3b40" />
                                </TouchableOpacity>

                                :
                                <View>
                                    <TouchableOpacity onPress={startToEditCommission} >
                                        <MaterialCommunityIcons name="pencil-circle" size={36} color="#e95344" />
                                    </TouchableOpacity>
                                </View>
                        }

                    </View>

                    {
                        canEditCommissionsTable ?
                            <Table borderStyle={styles.tableBorder}>
                                <Row
                                    data={headComissionsTable}
                                    style={styles.headStyle}
                                    textStyle={styles.tableHeaderText}
                                />
                                <Rows
                                    data={commissionsTableCanEdit}
                                    textStyle={styles.tableText}
                                    style={styles.rowStyle}
                                />
                            </Table> :
                            <Table borderStyle={styles.tableBorder}>
                                <Row
                                    data={headComissionsTable}
                                    style={styles.headStyle}
                                    textStyle={styles.tableHeaderText}
                                />
                                <Rows
                                    data={commissionsTableData}
                                    textStyle={styles.tableText}
                                    style={styles.rowStyle}
                                />
                            </Table>
                    }

                    {
                        canEditCommissionsTable ?
                            <TouchableOpacity
                                onPress={offEditCommission}
                                style={styles.saveButton}>
                                <Text
                                    style={styles.saveButtonText}>
                                    שמירת שינויים
                                </Text>
                            </TouchableOpacity>
                            :
                            <Text></Text>
                    }

                </View>



                <View style={styles.container}>

                    <View style={styles.oneLine}>

                        <Text style={styles.headings}>משקולות אלמנט חכם</Text>
                        {
                            canEditWeightsTable ?

                                <TouchableOpacity onPress={() => { setCanEditWeightsTable(false); resetAllWeights(); }} >
                                    <MaterialIcons name="cancel" size={36} color="#3a3b40" />
                                </TouchableOpacity>

                                :
                                <TouchableOpacity onPress={startToEditWeight} >
                                    <MaterialCommunityIcons name="pencil-circle" size={36} color="#e95344" />
                                </TouchableOpacity>
                        }

                    </View>

                    {
                        canEditWeightsTable ?
                            <Table borderStyle={styles.tableBorder}>
                                <Row
                                    data={headWeightsTable}
                                    style={styles.headStyle}
                                    textStyle={styles.tableHeaderText}
                                />
                                <Rows
                                    data={weightsTableCanEdit}
                                    textStyle={styles.tableText1}
                                    style={styles.rowStyle1}
                                />
                            </Table>

                            :
                            <Table borderStyle={styles.tableBorder}>
                                <Row
                                    data={headWeightsTable}
                                    style={styles.headStyle}
                                    textStyle={styles.tableHeaderText}
                                />
                                <Rows
                                    data={weightsTableData}
                                    textStyle={styles.tableText1}
                                    style={styles.rowStyle1}
                                />
                            </Table>
                    }

                    {
                        canEditWeightsTable ?
                            <TouchableOpacity
                                onPress={offEditWeights}
                                style={styles.saveButton}
                            >
                                <Text
                                    style={styles.saveButtonText}>
                                    שמירת שינויים
                                </Text>

                            </TouchableOpacity>
                            :
                            <Text></Text>
                    }

                </View>


                <View style={styles.container}>

                    <View style={styles.oneLine}>

                        <Text style={styles.headings}>משפטי מוטיבציה</Text>

                        {
                            canEditMotivationalSentance ?

                                <TouchableOpacity onPress={() => { setCanEditMotivationalSentance(false); setNewSentance(null); }} >
                                    <MaterialIcons name="cancel" size={36} color="#3a3b40" />
                                </TouchableOpacity>

                                :

                                <TouchableOpacity onPress={() => setCanEditMotivationalSentance(true)} >
                                    <MaterialCommunityIcons name="pencil-circle" size={36} color="#e95344" />
                                </TouchableOpacity>
                        }
                    </View>

                    <View>

                        <View style={styles.oneLine}>
                            <Text style={styles.sentanceHeading}>הוספת משפט:</Text>

                            {
                                canEditMotivationalSentance ?
                                    <TextInput
                                        onChangeText={(e) => setNewSentance(e)}
                                        defaultValue={newSentance}
                                        style={styles.txtInputOnEdit}
                                        maxLength={99}
                                    >
                                    </TextInput>
                                    :
                                    <TextInput
                                        editable={false}
                                        defaultValue={newSentance}
                                        style={styles.txtInput}
                                    >
                                    </TextInput>
                            }
                        </View>
                    </View>

                    {
                        canEditMotivationalSentance ?
                            <TouchableOpacity
                                onPress={addNewSentance}
                                style={styles.saveButton}
                            >
                                <Text
                                    style={styles.saveButtonText}>
                                    שמירת שינויים
                                </Text>

                            </TouchableOpacity>
                            :
                            <Text></Text>
                    }
                </View>


                <View style={styles.container}>

                    <View style={styles.oneLine}>
                        <Text style={styles.headings}>כתובות אימייל</Text>

                        {
                            canEditEmails ?

                                <TouchableOpacity onPress={() => { setCanEditSenderEmail(false); getAllEmails(); }} >
                                    <MaterialIcons name="cancel" size={36} color="#3a3b40" />
                                </TouchableOpacity>

                                :
                                <TouchableOpacity onPress={startToEditEmails} >
                                    <MaterialCommunityIcons name="pencil-circle" size={36} color="#e95344" />
                                </TouchableOpacity>
                        }

                    </View>

                    {
                        canEditEmails ?
                            <View>
                                <View style={styles.oneLine}>
                                    <Text style={styles.minorHeading}>לשליחת מיילים:</Text>

                                    <TextInput
                                        onChangeText={(e) => setSenderEmail(e)}
                                        defaultValue={senderEmail}
                                        keyboardType='email-address'
                                        style={styles.txtInputOnEdit}
                                    >
                                    </TextInput>
                                </View>

                                <View style={styles.oneLine}>
                                    <Text style={styles.minorHeading}>סיסמא:</Text>

                                    {
                                        showPassword ?
                                            <View style={styles.viewContainer}>

                                                <TextInput
                                                    onChangeText={(e) => setSenderEmailPassword(e)}
                                                    defaultValue={senderEmailPassword}
                                                    style={styles.text}
                                                >
                                                </TextInput>
                                                <MaterialCommunityIcons name="eye-outline" size={24} color="#3a3b40" style={styles.iconStyle} onPress={() => { setShowPassword(false) }} />
                                            </View>

                                            :

                                            <View style={styles.viewContainer}>
                                                <TextInput secureTextEntry
                                                    onChangeText={(e) => setSenderEmailPassword(e)}
                                                    defaultValue={senderEmailPassword}
                                                    style={styles.text}
                                                >
                                                </TextInput>
                                                <MaterialCommunityIcons name="eye-off-outline" size={24} color="#3a3b40" style={styles.iconStyle} onPress={() => { setShowPassword(true) }} />
                                            </View>
                                    }
                                </View>

                                <View style={styles.oneLine}>
                                    <Text style={styles.minorHeading}>מייל דוחות:</Text>

                                    <TextInput
                                        onChangeText={(e) => setReportsEmail(e)}
                                        defaultValue={reportsEmail}
                                        keyboardType='email-address'
                                        style={styles.txtInputOnEdit}
                                    >
                                    </TextInput>
                                </View>

                            </View>
                            :
                            <View>

                                <View style={styles.oneLine}>
                                    <Text style={styles.minorHeading}>לשליחת מיילים:</Text>
                                    <Text style={styles.txtInput}>{senderEmail}</Text>
                                </View>

                                <View style={styles.oneLine}>

                                    <Text style={styles.minorHeading}>סיסמא:</Text>

                                    {
                                        showPassword2 ?
                                            <View style={styles.viewContainer2}>

                                                <TextInput
                                                    defaultValue={senderEmailPassword}
                                                    style={styles.text}
                                                    editable={false}
                                                >
                                                </TextInput>
                                                <MaterialCommunityIcons name="eye-outline" size={24} color="#3a3b40" style={styles.iconStyle2} onPress={() => { setShowPassword2(false) }} />
                                            </View>

                                            :

                                            <View style={styles.viewContainer2}>
                                                <TextInput secureTextEntry
                                                    defaultValue={senderEmailPassword}
                                                    style={styles.text}
                                                    editable={false}
                                                >
                                                </TextInput>
                                                <MaterialCommunityIcons name="eye-off-outline" size={24} color="#3a3b40" style={styles.iconStyle2} onPress={() => { setShowPassword2(true) }} />
                                            </View>
                                    }
                                </View>

                                <View style={styles.oneLine}>
                                    <Text style={styles.minorHeading}>לקבלת דוחות:</Text>
                                    <Text style={styles.txtInput}>{reportsEmail}</Text>
                                </View>

                            </View>
                    }


                    {
                        canEditEmails ?
                            <TouchableOpacity
                                onPress={offEditEmails}
                                style={styles.saveButton}
                            >
                                <Text
                                    style={styles.saveButtonText}>
                                    שמירת שינויים
                                </Text>
                            </TouchableOpacity>
                            :
                            <Text></Text>
                    }

                </View>

            </ScrollView >

        </>
    );
}


const styles = StyleSheet.create({

    //Containers:
    mainContainer: {
        backgroundColor: 'white'
    },
    container: {
        flex: 1,
        padding: 10,
        paddingTop: 5,
        backgroundColor: '#ffffff',

    },
    productPriceWrapper:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 20,
        paddingLeft: 35
    },

    //Page name
    heading: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
    },
    headings:
    {
        fontSize: 17,
        fontWeight: 'bold',
        marginLeft: 4
    },
    sentanceHeading:
    {
        fontWeight: 'bold',
        fontSize: 12
    },
    minorHeading:
    {
        fontWeight: 'bold',
        fontSize: 12
    },

    oneLine: {
        backgroundColor: 'white',
        width: Dimensions.get('window').width * 0.97,
        minHeight: 35,
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 5,
        textAlign: 'right',
        flexDirection: 'row',
        marginTop: 10
    },

    twoButtons: {
        flexDirection: 'row',
        alignItems: 'baseline'
    },
    //Red edit button
    addButton: {
        borderRadius: 20,
        width: 33,
        height: 33,
        justifyContent: 'center',
        alignSelf: 'center',
        borderColor: '#e95344',
        borderWidth: 2,

    },
    addButtonText: {
        color: '#e95344',
        textAlign: 'center',
        fontSize: 25,
        alignSelf: 'center',
        fontWeight: 'bold'
    },

    //Save Burron:
    saveButton: {
        backgroundColor: '#e95344',
        marginTop: 10,
        borderRadius: 50,
        width: Dimensions.get('window').width * 0.95,
        height: 45,
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    saveButtonText:
    {
        color: 'white',
        textAlign: 'center',
        fontSize: 15,
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    //Table:
    tableBorder:
    {
        borderWidth: 1,
        borderColor: 'grey'
    },

    headStyle: {
        height: 35,
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

    rowStyle1:
    {
        height: 40,

    },


    rowStyle:
    {
        height: 55,
    },

    tableText1: {
        color: 'black',
        textAlign: 'center',
        fontSize: 15,

    },
    tableText: {
        color: 'black',
        textAlign: 'center',
        fontSize: 12,


    },

    beforeEditTableOneAndTree: {
        backgroundColor: '#dfe0e4',
        textAlign: 'center',
        fontWeight: 'bold',
        height: 40,
        fontSize: 12,
        flex: 1,
        justifyContent: 'center',
        padding: 10,
        color: 'grey'
    },

    beforeEditSecondTable: {
        backgroundColor: '#dfe0e4',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 12,
        flex: 1,
        justifyContent: 'center',
        paddingTop: 17,
        color: 'grey'
    },

    insertText: {
        flexDirection: 'row',
    },

    editCommissionText: {
        color: 'black',
        textAlign: 'center',
        fontSize: 12,
        flex: 1

    },

    beforeEditProdPrice: {
        backgroundColor: '#dfe0e4',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 12,
        flex: 1,
        justifyContent: 'center',
        paddingTop: 12,
        color: 'grey'
    },

    //email lines- not edit
    txtInput: {
        textAlign: 'center',
        width: Dimensions.get('window').width * 0.7,
        height: 38,
        backgroundColor: 'white',
        borderRadius: 20,
        fontSize: 12,
        paddingTop: 10,
        backgroundColor: '#dfe0e4',
        color: 'grey',
        marginHorizontal: 7,

    },

    //email lines- not edit
    txtInputOnEdit: {
        textAlign: 'center',
        width: Dimensions.get('window').width * 0.7,
        height: 38,
        backgroundColor: 'white',
        borderRadius: 20,
        borderColor: 'black',
        borderWidth: 1,
        fontSize: 12,
        color: 'grey',
        marginHorizontal: 7,

    },



    viewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: Dimensions.get('window').width * 0.7,
        textAlign: 'center',
        borderColor: 'black',
        borderWidth: 1,
        marginHorizontal: 7,
        borderRadius: 20,
        height: 38,
        backgroundColor: 'white',
        justifyContent: 'space-between'

    },
    viewContainer2: {
        flexDirection: 'row',
        alignItems: 'center',
        width: Dimensions.get('window').width * 0.7,
        textAlign: 'center',
        marginHorizontal: 7,
        borderRadius: 20,
        height: 38,
        backgroundColor: 'white',
        justifyContent: 'space-between',
        backgroundColor: '#dfe0e4',


    },

    text: {
        textAlign: 'center',
        fontSize: 12,
        color: 'grey',
        textAlign: 'center',
        fontSize: 12,
        color: 'grey',
        marginHorizontal: 7,
        alignItems: 'center',
        alignSelf: 'center',
        flex: 1,
    },

    inputPass: {
        textAlign: 'center',
        backgroundColor: 'white',
        fontSize: 12,
        color: 'grey',
        marginHorizontal: 7,
        alignItems: 'center',
        alignSelf: 'center',
        flex: 1,
    },


    tableTextCanEditWeight: {
        color: 'black',
        textAlign: 'center',
        fontSize: 12,
        flex: 1,
        alignItems: 'center',
        alignContent: 'center'

    },


    //Icons:
    iconStyle: {
        backgroundColor: 'white',
        paddingLeft: 15,
        borderBottomLeftRadius: 20,
        borderTopLeftRadius: 20,
    },


    iconStyle2: {
        backgroundColor: '#dfe0e4',
        paddingLeft: 15,
        borderBottomLeftRadius: 20,
        borderTopLeftRadius: 20,
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
    alertCancelBtnStyle:
    {
        borderRadius: 50, width: 120, borderColor: '#e95344', borderWidth: 1
    },
    alertConfirmBtnTxtStyle: {
        fontSize: 17, padding: 5, textAlign: 'center', fontWeight: 'bold'
    },
    alertCancelBtnTxtStyle:
    {
        fontSize: 17, padding: 5, textAlign: 'center', fontWeight: 'bold', color: '#3a3b40'
    },
    alertContentContainerStyle: {
        borderRadius: 15, width: 300
    }
});