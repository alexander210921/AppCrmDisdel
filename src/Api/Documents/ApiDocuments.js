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

  export async function getPedidoByDocEntry (NombreDB,DocEntry){
    try{
      const {data} = await Axios.get("MyWsOneVenta/Api/Facturador/GetPedidoDocEntry/"+NombreDB+"/"+DocEntry);
      return data;
    }catch(ex){
      Alert.alert(""+ex);
      return null;
    }
  }

  export async function FacturarDocumento (Documento){
    try{
      const {data} = await Axios.post("MyWsOneVenta/api/FacturaSap/CrearFactura/",Documento);
      return data;
    }catch(ex){
      Alert.alert(""+ex);
      return null;
    }
  }
