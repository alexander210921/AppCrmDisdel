import {Platform,PermissionsAndroid} from 'react-native'
export const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      return false
      // try {
      //   const granted = await PermissionsAndroid.request(
      //     PermissionsAndroid.PERMISSIONS.CAMERA,
      //     {
      //       title: 'Camera Permission',
      //       message: 'App needs camera permission',
      //     },
      //   );
      //   // If CAMERA Permission is granted
      //   return granted === PermissionsAndroid.RESULTS.GRANTED;
      // } catch (err) {        
      //   return false;
      // }
    } else return true;
  };