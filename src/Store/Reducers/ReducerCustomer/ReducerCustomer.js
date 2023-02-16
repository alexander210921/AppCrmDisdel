import {LOAD_GET_CUSTOMERS_VENDOR,GET_CUSTOMER_VENDOR,SET_CUSTOMER_SELECTED,LOAD_SET_VISIT_CUSTOMER,LOGOUT_USER,SET_VISIT_ACTUALITY,LOAD_GET_VISIT_ACTUALITY,LOAD_GET_ADRESS_CUSTOMER,GET_ADRESS_CUSTOMER,SAVE_VIVIST_DETAIL_SELECT,LOAD_UPDATE_VISIT} from "../../Types/index";

const initialState = { 
    ListCustomer:[],
    loadCustomer:false,
    customerSelect:[],
    loadSetVisit:false,
    RoutesInProgress:[],
    loadGetCurrentVisit:false,
    ListAdressCustomerSelect:[],
    loadGetAdress:false,
    VisitDetailSelected:null,
    loadUpdateVisit:false   
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
      case LOGOUT_USER:
        return {
          ...state,
          ListCustomer:[],
          loadCustomer:false,
          customerSelect:[],
          loadSetVisit:false,
          RoutesInProgress:[],
          loadGetCurrentVisit:false,
          ListAdressCustomerSelect:[],
          loadGetAdress:false,
          VisitDetailSelected:null,
          loadUpdateVisit:false
        }     
      case SET_VISIT_ACTUALITY:
        return{
          ...state,
          RoutesInProgress:action.payload
        }  
      case LOAD_GET_VISIT_ACTUALITY:{
        return {
          ...state,
          loadGetCurrentVisit:action.payload
        }
      }
      case GET_ADRESS_CUSTOMER:
        return{
          ...state,
          ListAdressCustomerSelect:action.payload
        }
      case LOAD_GET_ADRESS_CUSTOMER:
        return{
          ...state,
          loadGetAdress:action.payload
        }  
      case SAVE_VIVIST_DETAIL_SELECT:
        return {
          ...state,
          VisitDetailSelected:action.payload
        }  
      case LOAD_UPDATE_VISIT:
        return {
          ...state,
          loadUpdateVisit:action.payload
        }  
      default:
        return state;
    }
  }  
  