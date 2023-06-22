import React, {useState} from 'react';
import {Button, View, Text,LoaderScreen} from 'react-native-ui-lib';
import {Picker} from '@react-native-picker/picker';
import {ScrollView, StyleSheet, TextInput, Alert} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {ArriveDelevery, SaveDocumentsRoute} from '../../../Api/Traking/ApiTraking';
import { useNavigation } from '@react-navigation/native';
import { useSelector,useDispatch } from 'react-redux';
const CashPayment = ({dataTracking = null}) => {
  //console.log("Recibiendo el tracking",dataTracking);
  const documents = useSelector(state => state.Tracking.DocumentAcepted);
  const [selectedOption, setSelectedOption] = useState('1');
  const [loadEndProcessTracking, setLoadEndProcessTracking] = useState(false);
  const User = useSelector(state => state.login.user);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const SendSubmit = async FormData => {
    try {
      setLoadEndProcessTracking(true);
      //console.log("Si ajá",FormData);
      let Data = {};
      let liquidar = {};
      let Datos = null;
      Data.Estado = 4;
      Data.AuxIdentificador = 2;
      Data.eventosDocument = 2;
      Data.Latitud = 0;
      Data.Longitud = 0;
      switch (selectedOption) {
        case '1':
          liquidar.tipopago = 'Cheque';
          liquidar.contrasenaDoc = '';
          liquidar.tramiteContrasena = false;
          break;
        case '2':
          liquidar.tipopago = 'Efectivo';
          liquidar.contrasenaDoc = '';
          liquidar.tramiteContrasena = false;
          liquidar.nombrebanco = '';
          liquidar.numeroDocumento = '';
          break;
        case '3':
          liquidar.tipopago = 'Transferencia';
          liquidar.contrasenaDoc = '';
          liquidar.tramiteContrasena = false;
          break;
        case '4':
          liquidar.tipopago = 'Deposito';
          liquidar.contrasenaDoc = '';
          liquidar.tramiteContrasena = false;
          break;
      }

      const liquidacion = {
        NameUser: User?.Datos?.NombreCompleto,
        IdUser: User?.EmpID, //EmpID,
        TipoPago: liquidar.tipopago,
        BancoPago: FormData.NameBank,
        DocumentoPago: FormData.DocumentNumber,
        TotalPago: parseFloat(FormData.Total),
        ContrasenaDocumento: liquidar.contrasenaDoc,
        TramiteContrasena: liquidar.tramiteContrasena,
        Firma: liquidar.tieneFirma ? true : false,
        FechaCobro: new Date().toLocaleDateString(),
        TotalDocumento: liquidar.totalDoc,
        CardName: dataTracking.CardName,
        TipoObjeto: 'Contado',
        EstadoLiquidacion: 4,
      };

      Data.ListaLiquidada = liquidacion;
      Data.IdTracking = dataTracking.EntityID;
      //console.log("Data Tracking",dataTracking);
      //console.log("data finalizar al contado",Data)
      const result = await ArriveDelevery(Data);
      if (result == null) {
        Alert.alert('', 'Ocurrió un error, intenta nuevamente');
        return;
      }
      Alert.alert('', '' + result?.Mensaje);
      if(result.Resultado){        
        let filterDoc = documents?.filter(item=>item.EntityID!=Data.IdTracking);
        dispatch(SaveDocumentsRoute(filterDoc));
        navigation.goBack();
      }
      
    } finally {
      setLoadEndProcessTracking(false);
    }
  };
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      NameBank: '',
      DocumentNumber: '',
      Total: '',
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
            label="Cheque"
            value="1"
            style={{
              color: 'black',
              backgroundColor: '#fff',
            }}
          />
          <Picker.Item
            label="Efectivo"
            value="2"
            style={{
              color: 'black',
              backgroundColor: '#fff',
            }}
          />
          <Picker.Item
            label="Transferencia"
            value="3"
            style={{
              color: 'black',
              backgroundColor: '#fff',
            }}
          />
          <Picker.Item
            label="Deposito"
            value="4"
            style={{
              color: 'black',
              backgroundColor: '#fff',
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
                  placeholder="Nombre del banco"
                  placeholderTextColor="#b3b2b7"
                />
              )}
              name="NameBank"
            />
            {errors.NameBank && (
              <Text style={styles.TextAlert}>Este campo es requerido</Text>
            )}
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
                  placeholder="Número de documento"
                  placeholderTextColor="#b3b2b7"
                />
              )}
              name="DocumentNumber"
            />
            {errors.DocumentNumber && (
              <Text style={styles.TextAlert}>Este campo es requerido</Text>
            )}
          </View>
        ) : null}
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
              placeholder="Total"
              placeholderTextColor="#b3b2b7"
            />
          )}
          name="Total"
        />
        {errors.Total && (
          <Text style={styles.TextAlert}>Este campo es requerido</Text>
        )}
        {loadEndProcessTracking ? (
          <LoaderScreen color="black"></LoaderScreen>
        ) : (
          <Button style={styles.Button} onPress={handleSubmit(SendSubmit)}>
            {/* finalizar al contado entrega completa */}
            <Text style={{color: '#fff'}}>Finalizar Contado</Text>
          </Button>
        )}
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
    color: '#000',
    marginTop: '2%',
  },
  inputC1: {
    color: '#000',
  },
  Button: {
    backgroundColor: '#000',
    marginTop: '4%',
  },
});
export default CashPayment;
