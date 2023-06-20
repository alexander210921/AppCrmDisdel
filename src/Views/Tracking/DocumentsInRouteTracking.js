import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button, Checkbox, Chip, LoaderScreen} from 'react-native-ui-lib';
import {useDispatch, useSelector} from 'react-redux';
import {
  GetDetailDocument,
  GetDetailRoute,
  IniciarRutaporIdTracking,
  SaveDocumentsAsigned,
  SaveDocumentsRoute,
  UpdateStateTracking,
} from '../../Api/Traking/ApiTraking';
import SearchBar from '../../Components/SearchBar';
import {useNavigation} from '@react-navigation/native';
import {AlertConditional} from '../../Components/TextAlert/AlertConditional';
import {Console} from 'console';

const TrackingDocumentInRoute = () => {
  const documents = useSelector(state => state.Tracking.DocumentAcepted);
  const [DocumentsList, setDocumentsList] = useState([]);
  const [checkedItems, setCheckedItems] = React.useState([]);
  const [isMarkerAll, setIsMarkerAll] = useState(true);
  const user = useSelector(state => state.login.user);
  const [load, setLoader] = React.useState(false);
  const company = useSelector(state => state.company.CompanySelected);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [selectedCardIndexForInitRoute, setSelectedCardIndexForInitRoute] = useState(null);
  const [loadGetDocuments, setLoadGetDocuments] = useState(false);
  const [detailHeaderDoc, setDetailHeaderDoc] = useState(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleAccordion = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleCheckChange = itemId => {
    const updatedCheckedItems = [...checkedItems];
    const itemIndex = updatedCheckedItems.indexOf(itemId);
    if (itemIndex === -1) {
      updatedCheckedItems.push(itemId);
    } else {
      updatedCheckedItems.splice(itemIndex, 1);
    }
    setCheckedItems(updatedCheckedItems);
    if (updatedCheckedItems.length === documents.length) {
      setIsMarkerAll(false);
    }
    if (updatedCheckedItems.length === 0) {
      setIsMarkerAll(true);
    }
  };

  const handleSelectAll = () => {
    const allItemIds = DocumentsList.map(item => item.EntityID);
    setCheckedItems(allItemIds);
    setIsMarkerAll(!isMarkerAll);
  };

  useEffect(() => {
    setDocumentsList(documents);
  }, [documents]);

  const UnSelectAll = () => {
    setCheckedItems([]);
    setIsMarkerAll(!isMarkerAll);
  };

  const Search = searchText => {
    if (searchText == null || searchText === '') {
      setDocumentsList(documents);
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
    setDocumentsList(filtered);
  };

  const AddRouteDocuments = async () => {
    try {
      setLoader(true);
      if (checkedItems.length == 0) {
        Alert.alert('', 'Seleccione al menos un item');
        return;
      }
      const filterItems = documents.filter(data => {
        if (checkedItems.includes(data.EntityID)) {
          data.Autor = user.Datos.NombreCompleto;
          return data;
        }
      });
      const result = await IniciarRutaporIdTracking(filterItems);
      if (result == null) {
        Alert.alert('', 'Ocurrió un error intente nuevamente');
        return;
      }
      if (!result.Resultado) {
        Alert.alert('', result.Mensaje);
        return;
      }
      const deleteData = documents.filter(
        data => !checkedItems.includes(data.EntityID),
      );
      dispatch(SaveDocumentsAsigned(deleteData));
      Alert.alert('', 'Proceso exitoso');
    } finally {
      setLoader(false);
    }
  };
  const InitRouteForDocument = (idTracking,docNum) => {
    Alert.alert(
      '',
      '¿Está seguro de marcar el inicio de ruta?, se notificará al cliente de su entrega en proceso',
      [
        {
          text: 'Aceptar',
          onPress: async () => {
            setSelectedCardIndexForInitRoute(docNum === selectedCardIndex ? null : docNum);
            try{
              if (!idTracking) {
                Alert.alert('', 'El id de tracking no es válido');
                return;
              }
              const dataTracking = {
                EntityID: idTracking,
                Proceso: 'RutaEnCurso',
              };
  
              setLoader(true);
              const infoRequeset = await UpdateStateTracking(dataTracking);
              if(!infoRequeset){
                Alert.alert("","Ocurrió un problema intenta de nuevo por favor");
                return;
              }
              if(infoRequeset.Resultado){
                 // add number of process
                 let DocumentsListUpdated = DocumentsList.map((item)=>{
                    if(item.EntityID ==idTracking){
                      item.Proceso = 7;
                    }
                    return item;
                 });
                 dispatch(SaveDocumentsRoute(DocumentsListUpdated));
              }
              Alert.alert("",""+infoRequeset?.Mensaje);                
            }finally{
              setLoader(false);
              setSelectedCardIndexForInitRoute(null);
            }
          
          },
        },
        {
          text: 'No',
          onPress: () => {
            // CancelPress();
          },
        },
      ],
    );
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
  const GoMarkerArriveDocument = async (NombreDB, DocEntry, TypeDoC) => {
    const detail = await GetDetailDocument(NombreDB, DocEntry, TypeDoC);
    if (detail == null) {
      Alert.alert('', 'Ocurrió un problema al obtener el detalle');
      return;
    }
    navigation.navigate('DeliveryComponent', detail);
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
    DocTotal=0
  }) => {    
    return (
      <View>
        <TouchableOpacity
          style={{borderWidth: 0, shadowColor: '#ffff'}}
          onPress={() => {
            getDetail(company?.NombreDB, EntityiD, typeDoc, docNum, id);
          }}>
          <View style={styles.card}>
            <View style={styles.checkboxContainer}>
              {/* <Checkbox
                  value={checkedItems.includes(id)}
                  onValueChange={() => {
                    handleCheckChange(id);
                  }}
                  style={styles.checkbox}
                  color="green"
                /> */}
              <Text style={styles.text}>{title}</Text>
            </View>
            <Text style={styles.textSecundary}>{description}</Text>
            <Text style={styles.textSecundary}>{typeDoc} Q. {DocTotal}</Text>
            {isArrive === 7 ? (
              <Button
                onPress={() => {
                  GoMarkerArriveDocument(company?.NombreDB, EntityiD, typeDoc);
                }}
                style={{backgroundColor: '#000', width: '40%'}}>
                <Text style={{color: '#fff'}}> Marcar Llegada </Text>
              </Button>
            ) : (
              <View>
                {selectedCardIndexForInitRoute ===docNum  && load ? <LoaderScreen></LoaderScreen>:
                    <Button 
                    onPress={() => {
                      InitRouteForDocument(id,docNum);
                    }}
                    style={{backgroundColor: '#3E5F8A', width: '40%'}}>
                    <Text style={{color: '#fff'}}>Iniciar Entrega</Text>
                  </Button>
                }

              </View>
          
            )}
          </View>
        </TouchableOpacity>
        {selectedCardIndex == docNum && !loadGetDocuments ? (
          <DetailDocument></DetailDocument>
        ) : null}

        {selectedCardIndex == docNum && loadGetDocuments ? (
          <Text style={{color: 'gray'}}> Cargando...</Text>
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
              <Text>Id tracking / No. Factura</Text>
            </View>
            {/* <View style={{width: '20%'}}>
                <TouchableOpacity
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    backgroundColor: 'orange',
                    marginTop: 3,
                  }}
                  onPress={isMarkerAll ? handleSelectAll : UnSelectAll}>
                  <View style={{height: 50}}>
                    <Text style={{height: 50, color: '#FFF'}}>
                      {' '}
                      {isMarkerAll
                        ? 'Marcar todo ( ' + DocumentsList.length + ' )'
                        : 'Desmarcar'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View> */}
          </View>
          {/* {load ? <LoaderScreen></LoaderScreen> : null} */}
          {DocumentsList.map((item, index) => (
            <Card
              key={index}
              title={item.EntityID + ' / ' + item.DocNum}
              description={item.CardCode +" / "+item.CardName}
              isChecked={item.Check}
              id={item.EntityID}
              EntityiD={item.DocEntry}
              typeDoc={item.TipoDoc === 4 ? 'Entrega' : 'Factura'}
              docNum={item.DocNum}
              isArrive={item.Proceso}
              DocTotal={item.DocTotal}
            />
          ))}
          {/* {DocumentsList.length > 0 ? (
              <TouchableOpacity
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignContent: 'center',
                }}>
                <Button
                  onPress={AddRouteDocuments}
                  style={{backgroundColor: '#000', width: '70%'}}>
                  <Text style={{color: '#fff'}}>
                    {' '}
                    Aceptar {checkedItems.length} Seleccionados{' '}
                  </Text>
                </Button>
              </TouchableOpacity>
            ) : null} */}
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
    // borderWidth:1,
    // borderColor:'red',
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
export default TrackingDocumentInRoute;
