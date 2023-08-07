import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import CardCarousel from '../../Components/FlatList/index';

const HomePicking = ({route}) => {
  
  return (
    <View style={styles.container}>
      <CardCarousel content={route.params.detail} />
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

export default HomePicking;
