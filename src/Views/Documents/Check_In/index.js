// App.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import HeaderData from './HeaderData';

const CheckInIndex = () => {
  return (
      <View style={styles.container}>
        <HeaderData />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CheckInIndex;
