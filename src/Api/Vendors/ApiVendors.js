import {LOAD_POST_MILEAGE,SET_INIT_OR_END_MILEAGE} from '../../Store/Types/index';
import Axios from '../../lib/Axios/AxiosConfig';
import {Alert} from 'react-native';
//post mileage for vendors or pilots
export const SetMileage =async (Object, dispatch) => {    
  try {
    const {data} = await Axios.post('MyWsMobil/api/Mobil/AppIosAndroidRegistrarKilometraje/', Object)    
    return data;
  }catch(ex){
    Alert.alert(""+ex);
    return null;
  }
   finally {
    dispatch(LoadPostMileage(false));
  }
};
export const GetBasesVendor=async(idUser)=>{
  try{
    const {data} = await Axios.get('MyWsOneVenta/api/OCRDExternoBase/Get/'+idUser+"/");
    return data;
  }catch(ex){
    Alert.alert(""+ex);
    return null;
  }
}
export const SetGasoline =async (Object) => {     
  try {
    const {data} = await Axios.post('MyWsRRHH/api/RHUsuarioGasolina/', Object)    
    return data;
  }catch(ex){
    Alert.alert(""+ex);
    return null;
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
