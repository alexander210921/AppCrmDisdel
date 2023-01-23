import {GET_USER_ROLES} from "../../Types/index";

const initialState = { 
    Roles:[]    
};
    
  export default  function  (state = initialState, action) {
    switch (action.type) {                    
      case GET_USER_ROLES:
        return {
            ...state,
            Roles: action.payload,                                                                                              
        };                
      default:
        return state;
    }
  }  
  