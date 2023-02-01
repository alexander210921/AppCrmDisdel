import {GET_USER_ROLES,SET_DEFAULT_ROL,LOGOUT_USER} from "../../Types/index";

const initialState = { 
    Roles:[],
    RolSelect:[]    
};
    
  export default  function  (state = initialState, action) {
    switch (action.type) {                    
      case GET_USER_ROLES:
        return {
            ...state,
            Roles: action.payload,                                                                                              
        };      
      case SET_DEFAULT_ROL:
        return {
          ...state,
          RolSelect:action.payload
        }
      case LOGOUT_USER:
        return {
          ...state,
          Roles:[],
          RolSelect:[]
        }               
      default:
        return state;
    }
  }  
  