import React from 'react';
import { 
    Text,   
  } from 'react-native';
import { NavigationContainerFunction } from '../Components/Navigation/NavigationContainer';
export const Home=()=>{
    return (
        <NavigationContainerFunction>
            <Text>Hola Mundo</Text>
        </NavigationContainerFunction>        
    )
}

