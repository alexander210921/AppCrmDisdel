import React, {useState, useEffect} from 'react';
import {View, Card,LoaderScreen,Text} from 'react-native-ui-lib';
import StylesWrapper from '../../Styles/Wrapers';
import {SafeAreaView, StyleSheet,TouchableOpacity} from 'react-native';
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
import { SetActualityCoords } from '../../Api/User/ApiUser';
import { GetGeolocation } from '../../lib/Permissions/Geolocation';
const imagePath = require('../../Assets/Images/logoDisdel.png');
const imagePathLyG = require('../../Assets/Images/logoLyG.png');
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeRouteVendors = () => {
  
  const [selectCard, setSelectCard] = useState(false);
  const navigation = useNavigation();
  const DrivingVisitDetail = useSelector(state => state.Mileage);
  const listVisit = useSelector(state=>state.Customer);
  const Rol = useSelector(state => state.rol.RolSelect);
  const navigator = useNavigation();  
  const company = useSelector(state=>state.company.CompanySelected);
  const pastelColors = ['#E5D8CF', '#B7DDE8', '#E8D9B9', '#C4D7CF','#CED3F2'];
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
     const isValidateGPS = await GetGeolocation();
     if(!isValidateGPS.Status){   
       Alert.alert("","Enciende tu GPS para continuar");          
         return;
     }
     if(isValidateGPS.Data.coords.latitude!=0  && isValidateGPS.Data.coords.longitude!=0 ){
       dispatch(SetActualityCoords({
         latitude:isValidateGPS.Data.coords.latitude,
         longitude:isValidateGPS.Data.coords.longitude
       }));
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
    navigation.navigate("FormGasoline");    
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
  
//  useEffect(()=>{
//   console.log(company);
//   Alert.alert(""+company?.EntityID);
//  },[])
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

  const PastelCard = ({ color,title="",nameIcon="bag-personal",onPress }) => {
    return (
      <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
      <View style={[styles.card, { backgroundColor: color }]} >
        <Icon name={nameIcon} size={30} color="#fff" style={styles.icon} />
        <Text style={[styles.title, { color: "black" }]}>{title}</Text>
      </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>
      
    <ScrollView >
    <View  style={styles.WrapperCustomer}>
      <View style={{width:'100%',height:'25%'}} right>
        {User?.ImagePath? 
          <PhotoProfile image={User.ImagePath}></PhotoProfile>
          :null
        }
        <Image style={{width:'25%',height:'25%'}} source={ company?.EntityID==1009? imagePathLyG:imagePath} ></Image>
      </View>
      {listVisit.loadGetCurrentVisit?
      <LoaderScreen color="black" message="Cargando proceso..." ></LoaderScreen>:null
      }
      
   
      {/* <Card
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
      </Card> */}
        <View style={styles.container}>
      <View style={styles.row}>
        <PastelCard onPress={HandleMarkerSelectCard} nameIcon='bag-personal' title='Crear nueva visita' color={pastelColors[0]} />
        <PastelCard onPress={HandleGoToVisitCustumer} nameIcon='progress-download' title='Ver visitas en curso' color={pastelColors[1]} />
      </View>
      <View style={styles.row}>
        <PastelCard onPress={HandleInitRouteForHome} nameIcon='map-marker-plus' title='Iniciar Ruta' color={pastelColors[2]} />
        <PastelCard onPress={HandleGoGasoline} nameIcon='gas-station' title='Gasolina' color={pastelColors[3]} />
      </View>
      <View style={styles.row}>
        <PastelCard onPress={HandleGoBases} nameIcon='warehouse' title='Ir a base' color={pastelColors[4]} />        
      </View>
    </View>

    </View>
    </ScrollView>
    </SafeAreaView>
  );
};
export default HomeRouteVendors;
const styles = StyleSheet.create({
  wrapperButtons: {
    margin: '1%',
    //marginBottom: '10%',
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
  },
  WrapperCustomer:{
    ...StylesWrapper.wraper,
    marginBottom:'3%'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  card: {
    flex: 1,
    borderRadius: 10,
    margin: 5,
    justifyContent: 'flex-end',
  },
  icon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  title: {
    position: 'absolute',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    bottom: '40%',
    width: '100%',
  },
  button: {
    width: '50%',
    aspectRatio: 1,
    borderRadius: 10,
    marginHorizontal: 5,
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
 
});
