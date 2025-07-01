import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, StatusBar, Modal, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSupermarket } from '../app/_layout';

const Header = ({ location, onPressLocation, onLocationChange }: {
  location: string;
  onPressLocation?: () => void;
  onLocationChange?: (newLocation: string) => void;
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [supermarkets, setSupermarkets] = useState([]);
  const router = useRouter();
  const { reloadDataForSupermarket } = useSupermarket();

  const handleLocationPress = async () => {
    await loadSupermarkets();
    setModalVisible(true);
  };
  
  const loadSupermarkets = async () => {
    try {
      const currentUser = await AsyncStorage.getItem('currentUser');
      if (currentUser) {
        const savedSupermarkets = await AsyncStorage.getItem(`visitedSupermarkets_${currentUser}`);
        if (savedSupermarkets) {
          setSupermarkets(JSON.parse(savedSupermarkets));
        }
      }
    } catch (error) {
      console.log('Error loading supermarkets:', error);
    }
  };

  const handleSelectSupermarket = async (supermarketName: string) => {
    try {
      const currentUser = await AsyncStorage.getItem('currentUser');
      if (currentUser) {
        await AsyncStorage.setItem(`currentLocation_${currentUser}`, supermarketName);
        await reloadDataForSupermarket(supermarketName);
        onLocationChange?.(supermarketName);
      }
    } catch (error) {
      console.log('Error changing location:', error);
    }
    setModalVisible(false);
  };
  
  const renderSupermarket = ({ item }) => (
    <TouchableOpacity 
      style={styles.supermarketOption}
      onPress={() => handleSelectSupermarket(item.name)}
    >
      <Ionicons name="storefront" size={20} color="#A3C163" />
      <View style={styles.supermarketDetails}>
        <Text style={styles.supermarketName}>{item.name}</Text>
        <Text style={styles.supermarketAddress}>{item.address}</Text>
      </View>
      {location === item.name && (
        <Ionicons name="checkmark" size={20} color="#A3C163" />
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <View style={styles.container}>
        <TouchableOpacity style={styles.locationContainer} onPress={handleLocationPress}>
          <Ionicons name="location-outline" size={18} color="black" />
          <Text style={styles.locationText}>{location}</Text>
          <Ionicons name="chevron-down" size={16} color="black" style={styles.arrow} />
        </TouchableOpacity>
      </View>
      
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Supermarket</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => {
                  setModalVisible(false);
                  router.push('/(main)/scan');
                }}
              >
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            {supermarkets.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No supermarkets scanned yet</Text>
                <Text style={styles.emptySubtext}>Tap + to scan a QR code</Text>
              </View>
            ) : (
              <FlatList
                data={supermarkets.sort((a, b) => {
                  if (location === a.name) return -1;
                  if (location === b.name) return 1;
                  return 0;
                })}
                keyExtractor={(item) => item.id}
                renderItem={renderSupermarket}
                style={styles.supermarketList}
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 15,
    backgroundColor: 'transparent',
  },
  locationContainer: {
    backgroundColor: '#A3C163',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  locationText: {
    marginLeft: 5,
    fontWeight: '600',
  },
  arrow: {
    marginLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    paddingTop: 100,
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#A3C163',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  supermarketList: {
    maxHeight: 300,
  },
  supermarketOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  supermarketDetails: {
    flex: 1,
    marginLeft: 12,
  },
  supermarketName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  supermarketAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default Header;