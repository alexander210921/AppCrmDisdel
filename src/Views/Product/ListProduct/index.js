import React, {useRef} from 'react';
import {View} from 'react-native-ui-lib';
import {StyleSheet, ScrollView, TouchableOpacity, Text} from 'react-native';
import ListProduct from './ListProduct';
import {useSelector} from 'react-redux';
const ListProductHome = () => {
  const ListProducts = useSelector(state => state.Product.ListProductCompany);
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
    <ScrollView
      ref={scrollViewRef}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      style={styles.BackroundColor}>
      <View flex>
        {ListProducts ? (
          <ListProduct
            scrollToTop={scrollToTop}
            ListData={ListProducts}></ListProduct>
        ) : null}
      </View>
    </ScrollView>
  );
};
export default ListProductHome;

const styles = StyleSheet.create({
  BackroundColor: {
    backgroundColor: '#f5f4f0',
  },
});
