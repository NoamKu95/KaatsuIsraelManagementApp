//Outer Imports:
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

//Inner Imports:
import ChatScreen from '../ChatPages/ChatScreen';
import SpecificChat from '../ChatPages/SpecificChat';



export default class ChatStack extends React.Component {

    render() {
        const Stack = createStackNavigator();

        return ( 
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="ChatScreen">
                <Stack.Screen name="ChatScreen" component={ChatScreen} />
                <Stack.Screen name="SpecificChat" component={SpecificChat} />
            </Stack.Navigator>
        )
    }
}