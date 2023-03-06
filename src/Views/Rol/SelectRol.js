import React from "react";
import { ScrollView,Text } from "react-native";

import { useDispatch, useSelector } from "react-redux";
import CardVisit from "../../Components/Cards/Card1";
import StylesWrapper from "../../Styles/Wrapers";
import { SetUserDefaultRol } from "../../Api/User/ApiUser";
import { useNavigation } from "@react-navigation/native";
const SelectRol=()=>{
    const rol = useSelector(state=>state.rol);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const user = useSelector(state=>state.login.user);
    const selectRolDefault=(rol)=>{
        //navigation.navigate("");
        //console.log(user);
        dispatch(SetUserDefaultRol(rol));
        navigation.navigate("Home");
       // GetUserRol(user.EntityID,company.EntityID,navigation,dispatch);
    }   
    console.log(rol.Roles);
    return (
            <ScrollView style={StylesWrapper.secondWrapper}>
                <Text style={{  padding: '7%',
    paddingBottom: 0,
    color: 'black',
    fontSize: 25,
    fontWeight: 600,}}>Seleccione su Rol</Text>
                {rol.Roles?
                rol.Roles.map(rol=>(
                    <CardVisit handleSelectCard={()=>{
                        selectRolDefault(rol);
                    }} title={rol.Nombre} principalColor="red" >

                    </CardVisit>  
                ))
                :<Text style={{color:'black'}}>No se encontró ninguna compañia</Text>}
                            
            </ScrollView>
    )
}
export default SelectRol;