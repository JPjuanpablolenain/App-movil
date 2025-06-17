import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import BottomTabBar from '../../components/BottomTabBar';
import Header from '../../components/Header';
import { CartItem, useCart, useFavorites } from '../_layout';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CartScreen = () => {
  const [activeTab, setActiveTab] = useState('cart');
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 60;
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

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
        break; // ya estamos en Cart
      case 'more':
        router.push('/(main)/more');
        break;
    }
  };

  const handleToggleFavorite = (item) => {
    if (isFavorite(item.id)) {
      removeFavorite(item.id);
    } else {
      addFavorite(item);
    }
  };

  const handleRemoveFromCart = (id) => {
    removeFromCart(id);
  };

  const handleIncreaseQuantity = (id) => {
    increaseQuantity(id);
  };

  const handleDecreaseQuantity = (id) => {
    decreaseQuantity(id);
  };

  const handleCheckout = () => {
    setModalVisible(true);
  };

  const handleGenerateQR = () => {
    console.log('Generate QR Code');
    setModalVisible(false);
    // Aquí iría la lógica para generar el código QR
  };

  const handleScanQR = () => {
    console.log('Scan QR Code');
    setModalVisible(false);
    // Aquí iría la lógica para escanear el código QR
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.card}>
      {/* Imagen del producto */}
      <Image source={item.image} style={styles.image} resizeMode="contain" />
      
      {/* Información del producto */}
      <View style={styles.productInfo}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.price}>{item.price}</Text>
      </View>
      
      {/* Controles de cantidad */}
      <View style={styles.quantityControls}>
        <TouchableOpacity 
          style={styles.quantityButton} 
          onPress={() => handleDecreaseQuantity(item.id)}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        
        <Text style={styles.quantityText}>{item.quantity}</Text>
        
        <TouchableOpacity 
          style={styles.quantityButton} 
          onPress={() => handleIncreaseQuantity(item.id)}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      
      {/* Botones de acción */}
      <View style={styles.actionButtons}>
        {/* Botón de favoritos */}
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleToggleFavorite(item)}
        >
          <Ionicons 
            name={isFavorite(item.id) ? "heart" : "heart-outline"} 
            size={22} 
            color={isFavorite(item.id) ? 'red' : '#666'} 
          />
        </TouchableOpacity>
        
        {/* Botón de eliminar */}
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleRemoveFromCart(item.id)}
        >
          <Ionicons name="trash-outline" size={22} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Calcular el total del carrito
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      // Extraer el valor numérico del precio (quitar el símbolo $ y convertir a número)
      const price = parseFloat(item.price.replace('$', ''));
      return total + (price * item.quantity);
    }, 0).toFixed(2);
  };

  return (
    <View style={styles.root}>
      {/* 1) HEADER */}
      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        <Header location="Sarmiento 123" onPressLocation={() => {}} />
      </SafeAreaView>

      {/* 2) TÍTULO */}
      <View style={styles.titleWrapper}>
        <Text style={styles.screenTitle}>Shopping Cart</Text>
      </View>

      {/* 3) CONTENIDO PRINCIPAL */}
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            renderItem={renderCartItem}
            contentContainerStyle={{
              paddingHorizontal: 15,
              paddingTop: 10,
              paddingBottom: 170, // Extra space for checkout section (increased)
            }}
            showsVerticalScrollIndicator={false}
          />
          
          {/* Checkout section */}
          <View style={styles.checkoutContainer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>${calculateTotal()}</Text>
            </View>
            <TouchableOpacity 
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Modal de opciones de checkout */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Checkout Options</Text>
                
                <TouchableOpacity 
                  style={styles.modalButton}
                  onPress={handleGenerateQR}
                >
                  <Ionicons name="qr-code-outline" size={24} color="white" style={styles.modalButtonIcon} />
                  <Text style={styles.modalButtonText}>Generate QR Code</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.modalButton}
                  onPress={handleScanQR}
                >
                  <Ionicons name="scan-outline" size={24} color="white" style={styles.modalButtonIcon} />
                  <Text style={styles.modalButtonText}>Scan QR Code</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* 4) BOTTOM TAB BAR */}
      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

export default CartScreen;

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
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
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
  image: {
    width: 70,
    height: 70,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: 'green',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  quantityButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 10,
    minWidth: 20,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 60,
  },
  actionButton: {
    padding: 5,
  },
  checkoutContainer: {
    position: 'absolute',
    bottom: 60 + 30, // TAB_BAR_HEIGHT + padding aumentado
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: 'green',
  },
  checkoutButton: {
    backgroundColor: '#A3C163',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  // Estilos para el modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.8,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
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
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  modalButton: {
    flexDirection: 'row',
    backgroundColor: '#A3C163',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  modalButtonIcon: {
    marginRight: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});