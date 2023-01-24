import {LOAD_POST_MILEAGE} from '../../Store/Types/index';
import Axios from '../../lib/Axios/AxiosConfig';
import {Alert} from 'react-native';
//post mileage for vendors or pilots
export const SetMileage = (data,dispatch) => {
    try {
      Axios.post('MyWsMobil/api/Mobil/RegistrarKilometraje/',data)
        .then(response => {
          if(response.data){
            console.log(response.data)
             //dispatch(GetUser(response.data));
             //navigation.navigate("Home");
          }else{
            
          }
        })
        .catch(err => {
          
        });
    } finally {
     // dispatch(LoadGetUser(false));
    }
  };
  
  export const LoadPostMileage = RequestStatus =>({
    type:LOAD_POST_MILEAGE,
    payload:RequestStatus
  })