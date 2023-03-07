import { Alert } from "react-native";
export const AlertConditional=(okPressed,CancelPress,Title="",Description="")=>{
    Alert.alert(
        Title,
        Description,
        [
            {
                text:"Aceptar",
                onPress:()=>{
                    okPressed();
                }
            },
            {
                text:"No",
                onPress:()=>{
                    CancelPress();
                }
            }
        ]
    );
}