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
const imagePath = require('../../Assets/Images/logoDisdel.png');
const imagePathLyG = require('../../Assets/Images/logoLyG.png');
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  GetListProductByCompany,
  SaveProductsByCompany,
} from '../../Api/Products/ApiProduct';
import {AsyncStorageDeleteData, AsyncStorageGetData} from '../../lib/AsyncStorage';
import {  
  GetDocumentsPilot,
  SaveDocumentsAsigned,
  SaveDocumentsRoute,
} from '../../Api/Traking/ApiTraking';
import { AlertConditional } from '../../Components/TextAlert/AlertConditional';
import { LogOutUser } from '../../Api/User/ApiUser';
import geolocation from '@react-native-community/geolocation';
import { StopInitVisit } from '../../lib/Visits';
const HomeRouteVendors = () => {
  const [selectCard, setSelectCard] = useState(false);
  const navigation = useNavigation();
  const DrivingVisitDetail = useSelector(state => state.Mileage);
  const listVisit = useSelector(state => state.Customer);
  const Rol = useSelector(state => state.rol.RolSelect);
  const navigator = useNavigation();
  const company = useSelector(state => state.company.CompanySelected);
  const [loadGetVisit, setLoadGetVisit] = useState(false);
  const [loadGetProduct, setLoadGetProduct] = useState(false);
  const ListProducts = useSelector(state => state.Product.ListProductCompany);
  const User = useSelector(state => state.login.user);
  //const { EmpID } = User;
  const [ListOption, setListOptions] = useState([]);
  const dispatch = useDispatch();
  BackHanlder(navigation, dispatch);
  const FunctionsHome = {
    HandleMarkerSelectCard: function () {
      setSelectCard(!selectCard);
      dispatch(GeCustomersVendor([]));
      navigation.navigate('SearchCustomer');
    },
    HandleGoToVisitCustumer: async function () {
      try {
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
    },
    HandleInitRouteForHome: async function () {
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
        let navigateToRegisterMileague = false;
        const dataMileagueInit = await FunctionGetMileageInit(User.EntityID, 0);
        try {
          if (dataMileagueInit && dataMileagueInit.length == 0) {
            dispatch(SaveIsArriveOrNotTheVisit('Y'));
            navigateToRegisterMileague = true;
          }
        } finally {
          await StartNotification(
            User.EntityID,
            '',
            dispatch,
            navigateToRegisterMileague,
            navigation,
            true,
          );
        }
      } catch (ex) {
        Alert.alert('' + ex);
      } finally {
      }
    },
    HandleGoGasoline: function () {
      navigation.navigate('FormGasoline');
    },
    HandleGoBases: function () {
      navigation.navigate('MenuEndVisit');
    },
    HandleGetProduct: async function () {
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
    },
    GoDocumentsAssigned: async function () {
      try {
        setLoadGetVisit(true);
        //const documents = await GetDocumentsAsignedUser(User?.EmpID);        
        const documents = await GetDocumentsPilot(company?.NombreDB,"Creado",User?.EmpID);
        if (documents == null) {
          Alert.alert('', 'Ocurrió un error intenta nuevamente');
          return;
        }
        if (documents.length == 0) {
          Alert.alert('', 'No tiene documentos asignados actualmente');
          return;
        }

        dispatch(SaveDocumentsAsigned(documents));
        navigation.navigate('TrackingDocumentsAsigned');
      } catch (ex) {
        Alert.alert('', 'Ocurrió un error ' + ex);
      } finally {
        setLoadGetVisit(false);
      }
      //Alert.alert("testeando Opción");
    },
    GetDocumentsInTracking: async function () {
      try {
        setLoadGetVisit(true);
        //const documents = await GetDocumentsInRoute(User?.EmpID);
        //documents acepted
        const documentsAcepted = await GetDocumentsPilot(company?.NombreDB,"RutaIniciada",User?.EmpID);
        const documentsInCourse = await GetDocumentsPilot(company?.NombreDB,"RutaEnCurso",User?.EmpID);
        if (documentsAcepted == null && documentsInCourse) {
          Alert.alert('', 'Ocurrió un error intenta nuevamente');
          return;
        }
        if (documentsAcepted.length == 0 && documentsInCourse.length ==0 ) {
          Alert.alert('', 'No tiene documentos en ruta actualmente');
          return;
        }
        let documents =null;
        if(documentsAcepted!=null){          
          documents =  documentsAcepted?.concat(documentsInCourse);
        }else if(documentsInCourse!=null){          
          documents =  documentsInCourse?.concat(documentsAcepted);
        }
        //console.log(documents);
        dispatch(SaveDocumentsRoute(documents));
        navigation.navigate("TrackingDocumentInRoute");
      } finally {
        setLoadGetVisit(false);
      }
    },
    HandleInitRouteForHomePilot: async function () {
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
        // const visits = await FunctionGetCurrentVisit(
        //   Rol[0].IdRelacion,
        //   dispatch,
        //   true,
        //   navigator,
        // );
        // if (visits != null && visits.length > 0) {
        //   dispatch(SetVisiActualityt(visits));
        // } else if (visits.length == 0) {
        //   dispatch(SetVisiActualityt([]));
        //   dispatch(LoadGetVisitActuality(false));
        //   Alert.alert('', 'No tiene visitas creadas');
        //   return;
        // }
        let navigateToRegisterMileague = false;
        //const dataMileagueInit = await FunctionGetMileageInit(User.EntityID, 0);
        try {
          // if (dataMileagueInit && dataMileagueInit.length == 0) {
          //   dispatch(SaveIsArriveOrNotTheVisit('Y'));
          //   //navigateToRegisterMileague = true;
          // }
        } finally {
          await StartNotification(
            User.EntityID,
            '',
            dispatch,
            navigateToRegisterMileague,
            navigation,
            true,
          );
        }
      } catch (ex) {
        Alert.alert('' + ex);
      } finally {
      }
    },

  };

  useEffect(() => {
    async function GetOptionsUser() {
      if (ListOption?.length == 0) {
        const restoreOption = await AsyncStorageGetData('@Options');
        if (restoreOption != null) {
          setListOptions(JSON.parse(restoreOption));
        }
      }
    }
    async function StopVisit() {
      if (
        DrivingVisitDetail.isRouteInCourse &&
        !BackgroundService.isRunning()
      ) {
        await StartNotification(
          User.EntityID,
          '',
          dispatch,
          false,
          null,
          false,
        );
      }
    }
    if (!User) {
      navigation.navigate('Login');
      return;
    }
    GetOptionsUser();
    StopVisit();
  }, [User]);
  const ExitAppSesion=async()=>{
    dispatch(LogOutUser());
    await AsyncStorageDeleteData("@User");
    await AsyncStorageDeleteData("@Options");
    await AsyncStorageDeleteData("@Rol");
    await AsyncStorageDeleteData("@Company");
    await StopInitVisit(null,dispatch);       
    if(BackgroundService.isRunning()){
      try{
       await BackgroundService.stop();
        geolocation .clearWatch(0);
      }catch{

      }
    }
    navigation.navigate("Login");
  }
  const HandleCloseSesion=()=>{
    AlertConditional(ExitAppSesion,function(){},"","¿Está seguro de cerrar su sesión?");
  }
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
          <View flex right>
            <TouchableOpacity onPress={HandleCloseSesion}>
              <View>
                {/* <Text>Salir</Text> */}
                <Icon color="gray" size={30} name="exit-to-app"></Icon>
              </View>
            </TouchableOpacity> 
            </View>
          <View style={styles.container}>            
            {ListOption && ListOption.length > 0 ? (
              <View style={styles.row}>
                {/* {console.log("aaa",ListOption)} */}
                {ListOption.map((optiona, index) => (
                  <PastelCard
                    key={index}
                    onPress={() => {
                      if (
                        optiona.Controlador == null ||
                        optiona.Controlador == ''
                      ) {
                        Alert.alert(
                          '',
                          'Esta opción no está configurada para realizar una acción',
                        );
                        return;
                      }
                      if (FunctionsHome[optiona.Controlador]) {
                        FunctionsHome[optiona.Controlador]();
                      } else {
                        Alert.alert('', 'Se está trabajando en esta opción');
                      }
                    }}
                    nameIcon={optiona.Icono ? optiona.Icono : 'warehouse'}
                    title={
                      optiona.NombreOpcion
                        ? optiona.NombreOpcion
                        : 'Sin título de opción'
                    }
                    color={optiona.HasColor ? optiona.HasColor : '#fff'}
                  />
                ))}
              </View>
            ) : null}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
export default HomeRouteVendors;
const styles = StyleSheet.create({
  card: {
    height: '17%',
    borderColor: 'black',
    marginTop: '4%',
    backgroundColor: '#CED3F2',
    color: 'black',
  },
  WrapperCustomer: {
    ...StylesWrapper.wraper,
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  row: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    marginBottom: 10,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  card: {
    flex: 1,
    borderRadius: 10,
    margin: 5,
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
    width: '45%',
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
