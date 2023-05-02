import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import StackNavigation from './StackNavigation';
import SelectCompany from '../Views/Company/SelectCompany';
const Drawer = createDrawerNavigator();
export default function Navigation() {
  return (
    <Drawer.Navigator
      initialRouteName="visitas"
      screenOptions={{swipeEnabled: false}}>
      <Drawer.Screen
        name="visitas"
        component={StackNavigation}
        options={{
          headerShown: false,
          gestureHandlerProps: {enabled: false},
        }}
      />
       <Drawer.Screen
        name="Compañia"
        component={SelectCompany}
        options={{
          headerShown: true,
        }}
      />

    </Drawer.Navigator>
  );
}
