import { combineReducers } from "redux";
import loginReducers from "./ReducerUsers/ReducerUsers";

export default combineReducers({
    login:loginReducers,
  
});
