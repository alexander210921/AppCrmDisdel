
import Axios from '../../lib/Axios/AxiosConfig';
import { SAVE_DOCUMENTS_TRACKING_ASIGNED } from '../../Store/Types';
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
  export const SaveDocumentsAsigned=(document)=>({
    type:SAVE_DOCUMENTS_TRACKING_ASIGNED,
    payload:document
  })