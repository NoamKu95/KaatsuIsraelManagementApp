//Outer Imports:
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

//Inner Imports:
import SaleBlankPage from '../OtherPages/SaleBlankPage';
import MakeSale from '../OtherPages/MakeSale';



export default class SaleStack extends React.Component {

    render() {
        const Stack = createStackNavigator();

        return (
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="SaleBlankPage">
                <Stack.Screen name="SaleBlankPage" component={SaleBlankPage} />
                <Stack.Screen name="MakeSale" component={MakeSale} />
            </Stack.Navigator>
        )
    }
}