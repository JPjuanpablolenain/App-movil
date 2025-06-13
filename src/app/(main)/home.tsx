import BottomTabBar from '@/src/components/BottomTabBar';
import CategoryCard from '@/src/components/CategoryCard';
import Header from '@/src/components/Header';
import SearchBar from '@/src/components/SearchBar';
import SectionTitle from '@/src/components/SectionTitle';
import React, { useState } from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 10;
const CARD_WIDTH = (width - 60) / 2;
const CARD_HEIGHT = 160;

const categories = [
  {
    image: require('@/src/assets/images/fruits.png'),
    label: 'Fruits and Vegetables',
  },
  {
    image: require('@/src/assets/images/dairy.png'),
    label: 'Dairy and Cereals',
  },
  {
    image: require('@/src/assets/images/beverages.png'),
    label: 'Beverages',
  },
  {
    image: require('@/src/assets/images/snacks.png'),
    label: 'Snacks',
  },
  {
    image: require('@/src/assets/images/meat.png'),
    label: 'Meat',
  },
  {
    image: require('@/src/assets/images/cleaning.png'),
    label: 'Cleaning Supplies',
  },
];

const HomeScreen = () => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const router = useRouter();

const handleTabPress = (tab: string) => {
  setActiveTab(tab);
  
  // Navegar a la pantalla correspondiente
  switch(tab) {
    case 'home':
      // Ya estamos en home, no hacemos nada
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


  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.headerWrapper} edges={['top']}>
        <Header location="Sarmiento 123" onPressLocation={() => {}} />
      </SafeAreaView>

      <FlatList
        ListHeaderComponent={() => (
          <View style={styles.listHeader}>
            <SectionTitle text="What are you looking for?" />
            <SearchBar value={search} onChangeText={setSearch} />
          </View>
        )}
        data={categories}
        numColumns={2}
        keyExtractor={(item) => item.label}
        contentContainerStyle={styles.categories}
        columnWrapperStyle={styles.rowWrapper}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <CategoryCard image={item.image} label={item.label} />
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />

      {/* BottomTabBar ya maneja su propio SafeArea */}
      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerWrapper: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 6,
    zIndex: 10,
  },
  listHeader: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: 'white',
  },
  categories: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    paddingBottom: 120, // espacio suficiente para el BottomTabBar
  },
  rowWrapper: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: 'white',
    borderRadius: 15,
    marginHorizontal: CARD_MARGIN / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});