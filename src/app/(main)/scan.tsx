import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

import BottomTabBar from '../../components/BottomTabBar';
import Header from '../../components/Header';
import { useCart } from '../_layout';

export default function ScanScreen() {
  const [activeTab, setActiveTab] = useState('scan');
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [supermarketModalVisible, setSupermarketModalVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Select Location');
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { saveOrder } = useCart();

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
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
        break;
      case 'cart':
        router.push('/(main)/cart');
        break;
      case 'more':
        router.push('/(main)/more');
        break;
    }
  };

  const handleBarcodeScanned = async ({ type, data }) => {
    setScanned(true);
    
    try {
      // Intentar parsear como JSON para supermercados
      const qrData = JSON.parse(data);
      
      if (qrData.type === 'supermarket') {
        // Es un QR de supermercado
        await addSupermarket(qrData);
        setCurrentLocation(qrData.name);
        setSupermarketModalVisible(true);
      } else if (qrData.type === 'checkout') {
        // Es un QR de checkout
        await processCheckout();
      } else {
        // Otro tipo de QR
        Alert.alert(
          'Código escaneado',
          `Datos: ${data}`,
          [{ text: 'OK', onPress: () => setScanned(false) }]
        );
      }
    } catch (error) {
      // No es JSON válido, mostrar datos normales
      Alert.alert(
        'Código escaneado',
        `Tipo: ${type}\\nDatos: ${data}`,
        [{ text: 'OK', onPress: () => setScanned(false) }]
      );
    }
  };
  
  const processCheckout = async () => {
    try {
      // Usar saveOrder del contexto que ya maneja todo correctamente
      await saveOrder();
      
      setOrderModalVisible(true);
    } catch (error) {
      console.log('Error processing checkout:', error);
      Alert.alert('Error', 'Hubo un problema al procesar el pago');
      setScanned(false);
    }
  };
  
  const addSupermarket = async (supermarketData) => {
    try {
      const currentUser = await AsyncStorage.getItem('currentUser');
      if (!currentUser) return;
      
      const savedSupermarkets = await AsyncStorage.getItem(`visitedSupermarkets_${currentUser}`);
      const supermarkets = savedSupermarkets ? JSON.parse(savedSupermarkets) : [];
      
      // Verificar si ya existe
      if (supermarkets.some(s => s.id === supermarketData.id)) {
        return; // Ya existe, no agregar duplicado
      }
      
      // Agregar nuevo supermercado con fecha actual
      const newSupermarket = {
        ...supermarketData,
        lastVisit: new Date().toLocaleDateString()
      };
      
      const updatedSupermarkets = [...supermarkets, newSupermarket];
      await AsyncStorage.setItem(`visitedSupermarkets_${currentUser}`, JSON.stringify(updatedSupermarkets));
      
      // Guardar como ubicación actual
      await AsyncStorage.setItem(`currentLocation_${currentUser}`, supermarketData.name);
    } catch (error) {
      console.log('Error adding supermarket:', error);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.root}>
        <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
          <Header location={currentLocation} onPressLocation={() => {}} />
        </SafeAreaView>
        
        <View style={styles.titleWrapper}>
          <Text style={styles.screenTitle}>Scanner</Text>
        </View>
        
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>Solicitando permiso de cámara...</Text>
        </View>
        
        <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.root}>
        <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
          <Header location={currentLocation} onPressLocation={() => {}} />
        </SafeAreaView>
        
        <View style={styles.titleWrapper}>
          <Text style={styles.screenTitle}>Scanner</Text>
        </View>
        
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            No se otorgó permiso para usar la cámara. Por favor, habilítalo en Ajustes.
          </Text>
        </View>
        
        <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        <Header location={currentLocation} onPressLocation={() => {}} />
      </SafeAreaView>

      <View style={styles.titleWrapper}>
        <Text style={styles.screenTitle}>Scanner</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.redButton} 
            onPress={() => setErrorModalVisible(true)}
          />
          <TouchableOpacity 
            style={styles.greenButton} 
            onPress={() => setOrderModalVisible(true)}
          />
        </View>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'pdf417', 'aztec', 'ean13', 'ean8', 'upc_e', 'datamatrix', 'code128', 'code39', 'codabar', 'itf14', 'upc_a'],
          }}
        />
        
        {/* Overlay con marco de escaneo mejorado */}
        <View style={styles.overlay}>
          <View style={styles.overlayTop} />
          <View style={styles.overlayMiddle}>
            <View style={styles.overlaySide} />
            <View style={styles.scanFrame}>
              {/* Esquinas del marco */}
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              
              {/* Línea de escaneo animada */}
              <View style={styles.scanLine} />
            </View>
            <View style={styles.overlaySide} />
          </View>
          <View style={styles.overlayBottom} />
        </View>
        
        <View style={styles.instructionContainer}>
          <View style={styles.instructionCard}>
            <Text style={styles.instructionTitle}>Scan QR Code</Text>
            <Text style={styles.instructionText}>
              Point your camera at a QR code to add supermarket
            </Text>
          </View>
        </View>
      </View>

      {/* Modal de orden aceptada */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={orderModalVisible}
        onRequestClose={() => setOrderModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIcon}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
            
            <Text style={styles.modalTitle}>Payment Successful!</Text>
            <Text style={styles.modalMessage}>
              Your order has been processed successfully.
              Check your order history for details.
            </Text>
            
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => {
                setOrderModalVisible(false);
                router.push('/(main)/orders');
              }}
            >
              <Text style={styles.primaryButtonText}>View Order History</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => {
                setOrderModalVisible(false);
                router.push('/(main)/home');
              }}
            >
              <Text style={styles.secondaryButtonText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de supermercado agregado */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={supermarketModalVisible}
        onRequestClose={() => setSupermarketModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIcon}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
            
            <Text style={styles.modalTitle}>Supermarket Added!</Text>
            <Text style={styles.modalMessage}>
              {currentLocation} has been added to your visited supermarkets.
              You can now shop here!
            </Text>
            
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => {
                setSupermarketModalVisible(false);
                router.push('/(main)/home');
              }}
            >
              <Text style={styles.primaryButtonText}>Start Shopping</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => {
                setSupermarketModalVisible(false);
                router.push('/(main)/supermarkets');
              }}
            >
              <Text style={styles.secondaryButtonText}>View Supermarkets</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de orden fallida */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={errorModalVisible}
        onRequestClose={() => setErrorModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.errorModalTitle}>Orden Fallida</Text>
            <Text style={styles.modalMessage}>
              Hubo un problema al procesar tu orden. Por favor, inténtalo nuevamente.
            </Text>
            
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => {
                setErrorModalVisible(false);
              }}
            >
              <Text style={styles.retryButtonText}>Intentar Otra Vez</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => {
                setErrorModalVisible(false);
                router.push('/(main)/home');
              }}
            >
              <Text style={styles.secondaryButtonText}>Volver al Menú</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  redButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  greenButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#A3C163',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTop: {
    flex: 0.8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
  },
  overlayMiddle: {
    flexDirection: 'row',
    height: 240,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayBottom: {
    flex: 1.5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
  },
  scanFrame: {
    width: 240,
    height: 240,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#A3C163',
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 8,
  },
  scanLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#A3C163',
    opacity: 0.8,
  },
  instructionContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  instructionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    alignItems: 'center',
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Estilos para el modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#A3C163',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkmark: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: '#A3C163',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 30,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#A3C163',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#A3C163',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 30,
    width: '100%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#A3C163',
    fontSize: 16,
    fontWeight: '600',
  },
  errorModalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF3B30',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 30,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});