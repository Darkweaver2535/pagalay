import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  StatusBar,
  Animated,
} from 'react-native';

export default function WalletSetupScreen({ navigation, route }) {
  const [walletCreated, setWalletCreated] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [seedPhrase, setSeedPhrase] = useState([]);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { userData } = route.params || {};

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Generar billetera simulada
  const generateWallet = async () => {
    setIsCreatingWallet(true);
    
    // Simular creación de billetera
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generar dirección MATIC simulada
    const mockAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
    const mockSeedPhrase = [
      'palabra', 'ejemplo', 'billetera', 'segura', 'polygon', 'matic',
      'bolivia', 'pagalay', 'cripto', 'pago', 'comercio', 'digital'
    ];
    
    setWalletAddress(mockAddress);
    setSeedPhrase(mockSeedPhrase);
    setWalletCreated(true);
    setIsCreatingWallet(false);
  };

  const handleContinue = () => {
    console.log('💳 WalletSetupScreen - Datos recibidos:', userData);
    console.log('💳 WalletSetupScreen - Email recibido:', userData?.email);
    console.log('💳 WalletSetupScreen - Nombre recibido:', userData?.firstName, userData?.lastName);
    
    if (!walletCreated) {
      Alert.alert('Billetera requerida', 'Debe crear su billetera MATIC primero');
      return;
    }

    const completeUserData = {
      ...userData,
      walletAddress,
      seedPhrase: seedPhrase.join(' ')
    };

    console.log('💳 WalletSetupScreen - Enviando datos completos:', completeUserData);

    // Navegar al paso 5 (BackupPhraseScreen)
    navigation.navigate('BackupPhraseScreen', { userData: completeUserData });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.backgroundElements}>
        <View style={styles.orangeCircle} />
        <View style={styles.yellowAccent} />
        <View style={styles.purpleAccent} />
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
              <Text style={styles.title}>Configurar billetera</Text>
              <Text style={styles.subtitle}>Billetera MATIC en Polygon Network</Text>
            </View>
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '67%' }]} />
            </View>
            <Text style={styles.progressText}>Paso 4 de 6</Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <View style={styles.stepIcon}>
                <Text style={styles.stepNumber}>4</Text>
              </View>
              <Text style={styles.formTitle}>Billetera digital</Text>
            </View>

            {!walletCreated ? (
              // Wallet Creation Section
              <View style={styles.walletCreationSection}>
                <View style={styles.maticBadge}>
                  <View style={styles.polygonIcon} />
                  <Text style={styles.maticBadgeText}>MATIC • Polygon</Text>
                </View>

                <Text style={styles.walletDescription}>
                  Su billetera será creada en Polygon Network para transacciones rápidas y económicas con MATIC
                </Text>

                <View style={styles.benefitsList}>
                  <View style={styles.benefitItem}>
                    <View style={styles.benefitIcon}>
                      <Text style={styles.benefitCheck}>✓</Text>
                    </View>
                    <Text style={styles.benefitText}>Transacciones instantáneas</Text>
                  </View>
                  
                  <View style={styles.benefitItem}>
                    <View style={styles.benefitIcon}>
                      <Text style={styles.benefitCheck}>✓</Text>
                    </View>
                    <Text style={styles.benefitText}>Comisiones muy bajas</Text>
                  </View>
                  
                  <View style={styles.benefitItem}>
                    <View style={styles.benefitIcon}>
                      <Text style={styles.benefitCheck}>✓</Text>
                    </View>
                    <Text style={styles.benefitText}>Compatible con QR boliviano</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.createWalletButton}
                  onPress={generateWallet}
                  disabled={isCreatingWallet}
                  activeOpacity={0.9}
                >
                  {isCreatingWallet ? (
                    <Text style={styles.createWalletButtonText}>Creando billetera...</Text>
                  ) : (
                    <>
                      <Text style={styles.createWalletButtonText}>Crear billetera MATIC</Text>
                      <View style={styles.createWalletIcon}>
                        <Text style={styles.createWalletIconText}>+</Text>
                      </View>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              // Wallet Created Section
              <View style={styles.walletCreatedSection}>
                <View style={styles.successIcon}>
                  <Text style={styles.successCheck}>✓</Text>
                </View>
                
                <Text style={styles.successTitle}>¡Billetera creada exitosamente!</Text>
                
                <View style={styles.walletInfoCard}>
                  <Text style={styles.walletInfoLabel}>Dirección de la billetera:</Text>
                  <View style={styles.addressContainer}>
                    <Text style={styles.walletAddress} numberOfLines={1} ellipsizeMode="middle">
                      {walletAddress}
                    </Text>
                  </View>
                  
                  <View style={styles.networkBadge}>
                    <View style={styles.networkIcon} />
                    <Text style={styles.networkText}>Polygon Network</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Info Card */}
            <View style={styles.infoCardSmall}>
              <View style={styles.infoIconSmall}>
                <View style={styles.blockchainIcon} />
              </View>
              <View style={styles.infoContentSmall}>
                <Text style={styles.infoTitleSmall}>Seguridad blockchain</Text>
                <Text style={styles.infoDescriptionSmall}>
                  Su billetera está protegida por la red Polygon
                </Text>
              </View>
            </View>

          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={[
              styles.continueButton,
              !walletCreated && styles.continueButtonDisabled
            ]}
            onPress={handleContinue}
            activeOpacity={0.9}
            disabled={!walletCreated}
          >
            <Text style={[
              styles.continueButtonText,
              !walletCreated && styles.continueButtonTextDisabled
            ]}>
              Continuar
            </Text>
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
    top: 350,
    left: -20,
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#FFD23F',
    opacity: 0.08,
    transform: [{ rotate: '20deg' }],
  },
  purpleAccent: {
    position: 'absolute',
    bottom: 200,
    right: 30,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B5CF6',
    opacity: 0.1,
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
  walletCreationSection: {
    alignItems: 'center',
  },
  maticBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F0FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  polygonIcon: {
    width: 16,
    height: 16,
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    marginRight: 6,
  },
  maticBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
    fontFamily: 'System',
  },
  walletDescription: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    fontFamily: 'System',
  },
  benefitsList: {
    width: '100%',
    marginBottom: 32,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  benefitCheck: {
    fontSize: 14,
    color: '#50C878',
    fontWeight: '700',
  },
  benefitText: {
    fontSize: 15,
    color: '#1A1A1A',
    fontFamily: 'System',
  },
  createWalletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 24,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  createWalletButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  createWalletIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  createWalletIconText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  walletCreatedSection: {
    alignItems: 'center',
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successCheck: {
    fontSize: 32,
    color: '#50C878',
    fontWeight: '700',
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: 'System',
  },
  walletInfoCard: {
    width: '100%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  walletInfoLabel: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 8,
    fontFamily: 'System',
  },
  addressContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  walletAddress: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    fontFamily: 'System',
  },
  networkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  networkIcon: {
    width: 12,
    height: 12,
    backgroundColor: '#8B5CF6',
    borderRadius: 6,
    marginRight: 6,
  },
  networkText: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '600',
    fontFamily: 'System',
  },
  infoCardSmall: {
    flexDirection: 'row',
    backgroundColor: '#FFF8F2',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD23F',
  },
  infoIconSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFE8D6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  blockchainIcon: {
    width: 16,
    height: 16,
    backgroundColor: '#FF8C42',
    borderRadius: 8,
  },
  infoContentSmall: {
    flex: 1,
  },
  infoTitleSmall: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
    fontFamily: 'System',
  },
  infoDescriptionSmall: {
    fontSize: 11,
    color: '#666666',
    lineHeight: 14,
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
  continueButtonDisabled: {
    backgroundColor: '#CCCCCC',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  continueButtonTextDisabled: {
    color: '#999999',
  },
});