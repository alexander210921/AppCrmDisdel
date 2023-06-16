import React from 'react';
import {View, Picker} from 'react-native-ui-lib';
const CompleteOrder = () => {
    const optionsForCompleteDelevery=[
        {
            label:"Contado",
            value:1
        },
        {
            label:"Crédito",
            value:1
        },
    ];
  return (
    <View>
      <Picker
        placeholder={'Placeholder'}
        onChange={() => console.log('changed')}>
        {optionsForCompleteDelevery.map((option) => (
          <Picker.Item
            key={option.value}
            value={option.value}
            label={option.label}
            disabled={option.disabled}
          />
        ))}
      </Picker>
    </View>
  );
};
export default CompleteOrder;
