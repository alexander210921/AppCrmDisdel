import {SAVE_DOCUMENTS_TRACKING_ASIGNED,SAVE_DOCUMENTS_TRACKING_ASIGNED_CHECKER,LOGOUT_USER,SAVE_DOCUMENTS_INROUTE,SAVE_BANK_COMPANY,SAVE_CHECKERS_BY_COMPANY} from "../../Types/index";
const initialState = { 
    DocumentAsigned:[],     
    DocumentAcepted:[],
    ListBank:[],
    ListChecker:[],
    DocumentsAssignedChecker:[]
};
export default  function  (state = initialState, action) {
    switch (action.type) {                    
      case SAVE_DOCUMENTS_TRACKING_ASIGNED:
        return {
            ...state,
            DocumentAsigned: action.payload,                                                                                              
        };  
       case SAVE_DOCUMENTS_TRACKING_ASIGNED_CHECKER:
        return{
          ...state,
          DocumentsAssignedChecker:action.payload
        }     
      case LOGOUT_USER:
        return {
          ...state,
          DocumentAsigned:[],
          DocumentAcepted:[],
          ListBank:[],
          ListChecker:[],
          DocumentsAssignedChecker:[]
        }
      case SAVE_DOCUMENTS_INROUTE:
        return{
          ...state,
          DocumentAcepted:action.payload
        }
      case SAVE_BANK_COMPANY:
        return{
          ...state,
          ListBank:action.payload
        }
      case SAVE_CHECKERS_BY_COMPANY:
        return{
          ...state,
          ListChecker:action.payload
        }                     
      default:
        return state;
    }
  }  
  