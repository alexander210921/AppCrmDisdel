import React, {useEffect, useState,useMemo} from 'react';
import {
  FlatList,  
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,  
  TextInput
} from 'react-native';
import {
  View,
  Text,  
  Button,
  TextField,
  LoaderScreen,
  PageControl,
  Colors
} from 'react-native-ui-lib';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Iconv2 from 'react-native-vector-icons/MaterialIcons';
import ReadCodeCamera from '../../Views/Count/ReadCodeCamera';
import ModalComponent from '../Modal/ModalComponent';
import { AlertConditional } from '../TextAlert/AlertConditional';
import { ChangePackingLineOrder, getPedidoByDocEntry } from '../../Api/Documents/ApiDocuments';
import { useNavigation } from '@react-navigation/native';
import { GetListProductByCompany, SaveProductChange, SaveProductsByCompany } from '../../Api/Products/ApiProduct';
import { useDispatch, useSelector } from 'react-redux';
import { ActualizarChequeoDocumentos } from '../../Api/Traking/ApiTraking';
const CardCarousel = ({content,scrollToTop}) => {
  const [ListProducts, setListProducts] = useState([]);
  const [ListMap, setListMap] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleItems, setModalVisibleItems] = useState(false);
  const [ProductDetailEdit,setProductEdit] = useState(null);
  const [itemSelectForActions,setItemSelectForAction] = useState(null);
  const DataProductChange = useSelector(state => state.Product);
  const [loadData,setLoadData] = useState(false);
  //control to edit order
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [packaging, setPackaging] = useState('individual');
  const [quantity, setquantity] = useState('');
  const [loadGetProduct, setLoadGetProduct] = useState(false);
  const navigation = useNavigation();
  const GetListProducts = useSelector(state => state.Product.ListProductCompany);
  const company = useSelector(state => state.company.CompanySelected);
  const dispatch = useDispatch();
  const DocumentCheckerSelected = useSelector(state => state.Product);
  const [optionsItem, setOptionsItem] = useState([
    { id: 1, label: 'Reemplazar Producto' },
    { id: 2, label: 'Cambiar base' },
  ]);
  //paginationControl 
  const [filteredItems, setFilteredItems] = useState(content);
  const [currentPage, setCurrentPage] = useState(1);
  const [todosPerPage, settodosPerPage] = useState(6);
  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const [QuantityItems, setQuantityItems] = useState(0);
  const [searchText, setSearchText] = useState('');

  useEffect(()=>{
    setQuantityItems(content?.length);
   // setFilteredItems(content);
  },[])
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
      setFilteredItems(content);
      setQuantityItems(content?.length);
      setCurrentPage(1);
      return;
    }
    const filtered = content.filter(
      item =>
        item?.Descripcion.toLowerCase().includes(searchText.toLowerCase()) ||
        item?.Codigo.toLowerCase().includes(searchText.toLowerCase()),
    );
    setFilteredItems(filtered);
    setQuantityItems(filtered.length);
    setCurrentPage(1);
  };
  const handlePriceChange = value => {
    setPrice(value);
  };

  const handleDescriptionChange = value => {
    setDescription(value);
  };
  const handleSetProductEdit=value=>{
    setProductEdit(value);
  }
  const handleQuantityChange = value => {
    setquantity(value);
  };

  const handlePackagingChange = value => {
    setPackaging(value);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const HandleCreateDocument = async()=>{
    //ini firm document
    try{
    setLoadData(true);
    const document =  DataProductChange?.DataDocumentSelect;
    const documentDocEntry = await getPedidoByDocEntry(company?.NombreDB,document.DocEntry);
    let ListTrackingForUpdate = [];
    ListTrackingForUpdate.push(DocumentCheckerSelected.DataDocumentSelect);
    ListTrackingForUpdate = ListTrackingForUpdate.map(x=>{
      x.EstadoChequeo = "Finalizado";
      return x;
    });    
    //console.log("aaa",ListTrackingForUpdate);
    const resultUpdateStatusCheck = await ActualizarChequeoDocumentos(ListTrackingForUpdate);
    if(documentDocEntry==null || resultUpdateStatusCheck==null || !resultUpdateStatusCheck?.Resultado    ){
      Alert.alert("",""+resultUpdateStatusCheck?.Mensaje);
      return;
    }
    navigation.navigate("FormularioFacturacion",documentDocEntry);
    }finally{
      setLoadData(false);  
    }     
  }

  const ChangePackingItem=()=>{
    const data = {
      Encabezado:{
        DocEntry:0,
        IdUsuario:0,
        BaseDatos:'',
        Comentario:'',
        TipoUpdate:'CambiarBase'
      }
    }
    const StatusUpdate = ChangePackingLineOrder(data);
    Alert.alert("",""+StatusUpdate?.Mensaje);
  }
  const AlertChangePacking=()=>{
    AlertConditional(ChangePackingItem,function(){},"","¿Está seguro de cambiar el empaque?");
  }

  useState(() => {
    const itemsMap = {};
    content.forEach((item, index) => {
      item.NumLine = index;
      itemsMap[index] = item;
    });
    setListMap(itemsMap);
    setListProducts(Object.values(itemsMap));
  }, [content]);

  const HandleChangeStatus = index => {
    ListMap[index].isChecked = !ListMap[index].isChecked;
    setListMap(ListMap);
    setListProducts(Object.values(ListMap));
  };
  const EditOrder = (indexProduct) => {        
    handleSetProductEdit(ListMap[indexProduct]);
    handlePriceChange(ListMap[indexProduct].PrecioIVA.toString());
    handleDescriptionChange(ListMap[indexProduct].Descripcion);
    handleQuantityChange(ListMap[indexProduct].Cantidad.toString());
    //console.log(ListMap[indexProduct].PrecioIVA);
    openModal();
  };

  const handleOptionSelect = async (option) => {
    // Aquí puedes realizar la acción correspondiente según la opción seleccionada
  
    switch(option.id){
      case 1:{
        try {
          if(loadGetProduct){
            return;
          }
          if (GetListProducts && GetListProducts.length == 0) {
            setLoadGetProduct(true);
            const GetListProducts = await GetListProductByCompany(company?.NombreDB);
            if (GetListProducts == null || GetListProducts?.length == 0) {
              Alert.alert('', 'No se encontraron productos');
              return;
            }
            dispatch(SaveProductsByCompany(GetListProducts));            
          }
          const objet={
            operation:"ChangeItem"
          }          
          dispatch(SaveProductChange(itemSelectForActions));
          navigation.navigate('ListProductHome',objet);
        } finally {
          setLoadGetProduct(false);
        }
       // navigation.navigate("ListProductHome");
        //reemplazo de item
        break;
      }
      case 2 :{
        //cambio de base
        break;
      }
    }
    setModalVisibleItems(false);
  };

  const modalContent = (
    <View style={{width: '80%'}}>
      <Text>Editar Pedido</Text>
      <Text text60 marginB-10>
        Precio
      </Text>
      <TextField
        placeholder="Ingrese el precio"
        keyboardType="numeric"
        onChangeText={handlePriceChange}
        value={price}
        marginB-20
      />
      <Text text60 marginB-10>
        Cantidad
      </Text>
      <TextField
        placeholder="Ingrese la cantidad"
        keyboardType="numeric"
        onChangeText={handleQuantityChange}
        value={quantity}
        marginB-20
      />

      <Text text60 marginB-10>
        Descripción
      </Text>
      <TextField
        placeholder="Ingrese la descripción"
        onChangeText={handleDescriptionChange}
        value={description}
        marginB-20
      />
      {/* {ProductDetailEdit?.EditableBase=="SI"?
  <RadioGroup
  initialValue={packaging}
  onValueChange={handlePackagingChange}
  marginB-20>
  <RadioButton color="gray" value="individual" label="Individual" />
  <RadioButton color="gray" value="empaquetado" label="Empaquetado" />
</RadioGroup>
      :null} */}
  
    

      <Button
      backgroundColor="black"
      label="Guardar"
        onPress={() => {
          console.log('Precio:', price);
          console.log('Descripción:', description);
          console.log('Empaque:', packaging);
        }}
      />
    </View>
  );

  const onReadCodeCamera = codeValue => {
    let hasSearchSucess = false;
    let updateStateItem = ListProducts.map(item => {
      if (item.CodigoBarras == codeValue) {
        item.isChecked = true;
        hasSearchSucess = true;
      }
      return item;
    });
    setListProducts(updateStateItem);
    if (!hasSearchSucess) {
      Alert.alert('', 'Este producto no está dentro del pedido');
    }
  };
  const renderItems = ({item}) => {
    return (
      <View onPress={() => {}} style={styles.containerCard}>
        {item?.isChecked ? (
          <Icon
            name={'check-underline-circle'}
            size={30}
            color="green"
            style={styles.icon}
          />
        ) : null}
        <Text style={{color: 'gray'}}>{item?.Codigo}</Text>
        <Text style={styles.description}>{item.Descripcion}</Text>
        <Text style={styles.price}>Cantidad: {item.Cantidad}</Text>
        <Text style={styles.price}> {item?.Empaque}</Text>
        <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
          <TouchableOpacity>
            <Button
              onPress={() => {
                HandleChangeStatus(item.NumLine);
              }}
              style={{
                margin: '3%',
                backgroundColor: item?.isChecked ? 'green' : 'orange',
              }}
              label={item?.isChecked ? 'Chequeado' : 'Pendiente'}></Button>
          </TouchableOpacity>
          <TouchableOpacity>
            <Button
              onPress={()=>{
                EditOrder(item.NumLine);
              }}
              style={{backgroundColor: 'gray'}}
              label="Editar"></Button>
          </TouchableOpacity>
          {true?
           <TouchableOpacity onPress={()=>{
            setItemSelectForAction(item);
            if(item?.Codigo!=itemSelectForActions?.Codigo){
              setModalVisibleItems(true);
            }else{
              setModalVisibleItems(!modalVisibleItems);
            }

            }} style={{margin:'6%'}}>
           <Iconv2
             name={'settings'}
             size={25}
             color="black"
             style={styles.icon}
           />
           </TouchableOpacity>
          :null}

{modalVisibleItems && item?.Codigo ==itemSelectForActions?.Codigo ? 
<View style={{elevation: 20,backgroundColor:'#f5f5f5',zIndex: 20, shadowOpacity: 0.2,
    shadowRadius: 4,marginBottom:'1%'}}>
      {loadGetProduct ? 
        <LoaderScreen color="gray"></LoaderScreen>
      :  <FlatList
      data={optionsItem}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        
        <TouchableOpacity style={{margin:'3%'}} onPress={() => handleOptionSelect(item)}>
          <Text>{item.label}</Text>
        </TouchableOpacity>
      )}
    />}
            </View>
:null}
        </View>
      </View>
    );
  };

  return (
    <ScrollView>
      <ReadCodeCamera onReadCodeCamera={onReadCodeCamera}></ReadCodeCamera>
      <View style={{padding:'4%'}}>
      <TextInput
            style={styles.input}
            placeholder={'Buscar Producto'}
            autoFocus={false}            
            onChangeText={handleSearch}
            onBlur={onSearch}
            placeholderTextColor={'#b3b2b7'}
          />
      </View>
      <FlatList
        data={currentTodos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItems}
        //onEndReached={fetchData}
        onEndReachedThreshold={0.7}
        numColumns={2}
      />
      {loadData?
      <LoaderScreen color="black"></LoaderScreen>
      :
      <Button
        onPress={HandleCreateDocument}
        disabled={DocumentCheckerSelected?.DataDocumentSelect?.EstadoChequeo==2? false: !ListProducts.every(item => item.isChecked == true) }
        style={DocumentCheckerSelected?.DataDocumentSelect?.EstadoChequeo==2? styles.ButtonFinaliceProcces: !ListProducts.every(item => item.isChecked == true) ?styles.DisableButton :styles.ButtonFinaliceProcces}>
        <Text style={{color: 'white'}}>Dar por finalizado</Text>
      </Button>
      }      
      {/* {viewForm ?
        <CheckInIndex></CheckInIndex>
       :null} */}
      <ModalComponent
        visible={modalVisible}
        closeModal={closeModal}
        content={modalContent}></ModalComponent>

        {/* control button to navigate  */}

        <View>
          <PageControl
            size={12}
            spacing={8}
            inactiveColor={Colors.grey1}
            color={Colors.grey1}
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
                  if (scrollToTop) {
                    scrollToTop();
                  }
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
                  color="#c06500"
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>






    </ScrollView>
  );
};
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
  ButtonFinaliceProcces: {
    backgroundColor: 'black',
    width: '40%',
    borderRadius: 0,
    marginLeft: '3%',
    marginTop: '3%',
  },
  DisableButton:{
    backgroundColor: '#ccc',
    width: '40%',
    borderRadius: 0,
    marginLeft: '3%',
    marginTop: '3%',
  }
});
export default CardCarousel;
