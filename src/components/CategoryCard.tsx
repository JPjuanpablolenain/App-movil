import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

type Props = {
  image: any;
  label: string;
  onPress?: () => void;
};

const CategoryCard = ({ image, label, onPress }: Props) => {
  return (
    <View style={styles.wrapper}>
      {/* Solo este recuadro tiene elevación */}
      <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
        <Image source={image} style={styles.image} resizeMode="contain" />
      </TouchableOpacity>

      {/* Texto fuera y sin elevación */}
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 140,
    alignItems: 'center',
    marginVertical: 12,

  },
  card: {
    width: '100%',
    height: 120,
    borderRadius: 15,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '80%',
  },
  label: {
    marginTop: 8,       // separa el texto por debajo del recuadro
    fontWeight: '500',
    color: '#222',
    textAlign: 'center',  
  },
});

export default CategoryCard;
