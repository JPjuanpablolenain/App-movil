import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, Camera } from 'expo-camera';

import BottomTabBar from '../../components/BottomTabBar';
import Header from '../../components/Header';

export default function ScanScreen() {
  const [activeTab, setActiveTab] = useState('scan');
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

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

  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);
    Alert.alert(
      'Código escaneado',
      `Tipo: ${type}\nDatos: ${data}`,
      [
        {
          text: 'Escanear nuevamente',
          onPress: () => setScanned(false),
        },
        {
          text: 'Cerrar',
          style: 'cancel',
          onPress: () => setScanned(false),
        },
      ]
    );
  };

  if (hasPermission === null) {
    return (
      <View style={styles.root}>
        <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
          <Header location="Sarmiento 123" onPressLocation={() => {}} />
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
          <Header location="Sarmiento 123" onPressLocation={() => {}} />
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
        <Header location="Sarmiento 123" onPressLocation={() => {}} />
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
        
        {/* Overlay con marco de escaneo */}
        <View style={styles.overlay}>
          <View style={styles.overlayTop} />
          <View style={styles.overlayMiddle}>
            <View style={styles.overlaySide} />
            <View style={styles.scanFrame} />
            <View style={styles.overlaySide} />
          </View>
          <View style={styles.overlayBottom} />
        </View>
        
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>
            Apunta la cámara al código QR o código de barras
          </Text>
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
            <Text style={styles.modalTitle}>¡Orden Aceptada!</Text>
            <Text style={styles.modalMessage}>
              Tu orden ha sido procesada exitosamente.
            </Text>
            
            <TouchableOpacity 
              style={styles.downloadButton}
              onPress={() => {
                Alert.alert('Descarga', 'Ticket descargado exitosamente');
                setOrderModalVisible(false);
              }}
            >
              <Text style={styles.downloadButtonText}>Descargar Ticket</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => {
                setOrderModalVisible(false);
                router.push('/(main)/home');
              }}
            >
              <Text style={styles.backButtonText}>Volver al Menú</Text>
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
              style={styles.backButton}
              onPress={() => {
                setErrorModalVisible(false);
                router.push('/(main)/home');
              }}
            >
              <Text style={styles.backButtonText}>Volver al Menú</Text>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 6,
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
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
  },
  overlayMiddle: {
    flexDirection: 'row',
    height: 250,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#A3C163',
    borderRadius: 6,
  },
  instructionContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
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
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#A3C163',
    marginBottom: 15,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 25,
  },
  downloadButton: {
    backgroundColor: '#A3C163',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 30,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  downloadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 30,
    width: '100%',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#666',
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