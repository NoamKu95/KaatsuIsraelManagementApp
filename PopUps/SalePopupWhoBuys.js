//Outer Imports:
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

//Icons:
import { FontAwesome5 } from '@expo/vector-icons';

//Inner Imports:
import SalePopupCheckCustomerInSystem from './SalePopupCheckCustomerInSystem';




export default function SalePopupWhoBuys(props) {

    const [modalVisible, setModalVisible] = useState(false); //For opening and closing the popup

    const MoveToSaleToDistributer = () => {

        //NAVIGATE TO SALE - DISTRIBUTER
        props.navigation.navigate('MakeSale', { buyer: 'distributer' });

        //Close modal
        setModalVisible(!modalVisible);
    }

    const closeFirstPopUp = () => { //פונקציה לסגירת הפופאפ הראשון דרך העברה של ההפעלה שלו לפרופס של הפופאפ השני

        setModalVisible(!modalVisible);
    }



    return (
        <View style={styles.centeredView}>

            <Modal animationType="slide" transparent={true} visible={modalVisible} >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                            }}>
                            <FontAwesome5 name="long-arrow-alt-left" size={40} color="#e95344" />
                        </TouchableOpacity>

                        <Text style={styles.modalText}> מי הרוכש? </Text>

                        <View style={styles.buttonsWrapper}>

                            <SalePopupCheckCustomerInSystem navigation={props.navigation} closeFirstPopUp={closeFirstPopUp} />

                            <TouchableOpacity
                                style={styles.salesButton}
                                onPress={MoveToSaleToDistributer}>
                                <Text style={styles.salesButtonText}>
                                    מפיץ
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
                    בצע מכירה
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
        padding: 7,
        width: 335,
        height: 45,
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    startButtonText:
    {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
        alignSelf: 'center',
        fontWeight: 'bold'
    },

    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 22,
    },

    salesButton: {
        backgroundColor: '#e95344',
        borderRadius: 50,
        width: 130,
        height: 45,
        display: 'flex',
        justifyContent: 'center',
        margin: 8,
        marginBottom: 15
    },

    salesButtonText: {
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