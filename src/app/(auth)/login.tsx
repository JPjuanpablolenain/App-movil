import React, { useState } from 'react';
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
import { router } from 'expo-router';

const LoginScreen = () => {
  const [selectedTab, setSelectedTab] = useState<'login' | 'signup'>('login');

  return (
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
                ? "It’s always nice to see you again!"
                : 'Welcome to SmartMarket!'}
            </Text>
          </View>

          {/* Inputs */}
          <View style={styles.inputsContainer}>
            <FormInput placeholder="Email address" />
            <FormInput placeholder="Password" secureTextEntry />
            {selectedTab === 'signup' && (
              <FormInput placeholder="Confirm password" secureTextEntry />
            )}
          </View>

          {/* Botón */}
          <View style={styles.section}>
           <AppButton
                label="Log In"
                onPress={() => {
                router.replace('/(main)/home');
            }}
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
