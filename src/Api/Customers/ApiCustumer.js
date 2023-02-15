import {LOAD_GET_CUSTOMERS_VENDOR,GET_CUSTOMER_VENDOR,SET_CUSTOMER_SELECTED,LOAD_SET_VISIT_CUSTOMER,SET_VISIT_ACTUALITY,LOAD_GET_VISIT_ACTUALITY} from '../../Store/Types/index';
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

  export  const  FunctionGetCurrentVisit = (IdRelation,dispatch) => {
    try {
       Axios.get('MyWsMobil/api/Mobil/GetVisitasOpen/'+IdRelation+"/")
        .then(response => {
            dispatch(SetVisiActualityt(response.data));    
            console.log("Detalles",response.data);
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