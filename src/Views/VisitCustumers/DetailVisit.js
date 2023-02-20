import {ScrollView, StyleSheet, Alert} from 'react-native';
import {Text, View, Button} from 'react-native-ui-lib';
import {useDispatch, useSelector} from 'react-redux';
import StylesWrapper from '../../Styles/Wrapers';
import {
  FunctionUpdateVisit,
  LoadUpdateVisit,
} from '../../Api/Customers/ApiCustumer';
import {GetGeolocation} from '../../lib/Permissions/Geolocation';

const DetailVisit = () => {
  const data = useSelector(state => state.Customer.VisitDetailSelected);
  const Rol = useSelector(state => state.rol.RolSelect);
  const dispatch = useDispatch();
  const HandleUpdateVisit = async typeOption => {
    const coords = await GetGeolocation();
    if (!coords.Status) {
      Alert.alert(coords.Message);
      return;
    }

    dispatch(LoadUpdateVisit(true));
    const visit = {
      IdRelacion: Rol[0].IdRelacion,
      IdRegistro: data.IdRegistro,
      Proceso: '',
      LatitudeDestino: coords.Data.coords.latitude,
      LongitudeDestino: coords.Data.coords.longitude,
    };
    switch (typeOption) {
      case 1: {
        visit.Proceso = 'Finalizado';
        FunctionUpdateVisit(visit, dispatch);
        //FunctionUpdateAddressCoords();
        break;
      }
      case 2: {
        visit.Proceso = 'Cerrado';
        FunctionUpdateVisit(visit, dispatch);
        break;
      }
    }
  };
  return (
    <ScrollView style={StylesWrapper.secondWrapper}>
      <View style={StylesWrapper.wraper}>
        <Text>{data.CardCode}</Text>
        <Text>{data.CardName}</Text>
        <Text style={{fontSize: 12, color: 'gray'}}>
          {data.DireccionDestino ? data.DireccionDestino : ''}
        </Text>
        <Button
          onPress={() => {
            HandleUpdateVisit(1);
          }}
          style={styles.button1}>
          <Text style={{fontSize: 9, color: 'white'}}> Finalizar</Text>
        </Button>

        <Button
          onPress={() => {
            HandleUpdateVisit(1);
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
            <Text>{data.Comentario}</Text>
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
    backgroundColor: '#dc9fa6',
    color: '#fefefe',
    margin: '1%',
  }
});
