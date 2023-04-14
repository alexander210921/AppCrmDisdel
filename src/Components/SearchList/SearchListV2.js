import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
  StyleSheet,
} from 'react-native';

const SearchableDropdownV2 = ({ items, onItemSelected }) => {
  const [searchText, setSearchText] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const [selectedItem, setSelectedItem] = useState(null);
  const inputRef = useRef(null);

  const handleSearch = (text) => {
    const filtered = items.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setSearchText(text);
    setFilteredItems(filtered);
  };

  const handleItemSelected = (item) => {
    setSelectedItem(item);
    setSearchText('');
    setFilteredItems(items);
    onItemSelected(item);
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Buscar"
          value={searchText}
          onChangeText={handleSearch}
          placeholderTextColor={"#b3b2b7"}
        />
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => {
            inputRef.current.blur();
            setSearchText('');
            setFilteredItems(items);
          }}
        >
          <Text style={styles.clearButtonText}>Limpiar</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        style={styles.list}
        data={filteredItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => handleItemSelected(item)}
          >
            <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      {/* <Text style={styles.selectedItemText}>Elemento seleccionado: {selectedItem ? selectedItem.name : '-'}</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#EAEAEA',
    borderRadius: 5,
  },
  input: {
    flex: 1,
    padding: 10,
    color: '#333',
  },
  clearButton: {
    padding: 10,
    borderLeftWidth: 1,
    borderColor: '#CCC',
  },
  clearButtonText: {
    color: '#333',
  },
  list: {
    backgroundColor: '#EAEAEA',
    borderRadius: 5,
    marginBottom: 10,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#CCC',
  },
  itemText: {
    color: '#333',
  },
  selectedItemText: {
    marginTop: 10,
    color: '#666',
  },
});

export default SearchableDropdownV2;
