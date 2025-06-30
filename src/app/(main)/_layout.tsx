import { Stack } from 'expo-router';
import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../_layout';
import { Redirect, useRouter } from 'expo-router';

export default function MainLayout() {
  const { isLoggedIn } = useContext(AuthContext);
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/(auth)/login');
    }
  }, [isLoggedIn]);
  
  if (!isLoggedIn) {
    return null;
  }
  
  return <Stack screenOptions={{ headerShown: false }} />;
}