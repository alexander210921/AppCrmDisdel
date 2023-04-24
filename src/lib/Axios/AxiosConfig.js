import axios from "axios";
import var_env from '../../../configEnv'; 
const clienteAxiosAuth = axios.create({
  baseURL: var_env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  },
  timeout:10000
  
});
export default clienteAxiosAuth;
