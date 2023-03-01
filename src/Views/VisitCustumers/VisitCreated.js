import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, StyleSheet} from 'react-native';
import {Text, View, LoaderScreen, Button} from 'react-native-ui-lib';
import StylesWrapper from '../../Styles/Wrapers';
import CardVisit from '../../Components/Cards/Card1';
import {useDispatch, useSelector} from 'react-redux';
import {SaveSelectVisitDetail} from '../../Api/Customers/ApiCustumer';
import {useNavigation} from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import {FunctionSetCoordsDetail} from '../../Api/Customers/ApiCustumer';
import {
  SaveIdWatch,
  SetIsInitDrivingVisit,
  SaveUUIDRoute,
} from '../../Api/Customers/ApiCustumer';
import {GetGeolocation} from '../../lib/Permissions/Geolocation';
import {generateUUID} from '../../lib/UUID';
const VisitCreated = () => {
  const ListRoutes = useSelector(state => state.Customer);
  const DrivingVisitDetail = useSelector(state => state.Mileage);
  const dispatch = useDispatch();
  const Navigator = useNavigation();
  const [ErrorConnection, setErrorConnection] = useState(' ');
  const CancelVisit = () => {
    if (DrivingVisitDetail.IdWatchLocation != null) {
      Geolocation.clearWatch(DrivingVisitDetail.IdWatchLocation);
    }
    if (!DrivingVisitDetail.isRouteInCourse) {
      Alert.alert('No se ha iniciado el viaje');
      return;
    }
    dispatch(SaveIdWatch(null));
    dispatch(SetIsInitDrivingVisit(false));
  };
  const SelectViewVisitDetail = visit => {
    if (!DrivingVisitDetail.isRouteInCourse) {
      Alert.alert('Inicie primero el viaje antes de acceder');
      return;
    }
    dispatch(SaveSelectVisitDetail(visit));
    Navigator.navigate('DetailVisit');
  };
  async function InitVisit(visit = null) {
    if (!visit) {
      //Alert.alert("La visita seleccionada es inválida");
      //return;
    }

    if (DrivingVisitDetail.isRouteInCourse) {
      Alert.alert('La ruta se encuentra en curso');
      return;
    }

    try {
      const coords = await GetGeolocation();
      if (!coords.Status) {
        Alert.alert('' + coords.Message);
        return;
      }
      // if(DrivingVisitDetail.IdWatchLocation!=null){
      //   Geolocation.clearWatch(DrivingVisitDetail.IdWatchLocation);
      // }
      let uuid;
      if (DrivingVisitDetail.UUIDRoute == '') {
        uuid = generateUUID();
      } else {
        uuid = DrivingVisitDetail.UUIDRoute;
      }

      dispatch(SaveUUIDRoute(uuid));
      const IdWatchClock = Geolocation.watchPosition(
        position => {
          const {latitude, longitude} = position.coords;
          const data = {
            Latitud: latitude,
            Longitud: longitude,
            UUIRecorrido: uuid,
          };
          //console.log(data);
          FunctionSetCoordsDetail(data, dispatch, false, Navigator);
        },
        error => {
          Alert.alert('' + error);
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0,
          distanceFilter: 5,
        },
      );
      dispatch(SaveIdWatch(IdWatchClock));
      dispatch(SetIsInitDrivingVisit(true));
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
          <View flex style={styles.containerButton}>
            <Button
              onPress={() => {
                InitVisit();

                // HandleUpdateVisit(3);
              }}
              style={styles.button3}>
              <Text style={{fontSize: 10, color: 'white'}}> Iniciar Ruta </Text>
            </Button>
            <Button
              onPress={() => {
                CancelVisit();
                //HandleUpdateVisit(3);
              }}
              style={styles.button4}>
              <Text style={{fontSize: 10, color: 'white'}}>
                {' '}
                Finalizar Ruta{' '}
              </Text>
            </Button>
          </View>
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
        <Text style={styles.Title}>No hay rutas en curso</Text>
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
