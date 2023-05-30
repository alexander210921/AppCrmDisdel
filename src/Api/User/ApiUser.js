import {GET_USER, LOAD_GET_USER,GET_USER_COMPANY,GET_USER_ROLES,SET_DEFAULT_COMPANY,SET_DEFAULT_ROL,LOGOUT_USER,SET_COORDS_ACTUALITY,SET_COORDS_DESTINATION} from '../../Store/Types/index';
import Axios from '../../lib/Axios/AxiosConfig';
import {Alert} from 'react-native';
import { AsyncStorageGetData, AsyncStorageSaveDataJson } from '../../lib/AsyncStorage';
export const LoginUser = (NameUser, PasswordUser, dispatch,navigation) => {
  const UserData = {
    NameUser: NameUser,
    Password: PasswordUser,
  };
  try {
    Axios.post('MyWsMobil/api/Mobil/ValidarLogin/', UserData)
      .then(async response => {
        if (response.data.Resultado) {                    
          GetLoginUser(response.data.DocEntry,navigation,dispatch);   
          // let company = await AsyncStorageGetData("@Company");       
          // if(company!=null){
          //   company = JSON.parse(company);
          //   console.log(company);
          //   dispatch(SetUserDefaultCompany(company));
          //   GetUserRol(response.data.DocEntry,company.EntityID,navigation,dispatch);
          // }else{
            
          // } 
          GetUserCompany(response.data.DocEntry,navigation,dispatch);         
          AsyncStorageSaveDataJson("@User",{ NameUser,PasswordUser});  
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
    dispatch(LoadGetUser(false));
    Alert.alert(""+ex);
  }finally{
    //dispatch(LoadGetUser(false));
  } 
};


export const GetLoginUser = (UserId,navigation,dispatch) => {
  try {
    Axios.get('MyWsMobil/api/Mobil/GetUsuarioLog/'+UserId+"/")
      .then(response => {
        if(response.data.EntityID>0){
           dispatch(GetUser(response.data));                  
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



export  const GetUserCompany  =(UserId,navigation,dispatch)=>{
  try {
    Axios.get('MyWsMobil/api/Mobil/GetUserCompania/'+UserId+"/")
      .then( response => {
        if(response.data.length==1){
           dispatch(SetUserDefaultCompany(response.data[0]));
           dispatch(SetUserCompany(response.data));
           GetUserRol(UserId,response.data[0].EntityID,navigation,dispatch);
           AsyncStorageSaveDataJson("@Company",response.data[0]);  
           //navigation.navigate("Home");
        }else if(response.data.length>1){
          dispatch(SetUserCompany(response.data));
          //await AsyncStorageSaveDataJson("@Company");
          navigation.navigate("SelectCompany");
          //Alert.alert("seleccione la compañia");
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
      .then(async response =>  {
        if(response.data.length==1){                    
           const options =  await FunctionGetOptionUser(response.data[0].IdRol);
           if(options == null){
            Alert.alert("","Ocurrió un error intente ingresar nuevamente por favor");
            return;
           }
           if(options.length == 0){
            Alert.alert("","Su rol asignado no tiene opciones para usar la app");
            return;
           }
           dispatch(SetUserDefaultRol(response.data))
           dispatch(SetUserRoles(response.data));
           AsyncStorageSaveDataJson("@Rol",response.data);  
           navigation.navigate("Home");
        }else if(response.data.length>1){
          //Alert.alert("seleccione el rol");
          dispatch(SetUserRoles(response.data));
          navigation.navigate("SelectRol");
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
export async function FunctionGetOptionUser (idRol){
  try{
    const {data} = await Axios.get("MyWsOneControlCenter/api/Autenticacion/GetOpcRolUsr/"+idRol);
    //here filter for only data mobile    
    const filterOnlyMobile = data.filter((x)=>x.isMobile ==="Y" )
    return filterOnlyMobile;
  }catch(ex){   
    return null;
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