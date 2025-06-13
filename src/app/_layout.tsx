import { Redirect, Stack } from 'expo-router';
import * as SplashScreen from "expo-splash-screen";
import React, { createContext, useContext, useEffect, useState } from 'react';

// Crear contexto para favoritos (funcion para mas adelante guardar productos en favorito)
const FavoritesContext = createContext(null);

// Hook personalizado para usar el contexto de favoritos
export const useFavorites = () => useContext(FavoritesContext);

const RootNavigation = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [favorites, setFavorites] = useState([]);
    
    // Función para eliminar un favorito
    const removeFavorite = (id) => {
        setFavorites(favorites.filter(item => item.id !== id));
    };
    
    // Función para agregar un favorito
    const addFavorite = (item) => {
        if (!favorites.some(fav => fav.id === item.id)) {
            setFavorites([...favorites, item]);
        }
    };
    
    useEffect(() => {
        SplashScreen.hideAsync();
    }, []);
    
    return (
        <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
            <Stack screenOptions={{ headerShown: false}}/>
            {isLogin ? <Redirect href="/(main)" />:<Redirect href={"/(auth)"}/>}
        </FavoritesContext.Provider>
    );
};

export default RootNavigation;
