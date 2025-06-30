import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

type Props = {
  image: any;
  label: string;
  onPress?: () => void;
};

const CategoryCard = ({ image, label, onPress }: Props) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
      <Image source={image} style={styles.image} resizeMode="contain" />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  image: {
    width: '70%',
    height: '60%',
  },
  label: {
    marginTop: 8,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    fontSize: 14,
    paddingHorizontal: 4,
  },
});

export default CategoryCard;
