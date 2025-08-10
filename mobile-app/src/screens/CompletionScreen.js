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

export default function CompletionScreen({ navigation, route }) {
  const [registrationComplete, setRegistrationComplete] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const { userData } = route.params || {};

  useEffect(() => {
    console.log('🎯 CompletionScreen - Datos recibidos:', userData);
    console.log('📧 Email:', userData?.email);
    console.log('👤 Nombre:', userData?.firstName, userData?.lastName);
    
    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Simular finalización del registro
    setTimeout(() => {
      setRegistrationComplete(true);
    }, 1500);
  }, []);

  const handleStartUsingPagalay = () => {
    Alert.alert(
      '¡Bienvenido a Pagalay!',
      `Hola ${userData?.firstName}, su billetera MATIC está lista para usar. Puede comenzar a recibir y enviar pagos en criptomonedas.`,
      [
        {
          text: 'Empezar ahora',
          onPress: () => {
            // Navegar al Home Screen
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            });
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.backgroundElements}>
        <View style={styles.orangeCircle} />
        <View style={styles.yellowAccent} />
        <View style={styles.greenAccent} />
        <View style={styles.purpleAccent} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '100%' }]} />
            </View>
            <Text style={styles.progressText}>Paso 6 de 6 - ¡Completado!</Text>
          </View>

          {/* Success Animation */}
          <Animated.View style={[styles.successContainer, { transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.successIcon}>
              <View style={styles.successCheckIcon} />
            </View>
            
            <Text style={styles.successTitle}>¡Registro completado!</Text>
            <Text style={styles.successSubtitle}>
              Su billetera MATIC está lista
            </Text>
          </Animated.View>

          {/* User Summary Card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <View style={styles.pagalayIcon}>
                <Text style={styles.pagalayIconText}>P</Text>
              </View>
              <View style={styles.summaryHeaderContent}>
                <Text style={styles.welcomeText}>¡Bienvenido a Pagalay!</Text>
                <Text style={styles.userNameText}>{userData?.firstName} {userData?.lastName}</Text>
              </View>
            </View>

            {/* Account Details */}
            <View style={styles.accountDetails}>
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <View style={styles.emailIcon} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Email verificado</Text>
                  <Text style={styles.detailValue}>{userData?.email || 'No disponible'}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <View style={styles.checkIcon} />
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <View style={styles.idIcon} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Carnet verificado</Text>
                  <Text style={styles.detailValue}>{userData?.carnetNumber} {userData?.carnetExtension}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <View style={styles.checkIcon} />
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <View style={styles.walletIcon} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Billetera MATIC</Text>
                  <Text style={styles.detailValue} numberOfLines={1} ellipsizeMode="middle">
                    {userData?.walletAddress}
                  </Text>
                </View>
                <View style={styles.statusBadge}>
                  <View style={styles.checkIcon} />
                </View>
              </View>
            </View>

            {/* Network Badge */}
            <View style={styles.networkContainer}>
              <View style={styles.networkBadge}>
                <View style={styles.polygonIcon} />
                <Text style={styles.networkText}>Polygon Network</Text>
              </View>
            </View>
          </View>

          {/* Features Preview */}
          <View style={styles.featuresCard}>
            <Text style={styles.featuresTitle}>¿Qué puede hacer ahora?</Text>
            
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <View style={styles.lightningIcon} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Pagos instantáneos</Text>
                  <Text style={styles.featureDescription}>Reciba pagos con código QR</Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <View style={styles.coinIcon} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Conversión automática</Text>
                  <Text style={styles.featureDescription}>MATIC a bolivianos al instante</Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <View style={styles.shieldIcon} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Seguridad blockchain</Text>
                  <Text style={styles.featureDescription}>Sus fondos están protegidos</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Start Button */}
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartUsingPagalay}
            activeOpacity={0.9}
          >
            <Text style={styles.startButtonText}>Comenzar a usar Pagalay</Text>
            <View style={styles.startButtonIcon}>
              <Text style={styles.startButtonArrow}>→</Text>
            </View>
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
    top: 100,
    right: -80,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FF8C42',
    opacity: 0.08,
  },
  yellowAccent: {
    position: 'absolute',
    top: 300,
    left: -40,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFD23F',
    opacity: 0.1,
  },
  greenAccent: {
    position: 'absolute',
    bottom: 200,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#50C878',
    opacity: 0.12,
  },
  purpleAccent: {
    position: 'absolute',
    bottom: 100,
    left: 40,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B5CF6',
    opacity: 0.1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  content: {
    flex: 1,
  },
  progressContainer: {
    marginBottom: 40,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    marginBottom: 12,
  },
  progressFill: {
    height: 6,
    backgroundColor: '#50C878',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: '#50C878',
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'System',
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#50C878',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#50C878',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  successCheck: {
    fontSize: 40,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  successCheckIcon: {
    width: 20,
    height: 16,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderLeftColor: '#FFFFFF',
    borderBottomColor: '#FFFFFF',
    transform: [{ rotate: '-45deg' }],
    marginTop: -4,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'System',
  },
  successSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    fontFamily: 'System',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  pagalayIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF8C42',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  pagalayIconText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  summaryHeaderContent: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
    fontFamily: 'System',
  },
  userNameText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'System',
  },
  accountDetails: {
    gap: 16,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  emailIcon: {
    width: 16,
    height: 12,
    backgroundColor: '#FF8C42',
    borderRadius: 2,
  },
  idIcon: {
    width: 18,
    height: 14,
    backgroundColor: '#FFD23F',
    borderRadius: 2,
  },
  walletIcon: {
    width: 18,
    height: 16,
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
  },
  statusBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    width: 8,
    height: 6,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderLeftColor: '#50C878',
    borderBottomColor: '#50C878',
    transform: [{ rotate: '-45deg' }],
  },
  networkContainer: {
    alignItems: 'center',
  },
  networkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F0FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  polygonIcon: {
    width: 16,
    height: 16,
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    marginRight: 8,
  },
  networkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
    fontFamily: 'System',
  },
  featuresCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'System',
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF8F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  lightningIcon: {
    width: 16,
    height: 20,
    backgroundColor: '#FFD23F',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 2,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 8,
  },
  coinIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#50C878',
    borderRadius: 10,
    position: 'relative',
  },
  shieldIcon: {
    width: 16,
    height: 20,
    backgroundColor: '#FF8C42',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
    fontFamily: 'System',
  },
  featureDescription: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'System',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF8C42',
    height: 64,
    borderRadius: 20,
    paddingHorizontal: 32,
    marginBottom: 40,
    shadowColor: '#FF8C42',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  startButtonIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  startButtonArrow: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF8C42',
  },
});