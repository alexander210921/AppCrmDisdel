import {SAVE_DOCUMENTS_TRACKING_ASIGNED,LOGOUT_USER} from "../../Types/index";
const initialState = { 
    DocumentAsigned:[],     
};
export default  function  (state = initialState, action) {
    switch (action.type) {                    
      case SAVE_DOCUMENTS_TRACKING_ASIGNED:
        return {
            ...state,
            DocumentAsigned: action.payload,                                                                                              
        };      
      case LOGOUT_USER:
        return {
          ...state,
          DocumentAsigned:[],
        }               
      default:
        return state;
    }
  }  
  