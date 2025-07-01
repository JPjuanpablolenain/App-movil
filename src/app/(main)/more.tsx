import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import BottomTabBar from '../../components/BottomTabBar';
import Header from '../../components/Header';

export default function MoreScreen() {
  const [activeTab, setActiveTab] = useState('more');
  const [userEmail, setUserEmail] = useState('usuario@ejemplo.com');
  const [userName, setUserName] = useState('Usuario');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const email = await AsyncStorage.getItem('currentUser');
        if (email) {
          setUserEmail(email);
        }
        
        const name = await AsyncStorage.getItem('currentUserName');
        if (name) {
          setUserName(name);
        }
        
        const savedImage = await AsyncStorage.getItem(`profileImage_${email}`);
        if (savedImage) {
          setProfileImage(savedImage);
        }
      } catch (error) {
        console.log('Error getting current user:', error);
      }
    };
    
    getCurrentUser();
  }, []);



  const handleTabPress = (tab: string) => {
    setActiveTab(tab);

    switch (tab) {
      case 'home':
        router.push('/(main)/home');
        break;
      case 'favorites':
        router.push('/(main)/favorites');
        break;
      case 'scan':
        router.push('/(main)/scan');
        break;
      case 'cart':
        router.push('/(main)/cart');
        break;
      case 'more':
        break;
    }
  };

  const handleLogout = () => {
    router.push('/(auth)');
  };

  const handleAbout = () => {
    Alert.alert(
      'Acerca de SmartMarket',
      'Creado por:\n\nJuan Pablo Lenain\nMartin Vernazza\n\nGracias por usar nuestra aplicación.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.root}>
      {/* 1) HEADER */}
      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        <Header location="Sarmiento 123" onPressLocation={() => { }} />
      </SafeAreaView>

      {/* 2) CONTENIDO PRINCIPAL */}
      <ScrollView style={{flex: 1, width: '100%'}} contentContainerStyle={{paddingBottom: 120}}>
        <View style={styles.profileContainer}>
          <View style={styles.avatarContainer}>
            <Image
              source={profileImage ? { uri: profileImage } : require('../../assets/images/icon.png')}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.userName}>¡Hola {userName}!</Text>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(main)/profile')}>
            <Ionicons name="person-outline" size={24} color="#666" />
            <Text style={styles.menuItemText}>Profile</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" style={styles.chevron} />
          </TouchableOpacity>

          <View style={styles.infoContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(main)/orders')}>
              <Ionicons name="cart-outline" size={24} color="#666" />
              <Text style={styles.menuItemText}>Orders</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" style={styles.chevron} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="time-outline" size={24} color="#666" />
              <Text style={styles.menuItemText}>History</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" style={styles.chevron} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="notifications-outline" size={24} color="#666" />
              <Text style={styles.menuItemText}>Notifications</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" style={styles.chevron} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="help-circle-outline" size={24} color="#666" />
              <Text style={styles.menuItemText}>Help</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" style={styles.chevron} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleAbout}>
              <Ionicons name="information-circle-outline" size={24} color="#666" />
              <Text style={styles.menuItemText}>About</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" style={styles.chevron} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 4) BOTTOM TAB BAR */}
      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerSafeArea: {
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 10,
    zIndex: 10,
  },

  profileContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },

  userName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 30,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 25,
  },
  infoContainer: {
    width: '100%',
    marginBottom: 25,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
  },
  chevron: {
    marginLeft: 'auto',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});