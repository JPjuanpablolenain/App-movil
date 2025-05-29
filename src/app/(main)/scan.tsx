import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomTabBar from '../../components/BottomTabBar';
import { useRouter } from 'expo-router';

export default function ScanScreen() {
  const [activeTab, setActiveTab] = React.useState('scan');
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
        // Ya estamos en scan, no hacemos nada
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
      <SafeAreaView style={styles.content} edges={['top']}>
        <Text style={styles.title}>Scan</Text>
        {/* Aquí tu markup para escaneo */}
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