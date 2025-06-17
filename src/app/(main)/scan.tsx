// src/app/(main)/scan.tsx

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomTabBar from '../../components/BottomTabBar';
import Header from '../../components/Header';

export default function ScanScreen() {
  const [activeTab, setActiveTab] = useState('scan');
  const router = useRouter();

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
        // Ya estamos en Scan, no hacemos nada
        break;
      case 'cart':
        router.push('/(main)/cart');
        break;
      case 'more':
        router.push('/(main)/more');
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.root}>
      {/* Header en SafeArea */}
      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        <Header location="Sarmiento 123" onPressLocation={() => {}} />
      </SafeAreaView>

      {/* Título simple */}
      <View style={styles.titleWrapper}>
        <Text style={styles.screenTitle}>Scanner</Text>
      </View>

      {/* Contenido vacío */}
      <View style={styles.content} />

      {/* BottomTabBar */}
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
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  }
});