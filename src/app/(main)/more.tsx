import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomTabBar from '../../components/BottomTabBar';
import { useRouter } from 'expo-router';

export default function MoreScreen() {
  const [activeTab, setActiveTab] = React.useState('more');
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
        router.push('/(main)/cart');
        break;
      case 'more':
        // Ya estamos en more, no hacemos nada
        break;
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.content} edges={['top']}>
        <Text style={styles.title}>More</Text>
        {/* Aquí tu markup para más opciones */}
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