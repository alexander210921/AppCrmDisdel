import {GET_PRODUCTS_BY_COMPANY,LOGOUT_USER} from "../../Types/index";

const initialState = { 
    ListProductCompany:[],
    
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
          ListProductCompany:[]     
        }
      default:
        return state;
    }
  }  
  