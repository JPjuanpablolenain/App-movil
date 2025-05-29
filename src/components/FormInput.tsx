import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

type Props = TextInputProps;

const FormInput = (props: Props) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholderTextColor="#aaa"
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#999',
    paddingVertical: 8,
    paddingLeft: 10,
    fontSize: 16,
    color: 'black',
  },
});

export default FormInput;
