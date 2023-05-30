import {
  LOAD_GET_CUSTOMERS_VENDOR,
  GET_CUSTOMER_VENDOR,
  SET_CUSTOMER_SELECTED,
  LOAD_SET_VISIT_CUSTOMER,
  SET_VISIT_ACTUALITY,
  LOAD_GET_VISIT_ACTUALITY,
  GET_ADRESS_CUSTOMER,
  LOAD_GET_ADRESS_CUSTOMER,
  SAVE_VIVIST_DETAIL_SELECT,
  LOAD_UPDATE_VISIT,
  LOAD_UPDATE_COORDS_CUSTOMER,
  DELETE_VISIT,
  SET_DETAIL_COORDS,
  SAVE_IDWATCH_GEOLOCATION,
  SET_INIT_VISITDRIVER,
  SAVE_UUID_ROUTE_CUSTOMER,
  LOAD_CANCEL_VISITS_IN_COURSE,
  SAVE_VISIT_CREATED,
  ADD_VISIT_CREATED,
  SAVE_IS_ARRIVE_OR_END_VISIT,
  SAVE_CONTACT_PERSON_CUSTOMER,
  LOAD_REFRESH_LOCATION,
  SAVE_CUSTOMER_DETAIL,
  SAVE_DOC_OPEN_CUSTOMER  
} from '../../Store/Types/index';
import Axios from '../../lib/Axios/AxiosConfig';
import {Alert} from 'react-native';
//import { SaveIdWatch, SaveUUIDRoute,SetIsInitDrivingVisit } from '../../Api/Customers/ApiCustumer';
export const GetCustumerVendor = (IdRelatoin, SearchTerm, dispatch) => {
  try {
    Axios.get(
      'MyWsMobil/api/Mobil/GetBuscarSocio/' +
        IdRelatoin +
        '/' +
        SearchTerm +
        '/',
    )
      .then(response => {
        if (response.data.Respuesta.Resultado) {
          dispatch(GeCustomersVendor(response.data.Detalle));
        } else {
          Alert.alert('No se encontraron registros');
          dispatch(GeCustomersVendor([]));
        }
      })
      .catch(() => {
        Alert.alert('Ocurrió un error por favor vuelva a intentarlo');
      })
      .finally(() => {
        dispatch(LoadGeCustomer(false));
      });
  } finally {
    dispatch(LoadGeCustomer(false));
  }
};
export const getCustomersForVendor=async(IdRelatoin, SearchTerm)=>{
  try{
    const {data} = await Axios.get(
      'MyWsMobil/api/Mobil/GetBuscarSocio/' +
        IdRelatoin +
        '/' +
        SearchTerm +
        '/',
    )
    return data;
  }catch(ex){
    Alert.alert(""+ex);
    return null
  }
}
export const SetVisitCustomer =async (
  object,
  dispatch,
  navigation,
  isNavigation = false,
  IsReturn = false,
  ViewNameNavigate
) => {
  try { 
    const {data }=await Axios.post('MyWsMobil/api/Mobil/CrearVisita/', object)
    return data;

  }catch(Exception){
    dispatch(LoadSetRegisterVisit(false));
    Alert.alert(""+Exception);
    return null;
  }
   finally {
    dispatch(LoadSetRegisterVisit(false));
  }
};

export  const FunctionGetCurrentVisit =async (
  IdRelation,
  dispatch,
  redirect = false,
  navigator,
) => {
  try {
   const {data }=await Axios.get('MyWsMobil/api/Mobil/GetVisitasOpen/' + IdRelation + '/')
   return data;
    
  }catch(ex){
    Alert.alert(""+ex);
    return null;
  }
   finally {
    //dispatch(LoadGetVisitActuality(false));
  }
};

