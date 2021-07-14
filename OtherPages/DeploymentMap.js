//Outer Imports:
import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import { Dimensions } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import MapView, { Callout } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import Spinner from 'react-native-loading-spinner-overlay';

//Inner Imports:
import Header from '../Components/Header';

//Icons:
import { MaterialIcons } from '@expo/vector-icons';




export default function DeploymentMap(props) {


    //The center of the map:
    const [focusRegion, setFocusRegion] = useState({
        latitude: 32.114236,
        longitude: 34.878466,
        latitudeDelta: 1.4122,
        longitudeDelta: 1.4121
    });


    // _________________Map Styles _________________ //
    const [mapStyleToDisplay, setMapStyleToDisplay] = useState('צבע');
    const [defaulyMapStyle, setMapStyle] = useState([
        {
            "featureType": "administrative.neighborhood",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.business",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "stylers": [
                {
                    "lightness": 20
                },
                {
                    "weight": 0.5
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.local",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "transit",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        }
    ])
    const [whiteMapStyle, setWhiteMapStyle] = useState([
        {
            "stylers": [
                {
                    "color": "#f5f5f5"
                },
                {
                    "weight": 1
                }
            ]
        },
        {
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#f5f5f5"
                }
            ]
        },
        {
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "elementType": "labels.text",
            "stylers": [
                {
                    "color": "#272720"
                }
            ]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#000000"
                }
            ]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#f5f5f5"
                }
            ]
        },
        {
            "featureType": "administrative.land_parcel",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#bdbdbd"
                }
            ]
        },
        {
            "featureType": "administrative.neighborhood",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#eeeeee"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#757575"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#e5e5e5"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#9e9e9e"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#757575"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#dadada"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#616161"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#9e9e9e"
                }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#e5e5e5"
                }
            ]
        },
        {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#eeeeee"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#c9c9c9"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#9e9e9e"
                }
            ]
        }
    ]);
    const [darkMapStyle, setDarkMapStyle] = useState([
        {
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "weight": 0.5
                }
            ]
        },
        {
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#212121"
                }
            ]
        },
        {
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#757575"
                }
            ]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#212121"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#757575"
                },
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative.country",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#9e9e9e"
                }
            ]
        },
        {
            "featureType": "administrative.locality",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#bdbdbd"
                }
            ]
        },
        {
            "featureType": "poi",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#757575"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#181818"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#616161"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#1b1b1b"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#2c2c2c"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#8a8a8a"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#373737"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#3c3c3c"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#4e4e4e"
                }
            ]
        },
        {
            "featureType": "road.local",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#616161"
                }
            ]
        },
        {
            "featureType": "transit",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#757575"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#000000"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#3d3d3d"
                }
            ]
        }
    ]);


    // _________________ Map Zoom Level _________________ //
    const [zoomLevel, setZoomLevel] = useState('רמת כתובות');               // can be: רמת אזורים or רמת כתובות



    // _________________ Markers _________________ //
    const [markersSetToShow, setMarkersSetToShow] = useState('אזורים');     // what type of markers to show on the screen: אזורים, מפיצים, לקוחות, משולב

    //Makers of ZONES ONLY :
    const [zoneMarkersList, setZoneMarkersList] = useState([]);

    //Makers of DISTRIBUTERS ONLY :
    const [distributersMarkersList, setDistributersMarkersList] = useState([]);

    //Markers of CUSTOMERS ONLY :
    const [customersMarkersList, sestCustoemrsMarkersList] = useState([]);

    //Markers of both DISTRIBUTERS & CUSTOEMRS :
    const [combinedMarkers, setCombinedMarkers] = useState([]);



    // _________________Alerts _________________ //
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');


    //Loading animation:
    const [spinner, setSpinner] = useState(true);


    // -------------------------------------------------------------------------------------------------------





    useEffect(() => {

        const checkFocus = props.navigation.addListener('focus', () => {
            //The screen is focused -> fetch to keep the page up-to-date

            fetchAllData();
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return checkFocus;
    }, []);


    // -------------------------------------------------------------------------------------------------------


    const fetchAllData = async () => {

        await fetchDistributersLocations();
        await fetchZonesLocations();
    }




    //Get the Data needed for the Distributers-Pins:
    const fetchDistributersLocations = async () => {

        setSpinner(true);

        const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/getdistributerslocations/`;
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

                        let distributersPoints = [];
                        result.forEach(element => {

                            distributersPoints.push({
                                latlng: {
                                    latitude: element.d_Latitude,
                                    longitude: element.d_Longitude
                                },
                                title: element.d_FirstName + " " + element.d_LastName + ` (מס' אישי: ${element.d_PersonalCode})`,
                                description: `לידים חמים: ${element.d_HotLeads} \nלקוחות פעילים: ${element.d_ActiveCustomers}`
                            });
                        });

                        setDistributersMarkersList(distributersPoints); // save the data

                        fetchCustomersLocations(distributersPoints);
                    }
                    else if (result == 404) {

                        setShowAlert(true);
                        setAlertTitle('אופס!');
                        setAlertMessage('לא נמצאו מפיצים פעילים במסד הנתונים')
                    }
                    else if (result == 500) {

                        setShowAlert(true);
                        setAlertTitle('שגיאה');
                        setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית')
                    }
                    else {

                        setShowAlert(true);
                        setAlertTitle('שגיאה');
                        setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית')
                    }
                },
                (error) => {

                    setShowAlert(true);
                    setAlertTitle('שגיאה');
                    setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית             ' + error)
                }
            );
    }


    //Get the Data needed for the Customers-Pins:
    const fetchCustomersLocations = async (distributerPoints) => {

        const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/getcustomerslocations/`;
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

                        let customersPoints = [];
                        result.forEach(element => {

                            customersPoints.push({
                                latlng: {
                                    latitude: element.c_Latitude,
                                    longitude: element.c_Longitude
                                },
                                title: element.c_FirstName + " " + element.c_LastName,
                                description: `סטאטוס נוכחי: ${element.c_StatusName}`
                            });
                        });

                        sestCustoemrsMarkersList(customersPoints); // save the data

                        createCombinedMarkersList(customersPoints, distributerPoints);
                    }
                    else if (result == 404) {

                        setShowAlert(true);
                        setAlertTitle('אופס!');
                        setAlertMessage('לא נמצאו לקוחות במסד הנתונים')
                    }
                    else if (result == 500) {

                        setShowAlert(true);
                        setAlertTitle('שגיאה');
                        setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית')
                    }
                    else {

                        setShowAlert(true);
                        setAlertTitle('שגיאה');
                        setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית')
                    }
                },
                (error) => {

                    setShowAlert(true);
                    setAlertTitle('שגיאה');
                    setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית             ' + error)
                }
            );
    }


    //Get the Data needed for the Zones-Pins:
    const fetchZonesLocations = async () => {

        const apiUrl = `https://proj.ruppin.ac.il/bgroup12/prod/api/getzonessumups/`;
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

                        let zonesPoints = [];
                        result.forEach(element => {

                            zonesPoints.push({
                                latlng: {
                                    latitude: element.wa_Latitude,
                                    longitude: element.wa_Longitude
                                },
                                title: `${element.wa_Name}`,
                                description: `לידים חמים: ${element.wa_HotLeads} \nלקוחות פעילים: ${element.wa_ActiveCustomers} \nמפיצים פעילים: ${element.wa_ActiveDistributers}`
                            });
                        });

                        setZoneMarkersList(zonesPoints);
                    }
                    else if (result == 404) {

                        setShowAlert(true);
                        setAlertTitle('אופס!');
                        setAlertMessage('לא נמצאו נתוני אזורים במסד הנתונים')
                    }
                    else if (result == 500) {

                        setShowAlert(true);
                        setAlertTitle('שגיאה');
                        setAlertMessage('התרחשה שגיאה במסד הנתונים. נא לרענן את העמוד ולנסות שנית')
                    }
                    else {

                        setShowAlert(true);
                        setAlertTitle('שגיאה');
                        setAlertMessage('התרחשה תקלה בלתי צפויה במסד הנתונים. נא לרענן את העמוד ולנסות שנית')
                    }
                },
                (error) => {

                    setShowAlert(true);
                    setAlertTitle('שגיאה');
                    setAlertMessage('התרחשה תקלה בהתקשרות עם מסד הנתונים. נא לנסות שנית             ' + error)
                }
            );
    }


    //Take distirubters markers & customers markers and combine them:
    const createCombinedMarkersList = (customersPoints, distributersPoints) => {

        let combined = [];

        let distributers = distributersPoints;
        distributers.forEach(element => {
            combined.push(element)
        });
        let customers = customersPoints;
        customers.forEach(element => {
            combined.push(element)
        });

        setSpinner(false);
        setCombinedMarkers(combined);
    }



    // -------------------------------------------------------------------------------------------------------


    //Return map to default values:
    const resetMap = () => {

        setMarkersSetToShow('אזורים');
        setMapStyleToDisplay('צבע');
    }


    //Toggle the color and style of the map:
    const changeMapStyle = (movement) => {

        let options = ['בהיר', 'כהה', 'צבע'];

        let index = options.findIndex(x => x === mapStyleToDisplay); // where we are now in the array

        index += movement; // change up or down the index

        //Loop the options when they reach the end of the array
        index == -1 ?
            index = options.length - 1
            :
            index == options.length ?
                index = 0
                :
                '';

        setMapStyleToDisplay(options[index]);
    }


    //Toggle the type of markers displayed when the user is on Adresses Mode
    const changeDisplayedMarkersType = (movement) => {

        let options = ['אזורים', 'מפיצים', 'לקוחות', 'משולב'];

        let index = options.findIndex(x => x === markersSetToShow); // where we are now in the array

        index += movement; // change up or down the index

        //Loop the options when they reach the end of the array
        index == -1 ?
            index = options.length - 1
            :
            index == options.length ?
                index = 0
                :
                '';

        setMarkersSetToShow(options[index]);
    }


    // -------------------------------------------------------------------------------------------------------


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

            <Spinner
                visible={spinner}
                textContent={'טוען...'}
                textStyle={styles.spinnerTextStyle}
                color={'white'}
                animation={'fade'}
                overlayColor={'rgba(58, 59, 64, 0.65)'}
            />

            <View style={styles.listsButtonsContainer}>

                <TouchableOpacity style={styles.buttonStyle} onPress={() => props.navigation.navigate('DistributersLists')}>
                    <Text style={styles.buttonTextStyle}>
                        רשימת מפיצים
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonStyle} onPress={() => props.navigation.navigate('AddNewDistributer')}>
                    <Text style={styles.buttonTextStyle}>
                        הוספת מפיץ
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonStyle} onPress={() => props.navigation.navigate('customerStack')}>
                    <Text style={styles.buttonTextStyle}>
                        רשימת לקוחות
                    </Text>
                </TouchableOpacity>

            </View>

            <View style={styles.upSectionContainer}>

                <View style={styles.swichableContainer}>

                    {
                        zoomLevel == 'רמת אזורים' ?
                            <MaterialIcons name="keyboard-arrow-right" size={25} color="#3a3b40" />
                            :
                            <MaterialIcons name="keyboard-arrow-right" size={25} color="white" onPress={() => changeDisplayedMarkersType(-1)} />
                    }
                    <Text style={{ color: 'white', fontSize: 17 }}>{markersSetToShow}</Text>
                    {
                        zoomLevel == 'רמת אזורים' ?
                            <MaterialIcons name="keyboard-arrow-left" size={25} color="#3a3b40" />
                            :
                            <MaterialIcons name="keyboard-arrow-left" size={25} color="white" onPress={() => changeDisplayedMarkersType(1)} />
                    }

                </View>


                <View style={styles.swichableContainer}>

                    <MaterialIcons name="keyboard-arrow-right" size={25} color="white" onPress={() => changeMapStyle(-1)} />
                    <Text style={{ color: 'white', fontSize: 17 }}>{mapStyleToDisplay}</Text>
                    <MaterialIcons name="keyboard-arrow-left" size={25} color="white" onPress={() => changeMapStyle(1)} />

                </View>


                <TouchableOpacity onPress={() => resetMap()} style={{ flex: 1 }}>

                    <MaterialIcons name="my-location" size={24} color="white" />

                </TouchableOpacity>

            </View>



            <MapView
                style={styles.mapGeneralStyle}
                region={focusRegion}
                provider={PROVIDER_GOOGLE}
                customMapStyle=
                {
                    mapStyleToDisplay == 'צבע' ?
                        defaulyMapStyle
                        :
                        mapStyleToDisplay == 'כהה' ?
                            darkMapStyle
                            :
                            whiteMapStyle
                }
                showsCompass={false}
                showsScale={true}
                zoomTapEnabled={false}
                zoomControlEnabled={true}
                rotateEnabled={false}
                loadingEnabled={true}
                minZoomLevel=
                {
                    zoomLevel == 'רמת אזורים' ?
                        8.5
                        :
                        4
                }
                maxZoomLevel=
                {
                    zoomLevel == 'רמת אזורים' ?
                        8.5
                        :
                        15
                }
            >
                {
                    zoomLevel == 'רמת אזורים' ?

                        zoneMarkersList.map((marker, index) => (
                            <Marker
                                key={index}
                                coordinate={marker.latlng}
                                title={marker.title}
                                description={marker.description}
                                opacity={0.7}
                                image={{ uri: '../assets/PURPLE_locationMarker.png', width: 20, height: 20 }}
                            >
                                <Callout tooltip>
                                    <View >
                                        <View style={styles.tooltipBubble}>
                                            <Text style={styles.tooltipTitle}>
                                                {marker.title}
                                            </Text>
                                            <Text style={styles.tooltipContent}>
                                                {marker.description}
                                            </Text>
                                        </View>
                                        <View style={styles.bubbleArrowBorder} />
                                        <View style={styles.bubbleArrow} />
                                    </View>
                                </Callout>

                            </Marker>
                        ))

                        :

                        markersSetToShow == 'מפיצים' ?

                            distributersMarkersList.map((marker, index) => (
                                <Marker
                                    key={index}
                                    coordinate={marker.latlng}
                                    title={marker.title}
                                    description={marker.description}
                                    opacity={0.85}
                                    image={require('../assets/RED_locationMarker.png')}
                                >
                                    <Callout tooltip>
                                        <View >
                                            <View style={styles.tooltipBubble}>
                                                <Text style={styles.tooltipTitle}>
                                                    {marker.title}
                                                </Text>
                                                <Text style={styles.tooltipContent}>
                                                    {marker.description}
                                                </Text>
                                            </View>
                                            <View style={styles.bubbleArrowBorder} />
                                            <View style={styles.bubbleArrow} />
                                        </View>
                                    </Callout>
                                </Marker>
                            ))

                            :

                            markersSetToShow == 'לקוחות' ?

                                customersMarkersList.map((marker, index) => (
                                    <Marker
                                        key={index}
                                        coordinate={marker.latlng}
                                        title={marker.title}
                                        description={marker.description}
                                        opacity={0.85}
                                        image={require('../assets/GREEN_locationMarker.png')}
                                    >
                                        <Callout tooltip>
                                            <View >
                                                <View style={styles.tooltipBubble}>
                                                    <Text style={styles.tooltipTitle}>
                                                        {marker.title}
                                                    </Text>
                                                    <Text style={styles.tooltipContent}>
                                                        {marker.description}
                                                    </Text>
                                                </View>
                                                <View style={styles.bubbleArrowBorder} />
                                                <View style={styles.bubbleArrow} />
                                            </View>
                                        </Callout>
                                    </Marker>
                                ))

                                :

                                markersSetToShow == 'משולב' ?

                                    combinedMarkers.map((marker, index) => (
                                        <Marker
                                            key={index}
                                            coordinate={marker.latlng}
                                            title={marker.title}
                                            description={marker.description}
                                            opacity={0.85}
                                            image={
                                                marker.title.slice(-1) == ')' ?
                                                    require('../assets/RED_locationMarker.png')
                                                    :
                                                    require('../assets/GREEN_locationMarker.png')
                                            }
                                        >
                                            <Callout tooltip>
                                                <View >
                                                    <View style={styles.tooltipBubble}>
                                                        <Text style={styles.tooltipTitle}>
                                                            {marker.title}
                                                        </Text>
                                                        <Text style={styles.tooltipContent}>
                                                            {marker.description}
                                                        </Text>
                                                    </View>
                                                    <View style={styles.bubbleArrowBorder} />
                                                    <View style={styles.bubbleArrow} />
                                                </View>
                                            </Callout>
                                        </Marker>
                                    ))

                                    :

                                    zoneMarkersList.map((marker, index) => (
                                        <Marker
                                            key={index}
                                            coordinate={marker.latlng}
                                            title={marker.title}
                                            description={marker.description}
                                            opacity={0.7}
                                            image={require('../assets/PURPLE_locationMarker.png')}
                                        >
                                            <Callout tooltip>
                                                <View >
                                                    <View style={styles.tooltipBubble}>
                                                        <Text style={styles.tooltipTitle}>
                                                            {marker.title}
                                                        </Text>
                                                        <Text style={styles.tooltipContent}>
                                                            {marker.description}
                                                        </Text>
                                                    </View>
                                                    <View style={styles.bubbleArrowBorder} />
                                                    <View style={styles.bubbleArrow} />
                                                </View>
                                            </Callout>
                                        </Marker>
                                    ))
                }
            </MapView>
        </>
    );
}


