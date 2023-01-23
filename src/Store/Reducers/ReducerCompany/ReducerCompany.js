import {GET_USER_COMPANY} from "../../Types/index";

const initialState = { 
    Company:[]    
};
    
  export default  function  (state = initialState, action) {
    switch (action.type) {                    
      case GET_USER_COMPANY:
        return {
            ...state,
            Company: action.payload,                                                                                              
        };                
      default:
        return state;
    }
  }  
  