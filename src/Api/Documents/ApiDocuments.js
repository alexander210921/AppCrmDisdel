import Axios from '../../lib/Axios/AxiosConfig';
import {Alert} from 'react-native'
export async function ChangePackingLineOrder (data){
    try{
      const {data} = await Axios.post("MyWsOneVenta/api/OrdenVentaAux/Modificar/",data);
      return data;
    }catch(ex){
      //Alert.alert(""+ex);
      return null;
    }
  }

  export async function UpdateOrderAddLine (dataObject){
    try{
      const {data} = await Axios.post("MyWsOneVenta/api/OrdenVentaAux/Addlinea",dataObject);
      return data;
    }catch(ex){
      Alert.alert(""+ex);
      return null;
    }
  }

  export async function UpdateOrderDeleteLine (dataObject){
    try{
      const {data} = await Axios.post("MyWsOneVenta/api/OrdenVentaAux/Modificar",dataObject);
      return data;
    }catch(ex){
      Alert.alert(""+ex);
      return null;
    }
  }
