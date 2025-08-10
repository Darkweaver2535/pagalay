import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Animated,
  Alert,
} from 'react-native';

export default function BasicDataScreen({ navigation }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    birthDate: '',
  });
  const [focusedInput, setFocusedInput] = useState(null);
  const [errors, setErrors] = useState({});

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Nombre requerido';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'Mínimo 2 caracteres';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Apellido requerido';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Mínimo 2 caracteres';
    }

    // Validación opcional del teléfono (solo si se proporciona)
    if (formData.phoneNumber && formData.phoneNumber.length !== 8) {
      newErrors.phoneNumber = 'Debe tener 8 dígitos';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Correo electrónico requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Formato de correo inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

    const handleContinue = () => {
    console.log('📝 Datos del formulario antes de navegar:', formData);
    
    if (validateForm()) {
      console.log('✅ Navegando con datos:', formData);
      navigation.navigate('IdentityScreen', { userData: formData });
    } else {
      console.log('❌ Errores de validación:', errors);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    console.log(`📝 Campo ${field} actualizado a:`, value);
    console.log('📝 FormData completo:', { ...formData, [field]: value });
    
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

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
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
                <Text style={styles.title}>Datos básicos</Text>
                <Text style={styles.subtitle}>Información personal para su billetera MATIC</Text>
              </View>
            </View>

            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '16%' }]} />
              </View>
              <Text style={styles.progressText}>Paso 1 de 6</Text>
            </View>

            {/* Form Card */}
            <View style={styles.formCard}>
              <View style={styles.formHeader}>
                <View style={styles.stepIcon}>
                  <Text style={styles.stepNumber}>1</Text>
                </View>
                <Text style={styles.formTitle}>Información personal</Text>
              </View>

              {/* First Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nombre completo *</Text>
                <TextInput
                  style={[
                    styles.input,
                    focusedInput === 'firstName' && styles.inputFocused,
                    errors.firstName && styles.inputError
                  ]}
                  placeholder="Ej: María Elena"
                  value={formData.firstName}
                  onChangeText={(value) => updateField('firstName', value)}
                  onFocus={() => setFocusedInput('firstName')}
                  onBlur={() => setFocusedInput(null)}
                  placeholderTextColor="#999999"
                />
                {errors.firstName && (
                  <Text style={styles.errorText}>{errors.firstName}</Text>
                )}
              </View>

              {/* Last Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Apellidos *</Text>
                <TextInput
                  style={[
                    styles.input,
                    focusedInput === 'lastName' && styles.inputFocused,
                    errors.lastName && styles.inputError
                  ]}
                  placeholder="Ej: Mamani Quispe"
                  value={formData.lastName}
                  onChangeText={(value) => updateField('lastName', value)}
                  onFocus={() => setFocusedInput('lastName')}
                  onBlur={() => setFocusedInput(null)}
                  placeholderTextColor="#999999"
                />
                {errors.lastName && (
                  <Text style={styles.errorText}>{errors.lastName}</Text>
                )}
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Correo electrónico *</Text>
                <TextInput
                  style={[
                    styles.input,
                    focusedInput === 'email' && styles.inputFocused,
                    errors.email && styles.inputError
                  ]}
                  placeholder="ejemplo@gmail.com"
                  value={formData.email}
                  onChangeText={(value) => updateField('email', value.toLowerCase())}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                  placeholderTextColor="#999999"
                />
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

              {/* Info Card */}
              <View style={styles.infoCard}>
                <View style={styles.infoIcon}>
                  <View style={styles.shieldIcon}>
                    <View style={styles.shieldCheck} />
                  </View>
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoTitle}>Datos seguros</Text>
                  <Text style={styles.infoDescription}>
                    Su información se encripta con tecnología blockchain para máxima seguridad
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
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'System',
  },
  input: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1A1A1A',
    backgroundColor: '#FFFFFF',
    fontFamily: 'System',
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
  phoneContainer: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
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
    backgroundColor: '#007934',
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
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
  shieldIcon: {
    width: 20,
    height: 24,
    backgroundColor: '#FF8C42',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shieldCheck: {
    width: 6,
    height: 3,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderLeftColor: '#FFFFFF',
    borderBottomColor: '#FFFFFF',
    transform: [{ rotate: '-45deg' }],
    marginTop: 2,
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