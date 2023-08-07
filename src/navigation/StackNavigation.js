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
import SelectCompany from '../Views/Company/SelectCompany';
import SelectRol from '../Views/Rol/SelectRol';
import FormFinaliceVisit from '../Views/VisitCustumers/VisitFinaliceForm';
import MenuEndVisit from '../Views/VisitCustumers/MenuEndCreatedVisit';
import FormGasoline from '../Views/Gasoline/IndexGasoline';
import ListProductHome from '../Views/Product/ListProduct';
import DetailProduct from '../Views/Product/DetailProduct';
import DetailCustomer from '../Views/Customer/DetailCustomer';
import ListDocumentHome from '../Views/Documents';
import TrackingDocumentsAsigned from '../Views/Tracking';
import TrackingDocumentInRoute from '../Views/Tracking/DocumentsInRouteTracking';
import DeliveryComponent from '../Views/Tracking/DeliveryDocuments';
import CameraLectorCode from '../Views/Count/ReadCodeCamera';
import DeliveryDocumentsChecker from '../Views/Tracking/DeliveryDocumentsChecker';
import HomePicking from '../Views/Picking/index';
import Icon from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
export default function StackNavigation() {
  const Stack = createNativeStackNavigator();
  const navigation = useNavigation();
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
          title: '',
          headerShown: true,
          headerLeft: () => (
            <Icon
              name="menu"
              size={25}
              color="gray"
              onPress={() => {
                navigation.openDrawer();
              }}
              style={{marginLeft: 20}}
            />
          ),
        }}
      />
      <Stack.Screen
        name="FormCreateRoute"
        component={FormCreateRoute}
        options={{
          title: '',
          headerShown: true,
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
      <Stack.Screen
        name="SelectCompany"
        component={SelectCompany}
        options={{
          title: 'SelectCompany',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="SelectRol"
        component={SelectRol}
        options={{
          title: 'SelectRol',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FormFinaliceVisit"
        component={FormFinaliceVisit}
        options={{
          title: 'FormFinaliceVisit',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MenuEndVisit"
        component={MenuEndVisit}
        options={{
          title: '',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="FormGasoline"
        component={FormGasoline}
        options={{
          title: '',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="ListProductHome"
        component={ListProductHome}
        options={{
          title: '',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DetailProduct"
        component={DetailProduct}
        options={{
          title: '',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DetailCustomer"
        component={DetailCustomer}
        options={{
          title: '',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ListDocumentHome"
        component={ListDocumentHome}
        options={{
          title: '',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TrackingDocumentsAsigned"
        component={TrackingDocumentsAsigned}
        options={{
          title: '',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TrackingDocumentInRoute"
        component={TrackingDocumentInRoute}
        options={{
          title: '',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DeliveryComponent"
        component={DeliveryComponent}
        options={{
          title: '',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CameraLectorCode"
        component={CameraLectorCode}
        options={{
          title: '',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DeliveryDocumentsChecker"
        component={DeliveryDocumentsChecker}
        options={{
          title: '',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="HomePicking"
        component={HomePicking}
        options={{
          title: '',
          headerShown: false,
        }}
      />      
    </Stack.Navigator>
    
  );
}
