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
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import ButtonPrimary from '../../Components/Buttons/ButtonPrimary';
import {ScrollView} from 'react-native-gesture-handler';
import {GetGeolocation} from '../../lib/Permissions/Geolocation';
import {
  LoadSetRegisterVisit,
  SetVisitCustomer,
} from '../../Api/Customers/ApiCustumer';
import {useNavigation} from '@react-navigation/native';
import {SetActualityCoords} from '../../Api/User/ApiUser';
const FormCreateVisit = () => {
  const CustomerSelect = useSelector(state => state.Customer);
  const [AdressCustomer,setAdressCustomer]=useState(
    CustomerSelect.ListAdressCustomerSelect.map((adress)=>{
      return{
        label:adress.Direccion,
        onPress:()=>{HandleSelectAdress(adress.IdDireccion)}
      }
    })
  );
  const [HasNextDate, setHasNextDate] = useState(false);
  const [HasNextDateHour, setHasNextDateHour] = useState(false);
  const [date, setDate] = useState(new Date(Date.now()));
  const [hourVisitDate, setHourVisitDate] = useState(0);
  const [ViewPanelAdress, SetViewPannelAdress] = useState(false);
  const [idAddressVisit,setIdAddressVisit]=useState(0);
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
      Contact: '',
      Title: '',
      NextDate: '',
      NextHourDate: '',
      Bill: '',
      Comment: '',
    },
  });
  const HandleSelectAdress=(addressId=0)=>{
    setIdAddressVisit(addressId);
  }
  const Rol = useSelector(state => state.rol.RolSelect);
  const submitForm = async FormData => {
    try {
      // if(idAddressVisit==0){
      //   Alert.alert("Seleccione la dirección a visitar");
      // }
      dispatch(LoadSetRegisterVisit(true));
      const coords = await GetGeolocation();
      if (coords.Status) {
        const data = {
          IdRelacion: Rol[0]?.IdRelacion,
          CardCode: CustomerSelect.customerSelect.CardCode,
          Contacto: FormData.Contact,
          Titulo: FormData.Title,
          HasFechaProximaVisita: HasNextDate,
          HasHora: HasNextDateHour,
          FechaProximaVisita: date.toLocaleDateString('en-US'),
          Hora: date.getHours(),
          Minuta: FormData.Bill,
          Comentario: FormData.Comment,
          Latitud: coords.Data.coords.latitude,
          Longitud: coords.Data.coords.longitude,
          LatitudeDestino: CoordsDestination.coordsDestination.latitude,
          LongitudeDestino: CoordsDestination.coordsDestination.longitude,
          IdDireccionVisita:idAddressVisit,
          GrupoVisita:''
        };
        SetVisitCustomer(data, dispatch);
      } else {
        Alert.alert(coords.Message);
        dispatch(LoadSetRegisterVisit(false));
      }
    } catch {
      Alert.alert('Ocurrió un error, intente nuevamente');
      dispatch(LoadSetRegisterVisit(false));
    }
  };

  const onChangeDate = (event, selectedDate) => {
    setDate(selectedDate);
  };
  const HandleViewPanelAdress=()=>{
    SetViewPannelAdress(true);
  }
  const onChangeTime = ev => {
    setHourVisitDate(ev.nativeEvent.timestamp);
  };

  async function openMap() {
    const coords = await GetGeolocation();
    if (coords.Status) {
      dispatch(SetActualityCoords(coords.Data.coords));
      navigation.navigate('ViewMap');
    } else {
      Alert.alert(coords.Message);
    }
  }
  const HandleChangeSwitchNextDate = () => {
    if (!HasNextDate) {
      DateTimePickerAndroid.open({
        value: date,
        onChange: onChangeDate,
        is24Hour: true,
      });
    }
    setHasNextDate(!HasNextDate);
  };
  const HandleChangeSwitchNextHour = () => {
    if (!HasNextDateHour) {
      DateTimePickerAndroid.open({
        value: date,
        onChange: onChangeTime,
        is24Hour: true,
        mode: 'time',
      });
    }
    setHasNextDateHour(!HasNextDateHour);
  };
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

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Contacto"
              placeholderTextColor="#b3b2b7"
            />
          )}
          name="Contact"
        />
        {errors.Contact && (
          <Text style={styles.TextAlert}>Este campo es requerido</Text>
        )}

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Tema"
              placeholderTextColor="#b3b2b7"
            />
          )}
          name="Title"
        />
        {errors.Title && (
          <Text style={styles.TextAlert}>Este campo es requerido</Text>
        )}

        {/* <View style={styles.ContainerMargin}>
          <Switch
            value={HasNextDate}
            onValueChange={HandleChangeSwitchNextDate}
          />
          <Text>Próxima fecha de visita</Text>
        </View>
        <View style={styles.ContainerMargin}>
          <Switch
            value={HasNextDateHour}
            onValueChange={HandleChangeSwitchNextHour}
          />
          <Text>Próxima Hora de visita </Text>
        </View> */}

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Minuta"
              placeholderTextColor="#b3b2b7"
            />
          )}
          name="Bill"
        />
        {errors.Bill && (
          <Text style={styles.TextAlert}>Este campo es requerido</Text>
        )}
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Comentario"
              placeholderTextColor="#b3b2b7"
            />
          )}
          name="Comment"
        />
        {errors.Comment && (
          <Text style={styles.TextAlert}>Este campo es requerido</Text>
        )}
        <View style={styles.ContainerMargin}>
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
