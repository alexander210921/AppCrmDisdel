import React, {useState} from 'react';
import {View, Text, LoaderScreen} from 'react-native-ui-lib';
import {useForm, Controller} from 'react-hook-form';
import ButtonPrimary from '../../Components/Buttons/ButtonPrimary';
import {
  Alert,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import {GetGeolocation} from '../../lib/Permissions/Geolocation/index';
import {LoadPostMileage, SetMileage} from '../../Api/Vendors/ApiVendors';
import {useDispatch, useSelector} from 'react-redux';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {_base64ToArrayBuffer}from'../../lib/Converts/index'
import { requestExternalWritePermission } from '../../lib/Permissions/Files';
import { requestCameraPermission } from '../../lib/Permissions/Camera';
const FormCreateRoute = () => {
  const dispatch = useDispatch();
  const Rol = useSelector(state => state.rol.RolSelect);
  const Milaege = useSelector(state => state.Mileage);
  //init handle config permission to acces camera and storage
  const [filePath, setFilePath] = useState({});
  const [base64Image, setBase64Image] = useState('');
  const captureImage = async type => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 4,
      videoQuality: 'low',
      durationLimit: 30, //Video max duration in seconds
      saveToPhotos: true,
      base64: true,
      includeBase64: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, response => {
        if (response.didCancel) {
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return;
        }

        setFilePath(response.assets[0]);
        setBase64Image(response.assets[0].base64);
      });
    }
  };

  const chooseFile = type => {
    let options = {
      mediaType: type,
      quality: 4,
      base64: true,
      includeBase64: true,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return;
      }
      setFilePath(response.assets[0]);
      setBase64Image(response.assets[0].base64);
    });
  };
  // end config acces
  const HandleChooseFile = async () => {};
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
  async function onSubmit(formData) {
    try{
      dispatch(LoadPostMileage(true));
      const coords = await GetGeolocation();
      if (coords.Status) {
        const data = {
          IdRelacion: Rol[0]?.IdRelacion,
          Kilometraje: formData.milaege,
          Comentario: formData.commentary,
          Latitud: coords.Data.coords.latitude,
          Longitud: coords.Data.coords.longitude,
          AuxBase64Image:base64Image,
        };              
        SetMileage(data, dispatch);
      } else {
        Alert.alert(coords.Message);
        dispatch(LoadPostMileage(false));
      }
    }catch(ex){
      Alert.alert(ex);
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
          {/* component open file image */}
          {Milaege.LoadPostMileage ? (
            <LoaderScreen
              color="black"
              message="Cargando..."
              overlay></LoaderScreen>
          ) : (
            <>
              {filePath.uri ? (
                <View style={styles.ContainerimageStyle}>
                    <Image source={{uri: filePath.uri}} style={styles.imageStyle} />
                </View>                
              ) : null}
              <View style={styles.containerButton}>
                <View style={{margin: '1%'}}>
                  <ButtonPrimary
                    HandleClick={() => {
                      captureImage('photo');
                    }}
                    label="Tomar Fotografía"
                    Backcolor="#001835"></ButtonPrimary>
                </View>

                <ButtonPrimary
                  HandleClick={() => {
                    chooseFile('photo');
                  }}
                  label="Elegir desde galeria"
                  Backcolor="#001835"></ButtonPrimary>
              </View>
              <View style={styles.containerButton}>
                <ButtonPrimary
                  HandleClick={handleSubmit(onSubmit)}
                  label="Crear"
                  Backcolor="black"></ButtonPrimary>
              </View>
            </>
          )}
        </View>
      </View>
    </ScrollView>
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
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
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
    width: "100%",
    height: "100%",
  },
  ContainerimageStyle: {
    width: 200,
    height: 200,
    margin: 5,
  },
});
