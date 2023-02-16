import {ScrollView, StyleSheet} from 'react-native';
import {Text, View, Button} from 'react-native-ui-lib';
import {useSelector} from 'react-redux';
import StylesWrapper from '../../Styles/Wrapers';
const DetailVisit = () => {
  const data = useSelector(state => state.Customer.VisitDetailSelected);
  return (
    <ScrollView style={StylesWrapper.secondWrapper}>
      <View style={StylesWrapper.wraper}>
        <Text>{data.CardCode}</Text>
        <Text>{data.CardName}</Text>
        <Button style={styles.button1}>
          <Text style={{fontSize: 9, color: 'white'}}> Finalizar</Text>
        </Button>
        <Button style={styles.button}>
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
});
