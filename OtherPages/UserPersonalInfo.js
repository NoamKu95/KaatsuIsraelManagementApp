//Outer Imports:
import React from 'react';
import { StatusBar } from 'react-native';
import { Text, View, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { Divider } from 'react-native-paper';

//Inner Imports:
import Header from '../Components/Header';

//Icons:
import { MaterialCommunityIcons } from '@expo/vector-icons';




export default class UserPersonalInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

            //User info:
            userPersonalCode: '',
            userFirstName: '',
            userLastName: '',
            userEmail: '',
            userNewEmail: '',
            userPhone: '',
            userCurrentPass: '',
            userNewPass: '',
            isChangePW: false,

            //Alerts:
            showAlert: false,
            alertTitle: '',
            alertMessage: '',

            userRowVersion: '',

            //Loading Animation:
            spinner: false,

            //Passwords Security:
            showCurrentPassword: false,
            showNewPassword: false,
        }
    }



    componentDidMount() {

        this.fetchAllData();
    }


    fetchAllData = async () => {

        await this.getUserPersonalCode();
        this.onPageFocus();
    }


    componentWillUnmount() {

        this.onPageFocus();
    }


    //Get the user's personal code from the AS:
    getUserPersonalCode = async () => {

        try {
            const jsonValue = await AsyncStorage.getItem('userDetails')

            if (jsonValue != null) {
                let user = JSON.parse(jsonValue);

                this.setState({ userPersonalCode: user.d_PersonalCode });

                this.getUserDetails();
            }
        } catch {

            this.setState({
                alertTitle: "שגיאה",
                alertMessage: "התרחשה שגיאה בשליפת מידע אודות המשתמש מהאחסון המקומי",
                showAlert: true
            })
        }
    }


    //Get the user details from the DB based on his personal code:
    getUserDetails = async () => {

        const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/distributer/${this.state.userPersonalCode}/`;
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

                        this.setState({

                            userFirstName: result.d_FirstName,          // first name
                            userLastName: result.d_LastName,            // last name
                            userEmail: result.d_Email,                  //email
                            userPhone: result.d_PhoneNumber,            //phone
                            userRowVersion: result.RowVersion
                        })
                    }
                    else if (result == 404) {

                        this.setState({
                            alertMessage: 'לא נמצאה התאמה במסד הנתונים לנתוני המשתמש',
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
                        alertMessage: 'התרחשה תקלה בתקשורת עם מסד הנתונים. נא לנסות שנית             ' + error,
                        alertTitle: 'שגיאה',
                        showAlert: true
                    })
                }
            )
    }


    //Add a listener to the page's focus:
    onPageFocus = () => {

        this.props.navigation.addListener('focus', () => {

            this.getUserPersonalCode();
        })
    }


    //Check each of the inputs in the page:
    checkUpdatedinfo = () => {

        if (this.state.userFirstName == '') {

            this.setState({
                alertTitle: "שגיאה",
                alertMessage: "נא להזין שם פרטי",
                showAlert: true
            });
        }
        else {

            if (this.state.userLastName == '') {

                this.setState({
                    alertTitle: "שגיאה",
                    alertMessage: "נא להזין שם משפחה",
                    showAlert: true
                });
            }
            else {

                if (this.state.userEmail == '') {

                    this.setState({
                        alertTitle: "שגיאה",
                        alertMessage: "נא להזין כתובת אימייל",
                        showAlert: true
                    });
                }
                else {

                    let reg = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
                    let email = this.state.userEmail;
                    if (reg.test(email) === false) {

                        this.setState({
                            alertTitle: "שגיאה",
                            alertMessage: "כתובת המייל שהוזנה אינה תקינה",
                            showAlert: true
                        });
                    }
                    else {

                        if (this.state.userPhone.length != 10) {

                            this.setState({
                                alertTitle: "שגיאה",
                                alertMessage: "מספר הטלפון שהוזן אינו תקין",
                                showAlert: true
                            });
                        }
                        else {

                            this.saveUpdatedInfo();
                        }
                    }
                }
            }
        }
    }


    //Check if user is changind password + if his new pass is legit:
    checkPasswordChange = () => {

        if (this.state.userCurrentPass == '' || this.state.userNewPass == '') {
            this.setState({
                alertTitle: 'שגיאה',
                alertMessage: 'לצורך עדכון סיסמא אישית חובה להזין סיסמא קיימת וסיסמא חדשה',
                showAlert: true,
            })
        }

        else if (this.state.userCurrentPass.length < 7 || this.state.userCurrentPass.length > 20) {
            this.setState({
                alertTitle: 'שגיאה',
                alertMessage: 'על הסיסמא הנוכחית להיות באורך של 7 תווים לפחות',
                showAlert: true,
            })
        }

        else if (this.state.userNewPass.length < 7 || this.state.userNewPass.length > 20) {
            this.setState({
                alertTitle: 'שגיאה',
                alertMessage: 'על הסיסמא החדשה להיות באורך של 7 תווים לפחות',
                showAlert: true,
            })
        }

        else {

            this.setState({
                spinner: true
            })


            const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/getcurrentpass/${this.state.userPersonalCode}`;
            fetch(apiUrl,
                {
                    method: 'GET',
                    headers: new Headers({
                        'Content-Type': 'application/json; charset=UTF-8',
                        'Accept': 'application/json; chartset=UTF-8',
                    })
                })
                .then(res => {

                    return res.status == 500 ?
                        500
                        :
                        res.status == 404 ?
                            404
                            :
                            res.status == 200 ?
                                res.json()
                                :
                                null; //Check if the api worked OK.
                })
                .then(

                    (result) => {

                        if (result != null && result != 404 && result != 500) {

                            // result =  the current pass from the DB
                            if (result != this.state.userCurrentPass) {

                                //User typed in a wrong current password
                                this.setState({
                                    spinner: false,
                                    alertTitle: 'שגיאה',
                                    alertMessage: 'הסיסמא הנוכחית שהוקלדה שגויה',
                                    showAlert: true,
                                })
                            }
                            else {

                                //Do change the password of the user
                                this.sendNewPasswordToDB();
                            }
                        }
                        else if (result == 404) {

                            //No match to the user in the DB
                            this.setState({
                                spinner: false,
                                alertTitle: 'אופס!',
                                alertMessage: 'לא נמצאה התאמה במסד הנתונים לנתוני המשתמש',
                                showAlert: true,
                            })
                        }
                        else if (result == 500) {

                            this.setState({
                                spinner: false,
                                alertTitle: 'שגיאה',
                                alertMessage: 'התרחשה תקלה בשליפת נתוני סיסמא קיימת במסד הנתונים. נא לנסות שנית',
                                showAlert: true
                            });
                        }
                        else {

                            this.setState({
                                spinner: false,
                                alertTitle: 'שגיאה',
                                alertMessage: 'התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית',
                                showAlert: true
                            });
                        }
                    },
                    (error) => {

                        //an error occured in the server side
                        this.setState({
                            spinner: false,
                            alertTitle: 'שגיאה',
                            alertMessage: 'התרחשה תקלה בתקשורת עם מסד הנתונים. נא לנסות שנית             ' + error,
                            showAlert: true
                        })
                    }
                );
        }
    }



    //sending password object to DB
    sendNewPasswordToDB = () => {

        let newPass = this.state.userNewPass;

        //the new sending password object
        let passwordObject = {
            d_Password: newPass,
            RowVersion: this.state.userRowVersion
        }

        const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/Updateuserpassword/${this.state.userPersonalCode}`;
        fetch(apiUrl,
            {
                method: 'POST',
                body: JSON.stringify(passwordObject),
                headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json; chartset=UTF-8',
                })
            })
            .then(res => {

                return res.status == 500 ?
                    500
                    :
                    res.status == 404 ?
                        404
                        :
                        res.status == 200 ?
                            res.json()
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

                    if (result != null && result != 404 && result != 500 && result != 409 && result != 400) {

                        this.setState({
                            spinner: false,
                            alertTitle: 'פעולה בוצעה בהצלחה',
                            alertMessage: result,
                            showAlert: true,
                            userNewPass: '',
                            userCurrentPass: ''

                        });

                        this.bringTheDistributerFromDBToUpdateLS();
                    }
                    else if (result == 400) {

                        this.setState({
                            spinner: false,
                            alertTitle: 'אופס!',
                            alertMessage: 'מישהו נוסף מבצע שמירה במקביל. נא לרענן את העמוד ולנסות שנית',
                            showAlert: true,
                            userNewPass: '',
                            userCurrentPass: ''
                        });
                    }
                    else if (result == 404) {

                        this.setState({
                            spinner: false,
                            alertTitle: 'אופס!',
                            alertMessage: 'לא נמצאה התאמה במסד הנתונים לנתוני המשתמש',
                            showAlert: true,
                            userNewPass: '',
                            userCurrentPass: ''
                        });
                    }
                    else if (result == 409) {

                        this.setState({
                            spinner: false,
                            alertTitle: 'אופס!',
                            alertMessage: 'הנתונים שהוזנו אינם עומדים בתנאי השרת ומסד הנתונים. נא לבדוק את הנתונים שהוזנו ולנסות שנית',
                            showAlert: true,
                            userNewPass: '',
                            userCurrentPass: ''
                        });
                    }
                    else if (result == 500) {

                        this.setState({
                            spinner: false,
                            alertTitle: 'שגיאה',
                            alertMessage: 'התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית',
                            showAlert: true,
                            userNewPass: '',
                            userCurrentPass: ''
                        });
                    }
                    else {

                        this.setState({
                            spinner: false,
                            alertTitle: 'שגיאה',
                            alertMessage: 'התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית',
                            showAlert: true,
                            userNewPass: '',
                            userCurrentPass: ''
                        });
                    }
                },
                (error) => {

                    this.setState({
                        spinner: false,
                        alertTitle: 'שגיאה',
                        alertMessage: 'התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית               ' + error,
                        showAlert: true,

                    });
                }
            );
    }


    //Update the user's new info in the DB:
    saveUpdatedInfo = () => {

        this.setState({ spinner: true });

        //BUILD the object we'll send to the server:
        let updatedUserDetails = {

            d_FirstName: this.state.userFirstName,
            d_LastName: this.state.userLastName,
            d_PhoneNumber: this.state.userPhone,
            d_Email: this.state.userEmail.toLowerCase(),
            RowVersion: this.state.userRowVersion
        }

        //Update the details in the DB:
        const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/updateuserpersonalinfo/${this.state.userPersonalCode}`;
        fetch(apiUrl,
            {
                method: 'PUT',
                body: JSON.stringify(updatedUserDetails),
                headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json; chartset=UTF-8',
                })
            })
            .then(res => {

                return res.status == 500 ?
                    500
                    :
                    res.status == 409 ?
                        409
                        :
                        res.status == 404 ?
                            404
                            :
                            res.status == 400 ?
                                400
                                :
                                res.status == 200 ?
                                    res.json()
                                    :
                                    null;
            })
            .then(

                (result) => {

                    if (result != null && result != 404 && result != 500 && result != 400 && result != 409) {

                        this.setState({
                            spinner: false,

                            alertTitle: 'פעולה בוצעה בהצלחה',
                            alertMessage: result,
                            showAlert: true,
                        });

                        this.bringTheDistributerFromDBToUpdateLS();
                    }
                    else if (result == 400) {

                        this.setState({

                            spinner: false,
                            alertTitle: 'אופס!',
                            alertMessage: 'מישהו נוסף מבצע שמירה במקביל. נא לרענן את העמוד ולנסות שנית',
                            showAlert: true
                        });
                    }
                    else if (result == 404) {

                        this.setState({

                            spinner: false,
                            alertTitle: 'אופס!',
                            alertMessage: 'לא נמצאה התאמה במסד הנתונים לנתוני המשתמש',
                            showAlert: true
                        });
                    }
                    else if (result == 409) {

                        this.setState({

                            spinner: false,
                            alertTitle: 'שגיאה',
                            alertMessage: 'הנתונים שהוזנו אינם עומדים בתנאי השרת ומסד הנתונים. נא לבדוק את הנתונים שהוזנו ולנסות שנית',
                            showAlert: true
                        });
                    }
                    else if (result == 500) {

                        this.setState({
                            spinner: false,
                            alertTitle: 'שגיאה',
                            alertMessage: 'התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית',
                            showAlert: true
                        });
                    }
                    else {

                        this.setState({
                            spinner: false,
                            alertTitle: 'שגיאה',
                            alertMessage: 'התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית',
                            showAlert: true
                        });
                    }
                },
                (error) => {

                    this.setState({
                        spinner: false,
                        alertTitle: 'שגיאה',
                        alertMessage: 'התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית                  ' + error,
                        showAlert: true
                    });
                }
            );
    }


    //send the new user with the new insert details to the local storage
    bringTheDistributerFromDBToUpdateLS = () => {

        //Re-fetch the whole data of the user from the DB:
        const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/distributer/${this.state.userPersonalCode}`;
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

                (resultOfGet) => {

                    if (resultOfGet != 404 && resultOfGet != 500 && resultOfGet != null) {

                        // Update the local storage
                        this.storeUserDataToAS(resultOfGet);
                    }
                    else if (result == 404) {

                        this.setState({
                            alertMessage: 'לא נמצאה התאמה במסד הנתונים לנתוני המשתמש',
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
                        spinner: false,
                        alertTitle: 'שגיאה',
                        alertMessage: 'התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית                  ' + error,
                        showAlert: true
                    });
                }
            );
    }


    //Save the updated user info to AS:
    storeUserDataToAS = async (userNewData) => {

        //Save the new user's data to the Async Storage:
        await AsyncStorage.setItem('userDetails', JSON.stringify(userNewData));
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
                    textStyle={{ color: 'white', fontSize: 26, fontWeight: 'bold' }}
                    color={'white'}
                    animation={'fade'}
                    overlayColor={'rgba(58, 59, 64, 0.65)'}
                />

                <ScrollView>

                    <View style={styles.mainContainer}>

                        <Text style={styles.heading}>עריכת פרטים אישיים</Text>

                        <View>
                            <Text style={styles.fieldText}>עדכון פרטים:</Text>
                        </View>


                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldHeading}>שם פרטי:</Text>
                            <TextInput
                                defaultValue={this.state.userFirstName}
                                onChangeText={(e) => this.setState({ userFirstName: e })}
                                maxLength={20} style={styles.textInputStyle}
                            >
                            </TextInput>
                        </View>


                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldHeading}>שם משפחה:</Text>
                            <TextInput
                                defaultValue={this.state.userLastName}
                                onChangeText={(e) => this.setState({ userLastName: e })}
                                maxLength={20} style={styles.textInputStyle}
                            >
                            </TextInput>
                        </View>


                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldHeading}>טלפון:</Text>
                            <TextInput
                                defaultValue={this.state.userPhone}
                                keyboardType='number-pad' maxLength={10} style={styles.textInputStyle}
                                onChangeText={(e) => this.setState({ userPhone: e })}
                            >
                            </TextInput>
                        </View>


                        <View style={styles.viewContainer}>

                            <Text style={styles.fieldHeading}>אימייל:</Text>
                            <TextInput
                                defaultValue={this.state.userEmail}
                                keyboardType='email-address'
                                onChangeText={(e) => this.setState({ userEmail: e })}
                                maxLength={40} style={styles.textInputStyle}
                            >
                            </TextInput>
                        </View>

                        <TouchableOpacity
                            onPress={() => this.checkUpdatedinfo()}
                            style={styles.saveButton}
                        >
                            <Text style={styles.saveButtonText}>
                                שמור
                            </Text>
                        </TouchableOpacity>


                        <Divider style={{ height: 2, marginTop: 35, }} />


                        <View>
                            <Text style={styles.fieldText}>עדכון סיסמא:</Text>
                        </View>




                        {
                            this.state.showCurrentPassword ?
                                <View style={styles.viewContainer}>

                                    <Text style={styles.fieldHeading}>סיסמא נוכחית:</Text>

                                    <TextInput
                                        style={styles.passwordTextInput}
                                        onChangeText={(e) => this.setState({ userCurrentPass: e })}
                                        maxLength={20}
                                        defaultValue={this.state.userCurrentPass}
                                    >
                                    </TextInput>

                                    <MaterialCommunityIcons name="eye-outline" size={24} color="#3a3b40"
                                        style={styles.passwordIcon} onPress={() => { this.setState({ showCurrentPassword: false }) }}
                                    />

                                </View>
                                :
                                <View style={styles.viewContainer}>

                                    <Text style={styles.fieldHeading}>סיסמא נוכחית:</Text>

                                    <TextInput secureTextEntry
                                        style={styles.passwordTextInput}
                                        onChangeText={(e) => this.setState({ userCurrentPass: e })}
                                        maxLength={20}
                                        defaultValue={this.state.userCurrentPass}
                                    >
                                    </TextInput>

                                    <MaterialCommunityIcons name="eye-off-outline" size={24} color="#3a3b40"
                                        style={styles.passwordIcon} onPress={() => { this.setState({ showCurrentPassword: true }) }}
                                    />

                                </View>
                        }


                        {
                            this.state.showNewPassword ?
                                <View style={styles.viewContainer}>

                                    <Text style={styles.fieldHeading}>סיסמא חדשה:</Text>

                                    <TextInput
                                        style={styles.passwordTextInput}
                                        onChangeText={(e) => this.setState({ userNewPass: e })}
                                        maxLength={19}
                                        defaultValue={this.state.userNewPass}
                                    >
                                    </TextInput>

                                    <MaterialCommunityIcons name="eye-outline" size={24} color="#3a3b40"
                                        style={styles.passwordIcon} onPress={() => { this.setState({ showNewPassword: false }) }}
                                    />

                                </View>
                                :
                                <View style={styles.viewContainer}>

                                    <Text style={styles.fieldHeading}>סיסמא חדשה:</Text>

                                    <TextInput secureTextEntry
                                        style={styles.passwordTextInput}
                                        onChangeText={(e) => this.setState({ userNewPass: e })}
                                        maxLength={19}
                                        defaultValue={this.state.userNewPass}
                                    >
                                    </TextInput>

                                    <MaterialCommunityIcons name="eye-off-outline" size={24} color="#3a3b40"
                                        style={styles.passwordIcon} onPress={() => { this.setState({ showNewPassword: true }) }}
                                    />

                                </View>
                        }


                        <TouchableOpacity
                            onPress={() => this.checkPasswordChange()}
                            style={styles.saveButton}
                        >
                            <Text style={styles.saveButtonText}>
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


    //Page heading: 
    heading: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 30,
        marginBottom: 10
    },
    fieldHeading: {
        alignSelf: 'center',
        fontWeight: 'bold',
        width: Dimensions.get('window').width * 0.3,
    },
    fieldText: {
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 25,
        marginBottom: 10
    },


    //Text Inputs:
    textInputStyle: {
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
    passwordTextInput:
    {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 15,
        width: Dimensions.get('window').width * 0.6 * 6 / 7,
        height: 50,
        backgroundColor: 'white',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        borderColor: 'black',
        borderLeftWidth: 0,
        borderWidth: 1,
        textAlign: 'right'
    },



    //Icons:
    iconStyle: {
        backgroundColor: 'white',
        paddingLeft: 15,
        paddingTop: 11,
        borderBottomLeftRadius: 20,
        borderTopLeftRadius: 20,
        height: 50
    },
    passwordIcon:
    {
        width: Dimensions.get('window').width * 0.6 * 1 / 7, backgroundColor: 'white', height: 50, borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20, borderWidth: 1, borderRightWidth: 0,
        borderColor: 'black', paddingTop: 12, paddingLeft: 7
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
        marginTop: 15
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