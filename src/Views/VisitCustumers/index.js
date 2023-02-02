import React, {useLayoutEffect} from 'react';
import {View, LoaderScreen} from 'react-native-ui-lib';
import SearchBar from '../../Components/SearchBar';
import {GetCustumerVendor} from '../../Api/Customers/ApiCustumer';
import {useDispatch, useSelector} from 'react-redux';
import {ScrollView} from 'react-native-gesture-handler';
import {LoadGeCustomer} from '../../Api/Customers/ApiCustumer';
import StylesWrapper from '../../Styles/Wrapers';
import CardCustomer from '../../Components/Cards/CardCustomer';
import {useNavigation} from '@react-navigation/native';
import {SetDefaultCustomerSelect} from '../../Api/Customers/ApiCustumer';
import {GeCustomersVendor} from '../../Api/Customers/ApiCustumer';
import {StyleSheet, Dimensions} from 'react-native';
import {ColorBackroundSecundary} from '../../Assets/Colors/Colors';
const windowHeight = Dimensions.get('window').height;

const VisitirCustomer = () => {
  const Rol = useSelector(state => state.rol.RolSelect);
  const Customer = useSelector(state => state.Customer);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const SubmitSearch = value => {
    dispatch(LoadGeCustomer(true));
    GetCustumerVendor(Rol[0]?.IdRelacion, value, dispatch);
  };
  const HandleSelectCustomer = customer => {
    navigation.navigate('FormCreateVisit');
    dispatch(SetDefaultCustomerSelect(customer));
  };
  useLayoutEffect(() => {
    //dispatch(GeCustomersVendor([]));
  }, []);
  return (
    <ScrollView style={styles.secondWrapper}>
      <View style={styles.WrapperSearchBar}>
        <SearchBar onSubmit={SubmitSearch}></SearchBar>
      </View>

      {Customer.loadCustomer ? (
        <LoaderScreen message="Buscando..." overlay></LoaderScreen>
      ) : (
        <View style={styles.ContainerCard}>
          {Customer.ListCustomer.length > 0
            ? Customer.ListCustomer.map(customer => (
                <CardCustomer
                  data={customer}
                  handleSelectCard={HandleSelectCustomer}
                  subtitle={customer.CardName}
                  title={customer.CardCode}
                  key={customer.CardCode}></CardCustomer>
              ))
            : null}
        </View>
      )}
    </ScrollView>
  );
};
export default VisitirCustomer;

const styles = StyleSheet.create({
  wraper: {
    backgroundColor: ColorBackroundSecundary,
    height: windowHeight,
  },
  secondWrapper: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: ColorBackroundSecundary,
  },
  ContainerCard: {
    width: '100%',
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    paddingLeft: '9%',
  },
  WrapperSearchBar:{
    padding:'4%'
  }
});
