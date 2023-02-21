import {LOAD_GET_CUSTOMERS_VENDOR,GET_CUSTOMER_VENDOR,SET_CUSTOMER_SELECTED,LOAD_SET_VISIT_CUSTOMER,SET_VISIT_ACTUALITY,LOAD_GET_VISIT_ACTUALITY,GET_ADRESS_CUSTOMER,LOAD_GET_ADRESS_CUSTOMER,SAVE_VIVIST_DETAIL_SELECT,LOAD_UPDATE_VISIT,LOAD_UPDATE_COORDS_CUSTOMER,DELETE_VISIT} from '../../Store/Types/index';
import Axios from '../../lib/Axios/AxiosConfig';
import {Alert} from 'react-native';
export const GetCustumerVendor = (IdRelatoin,SearchTerm,dispatch) => {
    try {
      Axios.get('MyWsMobil/api/Mobil/GetBuscarSocio/'+IdRelatoin+"/"+SearchTerm+"/")
        .then(response => {
          if(response.data.Respuesta.Resultado){             
             dispatch(GeCustomersVendor(response.data.Detalle));
          }else{
             Alert.alert("No se encontraron registros");
             dispatch(GeCustomersVendor([]));
          }
        })
        .catch(() => {
          Alert.alert("Ocurrió un error por favor vuelva a intentarlo");
        }).finally(()=>{
          dispatch(LoadGeCustomer(false));
        });
    } finally {
        dispatch(LoadGeCustomer(false));
    }
  };


  export const SetVisitCustomer = (data,dispatch) => {
    try {
      Axios.post('MyWsMobil/api/Mobil/CrearVisita/',data)
        .then(response => {
          Alert.alert(response.data.Mensaje);
        })
        .catch(() => {
          Alert.alert("Ocurrió un error por favor vuelva a intentarlo");
        }).finally(()=>{
          dispatch(LoadSetRegisterVisit(false));
        });
    } finally {
        dispatch(LoadSetRegisterVisit(false));
    }
  };

  export  const  FunctionGetCurrentVisit = (IdRelation,dispatch,redirect=false,navigator) => {
    try {
       Axios.get('MyWsMobil/api/Mobil/GetVisitasOpen/'+IdRelation+"/")
        .then(response => {
            dispatch(SetVisiActualityt(response.data));  
            if(redirect){
              navigator.navigate("VisitCreated");
            } 
        })
        .catch(() => {
          Alert.alert("Ocurrió un error por favor vuelva a intentarlo");
        }).finally(()=>{
          dispatch(LoadGetVisitActuality(false));
        });
    } finally {      
        dispatch(LoadGetVisitActuality(false));
    }
  };

  export  const  FunctionGetAdressCustomer = (CardCode,NombreDB,dispatch,isNavigate=false,navigation) => {
    try {
       Axios.get('MyWsOneControlCenter/api/Socio/GetListaDirecciones/'+NombreDB+"/"+CardCode+"/")
        .then(response => {
            dispatch(GetAdressCustomer(response.data)); 
            if(isNavigate){
              navigation.navigate("FormCreateVisit");
            }                           
        })
        .catch(() => {
          Alert.alert("Ocurrió un error por favor vuelva a intentarlo");
        }).finally(()=>{
          dispatch(LoadGetAdressCustomer(false));
        });
    } finally {      
        dispatch(LoadGetAdressCustomer(false));
    }
  };

  export  const  FunctionUpdateVisit = (data,dispatch) => {
    try {
       Axios.post('MyWsMobil/Api/Mobil/UpdateStatusVisit/',data)
        .then(response => {
          if(response.data.Resultado&&data.Proceso!="EnProceso"){
            dispatch(DeleteVisit(data.IdRegistro));
          }
          Alert.alert(response.data.Mensaje);                            
        })
        .catch(() => {
          Alert.alert("Ocurrió un error por favor vuelva a intentarlo");
        }).finally(()=>{
          dispatch(LoadUpdateVisit(false));
        });
    } finally {      
        dispatch(LoadUpdateVisit(false));
    }
  };
  export  const  FunctionUpdateAddressCoords = (data,dispatch) => {
    try {
       Axios.post('MyWsOneVenta/api/Tracking/ActualizarCamposContacto/',data)
        .then(response => {
          Alert.alert(response.data.Mensaje);                            
        })
        .catch(() => {
          Alert.alert("Ocurrió un error por favor vuelva a intentarlo");
        }).finally(()=>{
          dispatch(LoadAddressCoordsCustomer(false));
        });
    } finally {      
        dispatch(LoadAddressCoordsCustomer(false));
    }
  };

  export const LoadGeCustomer = status => ({
    type: LOAD_GET_CUSTOMERS_VENDOR,
    payload: status,
  });

  export const GeCustomersVendor = data => ({
    type: GET_CUSTOMER_VENDOR,
    payload: data,
  });
  
  export const SetDefaultCustomerSelect=customer=>({
    type:SET_CUSTOMER_SELECTED,
    payload:customer
  })
  
  export const LoadSetRegisterVisit=status=>({
   type:LOAD_SET_VISIT_CUSTOMER,
   payload:status 
  })
  
  export const SetVisiActualityt=data=>({
    type:SET_VISIT_ACTUALITY,
    payload:data
  })
  
  export const LoadGetVisitActuality=status=>({
    type:LOAD_GET_VISIT_ACTUALITY,
    payload:status
  })

  export const LoadGetAdressCustomer=status=>({
    type:LOAD_GET_ADRESS_CUSTOMER,
    payload:status
  })

  export const GetAdressCustomer=data=>({
    type:GET_ADRESS_CUSTOMER,
    payload:data
  })

  export const SaveSelectVisitDetail=visit=>({
    type:SAVE_VIVIST_DETAIL_SELECT,
    payload:visit
  })

  export const LoadUpdateVisit=visit=>({
    type:LOAD_UPDATE_VISIT,
    payload:visit
  })
  
  export const LoadAddressCoordsCustomer=(status)=>({
    type:LOAD_UPDATE_COORDS_CUSTOMER,
    payload:status
  })

  export const DeleteVisit=(idVisit)=>({
    type:DELETE_VISIT,
    payload:idVisit
  })

  