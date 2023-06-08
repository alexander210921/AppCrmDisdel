import {StyleSheet, ScrollView, View, Text, Alert, TouchableOpacity,Animated} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Checkbox, Chip, LoaderScreen} from 'react-native-ui-lib';
import {useDispatch, useSelector} from 'react-redux';
import {
  IniciarRutaporIdTracking,
  SaveDocumentsAsigned,
} from '../../Api/Traking/ApiTraking';
import SearchBar from '../../Components/SearchBar';

const TrackingDocumentsAsigned = () => {
  const documents = useSelector(state => state.Tracking.DocumentAsigned);
  const [DocumentsList, setDocumentsList] = useState([]);
  const [checkedItems, setCheckedItems] = React.useState([]);
  const [isMarkerAll,setIsMarkerAll] = useState(true);
  const user = useSelector(state => state.login.user);
  const [load, setLoader] = React.useState(false);
  const dispatch = useDispatch();
  const handleCheckChange = itemId => {
    const updatedCheckedItems = [...checkedItems];
    const itemIndex = updatedCheckedItems.indexOf(itemId);
    if (itemIndex === -1) {
      updatedCheckedItems.push(itemId);
    } else {
      updatedCheckedItems.splice(itemIndex, 1);
    }
    setCheckedItems(updatedCheckedItems);
    if(updatedCheckedItems.length === documents.length){
        setIsMarkerAll(false);
    }
    if(updatedCheckedItems.length ===0){
        setIsMarkerAll(true);
    }
  };

  const handleSelectAll = () => {
    const allItemIds = documents.map(item => item.EntityID);
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
    const filtered = documents.filter(item =>
      item.EntityID.toString().toLowerCase().includes(searchText.toLowerCase()),
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

  const Card = ({id, title, description, isChecked}) => {
    return (
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
      </View>
    );
  };

  return (
    <ScrollView>
      <View>
        <View style={styles.container}>
          {/* <Chip containerStyle={{width:'50%'}}  onPress={handleSelectAll} label="Marcar todos"></Chip>
          <Chip containerStyle={{width:'50%'}} onPress={UnSelectAll} label="Desmarcar todos"></Chip>
          <Chip
            containerStyle={{width:'50%'}}
            onPress={AddRouteDocuments}
            label={'Iniciar Ruta ' + checkedItems.length + ' items '}></Chip> */}
            <View style={styles.headerContainer}> 
            <View style={{width:'80%'}}>
            <SearchBar
                onSubmit={Search}
                placeholder="Buscar Documento"></SearchBar>
            </View>
            <View style={{width:'20%'}}>
            <TouchableOpacity style={{display:'flex',justifyContent:'center',backgroundColor:'orange',marginTop:3}} onPress={isMarkerAll?handleSelectAll:UnSelectAll} >
                <View style={{height:50}}>
                    <Text style={{height:50,color:'#FFF'}}> {isMarkerAll ? 'Marcar todo':'Desmarcar'}</Text>
                </View>                    
            </TouchableOpacity>
            </View>                                 
            </View>          
          {load ? <LoaderScreen></LoaderScreen> : null}
          {DocumentsList.map((item, index) => (
            <Card
              key={index}
              title={item.EntityID}
              description={item.Piloto}
              isChecked={item.Check}
              id={item.EntityID}
            />
          ))}
         
        {/* <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Botón</Text>
      </TouchableOpacity> */}
                 
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
    shadowColor: '#000000',
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
  headerContainer:{
    // borderWidth:1,
    // borderColor:'red',
    display:'flex',
    flexDirection:'row',    
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
});
export default TrackingDocumentsAsigned;
