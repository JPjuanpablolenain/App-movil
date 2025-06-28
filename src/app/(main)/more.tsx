import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomTabBar from '../../components/BottomTabBar';
import Header from '../../components/Header';

export default function MoreScreen() {
  const [activeTab, setActiveTab] = useState('more');
  const router = useRouter();

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

  return (
    <View style={styles.root}>
      {/* 1) HEADER */}
      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        <Header location="Sarmiento 123" onPressLocation={() => { }} />
      </SafeAreaView>

      {/* 2) TÍTULO */}
      <View style={styles.titleWrapper}>
        <Text style={styles.screenTitle}>Profile</Text>
      </View>

      {/* 3) CONTENIDO PRINCIPAL */}
      <ScrollView style={{flex: 1, width: '100%'}} contentContainerStyle={{paddingBottom: 20}}>
        <View style={styles.profileContainer}>
          <View style={styles.avatarContainer}>
            <Image
              source={require('../../assets/images/icon.png')}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.userName}>Usuario</Text>
          <Text style={styles.userEmail}>usuario@ejemplo.com</Text>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="person-outline" size={24} color="#666" />
            <Text style={styles.menuItemText}>My Details</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" style={styles.chevron} />
          </TouchableOpacity>

          <View style={styles.infoContainer}>
            <TouchableOpacity style={styles.menuItem}>
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

            <TouchableOpacity style={styles.menuItem}>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 6,
    zIndex: 10,
  },
  titleWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  profileContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
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
    marginBottom: 5,
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