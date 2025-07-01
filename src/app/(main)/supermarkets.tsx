import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomTabBar from '../../components/BottomTabBar';
import Header from '../../components/Header';
import { useSupermarket } from '../_layout';

export default function SupermarketsScreen() {
  const [activeTab, setActiveTab] = useState('more');
  const [supermarkets, setSupermarkets] = useState([]);
  const [currentLocation, setCurrentLocation] = useState('Select Location');
  const router = useRouter();
  const { handleSupermarketDeletion, reloadDataForSupermarket } = useSupermarket();
  const flatListRef = useRef(null);

  useEffect(() => {
    loadSupermarkets();
    loadCurrentLocation();
  }, []);
  
  const loadCurrentLocation = async () => {
    try {
      const currentUser = await AsyncStorage.getItem('currentUser');
      if (currentUser) {
        const savedSupermarkets = await AsyncStorage.getItem(`visitedSupermarkets_${currentUser}`);
        const supermarkets = savedSupermarkets ? JSON.parse(savedSupermarkets) : [];
        
        if (supermarkets.length === 0) {
          setCurrentLocation('Select Location');
          await AsyncStorage.removeItem(`currentLocation_${currentUser}`);
        } else {
          const location = await AsyncStorage.getItem(`currentLocation_${currentUser}`);
          if (location && supermarkets.some(s => s.name === location)) {
            setCurrentLocation(location);
          } else {
            setCurrentLocation('Select Location');
          }
        }
      }
    } catch (error) {
      console.log('Error loading location:', error);
    }
  };

  const loadSupermarkets = async () => {
    try {
      const currentUser = await AsyncStorage.getItem('currentUser');
      if (!currentUser) return;
      
      const savedSupermarkets = await AsyncStorage.getItem(`visitedSupermarkets_${currentUser}`);
      if (savedSupermarkets) {
        setSupermarkets(JSON.parse(savedSupermarkets));
      } else {
        setSupermarkets([]); // Lista vacía, solo QR escaneados
      }
    } catch (error) {
      console.log('Error loading supermarkets:', error);
    }
  };

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

  const handleDeleteSupermarket = async (id: string) => {
    try {
      const currentUser = await AsyncStorage.getItem('currentUser');
      if (!currentUser) return;
      
      const supermarketToDelete = supermarkets.find(s => s.id === id);
      const updatedSupermarkets = supermarkets.filter(s => s.id !== id);
      setSupermarkets(updatedSupermarkets);
      await AsyncStorage.setItem(`visitedSupermarkets_${currentUser}`, JSON.stringify(updatedSupermarkets));
      
      // Manejar eliminación a través del contexto
      if (supermarketToDelete) {
        await handleSupermarketDeletion(supermarketToDelete.name);
        
        // Actualizar ubicación local
        if (currentLocation === supermarketToDelete.name || updatedSupermarkets.length === 0) {
          setCurrentLocation('Select Location');
        }
      }
    } catch (error) {
      console.log('Error deleting supermarket:', error);
    }
  };

  const handleSelectSupermarket = async (supermarketName: string) => {
    try {
      const currentUser = await AsyncStorage.getItem('currentUser');
      if (currentUser) {
        await AsyncStorage.setItem(`currentLocation_${currentUser}`, supermarketName);
        setCurrentLocation(supermarketName);
        
        // Recargar datos del nuevo supermercado
        await reloadDataForSupermarket(supermarketName);
        
        // Scroll suave hacia arriba
        setTimeout(() => {
          flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
        }, 100);
      }
    } catch (error) {
      console.log('Error changing location:', error);
    }
  };

  const renderSupermarket = ({ item }) => {
    const isCurrentLocation = currentLocation === item.name;
    
    return (
      <TouchableOpacity 
        style={[
          styles.supermarketItem,
          isCurrentLocation && styles.currentSupermarketItem
        ]}
        onPress={() => !isCurrentLocation && handleSelectSupermarket(item.name)}
        activeOpacity={isCurrentLocation ? 1 : 0.7}
      >
        <View style={[
          styles.iconContainer,
          isCurrentLocation && styles.currentIconContainer
        ]}>
          <Ionicons 
            name={isCurrentLocation ? "storefront" : "storefront-outline"} 
            size={24} 
            color={isCurrentLocation ? "white" : "#A3C163"} 
          />
        </View>
        <View style={styles.supermarketInfo}>
          <View style={styles.nameContainer}>
            <Text style={[
              styles.supermarketName,
              isCurrentLocation && styles.currentSupermarketName
            ]}>{item.name}</Text>
            {isCurrentLocation && (
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>CURRENT</Text>
              </View>
            )}
          </View>
          <Text style={styles.supermarketAddress}>{item.address}</Text>
          <Text style={styles.lastVisit}>Last visit: {item.lastVisit}</Text>
        </View>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDeleteSupermarket(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        <Header 
          location={currentLocation} 
          onPressLocation={() => {}} 
          onLocationChange={(newLocation) => setCurrentLocation(newLocation)}
        />
      </SafeAreaView>

      <View style={styles.titleWrapper}>
        <Text style={styles.screenTitle}>Supermarkets</Text>
      </View>

      {supermarkets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="storefront-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No supermarkets visited yet</Text>
          <Text style={styles.emptySubtext}>Start shopping to see your history</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={supermarkets.sort((a, b) => {
            if (currentLocation === a.name) return -1;
            if (currentLocation === b.name) return 1;
            return 0;
          })}
          keyExtractor={(item) => item.id}
          renderItem={renderSupermarket}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

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
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 10,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
  },
  supermarketItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  currentSupermarketItem: {
    backgroundColor: '#f8fdf8',
    borderWidth: 2,
    borderColor: '#A3C163',
    shadowColor: '#A3C163',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
    marginBottom: 20,
  },
  supermarketInfo: {
    flex: 1,
    marginLeft: 4,
  },
  supermarketName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  supermarketAddress: {
    fontSize: 15,
    color: '#666',
    marginBottom: 6,
    lineHeight: 20,
  },
  lastVisit: {
    fontSize: 13,
    color: '#999',
    fontWeight: '500',
  },
  currentIconContainer: {
    backgroundColor: '#A3C163',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentSupermarketName: {
    color: '#A3C163',
    fontWeight: '700',
  },
  currentBadge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  currentBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f0f8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  deleteButton: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
});