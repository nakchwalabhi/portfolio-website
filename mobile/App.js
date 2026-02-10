import React, { useContext } from 'react';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

function AppContent() {
  const { isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={styles.splash}>
        <Text style={styles.splashLogo}>🚲</Text>
        <Text style={styles.splashTitle}>Bike Rental</Text>
        <ActivityIndicator size="large" color="#FFFFFF" style={styles.loader} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AppNavigator />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashLogo: {
    fontSize: 80,
    marginBottom: 16,
  },
  splashTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  loader: {
    marginTop: 24,
  },
});
