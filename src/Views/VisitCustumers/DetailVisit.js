import {useState}from'react'
import {ScrollView, StyleSheet, Alert,TextInput} from 'react-native';
import {Text, View, Button,LoaderScreen, TextArea} from 'react-native-ui-lib';
import {useDispatch, useSelector} from 'react-redux';
import StylesWrapper from '../../Styles/Wrapers';
import {
  DeleteVisit,
  FunctionSetCoordsDetail,
  FunctionUpdateVisit, GetVisitByID, LoadUpdateVisit, SaveIsArriveOrNotTheVisit,
} from '../../Api/Customers/ApiCustumer';
import { useNavigation } from '@react-navigation/native';
import { AlertConditional } from '../../Components/TextAlert/AlertConditional';
import { StopInitVisit } from '../../lib/Visits';
import { GetGeolocation } from '../../lib/Permissions/Geolocation';
import BackgroundService from 'react-native-background-actions';
import Geolocation from '@react-native-community/geolocation';
const DetailVisit = () => {
  const data = useSelector(state => state.Customer.VisitDetailSelected);
  const isLoadUpadateVisit = useSelector(state=>state.Customer);
  const DrivingVisitDetail = useSelector(state => state.Mileage);
  const Rol = useSelector(state => state.rol.RolSelect);
  const User = useSelector(state=>state.login.user);
  const [comentary, setComentary] = useState(data.Comentario? data.Comentario:'');
  const [visit,setVisit] = useState({    
      IdRelacion: Rol[0].IdRelacion,
      IdRegistro: data.IdRegistro,
      Proceso: '',
      Comentario : comentary,
      UUIDGroup:'',
      isInitVisit:false,
      isEndVisit:false
  });
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const HandleSetComentary=(e)=>{
    setComentary(e.value);
  }
  const ConfirmCancelVisit=async()=>{
    visit.Proceso="Cerrado";
   const statusUpdate =await  FunctionUpdateVisit(visit,dispatch,navigation);
   if(statusUpdate!=null && statusUpdate.Resultado){
    //to canceled visita if nor are visit
    //StopInitVisit(DrivingVisitDetail.IdWatchLocation,dispatch); 
    if(isLoadUpadateVisit.RoutesInProgress.length==1){
      await StopInitVisit(DrivingVisitDetail.IdWatchLocation,dispatch); 
    }
    dispatch(DeleteVisit(visit.IdRegistro)); 
    navigation.navigate("VisitCreated");
  }else if(statusUpdate!=null && !statusUpdate.Resultado){
    Alert.alert(statusUpdate.Mensaje);
  }
   
  }
  const HandleUpdateVisit = async typeOption => {
    
    try{      
    dispatch(LoadUpdateVisit(true));     
      switch (typeOption) {
        case 1: {          
          const GetVisit = await GetVisitByID(data.IdRegistro);           
          if(GetVisit!=null && (GetVisit["<isMarkerArrival>k__BackingField"]==true) ){        
            Alert.alert("Ya se marcó la llegada","Esta visita ya tiene marcado un horario de llegada");                              
            return;
          }else if(GetVisit==null){
            Alert.alert("Ocurrió un error","Intenta nuevamente por favor");
            return ;
          } 
          if (!DrivingVisitDetail.isRouteInCourse &&typeOption==1 ) {
            Alert.alert('Inicie primero el viaje antes de marcar su Llegada ');
            return;
          }
          visit.LatitudeDestino = 0;
          visit.longitude = 0;
          visit.UUIDGroup = DrivingVisitDetail.UUIDRoute;
          visit.isInitVisit=true;          
          const resultUpdate = await FunctionUpdateVisit(visit, dispatch,navigation);          ;
          if(resultUpdate!=null && resultUpdate.Resultado){  
            await StopInitVisit(null,dispatch); 
            await BackgroundService.stop();  
            Geolocation.stopObserving();        
            try{
              const getCoords = await GetGeolocation();
              const coords = {
                Latitud:getCoords.Data.coords.latitude,
                Longitud:getCoords.Data.coords.longitude,
                UUIRecorrido:DrivingVisitDetail.UUIDRoute?DrivingVisitDetail.UUIDRoute:'',
                idUsuario:User.EntityID
              }               
              //console.log(coords.idUsuario,"El usuario");
              if(coords.Latitud && coords.Latitud>0){
                FunctionSetCoordsDetail(coords);                
              }
            }finally{              
              

            }  
            Alert.alert("Registro exitoso");
          }else if(resultUpdate!=null && !resultUpdate.Resultado){
            Alert.alert(resultUpdate.Mensaje);
          }
          //navigation.navigate("FormFinaliceVisit");
          //FunctionUpdateAddressCoords();
          break;
        }
        case 2: {          
          setVisit({...visit,Proceso:'Cancelado',isInitVisit:false,isEndVisit:false})
          AlertConditional(ConfirmCancelVisit,function(){},"¿Está seguro de cancelar esta visita?","");
          break;
        }
        case 3:{ 
          const GetVisit = await GetVisitByID(data.IdRegistro);           
          const isEndVisit =  GetVisit["<EsRegreso>k__BackingField"];   
          dispatch(SaveIsArriveOrNotTheVisit(isEndVisit));  
                
          if(GetVisit!=null && GetVisit["<isMarkerArrival>k__BackingField"] ){        
            navigation.navigate("FormFinaliceVisit");                              
          }else{
            Alert.alert("No se ha marcado la llegada","Marque su llegada primero antes de finalizar");
          }                
        }       
      };      
    }catch(ex){
      Alert.alert("Error: "+ex)
    }finally{
      dispatch(LoadUpdateVisit(false));     
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
            HandleUpdateVisit(3);
          }}
          style={styles.button1}>
          <Text style={{fontSize: 9, color: 'white'}}> Finalizar  </Text>
        </Button>
        <Button
          onPress={() => {
            HandleUpdateVisit(1);
          }}
          style={styles.button3}>
          <Text style={{fontSize: 9, color: 'white'}}> Llegando</Text>
        </Button>
        <Button
          onPress={() => {
            HandleUpdateVisit(2);
          }}
          style={styles.button}>
          <Text style={{fontSize: 9, color: 'white'}}> Eliminar Visita</Text>
        </Button>
 
        <View flex centerH>
          <View style={styles.cardinfo1}>
            {/* <TextInput onChangeText={HandleSetComentary} placeholder='Comentario' multiline={true} numberOfLines={4} value={comentary}  ></TextInput> */}
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
    backgroundColor: '#6f6971',
    color: '#fefefe',
    margin: '1%',
  }
});
