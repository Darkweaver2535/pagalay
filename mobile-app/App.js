import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

// Importar screens
import OnboardingScreen from './src/screens/OnboardingScreen';
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import QRScannerScreen from './src/screens/QRScannerScreen';
import BasicDataScreen from './src/screens/BasicDataScreen';
import IdentityScreen from './src/screens/IdentityScreen';
import SecurityScreen from './src/screens/SecurityScreen';
import WalletSetupScreen from './src/screens/WalletSetupScreen';
import BackupPhraseScreen from './src/screens/BackupPhraseScreen';
import CompletionScreen from './src/screens/CompletionScreen';

// Importar contexto
import { AuthProvider } from './src/context/AuthContext';

const Stack = createStackNavigator();

// Prevenir que el splash screen se oculte automáticamente
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Aquí podrías cargar fuentes, verificar autenticación, etc.
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = React.useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <View style={styles.container} onLayout={onLayoutRootView}>
          <StatusBar style="auto" />
          <Stack.Navigator
            initialRouteName="Onboarding"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#2E7D32', // Verde boliviano
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen 
              name="Onboarding" 
              component={OnboardingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Auth" 
              component={AuthScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="BasicData" 
              component={BasicDataScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="IdentityScreen" 
              component={IdentityScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="SecurityScreen" 
              component={SecurityScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="WalletSetupScreen" 
              component={WalletSetupScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="BackupPhraseScreen" 
              component={BackupPhraseScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="CompletionScreen" 
              component={CompletionScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
              options={{ title: 'Mi Billetera' }}
            />
            <Stack.Screen 
              name="QRScanner" 
              component={QRScannerScreen}
              options={{ title: 'Escanear QR' }}
            />
          </Stack.Navigator>
        </View>
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
