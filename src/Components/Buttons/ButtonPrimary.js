import React from "react";
import {StyleSheet,View,Button} from 'react-native'
const ButtonPrimary=({label="",Backcolor="black",HandleClick=function(){}})=>{
    return(
        <Button
  onPress={()=>{
    HandleClick();
  }}
  title={label}
  color={Backcolor}
  accessibilityLabel={label}
  style={styles.button}
/>
            // <Button
            //     label={label}
            //     size={Button.sizes.large}
            //     backgroundColor = {Backcolor}
            //     animateLayout={true}  
            //     animateTo="center"              
            // >
            // </Button>
    )
}
export default ButtonPrimary;
const styles = StyleSheet.create({
    button:{
        shadowColor: "#000",
        shadowOffset: {
            width: 1,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        borderRadius:10,
        elevation: 24,
    }           
});
