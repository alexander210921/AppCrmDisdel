import {View, Text, Card, LoaderScreen} from 'react-native-ui-lib';
import React, {useState , useEffect} from 'react';
import {Alert, ScrollView, StyleSheet} from 'react-native';
import StylesWrapper from '../../Styles/Wrapers';
import stylesTitle from '../../Styles/Titles';
import {useDispatch, useSelector} from 'react-redux';
import PhotoProfile from '../../Components/Header/HeaderAvatar';
import {useNavigation} from '@react-navigation/native';
import {GetBasesVendor} from '../../Api/Vendors/ApiVendors';
import CardVisit from '../../Components/Cards/Card1';
import {AlertConditional} from '../../Components/TextAlert/AlertConditional';
import {FunctionGetCustomerDefaultForRoute, SetVisitCustomer} from '../../Api/Customers/ApiCustumer';
import {AddVisit} from '../../Api/Customers/ApiCustumer';
import { StartNotification } from './VisitCreated';
import { BackHanlderMenuPrincipal } from '../../lib/ExitApp';
const MenuEndVisit = () => {
  let basesSelected=null;
  const User = useSelector(state => state.login.user);
  const ListRoutes = useSelector(state => state.Customer);
  const Rol = useSelector(state => state.rol.RolSelect);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [bases, setBases] = useState([]);
  const [isLoad, setIsLoad] = useState(false);
  const [isLoadVisit, setIsLoadVisit] = useState(false);
  const [baseSelect, setBaseSelect] = useState(null);
  BackHanlderMenuPrincipal(navigation);
  const [dataVisitReturn, setDataVisitReturn] = useState({
    CardCode: 'C46306293',
    CardName: 'DISDEL, S.A.',
    Comentario: 'DE REGRESO A LA BASE',
    IdRegistro: 0,
    Contacto: '',
    Longitud: 0,
    Latitud: 0,
    ShipToCode: '',
    Kilometraje: 0,
    IdRelacion: Rol[0]?.IdRelacion,
    EsRegreso:'Y'
  });
  const goToCreateMoreVisit = () => {
    navigation.navigate('VisitCreated');
  };
  useEffect(()=>{
    async function getBase(){
      await GetBasesUser();
    }
    getBase();
  },[])
  const CreateAVisitBase = async () => {
    setIsLoadVisit(true);      
    try {
      if (basesSelected) {
        setDataVisitReturn({
          ...dataVisitReturn,
          Direccion:
          basesSelected['<Descripcion>k__BackingField'] +
            ': ' +
            basesSelected['<NombreBase>k__BackingField'],
          Comentario:'DE REGRESO A LA BASE: '+basesSelected['<NombreBase>k__BackingField']
        });
        const statusCreateVisit = await SetVisitCustomer(
          dataVisitReturn,
          dispatch,
          navigation,
          false,
          false,
          '',
        );
        if (statusCreateVisit != null && statusCreateVisit.Resultado) {
          dispatch(
            AddVisit({
              CardCode: dataVisitReturn.CardCode,
              CardName: dataVisitReturn.CardName,
              IdRegistro: statusCreateVisit.DocNum,
              Comentario:dataVisitReturn.Comentario,
              EsRegreso:'Y'
            }),
          );
          await StartNotification(User.EntityID,"",dispatch);
          navigation.navigate('VisitCreated');
        } else if (statusCreateVisit != null && !statusCreateVisit.Resultado) {
          Alert.alert(statusCreateVisit.Mensaje);
        }
      }
    } finally {
      setIsLoadVisit(false);
    }
  };
  const SelectBase = base => {    
     setBaseSelect(base);
     basesSelected = base;
    try {      
      AlertConditional(
        CreateAVisitBase,
        function () {},
        'Ir a base',
        '¿Está seguro de ir a esta base?',
      );
    } catch (ex) {
      Alert.alert('' + ex);
    }
  };
  const GetBasesUser = async () => {
    try {
      setIsLoad(true);
      const bases = await GetBasesVendor(User.EntityID);
      //validar la compania
      const CustomerDefault = await FunctionGetCustomerDefaultForRoute(User.EntityID,"SBO_DISDELSA_2013");            
      if(CustomerDefault?.CardCode){
        setDataVisitReturn(
            {
                ...dataVisitReturn,
                CardCode:CustomerDefault.CardCode,
                CardName:CustomerDefault.CardName,
            }
        );
      }
      if (bases && bases.length > 0) {
        setBases(bases);
      } else if (bases && bases.length == 0) {
        Alert.alert(
          'No posee bases',
          'Estimado usuario no posee bases asignadas',
        );
      }
    } finally {
      setIsLoad(false);
    }
  };
  return (
    <ScrollView style={StylesWrapper.secondWrapper}>
      <View style={StylesWrapper.wraper}>
        <View right>
          {User?.ImagePath ? (
            <PhotoProfile image={User.ImagePath}></PhotoProfile>
          ) : null}
        </View>
        <View top style={styles.wrapperButtons}>
          <View left>
            <Text style={stylesTitle.TitleMedium}> ¿Dónde quieres ir? </Text>
          </View>
        </View>
        {/* <Card
          selected={false}
          selectionOptions={styles.selectOptionCard}
          elevation={10}
          flexS
          style={styles.card}
          flex
          center
          onPress={goToCreateMoreVisit}>
          <Text>Ir a otra visita</Text>
        </Card> */}
        {/* <Card
          selected={false}
          selectionOptions={styles.selectOptionCard}
          elevation={10}
          flexS
          style={styles.card2}
          flex
          center
          onPress={GetBasesUser}>
          <Text>Regresar a base</Text>
        </Card> */}
        <View style={styles.ContainerCardsBase} center>
          {isLoad ? (
            <LoaderScreen color="black" messague="Cargando..."></LoaderScreen>
          ) : null}
          {isLoadVisit ? (
            <LoaderScreen
              color="black"
              messague="Preparándonos para el regreso"></LoaderScreen>
          ) : bases.length > 0 ? (
            bases.map((base, index) => (
              <CardVisit
                key={index}
                data={base}
                handleSelectCard={SelectBase}
                principalColor="#F3BBB1"
                subtitle={base['<NombreBase>k__BackingField']}
                title={base['<Descripcion>k__BackingField']}></CardVisit>
            ))
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
};
export default MenuEndVisit;
const styles = StyleSheet.create({
  wrapperButtons: {
    margin: '1%',
    marginBottom: '10%',
  },
  HeaderSection: {
    height: 80,
    backgroundColor: '#f3f5f7',
  },
  card: {
    height: '17%',
    borderColor: 'black',
    marginTop: '4%',
    backgroundColor: '#CECBD6',
  },
  card2: {
    height: '17%',
    borderColor: 'black',
    marginTop: '4%',
    backgroundColor: '#CAE9E0',
  },
  selectOptionCard: {
    color: 'green',
  },
  ContainerCardsBase: {
    marginTop: 20,
  },
});
