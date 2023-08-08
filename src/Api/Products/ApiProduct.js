import { GET_PRODUCTS_BY_COMPANY,SAVE_PRODUCT_FOR_VIEW,SET_ITEM_CHANGE,SET_NEW_ITEM_CHANGE } from '../../Store/Types';
import Axios from '../../lib/Axios/AxiosConfig';
import {Alert} from 'react-native'
export async function GetListProductByCompany (NombreDB=""){
    try{
      const {data} = await Axios.get("mywsmobil/api/catalogoweb/GetPreciosProductos/"+NombreDB+"/");
      return data;
    }catch(ex){
      Alert.alert(""+ex);
      return null;
    }
  }
  export const SaveProductsByCompany = data => ({
    type: GET_PRODUCTS_BY_COMPANY,
    payload: data,
  });

  export const SaveProductSelectForView = product => ({
    type: SAVE_PRODUCT_FOR_VIEW,
    payload: product,
  });
//guarda el producto que se desea cambiar
  export const SaveProductChange = product => ({
    type: SET_ITEM_CHANGE,
    payload: product,
  });
//guarda el reemplazo del producto a cambiar
  export const SaveProductReplace = product => ({
    type: SET_NEW_ITEM_CHANGE,
    payload: product,
  });