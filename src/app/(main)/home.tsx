import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomTabBar from '../../components/BottomTabBar';
import CategoryCard from '../../components/CategoryCard';
import Header from '../../components/Header';
import SearchBar from '../../components/SearchBar';
import SectionTitle from '../../components/SectionTitle';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 10;
const CARD_WIDTH = (width - 60) / 2;
const CARD_HEIGHT = 160;
const TAB_BAR_HEIGHT = 60; // ✅ altura dinámica del tab bar

const categories = [
  {
    image: require('../../assets/images/fruits.png'),
    label: 'Fruits and Vegetables',
  },
  {
    image: require('../../assets/images/dairy.png'),
    label: 'Dairy and Cereals',
  },
  {
    image: require('../../assets/images/beverages.png'),
    label: 'Beverages',
  },
  {
    image: require('../../assets/images/snacks.png'),
    label: 'Snacks',
  },
  {
    image: require('../../assets/images/meat.png'),
    label: 'Meat',
  },
  {
    image: require('../../assets/images/cleaning.png'),
    label: 'Cleaning Supplies',
  },
];

const HomeScreen = () => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const router = useRouter();

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);

    switch (tab) {
      case 'home':
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
            <CategoryCard
              image={item.image}
              title={item.label}
              onPress={() => {
                if (item.label === 'Snacks') {
                  router.push('/categoria/Snacks');
                } else if (item.label === 'Beverages') {
                  router.push('/categoria/Beverages');
                } else if (item.label === 'Fruits and Vegetables') {
                  router.push('/categoria/FruitsAndVeg');
                } else if (item.label === 'Meat') {
                  router.push('/categoria/Meat');
                } else if (item.label === 'Dairy and Cereals') {
                  router.push('/categoria/DiaryAndCereal');
                } else if (item.label === 'Cleaning Supplies') {
                  router.push('/categoria/Cleaning');
                } 
              }}
            />
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
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
    borderRadius: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
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
    paddingBottom: TAB_BAR_HEIGHT, // ✅ ajuste dinámico
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
