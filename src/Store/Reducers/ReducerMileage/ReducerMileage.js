import {LOAD_POST_MILEAGE} from "../../Types/index";

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
      default:
        return state;
    }
  }  
  