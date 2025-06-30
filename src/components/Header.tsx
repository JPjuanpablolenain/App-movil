import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, StatusBar } from 'react-native';

const Header = ({ location, onPressLocation }: {
  location: string;
  onPressLocation?: () => void;
}) => {

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <View style={styles.container}>
        <TouchableOpacity style={styles.locationContainer} onPress={onPressLocation}>
          <Ionicons name="location-outline" size={18} color="black" />
          <Text style={styles.locationText}>{location}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 15,
    backgroundColor: 'transparent',
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