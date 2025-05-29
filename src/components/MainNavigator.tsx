// MainNavigator.tsx
import React, { useState, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

// Tus screens
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ScanScreen from '../screens/ScanScreen';
import CartScreen from '../screens/CartScreen';
import MoreScreen from '../screens/MoreScreen';

// Tu barra personalizada
import BottomTabBar from './BottomTabBar';

type TabKey = 'home' | 'favorites' | 'scan' | 'cart' | 'more';

export default function MainNavigator() {
  const [activeTab, setActiveTab] = useState<TabKey>('home');

  const renderScreen = (): ReactNode => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'favorites':
        return <FavoritesScreen />;
      case 'scan':
        return <ScanScreen />;
      case 'cart':
        return <CartScreen />;
      case 'more':
        return <MoreScreen />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Área de contenido */}
      <View style={styles.content}>
        {renderScreen()}
      </View>

      {/* Tu BottomTabBar custom */}
      <BottomTabBar
        activeTab={activeTab}
        onTabPress={(tab) => setActiveTab(tab as TabKey)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1, 
    // aquí puedes añadir padding/margen si quieres dejar espacio bajo la barra
  },
});