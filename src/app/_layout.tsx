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
};

// Crear contexto para favoritos
const FavoritesContext = createContext<FavoritesContextType | null>(null);

// Crear contexto para el carrito
const CartContext = createContext<CartContextType | null>(null);

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

// Contexto para el estado de autenticación
export const AuthContext = createContext({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

const RootNavigation = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isFirstLaunch, setIsFirstLaunch] = useState(true);
    const [favorites, setFavorites] = useState<Product[]>([]);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    
    // Funciones para favoritos
    const removeFavorite = (id: string) => {
        setFavorites(favorites.filter(item => item.id !== id));
    };
    
    const addFavorite = (product: Product) => {
        if (!favorites.some(fav => fav.id === product.id)) {
            setFavorites([...favorites, product]);
        }
    };
    
    const isFavorite = (id: string) => {
        return favorites.some(fav => fav.id === id);
    };
    
    // Funciones para el carrito
    const addToCart = (product: Product) => {
        // Si el producto ya está en el carrito, aumentar la cantidad
        if (cartItems.some(item => item.id === product.id)) {
            increaseQuantity(product.id);
            return;
        }
        
        // Si no, agregarlo con cantidad 1
        const newItem: CartItem = {
            ...product,
            quantity: 1
        };
        setCartItems([...cartItems, newItem]);
    };
    
    const removeFromCart = (id: string) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };
    
    const increaseQuantity = (id: string) => {
        setCartItems(cartItems.map(item => 
            item.id === id 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
        ));
    };
    
    const decreaseQuantity = (id: string) => {
        setCartItems(cartItems.map(item => 
            item.id === id && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1 } 
                : item
        ).filter(item => !(item.id === id && item.quantity <= 1)));
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
    
    // Funciones de autenticación
    const login = async () => {
        await AsyncStorage.setItem('isLoggedIn', 'true');
        await AsyncStorage.setItem('hasSeenSplash', 'true');
        setIsLoggedIn(true);
    };
    
    const logout = async () => {
        await AsyncStorage.removeItem('isLoggedIn');
        setIsLoggedIn(false);
    };
    
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const loggedIn = await AsyncStorage.getItem('isLoggedIn');
                const hasSeenSplash = await AsyncStorage.getItem('hasSeenSplash');
                
                setIsLoggedIn(loggedIn === 'true');
                setIsFirstLaunch(!hasSeenSplash);
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
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
                <CartContext.Provider value={{ 
                    cartItems, 
                    addToCart, 
                    removeFromCart, 
                    increaseQuantity, 
                    decreaseQuantity, 
                    isInCart, 
                    getCartCount,
                    getItemQuantity
                }}>
                    <Stack screenOptions={{ headerShown: false }}/>
                    {isLoggedIn ? (
                        <Redirect href="/(main)/home" />
                    ) : (
                        isFirstLaunch ? (
                            <Redirect href="/(auth)" />
                        ) : (
                            <Redirect href="/(auth)/login" />
                        )
                    )}
                </CartContext.Provider>
            </FavoritesContext.Provider>
        </AuthContext.Provider>
    );
};

export default RootNavigation;