import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import BottomTabBar from '../../components/BottomTabBar';
import Header from '../../components/Header';
import { useCart, useFavorites } from '../_layout';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 10;
const CARD_WIDTH = (width - 60) / 2;
const CARD_HEIGHT = 160;

const FavoritesScreen = () => {
  const [activeTab, setActiveTab] = useState('favorites');
  const [currentLocation, setCurrentLocation] = useState('Select Location');
  const router = useRouter();
  
  useEffect(() => {
    loadCurrentLocation();
  }, []);
  
  const loadCurrentLocation = async () => {
    try {
      const currentUser = await AsyncStorage.getItem('currentUser');
      if (currentUser) {
        const savedSupermarkets = await AsyncStorage.getItem(`visitedSupermarkets_${currentUser}`);
        const supermarkets = savedSupermarkets ? JSON.parse(savedSupermarkets) : [];
        
        if (supermarkets.length === 0) {
          setCurrentLocation('Select Location');
          await AsyncStorage.removeItem(`currentLocation_${currentUser}`);
        } else {
          const location = await AsyncStorage.getItem(`currentLocation_${currentUser}`);
          if (location && supermarkets.some(s => s.name === location)) {
            setCurrentLocation(location);
          } else {
            setCurrentLocation('Select Location');
          }
        }
      }
    } catch (error) {
      console.log('Error loading location:', error);
    }
  };
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 60;
  const { favorites, removeFavorite } = useFavorites();
  const { addToCart, isInCart } = useCart();

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);

    switch (tab) {
      case 'home':
        router.push('/(main)/home');
        break;
      case 'favorites':
        break; // ya estamos en Favorites
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

  const handleRemoveFavorite = (id) => {
    removeFavorite(id);
  };

  const handleAddToCart = (item) => {
    addToCart(item);
  };

  const renderFavoriteItem = ({ item }) => (
    <View style={styles.card}>
      {/* Botón de favoritos (corazón) en la esquina superior derecha */}
      <View style={styles.favoriteButtonContainer}>
        <TouchableOpacity 
          style={styles.favoriteButton}
          activeOpacity={0.7}
          onPress={() => handleRemoveFavorite(item.id)}
        >
          <Ionicons 
            name="heart" 
            size={22} 
            color="red" 
          />
        </TouchableOpacity>
      </View>
      
      <Image source={item.image} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>{item.name}</Text>
      
      <View style={styles.priceContainer}>
        <Text style={styles.price}>{item.price}</Text>
        {/* Botón de añadir al carrito (+) */}
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
  );

  return (
    <View style={styles.root}>
      {/* 1) HEADER */}
      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        <Header 
          location={currentLocation} 
          onPressLocation={() => {}} 
          onLocationChange={(newLocation) => setCurrentLocation(newLocation)}
        />
      </SafeAreaView>

      {/* 2) TÍTULO */}
      <View style={styles.titleWrapper}>
        <Text style={styles.screenTitle}>Favorites</Text>
      </View>

      {/* 3) CONTENIDO PRINCIPAL */}
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No favorites added yet</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={renderFavoriteItem}
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingTop: 10,
            paddingBottom: TAB_BAR_HEIGHT + insets.bottom,
          }}
          columnWrapperStyle={styles.rowWrapper}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* 4) BOTTOM TAB BAR */}
      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerSafeArea: {
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 10,
    zIndex: 10,
  },
  titleWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  rowWrapper: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: 'white',
    borderRadius: 15,
    marginHorizontal: CARD_MARGIN / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    position: 'relative',
  },
  favoriteButtonContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    width: 30,
    height: 30,
  },
  favoriteButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
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
});