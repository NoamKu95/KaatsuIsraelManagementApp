//Outer Imports:
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

//Inner Imports:
import OccurenceDetails from '../CalendarPages/OccurenceDetails';
import AddOccurence from '../CalendarPages/AddOccurence';
import CalendarPage from '../CalendarPages/CalendarPage'



export default class CalendarStack extends React.Component {

    render() {
        const Stack = createStackNavigator();

        return (
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="CalendarPage">
                <Stack.Screen name="CalendarPage" component={CalendarPage} />
                <Stack.Screen name="OccurenceDetails" component={OccurenceDetails} />
                <Stack.Screen name="AddOccurence" component={AddOccurence} />
            </Stack.Navigator>
        )
    }
}