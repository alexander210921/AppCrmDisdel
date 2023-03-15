//function to create Visit
import {Alert} from'react-native'
import { GetGeolocation } from '../Permissions/Geolocation/index';
import { generateUUID } from '../UUID/index';
import { SaveUUIDRoute,SetIsInitDrivingVisit } from '../../Api/Customers/ApiCustumer';
import { AsyncStorageSaveDataJson } from '../AsyncStorage/index';
import { StartRealTimeCoords } from '../Permissions/Geolocation/index';
export async function StartInitVisit(ListRoutes,DrivingVisitDetail,dispatch) {
    if (ListRoutes.RoutesInProgress.length == 0) {
      Alert.alert('No existen visitas en curso');
      
      return;
    }
    if (
      DrivingVisitDetail.isRouteInCourse &&
      DrivingVisitDetail.IdWatchLocation != null
    ) {
      Alert.alert('La ruta ya ha sido iniciada');
      return;
    }
    try {
      const coords = await GetGeolocation();
      if (!coords.Status) {
        Alert.alert('' + coords.Message);
        return;
      }
      let uuid;
      if (DrivingVisitDetail.UUIDRoute == '') {
        uuid = generateUUID();
      } else {
        uuid = DrivingVisitDetail.UUIDRoute;
      }
      dispatch(SaveUUIDRoute(uuid));
      const IdWatch = StartRealTimeCoords(dispatch, uuid, 5);
      dispatch(SetIsInitDrivingVisit(true));
      const infoRoute = {
        DatevalidId: new Date().toLocaleDateString(),
        UUidInProgress: uuid,
        IdVisitInProgress: 0,
        isRouteInCourse: true,
        IdWatch,
      };
      await AsyncStorageSaveDataJson('@dataRoute', infoRoute);
      Alert.alert('Su viaje está en curso');
    } catch (ex1) {
      Alert.alert('Error: ' + ex1);
    }
  }