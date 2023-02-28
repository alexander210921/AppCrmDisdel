import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, StyleSheet} from 'react-native';
import {Text, View, LoaderScreen} from 'react-native-ui-lib';
import StylesWrapper from '../../Styles/Wrapers';
import CardVisit from '../../Components/Cards/Card1';
import {useDispatch, useSelector} from 'react-redux';
import {SaveSelectVisitDetail} from '../../Api/Customers/ApiCustumer';
import {useNavigation} from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import {FunctionSetCoordsDetail} from '../../Api/Customers/ApiCustumer';
import { SaveIdWatch } from '../../Api/Customers/ApiCustumer';
const VisitCreated = () => {
  const ListRoutes = useSelector(state => state.Customer);
  const dispatch = useDispatch();
  const Navigator = useNavigation();
  const [IdWatchPosition, setIdWatchPosition] = useState(null);
  const [ErrorConnection, setErrorConnection] = useState(' ');
  const SelectViewVisitDetail = visit => {
    dispatch(SaveSelectVisitDetail(visit));
    Navigator.navigate('DetailVisit');
  };
 async function InitVisit(visit = null) {
    if(!visit){
      Alert.alert("La visita seleccionada es inválida");
      return;
    }   
    try {
      const coords = await GetGeolocation();
      if (!coords.Status) {
          Alert.alert(coords.Message);        
          return ;
      }
     const IdWatchClock = Geolocation.watchPosition(
        position => {
          const {latitude, longitude} = position.coords;
          const data = {
            Latitud: latitude,
            Longitud: longitude,
            IDactividadVisita: visit.IdRegistro,
          };
          //console.log(data);
          FunctionSetCoordsDetail(data, dispatch, false, Navigator);
        },
        error => {
          Alert.alert(""+error)
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0,
          distanceFilter: 5,
        },
      );

    } catch (ex1) {
      Alert.alert("Error: "+ex1)
    }
  }
  return (
    <ScrollView style={StylesWrapper.secondWrapper}>
      {ListRoutes.RoutesInProgress.length > 0 ? (
        <View>
          <Text style={styles.Title}>En Proceso...</Text>
          <LoaderScreen
            color="black"
            message="Procesando Ubicación"></LoaderScreen>
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
});
