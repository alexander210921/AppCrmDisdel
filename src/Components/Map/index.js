import {useState} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {useDispatch, useSelector} from 'react-redux';
import {StyleSheet, View} from 'react-native';
import {SetDestinationCoords} from '../../Api/User/ApiUser';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';
export const RenderMap = () => {
  const user = useSelector(state => state.login);
  const [coordsDestination, setCoordsDestination] = useState({
    ...user.coordsActuality,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121
  });
  const [coordsActuality, setCoordsActuality] = useState({
    ...user.coordsActuality,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });
  const dispatch = useDispatch();
  const SaveVisitDestination = e => {
    dispatch(SetDestinationCoords(e.nativeEvent.coordinate));
    setCoordsDestination(e.nativeEvent.coordinate);
  };
  Geolocation.watchPosition(
    res => {
      setCoordsActuality(res.coords);      
    },
    error => console.log(error),
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 60000,
      distanceFilter: 1,
    },
  );

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={coordsActuality}>
        {coordsDestination.latitude > 0 ? (
          <MapViewDirections
            origin={coordsActuality}
            destination={coordsDestination}
            apikey={'AIzaSyBGzUb5aIQyMpPPaBNZz9CJXvuQDajqavs'}
            strokeWidth={3}
            strokeColor="red"></MapViewDirections>
        ) : null}
        <Marker
          coordinate={coordsActuality}
          title={'Punto de Inicio'}
          description={''}
        />
        <Marker
          draggable
          coordinate={coordsDestination}
          title={'Punto de Destino'}
          description={''}
          onDragEnd={SaveVisitDestination}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1, //the container will fill the whole screen.
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
