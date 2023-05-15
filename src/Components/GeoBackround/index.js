import BackgroundService from 'react-native-background-actions';
import {GetGeolocation} from '../../lib/Permissions/Geolocation';
import {SetActualityCoords} from '../../Api/User/ApiUser';
import {Alert} from 'react-native';
import { LoadGetVisitActuality } from '../../Api/Customers/ApiCustumer';
export const StartBackroundInitCoordsRoute = async dispatch => {
  const sleep = time =>
    new Promise(resolve => setTimeout(() => resolve(), time));
  const TaskGetCoords = async taskDataArguments => {
    try {
      const {delay} = taskDataArguments;
      try {
        await new Promise(async resolve => {
          for (let i = 0; BackgroundService.isRunning(); i++) {
            const isValidateGPS = await GetGeolocation();
            if (!isValidateGPS.Status) {
              Alert.alert('Intente nuevamente', isValidateGPS.Message);
              dispatch(LoadGetVisitActuality(false));
              await BackgroundService.stop();
              return false;
            }
            if (
              isValidateGPS.Data.coords.latitude != 0 &&
              isValidateGPS.Data.coords.longitude != 0
            ) {
              dispatch(
                SetActualityCoords({
                  latitude: isValidateGPS.Data.coords.latitude,
                  longitude: isValidateGPS.Data.coords.longitude,
                }),
              );
            }
            await sleep(delay);
            await BackgroundService.stop();
            break;
          }
        });
       // return true;
      } catch (ex) {
        console.log(ex, 'Al insertar ocurrió un error');
        //return false;
      }
    } catch (ex) {
      console.log('ocurrió un error :' + ex);
      //return false;
    }
  };
  const options = {
    taskName: '',
    taskTitle: 'Estamos iniciando el viaje',
    taskDesc: '',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'yourSchemeHere://Home', // See Deep Linking for more info
    parameters: {
      delay: 1000,
    },
  };
  try {
    await BackgroundService.start(TaskGetCoords, options);
    //await BackgroundService.stop();
  } catch (exeption) {
    console.log('ocurrió un error ', exeption);
  }
};
