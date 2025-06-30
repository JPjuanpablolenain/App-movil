import BottomTabBar from '@/src/components/BottomTabBar';
import CategoryCard from '@/src/components/CategoryCard';
import Header from '@/src/components/Header';
import SearchBar from '@/src/components/SearchBar';
import SectionTitle from '@/src/components/SectionTitle';
import React, { useState, useCallback } from 'react';
import { Dimensions, FlatList, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
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

const allProducts = [
  { id: '1', name: 'Apple', price: '$0.99', category: 'FruitsAndVeg' },
  { id: '2', name: 'Banana', price: '$0.50', category: 'FruitsAndVeg' },
  { id: 'b1', name: 'Water', price: '$0.99', category: 'Beverages' },
  { id: 'b2', name: 'Coffee', price: '$3.50', category: 'Beverages' },
  { id: 'd1', name: 'Milk', price: '$2.99', category: 'DiaryAndCereal' },
  { id: 'd2', name: 'Cheese', price: '$4.50', category: 'DiaryAndCereal' },
];

const HomeScreen = () => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [showSearchShadow, setShowSearchShadow] = useState(false);
  const router = useRouter();

  const filteredProducts = search.length > 0 
    ? allProducts.filter(product => 
        product.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const handleProductPress = (product: any) => {
    router.push(`/(main)/categoria/${product.category}`);
  };

  // Función para navegar a la pantalla de categoría correspondiente
  const handleCategoryPress = (category: string) => {
    switch(category) {
      case 'Fruits and Vegetables':
        router.push('/(main)/categoria/FruitsAndVeg');
        break;
      case 'Dairy and Cereals':
        router.push('/(main)/categoria/DiaryAndCereal');
        break;
      case 'Beverages':
        router.push('/(main)/categoria/Beverages');
        break;
      case 'Snacks':
        router.push('/(main)/categoria/Snacks');
        break;
      case 'Meat':
        router.push('/(main)/categoria/Meat');
        break;
      case 'Cleaning Supplies':
        router.push('/(main)/categoria/Cleaning');
        break;
      default:
        break;
    }
  };

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

  const renderListHeader = useCallback(() => (
    <View style={styles.listHeader}>
      <SectionTitle text="What are you looking for?" />
    </View>
  ), []);


  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        <Header location="Sarmiento 123" onPressLocation={() => {}} />
      </SafeAreaView>

      <View style={[styles.searchWrapper, showSearchShadow && styles.searchWrapperWithShadow]}>
        <SearchBar value={search} onChangeText={setSearch} />
      </View>

      {search.length > 0 ? (
        <FlatList
          key="products"
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.searchResults}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.productItem}
              onPress={() => handleProductPress(item)}
            >
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.price}</Text>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
          onScroll={(event) => {
            const scrollY = event.nativeEvent.contentOffset.y;
            setShowSearchShadow(scrollY > 10);
          }}
          scrollEventThrottle={16}
        />
      ) : (
        <FlatList
          key="categories"
          ListHeaderComponent={renderListHeader}
          data={categories}
          numColumns={2}
          keyExtractor={(item) => item.label}
          contentContainerStyle={styles.categories}
          columnWrapperStyle={styles.rowWrapper}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <CategoryCard 
                image={item.image} 
                label={item.label} 
                onPress={() => handleCategoryPress(item.label)}
              />
            </View>
          )}
          showsVerticalScrollIndicator={false}
          onScroll={(event) => {
            const scrollY = event.nativeEvent.contentOffset.y;
            setShowSearchShadow(scrollY > 10);
          }}
          scrollEventThrottle={16}
        />
      )}

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
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    marginHorizontal: CARD_MARGIN / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'white',
    zIndex: 5,
  },
  searchWrapperWithShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  searchResults: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
});