import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type Props = {
  label: string;
  isActive: boolean;
  onPress: () => void;
};

const TabButton = ({ label, isActive, onPress }: Props) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.button, isActive && styles.active]}
  >
    <Text style={isActive ? styles.textActive : styles.text}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
    backgroundColor: 'transparent',
  },
  active: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  text: {
    color: 'white',
    fontWeight: '500',
  },
  textActive: {
    color: 'black',
    fontWeight: '600',
  },
});

export default TabButton;
