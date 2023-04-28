import MapView, {Marker} from 'react-native-maps';
import {StyleSheet, View,Text} from 'react-native';
import MapViewDirections from 'react-native-maps-directions';
import {API_KEY_GOOGLE_MAPS} from "@env";
import {useState}from'react'
import { SetActualityCoords } from '../../Api/User/ApiUser';
import { useDispatch } from 'react-redux';
const RenderStaticMap = ({coordsActuality,coordsDestination,hasMarker=false,onReadyData,MarkerPress=function(){},isDragable=false,mode="DRIVING"}) => {
const dispatch = useDispatch();
const LOCATION_ACTUALITY = {
  ...coordsActuality,
  latitudeDelta: 0.015,
  longitudeDelta: 0.0121,
}  
const LOCATION_DESTINATION={
  ...coordsDestination,
  latitudeDelta: 0.015,
  longitudeDelta: 0.0121,
}
  return (
    <View style={styles.container}>
      {/* <Text>{dinfoRoute}</Text> */}
      <MapView style={styles.map} initialRegion={LOCATION_ACTUALITY}>
        <MapViewDirections
          resetOnChange={true}
          origin={LOCATION_ACTUALITY}
          destination={LOCATION_DESTINATION}
          apikey={API_KEY_GOOGLE_MAPS}
          strokeWidth={3}
          mode={mode}
          onReady={(result)=>{
            onReadyData(result);
          }}
          strokeColor="red"></MapViewDirections>
          <Marker onDragEnd={(data)=>{
            dispatch(SetActualityCoords({
              latitude:data.nativeEvent.coordinate.latitude,
              longitude:data.nativeEvent.coordinate.longitude
            }));
          }} draggable={isDragable} onPress={MarkerPress} title='Usted está acá' coordinate={LOCATION_ACTUALITY} />
          <Marker pinColor="green" description='Destino' title='Destino' coordinate={LOCATION_DESTINATION} />
      </MapView>
    </View>
  );
};
export default RenderStaticMap;
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
