//Outer Imports:
import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { useNavigation } from '@react-navigation/native';

//Inner Imports:
import Header from '../Components/Header';




export default function HistoryDataMenu(props) {

    const navigation = useNavigation();



    useEffect(() => {

        const checkFocus = props.navigation.addListener('focus', () => {
            //The screen is focused -> fetch allDataFromDB the products from the DB to be up-to-date

        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return checkFocus;
    }, []);



    return (
        <>

            <StatusBar backgroundColor='#e95344' barStyle='light-content' />

            <Header navigation={props.navigation} showArrow={true} showMenu={true} />

            <ScrollView>
                <View style={styles.mainContainer} >

                    <Text style={styles.heading}>ארכיון נתונים</Text>

                    <Text style={styles.secondaryHeading}>
                        בחר את סוג הנתונים בהם ברצונך לצפות:
                    </Text>


                    <TouchableOpacity
                        onPress={() => { navigation.navigate('SalesHistory') }}
                        style={styles.button}
                    >

                        <Text
                            style={styles.ButtonText}>
                            היסטוריית מכירות
                        </Text>

                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => { navigation.navigate('MatchesHistory') }}
                        style={styles.button}
                    >

                        <Text
                            style={styles.ButtonText}>
                            היסטוריית צימודים
                        </Text>

                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => { navigation.navigate('CustomerStatusesHistory') }}
                        style={styles.button}
                    >

                        <Text
                            style={styles.ButtonText}>
                            היסטוריית סטאטוסי לקוח
                        </Text>

                    </TouchableOpacity>

                </View>
            </ScrollView>
        </>
    );
}


const styles = StyleSheet.create({

    //Containers:
    mainContainer: {
        height: Dimensions.get('window').height,
        backgroundColor: 'white', flex: 1,
        alignItems: 'center'
    },


    //Button styles
    button: {
        backgroundColor: '#e95344',
        borderRadius: 50,
        padding: 7,
        width: 335,
        height: 60,
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'center', margin: 30

    },
    ButtonText:
    {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
        alignSelf: 'center',
        fontWeight: 'bold',

    },

    secondaryHeading:
    {
        marginTop: 22,
        marginBottom: 18,
        fontSize: 17,
    },


    //Page name
    heading: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
});