import React, { useState } from 'react';
import {ScrollView, Text, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import CardVisit from '../../Components/Cards/Card1';
import StylesWrapper from '../../Styles/Wrapers';
import {FunctionGetOptionUser, SetUserDefaultRol} from '../../Api/User/ApiUser';
import {useNavigation} from '@react-navigation/native';
import {AsyncStorageSaveDataJson} from '../../lib/AsyncStorage';
import { LoaderScreen } from 'react-native-ui-lib';
const SelectRol = () => {
  const rol = useSelector(state => state.rol);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [loadGetOpcions,setLoadGetOptions]= useState(false);
  const selectRolDefault = async rol => {
    //get opciones rol
    try{
        setLoadGetOptions(true);
        const options = await FunctionGetOptionUser(rol.IdRol);
        if (options == null) {
          Alert.alert('', 'Ocurrió un problema intente nuevamente');
          return;
        }
        if(options.length ==0 ){
            Alert.alert("","Este rol no posee opciones asignadas");
            return;
        }
        await AsyncStorageSaveDataJson('@Options', options);
        let rolAdd = [];
        rolAdd.push(rol);
        dispatch(SetUserDefaultRol(rolAdd));
        navigation.navigate('Home');
    }finally{
        setLoadGetOptions(false);
    }  
  };
  return (
    <ScrollView style={StylesWrapper.secondWrapper}>
      <Text
        style={{
          padding: '7%',
          paddingBottom: 0,
          color: 'black',
          fontSize: 25,
          fontWeight: 600,
        }}>
        Seleccione su Rol
      </Text>
      {loadGetOpcions ? <LoaderScreen color="black" ></LoaderScreen> :null}
      {rol.Roles ? (
        rol.Roles.map((rol, index) => (
          <CardVisit
            key={index}
            handleSelectCard={() => {
              selectRolDefault(rol);
            }}
            title={rol.Nombre}
            principalColor="#BEBEBE"></CardVisit>
        ))
      ) : (
        <Text style={{color: 'black'}}>No se encontró ningún Rol</Text>
      )}
    </ScrollView>
  );
};
export default SelectRol;
