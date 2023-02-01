import {GET_USER_COMPANY,SET_DEFAULT_COMPANY,LOGOUT_USER} from "../../Types/index";

const initialState = { 
    Company:[],
    CompanySelected:[]    
};
    
  export default  function  (state = initialState, action) {
    switch (action.type) {                    
      case GET_USER_COMPANY:
        return {
            ...state,
            Company: action.payload,                                                                                              
        };   
      case SET_DEFAULT_COMPANY:
        return {
          ...state,
          CompanySelected:action.payload
        }
      case LOGOUT_USER :
        return {
          ...state,
          Company:[],
          CompanySelected:[]
        }             
      default:
        return state;
    }
  }  
  