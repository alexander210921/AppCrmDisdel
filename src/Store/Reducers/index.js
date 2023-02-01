import { combineReducers } from "redux";
import loginReducers from "./ReducerUsers/ReducerUsers";
import companyReducers from './ReducerCompany/ReducerCompany'
import RolesReducers from './ReducerRol/ReducerRol'
import ReducerMileage from "./ReducerMileage/ReducerMileage";
import ReducerCustomer from "./ReducerCustomer/ReducerCustomer";
export default combineReducers({
    login:loginReducers,
    company:companyReducers,
    rol:RolesReducers,
    Mileage:ReducerMileage,
    Customer:ReducerCustomer  
});
