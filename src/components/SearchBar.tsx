import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

const SearchBar = ({ value, onChangeText }: {
  value: string;
  onChangeText: (text: string) => void;
}) => {
  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={20} color="#666" />
      <TextInput
        placeholder="search..."
        placeholderTextColor="#aaa"
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
      />
      <Ionicons name="filter" size={20} color="#666" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 20,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 16,
    color: 'black',
  },
});

export default SearchBar;
