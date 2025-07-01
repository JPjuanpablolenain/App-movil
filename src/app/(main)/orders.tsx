import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import BottomTabBar from '../../components/BottomTabBar';
import Header from '../../components/Header';
import { useOrders, Order } from '../_layout';

const OrdersScreen = () => {
  const [activeTab, setActiveTab] = useState('more');
  const [currentLocation, setCurrentLocation] = useState('Select Location');
  const router = useRouter();
  
  useEffect(() => {
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
  const { orders } = useOrders();

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

  const renderOrder = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Orden #{item.id}</Text>
        <Text style={styles.orderDate}>{item.date}</Text>
      </View>
      
      <View style={styles.orderItems}>
        {item.items.map((product, index) => (
          <Text key={index} style={styles.orderItem}>
            {product.name} x{product.quantity} - {product.price}
          </Text>
        ))}
      </View>
      
      <View style={styles.orderFooter}>
        <Text style={styles.orderTotal}>Total: {item.total}</Text>
      </View>
    </View>
  );

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
        <Text style={styles.screenTitle}>Order history</Text>
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tienes órdenes aún</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrder}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

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
    borderBottomWidth: 1,
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
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 120,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  orderItems: {
    marginBottom: 10,
  },
  orderItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  orderFooter: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: 'green',
    textAlign: 'right',
  },
});

export default OrdersScreen;