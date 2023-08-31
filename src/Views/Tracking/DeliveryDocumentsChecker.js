import {
    StyleSheet,
    ScrollView,  
    Text,
    Alert,
    TouchableOpacity,
  } from 'react-native';
  import React, {useEffect, useState,useMemo,useRef} from 'react';
  import {Button,LoaderScreen,  PageControl,
    Colors,View} from 'react-native-ui-lib';
  import {useDispatch, useSelector} from 'react-redux';
  import {
    GetDetailDocument,
    GetDetailRoute,
  } from '../../Api/Traking/ApiTraking';
  import SearchBar from '../../Components/SearchBar';
  import {useNavigation} from '@react-navigation/native';
import { SaveDocumentChecker } from '../../Api/Products/ApiProduct';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

  
  const DeliveryDocumentsChecker = () => {
    const documents = useSelector(state => state.Tracking.DocumentsAssignedChecker);
    const [DocumentsList, setDocumentsList] = useState([]);
    const user = useSelector(state => state.login.user);
    const [load, setLoader] = React.useState(false);
    const company = useSelector(state => state.company.CompanySelected);
    const [selectedCardIndex, setSelectedCardIndex] = useState(null);
    const [loadGetDocuments, setLoadGetDocuments] = useState(false);
    const [detailHeaderDoc, setDetailHeaderDoc] = useState(null);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [isCollapsed, setIsCollapsed] = useState(true);
    //implement partition data to customize User Xperience 
    const [filteredItems, setFilteredItems] = useState(documents);
    const [currentPage, setCurrentPage] = useState(1);
    const [todosPerPage, settodosPerPage] = useState(6);
    const indexOfLastTodo = currentPage * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    const scrollViewRef = useRef();
    const [QuantityItems, setQuantityItems] = useState(documents?.length);
    const currentTodos = useMemo(() => {
      return filteredItems.length > 0
        ? filteredItems.slice(indexOfFirstTodo, indexOfLastTodo)
        : [];
    }, [currentPage, filteredItems]);
   
    const scrollToTop = () => {
       scrollViewRef?.current?.scrollTo({y: 0, animated: true});
     };
    //const [searchText, setSearchText] = useState('');
    const toggleAccordion = () => {
      setIsCollapsed(!isCollapsed);
    };
    useEffect(() => {  
      setDocumentsList(documents);
    }, [documents]);
  
    const Search = searchText => {
      if (searchText == null || searchText === '') {
        //setDocumentsList(documents);
        setFilteredItems(documents);
        setQuantityItems(documents?.length);
        return;
      }
      const filtered = documents.filter(
        item =>
          item.EntityID.toString()
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          item.DocNum.toString().toLowerCase().includes(searchText.toLowerCase())||
          item.CardCode.toString().toLowerCase().includes(searchText.toLowerCase())||
          item.CardName.toString().toLowerCase().includes(searchText.toLowerCase())||
          item.DocTotal.toString().toLowerCase().includes(searchText.toLowerCase())
      );
      //setDocumentsList(filtered);
      setFilteredItems(filtered);
      setQuantityItems(filtered?.length);
    };
  
    const DetailDocument = () => {
      return (
        <ScrollView>
          <View style={styles.containerDetail}>
            <View style={styles.rowDetail}>
              <Text style={styles.label}>Monto:</Text>
              <Text style={styles.value}>
                Q. {detailHeaderDoc?.TotalDocumento}
              </Text>
            </View>
            <View style={styles.rowDetail}>
              <Text style={styles.label}>Persona de contacto:</Text>
              <Text style={styles.value}>{detailHeaderDoc?.AuxPreguntarPor}</Text>
            </View>
            <View style={styles.rowDetail}>
              <Text style={styles.label}>Vendedor:</Text>
              <Text style={styles.value}>{detailHeaderDoc?.AuxVendedor}</Text>
            </View>
            <View style={styles.rowDetail}>
              <Text style={styles.label}>Número de documento:</Text>
              <Text style={styles.value}>{detailHeaderDoc?.DocNum}</Text>
            </View>
            <View style={styles.rowDetail}>
              <Text style={styles.label}>Cliente:</Text>
              <Text style={styles.value}>
                {detailHeaderDoc?.AuxNombreCliente}
              </Text>
            </View>
            <View style={styles.rowDetail}>
              <Text style={styles.label}>Dirección: </Text>
            </View>
            <Text style={styles.value}>{detailHeaderDoc?.AuxDestino} </Text>
            <Text style={styles.value}>{detailHeaderDoc?.AuxCalle} </Text>
          </View>
        </ScrollView>
      );
    };
    const GoMarkerArriveDocument = async (NombreDB, DocEntry, TypeDoC,id,dataTracking,docNum) => {
      try{
        if(load){
          return;
        }
        //setLoadGetDocuments(true);
        setSelectedCardIndex(docNum === selectedCardIndex ? null : docNum);

        setLoader(true);
        const detail = await GetDetailDocument(NombreDB, DocEntry, TypeDoC);
        if (detail == null) {
          Alert.alert('', 'Ocurrió un problema al obtener el detalle');
          return;
        }
        const infoTracking= {
          dataTracking:dataTracking,
          detail
        }
        navigation.navigate('HomePicking',infoTracking);
      }finally{
        setLoader(false);  
        setSelectedCardIndex(null);
        //setLoadGetDocuments(false);
      }     
      
    };
    //necesito un componente que contenga la opcion de registrar le entrega de un producto, si marca que todo ha sido correcto se muestra un boton de finalizacion, si marca que no, se pregunta porque motivo no se completo,  tambien puede darse el caso de que si se haya entregado pero no con la totalidad del producto, de ser el caso renderizar el listado de productos y que me permita marcar los items no entregados en react native, el componente debe ser dinamico y facil de usar para el usuario
    const getDetail = async (NombreDB, DocEntry, TypeDoC, docNum, idTracking) => {
      try {
        setLoadGetDocuments(true);
        setSelectedCardIndex(docNum === selectedCardIndex ? null : docNum);
        const object = {
          AuxNombreDB: NombreDB,
          DocNum: docNum,
          IdTracking: idTracking,
          DocEntry: DocEntry,
          TipoDoc: TypeDoC,
        };
        //const detail = await GetDetailDocument(NombreDB, DocEntry, TypeDoC);
        const detailRoute = await GetDetailRoute(object);
  
        if (detailRoute == null) {
          setSelectedCardIndex(null);
          Alert.alert('', 'Ocurrió un problema al mostrar el detalle');
          return;
        }
        setDetailHeaderDoc(detailRoute);
        toggleAccordion();
      } finally {
        setLoadGetDocuments(false);
      }
    };
    const Card = ({
      id,
      title,
      description,
      isChecked,
      EntityiD,
      typeDoc,
      docNum = 0,
      isArrive,
      DocTotal=0,
      AlldataTracking,
      Piloto = "",
      EditableBase  ="NO",
      data
    }) => {    
      return (
        <View>
          <TouchableOpacity
            style={{borderWidth: 0, shadowColor: '#ffff'}}
            onPress={() => {
              GoMarkerArriveDocument(company?.NombreDB, EntityiD, typeDoc,id,AlldataTracking,docNum);
              dispatch(SaveDocumentChecker(data));

            }}>
            <View style={styles.card}>
              <View style={styles.checkboxContainer}>
                <Text style={styles.text}>{title}</Text>
              </View>
              <Text style={styles.textSecundary}>{description}</Text>
              <Text style={styles.textSecundary}>{typeDoc} Q. {DocTotal}</Text>

              <Text style={styles.textSecundary}>Piloto:  {Piloto} </Text>
              <Text style={{backgroundColor: data.EstadoChequeo==2 ?'#ACDF87':'#FCC861'}} > {data.EstadoChequeo==2 ? "Chequeado pero pendiente de facturar":"Sin chequear"} </Text>
              <Button
                  onPress={() => {
                    //GoMarkerArriveDocument(company?.NombreDB, EntityiD, typeDoc,id,AlldataTracking);
                    getDetail(company?.NombreDB, EntityiD, typeDoc, docNum, id);
                  }}
                  style={{backgroundColor: '#000', width: '40%'}}>
                  <Text style={{color: '#fff'}}>Ver info. </Text>
                </Button>
            </View>
          </TouchableOpacity>
          {selectedCardIndex == docNum && !loadGetDocuments && !load? (
            <DetailDocument></DetailDocument>
          ) : null}
  
          {selectedCardIndex == docNum && loadGetDocuments  && !load? (
            <View>
                <Text style={{color: 'gray'}}> Cargando...</Text>
            </View>            
          ) : null}

        {selectedCardIndex == docNum   && load? (
            <View>
                <LoaderScreen color="black"></LoaderScreen>
                <Text style={{color: 'gray'}}> Cargando...</Text>
            </View>            
          ) : null}
        </View>
      );
    };
  
    return (
      <ScrollView>
        <View>
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <View style={{width: '100%'}}>
                <SearchBar
                  onSubmit={Search}
                  placeholder="Buscar Documento"></SearchBar>
              </View>
            </View>
            {currentTodos?.map((item, index) => (
              <Card
                key={index}
                title={item.EntityID + ' / ' + item.DocNum}
                description={item.CardCode +" / "+item.CardName}
                isChecked={item.Check}
                id={item.EntityID}
                EntityiD={item.DocEntry}
                typeDoc={item.TipoDocAux}
                docNum={item.DocNum}
                isArrive={item.Proceso}
                DocTotal={item.DocTotal}
                Piloto={item.Piloto}
                AlldataTracking={item}
                data={item}
              />
            ))}

            {/* control to page */}
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

          </View>
        </View>
      </ScrollView>
    );
  };
  const styles = StyleSheet.create({
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
      padding: 16,
      marginBottom: 10,
      shadowColor: '#FFFFFF',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    description: {
      fontSize: 16,
      color: '#888888',
    },
    container: {
      margin: '3%',
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    checkbox: {
      marginRight: 8,
    },
    text: {
      color: 'black',
    },
    textSecundary: {
      color: 'gray',
    },
    headerContainer: {
      display: 'flex',
      flexDirection: 'row',
    },
    button: {
      position: 'absolute',
      bottom: 20,
      alignSelf: 'center',
      backgroundColor: 'blue',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 10,
      elevation: 2,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    buttonContainer: {
      position: 'absolute',
      bottom: 20,
      alignSelf: 'center',
    },
  
    containerDetail: {
      backgroundColor: '#F5F5F5',
      padding: 16,
      borderRadius: 8,
      marginVertical: 8,
    },
    rowDetail: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    },
    value: {
      fontSize: 16,
      color: '#555',
    },
  });
  export default DeliveryDocumentsChecker;
  