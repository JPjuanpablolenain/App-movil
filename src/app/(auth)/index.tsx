import imagePath from '@/src/constants/imagePath';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const logoScale = useRef(new Animated.Value(0.5)).current;
  const textFade = useRef(new Animated.Value(0)).current;
  const footerFade = useRef(new Animated.Value(0)).current;
  const footerHeight = useRef(new Animated.Value(0)).current;
  const containerFade = useRef(new Animated.Value(1)).current; // <-- NUEVO

  useEffect(() => {
    // Animación inicial: logo y texto
    Animated.sequence([
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(textFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Footer aparece a los 3s
    const splashTimer = setTimeout(() => {
      setIsLoading(true);

      Animated.parallel([
        Animated.timing(footerFade, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(footerHeight, {
          toValue: verticalScale(100),
          duration: 600,
          useNativeDriver: false,
        }),
      ]).start();

      // Luego de 2s → zoom-out + fade total
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(logoScale, {
            toValue: 0.5,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(textFade, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(containerFade, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start(() => {
          router.replace('/(auth)/login');
        });
      }, 2000);
    }, 3000);

    return () => clearTimeout(splashTimer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{ flex: 1, opacity: containerFade }}>
        <View style={styles.header} />

        {/* Cuerpo central */}
        <View style={styles.body}>
          <Animated.Image
            source={imagePath.logo}
            resizeMode="contain"
            style={[
              styles.logoStyle,
              { transform: [{ scale: logoScale }] },
            ]}
          />
          <Animated.Text style={[styles.youPayText, { opacity: textFade }]}>
            YouPay
          </Animated.Text>
        </View>

        {/* Footer animado */}
        <Animated.View style={[styles.footer, { height: footerHeight }]}>
          {isLoading && (
            <Animated.View style={{ opacity: footerFade, alignItems: 'center' }}>
              <ActivityIndicator size={moderateScale(50)} color="white" />
              <Text style={styles.loadingText}>Loading...</Text>
            </Animated.View>
          )}
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    height: 0,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoStyle: {
    width: moderateScale(100),
    height: moderateScale(100),
  },
  youPayText: {
    fontSize: 40,
    color: 'white',
    marginTop: 10,
  },
  loadingText: {
    marginTop: 10,
    color: 'white',
    fontSize: 16,
  },
});

export default Auth;
