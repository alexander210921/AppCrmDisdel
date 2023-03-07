import Geolocation from '@react-native-community/geolocation';
import {PermissionsAndroid, Alert} from 'react-native';
import { SaveIdWatch,FunctionSetCoordsDetail } from '../../../Api/Customers/ApiCustumer';

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

export const StartRealTimeCoords=async(dispatch,uuid='',distanceFilter=5)=>{
 
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
        distanceFilter: 300,
      },
    );    
    dispatch(SaveIdWatch(IdWatchClock));
    return IdWatchClock;
  }catch(error){
    Alert.alert(""+error);
    return null;
  }
   
}
