import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, StatusBar, Modal } from 'react-native';
import { useRouter } from 'expo-router';

const Header = ({ location, onPressLocation }: {
  location: string;
  onPressLocation?: () => void;
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const handleLocationPress = () => {
    setModalVisible(true);
  };

  const handleChangeLocation = () => {
    setModalVisible(false);
    router.push('/(main)/scan');
  };

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
            <TouchableOpacity 
              style={styles.changeLocationButton}
              onPress={handleChangeLocation}
            >
              <Text style={styles.changeLocationText}>Cambiar dirección de supermercado</Text>
            </TouchableOpacity>
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
  changeLocationButton: {
    backgroundColor: '#A3C163',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  changeLocationText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Header;