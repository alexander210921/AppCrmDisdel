import React,{useState} from 'react';
import {View, LoaderScreen} from 'react-native-ui-lib';
import SearchBar from '../../Components/SearchBar';
import {
  FunctionGetCustomerActive,
  FunctionGetCustomerAdressList,
  FunctionGetCustomerFiscalAdressList,
  FunctionGetDetailCustomer,
  GetCustumerVendor,
  SaveDetailCustomer,
} from '../../Api/Customers/ApiCustumer';
import {useDispatch, useSelector} from 'react-redux';
import {ScrollView} from 'react-native-gesture-handler';
import {LoadGeCustomer} from '../../Api/Customers/ApiCustumer';
import CardCustomer from '../../Components/Cards/CardCustomer';
import {useNavigation} from '@react-navigation/native';
import {SetDefaultCustomerSelect} from '../../Api/Customers/ApiCustumer';
import {StyleSheet, Dimensions, Alert} from 'react-native';
import {ColorBackroundSecundary} from '../../Assets/Colors/Colors';
import {
  FunctionGetAdressCustomer,
  LoadGetAdressCustomer,
} from '../../Api/Customers/ApiCustumer';
import {BackHanlderMenuPrincipal} from '../../lib/ExitApp';

const windowHeight = Dimensions.get('window').height;

const VisitirCustomer = () => {
  const Rol = useSelector(state => state.rol.RolSelect);
  const company = useSelector(state => state.company.CompanySelected);
  const Customer = useSelector(state => state.Customer);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loadGetDetail,setLoadGetDetail] = useState(false);
  BackHanlderMenuPrincipal(navigation);
  const SubmitSearch = value => {
    if (value == null || value == '') {
      return;
    }
    value = value.trim();
    dispatch(LoadGeCustomer(true));
    GetCustumerVendor(Rol[0]?.IdRelacion, value, dispatch);
  };
  const HandleSelectCustomer = customer => {
    //get addres customer
    try{
      setLoadGetDetail(true);
      dispatch(LoadGetAdressCustomer(true));
      dispatch(SetDefaultCustomerSelect(customer));
      FunctionGetAdressCustomer(
        customer.CardCode,
        company.NombreDB ? company.NombreDB : 'SBO_DISDELSA_2013',
        dispatch,
        true,
        navigation,
      );
    }catch(ex){
      Alert.alert("","ocurrió un error: "+ex);
    }finally{
      setLoadGetDetail(false);  
    }
  };
  const GoDetailCustomer = async customer => {
    try {
      setLoadGetDetail(true);
      const infoCustomer = await FunctionGetDetailCustomer(
        customer.CardCode,
        company.NombreDB,
      );
      const ActiveCustonmer = await FunctionGetCustomerActive(
        customer.CardCode,
        company.NombreDB,
      );
      const FiscalAdress = await FunctionGetCustomerFiscalAdressList(
        customer.CardCode,
        company.NombreDB,
      );
      const Adress = FunctionGetCustomerAdressList(
        customer.CardCode,
        company.NombreDB,
      );
      if(infoCustomer &&ActiveCustonmer&&FiscalAdress&&Adress){
        dispatch(SaveDetailCustomer(infoCustomer));
        //console.log(infoCustomer);
        navigation.navigate("DetailCustomer");
      }else{
        Alert.alert("","Ocurrió un problema, intente nuevamente");
      }
      //console.log(Adress);
    } catch (ex) {
      Alert.alert('Ocurrió un error: ' + ex);
      setLoadGetDetail(false);
    }finally{
      setLoadGetDetail(false);
    }
  };
  return (
    <ScrollView style={styles.secondWrapper}>
      <View style={styles.WrapperSearchBar}>
        <SearchBar focus={true} onSubmit={SubmitSearch}></SearchBar>
        {loadGetDetail ? <LoaderScreen message="Cargando..." color="black"></LoaderScreen>:null}
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
                  key={customer.CardCode}
                  PressCustomer={GoDetailCustomer}></CardCustomer>
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
  WrapperSearchBar: {
    padding: '4%',
  },
});