export const FunctionGetAdressCustomer = (
  CardCode,
  NombreDB,
  dispatch,
  isNavigate = false,
  navigation,
) => {
  try {
    Axios.get(
      'MyWsOneControlCenter/api/Socio/GetListaDireccionesCardCode/' +
        NombreDB +
        '/' +
        CardCode +
        '/',
    )
      .then(response => {
        dispatch(GetAdressCustomer(response.data));
        if (isNavigate) {
          navigation.navigate('FormCreateVisit');
        }
      })
      .catch((e) => {
        Alert.alert('Ocurrió un error por favor vuelva a intentarlo',""+e);
      })
      .finally(() => {
        dispatch(LoadGetAdressCustomer(false));
      });
  } finally {
    dispatch(LoadGetAdressCustomer(false));
  }
};
export const FunctionSetCoordsDetail = data => {
  try {
    Axios.post(
      'MyWsOneVenta/api/OCRDExternoActividadVisitaDetalle/CrearRegistro/',
      data,
    )
      .then(() => {
        //console.log(response);
        // dispatch(SetCoordsDetailRealTime(true));
      })
      .catch(() => {
        //  dispatch(SetCoordsDetailRealTime(false));
      })
      .finally(() => {
        // dispatch(SetCoordsDetailRealTime(false));
      });
  } finally {
    //dispatch(SetCoordsDetailRealTime(false));
  }
};
export const AsyncFunctionSetCoordsDetail =async object => {
  try {
    const {data}= await Axios.post(
      'MyWsOneVenta/api/OCRDExternoActividadVisitaDetalle/CrearRegistro/',
      object,
    );
    return data;      
  }catch{
    return null;
  }
   finally {
    //dispatch(SetCoordsDetailRealTime(false));
  }
};
export const FunctionUpdateVisit =async (object, dispatch, navigation,nameViewRedirect="VisitCreated") => {
  try {    
    //UpdateStatusVisit
    const {data}=await Axios.post('MyWsMobil/Api/Mobil/UpdateStatusVisit/', object)
    return data;

  }catch(ex){
    Alert.alert(ex);
    return null;
  }
   finally {
    dispatch(LoadUpdateVisit(false));
  }
};
export async function GetVisitByID (idvisit){
  try{
    const {data} = await Axios.get("MyWsOneVenta/api/OCRDExternoActividadVisita/Get/"+idvisit+"/");
    return data;
  }catch(ex){
    Alert.alert(""+ex);
    return null;
  }
}
export async function ValidateDistanceIsValid (dataobject){
  try{
    const {data} = await Axios.post("MyWsOneVenta/api/OCRDExternoActividadVisita/ValidateDistanceVisit/",dataobject);
    return data;
  }catch(ex){
    Alert.alert(""+ex);
    return null;
  }
}
export async function GetAddressOfCurrentVisit (NombreDB,CardCode,idDireccion){
  try{
    const {data} = await Axios.get("MyWsOneVenta/api/OCRDExternoActividadVisita/GetAdressVisitById/"+NombreDB+"/"+CardCode+"/"+idDireccion);
    return data;
  }catch(ex){
    Alert.alert(""+ex);
    return null;
  }
}
export async function GetContactPersonCardCode (NombreDB,CardCode){
  try{
    const {data} = await Axios.get("MyWsSocio/api/OCRD_Clientes/GetPContactoCardCode/"+NombreDB+"/"+CardCode);
    return data;
  }catch(ex){
    Alert.alert(""+ex);
    return null;
  }
}
export async function GetMileagueByIdVisit (idvisit){
  try{
    const {data} = await Axios.get("MyWsOneVenta/api/BitacoraKilometraje/GetByVisit/"+idvisit+"/");
    return data;
  }catch(ex){
    Alert.alert(""+ex);
    return null;
  }
}
export async function DistanceValidation(){
  try{
    const {data} = await Axios.get("MyWsOneVenta/api/OCRDExternoActividadVisita/DistanceValid/");
    return data;
  }catch(ex){
    //Alert.alert(""+ex);
    return null;
  }
}
export async function FunctionGetMileageInit (IdUsuario,TypeMileage){
  try{
    const {data} = await Axios.get("MyWsOneVenta/api/OCRDExternoActividadVisita/GetKilometrajeInicio/"+IdUsuario+"/"+TypeMileage+"/");
    return data;
  }catch(ex){
   // Alert.alert(""+ex);
    return null;
  }
}
export const FunctionUpdateAddressCoords = (data, dispatch) => {
  try {
    Axios.post('MyWsOneVenta/api/Tracking/ActualizarCamposContacto/', data)
      .then(response => {
        Alert.alert(response.data.Mensaje);
      })
      .catch(() => {
        Alert.alert('Ocurrió un error por favor vuelva a intentarlo');
      })
      .finally(() => {
        dispatch(LoadAddressCoordsCustomer(false));
      });
  } finally {
    dispatch(LoadAddressCoordsCustomer(false));
  }
};

export const CancelListVisitsInCourse = (listVisit, dispatch) => {    
  try {
   return Axios.post('MyWsOneVenta/Api/OCRDExternoActividadVisita/CancelListVisit/', listVisit)
      
  } finally {
    dispatch(CancelVisits(false));
  }
};

export async function FunctionGetDetailCustomer (CardCode,NomnbreBD){
  try{
    const {data} = await Axios.get("MyWsSocio/api/OCRD_Clientes/GetCardCodeDetalle/"+NomnbreBD+"/"+CardCode+"/");
    return data;
  }catch(ex){
   // Alert.alert(""+ex);
    return null;
  }
}

export async function FunctionGetCustomerActive (CardCode,NomnbreBD){
  try{
    const {data} = await Axios.get("MyWsSocio/api/OCRD_Clientes/GetClienteActivo/"+NomnbreBD+"/"+CardCode+"/");
    return data;
  }catch(ex){
   // Alert.alert(""+ex);
    return null;
  }
}

export async function FunctionGetCustomerAdressList (CardCode,NomnbreBD){
  try{
    const {data} = await Axios.get("MyWsSocio/api/OCRD_Clientes/GetDireccionCardCode/"+NomnbreBD+"/"+CardCode);
    return data;
  }catch(ex){
   // Alert.alert(""+ex);
    return null;
  }
}
export async function FunctionGetCustomerFiscalAdressList (CardCode,NomnbreBD){
  try{
    const {data} = await Axios.get("MyWsSocio/api/OCRD_Clientes/GetDireccionFiscal/"+NomnbreBD+"/"+CardCode+"/");
    return data;
  }catch(ex){
   // Alert.alert(""+ex);
    return null;
  }
}

