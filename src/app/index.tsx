import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { AuthContext } from './_layout';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const { isLoggedIn } = useContext(AuthContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const loggedIn = await AsyncStorage.getItem('isLoggedIn');
        if (loggedIn === 'true') {
          router.replace('/(main)/welcome');
        } else {
          router.replace('/(auth)');
        }
      } catch (error) {
        router.replace('/(auth)');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  if (isLoading) {
    return <View style={{ flex: 1, backgroundColor: 'white' }} />;
  }

  return <View style={{ flex: 1 }} />;
}