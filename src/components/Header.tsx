import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Header = ({ location, onPressLocation }: {
  location: string;
  onPressLocation?: () => void;
}) => {
  const router = useRouter();

  const handleProfilePress = () => {
    router.push('/(main)/profile');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleProfilePress}>
        <Ionicons name="person-circle-outline" size={28} color="black" />
      </TouchableOpacity>
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