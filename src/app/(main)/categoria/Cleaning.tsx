// src/app/(main)/categoria/Cleaning.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import BottomTabBar from '../../../components/BottomTabBar';
import Header from '../../../components/Header';
import { Product, useCart, useFavorites } from '../../_layout';

const { width } = Dimensions.get('window');
const CARD_MARGIN    = 10;
const CARD_WIDTH     = (width - 60) / 2;
const CARD_HEIGHT    = 160;
const TAB_BAR_HEIGHT = 60;

// Lista de productos específicos para Cleaning
const cleaningProducts = [
  { id: 'c1', name: 'Detergent',    price: '$5.99', image: require('../../../assets/images/cleaning.png') },
  { id: 'c2', name: 'Soap',         price: '$2.50', image: require('../../../assets/images/cleaning.png') },
  { id: 'c3', name: 'Bleach',       price: '$3.25', image: require('../../../assets/images/cleaning.png') },
  { id: 'c4', name: 'Glass Cleaner', price: '$4.50', image: require('../../../assets/images/cleaning.png') },
  { id: 'c5', name: 'Sponges',      price: '$1.99', image: require('../../../assets/images/cleaning.png') },
  { id: 'c6', name: 'Floor Cleaner', price: '$6.75', image: require('../../../assets/images/cleaning.png') },
];

export default function Cleaning() {
  const [activeTab, setActiveTab] = useState('');
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { addToCart, isInCart, getItemQuantity, decreaseQuantity } = useCart();

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    switch (tab) {
      case 'home':
        router.push('/(main)/home');
        break;
      case 'favorites':
        router.push('/(main)/favorites');
        break;
      case 'scan':
        router.push('/(main)/scan');
        break;
      case 'cart':
        router.push('/(main)/cart');
        break;
      case 'more':
        router.push('/(main)/more');
        break;
    }
  };

  const handleFavoritePress = (product: Product) => {
    if (isFavorite(product.id)) {
      removeFavorite(product.id);
    } else {
      addFavorite(product);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    // No cambiar el tab activo para evitar redirección
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      {/* Botón de favoritos (corazón) en la esquina superior derecha */}
      <TouchableOpacity 
        style={styles.favoriteButton}
        activeOpacity={0.7}
        onPress={() => handleFavoritePress(item)}
      >
        <Ionicons 
          name={isFavorite(item.id) ? "heart" : "heart-outline"} 
          size={22} 
          color={isFavorite(item.id) ? 'red' : '#666'} 
        />
      </TouchableOpacity>
      
      <Image source={item.image} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>{item.name}</Text>
      
      <View style={styles.priceContainer}>
        <Text style={styles.price}>{item.price}</Text>
        <View style={styles.cartSection}>
          {isInCart(item.id) && (
            <TouchableOpacity 
              style={styles.decreaseButton}
              onPress={() => decreaseQuantity(item.id)}
            >
              <Text style={styles.decreaseButtonText}>-</Text>
            </TouchableOpacity>
          )}
          {isInCart(item.id) && (
            <Text style={styles.quantityText}>{getItemQuantity(item.id)}</Text>
          )}
          <TouchableOpacity 
            style={[
              styles.addButton,
              isInCart(item.id) ? styles.addButtonActive : {}
            ]} 
            onPress={() => handleAddToCart(item)}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.root}>
      {/* Header en la zona segura superior */}
      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        <Header location="Sarmiento 123" onPressLocation={() => {}} />
      </SafeAreaView>

      {/* Título de la pantalla */}
      <View style={styles.titleWrapper}>
        <Text style={styles.titleScreen}>Cleaning Supplies</Text>
      </View>

      {/* FlatList de productos */}
      <FlatList
        data={cleaningProducts}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingTop:       10,
          paddingBottom:    TAB_BAR_HEIGHT + insets.bottom,
        }}
        columnWrapperStyle={styles.rowWrapper}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />

      {/* BottomTabBar absoluto al fondo real */}
      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex:            1,
    backgroundColor: 'white',
  },
  headerSafeArea: {
    backgroundColor: 'white',
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 2 },
    shadowOpacity:   0.1,
    shadowRadius:    4,
    elevation:       6,
    zIndex:          10,
  },
  titleWrapper: {
    paddingHorizontal: 20,
    paddingVertical:   12,
    backgroundColor:  'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  titleScreen: {
    fontSize:   22,
    fontWeight: '700',
  },
  rowWrapper: {
    justifyContent: 'space-between',
    marginBottom:   20,
  },
  card: {
    width:            CARD_WIDTH,
    height:           CARD_HEIGHT,
    backgroundColor:  'white',
    borderRadius:     15,
    marginHorizontal: CARD_MARGIN / 2,
    shadowColor:      '#000',
    shadowOffset:     { width: 0, height: 2 },
    shadowOpacity:    0.3,
    shadowRadius:     4,
    elevation:        5,
    justifyContent:   'center',
    alignItems:       'center',
    padding:          10,
    position:         'relative',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width:        80,
    height:       80,
    marginBottom: 4,
  },
  title: {
    fontSize:   14,
    fontWeight: '600',
    textAlign:  'center',
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: 'green',
  },
  addButton: {
    backgroundColor: 'green',
    borderRadius: 15,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonActive: {
    backgroundColor: '#005500', // Verde más oscuro para indicar que está en el carrito
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  cartSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'green',
  },
  decreaseButton: {
    backgroundColor: 'red',
    borderRadius: 15,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decreaseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 22,
  },
});