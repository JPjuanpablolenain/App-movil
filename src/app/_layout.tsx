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
  register: (email: string, password: string) => Promise.resolve({ success: false, message: '' }),
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
        const newFavorites = favorites.filter(item => item.id !== id);
        setFavorites(newFavorites);
        await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    };
    
    const addFavorite = async (product: Product) => {
        if (!favorites.some(fav => fav.id === product.id)) {
            const newFavorites = [...favorites, product];
            setFavorites(newFavorites);
            await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
        }
    };
    
    const isFavorite = (id: string) => {
        return favorites.some(fav => fav.id === id);
    };
    
    // Funciones para el carrito
    const addToCart = async (product: Product) => {
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
        await AsyncStorage.setItem('cartItems', JSON.stringify(newCartItems));
    };
    
    const removeFromCart = async (id: string) => {
        const newCartItems = cartItems.filter(item => item.id !== id);
        setCartItems(newCartItems);
        await AsyncStorage.setItem('cartItems', JSON.stringify(newCartItems));
    };
    
    const increaseQuantity = async (id: string) => {
        const newCartItems = cartItems.map(item => 
            item.id === id 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
        );
        setCartItems(newCartItems);
        await AsyncStorage.setItem('cartItems', JSON.stringify(newCartItems));
    };
    
    const decreaseQuantity = async (id: string) => {
        const newCartItems = cartItems.map(item => 
            item.id === id
                ? { ...item, quantity: item.quantity - 1 } 
                : item
        ).filter(item => item.quantity > 0);
        setCartItems(newCartItems);
        await AsyncStorage.setItem('cartItems', JSON.stringify(newCartItems));
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
        await AsyncStorage.setItem('orders', JSON.stringify(newOrders));
        
        // Limpiar carrito después de guardar la orden
        await clearCart();
    };
    
    const clearCart = async () => {
        setCartItems([]);
        await AsyncStorage.setItem('cartItems', JSON.stringify([]));
    };
    
    const getOrders = () => {
        return orders;
    };
    
    // Funciones de autenticación
    const register = async (email: string, password: string) => {
        try {
            const existingUsers = await AsyncStorage.getItem('users');
            const users = existingUsers ? JSON.parse(existingUsers) : [];
            
            if (users.find((user: any) => user.email === email)) {
                return { success: false, message: 'User already exists' };
            }
            
            users.push({ name: 'Usuario', email, password });
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
                await AsyncStorage.setItem('currentUserName', 'Usuario');
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
        setIsLoggedIn(false);
    };
    
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const loggedIn = await AsyncStorage.getItem('isLoggedIn');
                const hasSeenSplash = await AsyncStorage.getItem('hasSeenSplash');
                const savedFavorites = await AsyncStorage.getItem('favorites');
                const savedCartItems = await AsyncStorage.getItem('cartItems');
                const savedOrders = await AsyncStorage.getItem('orders');
                
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
                        <Stack screenOptions={{ headerShown: false }}/>
                    </OrdersContext.Provider>
                </CartContext.Provider>
            </FavoritesContext.Provider>
        </AuthContext.Provider>
    );
};

export default RootNavigation;