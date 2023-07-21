import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button, Checkbox, Chip, LoaderScreen} from 'react-native-ui-lib';
import {useDispatch, useSelector} from 'react-redux';
import {
  ActualizarChequeoDocumentos,
  GetCheckersByCompany,
  GetDetailRoute,
  IniciarRutaporIdTracking,
  SaveCheckers,
  SaveDocumentsAsigned,
} from '../../Api/Traking/ApiTraking';
import SearchBar from '../../Components/SearchBar';
import {Picker} from '@react-native-picker/picker';
import ModalComponent from '../../Components/Modal/ModalComponent';
const TrackingDocumentsAsigned = () => {
  const documents = useSelector(state => state.Tracking.DocumentAsigned);
  const [DocumentsList, setDocumentsList] = useState([]);
  const [checkedItems, setCheckedItems] = React.useState([]);
  const [isMarkerAll, setIsMarkerAll] = useState(true);
  const user = useSelector(state => state.login.user);
  const [load, setLoader] = React.useState(false);
  const company = useSelector(state => state.company.CompanySelected);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [loadGetDocuments, setLoadGetDocuments] = useState(false);
  const [detailHeaderDoc, setDetailHeaderDoc] = useState(null);
  const listCheck = useSelector(state=>state.Tracking.ListChecker);
  const [stateChekers,setStateCheckers] = useState([]);
  const [checkerSelected,setCheckSelected] = useState(null);
  const [loadGetChecked,setLoadGetChecked] = useState(false);
  const dispatch = useDispatch();

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  const toggleAccordion = () => {
    setIsCollapsed(!isCollapsed);
  };
  //console.log("Documentos de lista pendiente tracking = > ",DocumentsList);
  const HandleSendCheckDocuments=async()=>{
    //console.log(checkerSelected);
    let nombreChequeador = listCheck.filter(x=>x.code ==checkerSelected)[0].name;
    const filterItems = documents.filter(data => {
      if (checkedItems.includes(data.EntityID)) {
        data.IdOhemChequeador = checkerSelected;      
        data.NombreChequeador = nombreChequeador;
        data.EstadoChequeo = "EnProceso";
        return data;
      }
    });
    //console.log("filtrando",filterItems);
    console.log(filterItems);
    const result = await ActualizarChequeoDocumentos(filterItems);
    if (result == null) {
      Alert.alert('', 'Ocurrió un error intente nuevamente');
      return;
    }
    Alert.alert('', result.Mensaje);  
    if (!result.Resultado) {      
      return;
    }
    closeModal();
  }
  useEffect(() => {
      if(checkerSelected ==null &&listCheck.length>0 ){
        setCheckSelected(listCheck[0].code);
      }                                          
  }, [listCheck]); // Solo se vuelve a ejecutar si count cambia
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
  const HandleCheckDocuments=async()=>{
    //obtener a los chequeadores
    try{
      if (checkedItems.length == 0) {
        Alert.alert('', 'Seleccione al menos un item');
        return;
      }
      setLoadGetChecked(true);
      let Checkers  = listCheck;
      if(Checkers == null ||Checkers.length ==0 ){
        const ListCheckers = await GetCheckersByCompany(company?.EntityID);
        if(ListCheckers ==null){
          Alert.alert("","no se pudo obtener a los chequeadores, intenta nuevamente");
          return;
        }
        let newListCheck = ListCheckers.map(item=>{
          return  {
            name:item["<Nombre>k__BackingField"]+" "+item["<Apellido>k__BackingField"],
            code:item["<CodeOhem>k__BackingField"]
          }
        });
        Checkers = newListCheck;
      }
      dispatch(SaveCheckers(Checkers));
      setStateCheckers(Checkers); 
      openModal();  

    }finally{
      setLoadGetChecked(false);  
    }   
  }
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
        item.DocNum.toString()
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        item.CardCode.toString()
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        item.CardName.toString()
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        item.DocTotal.toString()
          .toLowerCase()
          .includes(searchText.toLowerCase()),
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
          data.Latitud = 0;
          data.Longitud = 0;
          data.TipoDoc = data.TipoDocAux;
          data.Proceso = 'RutaIniciada';
          return data;
        }
      });
      //console.log("filtrando",filterItems);
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
      setCheckedItems([]);
      Alert.alert('', 'Proceso exitoso');
    } finally {
      setLoader(false);
    }
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
  const modalContent = (
    <View
      style={{width:'80%'}}
    >
      <Text style={{color:'gray'}}>Seleccione su chequeador</Text>
    {/* open Picker to render checkers */}
    {/* <TextInput keyboardType='default'></TextInput> */}
    {stateChekers!=null && stateChekers.length>0 ? 
           <Picker
              
             selectedValue={checkerSelected}
             onValueChange={itemValue => {
              //console.log(itemValue);
               setCheckSelected(itemValue);
              // console.log(itemValue)                  
             }}>       
               {stateChekers.map(item=>(
                    <Picker.Item
                    key={item.code}
                    label={item.name}
                    value={item.code}
                    style={{
                        color: 'black',
                        backgroundColor:'#fff'
                      }}
                  />
               ))}
           </Picker>        
 :null}
<Button onPress={HandleSendCheckDocuments} style={{backgroundColor:'#000'}}  >    
  <Text style={{color: '#fff'}}>Aceptar</Text>
</Button>
</View>
  );
  const Card = ({
    id,
    title,
    description,
    isChecked,
    EntityiD,
    typeDoc,
    docNum = 0,
    Quantity = 0,
    EstadoChequeo,
    Chequeador,
    fecha
  }) => {
    let color = "yellow";
    let estadoDescription ="Sin Accion";
    if(EstadoChequeo ==1){
      color = "#fcc861"
      estadoDescription = "En Proceso";
    }
    else if(EstadoChequeo ==2){
      color = "green"
      estadoDescription = "Finalizado";
    }
    return (
      <View>
        <TouchableOpacity
          style={{borderWidth: 0, shadowColor: '#ffff'}}
          onPress={() => {
            getDetail(company?.NombreDB, EntityiD, typeDoc, docNum, id);
          }}>
          <View style={styles.card}>
            <View style={styles.checkboxContainer}>
              <Checkbox
                value={checkedItems.includes(id)}
                onValueChange={() => {
                  handleCheckChange(id);
                }}
                style={styles.checkbox}
                color="green"
              />
              <Text style={styles.text}>{title}</Text>
            </View>
            <Text style={styles.textSecundary}>{description}</Text>
            <Text style={styles.textSecundary}>
              {typeDoc} / Q. {Quantity}
            </Text>
            <Text style={{...styles.textSecundary}}>
                Estado Chequeo: <Text style={{backgroundColor:color}} >{estadoDescription}  { Chequeador ? ' / Por: '+Chequeador:''}</Text> 
            </Text>
            
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
            <View style={{width: '80%'}}>
              <SearchBar
                onSubmit={Search}
                placeholder="Buscar Documento"></SearchBar>
              <Text>Id tracking / No. Factura</Text>
            </View>
            <View style={{width: '20%'}}>
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
            </View>
          </View>

          {DocumentsList.map((item, index) => (
            <Card
              key={index}
              title={item.EntityID + ' / ' + item.DocNum}
              description={item.CardCode + ' / ' + item.CardName}
              isChecked={item.Check}
              id={item.EntityID}
              EntityiD={item.DocEntry}
              typeDoc={item?.TipoDocAux}
              docNum={item?.DocNum}
              Quantity={item?.DocTotal}
              EstadoChequeo = {item?.EstadoChequeo}
              Chequeador = {item?.NombreChequeador}
              fecha={item?.FechaCreacion}
            />
          ))}

     
          {DocumentsList.length > 0 ? (
            <TouchableOpacity
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignContent: 'center',
              }}>
              {load || loadGetChecked? (
                <LoaderScreen color="black"></LoaderScreen>
              ) : (
                <View style={{display:'flex',flexDirection:'row',flex:1,flexWrap:'wrap',justifyContent:'center'}}>

<Button
                    onPress={HandleCheckDocuments}
                    style={{backgroundColor: '#77dd', width: '40%'}}>
                    <Text style={{color: '#fff'}}>
                      {' '}
                      Chequear ({checkedItems.length} )
                    </Text>
                  </Button>


                  <Button
                    onPress={AddRouteDocuments}
                    style={{backgroundColor: '#000', width: '40%'}}>
                    <Text style={{color: '#fff'}}>
                      {' '}
                      Aceptar {checkedItems.length} Seleccionados{' '}
                    </Text>
                  </Button>
                </View>
              )}
            </TouchableOpacity>
          ) : null}
  <ModalComponent visible={modalVisible} closeModal={closeModal}   content={modalContent}    ></ModalComponent>
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
export default TrackingDocumentsAsigned;
