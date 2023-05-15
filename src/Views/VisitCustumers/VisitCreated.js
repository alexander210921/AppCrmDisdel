import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, StyleSheet} from 'react-native';
import {Text, View, LoaderScreen, Card, Chip} from 'react-native-ui-lib';
import StylesWrapper from '../../Styles/Wrapers';
import CardVisit from '../../Components/Cards/Card1';
import {useDispatch, useSelector} from 'react-redux';
import {
  FunctionGetMileageInit,
  SaveSelectVisitDetail,
  AsyncFunctionSetCoordsDetail,
  SaveUUIDRoute,
  GetVisitByID,
  GetAddressOfCurrentVisit,
} from '../../Api/Customers/ApiCustumer';
import {useNavigation} from '@react-navigation/native';
import {
  AsyncStorageGetData,
  AsyncStorageSaveData,
  AsyncStorageSaveDataJson,
} from '../../lib/AsyncStorage';
import {AlertConditional} from '../../Components/TextAlert/AlertConditional';
import {LoadGetVisitActuality} from '../../Api/Customers/ApiCustumer';
import {StartInitVisit, StopInitVisit} from '../../lib/Visits/index';
import {
  GeCustomersVendor,
  LoadGeCustomer,
  getCustomersForVendor,
} from '../../Api/Customers/ApiCustumer';
import SearchBar from '../../Components/SearchBar';
import BackgroundService from 'react-native-background-actions';
import geolocation from '@react-native-community/geolocation';
import {GetGeolocation} from '../../lib/Permissions/Geolocation';
import Geolocation from '@react-native-community/geolocation';
import {generateUUID} from '../../lib/UUID';
import {SetIsInitDrivingVisit} from '../../Api/Customers/ApiCustumer';
import {SaveIsArriveOrNotTheVisit} from '../../Api/Customers/ApiCustumer';
import {GetMileagueByIdVisit} from '../../Api/Customers/ApiCustumer';
import {BackHanlderMenuPrincipal} from '../../lib/ExitApp';
import {SetActualityCoords} from '../../Api/User/ApiUser';
import {StartBackroundInitCoordsRoute} from '../../Components/GeoBackround';

