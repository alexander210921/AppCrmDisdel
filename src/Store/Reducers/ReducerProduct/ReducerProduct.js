import {GET_PRODUCTS_BY_COMPANY,LOGOUT_USER,SAVE_PRODUCT_FOR_VIEW,SET_ITEM_CHANGE,SET_NEW_ITEM_CHANGE,SAVE_DOCUMENT_SELECTED_CHECKER} from "../../Types/index";

const initialState = { 
    ListProductCompany:[],
    ProductView:null,
    itemReplace:null,
    newItem:null,
    DataDocumentSelect:null
   
};
    
  export default  function  (state = initialState, action) {
    switch (action.type) {                    
      case GET_PRODUCTS_BY_COMPANY:
        return {
            ...state,
            ListProductCompany: action.payload,                                                                                              
        };  
      case LOGOUT_USER:
        return {
          ...state,
          ListProductCompany:[],
          ProductView:null,
          DataDocumentSelect:null,
          newItem:null,
          itemReplace:null     
        }
      case SAVE_PRODUCT_FOR_VIEW:
        return{
          ...state,
          ProductView:action.payload
        }
      case SET_ITEM_CHANGE:
        return{
          ...state,          
          itemReplace:action.payload          
        }
      case SET_NEW_ITEM_CHANGE:
        return {
          ...state,          
          newItem:action.payload          
        }
      case SAVE_DOCUMENT_SELECTED_CHECKER:
        return{
          ...state,
          DataDocumentSelect:action.payload
        }        
      default:
        return state;
    }
  }  
  