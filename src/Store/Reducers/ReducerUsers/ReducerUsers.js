import {GET_USER,LOAD_GET_USER,LOGOUT_USER,SET_COORDS_ACTUALITY,SET_COORDS_DESTINATION} from "../../Types/index";

const initialState = { 
    user:null,
    LoadUser:false,
    coordsActuality:{
      latitude:0,
      longitude:0
    },
    coordsDestination:{
      latitude:0,
      longitude:0
    }
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
          LoadUser:false,
          coordsActuality:{
            latitude:0,
            longitude:0
          }
        } 
      case SET_COORDS_ACTUALITY:
        return {
          ...state,
          coordsActuality:action.payload
        }
      case SET_COORDS_DESTINATION:
        return {
          ...state,
          coordsDestination:action.payload
        }
      default:
        return state;
    }
  }  