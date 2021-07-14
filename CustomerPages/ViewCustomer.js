//Outer Imports:
import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, TextInput, StatusBar } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as Linking from 'expo-linking';

//Our Imports:
import Header from '../Components/Header';

//Icons:
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';




export default class ViewCustomer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

            customerPersonalCode: props.route.params.thisCustomer.customerPersonalCode,         //Identifier
            customerFirstName: props.route.params.thisCustomer.customerFirstName,               // first name
            customerLastName: props.route.params.thisCustomer.customerLastName,                 // last name
            customerEmail: props.route.params.thisCustomer.customerEmail,                       //email
            customerPhone: props.route.params.thisCustomer.customerPhone,                       //phone
            customerGender: props.route.params.thisCustomer.customerGender,                     //gender

            customerFullAdress: props.route.params.thisCustomer.customerFullAdress,             //full adress (long string)
            customerEncodedAdress: '',

            customerBirthDate_DB: props.route.params.thisCustomer.customerBirthDate,            //birth date (1995-07-25T00:00:00)
            customerBirthDate_CUT: '',                                                          //birth date (1995-07-25)
            customerHealthStatus: props.route.params.thisCustomer.customerHealthStatus,         //health
            customerNotes: props.route.params.thisCustomer.customerNotes,                       //notes
            customerStatus: props.route.params.thisCustomer.customerStatus,                     //status

            customerUsePurposeString: props.route.params.thisCustomer.customerUsePurposeString,  //use purpose(s) of the customer - string "שיקום,פיטנס"
            customerSubUsePurposeString: props.route.params.thisCustomer.customerSubUsePurposeString, //sub use purposes(s) of the customer - string "הרזיה, פיטנס, הצרת היקפים"
        }
    }


    //Prepare a few fields to better display them:
    componentDidMount() {

        //prepare the encoded adress (for opening google maps navigation):
        let encoded = encodeURI(this.state.customerFullAdress);
        this.setState({ distributerEncodedAdress: encoded });

        //------------------------------------------------

        //prepare the birthdate (in a format to display):
        let reverseBD = this.props.route.params.thisCustomer.customerBirthDate.split("T")[0];
        let tempArr = reverseBD.split("-");
        this.setState({ customerBirthDate_CUT: tempArr[2] + "-" + tempArr[1] + "-" + tempArr[0] });
    }


    //Navigate to page "Edit Customer Details" + take props with us:
    moveToEditCustomer = () => {

        let c = this.props.route.params.thisCustomer;
        this.props.navigation.navigate('EditCustomerDetails', { thisCustomer: c });
    }



    render() {
        return (
            <>
                <StatusBar backgroundColor='#e95344' barStyle='light-content' />

                <Header navigation={this.props.navigation} showArrow={true} showMenu={true} />

                <ScrollView>
                    <View style={styles.mainContainer}>

                        <TouchableOpacity
                            onPress={() => this.moveToEditCustomer()}
                            style={{ flexDirection: 'row-reverse', marginTop: 10, marginLeft: 0 }}
                        >
                            <MaterialCommunityIcons name="pencil-circle" size={35} color="#e95344" />
                        </TouchableOpacity>

                        <Text style={styles.heading}>{this.state.customerFirstName + " " + this.state.customerLastName}</Text>


                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>ת. לידה:</Text>
                            <TextInput
                                editable={false} style={styles.txtInput}
                                placeholder={this.state.customerBirthDate_CUT}
                            ></TextInput>
                        </View>


                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>מגדר:</Text>
                            <TextInput
                                style={styles.txtInput}
                                editable={false} placeholder={this.state.customerGender == 'ז' ? "זכר" : "נקבה"}
                            ></TextInput>
                        </View>


                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>טלפון:</Text>
                            <TextInput
                                style={styles.textInputWithIcon}
                                editable={false} placeholder={this.state.customerPhone}
                            ></TextInput>
                            <Ionicons name="md-call" size={30} color="#e95344" style={styles.phoneIconStyle}
                                onPress={() => Linking.openURL(`tel:${this.state.customerPhone}`)}
                            />
                        </View>


                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>אימייל:</Text>
                            <TextInput
                                style={styles.txtInput}
                                editable={false} placeholder={this.state.customerEmail}
                            ></TextInput>
                        </View>


                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>כתובת:</Text>
                            <TextInput
                                editable={false}
                                style={styles.textInputWithIcon}
                                editable={false}
                                placeholder={this.state.customerFullAdress}
                                multiline={true}
                                numberOfLines={this.state.customerFullAdress.length > 25 ? 2 : 1}
                                style={this.state.customerFullAdress.length > 25 ? styles.adressTextInputLONG : styles.textInputWithIcon}
                            >
                            </TextInput>
                            <Ionicons name="location-sharp" size={30} color="#e95344"
                            style={this.state.customerFullAdress.length > 25 ? styles.mapsIconTwoLinesStyle : styles.mapsIconStyle}
                                onPress={() => Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${this.state.distributerEncodedAdress}&travelmode=driving&dir_action=navigate`)} />
                        </View>


                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>תת- מטרת שימוש:</Text>
                            <TextInput
                                editable={false}
                                placeholder={this.state.customerSubUsePurposeString}
                                multiline={true}
                                numberOfLines={this.state.customerSubUsePurposeString.length > 34 ? 2 : 1}
                                style={this.state.customerSubUsePurposeString.length > 34 ? styles.longTextInput : styles.txtInput}
                            ></TextInput>
                        </View>


                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>מטרת שימוש:</Text>
                            <TextInput
                                style={styles.txtInput}
                                editable={false} placeholder={this.state.customerUsePurposeString}
                            ></TextInput>
                        </View>


                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>מצב בריאותי:</Text>
                            <TextInput
                                style={styles.txtInput}
                                editable={false} placeholder={this.state.customerHealthStatus}
                            ></TextInput>
                        </View>


                        <View style={styles.viewContainer}>
                            <Text style={styles.fieldText}>סטאטוס:</Text>
                            <TextInput
                                style={styles.txtInput}
                                editable={false} placeholder={this.state.customerStatus}
                            ></TextInput>
                        </View>


                        <View style={styles.viewContainer}>
                            <Text style={styles.notesHeading}>הערות:</Text>
                            <TextInput
                                placeholder={this.state.customerNotes}
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

    //Container:
    mainContainer: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: 'white'
    },
    viewContainer: {
        flexDirection: 'row',
        alignItems: 'baseline'
    },

    //Headings:
    heading: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10
    },
    fieldText: {
        fontWeight: 'bold',
        flex: 1,
        alignSelf: 'center'
    },
    notesHeading:
    {
        fontWeight: 'bold',
        flex: 1,
        alignSelf: 'flex-start',
        marginTop: 27
    },

    //Inputs:
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
    },
    textInputWithIcon:
    {
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
    longTextInput: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 15,
        minWidth: 190,
        height: 65,
        backgroundColor: '#dfe0e4',
        borderRadius: 20,
        flex: 1,
        textAlign: 'right',
    },
    adressTextInputLONG:
    {
        paddingVertical: 10,
        paddingHorizontal: 20,
        paddingRight: 25,
        marginVertical: 15,
        minWidth: 142,
        height: 65,
        backgroundColor: '#dfe0e4',
        flex: 1,
        textAlign: 'right',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
    },
    multilineInput: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginVertical: 15,
        minWidth: 200,
        maxWidth: 350,
        height: 150,
        backgroundColor: '#dfe0e4',
        borderRadius: 20,
        flex: 1,
        textAlign: 'right',
        textAlignVertical: 'top',
        minHeight: 100
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
});