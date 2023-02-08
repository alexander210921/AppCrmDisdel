import {LOAD_POST_MILEAGE,LOGOUT_USER,SET_INIT_OR_END_MILEAGE} from "../../Types/index";

const initialState = { 
    LoadPostMileage:false,
    isInitMileage:true // is true because is first login then is init mileage
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
          LoadPostMileage:false,
          isInitMileage:true
        }
      case SET_INIT_OR_END_MILEAGE:
        return {
          ...state,
          isInitMileage:action.payload
        }                  
      default:
        return state;
    }
  }  
  