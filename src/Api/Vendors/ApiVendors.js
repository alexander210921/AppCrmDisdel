import {LOAD_POST_MILEAGE,SET_INIT_OR_END_MILEAGE} from '../../Store/Types/index';
import Axios from '../../lib/Axios/AxiosConfig';
import {Alert} from 'react-native';
//post mileage for vendors or pilots
export const SetMileage =async (Object, dispatch) => {    
  try {
    const {data} = await Axios.post('MyWsMobil/api/Mobil/AppIosAndroidRegistrarKilometraje/', Object)    
    return data;
    
    //   .then(response => {
    //     Alert.alert(response.data.Mensaje);
    //     if(response.data.Resultado){
    //       const dataMileague={
    //         ...data,
    //         ImageName:response.data.MensajeAux,
    //         EntityID :response.data.DocNum 
    //       }
    //       AsyncStorageSaveDataJson("@Mileague",dataMileague).finally(()=>{
    //         navigation.navigate(NameViewRedirect);
    //         dispatch(setIsInitOrEndMileage(isInitMileage));
    //       });          
    //     }
    //   })
    //   .catch(() => {
    //     Alert.alert("Error: por favor intente nuevamente tomar la fotografía");
    //   }).finally = () => {
    //   dispatch(LoadPostMileage(false));
    // };
  }catch(ex){
    Alert.alert(""+ex);
   // console.log("error ve "+ex);
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

export const LoadPostMileage = RequestStatus => ({
  type: LOAD_POST_MILEAGE,
  payload: RequestStatus,
});

export const setIsInitOrEndMileage = status=>({
  type:SET_INIT_OR_END_MILEAGE,
  payload:status
})
