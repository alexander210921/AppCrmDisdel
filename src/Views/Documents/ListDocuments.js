import React, {useState, useEffect} from 'react';
import {
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import {StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {PageControl, Colors, View, LoaderScreen} from 'react-native-ui-lib';
import { useSelector} from 'react-redux';
import {
  FunctionGetPDFPedidoPrice,
  FunctionGetPDFCotiNoPrice,
} from '../../Api/Customers/ApiCustumer';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
const ListProduct = ({ListData, scrollToTop, viewButtonControls = false}) => {
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
  const company = useSelector(state => state.company.CompanySelected);
  const [loadDowload, setLoadDowload] = useState(false);
  

  const OpenFile = path => {
    const shareOptions = {
      url: `file://${path}`,
    };
    Share.open(shareOptions)
      .then(() => {
        console.log('Archivo abierto con la galería correctamente');
      })
      .catch(error => {
        console.log('Error al abrir el archivo con la galería:', error);
      });
  };
  const DowloadPdf = async docEntry => {
    try {
      setLoadDowload(true);
      let pdf = null;
      if (ListData[0].tipoDoc == 'Pedido') {
        pdf = await FunctionGetPDFPedidoPrice(company.NombreDB, docEntry);
      } else if (ListData[0].tipoDoc == 'Cotizacion') {
        pdf = await FunctionGetPDFCotiNoPrice(company.NombreDB, docEntry);
      }
      if (pdf == null) {
        Alert.alert('', 'No se pudo obtener el PDF');
        return;
      }
      const pdfPath = `${RNFS.DownloadDirectoryPath}/${
        ListData[0].tipoDoc + ' ' + docEntry + '.pdf'
      }`;
      RNFS.exists(pdfPath).then(exist => {
        if (exist) {
          OpenFile(pdfPath);
        } else {
          RNFS.writeFile(pdfPath, pdf.ContentArray, 'base64');
          console.log('Descargado exitosamente');
          OpenFile(pdfPath);
        }
      });
    } catch (ex) {
      Alert.alert('', 'Ocurrió un error: ' + ex);
    } finally {
      setLoadDowload(false);
    }
  };
  let currentTodos =
    filteredItems.length > 0
      ? filteredItems.slice(indexOfFirstTodo, indexOfLastTodo)
      : [];
  useEffect(() => {
    setFilteredItems(ListData);
    setQuantityItems(ListData.length);
    currentTodos =
      ListData.length > 0
        ? ListData.slice(indexOfFirstTodo, indexOfLastTodo)
        : [];
  }, [ListData]);

  const handleSearch = text => {
    setSearchText(text);
  };
  const onSearch = () => {
    if (searchText == null || searchText === '') {
      setFilteredItems(ListData);
      setQuantityItems(ListData.length);
      return;
    }
    const filtered = ListData.filter(
      item =>
        item.DocNum.toString()
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        item.Total.toString().toLowerCase().includes(searchText.toLowerCase()),
    );
    setFilteredItems(filtered);
    setQuantityItems(filtered.length);
    setCurrentPage(1);
  };
  const handleQuantityChange = newQuantity => {
    setQuantity(newQuantity);
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
    nameIcon = 'shopping',
    onPress,
    item,
  }) => {
    return (
      <TouchableOpacity
        onPress={() => {
     
        }}
        style={styles.containerCard}>
        <Icon name={nameIcon} size={30} color="#38DB96" style={styles.icon} />
        <Text style={{color: 'gray'}}>No. {item.DocNum}</Text>
        <Text style={{color: 'gray'}}>{item.U_TipoEntrega}</Text>
        <Text style={styles.description}>{item.Comments}</Text>
        <Text style={styles.price}>Q. {item.Total}</Text>
        <Text style={styles.price}>{item.DocDate}</Text>
        {viewButtonControls ? (
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
            <TouchableOpacity
              onPress={() => handleQuantityChange(quantity + 1)}>
              <Text style={[styles.quantityButton, {marginLeft: 10}]}>
                {'+'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
        {true ? (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              DowloadPdf(item.DocEntry);
            }}>
            <Text style={styles.addButtonText}>Descargar PDF</Text>
          </TouchableOpacity>
        ) : null}
      </TouchableOpacity>
    );
  };
  return (
    <ScrollView>
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder={'Buscar en documentos abiertos'}
            autoFocus={true}
            //value={searchText}
            onChangeText={handleSearch}
            onBlur={onSearch}
            placeholderTextColor={'#b3b2b7'}
          />
        </View>
        {loadDowload ?<LoaderScreen color="black"></LoaderScreen> :null}
        <FlatList
          data={currentTodos}
          keyExtractor={item => item.DocNum.toString()}
          renderItem={({item}) => <Card item={item}></Card>}
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
              <TouchableOpacity
                onPress={() => {
                  setCurrentPage(currentPage - 1);
                  if (scrollToTop) {
                    scrollToTop();
                  }
                }}
                disabled={currentPage === 1}>
                <Icon
                  name={'arrow-left-bold-box'}
                  size={30}
                  color="black"
                  style={styles.icon}
                />
              </TouchableOpacity>

              <Text style={{color: 'gray'}}>{currentPage}</Text>
              <TouchableOpacity
                onPress={() => {
                  setCurrentPage(currentPage + 1);
                  if (scrollToTop) {
                    scrollToTop();
                  }
                }}
                disabled={
                  currentPage === Math.ceil(QuantityItems / todosPerPage)
                }>
                <Icon
                  name={'arrow-right-bold-box'}
                  size={30}
                  color="black"
                  style={styles.icon}
                />
              </TouchableOpacity>
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
    backgroundColor: 'red',
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
    borderWidth: 0,
    elevation: 2,
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
    backgroundColor: '#66D7D1',
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
