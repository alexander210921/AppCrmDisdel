import React, {useEffect} from 'react';
import { ScrollView, StyleSheet, View} from 'react-native';
import {ColorBackroundSecundary} from './src/Assets/Colors/Colors';
import {NavigationContainer} from '@react-navigation/native';
import Navigation from './src/navigation/Navigation';
import {Provider} from 'react-redux';
import store1 from './src/Store/Store';
import {requestLocationPermission} from './src/lib/Permissions/Geolocation/index';
function App() {  
  useEffect(() => {
    async function ValidateAccesGPS() {      
      await requestLocationPermission();      
    }
    ValidateAccesGPS();
  }, []); 
  return (
    <Provider store={store1}>
      <View style={{flex:1}}>
      <View style={styles.WrapperLogin}>
        <ScrollView
          contentContainerStyle={{flexGrow:1}}
          >
            <NavigationContainer>
              <Navigation></Navigation>
            </NavigationContainer>
        </ScrollView>
        </View>
        </View>
    </Provider>
  );
}
const styles = StyleSheet.create({
  WrapperApp: {
    backgroundColor: ColorBackroundSecundary,
  },
  WrapperLogin: {
    backgroundColor: ColorBackroundSecundary,
    height: '100%',
  },
});

export default App;
