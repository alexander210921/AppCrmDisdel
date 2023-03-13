import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, StyleSheet} from 'react-native';
import {Text, View, LoaderScreen, Button} from 'react-native-ui-lib';
import StylesWrapper from '../../Styles/Wrapers';
import CardVisit from '../../Components/Cards/Card1';
import {useDispatch, useSelector} from 'react-redux';
import {
  CancelListVisitsInCourse,
  SaveSelectVisitDetail,
  SetVisitCustomer,
} from '../../Api/Customers/ApiCustumer';
import {useNavigation} from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import {
  SaveIdWatch,
  SetIsInitDrivingVisit,
  SaveUUIDRoute,
} from '../../Api/Customers/ApiCustumer';
import {GetGeolocation} from '../../lib/Permissions/Geolocation';
import {generateUUID} from '../../lib/UUID';
import {
  AsyncStorageDeleteData,
  AsyncStorageSaveDataJson,
} from '../../lib/AsyncStorage';
import {StartRealTimeCoords} from '../../lib/Permissions/Geolocation';
import {AlertConditional} from '../../Components/TextAlert/AlertConditional';
import {SetVisiActualityt} from '../../Api/Customers/ApiCustumer';
const VisitCreated = () => {
  const ListRoutes = useSelector(state => state.Customer);
  const DrivingVisitDetail = useSelector(state => state.Mileage);
  const dispatch = useDispatch();
  const Navigator = useNavigation();
  const [ErrorConnection, setErrorConnection] = useState(' ');
  const Rol = useSelector(state => state.rol.RolSelect);
  const navigation = useNavigation();
  const [dataVisitReturn, setDataVisitReturn] = useState({
    CardCode: 'C46306293',
    CardName: 'DISDEL, S.A.',
    Comentario: 'De Regreso a la base',
    IdRegistro: 0,
    Contacto: '',
    Longitud: 0,
    Latitud: 0,
    ShipToCode: '',
    Kilometraje: 0,
    IdRelacion: Rol[0]?.IdRelacion,
  });
  const GotoBaseVendor = () => {
    try {
      let isDeleted = false;
      if (ListRoutes.RoutesInProgress.length > 0) {
        //eliminando
       const dataList =  ListRoutes.RoutesInProgress.map(
          visit => ( visit.IdRegistro
          ),
        );
        //console.log(ListRoutes.RoutesInProgress,"LISTA DE RUTAS EN CURSO");
        isDeleted = CancelListVisitsInCourse(
          dataList,
          dispatch,
        );
      }
      SetVisitCustomer(
        dataVisitReturn,
        dispatch,
        navigation,
        false,
        true,
        'SearchCustomer',
      );
      const uuid = generateUUID();
      StartRealTimeCoords(dispatch, uuid, 5);
      dispatch(SaveUUIDRoute(uuid));
      dispatch(SetIsInitDrivingVisit(true));
      const infoRoute = {
        DatevalidId: new Date().toLocaleDateString(),
        UUidInProgress: uuid,
        IdVisitInProgress: 0,
        isRouteInCourse: true,
        IdWatch:DrivingVisitDetail.IdWatchLocation,
      };
       AsyncStorageSaveDataJson('@dataRoute', infoRoute);
    } catch (ex) {
      Alert.alert('Error: ' + ex);
    }
  };

  const CancelGotoBase = () => {
    try{
     // dispatch(SetVisiActualityt([]));
    if (DrivingVisitDetail.IdWatchLocation != null) {
      Geolocation.clearWatch(DrivingVisitDetail.IdWatchLocation);
    }
    dispatch(SaveIdWatch(null));
    dispatch(SetIsInitDrivingVisit(false));
    dispatch(SaveUUIDRoute(''));
    const dataList =  ListRoutes.RoutesInProgress.map(
      visit => ( visit.IdRegistro        
      ),
    );
    CancelListVisitsInCourse(
      dataList,
      dispatch,
    );  
    }catch(Exception){
      Alert.alert(""+Exception)
    }    
  };

  const CancelVisit = () => {
    if (DrivingVisitDetail.IdWatchLocation != null) {
      Geolocation.clearWatch(DrivingVisitDetail.IdWatchLocation);
    }
    // if (!DrivingVisitDetail.isRouteInCourse) {
    //   Alert.alert('No se ha iniciado el viaje');
    //   return;
    // }
    dispatch(SaveIdWatch(null));
    dispatch(SetIsInitDrivingVisit(false));
    AsyncStorageDeleteData('@dataRoute').finally(() => {
      //Eliminar reporte de visitas en proceso
      AlertConditional(
        GotoBaseVendor,
        CancelGotoBase,
        '¿Desea volver a su base?',
        'Esto significa volver a su punto de salida',
      );
    });
    //go to sabase
    //AlertConditional(GotoBaseVendor,CancelGotoBase,"¿Desea volver a su base?","Esto significa volver a su punto de salida");
  };
  const HandleCancelAlert = () => {
    //Alert.alert("Cancelando operacion ");
    //Alert.alert("Cancelar");
    //CancelGotoBase();
  };
  const ViewButtonsOption = () => {
    return (
      <View flex style={styles.containerButton}>
        <Button
          onPress={() => {
            InitVisit();
          }}
          style={styles.button3}>
          <Text style={{fontSize: 10, color: 'white'}}> Iniciar Ruta </Text>
        </Button>
        <Button
          onPress={() => {
            handleCancelVisit();
          }}
          style={styles.button4}>
          <Text style={{fontSize: 10, color: 'white'}}> Regresar a su base </Text>
        </Button>
      </View>
    );
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
  useEffect(() => {
    if (
      ListRoutes.RoutesInProgress.length == 0 &&
      DrivingVisitDetail.IdWatchLocation != null
    ) {
      Geolocation.clearWatch(DrivingVisitDetail.IdWatchLocation);

      dispatch(SaveIdWatch(null));
      dispatch(SetIsInitDrivingVisit(false));
      AsyncStorageDeleteData('@dataRoute').finally(() => {
        // AlertConditional(
        //   GotoBaseVendor,
        //   CancelGotoBase,
        //   '¿Desea volver a su base?',
        //   'Esto significa volver a su punto de salida',
        // );
      });
    }
  }, [ListRoutes.RoutesInProgress]);
  async function InitVisit(visit = null) {
    if (ListRoutes.RoutesInProgress.length == 0) {
      Alert.alert('No existen visitas en curso');
      return;
    }
    if (
      DrivingVisitDetail.isRouteInCourse &&
      DrivingVisitDetail.IdWatchLocation != null
    ) {
      Alert.alert('La ruta ya ha sido iniciada');
      return;
    }
    try {
      const coords = await GetGeolocation();
      if (!coords.Status) {
        Alert.alert('' + coords.Message);
        return;
      }
      let uuid;
      if (DrivingVisitDetail.UUIDRoute == '') {
        uuid = generateUUID();
      } else {
        uuid = DrivingVisitDetail.UUIDRoute;
      }
      dispatch(SaveUUIDRoute(uuid));
      const IdWatch = StartRealTimeCoords(dispatch, uuid, 5);
      dispatch(SetIsInitDrivingVisit(true));
      const infoRoute = {
        DatevalidId: new Date().toLocaleDateString(),
        UUidInProgress: uuid,
        IdVisitInProgress: 0,
        isRouteInCourse: true,
        IdWatch,
      };
      await AsyncStorageSaveDataJson('@dataRoute', infoRoute);
      Alert.alert('Su viaje está en curso');
    } catch (ex1) {
      Alert.alert('Error: ' + ex1);
    }
  }
  return (
    <ScrollView style={StylesWrapper.secondWrapper}>
      {ListRoutes.RoutesInProgress.length > 0 ? (
        <View>
          <Text style={styles.Title}>En Proceso...</Text>
          <ViewButtonsOption></ViewButtonsOption>
          {DrivingVisitDetail.isRouteInCourse ? (
            <LoaderScreen
              color="black"
              message="Procesando Ubicación"></LoaderScreen>
          ) : null}

          <Text>{ErrorConnection}</Text>
          <View flex center>
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
          <Text style={styles.Title}>No hay rutas en curso</Text>
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
});
