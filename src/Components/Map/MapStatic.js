import MapView, {Marker} from 'react-native-maps';
import {StyleSheet, View,Text} from 'react-native';
import MapViewDirections from 'react-native-maps-directions';
import {API_KEY_GOOGLE_MAPS} from "@env";
import {useState}from'react'
const RenderStaticMap = ({coordsActuality,coordsDestination,hasMarker=false,onReadyData,MarkerPress=function(){},isDragable=false}) => {

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
// console.log("Actual",LOCATION_ACTUALITY);
// console.log("Destino",LOCATION_DESTINATION);
  return (
    <View style={styles.container}>
      {/* <Text>{dinfoRoute}</Text> */}
      <MapView style={styles.map} initialRegion={LOCATION_ACTUALITY}>
        <MapViewDirections
          origin={LOCATION_ACTUALITY}
          destination={LOCATION_DESTINATION}
          apikey={API_KEY_GOOGLE_MAPS}
          strokeWidth={3}
          onReady={(result)=>{
            
            onReadyData(result);
            //setInfoRoute("La distancia para llegar a su destino es de: "+result.distance+" mts" +" y el tiempo promedio para llegar es de: "+result.duration+" minutos");
          }}
          
          strokeColor="red"></MapViewDirections>
          <Marker draggable={isDragable} onPress={MarkerPress} title='Usted está acá' coordinate={LOCATION_ACTUALITY} />
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
