import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Arabic-First Educational Bookstore</Text>
      <Text style={styles.subtitle}>Tunisia (TND)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#123B2B',
  },
  subtitle: {
    fontSize: 16,
    color: '#C29B38',
    marginTop: 8,
  },
});
