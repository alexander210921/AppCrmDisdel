import {BackHandler,Alert,Platform}from 'react-native'
import { LogOutUser } from '../../Api/User/ApiUser';
export const BackHanlder=(navigation,dispatch)=>{    
    if(Platform.OS === 'android'){        
    const backAction = () => {    
        if(navigation.isFocused()){
          Alert.alert("Salir", "¿Desea salir de la aplicación?", [
            {
              text: "Cancelar",
              onPress: () => null,
              style: "cancel"
            },
            { text: "Si", onPress: () => {
              BackHandler.exitApp();
              dispatch(LogOutUser())
            } }
          ]);
            return () => backHandler.remove();
        }
        return false 
        ;
      };
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
        );
    }

}


export const ExitApp=()=>{
  Alert.alert("Salir", "¿Desea salir de la aplicacion?", [
    {
      text: "Cancelar",
      onPress: () => null,
      style: "cancel"
    },
    { text: "Si", onPress: () => BackHandler.exitApp() }
  ]);
    return () => backHandler.remove();
}