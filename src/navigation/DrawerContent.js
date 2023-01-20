import React, { useState } from 'react';
// import { useSelector } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Drawer, Switch, TouchableRipple, Text } from 'react-native-paper';
import usePreference from '../hooks/usePreferences';
// import AvatarUser from '../screens/User/Avatar';
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import {ExitApp} from '../Components/ButtonBackHandler/ButtonBackHandler';

export default function DrawerContent({ navigation }) {
  const [active, setActive] = useState('Login');
  const { theme, toggleTheme } = usePreference();
//   const states = useSelector(state => state.login);

  const onChangeScreen = screen => {
    setActive(screen);
    navigation.navigate(screen);
  };

  return (
    <DrawerContentScrollView>
      <Drawer.Section title="User">
        <TouchableRipple>
          <View style={styles.UserAvatar}>
            {/* <AvatarUser />
            <Text>
              {states.user?states.user.NombreUsuario:''}
            </Text> */}
          </View>
        </TouchableRipple>
      </Drawer.Section>
      <Drawer.Section>
        <Drawer.Item
          label="Login"
          icon='home'
          active={active === 'Login'}
          onPress={() => onChangeScreen('Login')}        
        />
   
      </Drawer.Section>
      <Drawer.Section title="Opciones">
        <TouchableRipple>
          <View style={styles.preference}>
            <Text>Tema Oscuro</Text>
            <Switch value={theme === 'dark'} onValueChange={toggleTheme} />
          </View>
        </TouchableRipple>
      </Drawer.Section>
      <Drawer.Item icon='forward' label="Cerrar Sesion" onPress={()=>{
    //    ExitApp();
         AsyncStorage.removeItem("@userData")
      }}/>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  UserAvatar: {
    alignItems: 'center',
  },
});
