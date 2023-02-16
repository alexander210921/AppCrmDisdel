import MapView, {Marker} from 'react-native-maps';
import {StyleSheet, View} from 'react-native';
import MapViewDirections from 'react-native-maps-directions';
import {API_KEY_GOOGLE_MAPS} from "@env";
export const RenderStaticMap = ({coordsActuality,coordsDestination,hasMarker=false}) => {
  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={coordsActuality}>
        <MapViewDirections
          origin={coordsActuality}
          destination={coordsDestination}
          apikey={API_KEY_GOOGLE_MAPS}
          strokeWidth={3}
          strokeColor="black"></MapViewDirections>
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
