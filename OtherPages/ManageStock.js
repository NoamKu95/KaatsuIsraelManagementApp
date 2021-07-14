//Outer Imports:
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import Header from '../Components/Header';
import { ScrollView } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';

//ICONS:
import { MaterialCommunityIcons } from '@expo/vector-icons';



export default function ManageStock(props) {

  //Make the textInputs editable / uneditable:
  const [canEdit, setCanEdit] = useState(false);

  //Products from the DB:
  const [productsNames, setProductsNames] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  //Alerts:
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('');

  //Products that were edited:
  const [items, setItems] = useState([]);





  useEffect(() => {

    const checkFocus = props.navigation.addListener('focus', () => {

      getAllProducts();
    });

    return checkFocus;

  }, []);


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

            //Save all the data from DB to state:
            setAllProducts(result);

            let allData = result;
            let allProductsName = []; // Will hold the NAMES of all the products

            //Get the names out of the arr of all products:
            for (let i = 0; i < allData.length; i++) {

              allProductsName.push(allData[i].p_Name)
            }

            // Turn the names arr to a unique array: (we have 4 of each e.g. "סט קומפלט")
            let uniqueProductsName = [...new Set(allProductsName)];
            setProductsNames(uniqueProductsName);

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


  //make the amounts editable:
  const startEdit = () => {
    setCanEdit(true);
  }


  //make the amounts uneditable & save new amount:
  const offEdit = () => {

    setCanEdit(false);

    if (items.length > 0) {

      sendNewAmountsOfProducts();
    }
  }


  //Everytime we type an amount => add object to edited items array:
  const putNewQuantity = (text, x) => {

    // x = obj of product
    // text = typed new amount


    //In the ddList the product ID is string. For the DB we need it as int:
    x.p_ID = parseInt(x.p_ID);


    //Check if the user typed a legit amount
    text.includes('-') || text == '' || text == '.' ?
      text = parseInt(0)
      :
      text.includes('.') ?
        text = Math.floor(parseFloat(text)) //round down the typed amount
        :
        text = parseInt(text);


    //Check if we already edited THIS product's amount:
    let exists = false;
    if (items.length > 0) { // we already edited some items

      for (let index = 0; index < items.length; index++) {

        if (x.p_ID == parseInt(items[index].p_ID)) {  // if this product's ID is inside already

          items[index].newAmount = text;    // edit it's amount
          exists = true;
          break;

        }
      }
      if (!exists) { // the ID of THIS product wasn't in the edited-items-array

        setItems([...items, { p_ID: x.p_ID, newAmount: text, ProductRowVersion: x.RowVersion }]);
      }
    }
    else { // no edited items yet

      setItems([...items, { p_ID: x.p_ID, newAmount: text, ProductRowVersion: x.RowVersion }]);
    }
  }


  //Send the edited products to the DB:
  const sendNewAmountsOfProducts = () => {

    let a = 0;
    const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/editstock`;
    fetch(apiUrl,
      {
        method: 'POST',
        body: JSON.stringify(items),
        headers: new Headers({
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json; chartset=UTF-8',
        })
      })
      .then(res => {

        return res.status == 200 ?
          res.json()
          :
          res.status == 400 ?
            400
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

          if (result != null && result != 400 && result != 409 && result != 500) {
            setItems([]);
            setAlertMessage(result);
            setAlertTitle('פעולה בוצעה בהצלחה')
            setShowAlert(true);

            //Re-fetch all products to update the RowVersion:
            getAllProducts();

          }
          else if (result == 400) {

            setAlertMessage('מישהו נוסף מבצע שמירה במקביל. נא לרענן את העמוד ולנסות שנית');
            setAlertTitle('אופס!')
            setShowAlert(true);
            setItems([]);
            getAllProducts();
          }
          else if (result == 409) {

            setAlertMessage('הנתונים שהוזנו אינם עומדים בתנאי השרת ומסד הנתונים. נא לבדוק את הנתונים שהוזנו ולנסות שנית');
            setAlertTitle('אופס!')
            setShowAlert(true);
            setItems([]);
            getAllProducts();
          }
          else if (result == 500) {

            setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
            setAlertTitle('שגיאה')
            setShowAlert(true);
            setItems([]);
            getAllProducts();
          }
          else {

            setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית');
            setAlertTitle('שגיאה')
            setShowAlert(true);
            setItems([]);
            getAllProducts();
          }
        },
        (error) => {

          setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית               ' + error);
          setAlertTitle('שגיאה')
          setShowAlert(true);
          setItems([]);
          getAllProducts();
        }
      );
  }





  //Create the main (black) lines of the collapsable:
  let allProdAndSize = []; // will hold each of the products types e.g "סט קומפלט", "רצועות רגליים" ( [ {prodObj} , {prodObj} ] )
  let prodObj;
  for (var i = 0; i < productsNames.length; i++) { // go over all the products-names-arr

    //Create the ROW object:
    prodObj = {
      pName: productsNames[i],
      sizesList: [],    // will hold the inner lines
      countAll: 0       //to count how many items we have of this product
    };

    let count = 0;
    for (let j = 0; j < allProducts.length; j++) { // go over the arr of all the products

      if (productsNames[i] == allProducts[j].p_Name) {

        prodObj.sizesList.push(allProducts[j]);
        count += parseInt(allProducts[j].p_UnitsInStock); //sum all the sizes amount
      }
    }

    prodObj.countAll = count;  // put te amount in the product object
    allProdAndSize.push(prodObj); // insert the object of product in a new array
  }







  let showAllProd = allProdAndSize.map((prod, key) => { // go over all the products
    return <Collapse key={key}>

      <CollapseHeader>
        <View>
          <Text style={styles.title}>{prod.pName}  ({prod.countAll})</Text>
        </View>
      </CollapseHeader>

      <CollapseBody>
        <View>

          {
            prod.sizesList.map((x, key) => {
              // x = object of product - certain size & its amount

              let amountInStock = x.p_UnitsInStock.toString();        //the amount of the prodact size in db (parse to string for placeholder)

              return <View
                key={key}
                style={styles.collapsibleLineContainer}
              >
                <Text style={styles.itemSizeName}>{x.p_Size}</Text>
                {
                  canEdit ?
                    <TextInput
                      onChangeText={(text => putNewQuantity(text, x))}
                      keyboardType='number-pad'
                      placeholder={amountInStock}
                      maxLength={10}
                      style={styles.theInput}>

                    </TextInput>
                    :
                    <TextInput
                      keyboardType='number-pad'
                      editable={false}
                      placeholder={amountInStock}
                      maxLength={10}
                      style={styles.theInputOffEdit}>
                    </TextInput>
                }
              </View >
            })
          }

        </View>
      </CollapseBody>

    </Collapse>
  })


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

      <View style={styles.mainContainer} >

        {
          canEdit ?
            <View style={{ height: 45 }}></View>
            :
            <TouchableOpacity onPress={startEdit} style={{ alignSelf: 'flex-end', marginTop: 15, marginHorizontal: 7 }}>
              <MaterialCommunityIcons name="pencil-circle" size={35} color="#e95344" />
            </TouchableOpacity>
        }

        <Text style={styles.heading}>מלאי מוצרים</Text>

        <ScrollView>

          {showAllProd}

        </ScrollView>

        {canEdit ?
          <TouchableOpacity onPress={offEdit} style={styles.saveButton}>
            <Text style={styles.saveButtonText}> שמירת שינויים </Text>
          </TouchableOpacity>
          :
          <></>
        }

      </View>

    </>
  )
};


const styles = StyleSheet.create({

  //Containers:
  mainContainer:
  {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'white',
    height: Dimensions.get('window').height,
    paddingHorizontal: 10
  },


  //Page name
  heading: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },


  //the name of the product (black accordion lines)
  title: {
    fontSize: 20,
    textAlign: 'center',
    backgroundColor: '#3a3b40',
    color: 'white',
    fontWeight: 'bold',
    width: 350,
    height: 55,
    alignSelf: 'center',
    justifyContent: 'center',
    borderColor: '#f8f8f8',
    borderWidth: 1,
    paddingTop: 15,
  },

  collapsibleLineContainer:
  {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    borderColor: 'black',                              //border of the lines inside the accordion
    borderWidth: 1
  },

  //Text inside the accordion (size name)
  itemSizeName: {
    width: 275,                 //width of the written content inside the accordion line (not the width of the line itself)
    height: 35,
    fontSize: 20,
    textAlign: 'center',
    backgroundColor: 'white',
    fontWeight: 'bold',
    alignSelf: 'center',
    paddingTop: 3
  },

  //text input when YES in edit mode
  theInput: {
    paddingHorizontal: 20,
    width: 72,
    height: 50,
    backgroundColor: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    borderWidth: 1,
    borderColor: 'grey',
    borderBottomColor: 'white',
    borderTopColor: 'white',
  },

  //text input when NOT in edit mode
  theInputOffEdit: {
    paddingHorizontal: 20,
    width: 72,
    height: 50,
    backgroundColor: '#dfe0e4',
    borderRadius: 0,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18
  },

  //Red save button
  saveButton: {
    backgroundColor: '#e95344',
    borderRadius: 50,
    padding: 7,
    width: Dimensions.get('window').width * 0.9,
    height: 45,
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 20
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