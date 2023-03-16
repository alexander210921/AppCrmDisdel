import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, StyleSheet} from 'react-native';
import {Text, View, LoaderScreen, Button,Card} from 'react-native-ui-lib';
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
import {SetVisiActualityt,LoadGetVisitActuality} from '../../Api/Customers/ApiCustumer';
//import { StartInitVisit } from '../../lib/Visits/index/';
import { StartInitVisit, StopInitVisit } from '../../lib/Visits/index';
const VisitCreated = () => {
  const ListRoutes = useSelector(state => state.Customer);
  const DrivingVisitDetail = useSelector(state => state.Mileage);
  const dispatch = useDispatch();
  const Navigator = useNavigation();
  const [ErrorConnection, setErrorConnection] = useState(' ');
  const Rol = useSelector(state => state.rol.RolSelect);
  const navigation = useNavigation();
  const [returnBase,setReturnBase] = useState(false);
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
  const GotoBaseVendor =async () => {
    try {
      let isDeleted = false;
      if (ListRoutes.RoutesInProgress.length > 0) {
        //eliminando
       const dataList =  ListRoutes.RoutesInProgress.map(
          visit => ( visit.IdRegistro
          ),
        );
        //console.log(ListRoutes.RoutesInProgress,"LISTA DE RUTAS EN CURSO");
         isDeleted =await CancelListVisitsInCourse(
          dataList,
          dispatch,
        ).then(response =>{
          if(response.data.length>0){
            Alert.alert("",""+response.data.length+" Registros no se pudieron actualizar");
          }    
          dispatch(SetVisiActualityt([]));
        });
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
  const HandleInitRoute=async()=>{
    try{
      if (
        DrivingVisitDetail.isRouteInCourse &&
        DrivingVisitDetail.IdWatchLocation != null
      ) {
        Alert.alert('La ruta ya ha sido iniciada');
        return;
      }
    dispatch(LoadGetVisitActuality(true));          
     //const data = await FunctionGetCurrentVisit(Rol[0].IdRelacion,dispatch,false,Navigator);        
     if(ListRoutes.RoutesInProgress!=null && ListRoutes.RoutesInProgress.length > 0){
      //dispatch(SetVisiActualityt(ListRoutes.RoutesInProgress));
      await StartInitVisit(ListRoutes.RoutesInProgress,DrivingVisitDetail,dispatch);    
      navigation.navigate("FormCreateRoute");
     }else{
      Alert.alert("No hay visitas pendientes","Cree primero sus visitas antes de poder iniciar su captura de localización ");
     }
    }finally{
      dispatch(LoadGetVisitActuality(false));      
    }       
  }

  const HandleStopVisit=async()=>{
    try{
      if(!DrivingVisitDetail.isRouteInCourse){
          Alert.alert("Cancelacion de ruta","La ruta no ha sido iniciada para poder cancelar");
          return;
      }
      dispatch(LoadGetVisitActuality(true));      
      const cancelStatus = await StopInitVisit(DrivingVisitDetail.IdWatchLocation,dispatch);
      if(cancelStatus){
        Alert.alert("Cancelado correctamente");
        return;
      }
    }finally{
      dispatch(LoadGetVisitActuality(false));      
    }    
  }

  const CancelGotoBase = () => {
    try{
      setReturnBase(true);
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
    if(StopInitVisit(DrivingVisitDetail.IdWatchLocation,dispatch)){
      Alert.alert("Cancelado correctamente");
      //    AlertConditional(
      //   GotoBaseVendor,
      //   CancelGotoBase,
      //   '¿Desea volver a su base?',
      //   'Esto significa volver a su punto de salida',
      // );
    }    
  };
  const HandleCancelAlert = () => {
    //Alert.alert("Cancelando operacion ");
    //Alert.alert("Cancelar");
    //CancelGotoBase();
  };
  const ViewButtonsOption = () => {
    return (
      <View flex style={styles.containerButton}>
        {/* <Button
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
        </Button> */}
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
  const StopGeolocation=()=>{
    if (
      ListRoutes.RoutesInProgress.length == 0 && !returnBase
    ) {
      Geolocation.clearWatch(DrivingVisitDetail.IdWatchLocation);

      dispatch(SaveIdWatch(null));
      dispatch(SetIsInitDrivingVisit(false));
      dispatch(SaveUUIDRoute(''));
      AsyncStorageDeleteData('@dataRoute').finally(() => {
        // AlertConditional(
        //   GotoBaseVendor,
        //   CancelGotoBase,
        //   '¿Desea volver a su base?',
        //   'Esto significa volver a su punto de salida',
        // );
      });
    }
  }
  useEffect(() => {
    StopGeolocation();
  }, [ListRoutes.RoutesInProgress]);
  async function InitVisit() {
    await StartInitVisit(ListRoutes,DrivingVisitDetail,dispatch);  
  }
  return (
    <ScrollView style={StylesWrapper.secondWrapper}>
          
      {ListRoutes.RoutesInProgress.length > 0 ? (
        <View>
          
          <Text style={styles.Title}>En Proceso...</Text>
          <ViewButtonsOption></ViewButtonsOption>
          {DrivingVisitDetail.isRouteInCourse ? (
            // <LoaderScreen
            //   color="black"
            //   message="Procesando Ubicación"></LoaderScreen>
            <Text>Se está capturando su ubicación actual</Text>
          ) : null}

          <Text>{ErrorConnection}</Text>
          <View flex center>
          {ListRoutes.loadGetCurrentVisit?
      <LoaderScreen color="black" message="Cargando proceso..." ></LoaderScreen>:null
      }
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
        onPress={HandleStopVisit}>
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
    color:'red',
    backgroundColor: '#957DAD',
  },
  mainCardView: {
    display:'flex',
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
    display:'flex',
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
});
