import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Drawer, Switch, TouchableRipple, Text } from 'react-native-paper';
import usePreference from '../hooks/usePreferences';
export default function DrawerContent({ navigation }) {
  const [active, setActive] = useState('Login');
  const { theme, toggleTheme } = usePreference();
  const onChangeScreen = screen => {
    setActive(screen);
    navigation.navigate(screen);
  };

  return (
    <DrawerContentScrollView>
      <Drawer.Section title="User">
        <TouchableRipple>
          <View style={styles.UserAvatar}>
          </View>
        </TouchableRipple>
      </Drawer.Section>
      <Drawer.Section>
        <Drawer.Item
          label="Visitas"
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
