import React, { useEffect, useState } from 'react';
import {
  View,  
  Text,
  LoaderScreen
} from 'react-native-ui-lib';
import {useForm, Controller} from 'react-hook-form';
import {TextInput, StyleSheet, Alert,ScrollView, BackHandler} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ButtonPrimary from '../../Components/Buttons/ButtonPrimary';
import {GetGeolocation} from '../../lib/Permissions/Geolocation';
import {
  LoadSetRegisterVisit,
  FunctionUpdateVisit,
  SaveVisitCreated,
  SaveIdWatch,
  SetIsInitDrivingVisit,
  SaveUUIDRoute,
  FunctionSetCoordsDetail,
  DeleteVisit
} from '../../Api/Customers/ApiCustumer';
import {useNavigation} from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import { AsyncStorageDeleteData, AsyncStorageSaveData } from '../../lib/AsyncStorage';
import { AlertConditional } from '../../Components/TextAlert/AlertConditional';
import { StartNotification } from './VisitCreated';
import SearchableDropdownV2 from '../../Components/SearchList/SearchListV2';
const FormFinaliceVisit = () => { 
  //ADD PHOTO END
  const navigation = useNavigation();
  const dispatch = useDispatch();
  //const CoordsDestination = useSelector(state => state.login);
  const dataVisist = useSelector(state => state.Customer.VisitDetailSelected);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      CustomerCode: '',
      CustomerName: '',
      Contact: '',
      Title: '',
      NextDate: '',
      NextHourDate: '',
      Bill: '',
      Comment: '',
      Tema:dataVisist.Titulo ? dataVisist.Titulo:''
    },
  }); 
  const Rol = useSelector(state => state.rol.RolSelect);
  const DrivingVisitDetail = useSelector(state => state.Mileage);
  const [loadFinishVisit,setLoadFinishVisit] = useState(false);
  const isEndVisit = useSelector(state=>state.Customer);
  const [contactSelect,setContactSelect] = useState("");
  const [ListContact,setListContact]  = useState(isEndVisit.ListContactPerson.map((item,index)=>{
    return{
      name:item.Nombre+" / "+item.PrimerNombre+" "+item.SegundoNombre+" "+item.Apellido,
      id:index
      }
  }));
  const User = useSelector(state => state.login.user);  
  const [loadinitnewVisit,setLoadnewVisit] = useState(false);
  const InitVisittoFisnish=async ()=>{
    try{
      if(isEndVisit.RoutesInProgress.length ==1 || isEndVisit.RoutesInProgress.length ==0){
        await AsyncStorageSaveData("AUTOMATIC_INIT_ROUTE","Y");
        navigation.navigate("SearchCustomer");
        return;
      }
      setLoadnewVisit(true);
      await StartNotification(User.EntityID,"",dispatch);
      navigation.navigate("VisitCreated");
    }catch(ex){
      Alert.alert(""+ex);
    }
    finally{
      setLoadnewVisit(false);
    }    
  }
  const MenuToEndVisit=()=>{
    Alert.alert(
      "",
      "¿Que desea hacer?",
      [
          {
              text:"Ir a otra visita",
              onPress:()=>{
                InitVisittoFisnish();
              }
          },
          {
              text:"Ir a base",
              onPress:()=>{
                navigation.navigate("MenuEndVisit")
              }
          },
          {
            text:"Salir",
            onPress:()=>{
                navigation.navigate("Login")
                BackHandler.exitApp();
            }
        }
      ]
  );
  }
  const submitForm =async FormData => {
    
    try {   
      setLoadFinishVisit(true);
        const visit = {
          IdRelacion: Rol[0]?.IdRelacion,
          IdRegistro: dataVisist.IdRegistro,
          Contacto: contactSelect?contactSelect:'',
          Titulo: FormData.Tema?FormData.Tema:'',                    
          Proceso: 'Finalizado',      
          UUIDGroup:DrivingVisitDetail.UUIDRoute,
          isEndVisit:true,
          // Minuta: FormData.Bill?FormData.Bill:'',
          Comentario: FormData.Comment?FormData.Comment:'',  
        };
       const StatusUpdateVisit = await  FunctionUpdateVisit(visit,dispatch,navigation,"FormCreateRoute");
       if(StatusUpdateVisit!=null && StatusUpdateVisit.Resultado){
        dispatch(SaveVisitCreated({
          IdVisit:dataVisist.IdRegistro,
          isEndVisit:true
        }));
        dispatch(DeleteVisit(dataVisist.IdRegistro));
        MenuToEndVisit();   
        //Alert.alert(StatusUpdateVisit.Mensaje);
        // if(isEndVisit.VisitArriveOrEnd && isEndVisit.VisitArriveOrEnd=="N"){
          
        // //  AlertConditional(InitVisittoFisnish,function(){navigation.navigate("MenuEndVisit");},"¿Desea ir a otra visita?","");                
        // }else if(isEndVisit.VisitArriveOrEnd && isEndVisit.VisitArriveOrEnd=="Y"){
        //   navigation.navigate("FormCreateRoute");
        // }else{
          
        //   //navigation.navigate("MenuEndVisit");      
        // }
       }else if(StatusUpdateVisit!=null && !StatusUpdateVisit.Resultado){
        Alert.alert(StatusUpdateVisit.Mensaje);
        return;
       }
                    
    } catch(ex) {
      Alert.alert(""+ex);
      dispatch(LoadSetRegisterVisit(false));
    }finally{
      setLoadFinishVisit(false);
    }
  };

  return (
    <ScrollView>
      <View>   
        <SearchableDropdownV2 items={ListContact} onItemSelected={(person)=>{ if(person) {setContactSelect(person.name)}}} ></SearchableDropdownV2>   
        <Text style={{margin:2}} >{contactSelect ? contactSelect:''}</Text>


        <Controller
          control={control}
          rules={{
            required: false,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Tema"
              placeholderTextColor="#b3b2b7"
            />
          )}
          name="Tema"
        />

       
        <Controller
          control={control}
          rules={{
            required: false,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Comentario"
              placeholderTextColor="#b3b2b7"
            />
          )}
          name="Comment"
        />
        {errors.Comment && (
          <Text style={styles.TextAlert}>Este campo es requerido</Text>
        )}          
        <View style={styles.ContainerMargin}>     
        {loadFinishVisit ?         

        <LoaderScreen messague="Cargando..." color="black"></LoaderScreen> :
        <ButtonPrimary
        label="Dar por finalizado"
        HandleClick={handleSubmit(submitForm)}></ButtonPrimary>          
        }               
        {loadinitnewVisit?<LoaderScreen message = "Llendo a su siguiente visita" color="black"></LoaderScreen> :null}   
        </View>
      </View>
    </ScrollView>
  );
};
export default FormFinaliceVisit;
const styles = StyleSheet.create({
  TextAlert: {
    color: 'red',
  },
  TextInformation: {
    color: '#88807B',
  },
  buttonAdress:{
    color:'black'
  },
  input: {
    height: 50,
    margin: 12,
    borderBottomColor: 'gray',
    padding: 10,
    color: 'black',
    shadowColor: '#ecedf0',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: 'white',
  },
  ContainerMargin: {
    margin: 12,
    marginTop: 5,
  },
});
