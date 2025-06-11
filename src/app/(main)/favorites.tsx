import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import BottomTabBar from '../../components/BottomTabBar';
import Header from '../../components/Header';

const FavoritesScreen = () => {
  const [activeTab, setActiveTab] = useState('favorites');
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 60;

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

  return (
    <View style={styles.root}>
      {/* 1) HEADER */}
      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        <Header location="Sarmiento 123" onPressLocation={() => {}} />
      </SafeAreaView>

      {/* 2) CONTENIDO PRINCIPAL */}
      <View style={[styles.content, { paddingBottom: TAB_BAR_HEIGHT + insets.bottom }]}>
        <Text style={styles.screenTitle}>Favorites</Text>
        {/* Acá puedes agregar la lista de tus productos “favoritos” o lo que corresponda */}
      </View>

      {/* 3) BOTTOM TAB BAR */}
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
    shadowColor: '#000',
    borderRadius: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    zIndex: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
});
