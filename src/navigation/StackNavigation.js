import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../Views/Login/index'
import HomeRouteVendors from '../Views/RouteVendors';
import FormCreateRoute from '../Views/RouteVendors/CreateRoute';
export default function StackNavigation() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          title: 'Login',
          headerShown: false,          
        }}
      />   
      <Stack.Screen
        name="Home"
        component={HomeRouteVendors}
        options={{
          title: 'Home',
          headerShown: false,          
        }}
      />      
      <Stack.Screen
        name="FormCreateRoute"
        component={FormCreateRoute}
        options={{
          title: 'Kilometraje',
          headerShown: false,          
        }}
      />     
    </Stack.Navigator>
  );
}
