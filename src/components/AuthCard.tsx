import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

type Props = ViewProps & {
  children: React.ReactNode;
};

const AuthCard = ({ children, style, ...rest }: Props) => {
  return (
    <View style={[styles.card, style]} {...rest}>
      {/* Contenido interno ocupa todo el alto disponible */}
      <View style={styles.inner}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 25,
    minHeight: 600, // ✅ ahora sí tendrá efecto
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  inner: {
    flex: 1,         // ✅ obliga a expandirse verticalmente dentro del card
    width: '100%',   // evita que el contenido se achique
    justifyContent: 'space-between', // opcional: distribuí hijos si querés separarlos
  },
});

export default AuthCard;
