// src/components/BottomTabBar.tsx

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BottomTabBarProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

const tabs = [
  { key: 'home',     icon: 'home',    label: 'HOME' },
  { key: 'favorites',icon: 'heart',   label: 'FAVORITES' },
  { key: 'scan',     icon: 'scan',    label: '' },
  { key: 'cart',     icon: 'cart',    label: 'CART' },
  { key: 'more',     icon: 'menu',    label: 'MORE' },
];

const BottomTabBar = ({ activeTab, onTabPress }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 60; // altura “útil” para íconos y etiquetas

  return (
    <View
      style={[
        styles.wrapper,
        {
          height: TAB_BAR_HEIGHT + insets.bottom,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View style={styles.container}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabPress(tab.key)}
          >
            <Ionicons
              name={tab.icon as any}
              size={24}
              color={activeTab === tab.key ? 'green' : 'black'}
            />
            {tab.label !== '' && (
              <Text
                style={[
                  styles.label,
                  { color: activeTab === tab.key ? 'green' : 'black' },
                ]}
              >
                {tab.label}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default BottomTabBar;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    borderRadius: 20,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 10,
  },
  container: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,              // Cada tab ocupa la misma porción horizontal
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,   // Ajusta si quieres más/menos espacio arriba/abajo
  },
  label: {
    fontSize: 12,
    marginTop: 2,
  },
});
