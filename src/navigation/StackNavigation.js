import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../Views/Login/index';
import HomeRouteVendors from '../Views/RouteVendors';
import FormCreateRoute from '../Views/RouteVendors/CreateRoute';
import VisitirCustomer from '../Views/VisitCustumers';
import FormCreateVisit from '../Views/VisitCustumers/FormCreateVisit';
import { RenderMap } from '../Components/Map';
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
      <Stack.Screen
        name="VisistCustomer"
        component={VisitirCustomer}
        options={{
          title: 'Visitas',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FormCreateVisit"
        component={FormCreateVisit}
        options={{
          title: 'Crear Visita',
          headerShown: false,
        }}
      />
           <Stack.Screen
        name="ViewMap"
        component={RenderMap}
        options={{
          title: 'Mapa',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
