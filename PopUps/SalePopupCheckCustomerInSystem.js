//Outer Imports:
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

//Icons:
import { FontAwesome5 } from '@expo/vector-icons';



export default function SalePopupCheckCustomerInSystem(props) {

    const [modalVisible, setModalVisible] = useState(false); //For opening and closing the popup


    const MoveToSellToExistingCustomer = () => {

        //NAVIGATE TO SALE - CUSTOMER EXISTS
        props.navigation.navigate('MakeSale', { buyer: 'customer', isInSystem: true });
        props.closeFirstPopUp(); //close the popup from before


        setModalVisible(!modalVisible); // close current popup
    }

    const MoveToSellToNotExistingCustomer = () => {

        //NAVIGATE TO SALE - CUSTOMER DOESNT EXIST
        props.navigation.navigate('MakeSale', { buyer: 'customer' });
        props.closeFirstPopUp();

        setModalVisible(!modalVisible);
    }



    return (
        <View >
            <Modal animationType="slide" transparent={true} visible={modalVisible} >

                <View style={styles.centeredView}>

                    <View style={styles.modalView}>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <FontAwesome5 name="long-arrow-alt-left" size={40} color="#e95344" />
                        </TouchableOpacity>

                        <Text style={styles.modalText}>האם הלקוח קיים במערכת? </Text>

                        <View style={styles.buttonsWrapper}>

                            <TouchableOpacity
                                style={styles.customerExistButton}
                                onPress={MoveToSellToExistingCustomer}>
                                <Text style={styles.buttonText}>
                                    כן
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.customerNotExistButton}
                                onPress={MoveToSellToNotExistingCustomer}>
                                <Text style={styles.buttonText}>
                                    לא
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <TouchableOpacity
                onPress={() => { setModalVisible(true); }}
                style={styles.startButton}>
                <Text
                    style={styles.startButtonText}>
                    לקוח
                </Text>
            </TouchableOpacity>

        </View>
    );
}


const styles = StyleSheet.create({

    buttonsWrapper:
    {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    startButton: {
        backgroundColor: '#e95344',
        borderRadius: 50,
        width: 130,
        height: 45,
        display: 'flex',
        justifyContent: 'center',
        margin: 8,
        marginBottom: 15
    },
    startButtonText:
    {
        color: 'white',
        textAlign: 'center',
        fontSize: 20,
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 22,
    },

    customerExistButton: {
        backgroundColor: '#42c181',
        borderRadius: 50,
        width: 130,
        height: 45,
        display: 'flex',
        justifyContent: 'center',
        margin: 8,
        marginBottom: 15
    },
    customerNotExistButton: {
        backgroundColor: '#e95344',
        borderRadius: 50,
        width: 130,
        height: 45,
        display: 'flex',
        justifyContent: 'center',
        margin: 8,
        marginBottom: 15
    },

    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 20,
        alignSelf: 'center',
        fontWeight: 'bold'
    },

    modalView: {
        backgroundColor: 'white',
        borderRadius: 13,
        paddingHorizontal: 23,//הצדדים של הפופאפ
        paddingVertical: 7,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

    modalText: {
        marginBottom: 30,
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold'
    },
});