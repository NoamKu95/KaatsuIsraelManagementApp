//Outer Imports:
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

//Inner Imports:
import DataDashboard from '../Dashboard/DataDashboard';
import ConfirmDenyMatches from '../LeadsManagementPages/ConfirmDenyMatches';
import LeadsAwaitingMatches from '../LeadsManagementPages/LeadsAwaitingMatches';
import MatchDetails from '../LeadsManagementPages/MatchDetails';
import ViewDistributer from '../DistributerPages/ViewDistributer';
import EditDistributerDetails from '../DistributerPages/EditDistributerDetails';
import DistributersLists from '../DistributerPages/DistributersLists';
import DeploymentMap from '../OtherPages/DeploymentMap';
import AddNewDistributer from '../DistributerPages/AddNewDistributer';
import MakeSale from '../OtherPages/MakeSale';
import AddNewLead from '../CustomerPages/AddNewLead';
import CalendarPage from '../CalendarPages/CalendarPage';
import OccurenceDetails from '../CalendarPages/OccurenceDetails';
import AddOccurence from '../CalendarPages/AddOccurence';




export default class DashboardStack extends React.Component {

    render() {
        const Stack = createStackNavigator();

        return (
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="DataDashboard">
                <Stack.Screen name="DataDashboard" component={DataDashboard} />
                <Stack.Screen name="ConfirmDenyMatches" component={ConfirmDenyMatches} />
                <Stack.Screen name="LeadsAwaitingMatches" component={LeadsAwaitingMatches} />
                
                <Stack.Screen name="MatchDetails" component={MatchDetails} />

                <Stack.Screen name="DeploymentMap" component={DeploymentMap} />
                <Stack.Screen name="DistributersLists" component={DistributersLists} />
                <Stack.Screen name="AddNewDistributer" component={AddNewDistributer} />
                <Stack.Screen name="ViewDistributer" component={ViewDistributer} />
                <Stack.Screen name="EditDistributerDetails" component={EditDistributerDetails} />

                <Stack.Screen name="MakeSale" component={MakeSale} />

                <Stack.Screen name="AddNewLead" component={AddNewLead} />

                <Stack.Screen name="CalendarPage" component={CalendarPage} />
                <Stack.Screen name="OccurenceDetails" component={OccurenceDetails} />
                <Stack.Screen name="AddOccurence" component={AddOccurence} />

            </Stack.Navigator>
        )
    }
}

