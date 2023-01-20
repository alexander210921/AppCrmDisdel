import axios from "axios";
import var_env from '../../../configEnv'; 
const clienteAxiosAuth = axios.create({
  baseURL: var_env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
});
export default clienteAxiosAuth;
