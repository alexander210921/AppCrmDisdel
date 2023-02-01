import {LOAD_GET_CUSTOMERS_VENDOR,GET_CUSTOMER_VENDOR,SET_CUSTOMER_SELECTED,LOAD_SET_VISIT_CUSTOMER} from "../../Types/index";

const initialState = { 
    ListCustomer:[],
    loadCustomer:false,
    customerSelect:[],
    loadSetVisit:false    
};
    
  export default  function  (state = initialState, action) {
    switch (action.type) {                    
      case LOAD_GET_CUSTOMERS_VENDOR:
        return {
            ...state,
            loadCustomer: action.payload,                                                                                              
        };   
      case GET_CUSTOMER_VENDOR:
        return {
          ...state,
          ListCustomer:action.payload
        } 
      case SET_CUSTOMER_SELECTED:
        return {
          ...state,
          customerSelect:action.payload
        }
      case LOAD_SET_VISIT_CUSTOMER:
        return {
          ...state,
          loadSetVisit:action.payload
        }                  
      default:
        return state;
    }
  }  
  