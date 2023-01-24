import React from 'react';
import {View,Text} from 'react-native-ui-lib';
import {useForm, Controller} from 'react-hook-form';
import ButtonPrimary from '../../Components/Buttons/ButtonPrimary';
import {Alert, StyleSheet,TextInput} from 'react-native'
import { GetGeolocation } from '../../lib/Geolocation';
import { LoadPostMileage,SetMileage } from '../../Api/Vendors/ApiVendors';
import { useDispatch, useSelector } from 'react-redux';

const FormCreateRoute = () => {
  const dispatch = useDispatch();
  const Rol = useSelector(state=>state.rol.RolSelect);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      milaege: '',
      commentary: '',
    },
  });
 async function   onSubmit(formData) {
  const coords = await GetGeolocation()
  if(coords.Status){    
    //create a object data
    const data = {
      IdRelacion:Rol[0]?.IdRelacion,
      Kilometraje:formData.milaege,
      Comentario:formData.commentary,
      Latitud : coords.Data.coords.latitude,
      Longitud:coords.Data.coords.longitude
    }
  
    console.log(Rol[0]);    
    dispatch(LoadPostMileage(true));    
    SetMileage(data);
  }else{
    Alert.alert(coords.Message);
  }

  }
  return (
    <View flex >
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Kilometraje"
            placeholderTextColor="#b3b2b7"
            keyboardType="numeric"
          />
        )}
        name="milaege"
      />
      {errors.milaege && (
        <Text style={styles.TextAlert}>Este campo es requerido</Text>
      )}

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Comentario"
            placeholderTextColor="#b3b2b7"
            multiline
            numberOfLines={3}
          />
        )}
        name="commentary"
      />
      {errors.commentary && (
        <Text style={styles.TextAlert}>Este campo es requerido</Text>
      )}
      <View style={styles.containerButton}>
      <ButtonPrimary
        HandleClick={handleSubmit(onSubmit)}
        label="Crear"
        Backcolor="black"></ButtonPrimary>
      </View>
      
    </View>
  );
};
export default FormCreateRoute;

const styles = StyleSheet.create({
  InputStyle: {
    color: '#a2a3a5',
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
  TextAlert: {
    color: 'red',
  },
  containerButton:{
    margin:'5%'
  }
});