export async function FunctionGetPedidosOpen (CardCode,NomnbreBD){
  try{
    const {data} = await Axios.get("MyWsSocio/api/OCRD_Clientes/GetPedidoV/"+NomnbreBD+"/"+CardCode+"/");
    return data;
  }catch(ex){   
    return null;
  }
}

export async function FunctionGetCotizacionOpen (CardCode,NombreBD){
  try{
    const {data} = await Axios.get("MyWsSocio/api/OCRD_Clientes/GetCotizacionOpen/"+NombreBD+"/"+CardCode+"/");
    return data;
  }catch(ex){   
    return null;
  }
}

export async function FunctionGetPDFPedidoPrice (NombreBD,DocEntry){
  try{
    const {data} = await Axios.get("MyWsOneVenta/api/DocumentoPdf/GetPdfordrCarrito_CP/"+NombreBD+"/"+DocEntry);
    return data;
  }catch(ex){   
    return null;
  }
}
export async function FunctionGetPDFCotiNoPrice (NombreBD,DocEntry){
  try{
    const {data} = await Axios.get("MyWsOneVenta/api/DocumentoPdf/GetPdfCotizacion/"+NombreBD+"/"+DocEntry);
    return data;
  }catch(ex){   
    return null;
  }
}

export async function FunctionGetCustomerDefaultForRoute (idUsuario,NombreDB){
  try{
    const {data} = await Axios.get("MyWsMobil/Api/Mobil/GetDatosClienteRuta/"+idUsuario+"/"+NombreDB);
    return data;
  }catch(ex){   
    return null;
  }
}

export const CancelVisits=(status)=>({
  type:LOAD_CANCEL_VISITS_IN_COURSE,
  payload:status
})

export const LoadGeCustomer = status => ({
  type: LOAD_GET_CUSTOMERS_VENDOR,
  payload: status,
});

export const GeCustomersVendor = data => ({
  type: GET_CUSTOMER_VENDOR,
  payload: data,
});

export const SetDefaultCustomerSelect = customer => ({
  type: SET_CUSTOMER_SELECTED,
  payload: customer,
});

export const LoadSetRegisterVisit = status => ({
  type: LOAD_SET_VISIT_CUSTOMER,
  payload: status,
});

export const SetVisiActualityt = data => ({
  type: SET_VISIT_ACTUALITY,
  payload: data,
});

export const LoadGetVisitActuality = status => ({
  type: LOAD_GET_VISIT_ACTUALITY,
  payload: status,
});

export const LoadGetAdressCustomer = status => ({
  type: LOAD_GET_ADRESS_CUSTOMER,
  payload: status,
});

export const GetAdressCustomer = data => ({
  type: GET_ADRESS_CUSTOMER,
  payload: data,
});

export const SaveSelectVisitDetail = visit => ({
  type: SAVE_VIVIST_DETAIL_SELECT,
  payload: visit,
});

export const LoadUpdateVisit = visit => ({
  type: LOAD_UPDATE_VISIT,
  payload: visit,
});

export const LoadAddressCoordsCustomer = status => ({
  type: LOAD_UPDATE_COORDS_CUSTOMER,
  payload: status,
});

export const DeleteVisit = idVisit => ({
  type: DELETE_VISIT,
  payload: idVisit,
});

export const SetCoordsDetailRealTime = infoCoords => ({
  type: SET_DETAIL_COORDS,
  payload: infoCoords,
});
export const SaveIdWatch = idWatch => ({
  type: SAVE_IDWATCH_GEOLOCATION,
  payload: idWatch,
});

export const SetIsInitDrivingVisit = status => ({
  type: SET_INIT_VISITDRIVER,
  payload: status,
});

export const SaveUUIDRoute = uuid => ({
  type: SAVE_UUID_ROUTE_CUSTOMER,
  payload: uuid,
});
export const SaveVisitCreated=(data)=>({
  type:SAVE_VISIT_CREATED,
  payload:data
})
export const AddVisit = idVisit => ({
  type: ADD_VISIT_CREATED,
  payload: idVisit,
});
export const SaveIsArriveOrNotTheVisit=(status)=>({
  type:SAVE_IS_ARRIVE_OR_END_VISIT,
  payload:status
});
export const SaveContactPerson=(ListContactPerson)=>({
  type:SAVE_CONTACT_PERSON_CUSTOMER,
  payload:ListContactPerson
});

export const LoadRefreshLocation=(Status)=>({
  type:LOAD_REFRESH_LOCATION,
  payload:Status
});

export const SaveDetailCustomer=(customer)=>({
  type:SAVE_CUSTOMER_DETAIL,
  payload:customer
})
export const SaveDocumentCustomer=(document)=>({
  type:SAVE_DOC_OPEN_CUSTOMER,
  payload:document
})