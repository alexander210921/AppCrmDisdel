import React, {useState} from 'react';
import {StyleSheet, TextInput, ScrollView, Alert} from 'react-native';
import {View} from 'react-native-ui-lib';
import {ColorBackround} from '../../Assets/Colors/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
const SearchBar = ({onSubmit}) => {
  const [search, setSearch] = useState('');
  const searchFilterFunction = text => {setSearch(text)};
  const HandleSubmit=()=>{
    onSubmit(search);
  }
  return (
    <ScrollView style={styles.container}>
      <View flex style={styles.container}>
        <View style={styles.searchSection}>
          <Icon
            style={styles.searchIcon}
            color="black"
            size={15}
            name="search"></Icon>
          <TextInput
            style={styles.textInputStyle}
            onChangeText={text => searchFilterFunction(text)}
            underlineColorAndroid="transparent"
            placeholder="Busca el cliente"
            onSubmitEditing={HandleSubmit}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: ColorBackround,
  },
  itemStyle: {
    padding: 10,
  },
  textInputStyle: {
    height: 40,
    paddingLeft: 20,
    margin: 5,

    backgroundColor: 'gray',
    maxWidth: '100%',
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
  },
  searchIcon: {
    padding: 10,
  },
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
    margin: '1%',
  },
});

export default SearchBar;
