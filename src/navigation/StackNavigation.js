import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../Views/Login/index';
import HomeRouteVendors from '../Views/RouteVendors';
import FormCreateRoute from '../Views/RouteVendors/CreateRoute';
import VisitirCustomer from '../Views/VisitCustumers';
import FormCreateVisit from '../Views/VisitCustumers/FormCreateVisit';
import {RenderMap} from '../Components/Map';
import {MenuVisit} from '../Views/VisitCustumers/Menu';
import VisitCreated from '../Views/VisitCustumers/VisitCreated';
import SearchCustomer from '../Views/VisitCustumers/index';
import DetailVisit from '../Views/VisitCustumers/DetailVisit';
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
      <Stack.Screen
        name="MenuVisit"
        component={MenuVisit}
        options={{
          title: 'Visitas',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="VisitCreated"
        component={VisitCreated}
        options={{
          title: 'Visitas Creadas',
          headerShown: false,
        }}
      />
          <Stack.Screen
        name="SearchCustomer"
        component={SearchCustomer}
        options={{
          title: 'Buscar Cliente',
          headerShown: false,
        }}
      />
       <Stack.Screen
        name="DetailVisit"
        component={DetailVisit}
        options={{
          title: 'DetalleVisita',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
