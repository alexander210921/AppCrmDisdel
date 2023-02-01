import {GET_USER,LOAD_GET_USER,LOGOUT_USER} from "../../Types/index";

const initialState = { 
    user:null,
    LoadUser:false
} ;
    
  export default  function  (state = initialState, action) {
    switch (action.type) {                    
      case GET_USER:
        return {
            ...state,
            user: action.payload,                                                                                              
        }; 
      case LOAD_GET_USER:
        return {
          ...state,
          LoadUser:action.payload
        }
      case LOGOUT_USER:
        return {
          ...state,
          user:null,
          LoadUser:false
        }                
      default:
        return state;
    }
  }  