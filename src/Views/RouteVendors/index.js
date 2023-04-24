import React, {useState, useEffect} from 'react';
import {View, Card,LoaderScreen,Text} from 'react-native-ui-lib';
import StylesWrapper from '../../Styles/Wrapers';
import {StyleSheet} from 'react-native';
import stylesTitle from '../../Styles/Titles';
import {Alert} from 'react-native';
import PhotoProfile from '../../Components/Header/HeaderAvatar';
import {useDispatch, useSelector} from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { BackHanlder } from '../../lib/ExitApp';
import { ScrollView } from 'react-native-gesture-handler';
import { LoadGetVisitActuality,FunctionGetCurrentVisit, SetVisiActualityt } from '../../Api/Customers/ApiCustumer';
import { StartNotification } from '../VisitCustumers/VisitCreated';
import { Image } from 'react-native';
import { FunctionGetMileageInit,SaveIsArriveOrNotTheVisit } from '../../Api/Customers/ApiCustumer';
import { GeCustomersVendor } from '../../Api/Customers/ApiCustumer';
import BackgroundService from 'react-native-background-actions';
import { StopInitVisit } from '../../lib/Visits';
const imagePath = require('../../Assets/Images/logoDisdel.png');

const HomeRouteVendors = () => {
  
  const [selectCard, setSelectCard] = useState(false);
  const navigation = useNavigation();
  const DrivingVisitDetail = useSelector(state => state.Mileage);
  const listVisit = useSelector(state=>state.Customer);
  const Rol = useSelector(state => state.rol.RolSelect);
  const navigator = useNavigation();  

  const dispatch = useDispatch();
  BackHanlder(navigation,dispatch);
  const HandleMarkerSelectCard = () => {
    setSelectCard(!selectCard);
    dispatch(GeCustomersVendor([]));
    navigation.navigate("SearchCustomer");    
  };
  const HandleInitRouteForHome =async()=>{
    if (
      DrivingVisitDetail.isRouteInCourse 
    ) {
      Alert.alert('La ruta ya ha sido iniciada');
      return;
    }
    try{
      dispatch(LoadGetVisitActuality(true));      
     const visits = await FunctionGetCurrentVisit(Rol[0].IdRelacion,dispatch,true,navigator);
     if(visits!=null && visits.length > 0){
      dispatch(SetVisiActualityt(visits));                      
     }else if(visits.length ==0){
      dispatch(SetVisiActualityt([]));  
      Alert.alert("","No tiene visitas creadas");
      return;      
     }
     await StartNotification(User.EntityID,"",dispatch);

     const dataMileagueInit = await FunctionGetMileageInit(
      User.EntityID,
       0,
     );            

 try { 
  if(dataMileagueInit && dataMileagueInit.length==0){
    dispatch(SaveIsArriveOrNotTheVisit("Y"));
    navigation.navigate('FormCreateRoute');
  }                               
} finally {
  dispatch(LoadGetVisitActuality(false));
}

     Alert.alert("","Ruta Iniciada con éxito");

    }catch(ex){
      Alert.alert(""+ex);
    } finally{
      dispatch(LoadGetVisitActuality(false));       
    }
  }

  const HandleGoBases =()=>{
    navigation.navigate("MenuEndVisit");    
  }
  const HandleGoGasoline =()=>{
    navigation.navigate("MenuEndVisit");    
  }

  const HandleGoToVisitCustumer=async()=>{
    try{
      dispatch(LoadGetVisitActuality(true));      
     const visits = await FunctionGetCurrentVisit(Rol[0].IdRelacion,dispatch,true,navigator);
     if(visits!=null && visits.length > 0){
      dispatch(SetVisiActualityt(visits));                      
     }else if(visits.length ==0){
      dispatch(SetVisiActualityt([]));        
     }
    }catch(ex){
      Alert.alert(""+ex);
    } finally{
      dispatch(LoadGetVisitActuality(false)); 
      navigation.navigate("VisitCreated");
    }
  }
  
 
  const User = useSelector(state => state.login.user);  
  useEffect(()=>{  
    async function StopVisit(){
      if(DrivingVisitDetail.isRouteInCourse &&!BackgroundService.isRunning()){     
        await StopInitVisit(null,dispatch);
      } 
    } 
    StopVisit();    
    if(!User){
      navigation.navigate("Login");
      return;
                 }
    
  },[User])
  return (
    <ScrollView style={StylesWrapper.secondWrapper}>
    <View  style={StylesWrapper.wraper}>
      <View right>
        {User?.ImagePath? 
          <PhotoProfile image={User.ImagePath}></PhotoProfile>
          :null
        }
        <Image style={{width:10,height:6}} source={imagePath} ></Image>
      </View>
      {listVisit.loadGetCurrentVisit?
      <LoaderScreen color="black" message="Cargando proceso..." ></LoaderScreen>:null
      }
      
      <View top style={styles.wrapperButtons}>
        <View left>
          <Text style={stylesTitle.TitleMedium}> Selecciona una opción. </Text>
        </View>
      </View>
      <Card
        elevation={20}
        flexS
        style={styles.card}
        flex
        center 
        onPress={HandleMarkerSelectCard}>
        <Text>Crear una nueva visita</Text>
      </Card>
      <Card
        elevation={20}
        flexS
        style={styles.card2}
        flex
        center
        onPress={HandleGoToVisitCustumer}>
        <Text>Ver Visitas en curso</Text>
      </Card>
      <Card              
        elevation={20}
        flexS
        style={  DrivingVisitDetail.isRouteInCourse ? styles.ButtonDisable :styles.card3}
        flex
        center
        onPress={HandleInitRouteForHome}>
        <Text>Iniciar Ruta</Text>
      </Card>
      <Card      
        containerStyle={{color:'black'}}
        elevation={20}
        flexS
        style={styles.card4}
        flex
        center
        onPress={HandleGoBases}>
        <Text>Ir a bases</Text>
      </Card>
      <Card      
        containerStyle={{color:'black'}}
        elevation={20}
        flexS
        style={styles.card5}
        flex
        center
        onPress={HandleGoGasoline}>
        <Text>Ingreso de Gasolina</Text>
      </Card>
    </View>
    </ScrollView>
  );
};
export default HomeRouteVendors;
const styles = StyleSheet.create({
  wrapperButtons: {
    margin: '1%',
    marginBottom: '10%',
  },
  HeaderSection: {
    height: '100%',
    backgroundColor: '#f3f5f7',
  },
  card: {
    height: '17%',
    borderColor: 'black',
    marginTop: '4%',
    backgroundColor: '#CED3F2',
    color:'black'
  },
  card2: {
    height: '17%', 
    borderColor: 'black',
    marginTop: '4%',
    backgroundColor: '#D0F2E9',
    color:'black'
  },
  card3: {
    height: '17%', 
    borderColor: 'black',
    marginTop: '4%',
    backgroundColor: '#F2E8C9',
    color:'black'
  },
  card4: {
    height: '17%', 
    borderColor: 'black',
    marginTop: '4%',
    backgroundColor: '#F2D8CE',
    color:'black'
  },
  card5: {
    height: '17%', 
    borderColor: 'black',
    marginTop: '4%',
    backgroundColor: 'gray',
    color:'black'
  },
  selectOptionCard: {
    color: 'green',
  },
  ButtonDisable:{
    backgroundColor:'#f2f2f2',
    color:'#a9a9a9',
    height: '17%',    
    shadowColor: 'shadow',
    marginTop: '4%',
  }
 
});
