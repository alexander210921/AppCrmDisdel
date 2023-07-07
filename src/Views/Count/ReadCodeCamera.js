import React, {Component, useRef} from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  Alert,
  ScrollView,
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {useSelector} from 'react-redux';
import ListProduct from '../Product/ListProduct/ListProduct';
const CameraLectorCode = () => {
  const ListProducts = useSelector(state => state.Product.ListProductCompany);
  const scrollViewRef = useRef();
  const barcodeReceived = e => {
    let product = ListProducts.filter(x => x.CBarras == e.data);
    if (product == null || product.length == 0) {
      Alert.alert(
        '',
        'No se encontró ningún producto con este código de barras',
      );
      return;
    }
    Alert.alert(
      '',
      '' + product[0].IdProducto + ' / ' + product[0].Descripcion,
    );
    try {
      Linking.openURL(
        'https://www.disdelsa.com/producto/' + product[0].IdProducto,
      );
    } catch {}
  };
 
  const scrollToTop = () => {
    scrollViewRef.current.scrollTo({y: 0, animated: true});
  };
  return (
    <ScrollView ref={scrollViewRef}>
      <QRCodeScanner
        onRead={barcodeReceived}
        flashMode={RNCamera.Constants.FlashMode.off}
        showMarker={true}
        reactivate={true}
        reactivateTimeout={900}
        // topContent={

        // }
        bottomContent={
          <TouchableOpacity style={styles.buttonTouchable}>
            <Text style={styles.buttonText}></Text>
          </TouchableOpacity>
        }
      />
      {/* <SearchBar onSubmit={searchItem} placeholder='Código de producto, Descripción' > </SearchBar> */}
      <ListProduct
        scrollToTop={scrollToTop}
        ListData={ListProducts}></ListProduct>
    </ScrollView>
  );
};

export default CameraLectorCode;

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});
