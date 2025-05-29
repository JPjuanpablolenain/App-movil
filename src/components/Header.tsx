// ✅ Header.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Header = ({ location, onPressLocation }: {
  location: string;
  onPressLocation?: () => void;
}) => {
  return (
    <View style={styles.container}>
      <Ionicons name="person-circle-outline" size={28} color="black" />
      <TouchableOpacity style={styles.locationContainer} onPress={onPressLocation}>
        <Ionicons name="location-outline" size={18} color="black" />
        <Text style={styles.locationText}>{location}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  locationContainer: {
    backgroundColor: '#A3C163',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  locationText: {
    marginLeft: 5,
    fontWeight: '600',
  },
});

export default Header;