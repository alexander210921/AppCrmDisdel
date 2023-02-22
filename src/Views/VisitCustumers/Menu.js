import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {ScrollView, View,StyleSheet} from 'react-native';
import {Card,LoaderScreen,Text} from 'react-native-ui-lib';
import StylesWrapper from '../../Styles/Wrapers';
import { FunctionGetCurrentVisit,LoadGetVisitActuality } from '../../Api/Customers/ApiCustumer';
import { useDispatch,useSelector } from 'react-redux';
import { Alert } from 'react-native/Libraries/Alert/Alert';
import { GetGeolocation } from '../../lib/Permissions/Geolocation';
//this component render options create of view route
export const MenuVisit = () => {
    const navigator = useNavigation();
    const dispatch  = useDispatch();
    const Rol = useSelector(state => state.rol.RolSelect);
    const Customer = useSelector(state=>state.Customer);
  const HandleMarkerSelectCardVisit = () => {    
    navigator.navigate("SearchCustomer");
  };
  const GoVisitCreated=async()=>{
    const coords = await GetGeolocation();
    if (!coords.Status) {
        Alert.alert(coords.Message);
        return;
    }
   dispatch(LoadGetVisitActuality(true));
   FunctionGetCurrentVisit(Rol[0].IdRelacion,dispatch,true,navigator);
    //navigator.navigate("VisitCreated");
  }
  return (
    <ScrollView style={StylesWrapper.secondWrapper}>
      <View style={StylesWrapper.wraper}>
        {Customer.loadGetCurrentVisit?
        <LoaderScreen message="cargando..." overlay ></LoaderScreen>
        :null}
        
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
