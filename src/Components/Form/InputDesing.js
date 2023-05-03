import React from "react";
import {Colors} from 'react-native-ui-lib'; 
import {
  StyleSheet, 
  TextInput,
  View 
} from 'react-native';
const InputDesing1=({placeholder="",secureTextEntry = false,changeInput,valueInput,blur})=>{
  const HandleChange=()=>{
    changeInput();
  }
  const HandleBlur=()=>{
    blur();
  }
    return(
        <View>
        <TextInput  
          // isFocused={true}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#b3b2b7"
          secureTextEntry={secureTextEntry}
          onChangeText={HandleChange}
          value={valueInput}
          onBlur={HandleBlur}
         ></TextInput>           
        </View>
    )
}
const styles = StyleSheet.create({
  InputStyle:{    
    color:"#a2a3a5",
  },

  BorderColorInput:{    
    borderBottomWidth: 1,
    borderColor: Colors.$outlineDisabledHeavy,
    paddingBottom: 4
  },
  input: {
    height: 50,
    margin: 12,
    borderBottomColor:'gray',
    padding: 10,
    color:'black',
    shadowColor: "#ecedf0",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    borderRadius:10,
    elevation: 3,
    backgroundColor:'white'
  },

});
export default InputDesing1;

