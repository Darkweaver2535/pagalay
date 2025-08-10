import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  StatusBar,
  Animated,
} from 'react-native';

export default function SecurityScreen({ navigation, route }) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);
  const [errors, setErrors] = useState({});
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { userData } = route.params || {};

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!pin) {
      newErrors.pin = 'PIN requerido';
    } else if (pin.length !== 6) {
      newErrors.pin = 'El PIN debe tener 6 dígitos';
    }

    if (!confirmPin) {
      newErrors.confirmPin = 'Confirme el PIN';
    } else if (pin !== confirmPin) {
      newErrors.confirmPin = 'Los PINs no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    console.log('🔐 SecurityScreen - Datos recibidos:', userData);
    console.log('🔐 SecurityScreen - Email recibido:', userData?.email);
    console.log('🔐 SecurityScreen - Nombre recibido:', userData?.firstName, userData?.lastName);
    
    if (validateForm()) {
      const completeUserData = {
        ...userData,
        securityPin: pin
      };

      console.log('🔐 SecurityScreen - Enviando datos completos:', completeUserData);

      // Navegar al paso 4 (WalletSetupScreen)
      navigation.navigate('WalletSetupScreen', { userData: completeUserData });
    }
  };

  const updateField = (field, value) => {
    if (field === 'pin') {
      setPin(value);
    } else {
      setConfirmPin(value);
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.backgroundElements}>
        <View style={styles.orangeCircle} />
        <View style={styles.yellowAccent} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            
            <View style={styles.headerContent}>
              <Text style={styles.title}>Seguridad de la cuenta</Text>
              <Text style={styles.subtitle}>Cree su PIN de acceso</Text>
            </View>
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '50%' }]} />
            </View>
            <Text style={styles.progressText}>Paso 3 de 6</Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <View style={styles.stepIcon}>
                <Text style={styles.stepNumber}>3</Text>
              </View>
              <Text style={styles.formTitle}>PIN de seguridad</Text>
            </View>

            {/* PIN Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Crear PIN *</Text>
              <TextInput
                style={[
                  styles.pinInput,
                  focusedInput === 'pin' && styles.inputFocused,
                  errors.pin && styles.inputError
                ]}
                placeholder="• • • • • •"
                value={pin}
                onChangeText={(value) => updateField('pin', value)}
                keyboardType="numeric"
                maxLength={6}
                secureTextEntry
                onFocus={() => setFocusedInput('pin')}
                onBlur={() => setFocusedInput(null)}
                placeholderTextColor="#CCCCCC"
              />
              {errors.pin && (
                <Text style={styles.errorText}>{errors.pin}</Text>
              )}
            </View>

            {/* Confirm PIN Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirmar PIN *</Text>
              <TextInput
                style={[
                  styles.pinInput,
                  focusedInput === 'confirmPin' && styles.inputFocused,
                  errors.confirmPin && styles.inputError
                ]}
                placeholder="• • • • • •"
                value={confirmPin}
                onChangeText={(value) => updateField('confirmPin', value)}
                keyboardType="numeric"
                maxLength={6}
                secureTextEntry
                onFocus={() => setFocusedInput('confirmPin')}
                onBlur={() => setFocusedInput(null)}
                placeholderTextColor="#CCCCCC"
              />
              {errors.confirmPin && (
                <Text style={styles.errorText}>{errors.confirmPin}</Text>
              )}
            </View>

            {/* Info Card */}
            <View style={styles.infoCard}>
              <View style={styles.infoIcon}>
                <View style={styles.lockIcon}>
                  <View style={styles.lockBody} />
                  <View style={styles.lockShackle} />
                </View>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>PIN seguro</Text>
                <Text style={styles.infoDescription}>
                  Este PIN protegerá sus transacciones MATIC y acceso a la billetera
                </Text>
              </View>
            </View>

          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.9}
          >
            <Text style={styles.continueButtonText}>Continuar</Text>
          </TouchableOpacity>

        </Animated.View>
      </ScrollView>
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
    top: 80,
    right: -60,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FF8C42',
    opacity: 0.06,
  },
  yellowAccent: {
    position: 'absolute',
    top: 300,
    left: -20,
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#FFD23F',
    opacity: 0.08,
    transform: [{ rotate: '20deg' }],
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
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
  },
  backArrow: {
    fontSize: 20,
    color: '#1A1A1A',
    fontFamily: 'System',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 4,
    fontFamily: 'System',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'System',
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: 4,
    backgroundColor: '#FF8C42',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#999999',
    fontFamily: 'System',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  stepIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF8C42',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'System',
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
    shadowColor: '#FF8C42',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  inputError: {
    borderColor: '#FF6B35',
  },
  errorText: {
    fontSize: 12,
    color: '#FF6B35',
    marginTop: 4,
    fontFamily: 'System',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF8F2',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD23F',
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFE8D6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  lockIcon: {
    position: 'relative',
  },
  lockBody: {
    width: 16,
    height: 12,
    backgroundColor: '#FF8C42',
    borderRadius: 2,
    marginTop: 6,
  },
  lockShackle: {
    position: 'absolute',
    top: 0,
    left: 3,
    width: 10,
    height: 8,
    borderWidth: 2,
    borderColor: '#FF8C42',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomWidth: 0,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
    fontFamily: 'System',
  },
  infoDescription: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 16,
    fontFamily: 'System',
  },
  continueButton: {
    backgroundColor: '#FF8C42',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#FF8C42',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
});