import React, {useState} from 'react';
import {Button, View, Text} from 'react-native-ui-lib';
import {Picker} from '@react-native-picker/picker';
import {ScrollView, StyleSheet, TextInput, Alert} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import { ArriveDelevery } from '../../../Api/Traking/ApiTraking';

const CashPayment = () => {
  const [selectedOption, setSelectedOption] = useState(1);
  const SendSubmit = async (FormData) => {    
    console.log("Si ajá",FormData);
      let Data = null;
      let liquidar = null;
      Data.Estado = 4;
      Data.AuxIdentificador = 2;
      Data.eventosDocument = 2;
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
        NameUser: Datos ? Datos.NombreCompleto : '',
        IdUser: EmpID,
        TipoPago: liquidar.tipopago,
        BancoPago: liquidar.nombrebanco,
        DocumentoPago: liquidar.numeroDocumento,
        TotalPago: parseFloat(liquidar.totalDocumento),
        ContrasenaDocumento: liquidar.contrasenaDoc,
        TramiteContrasena: liquidar.tramiteContrasena,
        Firma: liquidar.tieneFirma ? true : false,
        FechaCobro: liquidar.fechaCobro,
        TotalDocumento: liquidar.totalDoc,
        CardName: Data.AuxNombreCliente,
        TipoObjeto:
          DetalleRuta.tipoPagoDocument === '1' ? 'Contado' : 'Credito',
        EstadoLiquidacion: 4,
      };

      Data.ListaLiquidada = liquidacion;

    //const result = await ArriveDelevery();
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
       
          onValueChange={
            itemValue => {              
              setSelectedOption(itemValue);
            }
          }>
          <Picker.Item
            label="Cheque"
            value="1"
            style={{
              color: 'black',
              backgroundColor:'#fff'
            }}
          />
          <Picker.Item
            label="Efectivo"
            value="2"
            style={{
              color: 'black',
              backgroundColor:'#fff'
            }}
          />
          <Picker.Item
            label="Transferencia"
            value="3"
            style={{
              color: 'black',
              backgroundColor:'#fff'
            }}
          />
          <Picker.Item
            label="Deposito"
            value="4"
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
        <Button
          style={
            styles.Button
          }
          onPress={handleSubmit(SendSubmit)}>
          {/* finalizar al contado entrega completa */}
          <Text style={{color: '#fff'}}>Finalizar</Text>
        </Button>
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
  inputC1: {
    color:'#000',
  },
  Button:{
    backgroundColor: '#000',
    marginTop:'4%'
  }
});
export default CashPayment;
