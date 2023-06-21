
import Axios from '../../lib/Axios/AxiosConfig';
import { SAVE_DOCUMENTS_TRACKING_ASIGNED,SAVE_DOCUMENTS_INROUTE } from '../../Store/Types';
export async function GetDocumentsAsignedUser (IdUser){
    if(!IdUser){
        return null;
    }
    try{
      const {data} = await Axios.get("MyWsOneVenta/api/Tracking/GetTrackingPorUsuarioEstadoFE/"+IdUser+"/");
      return data;
    }catch(ex){    
      return null;
    }
  }


  export const IniciarRutaporIdTracking =async (list) => {
    try{
      const {data} = await Axios.post('MyWsOneVenta/api/Tracking/ActualizaElEstadoListaRutaEnCurso', list)
      return data;
    }catch{
      return null;
    }      
  };

  export const ArriveDelevery =async (dataArrive) => {
    try{
      const {data} = await Axios.post('MyWsOneVenta/api/TrackingDetalle/NoEntregadoDocumentoAppMovil', dataArrive)
      return data;
    }catch{
      return null;
    }      
  };

  export const UpdateStateTracking =async (dataObject) => {
    //data insert id tracking and name process of tracking
    try{
      const {data} = await Axios.post('MyWsOneVenta/api/Tracking/ActualizaElEstadoRutaEnCurso/', dataObject)
      return data;
    }catch{
      return null;
    }      
  };

  export const GetDocumentsInRoute =async (EmpID) => {
    try{
      const {data} = await Axios.get('MyWsOneVenta/api/Tracking/GetTrackingPorUsuarioEstadoR/'+EmpID)
      return data;
    }catch{
      return null;
    }      
  };

  export const GetDocumentsPilot =async (NombreDB,Process,EmpID) => {
    // 
    try{
      const {data} = await Axios.get('MyWsOneVenta/api/Tracking/GetDocumentsPilot/'+NombreDB+"/"+Process+"/"+EmpID)
      return data;
    }catch{
      return null;
    }      
  };

  export const GetDetailDocument =async (NombreDB,DocEntry,TypeDoc) => {
    try{
      switch(TypeDoc){
        case "Entrega":{
          const {data} = await Axios.get('MyWsOneVenta/api/DetalleReporteriaInterna/GetENTDocEntry/'+NombreDB+"/"+DocEntry)
          return data;          
        }
        case "Factura":{
          const {data} = await Axios.get('MyWsOneVenta/api/DetalleReporteriaInterna/GetFacDocEntry2/'+NombreDB+"/"+DocEntry)
          return data;          
        }
        default:
          return null;
      }
    }catch{
      return null;
    }      
  };

  export const GetDetailRoute =async (Objectdata) => {
    try{
      const {data} = await Axios.post('MyWsOneVenta/api/Tracking/GetDireccionDelDocumentoapp',Objectdata)
      return data;
    }catch{
      return null;
    }      
  };

  export const SaveDocumentsAsigned=(document)=>({
    type:SAVE_DOCUMENTS_TRACKING_ASIGNED,
    payload:document
  })

  export const SaveDocumentsRoute=(document)=>({
    type:SAVE_DOCUMENTS_INROUTE,
    payload:document
  })

  