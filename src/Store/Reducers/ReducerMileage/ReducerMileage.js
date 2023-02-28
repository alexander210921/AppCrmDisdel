import {LOAD_POST_MILEAGE,LOGOUT_USER,SET_INIT_OR_END_MILEAGE,SAVE_IDWATCH_GEOLOCATION} from "../../Types/index";

const initialState = { 
    LoadPostMileage:false,
    isInitMileage:true, // is true because is first login then is init mileage
    IdWatchLocation:null
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
          isInitMileage:true,
          IdWatchLocation:null
        }
      case SET_INIT_OR_END_MILEAGE:
        return {
          ...state,
          isInitMileage:action.payload
        }
      case SAVE_IDWATCH_GEOLOCATION:
        return {
          ...state,
          IdWatchLocation:action.payload
        }                    
      default:
        return state;
    }
  }  
  