import React,{useEffect} from 'react';
import {TextInput, StyleSheet} from 'react-native';
import LoginHeader from './Header';
import ButtonPrimary from '../../Components/Buttons/ButtonPrimary';
import {View, Text, Colors, LoaderScreen} from 'react-native-ui-lib';
import {useForm, Controller} from 'react-hook-form';
import {LoginUser} from '../../Api/User/ApiUser';
import StylesWrapper from '../../Styles/Wrapers';
import {useDispatch, useSelector} from 'react-redux';
import {LoadGetUser} from '../../Api/User/ApiUser';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { Dimensions,Alert } from 'react-native';
import { ColorBackroundSecundary } from '../../Assets/Colors/Colors';
import { AsyncStorageDeleteData, AsyncStorageGetData } from '../../lib/AsyncStorage';
import { SaveIdWatch, SaveUUIDRoute,SetIsInitDrivingVisit } from '../../Api/Customers/ApiCustumer';
const windowHeight = Dimensions.get('window').height;

const ViewLogin = () => { 
  const navigation = useNavigation();
  const User = useSelector(state => state.login);
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      userName: '',
      userPassword: '',
    },
  });
    function onSubmit  (data) {     
      dispatch(LoadGetUser(true));
      LoginUser(data.userName, data.userPassword, dispatch,navigation);
    };
    useEffect(() => {
      AsyncStorageGetData("@dataRoute").then(res=>{
        try{
          if(res!=null){
           
                      
            let data = JSON.parse(res);
           // Alert.alert(data.DatevalidId); 
           
            if(Date.parse(data.DatevalidId)==Date.parse(new Date().toLocaleDateString())){
              //Alert.alert("Fechas iguales");
              //AsyncStorageDeleteData("@dataRoute");
            }
            dispatch(SaveUUIDRoute(data.UUidInProgress));
            dispatch(SetIsInitDrivingVisit(data.isRouteInCourse));
            dispatch(SaveIdWatch(null));
          }          
        }catch{
          AsyncStorageDeleteData("@dataRoute").then(response=>{            
          });   
          dispatch(SetIsInitDrivingVisit(false))
          dispatch(SaveUUIDRoute(''));       
        }          
     })    
    }, [])
    
  return (
    <ScrollView style={StylesWrapper.secondWrapper}>
    <View style={StylesWrapper.wraper} flex>
      <View style={{height: 100}} bottom>
        <LoginHeader></LoginHeader>
      </View>
      <View flex top>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Usuario"
              placeholderTextColor="#b3b2b7"
            />
          )}
          name="userName"
        />
        {errors.userName && (
          <Text style={styles.TextAlert}>Este campo es requerido</Text>
        )}
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Contraseña"
              placeholderTextColor="#b3b2b7"
              secureTextEntry={true}
            />
          )}
          name="userPassword"
        />
        {errors.userPassword && (
          <Text style={styles.TextAlert}>Este campo es requerido</Text>
        )}
      
        {User.LoadUser ? (
          <LoaderScreen color={Colors.blue30} message="cargando..." overlay/>
        ) : (
          <ButtonPrimary
            HandleClick={handleSubmit(onSubmit)}
            label="Ingresar"
            Backcolor="#fc6b68"></ButtonPrimary>
        )}
      </View>
    </View>
    </ScrollView>
  );
};
export default React.memo(ViewLogin);
const styles = StyleSheet.create({
  InputStyle: {
    color: '#a2a3a5',
  },

  BorderColorInput: {
    borderBottomWidth: 1,
    borderColor: Colors.$outlineDisabledHeavy,
    paddingBottom: 4,
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
  TextAlert: {
    color: 'red',
  },
  Wrapper: {
    padding:'5%',
    paddingLeft:'0%',
    height:  windowHeight,
    backgroundColor:ColorBackroundSecundary,      
    marginBottom:'2%',
  },
});
