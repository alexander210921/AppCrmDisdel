import React from "react";
import { Text } from "react-native";
import stylesTitle from "../../Styles/Titles";
import { View } from "react-native-ui-lib";
const LoginHeader=()=>{
    return (
        <View flex center >
                <Text style={stylesTitle.Title}>¡Hola de nuevo!</Text>           
                <Text style={stylesTitle.SubTitle}>Bienvenido a la app Disdel</Text>                   
        </View>
    )
}
export default LoginHeader;