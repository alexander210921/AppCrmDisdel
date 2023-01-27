import {GET_USER, LOAD_GET_USER,GET_USER_COMPANY,GET_USER_ROLES,SET_DEFAULT_COMPANY,SET_DEFAULT_ROL} from '../../Store/Types/index';
import Axios from '../../lib/Axios/AxiosConfig';
import {Alert} from 'react-native';

export const GetCustumerVendor = (IdRelatoin,SearchTerm,dispatch) => {
    try {
      Axios.get('MyWsMobil/api/Mobil/GetBuscarSocio/'+IdRelatoin+"/"+SearchTerm+"/")
        .then(response => {
          if(response.data){
             
             console.log(response.data);
             
          }else{
            // Alert.alert("Ocurrió un error intente nuevamente");
            // dispatch(LoadGetUser(false));
          }
        })
        .catch(err => {
          Alert.alert("Ocurrió un error"+err);
          //dispatch(LoadGetUser(false));
        });
    } finally {
     //dispatch(LoadGetUser(false));
    }
  };