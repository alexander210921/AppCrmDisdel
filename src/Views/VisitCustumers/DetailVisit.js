import {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {
  Text,
  View,
  Button,
  LoaderScreen,
  TextArea,
  Chip,
} from 'react-native-ui-lib';
import {useDispatch, useSelector} from 'react-redux';
import StylesWrapper from '../../Styles/Wrapers';
import {
  DeleteVisit,
  FunctionSetCoordsDetail,
  FunctionUpdateVisit,
  GetContactPersonCardCode,
  GetVisitByID,
  LoadUpdateVisit,
  SaveContactPerson,
  SaveIsArriveOrNotTheVisit,
  ValidateDistanceIsValid,
} from '../../Api/Customers/ApiCustumer';
import {useNavigation} from '@react-navigation/native';
import {AlertConditional} from '../../Components/TextAlert/AlertConditional';
import {StopInitVisit} from '../../lib/Visits';
import {GetGeolocation} from '../../lib/Permissions/Geolocation';
import BackgroundService from 'react-native-background-actions';
import Geolocation from '@react-native-community/geolocation';
import FormCreateRoute from '../RouteVendors/CreateRoute';
import { SaveSelectVisitDetail } from '../../Api/Customers/ApiCustumer';
import { AsyncStorageGetData } from '../../lib/AsyncStorage';

const googleMapsClient = require('react-native-google-maps-services').createClient({
  key: 'AIzaSyBGzUb5aIQyMpPPaBNZz9CJXvuQDajqavs'
});

const DetailVisit = () => {
  const data = useSelector(state => state.Customer.VisitDetailSelected);
  const isLoadUpadateVisit = useSelector(state => state.Customer);
  const DrivingVisitDetail = useSelector(state => state.Mileage);
  const Rol = useSelector(state => state.rol.RolSelect);
  const User = useSelector(state => state.login.user);
  const [isUpdateVisitArrive, setIsUpdateVisitArrive] = useState(false);
  const [comentary, setComentary] = useState(
    data.Comentario ? data.Comentario : '',
  );
  const [visit, setVisit] = useState({
    IdRelacion: Rol[0].IdRelacion,
    IdRegistro: data.IdRegistro,
    Proceso: '',
    Comentario: comentary,
    UUIDGroup: '',
    isInitVisit: false,
    isEndVisit: false,
  });
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const HandleSetComentary = e => {
    setComentary(e.value);
  };
  const ConfirmCancelVisit = async () => {
    visit.Proceso = 'Cerrado';
    const statusUpdate = await FunctionUpdateVisit(visit, dispatch, navigation);
    if (statusUpdate != null && statusUpdate.Resultado) {
      //to canceled visita if nor are visit
      //StopInitVisit(DrivingVisitDetail.IdWatchLocation,dispatch);
      if (isLoadUpadateVisit.RoutesInProgress.length == 1) {
        //await StopInitVisit(DrivingVisitDetail.IdWatchLocation, dispatch);
      }
      dispatch(DeleteVisit(visit.IdRegistro));
      navigation.navigate('VisitCreated');
    } else if (statusUpdate != null && !statusUpdate.Resultado) {
      Alert.alert(statusUpdate.Mensaje);
    }
  };
  const HandleUpdateVisit = async typeOption => {
    try {
      dispatch(LoadUpdateVisit(true));
      switch (typeOption) {
        case 1: {
          try{
            const GetVisit = await GetVisitByID(data.IdRegistro);
            if (
              GetVisit != null &&
              GetVisit['<isMarkerArrival>k__BackingField'] == true
            ) {
              Alert.alert(
                'Ya se marcó la llegada',
                'Esta visita ya tiene marcado un horario de llegada',
              );
              return;
            } else if (GetVisit == null) {
              Alert.alert('Ocurrió un error', 'Intenta nuevamente por favor');
              return;
            }
            if (!DrivingVisitDetail.isRouteInCourse && typeOption == 1) {
              Alert.alert('Inicie primero el viaje antes de marcar su Llegada ');
              return;
            }
            let isValidUUID = await AsyncStorageGetData("@uuid");
            
            const getCoords = await GetGeolocation();
            if(!getCoords.Status){
              Alert.alert("Alerta",""+getCoords.Message);
              return;
            }
            try{
              Geolocation.clearWatch(0);
              Geolocation.stopObserving();      
              await BackgroundService.stop();        
            }catch(ex){
              console.log(ex);
            }
            const coords = {
              Latitud: getCoords.Data.coords.latitude,
              Longitud: getCoords.Data.coords.longitude,
              UUIRecorrido: isValidUUID
                ? isValidUUID
                : '',
              idUsuario: User.EntityID,
            };
            
         
            const createObjectValidateDistance ={
              NombreDB:"SBO_DISDELSA_2013",
              CardCode:data.CardCode,
              IdDireccionVisita:data.IdDireccionVisita,
              Latitud: coords.Latitud,
              Longitud:coords.Longitud
            }
            if(data.EsRegreso =="N"){
              const isvalidDistance = await ValidateDistanceIsValid(createObjectValidateDistance);
              if(isvalidDistance == null){
                dispatch(LoadUpdateVisit(true));
                Alert.alert("Alerta","Error intente nuevamente");
                return;
              }
              if(!isvalidDistance.Resultado){
                Alert.alert("",isvalidDistance.Mensaje)
                return;
              }
            }                        
            visit.LatitudeDestino = 0;
            visit.longitude = 0;
            visit.UUIDGroup = isValidUUID;
            visit.isInitVisit = true;
            // if(data.EsRegreso =="Y"){
            //   visit.Proceso="Finalizado"
            // }
            const resultUpdate = await FunctionUpdateVisit(
              visit,
              dispatch,
              navigation,
            );
            if (resultUpdate != null && resultUpdate.Resultado) {
             
              try {                            
                if (coords.Latitud && coords.Latitud > 0) {
                  FunctionSetCoordsDetail(coords);
                }
              } finally {
                await StopInitVisit(null, dispatch);
                // await BackgroundService.stop();
               // Geolocation.stopObserving();
              }
             // Alert.alert('Registro exitoso');
              setIsUpdateVisitArrive(true);
              dispatch(SaveIsArriveOrNotTheVisit("N"));
              dispatch(SaveSelectVisitDetail({
                ...data,
                isMarkerArrival:true,              
              }));
              navigation.navigate("FormCreateRoute");
            } else if (resultUpdate != null && !resultUpdate.Resultado) {
              Alert.alert("Alerta",resultUpdate.Mensaje);
            }
          }catch(ex){
            Alert.alert("Error",""+ex);
            dispatch(LoadUpdateVisit(true));          
          }finally{
            dispatch(LoadUpdateVisit(true));          
          }   
          break;
        }
        case 2: {
          setVisit({
            ...visit,
            Proceso: 'Cancelado',
            isInitVisit: false,
            isEndVisit: false,
          });
          AlertConditional(
            ConfirmCancelVisit,
            function () {},
            '¿Está seguro de cancelar esta visita?',
            '',
          );
          break;
        }
        case 3: {
          if(data.EsRegreso =="Y"){
            visit.Proceso="Finalizado"
            const resultUpdate = await FunctionUpdateVisit(
              visit,
              dispatch,
              navigation,
            );
            if(resultUpdate!=null && resultUpdate.Resultado){
              dispatch(DeleteVisit(visit.IdRegistro));
              navigation.navigate("VisitCreated");
            }
            if(resultUpdate==null){
              return;
            }
          if(!resultUpdate.Resultado){
            Alert.alert("",""+resultUpdate.Mensaje);
          }
            return;
          }
          const GetVisit = await GetVisitByID(data.IdRegistro);
          const GetPersonContact = await GetContactPersonCardCode("SBO_DISDELSA_2013",data.CardCode);
          if(GetPersonContact==null){
            Alert.alert("ocurrió un error, intenta nuevamente");
              return;
          }
          dispatch(SaveContactPerson(GetPersonContact));
          const isEndVisit = GetVisit['<EsRegreso>k__BackingField'];
          //dispatch(SaveIsArriveOrNotTheVisit(isEndVisit));

          if (
            GetVisit != null &&
            GetVisit['<isMarkerArrival>k__BackingField']
          ) {
            navigation.navigate('FormFinaliceVisit');
          } else {
            Alert.alert(
              'No se ha marcado la llegada',
              'Marque su llegada primero antes de finalizar',
            );
          }
        }
      }
    } catch (ex) {
      dispatch(LoadUpdateVisit(true));
      Alert.alert('Error: ' + ex);      
    } finally {
      dispatch(LoadUpdateVisit(false));
    }
  };
  const OpenModal = () => {};
  return (
    <ScrollView style={StylesWrapper.secondWrapper}>
      <View style={StylesWrapper.wraper}>
        {/* inicio del modal */}
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => {}}>
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}
              activeOpacity={1}
              onPressOut={() => {
               // toggleModal();
              }}>
              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: 8,
                  padding: 50,
                }}>
                <Text style={{fontSize: 24, marginBottom: 5}}>
                  Registro de kilometraje
                </Text>
                <FormCreateRoute></FormCreateRoute>
                <TouchableOpacity
                  style={{marginTop: 16}}
                  onPress={() => {
                    toggleModal();
                  }}>
                  <Text>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
        {/* fin del modal */}

        <Text>{data.CardCode}</Text>
        <Text>{data.CardName}</Text>
        <Text style={{fontSize: 12, color: 'gray'}}>
          {data.ShipToCode ? data.ShipToCode : ''}
        </Text>
        {isLoadUpadateVisit.loadUpdateVisit ? (
          <LoaderScreen color="black" message="Cargando" overlay></LoaderScreen>
        ) : null}
          {data.isMarkerArrival  ?
        <Button
        onPress={() => {
          HandleUpdateVisit(3);
        }}
        style={styles.button1}>
        <Text style={{fontSize: 13, color: 'white'}}> Finalizar </Text>
      </Button>
        :null}       
        {!data.isMarkerArrival ?
        <Button
        onPress={() => {
          HandleUpdateVisit(1);
        }}
        style={styles.button3}>
        <Text style={{fontSize: 13, color: 'white'}}> Llegando</Text>
      </Button>
        :null}  
        {!data.isMarkerArrival ?        
        <Button
        onPress={() => {
          HandleUpdateVisit(2);
        }}
        style={styles.button}>
        <Text style={{fontSize: 13, color: 'white'}}> Eliminar Visita</Text>
      </Button>
        :null}      
       
        {data.isMarkerArrival  && !data.isMarkerMileague  ? (
          <View style={styles.chip}>
            <Chip
              label={'Kilometraje De Llegada'}
              onPress={() => {
                dispatch(SaveIsArriveOrNotTheVisit("N"));
                navigation.navigate("FormCreateRoute");
                //toggleModal();
              }}
            />
          </View>
        ) : null}
        <View flex centerH>
          <View style={styles.cardinfo1}>
            {/* <TextInput onChangeText={HandleSetComentary} placeholder='Comentario' multiline={true} numberOfLines={4} value={comentary}  ></TextInput> */}
            <Text>{data.Titulo}</Text>
          </View>
          <View style={styles.cardinfo2}>
            <Text>{data.Comentario}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
export default DetailVisit;

const styles = StyleSheet.create({
  cardinfo1: {
    backgroundColor: '#f3c1c5',
    width: '80%',
    height: '10%',
    marginTop: '1%',
  },
  cardinfo2: {
    backgroundColor: '#e1f0ff',
    width: '80%',
    height: '10%',
    marginTop: '1%',
  },
  button: {
    width: 40,
    backgroundColor: '#e8bd18',
    color: '#fefefe',
    margin: '1%',
  },
  button1: {
    width: 40,
    backgroundColor: 'black',
    color: '#fefefe',
    margin: '1%',
  },
  button3: {
    width: 40,
    backgroundColor: '#6f6971',
    color: '#fefefe',
    margin: '1%',
  },
  chip: {
    margin: '1%',
  },
});
