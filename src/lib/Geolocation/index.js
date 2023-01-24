import Geolocation from '@react-native-community/geolocation';
import {PermissionsAndroid, Alert} from 'react-native';

export async function requestLocationPermission() {
  let PermissionIsOk = false;
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Example App',
        message: 'Example App access to your location ',
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
      return {Status: false, Message: 'ocurrió un error: ' + error};
    }
  } else {
    return {Status: false, Message: 'No se tiene el acceso al GPS'};
  }
};
