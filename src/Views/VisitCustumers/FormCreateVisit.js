import React, {useState} from 'react';
import {
  View,  
  Text,
  LoaderScreen,
  ActionSheet,
  Button
} from 'react-native-ui-lib';
import {useForm, Controller} from 'react-hook-form';
import {TextInput, StyleSheet, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ButtonPrimary from '../../Components/Buttons/ButtonPrimary';
import {ScrollView} from 'react-native-gesture-handler';
import {GetGeolocation} from '../../lib/Permissions/Geolocation';
import {
  LoadSetRegisterVisit,
  SetVisitCustomer,
} from '../../Api/Customers/ApiCustumer';
import {useNavigation} from '@react-navigation/native';
const FormCreateVisit = () => {
  const CustomerSelect = useSelector(state => state.Customer);
  const [AdressCustomer,setAdressCustomer]=useState(
    CustomerSelect.ListAdressCustomerSelect.map((adress)=>{
      return{
        label:adress.Nombre+" / "+adress.Direccion,
        onPress:()=>{HandleSelectAdress(adress)}
      }
    })
  );

  const [ViewPanelAdress, SetViewPannelAdress] = useState(false);
  const [idAddressVisit,setIdAddressVisit]=useState({
    addressId:0,
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
  const submitForm = async FormData => {
    try {
      dispatch(LoadSetRegisterVisit(true));
      const coords = await GetGeolocation();
      if (coords.Status) {
        const data = {
          IdRelacion: Rol[0]?.IdRelacion,
          CardCode: CustomerSelect.customerSelect.CardCode,  
          Latitud: coords.Data.coords.latitude,
          Longitud: coords.Data.coords.longitude,
          LatitudeDestino: CoordsDestination.coordsDestination.latitude,
          LongitudeDestino: CoordsDestination.coordsDestination.longitude,
          IdDireccionVisita:idAddressVisit.addressId,
          GrupoVisita:'',
          DireccionDestino: '',
          ShipToCode:idAddressVisit!=null? idAddressVisit.AddressName:'',
        };
        SetVisitCustomer(data, dispatch,navigation,true,false,"FormCreateRoute");
      } else {
        Alert.alert(coords.Message);
        dispatch(LoadSetRegisterVisit(false));
      }
    } catch {
      Alert.alert('Ocurrió un error, intente nuevamente');
      dispatch(LoadSetRegisterVisit(false));
    }
  };


  const HandleViewPanelAdress=()=>{
    SetViewPannelAdress(true);
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
    <ScrollView>
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
        <View style={styles.ContainerMargin}>
        <Text style={styles.TextInformation} >{idAddressVisit.ShiptoCodeAddress+" / "+idAddressVisit.AddressName}</Text>
          {/* <ButtonPrimary label=" Destino" HandleClick={openMap}></ButtonPrimary> */}
          <Button color="white" style={styles.buttonAdress} label={'Seleccionar Dirección'} size={Button.sizes.small} backgroundColor={"#f1c28b"} onPress={HandleViewPanelAdress}/>
        </View>
        

        <View style={styles.ContainerMargin}>
          <ActionSheet
            visible={ViewPanelAdress}
            title={'Direcciones'}
            message={'Message goes here'}
            cancelButtonIndex={3}
            destructiveButtonIndex={0}
            options={AdressCustomer}
            onDismiss={() => {
              SetViewPannelAdress(false);
            }}
          />

          {CustomerSelect.loadSetVisit ? (
            <LoaderScreen color="black" overlay></LoaderScreen>
          ) : (
            <ButtonPrimary
              label="Registrar"
              HandleClick={handleSubmit(submitForm)}></ButtonPrimary>
          )}
        </View>
      </View>
    </ScrollView>
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
