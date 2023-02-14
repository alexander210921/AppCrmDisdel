import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {ScrollView, View,StyleSheet} from 'react-native';
import {Card,Text} from 'react-native-ui-lib';
import StylesWrapper from '../../Styles/Wrapers';
//this component render options create of view route
export const MenuVisit = () => {
    const navigator = useNavigation();
  const HandleMarkerSelectCardVisit = () => {
    navigator.navigate("SearchCustomer");
  };
  const GoVisitCreated=()=>{
    navigator.navigate("VisitCreated");
  }
  return (
    <ScrollView style={StylesWrapper.secondWrapper}>
      <View style={StylesWrapper.wraper}>
        <Card
          selected={true}
          selectionOptions={styles.selectOptionCard}
          elevation={20}
          flexS
          style={styles.card}
          flex
          center
          onPress={HandleMarkerSelectCardVisit}>
          <Text>Crear nueva visita</Text>
        </Card>

        <Card
          selected={true}
          selectionOptions={styles.selectOptionCard}
          elevation={20}
          flexS
          style={styles.card2}
          flex
          center
          onPress={GoVisitCreated}>
          <Text>Ver Visitas</Text>
        </Card>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  card: {
    height: '17%',
    borderColor: 'black',
    marginTop: '4%',
    backgroundColor: '#F3DBC3',
  },
  card2: {
    height: '17%',
    borderColor: 'black',
    marginTop: '4%',
    backgroundColor: '#F5F5DC',
  },
  selectOptionCard:{
    color:'#E4F9E5'
  }
});
