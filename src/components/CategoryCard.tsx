import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  image: any;
  label: string;
  category: string;
  onPress?: () => void;
};

const getGradientColors = (category: string) => {
  switch(category) {
    case 'Fruits and Vegetables':
      return ['rgba(24, 74, 0, 0.8)', 'rgba(56, 176, 0, 0.8)'];
    case 'Dairy and Cereals':
      return ['rgba(107, 76, 22, 0.8)', 'rgba(209, 148, 43, 0.8)'];
    case 'Beverages':
      return ['rgba(206, 216, 233, 0.8)', 'rgba(116, 121, 131, 1)'];
    case 'Snacks':
      return ['rgba(153, 136, 1, 0.8)', 'rgba(255, 227, 2, 1)'];
    case 'Meat':
      return ['rgba(102, 11, 12, 0.8)', 'rgba(204, 23, 25, 1)'];
    case 'Cleaning Supplies':
      return ['rgba(42, 128, 147, 0.8)', 'rgba(71, 216, 249, 1)'];
    default:
      return ['#f8f8f8', '#f8f8f8'];
  }
};

const CategoryCard = ({ image, label, category, onPress }: Props) => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={onPress}>
      <Image source={image} style={styles.image} resizeMode="contain" />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  image: {
    width: '70%',
    height: '70%',
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
