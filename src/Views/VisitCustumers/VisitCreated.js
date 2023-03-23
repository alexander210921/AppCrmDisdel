import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, StyleSheet} from 'react-native';
import {Text, View, LoaderScreen, Button, Card,Chip} from 'react-native-ui-lib';
import StylesWrapper from '../../Styles/Wrapers';
import CardVisit from '../../Components/Cards/Card1';
import {useDispatch, useSelector} from 'react-redux';
import {
  FunctionGetMileageInit,
  SaveSelectVisitDetail,
} from '../../Api/Customers/ApiCustumer';
import {useNavigation} from '@react-navigation/native';
import {AsyncStorageGetData} from '../../lib/AsyncStorage';
import {AlertConditional} from '../../Components/TextAlert/AlertConditional';
import {LoadGetVisitActuality} from '../../Api/Customers/ApiCustumer';
import {StartInitVisit, StopInitVisit} from '../../lib/Visits/index';
import {
  GeCustomersVendor,
  LoadGeCustomer,
  getCustomersForVendor,
} from '../../Api/Customers/ApiCustumer';
import SearchBar from '../../Components/SearchBar';
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
  const SubmitSearch = async value => {
    try {
      dispatch(LoadGeCustomer(true));
      const customers = await getCustomersForVendor(Rol[0]?.IdRelacion, value);
      if (customers.Respuesta.Resultado) {
        dispatch(GeCustomersVendor(customers.Detalle));
        navigation.navigate('SearchCustomer');
      } else {
        Alert.alert('No se encontraron registros');
        dispatch(GeCustomersVendor([]));
      }
    } catch (ex) {
      Alert.alert('' + ex);
    } finally {
      dispatch(LoadGeCustomer(false));
    }
  };

  const HandleInitRoute = async () => {
    try {
      if (
        DrivingVisitDetail.isRouteInCourse &&
        DrivingVisitDetail.IdWatchLocation != null
      ) {
        Alert.alert('La ruta ya ha sido iniciada');
        return;
      }
      dispatch(LoadGetVisitActuality(true));
      //const data = await FunctionGetCurrentVisit(Rol[0].IdRelacion,dispatch,false,Navigator);
      if (
        ListRoutes.RoutesInProgress != null &&
        ListRoutes.RoutesInProgress.length > 0
      ) {
        //dispatch(SetVisiActualityt(ListRoutes.RoutesInProgress));
        const statusInit = await StartInitVisit(
          ListRoutes.RoutesInProgress,
          DrivingVisitDetail,
          dispatch,
          User.EntityID
        );
        try {
          if (statusInit) {            
            const dataMileagueInit = await FunctionGetMileageInit(
              User.EntityID,
              0,
            );            
            if(!dataMileagueInit){
              return ;
            }
            if (!dataMileagueInit || dataMileagueInit.length == 0) {
              navigation.navigate('FormCreateRoute');
            } else {
            }
          }
        } finally {
          dispatch(LoadGetVisitActuality(false));
        }
      } else {
        Alert.alert(
          'No hay visitas pendientes',
          'Cree primero sus visitas antes de poder iniciar su captura de localización ',
        );
      }
    } finally {
      dispatch(LoadGetVisitActuality(false));
    }
  };
  const AlertMessage = () => {
    AlertConditional(
      HandleStopVisit,
      function () {},
      'Cancelar Recorrido',
      '¿Está seguro de cancelar?, se perderá todo su recorrido',
    );
  };
   const HandleStopVisit = async () => {
    try {
      if (!DrivingVisitDetail.isRouteInCourse) {
        Alert.alert(
          'Cancelacion de ruta',
          'La ruta no ha sido iniciada para poder cancelar',
        );
        return;
      }
      dispatch(LoadGetVisitActuality(true));
      const cancelStatus = await StopInitVisit(
        DrivingVisitDetail.IdWatchLocation,
        dispatch,
      );
      if (cancelStatus) {
        Alert.alert('Cancelado correctamente');
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
  const SelectViewVisitDetail = visit => {
    dispatch(SaveSelectVisitDetail(visit));
    Navigator.navigate('DetailVisit');
  };
  // const StopGeolocation=()=>{
  //   if (
  //     ListRoutes.RoutesInProgress.length == 0 && !returnBase
  //   ) {
  //     Geolocation.clearWatch(DrivingVisitDetail.IdWatchLocation);

  //     dispatch(SaveIdWatch(null));
  //     dispatch(SetIsInitDrivingVisit(false));
  //     dispatch(SaveUUIDRoute(''));
  //     AsyncStorageDeleteData('@dataRoute').finally(() => {
  //     });
  //   }
  // }
  // useEffect(() => {
  //   StopGeolocation();
  // }, [ListRoutes.RoutesInProgress]);
  useEffect(() => {
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
    await StartInitVisit(ListRoutes, DrivingVisitDetail, dispatch,User.EntityID);
  }
  return (
    <ScrollView style={StylesWrapper.secondWrapper}>
      <SearchBar onSubmit={SubmitSearch}></SearchBar>
      <View style={styles.chip}>
        <Chip  label={'kilometraje Inicial'} onPress={() => console.log('pressed')}/>
      </View >
      <View style={styles.chip}>
        <Chip label={'kilometraje Final'} onPress={() => console.log('pressed')}/>
      </View>
      <View style={styles.chip}>
        <Chip label={'Bases'} onPress={() => console.log('pressed')}/>
      </View>
      
      {ListRoutes.RoutesInProgress.length > 0 ? (
        <View>
          <Text style={styles.Title}>Mis visitas</Text>
          <ViewButtonsOption></ViewButtonsOption>
          {DrivingVisitDetail.isRouteInCourse ? (
            // <LoaderScreen
            //   color="black"
            //   message="Procesando Ubicación"></LoaderScreen>
            <Text>Se está capturando su ubicación actual</Text>
          ) : (
            <Text>
              Cuando esté listo para salir presione el botón "Iniciar Ruta"
            </Text>
          )}
          {/* {MileageDetail ? (
            <Text style={styles.title1}>
              kilometraje Inicial: {MileageDetail.Kilometraje}
            </Text>
          ) : null} */}
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
              style={styles.mainCardView}
              flex
              center
              onPress={HandleInitRoute}>
              <Text>Iniciar Ruta</Text>
            </Card>
            <Card
              selected={false}
              selectionOptions={styles.selectOptionCard}
              elevation={20}
              flexS
              style={styles.mainCardView2}
              flex
              center
              onPress={AlertMessage}>
              <Text>Cancelar mi recorrido</Text>
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
  chip:{
    margin:'1%'
  }
});
