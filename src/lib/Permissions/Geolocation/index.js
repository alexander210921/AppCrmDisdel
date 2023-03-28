import Geolocation from '@react-native-community/geolocation';
import {PermissionsAndroid, Alert,Platform} from 'react-native';
import { SaveIdWatch,FunctionSetCoordsDetail } from '../../../Api/Customers/ApiCustumer';
import { check, PERMISSIONS, request } from 'react-native-permissions';

export async function requestLocationPermission() {
  let PermissionIsOk = false;
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Acceso a Geolocalización',
        message: 'Acepe el uso del GPS en la ventana que se muentre a continuación',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the location');
      PermissionIsOk = true;
    } else {
      console.log('location permission denied');
      Alert.alert(
        'Se denegó el permiso para acceder al GPS, por favor active los permisos',
      );
    }
  } catch (err) {
    console.warn(err);
  }
  return PermissionIsOk;
}

export const GetGeolocation = async () => {
  const isPermission = await requestLocationPermission();
  if (isPermission) {
    const locationConfig = {
      skipPermissionRequests: true,
      authorizationLevel: 'whenInUse',
      locationProvider: 'android',
    };
    Geolocation.setRNConfiguration(locationConfig);
    Geolocation.requestAuthorization();
    const getCurrentPositionResult = () =>
      new Promise((resolve, error) =>
        Geolocation.getCurrentPosition(resolve, error),
      );
    try {
      const Data = await getCurrentPositionResult();
      return {Status: true, Data,Message:'Datos obtenidos correctamente'};
    } catch (error) {      
      return {Status: false, Message: 'Active su GPS por favor'};
    }
  } else {
    return {Status: false, Message: 'No se tiene el acceso al GPS'};
  }
};

export const StartRealTimeCoords=async(dispatch,uuid='',distanceFilter=5,IdUsuario=0)=>{
 if(IdUsuario==null ||IdUsuario==undefined  ){
  IdUsuario = 0;
 }
  const isValidateGPS = await GetGeolocation();
  if(!isValidateGPS.Status){
    Alert.alert(isValidateGPS.Message);
    return;
  }
  try{
    const IdWatchClock = Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        const data = {
          Latitud: latitude,
          Longitud: longitude,
          UUIRecorrido: uuid,
          isRouteInCourse:true,
          idUsuario:IdUsuario
        };
        FunctionSetCoordsDetail(data);
      },
      error => {
        Alert.alert('' + error);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
        distanceFilter: 200,
      },
    );    
    if(dispatch!=null){
      dispatch(SaveIdWatch(IdWatchClock));
    }
    return IdWatchClock;
  }catch(error){
    Alert.alert(""+error);
    return null;
  }
   
}
export const getLocationInBackground = async () => {
  const locationOptions = { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000,distanceFilter:0 };
  const locationPromise = new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(resolve, reject, locationOptions);
  });

  const location = await locationPromise;
};
export async function requestBackgroundLocationPermission() {
  let permission;
  if (Platform.OS === 'ios') {
    permission = PERMISSIONS.IOS.LOCATION_ALWAYS;
  } else if (Platform.OS === 'android') {
    permission = PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION;
  }

  try {
    const result = await check(permission);
    if (result === 'granted') {
      console.log('Permiso de ubicación en segundo plano ya concedido');
      return true;
    }
    if (result === 'blocked') {
      console.log('Permiso de ubicación en segundo plano anteriormente bloqueado');
      return false;
    }
    if (result === 'denied') {
      const status = await request(permission);
      if (status === 'granted') {
        console.log('Permiso de ubicación en segundo plano co  ncedido');
        return true;
      }
      console.log('Permiso de ubicación en segundo plano denegado');
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}