import React, {  useLayoutEffect } from 'react';
import {
  View,
  LoaderScreen,
 
} from 'react-native-ui-lib';
import SearchBar from '../../Components/SearchBar';
import {GetCustumerVendor} from '../../Api/Customers/ApiCustumer';
import {useDispatch, useSelector} from 'react-redux';
import {ScrollView} from 'react-native-gesture-handler';
import {LoadGeCustomer} from '../../Api/Customers/ApiCustumer';
import StylesWrapper from '../../Styles/Wrapers';
import CardCustomer from '../../Components/Cards/CardCustomer';
import { useNavigation } from '@react-navigation/native';
import { SetDefaultCustomerSelect } from '../../Api/Customers/ApiCustumer';
import { GeCustomersVendor } from '../../Api/Customers/ApiCustumer';
const VisitirCustomer = () => {
  const Rol = useSelector(state => state.rol.RolSelect);
  const Customer = useSelector(state => state.Customer);
  const navigation  = useNavigation();
  const dispatch = useDispatch();
  const SubmitSearch = value => {
    dispatch(LoadGeCustomer(true));
    GetCustumerVendor(Rol[0]?.IdRelacion, value, dispatch);
  };
  const HandleSelectCustomer=(customer)=>{
    navigation.navigate("FormCreateVisit");
    dispatch(SetDefaultCustomerSelect(customer));
  }
  useLayoutEffect(()=>{
    dispatch(GeCustomersVendor([]));
  },[])
  return (
    <ScrollView style={StylesWrapper.secondWrapper}>
        <SearchBar onSubmit={SubmitSearch}></SearchBar>
        {Customer.loadCustomer ? (
          <LoaderScreen message="Buscando..." overlay></LoaderScreen>
        ) : (
          <View>
            {Customer.ListCustomer.length > 0
              ? Customer.ListCustomer.map(customer => (
                  <CardCustomer data={customer} handleSelectCard ={HandleSelectCustomer} subtitle={customer.CardName} title={customer.CardCode} key={customer.CardCode}></CardCustomer>
                ))
              : null}
          </View>
        )}
    </ScrollView>
  );
};
export default VisitirCustomer;
