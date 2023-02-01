import React, {useState, useEffect} from 'react';
import {View, Card} from 'react-native-ui-lib';
import StylesWrapper from '../../Styles/Wrapers';
import {StyleSheet} from 'react-native';
import stylesTitle from '../../Styles/Titles';
import {Text} from 'react-native';
import PhotoProfile from '../../Components/Header/HeaderAvatar';
import {useDispatch, useSelector} from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { BackHanlder } from '../../lib/ExitApp';
const HomeRouteVendors = () => {
  
  const [selectCard, setSelectCard] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  BackHanlder(navigation,dispatch);
  const HandleMarkerSelectCard = () => {
    setSelectCard(!selectCard);
    navigation.navigate("FormCreateRoute");    
  };
  const HandleGoToVisitCustumer=()=>{
    navigation.navigate("VisistCustomer");    
  }
  const User = useSelector(state => state.login.user);  
  useEffect(()=>{
    if(!User){
      navigation.navigate("Login");
    }
  },[User])
  return (
    <View flex style={StylesWrapper.wraper}>
      <View right>
        {User?.ImagePath? 
          <PhotoProfile image={User.ImagePath}></PhotoProfile>
          :null
        }
      </View>
      <View top style={styles.wrapperButtons}>
        <View left>
          <Text style={stylesTitle.TitleMedium}> Selecciona una opción. </Text>
        </View>
      </View>
      <Card
        selected={!selectCard}
        selectionOptions={styles.selectOptionCard}
        elevation={20}
        flexS
        style={styles.card}
        flex
        center
        onPress={HandleMarkerSelectCard}>
        <Text>Crear Ruta</Text>
      </Card>
      <Card
        selected={selectCard}
        selectionOptions={styles.selectOptionCard}
        elevation={20}
        flexS
        style={styles.card2}
        flex
        center
        onPress={HandleGoToVisitCustumer}>
        <Text>Visitas</Text>
      </Card>
    </View>
  );
};
export default HomeRouteVendors;
const styles = StyleSheet.create({
  wrapperButtons: {
    margin: '1%',
    marginBottom: '10%',
  },
  HeaderSection: {
    height: 80,
    backgroundColor: '#f3f5f7',
  },
  card: {
    height: '15%',
    borderColor: 'black',
    marginTop: '4%',
    backgroundColor: '#ec7663',
  },
  card2: {
    height: '15%',    
    borderColor: 'black',
    marginTop: '4%',
    backgroundColor: '#327388',
  },
  selectOptionCard: {
    color: 'green',
  },
});
