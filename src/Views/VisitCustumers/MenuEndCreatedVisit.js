import {View, Text,  LoaderScreen} from 'react-native-ui-lib';
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
import {FunctionGetCustomerDefaultForRoute, LoadGetVisitActuality, SetVisitCustomer} from '../../Api/Customers/ApiCustumer';
import {AddVisit} from '../../Api/Customers/ApiCustumer';
import { StartNotification } from './VisitCreated';
import { BackHanlderMenuPrincipal } from '../../lib/ExitApp';
import { GetGeolocation } from '../../lib/Permissions/Geolocation';
import { SetActualityCoords } from '../../Api/User/ApiUser';
let ClientDefault = null;
const MenuEndVisit = () => {
  let basesSelected=null;  
  const User = useSelector(state => state.login.user);
  const Rol = useSelector(state => state.rol.RolSelect);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [bases, setBases] = useState([]);
  const [isLoad, setIsLoad] = useState(false);
  const [isLoadVisit, setIsLoadVisit] = useState(false);
  const [baseSelect, setBaseSelect] = useState(null);
  const company = useSelector(state=>state.company.CompanySelected);
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
          Comentario:'YENDO A LA BASE: '+basesSelected['<NombreBase>k__BackingField']
        });
        const dataForBase={
          CardCode: ClientDefault ? ClientDefault.CardCode:'C46306293',
          CardName:ClientDefault ? ClientDefault.CardName: 'DISDEL, S.A.',
          Comentario: 'YENDO A LA BASE: '+basesSelected['<NombreBase>k__BackingField'],
          IdRegistro: 0,
          Contacto: '',
          Longitud: 0,
          Latitud: 0,
          ShipToCode: '',
          Kilometraje: 0,
          IdRelacion: Rol[0]?.IdRelacion,
          EsRegreso:'Y'
        }
        const statusCreateVisit = await SetVisitCustomer(
          dataForBase,
          dispatch,
          navigation,
          false,
          false,
          '',
        );
        if (statusCreateVisit != null && statusCreateVisit.Resultado) {
          dispatch(
            AddVisit({
              CardCode: dataForBase.CardCode,
              CardName: dataForBase.CardName,
              IdRegistro: statusCreateVisit.DocNum,
              Comentario:dataForBase.Comentario,
              EsRegreso:'Y'
            }),
          );
          dispatch(LoadGetVisitActuality(true));          
          // const isValidateGPS = await GetGeolocation();
          // if(!isValidateGPS.Status){   
          //   Alert.alert("","Enciende tu GPS para continuar");          
          //     return;
          // }          
          // if(isValidateGPS.Data.coords.latitude!=0  && isValidateGPS.Data.coords.longitude!=0 ){
          //   dispatch(SetActualityCoords({
          //     latitude:isValidateGPS.Data.coords.latitude,
          //     longitude:isValidateGPS.Data.coords.longitude
          //   }));
          // } 
          await StartNotification(User.EntityID,"",dispatch,false,nul,true);
          ClientDefault=null;
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
      const CustomerDefault = await FunctionGetCustomerDefaultForRoute(User.EntityID,company.NombreDB);            
      if(CustomerDefault?.CardCode){
        ClientDefault = {
          CardCode:CustomerDefault.CardCode,
          CardName:CustomerDefault.CardName,
        }
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
                subtitle={''}
                title={base['<Descripcion>k__BackingField']+" / "+base['<NombreBase>k__BackingField']}></CardVisit>
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
