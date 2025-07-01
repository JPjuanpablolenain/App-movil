import React, { useState, useContext, useRef } from 'react';
import { Alert, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import AppButton from '@/src/components/AppButton';
import AuthCard from '@/src/components/AuthCard';
import FormInput from '@/src/components/FormInput';
import TabButton from '@/src/components/tabButton';
import { AuthContext } from '../_layout';

const LoginScreen = () => {
  const [selectedTab, setSelectedTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { login, register } = useContext(AuthContext);
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    
    if (selectedTab === 'signup') {
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
      
      const result = await register(email, password);
      if (result.success) {
        Alert.alert('Success', 'Account created successfully!');
        setSelectedTab('login');
      } else {
        Alert.alert('Error', result.message);
      }
    } else {
      const result = await login(email, password);
      if (result.success) {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          router.replace('/(main)/home');
        });
      } else {
        Alert.alert('Error', result.message);
      }
    }
  };

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
      <AuthCard>
        <ScrollView
          contentContainerStyle={styles.cardContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Tab Selector */}
          <View style={styles.section}>
            <View style={styles.tabSelector}>
              <TabButton
                label="Log in"
                isActive={selectedTab === 'login'}
                onPress={() => setSelectedTab('login')}
              />
              <TabButton
                label="Sign up"
                isActive={selectedTab === 'signup'}
                onPress={() => setSelectedTab('signup')}
              />
            </View>
          </View>

          {/* Título */}
          <View style={styles.section}>
            <Text style={styles.title}>
              {selectedTab === 'login'
                ? "It's always nice to see you again!"
                : 'Welcome to SmartMarket!'}
            </Text>
          </View>

          {/* Inputs */}
          <View style={styles.inputsContainer}>
            <FormInput 
              placeholder="Email address" 
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <FormInput 
              placeholder="Password" 
              value={password}
              onChangeText={setPassword}
              secureTextEntry 
            />
            {selectedTab === 'signup' && (
              <FormInput 
                placeholder="Confirm password" 
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry 
              />
            )}
          </View>

          {/* Botón */}
          <View style={styles.section}>
           <AppButton
                label={selectedTab === 'login' ? 'Log In' : 'Sign Up'}
                onPress={handleSubmit}
            />
          </View>

          {/* Enlace secundario */}
          <View style={styles.section}>
            {selectedTab === 'login' ? (
              <TouchableOpacity>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setSelectedTab('login')}>
                <Text style={styles.forgotText}>
                  I already have an account.{' '}
                  <Text style={{ fontWeight: 'bold' }}>Log in</Text>
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </AuthCard>
    </KeyboardAvoidingView>
    </Animated.View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  section: {
    marginBottom: 15,
    alignItems: 'center',
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: 'black',
    borderRadius: 30,
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginVertical: 10,
  },
  inputsContainer: {
    width: '100%',
    marginBottom: 15,
  },
  forgotText: {
    color: '#555',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
});