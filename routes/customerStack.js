//Outer Imports:
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

//Inner Imports:
import CustomerTimeline from '../CustomerPages/CustomerTimeline';
import ViewCustomer from '../CustomerPages/ViewCustomer';
import EditCustomerDetails from '../CustomerPages/EditCustomerDetails';
import CustomersLists from '../CustomerPages/CustomersLists';



export default class CustomerStack extends React.Component {

    render() {
        const Stack = createStackNavigator();

        return (
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="CustomersLists">
                <Stack.Screen name="CustomersLists" component={CustomersLists} />
                <Stack.Screen name="CustomerTimeline" component={CustomerTimeline} />
                <Stack.Screen name="ViewCustomer" component={ViewCustomer} />
                <Stack.Screen name="EditCustomerDetails" component={EditCustomerDetails} />
            </Stack.Navigator>
        )
    }
}