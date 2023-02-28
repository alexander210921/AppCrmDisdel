import { launchImageLibrary} from 'react-native-image-picker';
import {Alert} from 'react-native'
export const chooseFile = type => {
    let options = {
      mediaType: type,
      
      quality: 4,
      base64: true,
      includeBase64: true,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        Alert.alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        Alert.alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        Alert.alert(response.errorMessage);
        return;
      }
    });
  };