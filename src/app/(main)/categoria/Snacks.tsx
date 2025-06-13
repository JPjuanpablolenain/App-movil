// src/app/(main)/categoria/Snacks.tsx

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

const { width } = Dimensions.get('window');
const CARD_MARGIN    = 10;
const CARD_WIDTH     = (width - 60) / 2;
const CARD_HEIGHT    = 160;
const TAB_BAR_HEIGHT = 60;

// Simulación de productos “Snacks”
const snacksProducts = [
  { id: '1', name: 'Doritos', price: '$2.50', image: require('../../../assets/images/snacks.png') },
  { id: '2', name: 'Lays',    price: '$2.25', image: require('../../../assets/images/snacks.png') },
  { id: '3', name: 'Pringles',price: '$3.00', image: require('../../../assets/images/snacks.png') },
  { id: '4', name: 'Chips',   price: '$1.75', image: require('../../../assets/images/snacks.png') },
];

export default function SnacksScreen() {
  const [activeTab, setActiveTab] = useState('home');
  const [favorites, setFavorites] = useState<{[key: string]: boolean}>({});
  const router = useRouter();
  const insets = useSafeAreaInsets();

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

  const toggleFavorite = (id: string) => {
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderSnack = ({ item }: { item: { id: string; name: string; price: string; image: any } }) => (
    <TouchableOpacity style={styles.card}>
      <TouchableOpacity 
        style={styles.favoriteButton} 
        onPress={() => toggleFavorite(item.id)}
      >
        <Ionicons 
          name="heart" 
          size={22} 
          color={favorites[item.id] ? 'green' : '#ddd'} 
        />
      </TouchableOpacity>
      <Image source={item.image} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>{item.name}</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>{item.price}</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => console.log(`Added ${item.name} to cart`)}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      {/* 1) Header en zona segura superior */}
      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        <Header location="Sarmiento 123" onPressLocation={() => {}} />
      </SafeAreaView>

      {/* 2) Título */}
      <View style={styles.titleWrapper}>
        <Text style={styles.titleScreen}>Snacks</Text>
      </View>

      {/* 3) Listado de “snacksProducts” */}
      <FlatList
        data={snacksProducts}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingTop: 10,
          paddingBottom: TAB_BAR_HEIGHT + insets.bottom,
        }}
        columnWrapperStyle={styles.rowWrapper}
        renderItem={renderSnack}
        showsVerticalScrollIndicator={false}
      />

      {/* 4) BottomTabBar absoluto al fondo real */}
      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerSafeArea: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 6,
    zIndex: 10,
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
    width:             CARD_WIDTH,
    height:            CARD_HEIGHT,
    backgroundColor:   'white',
    borderRadius:      15,
    marginHorizontal:  CARD_MARGIN / 2,
    shadowColor:       '#000',
    shadowOffset:      { width: 0, height: 2 },
    shadowOpacity:     0.3,
    shadowRadius:      4,
    elevation:         5,
    justifyContent:    'center',
    alignItems:        'center',
    padding:           10,
    position:          'relative',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
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
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 22,
  },
});
