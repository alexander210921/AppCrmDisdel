import { combineReducers } from "redux";
import loginReducers from "./ReducerUsers/ReducerUsers";
import companyReducers from './ReducerCompany/ReducerCompany'
import RolesReducers from './ReducerRol/ReducerRol'
export default combineReducers({
    login:loginReducers,
    company:companyReducers,
    rol:RolesReducers  
});
