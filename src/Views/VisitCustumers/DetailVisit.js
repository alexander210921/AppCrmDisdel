import {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Alert,
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
} from '../../Api/Customers/ApiCustumer';
import {useNavigation} from '@react-navigation/native';
import {AlertConditional} from '../../Components/TextAlert/AlertConditional';
import {StopInitVisit} from '../../lib/Visits';
import {GetGeolocation} from '../../lib/Permissions/Geolocation';
import BackgroundService from 'react-native-background-actions';
import Geolocation from '@react-native-community/geolocation';
import FormCreateRoute from '../RouteVendors/CreateRoute';
import {SaveSelectVisitDetail} from '../../Api/Customers/ApiCustumer';
import {AsyncStorageGetData} from '../../lib/AsyncStorage';
import RenderStaticMap from '../../Components/Map/MapStatic';
import {SetActualityCoords} from '../../Api/User/ApiUser';
// import {getPreciseDistance} from 'geolib';
import Icon from 'react-native-vector-icons/FontAwesome5';
//const proj4 = require('proj4');


const DetailVisit = () => {
  const data = useSelector(state => state.Customer.VisitDetailSelected);
  const isLoadUpadateVisit = useSelector(state => state.Customer);
  const DrivingVisitDetail = useSelector(state => state.Mileage);
  const Rol = useSelector(state => state.rol.RolSelect);
  const User = useSelector(state => state.login.user);
  const userCoords = useSelector(state => state.login);
  const [isUpdateVisitArrive, setIsUpdateVisitArrive] = useState(false);
  const [isDraggable, setIsDraggable] = useState(false);
  const [distanceMts,setDistanceMts] = useState(null);
  const [distanceExactMts,setDistanceExactMts] = useState(null);
  const [dinfoRoute, setInfoRoute] = useState('');
  const [ModeNavigate,setModeNavigate] = useState("DRIVING");
  const company = useSelector(state=>state.company.CompanySelected);
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
  const HandleChangeModeNavigation=(mode)=>{
    setModeNavigate(mode);
  }
  const ReloadLocation = async () => {
    const getCoords = await GetGeolocation();
    if (!getCoords.Status) {
      Alert.alert('Alerta', '' + getCoords.Message);
      return;
    }
    const coords = {
      Latitud: getCoords.Data.coords.latitude,
      Longitud: getCoords.Data.coords.longitude,
  };
    dispatch(
      SetActualityCoords({
        latitude: coords.Latitud,
        longitude: coords.Longitud,
      }),
    );
  };
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
  useEffect(()=>{
    setDistanceExactMts(distanceMts);
  },[distanceMts])
  const handleMarkerPress = () => {
    const acceptableRadius = 500; // meters
//     const distancePrecise = getPreciseDistance({latitude:userCoords.coordsActuality.latitude,longitude:userCoords.coordsActuality.longitude},{latitude:data.LatitudeArrival,longitude:data.LongitudArrival},1);
//     //const utmA = proj4(proj4.defs('EPSG:4326'), proj4.defs('EPSG:32618'), [userCoords.coordsActuality.longitude, userCoords.coordsActuality.latitude]);
//     //const utmB = proj4(proj4.defs('EPSG:4326'), proj4.defs('EPSG:32618'), [data.LongitudArrival,data.LatitudeArrival]);

// // Cálculo de la distancia euclidiana entre los puntos
//     //const distance = Math.sqrt(Math.pow(utmB[0] - utmA[0], 2) + Math.pow(utmB[1] - utmA[1], 2));
//     setDistanceExactMts(distancePrecise);
   //setDistanceMts(distancePrecise);
    // if(!distanceMts){
    //   return;
    // }
    //Alert.alert(""+distanceTest+" mts");
    if (distanceExactMts < acceptableRadius ) {
      setIsDraggable(true);
    } else {
      setIsDraggable(false);
      // Notify the user that they need to move closer to the destination.
      Alert.alert(
        'Acércate al destino',
        `Actualmente se encuentra a ${distanceExactMts} metros del destino. Muévase dentro de ${acceptableRadius} metros para arrastrar el marcador y precisar su ubicación.`,
      );
    }
  };

  const onReadyDataMapFunction = e => {
    if (e) {
      setInfoRoute(
        'La distancia para llegar a su destino es de: ' +
          e.distance * 1000 +
          ' mts'+
          ' y el tiempo promedio para llegar es de: ' +
          parseFloat(e.duration).toFixed(2) +
          ' minutos',
      );
      setDistanceMts(e.distance * 1000);
      //console.log("La distancia para llegar a su destino es de: "+e.distance+" mts" +" y el tiempo promedio para llegar es de: "+e.duration+" minutos");
    }else {
      setInfoRoute("Ocurrió un problema al hacer el cálculo de medición");
      setDistanceMts(null);
    }
  };
  const HandleUpdateVisit = async typeOption => {
    try {
      dispatch(LoadUpdateVisit(true));
      switch (typeOption) {
        case 1: {
          try {
            // const GetVisit = await GetVisitByID(data.IdRegistro);
            // if (
            //   GetVisit != null &&
            //   GetVisit['<isMarkerArrival>k__BackingField'] == true
            // ) {
            //   Alert.alert(
            //     'Ya se marcó la llegada',
            //     'Esta visita ya tiene marcado un horario de llegada',
            //   );
            //   return;
            // } else if (GetVisit == null) {
            //   Alert.alert('Ocurrió un error', 'Intenta nuevamente por favor');
            //   return;
            // }
            if (!DrivingVisitDetail.isRouteInCourse && typeOption == 1) {
              Alert.alert(
                'Inicie primero el viaje antes de marcar su Llegada ',
              );
              return;
            }
            const distancePermited = 300;
            //Alert.alert(""+distanceExactMts);
            if(data.EsRegreso == 'N'){
              if((distanceExactMts!=null )  &&  distanceExactMts>distancePermited){
                Alert.alert("Fuera de rango","Se encuentra a "+distanceExactMts +" mts de su destino, debe de estar en un rango de "+distancePermited+" mts");
                return;
              }
            }
            let isValidUUID = await AsyncStorageGetData('@uuid');

            // const getCoords = await GetGeolocation();
            // if (!getCoords.Status) {
            //   Alert.alert('Alerta', '' + getCoords.Message);
            //   return;
            // }

            const coords = {
              Latitud: userCoords.coordsActuality.latitude,
              Longitud: userCoords.coordsActuality.longitude,
              UUIRecorrido: isValidUUID ? isValidUUID : '',
              idUsuario: User.EntityID,
            };
            // dispatch(
            //   SetActualityCoords({
            //     latitude: coords.Latitud,
            //     longitude: coords.Longitud,
            //   }),
            // );

            // const createObjectValidateDistance = {
            //   NombreDB: 'SBO_DISDELSA_2013',
            //   CardCode: data.CardCode,
            //   IdDireccionVisita: data.IdDireccionVisita,
            //   Latitud: coords.Latitud,
            //   Longitud: coords.Longitud,
            // };
            // if (data.EsRegreso == 'N') {
            //   // const isvalidDistance = await ValidateDistanceIsValid(
            //   //   createObjectValidateDistance,
            //   // );
            //   // if (isvalidDistance == null) {
            //   //   dispatch(LoadUpdateVisit(true));
            //   //   Alert.alert('Alerta', 'Error intente nuevamente');
            //   //   return;
            //   // }
            //   // if (!isvalidDistance.Resultado) {
            //   //   Alert.alert('', isvalidDistance.Mensaje);
            //   //   return;
            //   // }
            // }
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
                if (coords.Latitud!=0 && coords.Latitud !=0) {
                  FunctionSetCoordsDetail(coords);
                }
              } finally {
                try {
                  Geolocation.clearWatch(0);
                  Geolocation.stopObserving();
                } catch (ex) {
                  console.log(ex);
                }
                await BackgroundService.stop();
                await StopInitVisit(null, dispatch);
                // await BackgroundService.stop();
                // Geolocation.stopObserving();
              }
              // Alert.alert('Registro exitoso');
              setIsUpdateVisitArrive(true);
              dispatch(SaveIsArriveOrNotTheVisit('N'));
              dispatch(
                SaveSelectVisitDetail({
                  ...data,
                  isMarkerArrival: true,
                }),
              );
              navigation.navigate('FormCreateRoute');
            } else if (resultUpdate != null && !resultUpdate.Resultado) {
              Alert.alert('Intente nuevamente', resultUpdate.Mensaje);
            }
          } catch (ex) {
            Alert.alert('Error', '' + ex);
            dispatch(LoadUpdateVisit(true));
          } finally {
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
          if (data.EsRegreso == 'Y') {
            visit.Proceso = 'Finalizado';
            const resultUpdate = await FunctionUpdateVisit(
              visit,
              dispatch,
              navigation,
            );
            if (resultUpdate != null && resultUpdate.Resultado) {
              dispatch(DeleteVisit(visit.IdRegistro));
              navigation.navigate('VisitCreated');
            }
            if (resultUpdate == null) {
              return;
            }
            if (!resultUpdate.Resultado) {
              Alert.alert('', '' + resultUpdate.Mensaje);
            }
            return;
          }
          const GetVisit = await GetVisitByID(data.IdRegistro);
          const GetPersonContact = await GetContactPersonCardCode(
            company.NombreDB,
            data.CardCode,
          );
          if (GetPersonContact == null) {
            Alert.alert('ocurrió un error, intenta nuevamente');
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
        {data.isMarkerArrival ? (
          <Button
            onPress={() => {
              HandleUpdateVisit(3);
            }}
            style={styles.button1}>
            <Text style={{fontSize: 13, color: 'white'}}> Finalizar </Text>
          </Button>
        ) : null}
        {!data.isMarkerArrival ? (
          <Button
            onPress={() => {
              HandleUpdateVisit(1);
            }}
            style={styles.button3}>
            <Text style={{fontSize: 13, color: 'white'}}> Llegando</Text>
          </Button>
        ) : null}
        {true ? (
          <Button
            onPress={() => {
              HandleUpdateVisit(2);
            }}
            style={styles.button}>
            <Text style={{fontSize: 13, color: 'white'}}> Eliminar Visita</Text>
          </Button>
        ) : null}

        {data.isMarkerArrival && !data.isMarkerMileague ? (
          <View style={styles.chip}>
            <Chip
              label={'Kilometraje De Llegada'}
              onPress={() => {
                dispatch(SaveIsArriveOrNotTheVisit('N'));
                navigation.navigate('FormCreateRoute');
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
          {userCoords.coordsActuality.latitude != 0 &&
          userCoords.coordsActuality.longitude != 0 &&
          data.LatitudeArrival != 0 &&
          data.LongitudArrival != 0  && !data.isMarkerArrival && DrivingVisitDetail.isRouteInCourse ? (
            <View >
              <Text style={{color: 'gray', fontSize: 12}}>{dinfoRoute}</Text>
              <View  row>
                <Icon onPress={()=>{
                  HandleChangeModeNavigation("DRIVING");
                }} style={ styles.iconStyle} name="car" size={30} color="black" />
                <Icon onPress={()=>{
                  HandleChangeModeNavigation("WALKING");
                }} style={ styles.iconStyle}  name="walking" size={30} color="black" />
              </View>
              <Text style={{color: 'gray', fontSize: 13,fontWeight:800}}> Modo de navegación {ModeNavigate} Activado</Text>
              <Button
                onPress={ () => {
                   ReloadLocation();
                }}
                style={styles.button4}>
                <Text style={{fontSize: 13, color: 'white'}}> Refrescar </Text>
              </Button>
            </View>
          ) : null}
          {!data.isMarkerArrival ?
              <View style={styles.containerMap}>
              {userCoords.coordsActuality.latitude != 0 &&
              userCoords.coordsActuality.longitude != 0 &&
              data.LatitudeArrival != 0 &&
              data.LongitudArrival != 0  && DrivingVisitDetail.isRouteInCourse? (
                <RenderStaticMap
                mode={ModeNavigate}
                MarkerPress={handleMarkerPress}
                isDragable={isDraggable}
                  onReadyData={onReadyDataMapFunction}
                  coordsActuality={{
                    latitude: userCoords.coordsActuality.latitude,
                    longitude: userCoords.coordsActuality.longitude,
                  }}
                  coordsDestination={{
                    latitude: data.LatitudeArrival,
                    longitude: data.LongitudArrival,
                  }}></RenderStaticMap>
              ) : null}
            </View>
          :null}
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
  containerMap: {
    width: '100%',
    height: '100%',
    margin: '5%',
  },
  button4: {
    width: 40,
    backgroundColor: '#252850',
    color: '#fefefe',
    margin: '1%',
  },
  TextBold:{
    fontWeight:800,
    color:'black'
  },
  TextAlert:{
    fontWeight:800,
    color:'red'
  },
  iconStyle:{
    padding:10
  }
});
