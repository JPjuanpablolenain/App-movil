import React from 'react';
import { SafeAreaView } from 'react-native';
import HomeScreen from './home';

const Main = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HomeScreen />
    </SafeAreaView>
  );
};

export default Main;