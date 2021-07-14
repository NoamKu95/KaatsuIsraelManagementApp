//Outer Imports:
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

//Inner Imports:
import Login from '../LoginLogoutForgot/Login';
import ForgotPassword from '../LoginLogoutForgot/ForgotPassword';
import Logout from '../LoginLogoutForgot/Logout';



export default class LoginStack extends React.Component {

    render() {

        const Stack = createStackNavigator();

        return (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={Login}  />
                <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                <Stack.Screen name="Logout" component={Logout} />
            </Stack.Navigator>
        )
    }
}