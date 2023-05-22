import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Chip} from 'react-native-ui-lib';
const DetailCustomer = () => {
  const CustomerDetail = useSelector(state => state.Customer.DetailCustomer);

  return (
    <View style={styles.container}>
      <ScrollView>

     
      <View style={styles.header}>
        <Text style={styles.headerText}>{CustomerDetail.CardName}</Text>
        <Text style={styles.headerTextSecundary}>
          {CustomerDetail.CardCode}{' '}
        </Text>
        <Text style={styles.headerTextSecundary}>
          Vendedor: {CustomerDetail.SlpName}{' '}
        </Text>
      </View>
      {/* content page */}
      <View style={{flexDirection: 'row', marginLeft: '5%', marginRight: '5%',width:"90%"}}>
        <TouchableOpacity style={{...styles.CardStyle,width:'30%'}}>
          {/* <Icon name={'file-document'} size={30} color="#fff"></Icon>
          <Text style={{color:'#fff'}}> Pedidos </Text> */}
          <Chip
            label={'Pedidos'}
            // iconSource={checkmark}
            containerStyle={{width:'100%'}}
            iconStyle={{width: "100%", height: 24}}
            //iconProps={{tintColorz: Colors.$iconDefault}}
          />
        </TouchableOpacity>

        <TouchableOpacity style={{...styles.CardStyle,width:'30%'}}>
          {/* <Icon name={'file-document-outline'} size={30} color="#000"></Icon>
          <Text style={{color:'#000'}} > Cotizaciones </Text> */}
          <Chip
            label={'Cotizaciones'}
            containerStyle={{width:'100%'}}
            // iconSource={checkmark}
            iconStyle={{width: "33%", height: 24}}
            //iconProps={{tintColor: Colors.$iconDefault}}
          />
        </TouchableOpacity>

        <TouchableOpacity style={{...styles.CardStyle,width:'30%'}}>
          {/* <Icon name={'file-document-outline'} size={30} color="#000"></Icon>
          <Text> Entregas </Text> */}
          <Chip
            label={'Entregas'}
            containerStyle={{width:'100%'}}
            // iconSource={checkmark}
            iconStyle={{width: "33%", height: 24}}
            //iconProps={{tintColor: Colors.$iconDefault}}
          />
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={{...styles.CardStyle, backgroundColor: '#fdeecd'}}>
          <Icon  name={'plus-box'}
                  size={30}
                  color="#f4d087" ></Icon>
                  <Text> Pedidos </Text>
        </TouchableOpacity> */}
        {/* <View style={{ flex: 1, backgroundColor: 'yellow', height: 100 }} /> */}
      </View>
      <View style={styles.card2}>
        <Text style={styles.text}>Editar Cliente</Text>
        <Text>Edita los datos del cliente</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={{color: '#000'}}>Ir a editar</Text>
        </TouchableOpacity>
      </View>
      <View style={{...styles.card2, backgroundColor: '#f6df5e'}}>
        <Text style={styles.text}>Dirección de entrega</Text>
        <Text>Agrega o edita las direcciones del cliente</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={{color: '#000'}}>Ir a direcciones</Text>
        </TouchableOpacity>
      </View>
      <View style={{...styles.card2, backgroundColor: '#10d59f'}}>
        <Text style={styles.text}>Dirección fiscal</Text>
        <Text>Agrega o edita las direcciones del cliente</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={{color: '#000'}}>Ir a direcciones</Text>
        </TouchableOpacity>
      </View>

      {/* <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsContainer}
      /> */}
      {/* <View style={styles.footer}>
        <Text style={styles.footerText}>Pie de página</Text>
      </View> */}
       </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'column',
    padding: 16,
    alignSelf: 'flex-start',
    borderBottomColor: '#CCCCCC',
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 20,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242',
  },
  cardsContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    maxHeight: '12%',
  },
  card: {
    backgroundColor: '#FFF',
    width: 150,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    elevation: 2,
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#616161',
    textAlign: 'center',
    marginBottom: 8,
  },
  cardImage: {
    width: 48,
    height: 48,
  },
  footer: {
    padding: 16,
    borderTopColor: '#CCCCCC',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  footerText: {
    fontSize: 14,
    color: '#616161',
  },
  headerTextSecundary: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'gray',
  },
  CardStyle: {
    flex: 1,
    height: 60,
    margin: '2%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  //card detial
  card2: {
    width: '90%',
    maxWidth: 600,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    position: 'relative',
    height: 150,
    backgroundColor: '#13d3f8',
    marginTop: '3%',
  },
  text: {
    fontSize: 20,
    fontWeight: 800,
  },
  button: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 5,
  },
});

export default DetailCustomer;
