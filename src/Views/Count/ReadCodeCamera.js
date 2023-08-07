import React, {Component, useEffect, useRef, useState} from 'react';

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
//import Prompt from 'react-native-prompt';
//import prompt from 'react-native-prompt-android';
import { Button } from 'react-native-ui-lib';

const CameraLectorCode = ({onReadCodeCamera=function(value){}}) => {
  const ListProducts = useSelector(state => state.Product.ListProductCompany);
  const scrollViewRef = useRef();
  const [view, setViewPromt] = useState(false);
  const [ListItemsAdded, setItem] = useState([]);
  const [ViewCamera,setViewCamera] = useState(false);
  const handleClickButtonAdd = item => {
    setViewPromt(true);
    RenderPromptQuantityItem(item.IdProducto, item.Descripcion, item);
    //console.log("test");
  };
  const HandleHiddeCamera=()=>{
    setViewCamera(!ViewCamera);
  }

  useEffect(()=>{
   // console.log(ListItemsAdded);
  },[ListItemsAdded])
  const RenderPromptQuantityItem = (CodProduct, NameProduct, item) => {
    // prompt(
    //   'Ingrese la cantidad',
    //   '' + CodProduct + ' / ' + NameProduct,
    //   [
    //     {
    //       text: 'Cancelar',
    //       onPress: () => console.log('Cancel Pressed'),
    //       style: 'cancel',
    //     },
    //     {
    //       text: 'OK',
    //       onPress: quantity => {
    //         item.Cantidad = quantity;
    //         setItem(ListItemsAdded.push(item));
    //       },
    //     },
    //   ],
    //   {
    //     type: 'numeric',
    //     cancelable: false,
    //     defaultValue: 0,
    //     placeholder: 'Cantidad',
    //   },
    // );
  };

  const barcodeReceived = e => {
    onReadCodeCamera(e.data);
    // let product = ListProducts.filter(x => x.CBarras == e.data);
    // if (product == null || product.length == 0) {
    //   Alert.alert(
    //     '',
    //     'No se encontró ningún producto con este código de barras',
    //   );
    //   return;
    // }

    // RenderPromptQuantityItem(
    //   product[0].IdProducto,
    //   product[0].Descripcion,
    //   product[0],
    // );
    // Alert.alert(
    //   '',
    //   '' + product[0].IdProducto + ' / ' + product[0].Descripcion,
    // );
    // try {
    //   Linking.openURL(
    //     'https://www.disdelsa.com/producto/' + product[0].IdProducto,
    //   );
    // } catch {}
  };

  const scrollToTop = () => {
    scrollViewRef.current.scrollTo({y: 0, animated: true});
  };
  return (
    <ScrollView ref={scrollViewRef}>
      {ViewCamera?
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
      :null}
      <Button onPress={HandleHiddeCamera} style={styles.ButtonHiddeCamera} >
        <Text style={{color:'white'}}>{ViewCamera?"Ocultar":"Mostrar Cámara"} </Text>
      </Button>      
    </ScrollView>
  );
};

export default React.memo(CameraLectorCode);

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
  ButtonHiddeCamera:{
    backgroundColor:'black',
    marginTop:'3%',
    borderRadius:0,
    width:'40%',
    marginLeft:'2%'
  }
});
