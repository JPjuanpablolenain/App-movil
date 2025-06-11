import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface CategoryCardProps {
  title: string;
  image: any;
  onPress: () => void;
}

const CategoryCard = ({ title, image, onPress }: CategoryCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={image} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    backgroundColor: 'transparent', // ✅ Fondo eliminado
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#222',    // ✅ Color oscuro visible
    marginTop: 4,     // ✅ Separación de la imagen
  },
});

export default CategoryCard;