export const StartNotification = async (
  userId = 0,
  uuId = '',
  dispatch,
  Navigate = false,
  nav = null,
) => {
  //await StartBackroundInitCoordsRoute(dispatch);

  //dispatch(LoadGetVisitActuality(false));
  const sleep = time =>
    new Promise(resolve => setTimeout(() => resolve(), time));
  const veryIntensiveTask2 = async taskDataArguments => {
    try {
      let uuid;
      let isValidUUID = await AsyncStorageGetData('@uuid');
      if (isValidUUID == null || isValidUUID == '') {
        uuid = generateUUID();
        await AsyncStorageSaveData('@uuid', uuid);
      } else {
        uuid = isValidUUID;
      }
      uuId = uuid;
      dispatch(SaveUUIDRoute(uuid));

      const infoRoute = {
        DatevalidId: new Date().toLocaleDateString(),
        UUidInProgress: uuid,
        IdVisitInProgress: 0,
        isRouteInCourse: true,
        IdWatch: 0,
        idUsuario: userId,
      };
      await AsyncStorageSaveDataJson('@dataRoute', infoRoute);

      const {delay} = taskDataArguments;
      await new Promise(async resolve => {
        const isValidateGPS = await GetGeolocation();
        if (!isValidateGPS.Status) {
          Alert.alert('Intente nuevamente', isValidateGPS.Message);
          dispatch(LoadGetVisitActuality(false));
          dispatch(SetIsInitDrivingVisit(false));
          await BackgroundService.stop();
          return;
        }
        if (
          isValidateGPS.Data.coords.latitude != 0 &&
          isValidateGPS.Data.coords.longitude != 0
        ) {
          dispatch(
            SetActualityCoords({
              latitude: isValidateGPS.Data.coords.latitude,
              longitude: isValidateGPS.Data.coords.longitude,
            }),
          );
        }
        dispatch(LoadGetVisitActuality(false));
        dispatch(SetIsInitDrivingVisit(true));
        if (Navigate && nav != null) {
          nav.navigate('FormCreateRoute');
        }
        for (let i = 0; BackgroundService.isRunning(); i++) {
          let currentPosition = null;
          const {coords} = await new Promise((resolve, reject) => {
            currentPosition = geolocation.watchPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 20000,
              maximumAge: 0,
              distanceFilter: 100,
            });
          });
          try {
            const data = {
              Latitud: coords.latitude,
              Longitud: coords.longitude,
              UUIRecorrido: uuId,
              idUsuario: userId,
            };
            if (coords.latitude != 0 && coords.longitude) {
              dispatch(
                SetActualityCoords({
                  latitude: coords.latitude,
                  longitude: coords.longitude,
                }),
              );
            }
            if (data.Latitud && data.Latitud > 0) {
              const resultR = await AsyncFunctionSetCoordsDetail(data);
            }
          } catch (ex) {
            console.log(ex, 'Al insertar ocurrió un error');
          } finally {
            try {
              if (currentPosition != null) {
                // geolocation.clearWatch(currentPosition);
              }
            } finally {
              currentPosition = null;
            }
          }
          await BackgroundService.updateNotification({
            taskDesc: 'Marcando ubicación, Excelente Viaje ' + i,
          });
          await sleep(delay);
        }
      });
    } catch (ex) {
      console.log('ocurrió un error :' + ex);
    }
  };
  const options = {
    taskName: '',
    taskTitle: 'Ubicación en curso',
    taskDesc: '',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'yourSchemeHere://Home', // See Deep Linking for more info
    parameters: {
      delay: 1000,
    },
  };
  try {
    await BackgroundService.start(veryIntensiveTask2, options);
    //BackgroundService.addListener("expiration");
  } catch (exeption) {
    console.log('ocurrió un error ', exeption);
  }
};
const VisitCreated = () => {
  const ListRoutes = useSelector(state => state.Customer);
  const DrivingVisitDetail = useSelector(state => state.Mileage);
  const dispatch = useDispatch();
  const Navigator = useNavigation();
  const [ErrorConnection, setErrorConnection] = useState(' ');
  const Rol = useSelector(state => state.rol.RolSelect);
  const navigation = useNavigation();
  const [MileageDetail, setMileagueDetail] = useState(null);
  const User = useSelector(state => state.login.user);
  const company = useSelector(state => state.company.CompanySelected);
  const [loadGetVisit, setLoadGetVisit] = useState(false);
  BackHanlderMenuPrincipal(Navigator);
  const SubmitSearch = async value => {
    try {
      if (value != '') {
        dispatch(LoadGeCustomer(true));
        const customers = await getCustomersForVendor(
          Rol[0]?.IdRelacion,
          value,
        );
        if (customers != null && customers.Respuesta.Resultado) {
          dispatch(GeCustomersVendor(customers.Detalle));
          navigation.navigate('SearchCustomer');
        } else {
          Alert.alert('No se encontraron registros');
          dispatch(GeCustomersVendor([]));
        }
      }
    } catch (ex) {
      Alert.alert('' + ex);
    } finally {
      dispatch(LoadGeCustomer(false));
    }
  };

  const HandleInitRoute = async () => {
    try {
      if (DrivingVisitDetail.isRouteInCourse) {
        Alert.alert('La ruta ya ha sido iniciada');
        return;
      }
      if (ListRoutes.loadGetCurrentVisit) {
        Alert.alert('', 'Se está cargando el proceso, por favor espere');
        return;
      }
      dispatch(LoadGetVisitActuality(true));
      //dispatch(SetIsInitDrivingVisit(true));

      const dataMileagueInit = await FunctionGetMileageInit(User.EntityID, 0);

      // const infoInit = await StartBackroundInitCoordsRoute(dispatch);

      let navigateToRegisterMileague = false;
      dispatch(SaveIsArriveOrNotTheVisit('N'));
      if (
        ListRoutes.RoutesInProgress != null &&
        ListRoutes.RoutesInProgress.length > 0
      ) {
        try {
          if (dataMileagueInit && dataMileagueInit.length == 0) {
            dispatch(SaveIsArriveOrNotTheVisit('Y'));
            navigateToRegisterMileague = true;
            // navigation.navigate('FormCreateRoute');
          }
        } finally {
          await StartNotification(
            User.EntityID,
            '',
            dispatch,
            navigateToRegisterMileague,
            navigation,
          );
          //dispatch(LoadGetVisitActuality(false));
        }
      } else {
        Alert.alert(
          'No hay visitas pendientes',
          'Cree primero sus visitas antes de poder iniciar su captura de localización ',
        );
      }
      //dispatch(LoadGetVisitActuality(false));
    } finally {
      // dispatch(LoadGetVisitActuality(false));
    }
  };
  const AlertMessage = () => {
    if (!DrivingVisitDetail.isRouteInCourse) {
      return;
    }
    AlertConditional(
      HandleStopVisit,
      function () {},
      'Cancelar Recorrido',
      '¿Está seguro de cancelar?',
    );
  };
  const HandleStopVisit = async () => {
    try {
      //dispatch(LoadGetVisitActuality(true));
      await BackgroundService.stop();
      const cancelStatus = await StopInitVisit(null, dispatch);
      Geolocation.clearWatch(0);
      Geolocation.stopObserving();
      if (cancelStatus) {
        return;
      }
    } finally {
      dispatch(LoadGetVisitActuality(false));
    }
  };
  const CancelVisit = () => {
    if (StopInitVisit(DrivingVisitDetail.IdWatchLocation, dispatch)) {
      Alert.alert('Cancelado correctamente');
    }
  };
  const setMileagueInit = async () => {
    const dataMileagueInit = await FunctionGetMileageInit(User.EntityID, 0);
    if (dataMileagueInit == null) {
      Alert.alert(
        '',
        'Ocurrió un error al valirdar los datos, intente nuevamente',
      );
      return;
    }
    if (dataMileagueInit && dataMileagueInit.length >= 1) {
      Alert.alert(
        'Registro ya realizado',
        'Usted ha iniciado el dia con: ' +
          dataMileagueInit[0]['<Kilometraje>k__BackingField'] +
          ' km',
      );
      return;
    }
    if (dataMileagueInit && dataMileagueInit.length == 0) {
      dispatch(SaveIsArriveOrNotTheVisit('Y'));
      navigation.navigate('FormCreateRoute');
    }
  };
  const HandleCancelAlert = () => {};
  const ViewButtonsOption = () => {
    return <View flex style={styles.containerButton}></View>;
  };
  handleCancelVisit = () => {
    AlertConditional(
      CancelVisit,
      HandleCancelAlert,
      '¿Desea dar por finalizado sus rutas?',
      '',
    );
  };
  const SelectViewVisitDetail = async visit => {
    try {
      visit.isMarkerArrival = false;
      visit.isMarkerMileague = false;
      visit.EsRegreso = 'N';
      visit.LatitudeArrival = 0;
      visit.LongitudArrival = 0;
      setLoadGetVisit(true);
      const GetVisit = await GetVisitByID(visit.IdRegistro);
      const GetMileagueById = await GetMileagueByIdVisit(visit.IdRegistro);
      if (
        GetVisit != null &&
        GetVisit['<isMarkerArrival>k__BackingField'] == true
      ) {
        visit.isMarkerArrival = true;
      } else if (GetVisit == null) {
        Alert.alert('Ocurrió un error', 'Por favor intenta nuevamente');
        return;
      }
      if (
        GetVisit['<EsRegreso>k__BackingField'] != null &&
        GetVisit['<EsRegreso>k__BackingField'] == 'Y'
      ) {
        visit.EsRegreso = 'Y';
      }
      if (GetMileagueById != null && GetMileagueById.EntityID > 0) {
        visit.isMarkerMileague = true;
      }
      if (
        GetMileagueById != null &&
        GetVisit['<IdDireccionVisita>k__BackingField'] != null
      ) {
        visit.IdDireccionVisita =
          GetVisit['<IdDireccionVisita>k__BackingField'];
        const getInfoAddress = await GetAddressOfCurrentVisit(
          company.NombreDB,
          visit.CardCode,
          visit.IdDireccionVisita,
        );
        if (getInfoAddress != null) {
          if (getInfoAddress['<longitudDestino>k__BackingField']) {
            visit.LongitudArrival =
              getInfoAddress['<longitudDestino>k__BackingField'];
          }
          if (getInfoAddress['<latitudDestino>k__BackingField']) {
            visit.LatitudeArrival =
              getInfoAddress['<latitudDestino>k__BackingField'];
          }
        }
      }
      dispatch(SaveSelectVisitDetail(visit));
      Navigator.navigate('DetailVisit');
    } finally {
      setLoadGetVisit(false);
    }
  };
  useEffect(() => {
    if (DrivingVisitDetail.isRouteInCourse && !BackgroundService.isRunning()) {
      HandleStopVisit();
    }
    try {
      async function getMileague() {
        return await AsyncStorageGetData('@Mileague');
      }
      getMileague().then(res => {
        if (res != null) {
          setMileagueDetail(JSON.parse(res));
        }
      });
    } catch (ex) {}
  }, []);
  async function InitVisit() {
    await StartInitVisit(
      ListRoutes,
      DrivingVisitDetail,
      dispatch,
      User.EntityID,
    );
  }
  return (
    <View style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={{paddingBottom: 20}}
        style={StylesWrapper.secondWrapper}>
        <SearchBar onSubmit={SubmitSearch}></SearchBar>
        <View style={styles.chip}>
          <Chip
            label={'Bases'}
            onPress={() => {
              navigation.navigate('MenuEndVisit');
            }}
          />
        </View>
        <View style={styles.chip}>
          <Chip
            label={'kilometraje inicial del día'}
            onPress={setMileagueInit}
          />
        </View>
        {ListRoutes.RoutesInProgress.length > 0 ||
        DrivingVisitDetail.isRouteInCourse ? (
          <View>
            <Text style={styles.Title}>Mis visitas</Text>
            {loadGetVisit ? (
              <LoaderScreen
                message="Obteniendo visita..."
                color="black"></LoaderScreen>
            ) : null}
            <ViewButtonsOption></ViewButtonsOption>

            {/* <View style={styles.upperFold} /> */}
            {!DrivingVisitDetail.isRouteInCourse || ListRoutes.loadGetCurrentVisit ? (
              <View
                style={
                  ListRoutes.loadGetCurrentVisit
                    ? styles.card
                    : styles.cardNoInit
                }>
                <View style={styles.content}>
                  {/* Contenido de la tarjeta */}

                  {ListRoutes.loadGetCurrentVisit ? (
                    <Text style={{color: '#fff'}}>
                      Se está capturando su ubicación actual, por favor espere
                      ...
                    </Text>
                  ) : (
                    <Text style={{color: '#fff'}}>
                      Cuando esté listo para salir presione el botón "Iniciar
                      Ruta"
                    </Text>
                  )}
                </View>
              </View>
            ) : null}

            <Text>{ErrorConnection}</Text>
            <View flex center>
              {ListRoutes.loadGetCurrentVisit ? (
                <LoaderScreen
                  color="black"
                  message="Cargando proceso..."></LoaderScreen>
              ) : null}
              <Card
                selected={false}
                selectionOptions={styles.selectOptionCard}
                elevation={20}
                flexS
                style={
                  !DrivingVisitDetail.isRouteInCourse &&
                  !ListRoutes.loadGetCurrentVisit
                    ? styles.mainCardView
                    : styles.ButtonDisable
                }
                flex
                center
                onPress={async () => {
                  await HandleInitRoute();
                }}>
                <Text>Iniciar Ruta</Text>
              </Card>
              <Card
                selected={false}
                selectionOptions={styles.selectOptionCard}
                elevation={20}
                flexS
                style={
                  DrivingVisitDetail.isRouteInCourse &&
                  !ListRoutes.loadGetCurrentVisit
                    ? styles.mainCardView2
                    : styles.ButtonDisable
                }
                flex
                center
                onPress={AlertMessage}>
                <Text>Cancelar ubicación en segundo plano</Text>
              </Card>
              {ListRoutes.RoutesInProgress.map(route => {
                return (
                  <CardVisit
                    FunctionInit={InitVisit}
                    data={route}
                    title2={route.CardName + ' / ' + route.IdRegistro}
                    title={route.CardCode}
                    subtitle={route.Comentario}
                    key={route.IdRegistro}
                    handleSelectCard={SelectViewVisitDetail}></CardVisit>
                );
              })}
            </View>
          </View>
        ) : (
          <View>
            <Text style={styles.Title}>No hay visitas creadas aún</Text>
            <Text style={styles.title1}>Cree primero su visita </Text>
            <ViewButtonsOption></ViewButtonsOption>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
export default React.memo(VisitCreated);
const styles = StyleSheet.create({
  Title: {
    padding: '7%',
    paddingBottom: 0,
    color: 'black',
    fontSize: 25,
    fontWeight: 600,
  },
  title1: {
    color: 'gray',
    fontSize: 15,
    fontWeight: 400,
  },
  button3: {
    width: 35,
    backgroundColor: '#6f6971',
    color: '#fefefe',
    margin: '1%',
  },
  button4: {
    width: 35,
    backgroundColor: '#e7bc98',
    color: 'gray',
    margin: '1%',
  },
  containerButton: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  card3: {
    height: '60%',
    borderColor: 'black',
    marginTop: '4%',
    backgroundColor: 'black',
  },
  card4: {
    height: '60%',
    borderColor: 'red',
    marginTop: '4%',
    color: 'red',
    backgroundColor: '#957DAD',
  },
  mainCardView: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D7ECD9',
    borderRadius: 15,
    shadowColor: 'shadow',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 14,
    paddingRight: 14,
    marginTop: 9,
    marginBottom: 9,
    width: '90%',
    height: 50,
  },
  mainCardView2: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f6ecf5',
    borderRadius: 15,
    shadowColor: 'shadow',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 14,
    paddingRight: 14,
    marginTop: 9,
    marginBottom: 9,
    width: '90%',
    height: 50,
  },
  chip: {
    margin: '1%',
  },
  ButtonDisable: {
    backgroundColor: '#f2f2f2',
    color: '#a9a9a9',
    opacity: 0.5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    shadowColor: 'shadow',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 14,
    paddingRight: 14,
    marginTop: 9,
    marginBottom: 9,
    width: '90%',
    height: 50,
  },
  //card message
  card: {
    backgroundColor: 'red',
    borderRadius: 10,
    overflow: 'hidden',
    width: '100%',
    height: 70,
    color: '#fff',
  },
  cardNoInit: {
    backgroundColor: '#DEA554',
    borderRadius: 10,
    overflow: 'hidden',
    width: '100%',
    height: 50,
  },
  upperFold: {
    backgroundColor: '#eaeaea',
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    height: 20,
    //transform: [{ translateY: -30 }],
  },
  content: {
    flex: 1,
    padding: 10,
    marginBottom: 5,
  },
});
