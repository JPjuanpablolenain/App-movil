import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const tabs = [
  { key: 'home', icon: 'home', label: 'HOME' },
  { key: 'favorites', icon: 'heart', label: 'FAVORITES' },
  { key: 'scan', icon: 'scan', label: '' },
  { key: 'cart', icon: 'cart', label: 'CART' },
  { key: 'more', icon: 'menu', label: 'MORE' },
];

const BottomTabBar = ({
  activeTab,
  onTabPress,
}: {
  activeTab: string;
  onTabPress: (tab: string) => void;
}) => {
  return (
    <SafeAreaView edges={['bottom']} style={styles.wrapper}>
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
              color={activeTab === tab.key ? '#A3C163' : '#333'}
            />
            <Text style={styles.label}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default BottomTabBar;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'white',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tab: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
});
