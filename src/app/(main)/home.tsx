import BottomTabBar from '@/src/components/BottomTabBar';
import CategoryCard from '@/src/components/CategoryCard';
import Header from '@/src/components/Header';
import SearchBar from '@/src/components/SearchBar';
import SectionTitle from '@/src/components/SectionTitle';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Dimensions, FlatList, StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 10;
const CARD_WIDTH = (width - 60) / 2;
const CARD_HEIGHT = 160;
const CATEGORY_HEIGHT = 200;

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
  const [currentLocation, setCurrentLocation] = useState('Select Location');
  const [userName, setUserName] = useState('User');
  const router = useRouter();
  const cartAnimation = useRef(new Animated.Value(300)).current;
  
  useEffect(() => {
    loadCurrentLocation();
    loadUserName();
    startCartAnimation();
  }, []);
  
  const startCartAnimation = () => {
    const animate = () => {
      cartAnimation.setValue(300);
      
      Animated.sequence([
        Animated.timing(cartAnimation, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.delay(1500),
        Animated.timing(cartAnimation, {
          toValue: -300,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.delay(500),
      ]).start(() => animate());
    };
    
    animate();
  };
  
  const loadUserName = async () => {
    try {
      const name = await AsyncStorage.getItem('currentUserName');
      if (name) {
        setUserName(name);
      }
    } catch (error) {
      console.log('Error loading user name:', error);
    }
  };
  
  const loadCurrentLocation = async () => {
    try {
      const currentUser = await AsyncStorage.getItem('currentUser');
      if (currentUser) {
        const location = await AsyncStorage.getItem(`currentLocation_${currentUser}`);
        if (location) {
          const savedSupermarkets = await AsyncStorage.getItem(`visitedSupermarkets_${currentUser}`);
          const supermarkets = savedSupermarkets ? JSON.parse(savedSupermarkets) : [];
          
          // Solo mostrar ubicación si existe en la lista de supermercados
          if (supermarkets.some(s => s.name === location)) {
            setCurrentLocation(location);
          } else {
            setCurrentLocation('Select Location');
          }
        } else {
          setCurrentLocation('Select Location');
        }
      }
    } catch (error) {
      console.log('Error loading location:', error);
    }
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
        <Header 
          location={currentLocation} 
          onPressLocation={() => {}} 
          onLocationChange={(newLocation) => setCurrentLocation(newLocation)}
        />
      </SafeAreaView>

      {currentLocation !== 'Select Location' && (
        <View style={[styles.searchWrapper, showSearchShadow && styles.searchWrapperWithShadow]}>
          <SearchBar value={search} onChangeText={setSearch} />
        </View>
      )}

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
      ) : currentLocation === 'Select Location' ? (
        <View style={styles.noSupermarketContainer}>
          <Animated.View style={[
            styles.welcomeIcon,
            {
              transform: [{ translateX: cartAnimation }]
            }
          ]}>
            <Text style={styles.cartEmoji}>🛒</Text>
          </Animated.View>
          <Text style={styles.noSupermarketTitle}>Hey {userName}!</Text>
          <Text style={styles.noSupermarketMessage}>
            Let's find a supermarket to start your shopping adventure
          </Text>
          <TouchableOpacity 
            style={styles.scanButton}
            onPress={() => router.push('/(main)/scan')}
          >
            <Text style={styles.scanButtonText}>Scan QR Code</Text>
          </TouchableOpacity>
        </View>
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
            <View style={styles.categoryContainer}>
              <LinearGradient
                colors={getGradientColors(item.label)}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.cardWrapper}
              >
                <CategoryCard 
                  image={item.image} 
                  label="" 
                  category={item.label}
                  onPress={() => handleCategoryPress(item.label)}
                />
              </LinearGradient>
              <Text style={styles.categoryLabel}>{item.label}</Text>
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
  categoryContainer: {
    width: CARD_WIDTH,
    height: CATEGORY_HEIGHT,
    marginHorizontal: CARD_MARGIN / 2,
    alignItems: 'center',
  },
  cardWrapper: {
    width: '100%',
    height: CARD_HEIGHT,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    paddingHorizontal: 4,
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
  noSupermarketContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 120,
  },
  welcomeIcon: {
    marginBottom: 20,
  },
  cartEmoji: {
    fontSize: 64,
  },
  noSupermarketTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#A3C163',
    marginBottom: 12,
    textAlign: 'center',
  },
  noSupermarketMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  scanButton: {
    backgroundColor: '#A3C163',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: '#A3C163',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});