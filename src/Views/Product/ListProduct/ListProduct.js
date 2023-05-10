import React, {useState, useMemo} from 'react';
import {
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {StyleSheet, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {PageControl, Colors, View} from 'react-native-ui-lib';
const ListProduct = ({ListData}) => {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  // catalog pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [todosPerPage, settodosPerPage] = useState(6);
  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const [quantity, setQuantity] = useState(1);
  const [QuantityItems, setQuantityItems] = useState(0);
  const currentTodos = useMemo(() => {
    return filteredItems.length > 0
      ? filteredItems.slice(indexOfFirstTodo, indexOfLastTodo)
      : [];
  }, [currentPage, filteredItems]);

  const handleSearch = text => {
    setSearchText(text);
  };
  const onSearch = () => {
    if (searchText == null || searchText === '') {
      return;
    }
    const filtered = ListData.filter(
      item =>
        item.Descripcion.toLowerCase().includes(searchText.toLowerCase()) ||
        item.IdProducto.toLowerCase().includes(searchText.toLowerCase()),
    );
    setFilteredItems(filtered);
    setQuantityItems(filtered.length);
    setCurrentPage(1);
  };
  const handleQuantityChange = newQuantity => {
    setQuantity(newQuantity);
  };
  const handleAddToCart = () => {
    // Lógica para agregar el producto al carrito
  };
  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={{paddingVertical: 20}}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  };
  const Card = ({
    color = '#ffffff',
    title = ' ',
    nameIcon = 'sale',
    onPress,
    item,
  }) => {
    return (
      <View style={styles.containerCard}>
        <Icon name={nameIcon} size={30} color="#9089dd" style={styles.icon} />

        <Image
          source={{
            uri:
              'https://disdelsa.com/imagenes/productos/' +
              item.Imagen +
              '?w=70&h=70',
          }}
          style={styles.image}
          resizeMode="cover"
        />
        <Text style={{color: 'gray'}}>{item.IdProducto}</Text>
        <Text style={styles.description}>{item.Descripcion}</Text>
        <Text style={styles.price}>Q. {item.PrecioDeLista}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => handleQuantityChange(quantity - 1)}
            disabled={quantity === 1}>
            <Text style={[styles.quantityButton, {marginRight: 10}]}>
              {'-'}
            </Text>
          </TouchableOpacity>
          <TextInput
            style={styles.quantityInput}
            value={quantity.toString()}
            onChangeText={handleQuantityChange}
            keyboardType="numeric"
          />
          <TouchableOpacity onPress={() => handleQuantityChange(quantity + 1)}>
            <Text style={[styles.quantityButton, {marginLeft: 10}]}>{'+'}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
          <Text style={styles.addButtonText}>Agregar al carrito</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <ScrollView>
      <View style={{flex: 1, backgroundColor: '#f5f4f0'}}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder={'Buscar Producto'}
            //value={searchText}
            onChangeText={handleSearch}
            onBlur={onSearch}
            placeholderTextColor={'#b3b2b7'}
          />
        </View>
        <FlatList
          data={currentTodos}
          keyExtractor={item => item.IdProducto.toString()}
          renderItem={({item}) => <Card item={item}></Card>}
          //onEndReached={fetchData}
          onEndReachedThreshold={0.7}
          ListFooterComponent={renderFooter}
          numColumns={2}
        />
        <View>
          <PageControl
            size={12}
            spacing={8}
            inactiveColor={Colors.grey60}
            color={Colors.grey20}
            onPagePress={numberPage => {
              setCurrentPage(numberPage + 1);
            }}
            containerStyle={{marginBottom: 40}}
            numOfPages={Math.ceil(QuantityItems / todosPerPage)}
            currentPage={currentPage - 1}
            enlargeActive={true}
          />
          {currentTodos && currentTodos.length > 0 ? (
            <View style={{margin: 5}} row flex centerH>
              {/* <Button style={{backgroundColor:'gray'}} label={'anterior'} onPress={() => {}} disabled={false} /> */}
              <TouchableOpacity
                onPress={() => {
                  setCurrentPage(currentPage - 1);
                }}
                disabled={currentPage === 1}>
                <Icon
                  name={'arrow-left-bold-box'}
                  size={30}
                  color="#c06500"
                  style={styles.icon}
                />
              </TouchableOpacity>

              <Text style={{color: 'gray'}}>{currentPage}</Text>
              <TouchableOpacity
                onPress={() => {
                  setCurrentPage(currentPage + 1);
                }}
                disabled={
                  currentPage === Math.ceil(QuantityItems / todosPerPage)
                }>
                <Icon
                  name={'arrow-right-bold-box'}
                  size={30}
                  color="#c06500"
                  style={styles.icon}
                />
              </TouchableOpacity>
              {/* <Button  style={{backgroundColor:'gray',with:20}} label={'Siguiente'} onPress={() => {}} disabled={false} /> */}
            </View>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
};

export default React.memo(ListProduct);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
    flexWrap: 'wrap',
    height: 270,
    width: '100%',
  },
  card: {
    flex: 1,
    borderRadius: 10,
    margin: 5,
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    paddingHorizontal: 10,
    color: '#5d5c6a',
  },
  price: {
    fontSize: 14,
    color: '#999',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#3f51b5',
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'center',
    elevation: 0,
    borderColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#EAEAEA',
    borderRadius: 5,
    margin: 20,
  },
  input: {
    flex: 1,
    padding: 10,
    color: '#333',
    backgroundColor: '#fff',
  },
  //card
  containerCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 3,
    width: '45%',
    margin: '2%',
  },
  image: {
    width: '100%',
    height: 150,
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 1,
    color: 'black',
  },
  price: {
    fontSize: 16,
    marginBottom: 4,
    color: 'black',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    alignSelf: 'center',
  },
  quantityButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666666',
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 4,
    textAlign: 'center',
    width: 50,
    marginHorizontal: 10,
    color: 'gray',
  },
  addButton: {
    backgroundColor: 'orange',
    borderRadius: 4,
    padding: 8,
    width: '100%',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