const styles = StyleSheet.create({

    //Containers:
    listsButtonsContainer:
    {
        height: 55,
        flexDirection: 'row',
        backgroundColor: '#3a3b40',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    upSectionContainer:
    {
        flexDirection: 'row',
        backgroundColor: '#3a3b40',
        height: 45,
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    swichableContainer:
    {
        flexDirection: 'row',
    },


    //Button:
    buttonStyle:
    {
        backgroundColor: '#3a3b40',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 50,
        padding: 5,
        width: 120,
        height: 35,
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    buttonTextStyle:
    {
        color: 'white',
        textAlign: 'center',
        fontSize: 14,
        alignSelf: 'center',
        fontWeight: 'bold'
    },


    //Map:
    mapGeneralStyle:
    {
        flex: 0.7,
        width: Dimensions.get('window').width,
        minHeight: Dimensions.get('window').height * 0.82
    },


    //Tooltip:
    tooltipBubble:
    {
        flexDirection: 'column',
        alignSelf: 'flex-start',
        backgroundColor: 'white',
        borderRadius: 6,
        borderColor: '#ccc',
        borderWidth: 0.5,
        padding: 15,
    },
    bubbleArrow:
    {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: 'white',
        borderWidth: 16,
        alignSelf: 'center',
        marginTop: -32
    },
    bubbleArrowBorder:
    {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: '#007a87',
        borderWidth: 16,
        alignSelf: 'center',
        marginTop: -0.5
    },
    tooltipTitle:
    {
        fontSize: 17,
        fontWeight: 'bold'
    },
    tooltipContent:
    {
        marginVertical: 3,
        lineHeight: 14
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