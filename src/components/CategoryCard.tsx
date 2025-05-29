import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

const CategoryCard = ({ image, label, onPress }: {
  image: any;
  label: string;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={image} style={styles.image} resizeMode="contain" />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 15,
    backgroundColor: 'white',
  },
  image: {
    width: '100%',
    height: 80,
    marginBottom: 10,
  },
  label: {
    fontWeight: '500',
    color: '#222',
    textAlign: 'center',
  },
});

export default CategoryCard;
