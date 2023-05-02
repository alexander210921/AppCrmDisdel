import {LOAD_GET_CUSTOMERS_VENDOR,GET_CUSTOMER_VENDOR,SET_CUSTOMER_SELECTED,LOAD_SET_VISIT_CUSTOMER,LOGOUT_USER,SET_VISIT_ACTUALITY,LOAD_GET_VISIT_ACTUALITY,LOAD_GET_ADRESS_CUSTOMER,GET_ADRESS_CUSTOMER,SAVE_VIVIST_DETAIL_SELECT,LOAD_UPDATE_VISIT,DELETE_VISIT,ADD_VISIT_CREATED,SAVE_IS_ARRIVE_OR_END_VISIT,SAVE_CONTACT_PERSON_CUSTOMER} from "../../Types/index";

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
    loadUpdateVisit:false,
    VisitArriveOrEnd:null,
    ListContactPerson:[]   
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
          loadUpdateVisit:false,
          VisitArriveOrEnd:null,
          ListContactPerson:[]  
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
      case DELETE_VISIT:
        let OmitVisit = [...state.RoutesInProgress]
        if(OmitVisit && OmitVisit.length>0){
          OmitVisit = OmitVisit.filter(x=>x.IdRegistro!=action.payload);
        }
        return {
          ...state,
          RoutesInProgress:OmitVisit
        }   
      case ADD_VISIT_CREATED:
        let newVisit=[...state.RoutesInProgress]
        newVisit.push(action.payload);
        return {
          ...state,
          RoutesInProgress:newVisit
        }
      case SAVE_IS_ARRIVE_OR_END_VISIT:
        return{
          ...state,
          VisitArriveOrEnd:action.payload
        }
      case SAVE_CONTACT_PERSON_CUSTOMER:
        return {
          ...state,
          ListContactPerson:action.payload
        }       
      default:
        return state;
    }
  }  
  