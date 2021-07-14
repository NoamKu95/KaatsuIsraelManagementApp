import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import NavDrawer from './routes/drawer';

const Drawer = createDrawerNavigator();

export default function App() {

  return (
    <NavigationContainer
    >
      <NavDrawer />
    </NavigationContainer>
  );
}
