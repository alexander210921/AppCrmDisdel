
import Axios from '../../lib/Axios/AxiosConfig';

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