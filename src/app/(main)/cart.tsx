import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomTabBar from '../../components/BottomTabBar';
import { useRouter } from 'expo-router';

export default function CartScreen() {
  const [activeTab, setActiveTab] = React.useState('cart');
  const router = useRouter();

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    
    switch(tab) {
      case 'home':
        router.push('/(main)');
        break;
      case 'favorites':
        router.push('/(main)/favorites');
        break;
      case 'scan':
        router.push('/(main)/scan');
        break;
      case 'cart':
        // Ya estamos en cart, no hacemos nada
        break;
      case 'more':
        router.push('/(main)/more');
        break;
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.content} edges={['top']}>
        <Text style={styles.title}>Cart</Text>
        {/* Aquí tu markup para el carrito */}
      </SafeAreaView>
      
      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
});