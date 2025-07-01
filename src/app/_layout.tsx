import { Redirect, Stack } from 'expo-router';
import * as SplashScreen from "expo-splash-screen";
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Definir el tipo para un producto
export type Product = {
  id: string;
  name: string;
  price: string;
  image: any;
  quantity?: number;
};

// Definir el tipo para un item del carrito (producto con cantidad)
export type CartItem = Product & {
  quantity: number;
};

// Definir el tipo para una orden
export type Order = {
  id: string;
  date: string;
  items: CartItem[];
  total: string;
};

// Definir el tipo para el contexto de favoritos
type FavoritesContextType = {
  favorites: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
};

// Definir el tipo para el contexto del carrito
type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  isInCart: (id: string) => boolean;
  getCartCount: () => number;
  getItemQuantity: (id: string) => number;
  saveOrder: () => Promise<void>;
  clearCart: () => Promise<void>;
};

// Definir el tipo para el contexto de órdenes
type OrdersContextType = {
  orders: Order[];
  getOrders: () => Order[];
};

// Crear contexto para favoritos
const FavoritesContext = createContext<FavoritesContextType | null>(null);

// Crear contexto para el carrito
const CartContext = createContext<CartContextType | null>(null);

// Crear contexto para las órdenes
const OrdersContext = createContext<OrdersContextType | null>(null);

// Crear contexto para el cambio de supermercado
const SupermarketContext = createContext<{
  reloadDataForSupermarket: (supermarketName: string) => Promise<void>;
  handleSupermarketDeletion: (deletedSupermarketName: string) => Promise<void>;
} | null>(null);

export const useSupermarket = () => {
  const context = useContext(SupermarketContext);
  if (!context) {
    throw new Error("useSupermarket must be used within a SupermarketProvider");
  }
  return context;
};

// Hook personalizado para usar el contexto de favoritos
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};

// Hook personalizado para usar el contexto del carrito
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// Hook personalizado para usar el contexto de órdenes
export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
};

// Contexto para el estado de autenticación
export const AuthContext = createContext({
  isLoggedIn: false,
  login: (email: string, password: string) => Promise.resolve({ success: false, message: '' }),
  register: (email: string, password: string, username?: string) => Promise.resolve({ success: false, message: '' }),
  logout: () => {},
});

