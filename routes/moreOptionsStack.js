//Outer Imports:
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

//Inner Imports:
import SecondaryMenu from '../OtherPages/SecondaryMenu';

// Helpfull Content:
import ViewAllAvailableHelpfullContent from '../HelpfullContentPages/ViewAvailableHelpfullContent';
import ViewEditHelpfullContent from '../HelpfullContentPages/ViewEditHelpfullContent';
import AddNewHelpfullContent from '../HelpfullContentPages/AddNewHelpfullContent';

//Manage Distributers:
import ViewDistributer from '../DistributerPages/ViewDistributer';
import EditDistributerDetails from '../DistributerPages/EditDistributerDetails';
import DistributersLists from '../DistributerPages/DistributersLists';
import DeploymentMap from '../OtherPages/DeploymentMap';
import AddNewDistributer from '../DistributerPages/AddNewDistributer';


//Manage Leads:
import ConfirmDenyMatches from '../LeadsManagementPages/ConfirmDenyMatches';
import LeadsAwaitingMatches from '../LeadsManagementPages/LeadsAwaitingMatches';
import MatchDetails from '../LeadsManagementPages/MatchDetails';

//Manage Inventory:
import ManageStock from '../OtherPages/ManageStock';

//Generate Reports:
import DownloadReports from '../GenerateReports/DownloadReports';

//Chat:
import ChatScreen from '../ChatPages/ChatScreen';
import SpecificChat from '../ChatPages/SpecificChat';

//Data History:
import HistoryDataMenu from '../DataArchive/HistoryDataMenu';
import CustomerStatusesHistory from '../DataArchive/CustomerStatusesHistory';
import MatchesHistory from '../DataArchive/MatchesHistory';
import SalesHistory from '../DataArchive/SalesHistory';

//Update Personal Info:
import UserPersonalInfo from '../OtherPages/UserPersonalInfo';

//Salary Calculator:
import SalaryCalculator from '../OtherPages/SalaryCalculator';

//System Constants:
import SystemConstants from '../SystemConstants/SystemConstants';
import AddNewProduct from '../SystemConstants/AddNewProduct';

//Logout:
import Logout from '../LoginLogoutForgot/Logout';




export default function MoreOptionsStack() {

    const Stack = createStackNavigator();

    return (
        
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="SecondaryMenu">

            {/* CUBES MENU PAGE */}
            <Stack.Screen name="SecondaryMenu" component={SecondaryMenu} />

            {/* MANAGE LEADS PAGES */}
            <Stack.Screen name="ConfirmDenyMatches" component={ConfirmDenyMatches} />
            <Stack.Screen name="LeadsAwaitingMatches" component={LeadsAwaitingMatches} />

            <Stack.Screen name="MatchDetails" component={MatchDetails} />


            {/* MANAGE DISTRIBUTERS PAGES */}
            <Stack.Screen name="DeploymentMap" component={DeploymentMap} />
            <Stack.Screen name="DistributersLists" component={DistributersLists} />
            <Stack.Screen name="AddNewDistributer" component={AddNewDistributer} />
            <Stack.Screen name="ViewDistributer" component={ViewDistributer} />
            <Stack.Screen name="EditDistributerDetails" component={EditDistributerDetails} />

            {/* MANAGE STOCK PAGE */}
            <Stack.Screen name="ManageStock" component={ManageStock} />

            {/* GENERATE REPORTS PAGE */}
            <Stack.Screen name="DownloadReports" component={DownloadReports} />

            {/* UPDATE MY DETAILS PAGE */}
            <Stack.Screen name="UserPersonalInfo" component={UserPersonalInfo} />

            {/* CHAT */}
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
            <Stack.Screen name="SpecificChat" component={SpecificChat} />

            {/* SALARY CALCULATOR */}
            <Stack.Screen name="SalaryCalculator" component={SalaryCalculator} />

            {/* HELPFULL CONTENT PAGES */}
            <Stack.Screen name="ViewAllAvailableHelpfullContent" component={ViewAllAvailableHelpfullContent} />
            <Stack.Screen name="ViewEditHelpfullContent" component={ViewEditHelpfullContent} />
            <Stack.Screen name="AddNewHelpfullContent" component={AddNewHelpfullContent} />

            {/* ARCHIVE PAGES */}
            <Stack.Screen name="HistoryDataMenu" component={HistoryDataMenu} />
            <Stack.Screen name="CustomerStatusesHistory" component={CustomerStatusesHistory} />
            <Stack.Screen name="MatchesHistory" component={MatchesHistory} />
            <Stack.Screen name="SalesHistory" component={SalesHistory} />

            {/* SYSTEM CONSTANTS PAGES */}
            <Stack.Screen name="SystemConstants" component={SystemConstants} />
            <Stack.Screen name="AddNewProduct" component={AddNewProduct} />

            {/* LOGOUT PAGE */}
            <Stack.Screen name="Logout" component={Logout} />

        </Stack.Navigator>
    )
}