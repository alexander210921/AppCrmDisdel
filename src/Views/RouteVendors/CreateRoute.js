import React, {useState} from 'react';
import {View, Text, LoaderScreen, Button} from 'react-native-ui-lib';
import {useForm, Controller} from 'react-hook-form';
import ButtonPrimary from '../../Components/Buttons/ButtonPrimary';
import {Alert, StyleSheet, TextInput, Image, ScrollView, InteractionManager} from 'react-native';
import {GetGeolocation} from '../../lib/Permissions/Geolocation/index';
import {
  LoadPostMileage,
  SetMileage,  
} from '../../Api/Vendors/ApiVendors';
import {useDispatch, useSelector} from 'react-redux';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {_base64ToArrayBuffer} from '../../lib/Converts/index';
import {requestExternalWritePermission} from '../../lib/Permissions/Files';
import {requestCameraPermission} from '../../lib/Permissions/Camera';
import { useNavigation } from '@react-navigation/native';
import { AsyncStorageSaveDataJson } from '../../lib/AsyncStorage';
const FormCreateRoute = () => {
  const dispatch = useDispatch();
  const Rol = useSelector(state => state.rol.RolSelect);
  const Milaege = useSelector(state => state.Mileage);
  const isEndVisit = useSelector(state=>state.Customer);
  const navigation = useNavigation();
  //init handle config permission to acces camera and storage
  const [filePath, setFilePath] = useState({});
  const [base64Image, setBase64Image] = useState('');  
  const visitSelect = useSelector(state => state.Customer.VisitDetailSelected);
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
          Alert.alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          Alert.alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          Alert.alert(response.errorMessage);
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
      quality: 2,
      base64: true,
      includeBase64: true,
      maxWidth:300,
      maxHeight:300
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        Alert.alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        Alert.alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        Alert.alert(response.errorMessage);
        return;
      }
      setFilePath(response.assets[0]);
      setBase64Image(response.assets[0].base64);
    });
  };
  // end config acces
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
      let isEndMileague = false;
      if(isEndVisit.VisitArriveOrEnd && isEndVisit.VisitArriveOrEnd =="N" ){
        isEndMileague = false;
      }else if(isEndVisit.VisitArriveOrEnd && isEndVisit.VisitArriveOrEnd =="Y"){
        isEndMileague = true;
      }      
      dispatch(LoadPostMileage(true));
      const coords = await GetGeolocation();
      if (coords.Status) {
        const data = {
          IdRelacion: Rol[0]?.IdRelacion,
          Kilometraje: parseInt(formData.milaege) ,
          Comentario: formData.commentary?formData.commentary:'',
          Latitud: coords.Data.coords.latitude,
          Longitud: coords.Data.coords.longitude,
          AuxBase64Image:base64Image,
          idVisita:visitSelect.IdRegistro,
          TipoKilometraje:isEndMileague
        };

        const statusCreateMileage = await SetMileage(data, dispatch);
        if(statusCreateMileage!=null && statusCreateMileage.Resultado){
          if(false){
            const dataMileague={
              ...data,
              ImageName:statusCreateMileage.MensajeAux,
              EntityID :statusCreateMileage.DocNum,
              DateCreatedMileague : new Date().toLocaleDateString(),
            }
            await AsyncStorageSaveDataJson("@Mileague",dataMileague);
          }
          if(isEndMileague){
            navigation.navigate("VisitCreated");
          }else{
            navigation.navigate("DetailVisit");
          }
          
        }else if(statusCreateMileage!=null && !statusCreateMileage.Resultado){
          Alert.alert(""+statusCreateMileage.Mensaje);
        }
      } else {
        Alert.alert(coords.Message);
        dispatch(LoadPostMileage(false));
      }
    }catch(ex){
      Alert.alert(""+ex);
    }finally{
      dispatch(LoadPostMileage(false));
    }
  }
  return (
    <ScrollView>
      <View flex>
        {isEndVisit.VisitArriveOrEnd && isEndVisit.VisitArriveOrEnd =="N" ?<Text style={styles.titleText} >Adjunte su kilometraje final</Text>:<Text style={styles.titleText}>Adjunte su kilometraje inicial</Text>}
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
                  <Image
                    source={{uri: filePath.uri}}
                    style={styles.imageStyle}
                  />
                </View>
              ) : null}
              <View style={styles.containerButton}>
                <View style={{margin: '1%'}}>
                  {/* <ButtonPrimary
                    HandleClick={() => {
                      captureImage('photo');
                    }}
                    label="Tomar Fotografía"
                    Backcolor="#001835"></ButtonPrimary> */}
                </View>
                <Button color="white" style={styles.buttonAdress} label={'Elegir imagen de galería'} size={Button.sizes.small} backgroundColor={"#c6e2e9"} onPress={()=>{chooseFile('photo');}}/>
                {/* <Button
                                    
                  HandleClick={() => {
                    chooseFile('photo');
                  }}
                  label="Elegir desde galeria"
                  Backcolor="#001835"></Button> */}
              </View>
              <View style={styles.containerButton}>
                <ButtonPrimary
                  HandleClick={handleSubmit(onSubmit)}
                  label="Crear"
                  Backcolor="black"></ButtonPrimary>
              </View>
              {/* <View style={styles.containerButton}>
                <ButtonPrimary
                  HandleClick={()=>{navigation.navigate(Milaege.idVisitCreated?.isEndVisit?"VisitCreated":"VisitCreated")}}
                  label="Omitir"
                  Backcolor="black"></ButtonPrimary>
              </View> */}
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
    fontSize: 15,
    fontWeight: 'bold',
    padding:20
    //textAlign: 'center',
    //paddingVertical: 20,
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
