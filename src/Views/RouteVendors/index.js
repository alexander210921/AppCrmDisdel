import React, {useState, useEffect} from 'react';
import {View, LoaderScreen, Text} from 'react-native-ui-lib';
import StylesWrapper from '../../Styles/Wrapers';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Alert, ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {BackHanlder} from '../../lib/ExitApp';
import {
  LoadGetVisitActuality,
  FunctionGetCurrentVisit,
  SetVisiActualityt,
} from '../../Api/Customers/ApiCustumer';
import {StartNotification} from '../VisitCustumers/VisitCreated';
import {Image} from 'react-native';
import {
  FunctionGetMileageInit,
  SaveIsArriveOrNotTheVisit,
} from '../../Api/Customers/ApiCustumer';
import {GeCustomersVendor} from '../../Api/Customers/ApiCustumer';
import BackgroundService from 'react-native-background-actions';
import {StopInitVisit} from '../../lib/Visits';
import {SetActualityCoords} from '../../Api/User/ApiUser';
import {GetGeolocation} from '../../lib/Permissions/Geolocation';
const imagePath = require('../../Assets/Images/logoDisdel.png');
const imagePathLyG = require('../../Assets/Images/logoLyG.png');
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GetListProductByCompany, SaveProductsByCompany } from '../../Api/Products/ApiProduct';

