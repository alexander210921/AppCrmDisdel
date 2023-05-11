import React from 'react';
import {
  Chip,
  Colors,
  Spacings,
  Typography,
  View,
  TextField,
} from 'react-native-ui-lib';
import {
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const DetailProduct = () => {
  const product = useSelector(state => state.Product.ProductView);
 
  console.log(product);
  return (
    <ScrollView style={styles.BackroundColor}>
         <View style={{backgroundColor:'#fff',margin:0,width:'100%',padding:10}} >
        <Image
          source={{
            uri:
              'https://disdelsa.com/imagenes/productos/' +
              product.Imagen +
              '?w=70&h=70',
          }}
          style={styles.image}
        />
        </View>
      <View style={styles.container}>
       
        
        {/* <View> */}
        <Text style={styles.priceText}> {product.IdProducto}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.description}>{product.Descripcion}</Text>
          <View style={styles.quantityContainer}>
            <View>
              <Text style={styles.priceText}>Precio</Text>
              <Text style={styles.price}>Q. {product.PrecioDeLista}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.containerDetail}>
        <View style={styles.column}>
          {/* Aquí iría el contenido de la primera columna */}
          <Text style={styles.titleQuantity}>Caracteristicas</Text>

          <Chip
            label={''}
            labelStyle={{marginRight: Spacings.s1}}
            badgeProps={{
              label: 'Unidad: ' + product.CompraUnidad,
              backgroundColor: Colors.$backgroundDefault,
              borderWidth: 2,
              borderColor: Colors.white,
              labelStyle: {color: Colors.$textDefault},
            }}
            containerStyle={{
              borderWidth: 0,
              marginLeft: Spacings.s3,
            }}
            leftElement={
              <Icon
                name={'star'}
                size={20}
                color="orange"
                style={styles.icon}
              />
            }
          />
          <Chip
            label={''}
            labelStyle={{marginRight: Spacings.s1}}
            badgeProps={{
              label: 'Fardo: ' + product.CompraFardo,
              backgroundColor: Colors.$backgroundDefault,
              borderWidth: 2,
              borderColor: Colors.white,
              labelStyle: {color: Colors.$textDefault},
            }}
            containerStyle={{
              borderWidth: 0,
              marginLeft: Spacings.s3,
            }}
            leftElement={
              <Icon
                name={'star'}
                size={20}
                color="orange"
                style={styles.icon}
              />
            }
          />

          <Chip
            label={''}
            labelStyle={{marginRight: Spacings.s1}}
            badgeProps={{
              label: 'Proveedor: ' + product.Proveedor,
              backgroundColor: Colors.$backgroundDefault,
              borderWidth: 2,
              borderColor: Colors.white,
              labelStyle: {color: Colors.$textDefault},
            }}
            containerStyle={{
              borderWidth: 0,
              marginLeft: Spacings.s3,
            }}
            leftElement={
              <Icon
                name={'star'}
                size={20}
                color="orange"
                style={styles.icon}
              />
            }
          />
           
        </View>
        <View style={styles.column}>
          {/* Aquí iría el contenido de la segunda columna */}
          <Text style={styles.titleQuantity}>Cantidad</Text>
          <View style={styles.containerQuantity}>
            <TouchableOpacity onPress={() => {}} style={styles.buttonQuantity}>
              <Icon
                name={'minus-box'}
                size={30}
                color="black"
                style={styles.icon}
              />
            </TouchableOpacity>
            <TextField
              onChangeText={text => console.log(text)}
              keyboardType="numeric"
              style={styles.inputQuantity}
            />
            <TouchableOpacity onPress={() => {}} style={styles.buttonQuantity}>
              <Icon
                name={'plus-box'}
                size={30}
                color="orange"
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{marginTop: '5%', marginBottom: '1%'}}>
        <TouchableOpacity style={styles.buyButton}>
            <View style={{display:'flex',flexDirection:'row'}}>
            <Text style={styles.buyButtonText}>Comprar</Text>
          <Icon
                name={'shopping-outline'}
                size={20}
                color="#FF8000"
                style={styles.icon}
              />
            </View>
         
        </TouchableOpacity>
        {/* </View> */}
        
      </View>
    </ScrollView>
  );
};
export default DetailProduct;
const styles = StyleSheet.create({
  BackroundColor: {
    backgroundColor: '#f8f9fd',
    flex: 1,
  },

  container: {
    
    borderRadius: 10,
    padding: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    //elevation: 7,
  },
  image: {
    width: '100%',
    height: 340,
    borderRadius: 10,
    marginBottom: 10,
  
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  price: {
    fontWeight: 800,
    fontSize: 20,
    color: 'black',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 5,
    marginHorizontal: 0,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  quantityButtonText: {
    fontSize: 18,
    color: 'orange',
  },
  quantityInput: {
    width: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    borderRadius: 5,
    textAlign: 'center',
    color: 'gray',
  },
  description: {
    marginBottom: 10,
    color: 'black',
    width: '60%',
    fontWeight: 800,
    fontSize: 17,
  },
  buyButton: {
    backgroundColor: 'black',
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'center',
    height: 60,
  },
  buyButtonText: {
    color: '#ccc',
    fontWeight: 'bold',
    fontSize: 15,
  },
  priceText: {
    fontWeight: 800,
    fontSize: 17,
    color: 'gray',
  },
  containerDetail: {
    flexDirection: 'row',
    //backgroundColor:"gray"
  },
  column: {
    flex: 1,
  },
  containerQuantity: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 5,
    paddingHorizontal: 45,
    paddingVertical: 5,
  },
  titleQuantity: {
    borderRadius: 5,
    paddingHorizontal: 45,
    paddingVertical: 5,
    fontWeight: 800,
    color: 'gray',
  },
  buttonQuantity: {
    padding: 0,
    borderRadius: 5,
  },
  buttonTextQuantity: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'black',
  },
  inputQuantity: {
   // flex: 1,
   // marginLeft: 4,
   // marginRight: 4,
    fontSize: 12,
    textAlign: 'center',
    color: 'black',
   // maxWidth: 45,
  },
});
