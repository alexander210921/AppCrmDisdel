import React, {useState, useEffect} from 'react';
import {Text, TextInput, StyleSheet, ScrollView} from 'react-native';
import {Switch, Button, View} from 'react-native-ui-lib';
import SearchableDropdownV2 from '../../Components/SearchList/SearchListV2';
const DeliveryComponent = ({route}) => {
  const [deliveryCompleted, setDeliveryCompleted] = useState(true);
  const [deliveryIssues, setDeliveryIssues] = useState('');
  const [deliverySucess, setDeliverySucess] = useState(true);
  const [ReasonNoDelevery, setReasonNoDelevery] = useState(null);
  const itemsNoDelivery = [
    {
      name: 'Cancelaron el pedido',
      id: 0,
    },
    {
      name: 'No se ubicó el lugar',
      id: 1,
    },
    {
      name: 'No pagaron el pedido',
      id: 2,
    },
    {
      name: 'Documentos Incompletos',
      id: 3,
    },
  ];
  //console.log("data desde el componente",route.params);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    setProducts(route.params);
    console.log(route.params);
  }, []);

  const handleCompleteDelivery = () => {
    //setDeliveryCompleted(true);
  };

  const handleIncompleteDelivery = () => {
    // Aquí puedes realizar alguna acción con la información de los problemas de entrega (deliveryIssues)
    // Por ejemplo, enviarla a un servidor o realizar alguna lógica específica
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

  return (
    <ScrollView style={{backgroundColor: '#fff'}}>
      <View style={styles.container}>
        <Text style={styles.heading}>Registro de entrega</Text>
        <Text style={{color: '#000'}}>¿Se entregó el pedido?</Text>
        <Switch
          onColor="green"
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
              onColor="orange"
              value={deliveryCompleted}
              onValueChange={() => setDeliveryCompleted(!deliveryCompleted)}
            />
          </View>
        ) : null}
        {!deliverySucess ? (
          <View>
            <Text style={{color: '#000'}}>
              ¿Porqué no se entregó?{' '}
              {ReasonNoDelevery ? ReasonNoDelevery.name : ''}
            </Text>
            <SearchableDropdownV2
              viewSearcher={false}
              items={itemsNoDelivery}
              onItemSelected={selectNoDelevery}></SearchableDropdownV2>
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
          <View flex center>
            <Button style={styles.buttonFinalize}>
              <Text style={styles.textWhite}>Finalizar Entrega</Text>
            </Button>
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
  },
  textWhite: {
    color: '#fff',
  },
});

export default DeliveryComponent;
