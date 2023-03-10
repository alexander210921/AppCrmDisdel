import {LOAD_POST_MILEAGE,SET_INIT_OR_END_MILEAGE} from '../../Store/Types/index';
import Axios from '../../lib/Axios/AxiosConfig';
import {Alert} from 'react-native';
//post mileage for vendors or pilots
export const SetMileage = (data, dispatch,isInitMileage=false,navigation,NameViewRedirect) => {  
  try {
    Axios.post('MyWsMobil/api/Mobil/AppIosAndroidRegistrarKilometraje/', data)
      .then(response => {
        Alert.alert(response.data.Mensaje);
        if(response.data.Resultado){
          navigation.navigate(NameViewRedirect);
          dispatch(setIsInitOrEndMileage(isInitMileage));
        }
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

export const setIsInitOrEndMileage = status=>({
  type:SET_INIT_OR_END_MILEAGE,
  payload:status
})
