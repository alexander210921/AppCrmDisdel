import {useState}from'react'
import {ScrollView, StyleSheet, Alert,TextInput} from 'react-native';
import {Text, View, Button,LoaderScreen, TextArea} from 'react-native-ui-lib';
import {useDispatch, useSelector} from 'react-redux';
import StylesWrapper from '../../Styles/Wrapers';
import {
  FunctionUpdateVisit,
  LoadUpdateVisit,
} from '../../Api/Customers/ApiCustumer';
import {GetGeolocation} from '../../lib/Permissions/Geolocation';
import { useNavigation } from '@react-navigation/native';

const DetailVisit = () => {
  const data = useSelector(state => state.Customer.VisitDetailSelected);
  const isLoadUpadateVisit = useSelector(state=>state.Customer);
  const Rol = useSelector(state => state.rol.RolSelect);
  const [comentary, setComentary] = useState(data.Comentario? data.Comentario:'');
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const HandleSetComentary=(e)=>{
    setComentary(e.value);
  }
  const HandleUpdateVisit = async typeOption => {
    dispatch(LoadUpdateVisit(true));
    const coords = await GetGeolocation();
    if (!coords.Status) {
      Alert.alert(coords.Message);
      return;
    }    
    const visit = {
      IdRelacion: Rol[0].IdRelacion,
      IdRegistro: data.IdRegistro,
      Proceso: '',
      LatitudeDestino: coords.Data.coords.latitude,
      LongitudeDestino: coords.Data.coords.longitude,
      Comentario : comentary
    };
    switch (typeOption) {
      case 1: {
        visit.Proceso = 'Finalizado';
        visit.LatitudeDestino = 0;
        visit.longitude = 0;
        FunctionUpdateVisit(visit, dispatch,navigation);
        //FunctionUpdateAddressCoords();
        break;
      }
      case 2: {
        visit.Proceso = 'Cancelado';
        FunctionUpdateVisit(visit, dispatch,navigation);
        break;
      }
      case 3:{
        visit.Proceso = 'EnProceso';
        FunctionUpdateVisit(visit, dispatch,navigation);
      }
    }
  };
  return (
    <ScrollView style={StylesWrapper.secondWrapper}>
      <View style={StylesWrapper.wraper}>
        <Text>{data.CardCode}</Text>
        <Text>{data.CardName}</Text>
        <Text style={{fontSize: 12, color: 'gray'}}>
          {data.ShipToCode ? data.ShipToCode : ''}
        </Text>
        {isLoadUpadateVisit.loadUpdateVisit?<LoaderScreen color="black" message="Cargando" overlay></LoaderScreen>:null}
        <Button
          onPress={() => {
            HandleUpdateVisit(1);
          }}
          style={styles.button1}>
          <Text style={{fontSize: 9, color: 'white'}}> Finalizar</Text>
        </Button>

        <Button
          onPress={() => {
            HandleUpdateVisit(3);
          }}
          style={styles.button3}>
          <Text style={{fontSize: 9, color: 'white'}}> Llegando  </Text>
        </Button>

        <Button
          onPress={() => {
            HandleUpdateVisit(2);
          }}
          style={styles.button}>
          <Text style={{fontSize: 9, color: 'white'}}> Cancelar</Text>
        </Button>

        <View flex centerH>
          <View style={styles.cardinfo1}>
            <TextInput onChangeText={HandleSetComentary} placeholder='Comentario' multiline={true} numberOfLines={4} value={comentary}  ></TextInput>
          </View>
          <View style={styles.cardinfo2}>
            <Text>{data.Titulo}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
export default DetailVisit;

const styles = StyleSheet.create({
  cardinfo1: {
    backgroundColor: '#f3c1c5',
    width: '80%',
    height: '10%',
    marginTop: '1%',
  },
  cardinfo2: {
    backgroundColor: '#e1f0ff',
    width: '80%',
    height: '10%',
    marginTop: '1%',
  },
  button: {
    width: 40,
    backgroundColor: '#e8bd18',
    color: '#fefefe',
    margin: '1%',
  },
  button1: {
    width: 40,
    backgroundColor: 'black',
    color: '#fefefe',
    margin: '1%',
  },
  button3:{
    width: 40,
    backgroundColor: '#6f6971',
    color: '#fefefe',
    margin: '1%',
  }
});
