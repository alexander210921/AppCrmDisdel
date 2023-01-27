import { requestCameraPermission } from ".";
import { requestExternalWritePermission } from "../Files";
import {launchCamera} from 'react-native-image-picker';

export const captureImage = async type => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 4,
      videoQuality: 'low',
      durationLimit: 30, //Video max duration in seconds
      saveToPhotos: true,
      base64: true,
      includeBase64: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    const getFile=()=> new Promise((resolve,reject)=>launchCamera(options,resolve))
    const Data = await getFile();    
    return Data;

  };