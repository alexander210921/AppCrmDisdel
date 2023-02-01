import React, {useEffect} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {Dimensions} from 'react-native';
import {ColorBackround} from './src/Assets/Colors/Colors';
import {NavigationContainer} from '@react-navigation/native';
import Navigation from './src/navigation/Navigation';
import {Provider} from 'react-redux';
import store1 from './src/Store/Store';
import {requestLocationPermission} from './src/lib/Permissions/Geolocation/index';

const windowHeight = Dimensions.get('window').height;
function App() {  
  useEffect(() => {
    async function ValidateAccesGPS() {      
      await requestLocationPermission();      
    }
    ValidateAccesGPS();
  }, []); 
  return (
    <Provider store={store1}>
      <SafeAreaView style={styles.WrapperApp}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.WrapperApp}>
          <View style={styles.WrapperLogin}>
            <NavigationContainer>
              <Navigation></Navigation>
            </NavigationContainer>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Provider>
  );
}
const styles = StyleSheet.create({
  WrapperApp: {
    backgroundColor: ColorBackround,
  },
  WrapperLogin: {
    backgroundColor: ColorBackround,
    height: windowHeight,
  },
});

export default App;
