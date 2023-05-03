import React, {useState} from 'react';
import {
  View,  
  Text,
  LoaderScreen,
  
} from 'react-native-ui-lib';
import {useForm, Controller} from 'react-hook-form';
import {TextInput, StyleSheet, Alert,ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ButtonPrimary from '../../Components/Buttons/ButtonPrimary';
import {
  AddVisit,
  LoadSetRegisterVisit,
  SetVisitCustomer,
} from '../../Api/Customers/ApiCustumer';
import {useNavigation} from '@react-navigation/native';
import { AlertConditional } from '../../Components/TextAlert/AlertConditional';
import SearchItem from '../../Components/SearchList/SearchList';
import SearchableDropdownV2 from '../../Components/SearchList/SearchListV2';
import { GeCustomersVendor } from '../../Api/Customers/ApiCustumer';
const FormCreateVisit = () => {
  const CustomerSelect = useSelector(state => state.Customer);
  const [AdressCustomer,setAdressCustomer]=useState(
    CustomerSelect.ListAdressCustomerSelect.map((adress)=>{
      return {name :adress.Nombre+" / "+adress.Direccion,id:adress.IdDireccion}
        //onPress:()=>{HandleSelectAdress(adress)}
    })
  );
  const [ViewPanelAdress, SetViewPannelAdress] = useState(false);
  const [idAddressVisit,setIdAddressVisit]=useState({
    addressId:null,
    AddressName:'',
    ShiptoCodeAddress:''
  });
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const CoordsDestination = useSelector(state => state.login);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      CustomerCode: '',
      CustomerName: '',
      Tema:''
    },
  });
  const HandleSelectAdress=(adress)=>{
    const address={
      addressId:adress.IdDireccion,
      AddressName:adress.Direccion,
      ShiptoCodeAddress:adress.Nombre
    }
    setIdAddressVisit(address);
  }
  const Rol = useSelector(state => state.rol.RolSelect);
  const goVisitCreated=()=>{navigation.navigate("VisitCreated")}
  const goFormSearchCustomer=()=>{navigation.navigate("SearchCustomer")}
  const submitForm = async FormData => {
    try {
      dispatch(GeCustomersVendor([]));
    //  dispatch(GetCustomersVen);
      if(idAddressVisit.addressId==null){
        Alert.alert("Selecciona una dirección");
        return;
      } 
      dispatch(LoadSetRegisterVisit(true));
      //const coords = await GetGeolocation();
      //coords.Status
      if (true) {
        const data = {
          IdRelacion: Rol[0]?.IdRelacion,
          CardCode: CustomerSelect.customerSelect.CardCode,  
          Latitud: 0,
          Longitud: 0,
          LatitudeDestino: CoordsDestination.coordsDestination.latitude,
          LongitudeDestino: CoordsDestination.coordsDestination.longitude,
          IdDireccionVisita:idAddressVisit.addressId,
          GrupoVisita:'',
          DireccionDestino: '',
          ShipToCode:idAddressVisit!=null? idAddressVisit.AddressName:'',
          EsRegreso:'N',
          Titulo:FormData.Tema,
          validateAdress:true
        };            
                //Alert.alert();
        const VisitCreated = await SetVisitCustomer(data, dispatch,navigation,false,false,"SearchCustomer");
        if(VisitCreated!=null && VisitCreated.Resultado){
          dispatch(AddVisit({
            CardCode:CustomerSelect.customerSelect.CardCode,
            CardName:CustomerSelect.customerSelect.CardName,
            IdRegistro:VisitCreated.DocNum,
            Titulo:FormData.Tema,
            IdDireccionVisita:idAddressVisit.addressId
          }));
          AlertConditional(goFormSearchCustomer,goVisitCreated,"Creado Exitosamente","¿Desea agregar otra visita?");
        }else if(VisitCreated!=null && !VisitCreated.Resultado){
          Alert.alert("Alerta",VisitCreated.Mensaje);
        }        
      } else {
       // Alert.alert(coords.Message);
        dispatch(LoadSetRegisterVisit(false));
      }
    } catch {
      Alert.alert('Ocurrió un error, intente nuevamente');
      dispatch(LoadSetRegisterVisit(false));
    }finally{
      dispatch(LoadSetRegisterVisit(false));
    }
  };


  const HandleViewPanelAdress=()=>{
    SetViewPannelAdress(true);
  }
  const SelectAdress=(item)=>{
    const data={
      addressId:item.id,
      AddressName:item.name,      
      ShiptoCodeAddress:''
    }
    setIdAddressVisit(data);
  }


  // async function openMap() {
  //   const coords = await GetGeolocation();
  //   if (coords.Status) {
  //     dispatch(SetActualityCoords(coords.Data.coords));
  //     navigation.navigate('ViewMap');
  //   } else {
  //     Alert.alert(coords.Message);
  //   }
  // }
  return (
    <View style={{flex:1}} >
      <View style={{height:'100%'}}>
    <ScrollView contentContainerStyle={{paddingBottom: 20}} keyboardShouldPersistTaps ="always"
    >
      <View>
        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={CustomerSelect.customerSelect.CardCode}
              placeholder="Código Cliente"
              placeholderTextColor="#b3b2b7"
              editable={false}
            />
          )}
          name="CustomerCode"
        />

        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={CustomerSelect.customerSelect.CardName}
              placeholder="Nombre Cliente"
              placeholderTextColor="#b3b2b7"
              editable={false}
            />
          )}
          name="CustomerName"
        />
         <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Tema"
              placeholderTextColor="#b3b2b7"
              editable={true}
            />
          )}
          name="Tema"
        />
        <View >
        <Text style={styles.TextInformation} >{idAddressVisit.ShiptoCodeAddress+" / "+idAddressVisit.AddressName}</Text>                    
        </View>
        <View accessible={true} accessibilityRole='button' >
          <SearchableDropdownV2 placeHolder='Busca la dirección' items={AdressCustomer} onItemSelected={SelectAdress}></SearchableDropdownV2>
        </View>
        

        <View style={styles.ContainerMargin}>        
          {CustomerSelect.loadSetVisit ? (
            <LoaderScreen color="black" overlay></LoaderScreen>
          ) : (
            <ButtonPrimary
              label="Registrar Visita"
              HandleClick={handleSubmit(submitForm)}></ButtonPrimary>
          )}
        </View>
      </View>
    </ScrollView>
    </View>
    </View>
  );
};
export default FormCreateVisit;
const styles = StyleSheet.create({
  TextAlert: {
    color: 'red',
  },
  TextInformation: {
    color: '#88807B',
  },
  buttonAdress:{
    color:'black'
  },
  input: {
    height: 50,
    margin: 12,
    borderBottomColor: 'gray',
    padding: 10,
    color: 'black',
    shadowColor: '#ecedf0',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: 'white',
  },
  ContainerMargin: {
    margin: 12,
    marginTop: 5,
  },
});
