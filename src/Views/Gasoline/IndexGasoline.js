import React, {useState} from 'react';
import {View, Text, LoaderScreen} from 'react-native-ui-lib';
import {useForm, Controller} from 'react-hook-form';
import ButtonPrimary from '../../Components/Buttons/ButtonPrimary';
import {Alert, StyleSheet, TextInput, ScrollView} from 'react-native';
import {GetGeolocation} from '../../lib/Permissions/Geolocation/index';
import {SetGasoline} from '../../Api/Vendors/ApiVendors';
import { useSelector} from 'react-redux';
import {_base64ToArrayBuffer} from '../../lib/Converts/index';
import {useNavigation} from '@react-navigation/native';
const FormGasoline = () => {
  const company = useSelector(state=>state.company.CompanySelected);
  const User = useSelector(state => state.login.user);
  const [loadSetGasoline,setLoadGasoline]   = useState(false);
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      QuantityGallon: 0,
      Price: 0,
      MileageActuality: 0,
      Comentary: '',
    },
  });
  async function onSubmit(formData) {
    try {
      setLoadGasoline(true);
     // const coords = await GetGeolocation();
     //coords.Status
      if (true) {
        const data = {
          idUsuario:User.EntityID,  
          idCompania: company[0]?.EntityID,
          Kilometraje: parseInt(formData.MileageActuality),
          Comentario: formData.commentary ? formData.commentary : '',
          Latitud: 0,
          Longitud: 0,
          CantidadGalon:parseInt(formData.QuantityGallon),
          Precio:formData.Price,
        };
        const statusCreateMileage = await SetGasoline(data);
        setLoadGasoline(false);
        if (statusCreateMileage != null && statusCreateMileage.Resultado) {
            navigation.navigate('Home');
        } else if (
          statusCreateMileage != null &&
          !statusCreateMileage.Resultado
        ) {
          Alert.alert('' + statusCreateMileage.Mensaje);
        }
      } else {
        //Alert.alert(coords.Message);
      }
    } catch (ex) {
      setLoadGasoline(false);
      Alert.alert('' + ex);
    } finally {
        setLoadGasoline(false);
    }
  }
  return (
    <ScrollView>
      <View flex>
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
              placeholder="Cantidad de galones "
              placeholderTextColor="#b3b2b7"
              keyboardType="numeric"
            />
          )}
          name="QuantityGallon"
        />
        {errors.QuantityGallon && (
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
              placeholder="Precio"
              placeholderTextColor="#b3b2b7"
              keyboardType="numeric"
            />
          )}
          name="Price"
        />
        {errors.Price && (
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
              placeholder="Kilometraje "
              placeholderTextColor="#b3b2b7"
              keyboardType="numeric"
            />
          )}
          name="MileageActuality"
        />
        {errors.MileageActuality && (
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
          name="Comentary"
        />
        <View style={styles.containerButton}>
          {loadSetGasoline ? (
            <LoaderScreen
              color="black"
              message="Cargando..."
              overlay></LoaderScreen>
          ) : (
            <>
              <View style={styles.containerButton}>
                <ButtonPrimary
                  HandleClick={handleSubmit(onSubmit)}
                  label="Registrar Gasolina"
                  Backcolor="black"></ButtonPrimary>
              </View>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
};
export default FormGasoline;

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
  containerButton: {
    margin: '2%',
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 15,
    fontWeight: 'bold',
    padding: 20,
  },
  textStyle: {
    padding: 10,
    color: 'black',
    textAlign: 'center',
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 5,
    marginVertical: 10,
    width: 250,
  },
  imageStyle: {
    width: '100%',
    height: '100%',
  },
  ContainerimageStyle: {
    width: 200,
    height: 200,
    margin: 5,
  },
  containerLabelSwitch: {
    padding: 10,
    paddingTop: 1,
  },
});
