import {useEffect} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {useSelector} from 'react-redux';
import {StyleSheet, View} from 'react-native';
export const RenderMap = () => {
  const user = useSelector(state => state.login);
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: user.coordsActuality.latitude,
          longitude: user.coordsActuality.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}>
        <Marker
          draggable
          coordinate={{
            latitude: user.coordsActuality.latitude,
            longitude: user.coordsActuality.longitude,
          }}
          title={'test'}
          description={'descripción'}
          onDragEnd={(e)=>{
            console.log(e);
          }}
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
