import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import StackNavigation from './StackNavigation';
const Drawer = createDrawerNavigator();
export default function Navigation() {
  return (
    <Drawer.Navigator
      initialRouteName="login"
    >
      <Drawer.Screen name="login" component={StackNavigation} 
      options={{
        headerShown:false
      }} 
      /> 
    </Drawer.Navigator>
  );
}
