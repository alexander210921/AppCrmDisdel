import {GET_PRODUCTS_BY_COMPANY,LOGOUT_USER,SAVE_PRODUCT_FOR_VIEW} from "../../Types/index";

const initialState = { 
    ListProductCompany:[],
    ProductView:null
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
          ProductView:null     
        }
      case SAVE_PRODUCT_FOR_VIEW:
        return{
          ...state,
          ProductView:action.payload
        }  
      default:
        return state;
    }
  }  
  