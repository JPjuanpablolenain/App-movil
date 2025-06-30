import React from 'react';
import { StyleSheet, Text } from 'react-native';

const SectionTitle = ({ text }: { text: string }) => {
  return <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>{text}</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    color: '#222',
    flexShrink: 1,
  },
});

export default SectionTitle;