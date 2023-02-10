import {GET_USER, LOAD_GET_USER,GET_USER_COMPANY,GET_USER_ROLES,SET_DEFAULT_COMPANY,SET_DEFAULT_ROL,LOGOUT_USER,SET_COORDS_ACTUALITY,SET_COORDS_DESTINATION} from '../../Store/Types/index';
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
          GetUserCompany(response.data.DocEntry,navigation,dispatch);
          
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
           //navigation.navigate("Home");
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



export const GetUserCompany =(UserId,navigation,dispatch)=>{
  try {
    Axios.get('MyWsMobil/api/Mobil/GetUserCompania/'+UserId+"/")
      .then(response => {
        if(response.data.length==1){
           dispatch(SetUserDefaultCompany(response.data));
           dispatch(SetUserCompany(response.data));
           GetUserRol(UserId,response.data[0].EntityID,navigation,dispatch);
           //navigation.navigate("Home");
        }else if(response.data.length>1){
          Alert.alert("seleccione la compañia");
        }else{
          Alert.alert("Este usuario no posee ninguna compañia");
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
}

export const GetUserRol =(UserId,CompanyId,navigation,dispatch)=>{
  try {
    Axios.get('MyWsMobil/api/Mobil/GetUserRol/'+UserId+"/"+CompanyId+"/")
      .then(response => {
        if(response.data.length==1){
           dispatch(SetUserDefaultRol(response.data))
           dispatch(SetUserRoles(response.data));
           navigation.navigate("Home");
        }else if(response.data.length>1){
          Alert.alert("seleccione el rol");
        }else{
          Alert.alert("Este usuario no posee ningun rol asignado");
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
}

// manipulation actios
export const GetUser = data => ({
  type: GET_USER,
  payload: data,
});

export const LoadGetUser = status => ({
  type: LOAD_GET_USER,
  payload: status,
});

export const SetUserCompany=company =>({
  type:GET_USER_COMPANY,
  payload:company
})

export const SetUserRoles = roles =>({
  type:GET_USER_ROLES,
  payload:roles
})

export const SetUserDefaultCompany=company =>({
  type:SET_DEFAULT_COMPANY,
  payload:company
})
export const SetUserDefaultRol = rol=>({
  type:SET_DEFAULT_ROL,
  payload:rol
})
export const LogOutUser=()=>({
  type:LOGOUT_USER
})

export const SetActualityCoords=(coords)=>({
  type:SET_COORDS_ACTUALITY,
  payload:coords
})

export const SetDestinationCoords = (coords)=>({
  type:SET_COORDS_DESTINATION,
  payload:coords
})