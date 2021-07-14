//Outer Imports:
import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Dimensions } from 'react-native';

//ICONS:
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';

//STACKS:
import DashboardStack from '../routes/dashboardStack';
import customerStack from '../routes/customerStack';
import SaleStack from '../routes/saleStack';
import LoginStack from '../routes/loginStack';
import CalendarStack from '../routes/calendarStack';
import MoreOptionsStack from '../routes/moreOptionsStack';
import ChatStack from '../routes/chatStack';

//PAGES:
import AddNewLead from '../CustomerPages/AddNewLead';
import NotificationsList from '../OtherPages/NotificationsList';



const Drawer = createDrawerNavigator();
export default function NavDrawer() {


	return (

		<Drawer.Navigator
			initialRouteName="loginStack"
			drawerPosition='right'
			keyboardDismissMode='on-drag'
			drawerStyle={{
				backgroundColor: '#3a3b40',
				width: Dimensions.get('window').width / 1.7,
			}}
			drawerContentOptions={{
				activeTintColor: 'white',
				inactiveTintColor: 'white',
				activeBackgroundColor: '#3a3b40',
			}}
			keyboardDismissMode
		>

			{/* //דשבורד */}
			<Drawer.Screen
				name="DashboardStack"
				component={DashboardStack}
				options={{
					title: 'דשבורד',
					drawerIcon: ({ focused, size }) =>
						(<Octicons name="graph" size={24} color="white" style={{ width: 30, height: 50, marginTop: 20 }} />)
				}}
				listeners={({ navigation }) => ({
					focus: () => {
						navigation.navigate('DataDashboard');
					},
				})}
			/>


			{/* //יומן */}
			< Drawer.Screen
				name="CalendarStack"
				component={CalendarStack}
				options={{
					title: 'יומן',
					backgroundColor: 'red',
					drawerIcon: ({ focused, size }) =>
						(<Ionicons name="calendar" size={24} color="white" style={{ width: 30, height: 50, marginTop: 20 }} />)
				}}
				listeners={({ navigation }) => ({
					focus: () => {
						navigation.navigate('CalendarPage');
					},
				})}
			/>


			{/* //נוטיפיקציות */}
			<Drawer.Screen
				name="NotificationsList"
				component={NotificationsList}
				options={{
					title: 'נוטיפיקציות',
					drawerIcon: ({ focused, size }) =>
						(<Ionicons name="notifications" size={24} color="white" style={{ width: 30, height: 50, marginTop: 20 }} />)
				}}
			/>



			{/* //ביצוע מכירה */}
			<Drawer.Screen
				name="SaleStack"
				component={SaleStack}
				options={{
					title: 'ביצוע מכירה',
					drawerIcon: ({ focused, size }) =>
						(<FontAwesome5 name="cart-plus" size={21} color="white" style={{ width: 30, height: 50, marginTop: 20 }} />)
				}}
				listeners={({ navigation }) => ({
					focus: () => {
						navigation.navigate('SaleBlankPage');
					},
				})}
			/>



			{/* //הוספת ליד */}
			<Drawer.Screen
				name="AddNewLead"
				component={AddNewLead}
				options={{
					title: 'הוספת ליד',
					drawerIcon: ({ focused, size }) =>
						(<Ionicons name="person-add-sharp" size={21} color="white" style={{ width: 30, height: 50, marginTop: 20 }} />)
				}}
			/>



			{/* //רשימת לקוחות */}
			< Drawer.Screen
				name="customerStack"
				component={customerStack}
				options={{
					title: 'לקוחות',
					drawerIcon: ({ focused, size }) =>
						(<Ionicons name="md-person-circle-sharp" size={26} color="white" style={{ width: 30, height: 50, marginTop: 20 }} />)
				}}
				listeners={({ navigation }) => ({
					focus: () => {
						navigation.navigate('CustomersLists');
					},
				})}
			/>


			{/* CHAT */}
			<Drawer.Screen
				name="ChatStack"
				component={ChatStack}
				options={{
					title: `צ'אט`,
					backgroundColor: 'red',
					drawerIcon: ({ focused, size }) =>
						(<Ionicons name="chatbox" size={26} color="white" style={{ width: 30, height: 50, marginTop: 20 }} />)
				}}
			/>

			{/* פעולות נוספות */}
			<Drawer.Screen
				name="MoreOptionsStack"
				component={MoreOptionsStack}
				options={{
					title: 'פעולות נוספות',
					backgroundColor: 'red',
					drawerIcon: ({ focused, size }) =>
						(<FontAwesome name="gear" size={26} color={'white'} style={{ width: 30, height: 50, marginTop: 20 }} />)
				}}
				listeners={({ navigation }) => ({
					focus: () => {
						navigation.navigate('SecondaryMenu');
					},
				})}
			/>



			{/* // התנתקות מהמערכת */}
			< Drawer.Screen
				name="loginStack"
				component={LoginStack}
				options={{
					swipeEnabled: false,
					title: '',
				}}
				style={{backgroundColor: 'purple'}}

			/>

		</Drawer.Navigator>
	);
}
