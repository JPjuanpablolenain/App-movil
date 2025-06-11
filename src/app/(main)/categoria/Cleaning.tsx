// src/app/(main)/categoria/Cleaning.tsx

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

const { width }     = Dimensions.get('window');
const CARD_MARGIN    = 10;
const CARD_WIDTH     = (width - 60) / 2;
const CARD_HEIGHT    = 160;
const TAB_BAR_HEIGHT = 60;

// Productos para “Cleaning Supplies”
const cleaningProducts = [
  { id: '1', name: 'Detergent',   image: require('../../../assets/images/cleaning.png') },
  { id: '2', name: 'Bleach',      image: require('../../../assets/images/cleaning.png') },
  { id: '3', name: 'Disinfectant',image: require('../../../assets/images/cleaning.png') },
  { id: '4', name: 'Mop',         image: require('../../../assets/images/cleaning.png') },
];

export default function Cleaning() {
  const [activeTab, setActiveTab] = useState('home');
  const router                    = useRouter();
  const insets                    = useSafeAreaInsets();

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

  const renderCleaning = ({
    item,
  }: {
    item: { id: string; name: string; image: any };
  }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={item.image} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      {/* 1) Header en SafeArea superior */}
      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        <Header location="Sarmiento 123" onPressLocation={() => {}} />
      </SafeAreaView>

      {/* 2) Título de pantalla */}
      <View style={styles.titleWrapper}>
        <Text style={styles.titleScreen}>Cleaning Supplies</Text>
      </View>

      {/* 3) FlatList de productos de limpieza */}
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
        renderItem={renderCleaning}
        showsVerticalScrollIndicator={false}
      />

      {/* 4) BottomTabBar absoluto al fondo real */}
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
  },
  image: {
    width:        80,
    height:       80,
    marginBottom: 8,
  },
  title: {
    fontSize:   14,
    fontWeight: '600',
    textAlign:  'center',
  },
});
