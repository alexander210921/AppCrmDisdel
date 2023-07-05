import React, {useState} from 'react';
import {Button, View, Text, LoaderScreen} from 'react-native-ui-lib';
import {Picker} from '@react-native-picker/picker';
import {ScrollView, StyleSheet, TextInput, Alert} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { useSelector,useDispatch } from 'react-redux';
import { ArriveDelevery, SaveDocumentsRoute } from '../../../Api/Traking/ApiTraking';
import { useNavigation } from '@react-navigation/native';

const CreditPayment = ({dataTracking = null}) => {
  const [selectedOption, setSelectedOption] = useState("1");
  const [isDatePicketVisible, setIsDatePicketVisible] = useState(false);
  const [dateSelected,setDateSelected] = useState(null);
  const User = useSelector(state => state.login.user);
  const documents = useSelector(state => state.Tracking.DocumentAcepted);
  const [loadEndProcessTracking, setLoadEndProcessTracking] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const SendSubmit = async FormData => {
    try{
      setLoadEndProcessTracking(true);
      let Data = {};
      let liquidar = {};      
       Data.Latitud = 0;
      Data.Longitud = 0;
      Data.Estado = 4;
      Data.AuxIdentificador = 2;
      Data.eventosDocument = 2;
      switch (selectedOption) {
        case '1':
          liquidar.tipopago = 'Contraseña';
          liquidar.nombrebanco = '';
          liquidar.numeroDocumento = '';
          liquidar.totalDocumento = 0;
          liquidar.tramiteContrasena = false;
          break;
        case '2':
          liquidar.tipopago = 'TramitaContraseña';
          liquidar.nombrebanco = '';
          liquidar.numeroDocumento = '';
          liquidar.totalDocumento = 0;
          liquidar.tramiteContrasena = true;
          break;
      }

      const liquidacion = {
        NameUser: User?.Datos?.NombreCompleto,
        IdUser: User?.EmpID,
        TipoPago: liquidar.tipopago,
        BancoPago: liquidar.nombrebanco,
        DocumentoPago: liquidar.numeroDocumento,
        TotalPago: parseFloat(liquidar.totalDocumento),
        ContrasenaDocumento: FormData.Contraseña,
        TramitarContrasena: liquidar.tramiteContrasena,
        Firma: liquidar.tieneFirma ? true : false,
        FechaCobro:dateSelected ?new Date(dateSelected).toLocaleDateString() : new Date().toLocaleDateString(),
        TotalDocumento: liquidar.totalDoc,
        CardName: dataTracking.CardName,
        TipoObjeto: 'Credito',
        EstadoLiquidacion: 4,
      };

      Data.ListaLiquidada = liquidacion;
      Data.IdTracking = dataTracking.EntityID;
      // console.log("fecha hoy ",Data.ListaLiquidada.FechaCobro);
      // console.log("fecha seleccionada ",new Date(dateSelected).toLocaleDateString() )
      const result = await ArriveDelevery(Data);  
        
      if (result == null) {
        Alert.alert('', 'Ocurrió un error, intenta nuevamente');
        return;
      }
      Alert.alert('', '' + result?.Mensaje);
      console.log(result,"RESULT IF IS CREDIT")
      if(result.Resultado){        
        let filterDoc = documents?.filter(item=>item.EntityID!=Data.IdTracking);
        dispatch(SaveDocumentsRoute(filterDoc));
        navigation.goBack();
      }
    }finally{
      setLoadEndProcessTracking(false);
    }

  };
  const handlerConfirm = date => {
    const dateBirth = date;
    dateBirth.setHours(0);
    dateBirth.setMinutes(0);
    dateBirth.setSeconds(0);
    console.log(dateBirth);
    setDateSelected(dateBirth);
    setIsDatePicketVisible(false);
  };
  const hideDatePicker = () => {
    setIsDatePicketVisible(false);
  };

  const showDatePicker = () => {
    setIsDatePicketVisible(true);
  };

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      Contraseña: '',
      TramitaContraseña: '',
    },
  });
  return (
    <ScrollView>
      <View style={styles.container}>
        <Picker
          selectedValue={selectedOption}
          onValueChange={itemValue => {
            setSelectedOption(itemValue);
          }}>
          <Picker.Item
            label="Contraseña"
            value="1"
            style={{
                color: 'black',
                backgroundColor:'#fff'
              }}
          />
          <Picker.Item
            label="Tramita Contraseña"
            value="2"
            style={{
                color: 'black',
                backgroundColor:'#fff'
              }}
          />
        </Picker>
      </View>
      {/* form */}
      <View style={{padding: '0%'}}>
        {selectedOption != 2 ? (
          <View>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={styles.inputC}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Ingrese contraseña"
                  placeholderTextColor="#b3b2b7"
                />
              )}
              name="Contraseña"
            />
            {errors.Contraseña && (
              <Text style={styles.TextAlert}>Este campo es requerido</Text>
            )}

            <Button onPress={showDatePicker} style={styles.ButtonDate}>
              <Text style={{color: '#fff'}}>Fecha de cobro</Text>
            </Button>
            <Text style={{color: '#000'}}>{dateSelected ?new Date(dateSelected).toLocaleDateString() : new Date().toLocaleDateString()}</Text>

            <DateTimePicker
              isVisible={isDatePicketVisible}
              mode="date"
              onConfirm={handlerConfirm}
              onCancel={hideDatePicker}
            />
          </View>
        ) : null}
        {loadEndProcessTracking ? 
        <LoaderScreen color="black"></LoaderScreen>
        :
             <Button style={styles.Button} onPress={handleSubmit(SendSubmit)}>
             {/* finalizar al contado entrega completa */}
             <Text style={{color: '#fff'}}>Finalizar Crédito</Text>
           </Button>
        }   
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'black',
    width: '100%',
  },
  TextAlert: {
    color: 'red',
  },
  inputC: {
    // borderColor:'gray'
    color:'#000',
    marginTop: '2%',
  },
  inputC1: {},
  Button: {
    backgroundColor: '#000',
    marginTop: '4%',
  },
  ButtonDate:{
    backgroundColor: '#5E2129',
    marginTop: '2%',
    width:'40%'
  }
});
export default CreditPayment;