const RootNavigation = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isFirstLaunch, setIsFirstLaunch] = useState(true);

    const [favorites, setFavorites] = useState<Product[]>([]);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    
    // Funciones para favoritos
    const removeFavorite = async (id: string) => {
        try {
            const currentUser = await AsyncStorage.getItem('currentUser');
            const currentLocation = await AsyncStorage.getItem(`currentLocation_${currentUser}`);
            if (!currentUser || !currentLocation) return;
            
            const newFavorites = favorites.filter(item => item.id !== id);
            setFavorites(newFavorites);
            await AsyncStorage.setItem(`favorites_${currentUser}_${currentLocation}`, JSON.stringify(newFavorites));
        } catch (error) {
            console.log('Error removing favorite:', error);
        }
    };
    
    const addFavorite = async (product: Product) => {
        try {
            const currentUser = await AsyncStorage.getItem('currentUser');
            const currentLocation = await AsyncStorage.getItem(`currentLocation_${currentUser}`);
            if (!currentUser || !currentLocation) return;
            
            if (!favorites.some(fav => fav.id === product.id)) {
                const newFavorites = [...favorites, product];
                setFavorites(newFavorites);
                await AsyncStorage.setItem(`favorites_${currentUser}_${currentLocation}`, JSON.stringify(newFavorites));
            }
        } catch (error) {
            console.log('Error adding favorite:', error);
        }
    };
    
    const isFavorite = (id: string) => {
        return favorites.some(fav => fav.id === id);
    };
    
    // Funciones para el carrito
    const addToCart = async (product: Product) => {
        try {
            const currentUser = await AsyncStorage.getItem('currentUser');
            if (!currentUser) return;
            
            let newCartItems;
            
            // Si el producto ya está en el carrito, aumentar la cantidad
            if (cartItems.some(item => item.id === product.id)) {
                newCartItems = cartItems.map(item => 
                    item.id === product.id 
                        ? { ...item, quantity: item.quantity + 1 } 
                        : item
                );
            } else {
                // Si no, agregarlo con cantidad 1
                const newItem: CartItem = {
                    ...product,
                    quantity: 1
                };
                newCartItems = [...cartItems, newItem];
            }
            
            setCartItems(newCartItems);
            await AsyncStorage.setItem(`cartItems_${currentUser}`, JSON.stringify(newCartItems));
        } catch (error) {
            console.log('Error adding to cart:', error);
        }
    };
    
    const removeFromCart = async (id: string) => {
        try {
            const currentUser = await AsyncStorage.getItem('currentUser');
            if (!currentUser) return;
            
            const newCartItems = cartItems.filter(item => item.id !== id);
            setCartItems(newCartItems);
            await AsyncStorage.setItem(`cartItems_${currentUser}`, JSON.stringify(newCartItems));
        } catch (error) {
            console.log('Error removing from cart:', error);
        }
    };
    
    const increaseQuantity = async (id: string) => {
        try {
            const currentUser = await AsyncStorage.getItem('currentUser');
            if (!currentUser) return;
            
            const newCartItems = cartItems.map(item => 
                item.id === id 
                    ? { ...item, quantity: item.quantity + 1 } 
                    : item
            );
            setCartItems(newCartItems);
            await AsyncStorage.setItem(`cartItems_${currentUser}`, JSON.stringify(newCartItems));
        } catch (error) {
            console.log('Error increasing quantity:', error);
        }
    };
    
    const decreaseQuantity = async (id: string) => {
        try {
            const currentUser = await AsyncStorage.getItem('currentUser');
            if (!currentUser) return;
            
            const newCartItems = cartItems.map(item => 
                item.id === id
                    ? { ...item, quantity: item.quantity - 1 } 
                    : item
            ).filter(item => item.quantity > 0);
            setCartItems(newCartItems);
            await AsyncStorage.setItem(`cartItems_${currentUser}`, JSON.stringify(newCartItems));
        } catch (error) {
            console.log('Error decreasing quantity:', error);
        }
    };
    
    const isInCart = (id: string) => {
        return cartItems.some(item => item.id === id);
    };
    
    const getCartCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };
    
    const getItemQuantity = (id: string) => {
        const item = cartItems.find(item => item.id === id);
        return item ? item.quantity : 0;
    };
    
    const saveOrder = async () => {
        if (cartItems.length === 0) return;
        
        try {
            const currentUser = await AsyncStorage.getItem('currentUser');
            const currentLocation = await AsyncStorage.getItem(`currentLocation_${currentUser}`);
            if (!currentUser || !currentLocation) return;
            
            const total = cartItems.reduce((sum, item) => {
                const price = parseFloat(item.price.replace('$', ''));
                return sum + (price * item.quantity);
            }, 0).toFixed(2);
            
            const newOrder: Order = {
                id: (orders.length + 1).toString().padStart(3, '0'),
                date: new Date().toLocaleDateString(),
                items: [...cartItems],
                total: `$${total}`
            };
            
            const newOrders = [...orders, newOrder];
            setOrders(newOrders);
            await AsyncStorage.setItem(`orders_${currentUser}_${currentLocation}`, JSON.stringify(newOrders));
            
            // Limpiar carrito después de guardar la orden
            await clearCart();
        } catch (error) {
            console.log('Error saving order:', error);
        }
    };
    
    const clearCart = async () => {
        try {
            const currentUser = await AsyncStorage.getItem('currentUser');
            if (!currentUser) return;
            
            setCartItems([]);
            await AsyncStorage.setItem(`cartItems_${currentUser}`, JSON.stringify([]));
        } catch (error) {
            console.log('Error clearing cart:', error);
        }
    };
    
    const getOrders = () => {
        return orders;
    };
    
    const reloadDataForSupermarket = async (supermarketName: string) => {
        try {
            const currentUser = await AsyncStorage.getItem('currentUser');
            if (!currentUser) return;
            
            const userFavorites = await AsyncStorage.getItem(`favorites_${currentUser}_${supermarketName}`);
            const userOrders = await AsyncStorage.getItem(`orders_${currentUser}_${supermarketName}`);
            
            setFavorites(userFavorites ? JSON.parse(userFavorites) : []);
            setOrders(userOrders ? JSON.parse(userOrders) : []);
        } catch (error) {
            console.log('Error loading data for supermarket:', error);
        }
    };
    
    const handleSupermarketDeletion = async (deletedSupermarketName: string) => {
        try {
            const currentUser = await AsyncStorage.getItem('currentUser');
            if (!currentUser) return;
            
            const currentLocation = await AsyncStorage.getItem(`currentLocation_${currentUser}`);
            
            // Si se eliminó el supermercado actual, limpiar datos
            if (currentLocation === deletedSupermarketName) {
                setFavorites([]);
                setOrders([]);
                await AsyncStorage.removeItem(`currentLocation_${currentUser}`);
            }
        } catch (error) {
            console.log('Error handling supermarket deletion:', error);
        }
    };
    
    // Funciones de autenticación
    const register = async (email: string, password: string, username?: string) => {
        try {
            const existingUsers = await AsyncStorage.getItem('users');
            const users = existingUsers ? JSON.parse(existingUsers) : [];
            
            if (users.find((user: any) => user.email === email)) {
                return { success: false, message: 'User already exists' };
            }
            
            const userName = username || 'Usuario';
            users.push({ name: userName, email, password });
            await AsyncStorage.setItem('users', JSON.stringify(users));
            
            return { success: true, message: 'User registered successfully' };
        } catch (error) {
            return { success: false, message: 'Registration failed' };
        }
    };
    
    const login = async (email: string, password: string) => {
        try {
            const existingUsers = await AsyncStorage.getItem('users');
            const users = existingUsers ? JSON.parse(existingUsers) : [];
            
            const user = users.find((user: any) => user.email === email && user.password === password);
            
            if (user) {
                await AsyncStorage.setItem('isLoggedIn', 'true');
                await AsyncStorage.setItem('currentUser', email);
                await AsyncStorage.setItem('currentUserName', user.name);
                
                // Cargar datos específicos del usuario
                const currentLocation = await AsyncStorage.getItem(`currentLocation_${email}`);
                const userFavorites = currentLocation ? await AsyncStorage.getItem(`favorites_${email}_${currentLocation}`) : null;
                const userCartItems = await AsyncStorage.getItem(`cartItems_${email}`);
                const userOrders = currentLocation ? await AsyncStorage.getItem(`orders_${email}_${currentLocation}`) : null;
                
                setFavorites(userFavorites ? JSON.parse(userFavorites) : []);
                setCartItems(userCartItems ? JSON.parse(userCartItems) : []);
                setOrders(userOrders ? JSON.parse(userOrders) : []);
                
                setIsLoggedIn(true);
                return { success: true, message: 'Login successful' };
            } else {
                return { success: false, message: 'Invalid credentials' };
            }
        } catch (error) {
            return { success: false, message: 'Login failed' };
        }
    };
    
    const logout = async () => {
        await AsyncStorage.removeItem('isLoggedIn');
        await AsyncStorage.removeItem('currentUser');
        await AsyncStorage.removeItem('currentUserName');
        setOrders([]); // Limpiar órdenes al cerrar sesión
        setFavorites([]); // Limpiar favoritos al cerrar sesión
        setCartItems([]); // Limpiar carrito al cerrar sesión
        setIsLoggedIn(false);
    };
    
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const loggedIn = await AsyncStorage.getItem('isLoggedIn');
                const hasSeenSplash = await AsyncStorage.getItem('hasSeenSplash');
                const savedFavorites = currentUser ? await AsyncStorage.getItem(`favorites_${currentUser}`) : null;
                const savedCartItems = currentUser ? await AsyncStorage.getItem(`cartItems_${currentUser}`) : null;
                const currentUser = await AsyncStorage.getItem('currentUser');
                const savedOrders = currentUser ? await AsyncStorage.getItem(`orders_${currentUser}`) : null;
                
                setIsLoggedIn(loggedIn === 'true');
                setIsFirstLaunch(!hasSeenSplash);
                
                if (savedFavorites) {
                    setFavorites(JSON.parse(savedFavorites));
                }
                
                if (savedCartItems) {
                    setCartItems(JSON.parse(savedCartItems));
                }
                
                if (savedOrders) {
                    setOrders(JSON.parse(savedOrders));
                }
                
                setIsLoading(false);
                
                // Ocultar el splash screen nativo
                SplashScreen.hideAsync();
            } catch (error) {
                console.log('Error checking login status:', error);
                setIsLoading(false);
                SplashScreen.hideAsync();
            }
        };
        
        checkLoginStatus();
    }, []);
    
    if (isLoading) {
        return null; // Mostrar nada mientras se carga
    }
    
    return (
        <AuthContext.Provider value={{ isLoggedIn, login, register, logout }}>
            <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
                <CartContext.Provider value={{ 
                    cartItems, 
                    addToCart, 
                    removeFromCart, 
                    increaseQuantity, 
                    decreaseQuantity, 
                    isInCart, 
                    getCartCount,
                    getItemQuantity,
                    saveOrder,
                    clearCart
                }}>
                    <OrdersContext.Provider value={{ orders, getOrders }}>
                        <SupermarketContext.Provider value={{ reloadDataForSupermarket, handleSupermarketDeletion }}>
                            <Stack screenOptions={{ headerShown: false }}/>
                        </SupermarketContext.Provider>
                    </OrdersContext.Provider>
                </CartContext.Provider>
            </FavoritesContext.Provider>
        </AuthContext.Provider>
    );
};

export default RootNavigation;