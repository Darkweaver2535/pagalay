import React, { useState, useRef, useEffect } from 'react';
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
  Animated,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function AuthScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [isLogin, setIsLogin] = useState(false); // Iniciar en modo "crear cuenta"
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const { login } = useAuth();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSendCode = () => {
    if (!phoneNumber || phoneNumber.length < 8) {
      Alert.alert('Número inválido', 'Ingrese un número válido de 8 dígitos');
      return;
    }
    
    Alert.alert(
      'Código enviado',
      `Se envió un código de verificación al número +591 ${phoneNumber}`,
      [{ text: 'Entendido', style: 'default' }]
    );
  };

  const handleAuth = async () => {
    if (!pin) {
      Alert.alert('Código requerido', 'Complete el código de seguridad para continuar');
      return;
    }

    if (pin.length !== 6) {
      Alert.alert('Código inválido', 'El código debe tener exactamente 6 dígitos');
      return;
    }

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (isLogin) {
        // Para login existente
        const userData = {
          id: Math.random().toString(36).substr(2, 9),
          phoneNumber: phoneNumber,
          firstName: 'Usuario',
          lastName: 'PAGALAY',
          walletAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
          balance: '1,247.50',
          balanceCrypto: '42.85',
        };
        login(userData);
        navigation.navigate('Home');
      } else {
        // Para crear cuenta nueva - navegar a BasicDataScreen
        navigation.navigate('BasicData', { 
          phoneNumber: phoneNumber, 
          pin: pin 
        });
      }
      
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Background Elements */}
      <View style={styles.backgroundElements}>
        <View style={styles.orangeCircle} />
        <View style={styles.yellowAccent} />
        <View style={styles.redDot} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          
          <Animated.View style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}>

            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.backArrow}>←</Text>
              </TouchableOpacity>
              
              <View style={styles.headerContent}>
                <Text style={styles.title}>
                  {isLogin ? 'Bienvenido de nuevo' : 'Crear cuenta nueva'}
                </Text>
                <Text style={styles.subtitle}>
                  {isLogin ? 'Ingrese a su billetera crypto' : 'Únase a la revolución crypto boliviana'}
                </Text>
              </View>
            </View>

            {/* Main Form Card */}
            <View style={styles.formCard}>
              <View style={styles.formHeader}>
                <View style={styles.formIndicator}>
                  <View style={styles.indicatorDot} />
                  <View style={styles.indicatorLine} />
                  <View style={[styles.indicatorDot, styles.indicatorDotInactive]} />
                </View>
                <Text style={styles.formTitle}>
                  {isLogin ? 'Iniciar sesión' : 'Datos de registro'}
                </Text>
              </View>

              {/* Phone Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Número de celular</Text>
                <View style={[
                  styles.phoneContainer,
                  focusedInput === 'phone' && styles.inputFocused
                ]}>
                  <View style={styles.countryCodeContainer}>
                    <View style={styles.boliviaFlag}>
                      <View style={styles.flagRed} />
                      <View style={styles.flagYellow} />
                      <View style={styles.flagGreen} />
                    </View>
                    <Text style={styles.countryCode}>+591</Text>
                  </View>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="70123456"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                    maxLength={8}
                    onFocus={() => setFocusedInput('phone')}
                    onBlur={() => setFocusedInput(null)}
                    placeholderTextColor="#999999"
                  />
                </View>
                <Text style={styles.inputHint}>
                  Número válido de celular boliviano
                </Text>
                
                {/* Send Code Button */}
                <TouchableOpacity
                  style={styles.sendCodeButton}
                  onPress={handleSendCode}
                  activeOpacity={0.8}
                >
                  <Text style={styles.sendCodeButtonText}>Enviar código de verificación</Text>
                </TouchableOpacity>
              </View>

              {/* Código de seguridad Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Código de seguridad</Text>
                <TextInput
                  style={[
                    styles.pinInput,
                    focusedInput === 'pin' && styles.inputFocused
                  ]}
                  placeholder="1 2 3 4 5 6"
                  value={pin}
                  onChangeText={setPin}
                  keyboardType="numeric"
                  maxLength={6}
                  onFocus={() => setFocusedInput('pin')}
                  onBlur={() => setFocusedInput(null)}
                  placeholderTextColor="#CCCCCC"
                />
                <Text style={styles.inputHint}>
                  {isLogin ? 'Código de 6 dígitos' : 'Ingrese el código de 6 dígitos'}
                </Text>
              </View>

              {/* Auth Button */}
              <TouchableOpacity
                style={[styles.authButton, loading && styles.authButtonDisabled]}
                onPress={handleAuth}
                disabled={loading}
                activeOpacity={0.9}
              >
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <View style={styles.loadingSpinner} />
                    <Text style={styles.authButtonText}>Procesando...</Text>
                  </View>
                ) : (
                  <Text style={styles.authButtonText}>
                    {isLogin ? 'Iniciar sesión' : 'Crear mi cuenta'}
                  </Text>
                )}
              </TouchableOpacity>

            </View>

            {/* Switch Mode */}
            <View style={styles.switchSection}>
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>o</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={styles.switchButton}
                onPress={() => setIsLogin(!isLogin)}
              >
                <Text style={styles.switchText}>
                  {isLogin ? '¿Primera vez en Pagalay? ' : '¿Ya tienes cuenta? '}
                  <Text style={styles.switchTextBold}>
                    {isLogin ? 'Crear cuenta' : 'Inicia sesión'}
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>

            

          </Animated.View>
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
  backgroundElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  orangeCircle: {
    position: 'absolute',
    top: 50,
    right: -80,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FF8C42',
    opacity: 0.06,
  },
  yellowAccent: {
    position: 'absolute',
    top: 300,
    left: -20,
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#FFD23F',
    opacity: 0.08,
    transform: [{ rotate: '25deg' }],
  },
  redDot: {
    position: 'absolute',
    bottom: 150,
    right: 30,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B35',
    opacity: 0.1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  backArrow: {
    fontSize: 20,
    color: '#1A1A1A',
    fontWeight: '300',
    fontFamily: 'System',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 6,
    fontFamily: 'System',
  },
  subtitle: {
    fontSize: 15,
    color: '#666666',
    fontFamily: 'System',
    lineHeight: 22,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  formHeader: {
    marginBottom: 24,
    alignItems: 'center',
  },
  formIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF8C42',
  },
  indicatorDotInactive: {
    backgroundColor: '#DDDDDD',
  },
  indicatorLine: {
    width: 40,
    height: 2,
    backgroundColor: '#FF8C42',
    marginHorizontal: 8,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'System',
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'System',
  },
  phoneContainer: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: '#F8F9FA',
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  boliviaFlag: {
    width: 20,
    height: 14,
    borderRadius: 2,
    overflow: 'hidden',
    marginRight: 8,
    flexDirection: 'column',
  },
  flagRed: {
    flex: 1,
    backgroundColor: '#D52B1E',
  },
  flagYellow: {
    flex: 1,
    backgroundColor: '#FFD23F',
  },
  flagGreen: {
    flex: 1,
    backgroundColor: '#417900ff',
  },
  countryCode: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 18,
    fontSize: 16,
    color: '#1A1A1A',
    fontFamily: 'System',
    fontWeight: '500',
  },
  pinInput: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 16,
    fontSize: 20,
    color: '#1A1A1A',
    backgroundColor: '#FFFFFF',
    fontFamily: 'System',
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 8,
  },
  inputFocused: {
    borderColor: '#FF8C42',
    borderWidth: 2,
    shadowColor: '#FF8C42',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputHint: {
    fontSize: 13,
    color: '#999999',
    marginTop: 6,
    fontFamily: 'System',
  },
  sendCodeButton: {
    backgroundColor: '#FFD23F',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#FFD23F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sendCodeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    fontFamily: 'System',
  },
  authButton: {
    backgroundColor: '#FF8C42',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#FF8C42',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  authButtonDisabled: {
    backgroundColor: '#CCCCCC',
    shadowColor: '#CCCCCC',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingSpinner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderTopColor: 'transparent',
    marginRight: 12,
  },
  authButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  switchSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#999999',
    fontWeight: '500',
    fontFamily: 'System',
  },
  switchButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  switchText: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    fontFamily: 'System',
  },
  switchTextBold: {
    fontWeight: '700',
    color: '#FF8C42',
  },
  securitySection: {
    paddingBottom: 40,
  },
  securityCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF8F2',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#FF8C42',
  },
  securityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFE8D6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  shieldIcon: {
    width: 20,
    height: 24,
    backgroundColor: '#FF8C42',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  securityContent: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
    fontFamily: 'System',
  },
  securityText: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
    fontFamily: 'System',
  },
});
