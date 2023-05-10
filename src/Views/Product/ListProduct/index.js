import React from 'react';
import {View} from 'react-native-ui-lib';
import {StyleSheet, ScrollView} from 'react-native';
import ListProduct from './ListProduct';
import {useSelector} from 'react-redux';
const ListProductHome = () => {
  const ListProducts = useSelector(state => state.Product.ListProductCompany);
  return (
    <ScrollView style={styles.BackroundColor}>
      <View flex>
        {ListProducts ? (
          <ListProduct ListData={ListProducts}></ListProduct>
        ) : null}
      </View>
    </ScrollView>
  );
};
export default ListProductHome;

const styles = StyleSheet.create({
  BackroundColor: {
    backgroundColor: '#f5f4f0',
  },
});
