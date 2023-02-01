import {LOAD_POST_MILEAGE,LOGOUT_USER} from "../../Types/index";

const initialState = { 
    LoadPostMileage:false
};
    
  export default  function  (state = initialState, action) {
    switch (action.type) {                    
      case LOAD_POST_MILEAGE:
        return {
            ...state,
            LoadPostMileage: action.payload,                                                                                              
        };  
      case LOGOUT_USER:
        return {
          ...state,
          LoadPostMileage:false
        }                
      default:
        return state;
    }
  }  
  