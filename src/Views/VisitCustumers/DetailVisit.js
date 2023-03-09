import {useState}from'react'
import {ScrollView, StyleSheet, Alert,TextInput} from 'react-native';
import {Text, View, Button,LoaderScreen, TextArea} from 'react-native-ui-lib';
import {useDispatch, useSelector} from 'react-redux';
import StylesWrapper from '../../Styles/Wrapers';
import {
  FunctionUpdateVisit,
} from '../../Api/Customers/ApiCustumer';
import { useNavigation } from '@react-navigation/native';
import { AlertConditional } from '../../Components/TextAlert/AlertConditional';

const DetailVisit = () => {
  const data = useSelector(state => state.Customer.VisitDetailSelected);
  const isLoadUpadateVisit = useSelector(state=>state.Customer);
  const DrivingVisitDetail = useSelector(state => state.Mileage);
  const Rol = useSelector(state => state.rol.RolSelect);
  const [comentary, setComentary] = useState(data.Comentario? data.Comentario:'');
  const [visit,setVisit] = useState({    
      IdRelacion: Rol[0].IdRelacion,
      IdRegistro: data.IdRegistro,
      Proceso: '',
      Comentario : comentary,
      UUIDGroup:''
  });
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const HandleSetComentary=(e)=>{
    setComentary(e.value);
  }
  const ConfirmCancelVisit=()=>{
    visit.Proceso="Cerrado";
    FunctionUpdateVisit(visit,dispatch,navigation);
  }
  const HandleUpdateVisit = async typeOption => {
    try{
      if (!DrivingVisitDetail.isRouteInCourse &&typeOption==3 ) {
        Alert.alert('Inicie primero el viaje antes de finalizar');
        return;
      }

     
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
          setVisit({...visit,Proceso:'Cancelado'})
          AlertConditional(ConfirmCancelVisit,function(){},"¿Está seguro de cancelar esta visita?","");
          break;
        }
        case 3:{                            
           navigation.navigate("FormFinaliceVisit");                  
        }       
      };      
    }catch(ex){
      Alert.alert("Error: "+ex)
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
