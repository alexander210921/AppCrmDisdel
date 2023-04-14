import React, {useState, useEffect} from 'react';
import SearchableDropdown from 'react-native-searchable-dropdown';
import {Keyboard,View,ScrollView,KeyboardAvoidingView} from 'react-native';
const SearchItem = ({items, onSelect}) => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [searchableItems, setSearchableItems] = useState([]);
  useEffect(() => {
    setSearchableItems(items);
  }, [items]);
  return (
<KeyboardAvoidingView style={{ flex: 1 }} behavior={'padding'}>
    <ScrollView keyboardShouldPersistTaps="always"  >
      <View accessible={true} accessibilityRole='button'>
      <SearchableDropdown
      onItemSelect={item => {
        console.log(item);
        onSelect(item);

      }}
      containerStyle={{padding: 5}}
      onRemoveItem={(item, index) => {

      }}
      itemStyle={{
        padding: 10,
        marginTop: 2,
        backgroundColor: '#ddd',
        borderColor: '#bbb',
        borderWidth: 1,
        borderRadius: 5,
      }}
      itemTextStyle={{color: '#222'}}
      itemsContainerStyle={{maxHeight: 140}}
      items={searchableItems}
      defaultIndex={0}
      resetValue={true}
      textInputProps={{
        placeholder: 'placeholder',
        underlineColorAndroid: 'transparent',
        style: {
          padding: 12,
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 5,
        },
      }}
      listProps={{
        nestedScrollEnabled: true,
      }}
    />
      </View>
      
    </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default SearchItem;