const HomeRouteVendors = () => {
  const [selectCard, setSelectCard] = useState(false);
  const navigation = useNavigation();
  const DrivingVisitDetail = useSelector(state => state.Mileage);
  const listVisit = useSelector(state => state.Customer);
  const Rol = useSelector(state => state.rol.RolSelect);
  const navigator = useNavigation();
  const company = useSelector(state => state.company.CompanySelected);
  const [loadGetVisit, setLoadGetVisit] = useState(false);
  const [loadGetProduct,setLoadGetProduct] = useState(false);
  const ListProducts = useSelector(state=>state.Product.ListProductCompany);    
  const pastelColors = [
    '#E5D8CF',
    '#B7DDE8',
    '#E8D9B9',
    '#C4D7CF',
    '#CED3F2',
    '#f2f2f2',
    "#F6F6EB",
    "#F5D5CB",
  ];
  const dispatch = useDispatch();
  BackHanlder(navigation, dispatch);
  const HandleMarkerSelectCard = () => {
    setSelectCard(!selectCard);
    dispatch(GeCustomersVendor([]));
    navigation.navigate('SearchCustomer');
  };
  const HandleInitRouteForHome = async () => {
    if (DrivingVisitDetail.isRouteInCourse) {
      Alert.alert('La ruta ya ha sido iniciada');
      return;
    }
    if (listVisit.loadGetCurrentVisit) {
      Alert.alert('', 'Se está cargando el proceso, por favor espere');
      return;
    }
    try {
      dispatch(LoadGetVisitActuality(true));
      const visits = await FunctionGetCurrentVisit(
        Rol[0].IdRelacion,
        dispatch,
        true,
        navigator,
      );
      if (visits != null && visits.length > 0) {
        dispatch(SetVisiActualityt(visits));
      } else if (visits.length == 0) {
        dispatch(SetVisiActualityt([]));
        dispatch(LoadGetVisitActuality(false));
        Alert.alert('', 'No tiene visitas creadas');
        return;
      }
      // const isValidateGPS = await GetGeolocation();
      // if (!isValidateGPS.Status) {
      //   Alert.alert('Intente nuevamente', isValidateGPS.Message);
      //   return;
      // }
      // if (
      //   isValidateGPS.Data.coords.latitude != 0 &&
      //   isValidateGPS.Data.coords.longitude != 0
      // ) {
      //   dispatch(
      //     SetActualityCoords({
      //       latitude: isValidateGPS.Data.coords.latitude,
      //       longitude: isValidateGPS.Data.coords.longitude,
      //     }),
      //   );
      // }
      
      let navigateToRegisterMileague = false;
      const dataMileagueInit = await FunctionGetMileageInit(User.EntityID, 0);
      //dispatch(LoadGetVisitActuality(false));
      try {
        if (dataMileagueInit && dataMileagueInit.length == 0) {
          dispatch(SaveIsArriveOrNotTheVisit('Y'));
          navigateToRegisterMileague = true;
          //navigation.navigate('FormCreateRoute');
        }
      } finally {
        await StartNotification(User.EntityID, '', dispatch,navigateToRegisterMileague,navigation);
        //dispatch(LoadGetVisitActuality(false));
      }

      //Alert.alert('', 'Ruta Iniciada con éxito');
    } catch (ex) {
      Alert.alert('' + ex);
    } finally {
     // dispatch(LoadGetVisitActuality(false));
    }
  };
  const HandleGoBases = () => {
    navigation.navigate('MenuEndVisit');
  };
  const HandleGetProduct =async () => {  
    try {
      if (ListProducts && ListProducts.length == 0) {
        setLoadGetProduct(true);
        const ListProduct = await GetListProductByCompany(company?.NombreDB);
        if (ListProduct == null || ListProduct?.length == 0) {
          Alert.alert('', 'No se encontraron productos');
          return;
        }
        dispatch(SaveProductsByCompany(ListProduct));
      }      
      navigation.navigate('ListProductHome');
    } finally {
      setLoadGetProduct(false);
    }  
    
  };
  const HandleGoGasoline = () => {
    navigation.navigate('FormGasoline');
  };

  const HandleGoToVisitCustumer = async () => {
    try {
      //dispatch(LoadGetVisitActuality(true));
      setLoadGetVisit(true);
      const visits = await FunctionGetCurrentVisit(
        Rol[0].IdRelacion,
        dispatch,
        true,
        navigator,
      );
      if (visits != null && visits.length > 0) {
        dispatch(SetVisiActualityt(visits));
      } else if (visits != null && visits.length == 0) {
        dispatch(SetVisiActualityt([]));
      }
    } catch (ex) {
      Alert.alert('' + ex);
    } finally {
      setLoadGetVisit(false);
      navigation.navigate('VisitCreated');
    }
  };

  const User = useSelector(state => state.login.user);
  useEffect(() => {
    async function StopVisit() {
      if (
        DrivingVisitDetail.isRouteInCourse &&
        !BackgroundService.isRunning()
      ) {
        await StopInitVisit(null, dispatch);
      }
    }
    StopVisit();
    if (!User) {
      navigation.navigate('Login');
      return;
    }
  }, [User]);

  const PastelCard = ({
    color,
    title = '',
    nameIcon = 'bag-personal',
    onPress,
  }) => {
    return (
      <TouchableOpacity
        style={[styles.button, {backgroundColor: color}]}
        onPress={onPress}>
        <View style={[styles.card, {backgroundColor: color}]}>
          <Icon name={nameIcon} size={30} color="#fff" style={styles.icon} />
          <Text style={[styles.title, {color: 'black'}]}>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.WrapperCustomer}>
      <View style={{height: '100%'}}>
        <ScrollView contentContainerStyle={{paddingBottom: 50}}>
          {listVisit.loadGetCurrentVisit || loadGetVisit || loadGetProduct ? (
            <LoaderScreen
              style={{height: '4%'}}
              color="black"
              message=""></LoaderScreen>
          ) : (
            <View
              style={{
                borderColor: 'black',
                height: '10%',
                position: 'relative',
                width: '100%',
              }}
              right>
              <Image
                style={{width: '100%', height: '100%', left: '30%'}}
                resizeMode="center"
                source={
                  company?.EntityID == 1009 ? imagePathLyG : imagePath
                }></Image>
            </View>
          )}

          <View style={styles.container}>
            <View style={styles.row}>
              <PastelCard
                onPress={HandleMarkerSelectCard}
                nameIcon="bag-personal"
                title="Crear nueva visita"
                color={pastelColors[0]}
              />
              <PastelCard
                onPress={HandleGoToVisitCustumer}
                nameIcon="progress-download"
                title="Ver visitas en curso"
                color={pastelColors[1]}
              />
            </View>
            <View style={styles.row}>
              <PastelCard
                onPress={HandleInitRouteForHome}
                nameIcon="map-marker-plus"
                title="Iniciar Ruta"
                color={
                  !DrivingVisitDetail.isRouteInCourse &&
                  !listVisit.loadGetCurrentVisit
                    ? pastelColors[2]
                    : pastelColors[5]
                }
              />
              <PastelCard
                onPress={HandleGoGasoline}
                nameIcon="gas-station"
                title="Gasolina"
                color={pastelColors[3]}
              />
            </View>
            <View style={styles.row}>
              <PastelCard
                onPress={HandleGoBases}
                nameIcon="warehouse"
                title="Ir a base"
                color={pastelColors[4]}
              />
              <PastelCard
                onPress={HandleGetProduct}
                nameIcon="cart"
                title="Productos"
                color={pastelColors[6]}
              />
            </View>
            {/* <View style={styles.row}>
            <PastelCard
                onPress={HandleGetProduct}
                nameIcon="shopping-outline"
                title="Pedidos"
                color={pastelColors[7]}
              />
            </View> */}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
export default HomeRouteVendors;
const styles = StyleSheet.create({
  wrapperButtons: {
    margin: '1%',
    //marginBottom: '10%',
  },
  HeaderSection: {
    height: '100%',
    backgroundColor: '#f3f5f7',
  },
  card: {
    height: '17%',
    borderColor: 'black',
    marginTop: '4%',
    backgroundColor: '#CED3F2',
    color: 'black',
  },
  card2: {
    height: '17%',
    borderColor: 'black',
    marginTop: '4%',
    backgroundColor: '#D0F2E9',
    color: 'black',
  },
  card3: {
    height: '17%',
    borderColor: 'black',
    marginTop: '4%',
    backgroundColor: '#F2E8C9',
    color: 'black',
  },
  card4: {
    height: '17%',
    borderColor: 'black',
    marginTop: '4%',
    backgroundColor: '#F2D8CE',
    color: 'black',
  },
  card5: {
    height: '17%',
    borderColor: 'black',
    marginTop: '4%',
    backgroundColor: 'gray',
    color: 'black',
  },
  selectOptionCard: {
    color: 'green',
  },
  ButtonDisable: {
    backgroundColor: '#f2f2f2',
    color: '#a9a9a9',
    height: '17%',
    shadowColor: 'shadow',
    marginTop: '4%',
  },
  WrapperCustomer: {
    ...StylesWrapper.wraper,
    //marginBottom:'3%',
    flex: 1,
    //height:'100%'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  card: {
    flex: 1,
    borderRadius: 10,
    margin: 5,
    justifyContent: 'flex-end',
  },
  icon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  title: {
    position: 'absolute',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    bottom: '40%',
    width: '100%',
  },
  button: {
    width: '50%',
    aspectRatio: 1,
    borderRadius: 10,
    marginHorizontal: 5,
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
