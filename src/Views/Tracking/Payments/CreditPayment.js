import React, {useState} from 'react';
import {Button, View, Text} from 'react-native-ui-lib';
import {Picker} from '@react-native-picker/picker';
import {ScrollView, StyleSheet, TextInput, Alert} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import DateTimePicker from 'react-native-modal-datetime-picker';

const CreditPayment = () => {
  const [selectedOption, setSelectedOption] = useState(1);
  const [isDatePicketVisible, setIsDatePicketVisible] = useState(false);
  const [dateSelected,setDateSelected] = useState(null);
  const SendSubmit = FormData => {
    console.log(FormData);
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
            <Text style={{color: '#000'}}>{dateSelected?.toString()}</Text>

            <DateTimePicker
              isVisible={isDatePicketVisible}
              mode="date"
              onConfirm={handlerConfirm}
              onCancel={hideDatePicker}
            />
          </View>
        ) : null}

        <Button style={styles.Button} onPress={handleSubmit(SendSubmit)}>
          {/* finalizar al contado entrega completa */}
          <Text style={{color: '#fff'}}>Finalizar Crédito</Text>
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
