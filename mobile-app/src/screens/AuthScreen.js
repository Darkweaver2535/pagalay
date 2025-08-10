import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function AuthScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const { login } = useAuth();

  const handleAuth = async () => {
    if (!phoneNumber || !pin) {
      Alert.alert('Campos requeridos', 'Complete todos los campos');
      return;
    }

    if (phoneNumber.length < 8) {
      Alert.alert('Número inválido', 'Ingrese un número válido de 8 dígitos');
      return;
    }

    if (pin.length !== 6) {
      Alert.alert('PIN inválido', 'El PIN debe tener exactamente 6 dígitos');
      return;
    }

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        phoneNumber: phoneNumber,
        firstName: 'Usuario',
        lastName: 'Pagalay',
        walletAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
        balance: '1,247.50',
        balanceCrypto: '42.85',
      };

      login(userData);
      navigation.navigate('Home');
      
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            
            <Text style={styles.title}>
              {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
            </Text>
            <Text style={styles.subtitle}>
              {isLogin ? 'Ingrese sus credenciales' : 'Complete el formulario de registro'}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            
            {/* Phone Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Número de celular</Text>
              <View style={[
                styles.phoneContainer,
                focusedInput === 'phone' && styles.inputFocused
              ]}>
                <View style={styles.countryCodeContainer}>
                  <Text style={styles.countryCode}>+591</Text>
                </View>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="12345678"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  maxLength={8}
                  onFocus={() => setFocusedInput('phone')}
                  onBlur={() => setFocusedInput(null)}
                  placeholderTextColor="#999999"
                />
              </View>
            </View>

            {/* PIN Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>PIN de seguridad</Text>
              <TextInput
                style={[
                  styles.textInput,
                  focusedInput === 'pin' && styles.inputFocused
                ]}
                placeholder="Ingrese su PIN de 6 dígitos"
                value={pin}
                onChangeText={setPin}
                keyboardType="numeric"
                maxLength={6}
                secureTextEntry
                onFocus={() => setFocusedInput('pin')}
                onBlur={() => setFocusedInput(null)}
                placeholderTextColor="#999999"
              />
            </View>

            {/* Auth Button */}
            <TouchableOpacity
              style={[styles.authButton, loading && styles.authButtonDisabled]}
              onPress={handleAuth}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.authButtonText}>
                {loading ? 'Procesando...' : (isLogin ? 'Iniciar sesión' : 'Crear cuenta')}
              </Text>
            </TouchableOpacity>

          </View>

          {/* Switch Mode */}
          <TouchableOpacity
            style={styles.switchContainer}
            onPress={() => setIsLogin(!isLogin)}
          >
            <Text style={styles.switchText}>
              {isLogin ? '¿No tiene cuenta? ' : '¿Ya tiene cuenta? '}
              <Text style={styles.switchTextBold}>
                {isLogin ? 'Crear una' : 'Iniciar sesión'}
              </Text>
            </Text>
          </TouchableOpacity>

          {/* Security Footer */}
          <View style={styles.securityFooter}>
            <View style={styles.securityIcon} />
            <Text style={styles.securityText}>
              Su información está protegida con encriptación de nivel bancario
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 24,
    color: '#1A1A1A',
    fontWeight: '300',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    fontFamily: 'System',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'System',
  },
  form: {
    flex: 1,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'System',
  },
  phoneContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  countryCodeContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRightWidth: 1,
    borderRightColor: '#DDDDDD',
    backgroundColor: '#F8F8F8',
  },
  countryCode: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'System',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1A1A1A',
    fontFamily: 'System',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1A1A1A',
    backgroundColor: '#FFFFFF',
    fontFamily: 'System',
  },
  inputFocused: {
    borderColor: '#003DA5',
    borderWidth: 2,
  },
  authButton: {
    backgroundColor: '#003DA5',
    height: 52,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  authButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  switchContainer: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 24,
  },
  switchText: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'System',
  },
  switchTextBold: {
    fontWeight: '600',
    color: '#003DA5',
  },
  securityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 32,
  },
  securityIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#50C878',
    marginRight: 8,
  },
  securityText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    fontFamily: 'System',
  },
});
