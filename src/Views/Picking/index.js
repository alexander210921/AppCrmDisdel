import React, { useRef } from 'react';
import { StyleSheet,ScrollView } from 'react-native';
import CardCarousel from '../../Components/FlatList/index';
import { View } from 'react-native-ui-lib';
const HomePicking = ({route}) => {
  const scrollViewRef = useRef();
  const handleScroll = event => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY > 100) {
      // Mostrar botón
    } else {
      // Ocultar botón
    }
  };
  const scrollToTop = () => {
    scrollViewRef.current.scrollTo({y: 0, animated: true});
  };
  return (
    // <View style={styles.container}>
    //   <CardCarousel content={route.params.detail} />
    // </View>
    <ScrollView
    ref={scrollViewRef}
    onScroll={handleScroll}
    scrollEventThrottle={16}
    style={styles.BackroundColor}>
    <View flex>
      {route?.params?.detail ? (
        <CardCarousel          
          scrollToTop={scrollToTop}
          content={route.params.detail}></CardCarousel>
      ) : <Text style={{color:'black'}}>No se encontró el detalle del pedido</Text>}
    </View>
  </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomePicking;
