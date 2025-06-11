// src/app/(main)/scan.tsx

import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// ── Importamos BarCodeScanner y PermissionStatus de expo-barcode-scanner ──
// Esto garantiza que Expo Go reconozca correctamente el componente nativo.
import { BarCodeScanner, PermissionStatus } from 'expo-barcode-scanner';

import BottomTabBar from '../../components/BottomTabBar';
import Header from '../../components/Header';

const { width, height } = Dimensions.get('window');
const TAB_BAR_HEIGHT = 60;

export default function ScanScreen() {
  // ---------------------------
  // 1) Estados locales
  // ---------------------------
  // Estado para el permiso de cámara (null = pendiente, 'granted' o cualquier otro)
  const [hasPermission, setHasPermission] = useState<PermissionStatus | null>(null);
  // Para evitar que onBarCodeScanned dispare múltiples alertas de forma simultánea
  const [scanned, setScanned]             = useState(false);
  // Para rastrear qué pestaña está activa en el BottomTabBar (solo usamos string)
  const [activeTab, setActiveTab]         = useState<string>('scan');

  const router = useRouter();
  const insets = useSafeAreaInsets();

  // -------------------------------------------
  // 2) Pedir permiso de cámara una sola vez
  // -------------------------------------------
  useEffect(() => {
    (async () => {
      // Esto abre el diálogo de permisos nativo de Expo Go
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status);
    })();
  }, []);

  // -------------------------------------------
  // 3) Función para manejar la pulsación de tab
  // -------------------------------------------
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

  // --------------------------------------------------
  // 4) Callback que se ejecuta al detectar un código
  // --------------------------------------------------
  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;        // Si ya escaneamos, no volvemos a alertar
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
        },
      ],
      { cancelable: true }
    );
  };

  // -------------------------------------------
  // 5) Mientras no sabemos el permiso, mostramos loader
  // -------------------------------------------
  if (hasPermission === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00aa00" />
        <Text style={{ marginTop: 12 }}>Solicitando permiso de cámara...</Text>
      </View>
    );
  }

  // -------------------------------------------
  // 6) Si denegó el permiso, mostramos mensaje
  // -------------------------------------------
  if (hasPermission !== PermissionStatus.GRANTED) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          No se otorgó permiso para usar la cámara. Por favor, habilítalo en Ajustes.
        </Text>
      </View>
    );
  }

  // -------------------------------------------
  // 7) Permiso otorgado: renderizamos el scanner
  // -------------------------------------------
  return (
    <View style={styles.root}>
      {/* Header en SafeArea */}
      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        <Header location="Sarmiento 123" onPressLocation={() => {}} />
      </SafeAreaView>

      {/* Contenedor del scanner (ocupa todo) */}
      <View style={styles.scannerContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Overlay semitransparente con “ventana” al centro */}
        <View style={styles.overlay}>
          <View style={[styles.overlayRow, { flex: 1 }]} />
          <View style={styles.overlayCenter}>
            <View style={styles.sideOverlay} />
            <View style={styles.frame} /> {/* Área donde debe entrar el QR */}
            <View style={styles.sideOverlay} />
          </View>
          <View style={[styles.overlayRow, { flex: 1 }]} />
        </View>

        {/* Texto de instrucción para el usuario */}
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>Apunta al código QR</Text>
        </View>
      </View>

      {/* BottomTabBar fijo al fondo real de la pantalla */}
      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Estilos
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex:            1,
    backgroundColor: 'black',
  },
  headerSafeArea: {
    backgroundColor: 'white',
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 2 },
    shadowOpacity:   0.1,
    shadowRadius:    4,
    elevation:       6,
    zIndex:          10,
  },
  loadingContainer: {
    flex:            1,
    justifyContent:  'center',
    alignItems:      'center',
    backgroundColor: 'white',
  },
  errorContainer: {
    flex:            1,
    justifyContent:  'center',
    alignItems:      'center',
    padding:         20,
    backgroundColor: 'white',
  },
  errorText: {
    fontSize:   16,
    color:      '#aa0000',
    textAlign:  'center',
  },
  scannerContainer: {
    flex:            1,
    position:        'relative',
    justifyContent:  'center',
    alignItems:      'center',
  },
  overlay: {
    position:        'absolute',
    top:             0,
    left:            0,
    right:           0,
    bottom:          0,
    justifyContent:  'center',
    alignItems:      'center',
  },
  overlayRow: {
    width:           '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  overlayCenter: {
    flexDirection: 'row',
  },
  sideOverlay: {
    width:           '15%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  frame: {
    width:            '70%',
    aspectRatio:      1, // Mantiene la forma cuadrada
    borderColor:      '#fff',
    borderWidth:      2,
    borderRadius:     12,
  },
  instructionContainer: {
    position: 'absolute',
    bottom:   100,
    alignSelf: 'center',
  },
  instructionText: {
    color:      '#fff',
    fontSize:   18,
    fontWeight: '500',
  },
});
