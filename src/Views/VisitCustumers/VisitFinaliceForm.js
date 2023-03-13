import React from 'react';
import {
  View,  
  Text,  
} from 'react-native-ui-lib';
import {useForm, Controller} from 'react-hook-form';
import {TextInput, StyleSheet, Alert,ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ButtonPrimary from '../../Components/Buttons/ButtonPrimary';
import {GetGeolocation} from '../../lib/Permissions/Geolocation';
import {
  LoadSetRegisterVisit,
  FunctionUpdateVisit,
  SaveVisitCreated,
  SaveIdWatch,
  SetIsInitDrivingVisit,
  SaveUUIDRoute,
  FunctionSetCoordsDetail
} from '../../Api/Customers/ApiCustumer';
import {useNavigation} from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import { AsyncStorageDeleteData } from '../../lib/AsyncStorage';
const FormFinaliceVisit = () => { 
  //ADD PHOTO END
  const navigation = useNavigation();
  const dispatch = useDispatch();
  //const CoordsDestination = useSelector(state => state.login);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      CustomerCode: '',
      CustomerName: '',
      Contact: '',
      Title: '',
      NextDate: '',
      NextHourDate: '',
      Bill: '',
      Comment: '',
    },
  }); 
  const Rol = useSelector(state => state.rol.RolSelect);
  const dataVisist = useSelector(state => state.Customer.VisitDetailSelected);
  const DrivingVisitDetail = useSelector(state => state.Mileage);
  const submitForm =async FormData => {
    
    try {   
       const coordsActuality = await  GetGeolocation();
        const visit = {
          IdRelacion: Rol[0]?.IdRelacion,
          IdRegistro: dataVisist.IdRegistro,
          Contacto: FormData.Contact?FormData.Contact:'',
          Titulo: FormData.Title?FormData.Title:'',                    
          Proceso: 'Finalizado',      
          UUIDGroup:DrivingVisitDetail.UUIDRoute,
          Minuta: FormData.Bill?FormData.Bill:'',
          Comentario: FormData.Comment?FormData.Comment:'',  
        };
        FunctionUpdateVisit(visit,dispatch,navigation,"FormCreateRoute");
        dispatch(SaveVisitCreated({
          IdVisit:dataVisist.IdRegistro,
          isEndVisit:true
        }));        
        AsyncStorageDeleteData("@dataRoute").then(()=>{       
          //Alert.alert("Se eliminó  "+DrivingVisitDetail.UUIDRoute);
        });
        dispatch(SetIsInitDrivingVisit(false));             
        if (DrivingVisitDetail.IdWatchLocation != null) {
          Geolocation.clearWatch(DrivingVisitDetail.IdWatchLocation);
          dispatch(SaveIdWatch(null));
        }  
        try{
          const coords = {
            Latitud:coordsActuality.Data.coords.latitude,
            Longitud:coordsActuality.Data.coords.longitude,
            UUIRecorrido:DrivingVisitDetail.UUIDRoute
          } 
          if(coords.Latitud && coords.Latitud>0){
            FunctionSetCoordsDetail(coords);
          }
        }catch{
          //dispatch(SaveUUIDRoute(''));           
        }     
        dispatch(SaveUUIDRoute(''));           
    } catch(ex) {
      Alert.alert(""+ex);
      dispatch(LoadSetRegisterVisit(false));
    }
  };

  return (
    <ScrollView>
      <View>      
        <Controller
          control={control}
          rules={{
            required: false,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Contacto"
              placeholderTextColor="#b3b2b7"
            />
          )}
          name="Contact"
        />
        {errors.Contact && (
          <Text style={styles.TextAlert}>Este campo es requerido</Text>
        )}

        <Controller
          control={control}
          rules={{
            required: false,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Tema"
              placeholderTextColor="#b3b2b7"
            />
          )}
          name="Title"
        />
        {errors.Title && (
          <Text style={styles.TextAlert}>Este campo es requerido</Text>
        )}

        <Controller
          control={control}
          rules={{
            required: false,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Minuta"
              placeholderTextColor="#b3b2b7"
            />
          )}
          name="Bill"
        />
        {errors.Bill && (
          <Text style={styles.TextAlert}>Este campo es requerido</Text>
        )}
        <Controller
          control={control}
          rules={{
            required: false,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Comentario"
              placeholderTextColor="#b3b2b7"
            />
          )}
          name="Comment"
        />
        {errors.Comment && (
          <Text style={styles.TextAlert}>Este campo es requerido</Text>
        )}          
        <View style={styles.ContainerMargin}>                    
            <ButtonPrimary
              label="Dar por finalizado"
              HandleClick={handleSubmit(submitForm)}></ButtonPrimary>          
        </View>
      </View>
    </ScrollView>
  );
};
export default FormFinaliceVisit;
const styles = StyleSheet.create({
  TextAlert: {
    color: 'red',
  },
  TextInformation: {
    color: '#88807B',
  },
  buttonAdress:{
    color:'black'
  },
  input: {
    height: 50,
    margin: 12,
    borderBottomColor: 'gray',
    padding: 10,
    color: 'black',
    shadowColor: '#ecedf0',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: 'white',
  },
  ContainerMargin: {
    margin: 12,
    marginTop: 5,
  },
});
