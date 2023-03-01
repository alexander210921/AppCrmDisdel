import {LOAD_POST_MILEAGE,LOGOUT_USER,SET_INIT_OR_END_MILEAGE,SAVE_IDWATCH_GEOLOCATION,SET_INIT_VISITDRIVER,SAVE_UUID_ROUTE_CUSTOMER} from "../../Types/index";

const initialState = { 
    LoadPostMileage:false,
    isInitMileage:true, // is true because is first login then is init mileage
    IdWatchLocation:null,
    isRouteInCourse:false,
    UUIDRoute:''
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
      case SET_INIT_VISITDRIVER:
        return {
          ...state,
          isRouteInCourse:action.payload
        }  
      case SAVE_UUID_ROUTE_CUSTOMER:
        return {
          ...state,
          UUIDRoute:action.payload
        }                      
      default:
        return state;
    }
  }  
  