import React, {useState, useEffect} from 'react';
import {Text, TextInput, StyleSheet, ScrollView, Alert} from 'react-native';
import {Switch, Button, View, TextField, LoaderScreen} from 'react-native-ui-lib';
//import SearchableDropdownV2 from '../../Components/SearchList/SearchListV2';
import {Picker} from '@react-native-picker/picker';
import CashPayment from './Payments/CashPayment';
import CreditPayment from './Payments/CreditPayment';
import { ArriveDelevery, SaveDocumentsRoute } from '../../Api/Traking/ApiTraking';
import { useDispatch,useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

// import CompleteOrder from './Order/CompleteOrder';
const DeliveryComponent = ({route}) => {
  const [deliveryCompleted, setDeliveryCompleted] = useState(true);
  const [deliveryIssues, setDeliveryIssues] = useState('');
  const [deliverySucess, setDeliverySucess] = useState(true);
  const [ReasonNoDelevery, setReasonNoDelevery] = useState(null);
  const [typeNumberDelevery, setTypeNumberDelevery] = useState(1);
  const [typeNumberNoDelevery, setTypeNumberNoDelevery] = useState("0");
  const [loadEndProcessTracking, setLoadEndProcessTracking] = useState(false);
  const [commentary,setComentary] = useState('');
  const documents = useSelector(state => state.Tracking.DocumentAcepted);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const itemsNoDelivery = [
    {
      name: 'Cancelaron el pedido',
      id: "0",
    },
    {
      name: 'No se ubicó el lugar',
      id: "1",
    },
    {
      name: 'No pagaron el pedido',
      id: "2",
    },
    {
      name: 'Documentos Incompletos',
      id: "3",
    },
  ];

  const optionsForCompleteDelevery = [
    {
      name: 'Contado',
      id: 1,
    },
    {
      name: 'Crédito',
      id: 2,
    },
  ];
  //console.log("data desde el componente",route.params);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    setProducts(route.params?.detail);
  }, []);
  const handleCompleteDelivery = () => {};

  const handleIncompleteDelivery = () => {};
  const FunctionsetComentary=(text)=>
  {
    if(text!=null){
      setComentary(text);
    }
  }
  const PressDeleveryCompletedandSucess = () => {
    // this function is active when the delevery is complete and productis in complete
    Alert.alert('test', '');
  };

  const selectTypeDelevery = type => {
    //console.log(type);
    setTypeNumberDelevery(type);
  };

  const changeQuantityItem = (product, newQuantity) => {
    if (newQuantity == null) {
      return;
    }
    let updateQuantity = products.map(item => {
      if (
        item.Codigo === product.Codigo &&
        item.Descripcion === product.Descripcion
      ) {
        item.CambioCantidad = true;
        item.CantidadNueva = newQuantity;
      }
      return item;
    });
    setProducts(updateQuantity);
  };

  const handleProductDelivery = (productId, productName, delivered) => {
    const updatedProducts = products.map(product =>
      product.Codigo === productId && product.Descripcion === productName
        ? {...product, delivered}
        : product,
    );
    setProducts(updatedProducts);
  };

  const selectNoDelevery = item => {
    setReasonNoDelevery(item);
  };
  const HandleIsCancelOrder=async()=>{
    //si cancelaron el pedido
    try{
      setLoadEndProcessTracking(true);
      let Data={};
      Data.Latitud = 0;
      Data.Longitud = 0;
      Data.Comentario = commentary;
      Data.pedidoNEntregado =parseInt(typeNumberNoDelevery);
      Data.Estado = 5;
      Data.eventosDocument=0;
      Data.IdTracking=route?.params?.dataTracking?.EntityID
      //console.log("data: ",Data);
      const result = await ArriveDelevery(Data);
      //let result = null;
        if (result == null) {
          Alert.alert('', 'Ocurrió un error, intenta nuevamente');
          return;
        }
        Alert.alert('', '' + result?.Mensaje);
        if(result.Resultado){        
          let filterDoc = documents?.filter(item=>item.EntityID!=Data.IdTracking);
          dispatch(SaveDocumentsRoute(filterDoc));
          
          navigation.goBack();
        }
    }finally{
      setLoadEndProcessTracking(false);
    }
  }
  return (
    <ScrollView style={{backgroundColor: '#fff'}}>
      <View style={styles.container}>
        <Text style={styles.heading}>Registro de entrega</Text>
        <Text style={{color: '#000'}}>¿Se entregó el pedido?</Text>
        <Switch
          onColor="#000"
          value={deliverySucess}
          onValueChange={() => {
            setDeliverySucess(!deliverySucess);

            if (!deliverySucess) {
              setDeliveryCompleted(false);
            }
          }}
        />
        {deliverySucess ? (
          <View>
            <Text style={{color: '#000'}}>
              ¿Se entregó todos los productos?{' '}
            </Text>
            <Switch
              onColor="#000"
              value={deliveryCompleted}
              onValueChange={() => setDeliveryCompleted(!deliveryCompleted)}
            />
          </View>
        ) : null}
        {!deliverySucess ? (
          <View >
            <Text style={{color: '#000'}}>
              ¿Porqué no se entregó?{' '}
              {ReasonNoDelevery ? ReasonNoDelevery.name : ''}
            </Text>
            <View style={{borderWidth:1,borderColor:'#000'}}>
            <Picker
               selectedValue={typeNumberNoDelevery}
               onValueChange={
                 itemValue => {
                  setTypeNumberNoDelevery(itemValue);
                   
                 }
               }
            >
            {itemsNoDelivery.map((item,index)=>(
              <Picker.Item
              label={item.name}
              value={item.id}
              key={index}
              style={{
                color: 'black',
                backgroundColor:'#fff'
              }}
            >
              
            </Picker.Item>
            ))
              
            }
            </Picker>
            </View>
            <TextField
              placeholder="Comentarios"
              onChangeText={FunctionsetComentary}
              value={commentary}
              style={{marginTop:'4%'}}
            >

            </TextField>
            {loadEndProcessTracking ? <LoaderScreen color="black"></LoaderScreen> : 
                  <Button
                  label="Finalizar Cancelación"
                  style={{backgroundColor:'#000',marginTop:'4%',with:'50%'}}
                  onPress={HandleIsCancelOrder}
                >
    
                </Button>
            }
      
        
            {/* <SearchableDropdownV2
              viewSearcher={false}
              items={itemsNoDelivery}
              onItemSelected={selectNoDelevery}></SearchableDropdownV2> */}
          </View>
        ) : null}

        {deliverySucess ? (
          <View>{/* <Text style={{color:'#000'}}>Formulario</Text> */}</View>
        ) : null}

        {/* <Checkbox></Checkbox> */}
        {!deliveryCompleted && deliverySucess ? (
          <>
            {products.map(product => (
              <View key={product.Codigo} style={styles.productContainer}>
                <Text style={styles.productName}>
                  {product.Codigo + ' / ' + product.Descripcion}
                </Text>
                {product.delivered ? (
                  <View style={styles.productName}>
                    <Text style={{color:'#000'}} >
                      {product.CambioCantidad
                        ? 'Cantidad Original: ' + product.Cantidad
                        : ''}
                    </Text>
                    <TextInput
                      style={styles.textInput}
                      value={
                        product.CambioCantidad
                          ? product.CantidadNueva
                          : product?.Cantidad.toString()
                      }
                      onChangeText={value => {
                        changeQuantityItem(product, value);
                      }}></TextInput>
                  </View>
                ) : null}

                <Button
                  onPress={() =>
                    handleProductDelivery(
                      product.Codigo,
                      product.Descripcion,
                      !product.delivered,
                    )
                  }
                  color={product.delivered ? '#4CAF50' : '#F44336'}
                  style={{
                    backgroundColor: product.delivered ? '#4CAF50' : '#F44336',
                  }}>
                  <Text style={styles.textWhite}>
                    {product.delivered ? 'Entregado' : 'No entregado'}
                  </Text>
                </Button>
              </View>
            ))}
            <TextInput
              style={styles.textInput}
              placeholder="Motivo de la entrega incompleta"
              value={deliveryIssues}
              onChangeText={text => setDeliveryIssues(text)}
            />
            <View style={styles.buttonContainer}>
              <Button
                onPress={handleCompleteDelivery}
                disabled={!products.every(product => product.delivered)}
                style={{backgroundColor: '#000'}}>
                <Text style={styles.textWhite}>Finalizar entrega</Text>
              </Button>
              <Button
                onPress={handleIncompleteDelivery}
                style={{backgroundColor: '#000'}}>
                <Text style={styles.textWhite}>Entrega incompleta</Text>
              </Button>
            </View>
          </>
        ) : null}
        {deliveryCompleted && deliverySucess ? (
          <View>
            {/* <SearchableDropdownV2
              viewSearcher={false}
              items={optionsForCompleteDelevery}
              onItemSelected={selectTypeDelevery}></SearchableDropdownV2> */}
              <View style={styles.containerSelector}>
              <Picker
              selectedValue={typeNumberDelevery}
              onValueChange={
                itemValue => {
                  setTypeNumberDelevery(itemValue);
                  console.log(itemValue)
                }
              }
              >
                {optionsForCompleteDelevery.map((optionsDelevery,index)=>(
                 <Picker.Item 
                  key={index}
                 label={optionsDelevery.name}
                 value={optionsDelevery.id}
                 style={{
                  color: 'black',
                  backgroundColor:'#fff'
                }}
               />
                )
                )}
              </Picker>
              </View>
            

            {typeNumberDelevery?.id == 1 || typeNumberDelevery ===1 ? <CashPayment dataTracking={route.params?.dataTracking} ></CashPayment> : <CreditPayment dataTracking={route.params?.dataTracking}></CreditPayment>}
            {/* <View flex center>
              <Button
                onPress={PressDeleveryCompletedandSucess}
                style={styles.buttonFinalize}>
                <Text style={styles.textWhite}>Finalizar Entrega</Text>
              </Button>
            </View> */}
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: 'black',
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  productName: {
    flex: 1,
    fontSize: 16,
    marginRight: 16,
    color: 'black',
  },
  textInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    marginBottom: 16,
    paddingHorizontal: 8,
    color: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  completedText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    textAlign: 'center',
  },
  buttonFinalize: {
    backgroundColor: '#000',
    width: '80%',
    marginTop: 10,
    marginBottom: 20,
  },
  textWhite: {
    color: '#fff',
  },
  containerSelector:{
    borderWidth:1,
    marginBottom:'2%',
    marginTop:'2%'
  }
});

export default DeliveryComponent;
