import { Stack } from 'expo-router';
import React, { useContext } from 'react';
import { AuthContext } from '../_layout';
import { Redirect } from 'expo-router';

export default function MainLayout() {
  const { isLoggedIn } = useContext(AuthContext);
  
  // Si no está autenticado, redirigir a la pantalla de login
  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }
  
  return <Stack screenOptions={{ headerShown: false }} />;
}