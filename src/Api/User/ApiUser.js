import {GET_USER, LOAD_GET_USER} from '../../Store/Types/index';
import Axios from '../../lib/Axios/AxiosConfig';
import {Alert} from 'react-native';
export const LoginUser = (NameUser, PasswordUser, dispatch,navigation) => {
  const UserData = {
    NameUser: NameUser,
    Password: PasswordUser,
  };
  try {
    Axios.post('MyWsMobil/api/Mobil/ValidarLogin/', UserData)
      .then(response => {
        if (response.data.Resultado) {                    
          GetLoginUser(response.data.DocEntry,navigation,dispatch);
        } else {
          Alert.alert('Usuario incorrecto');
          dispatch(LoadGetUser(false));
        }
      })
      .catch((err) => {
        Alert.alert("Ocurrió un error"+err);
        dispatch(LoadGetUser(false));
      });
  } catch (ex) {
    console.log(ex);
  } 
};


export const GetLoginUser = (UserId,navigation,dispatch) => {
  try {
    Axios.get('MyWsMobil/api/Mobil/GetUsuarioLog/'+UserId+"/")
      .then(response => {
        if(response.data.EntityID>0){
           dispatch(GetUser(response.data));
           navigation.navigate("Home");
        }else{
          Alert.alert("Ocurrió un error intente nuevamente");
          dispatch(LoadGetUser(false));
        }
      })
      .catch(err => {
        Alert.alert("Ocurrió un error"+err);
        dispatch(LoadGetUser(false));
      });
  } finally {
    dispatch(LoadGetUser(false));
  }
};



// manipulation actios
export const GetUser = data => ({
  type: GET_USER,
  payload: data,
});

export const LoadGetUser = status => ({
  type: LOAD_GET_USER,
  payload: status,
});
