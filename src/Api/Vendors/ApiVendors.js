import {LOAD_POST_MILEAGE} from '../../Store/Types/index';
import Axios from '../../lib/Axios/AxiosConfig';
import {Alert} from 'react-native';
//post mileage for vendors or pilots
export const SetMileage = (data, dispatch) => {  
  try {
    Axios.post('MyWsMobil/api/Mobil/AppIosAndroidRegistrarKilometraje/', data)
      .then(response => {
        Alert.alert(response.data.Mensaje);
      })
      .catch(() => {
        Alert.alert("Error: por favor intente nuevamente tomar la fotografía");
      }).finally = () => {
      dispatch(LoadPostMileage(false));
    };
  } finally {
    dispatch(LoadPostMileage(false));
  }
};

export const LoadPostMileage = RequestStatus => ({
  type: LOAD_POST_MILEAGE,
  payload: RequestStatus,
});
