import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
  Image,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Background Elements */}
      <View style={styles.backgroundElements}>
        <View style={styles.orangeCircle} />
        <View style={styles.yellowSquare} />
        <View style={styles.redAccent} />
      </View>

      <Animated.View style={[
        styles.content, 
        { 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}>
        
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Animated.View style={[
            styles.logoContainer,
            {
              transform: [{
                scale: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1]
                })
              }]
            }
          ]}>
            <View style={styles.logoWrapper}>
              <Image 
                source={require('../../assets/images/logo_sin_fondo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </Animated.View>
          
          <Text style={styles.appName}>PAGALAY</Text>
          <Text style={styles.tagline}>La billetera crypto más boliviana</Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, styles.orangeIcon]}>
              <View style={styles.qrIconShape}>
                <View style={styles.qrIconInner} />
                <View style={styles.qrIconCorner1} />
                <View style={styles.qrIconCorner2} />
              </View>
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Pagos QR</Text>
              <Text style={styles.featureDescription}>
                Cobra con QR, recibe Criptomonedas y conviertelos en Bolivianos al toque!
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, styles.yellowIcon]}>
              <View style={styles.flashIconContainer}>
                <View style={styles.flashIconBolt} />
                <View style={styles.flashIconBoltBottom} />
              </View>
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Instantáneo</Text>
              <Text style={styles.featureDescription}>
                Transacciones Polygon en segundos
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, styles.redIcon]}>
              <View style={styles.shieldIconContainer}>
                <View style={styles.shieldIconBase}>
                  <View style={styles.shieldIconCheck} />
                </View>
              </View>
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Seguro</Text>
              <Text style={styles.featureDescription}>
                Blockchain descentralizado y confiable
              </Text>
            </View>
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Auth')}
            activeOpacity={0.9}
          >
            <Text style={styles.primaryButtonText}>Empezar ahora</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Auth')}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>Ya tengo cuenta</Text>
          </TouchableOpacity>

          {/* Bolivia indicator */}
          <View style={styles.boliviaIndicator}>
            <View style={styles.boliviaFlag}>
              <View style={styles.redStripe} />
              <View style={styles.yellowStripe} />
              <View style={styles.greenStripe} />
            </View>
            <Text style={styles.boliviaText}>Hecho con ❤️ en Bolivia</Text>
          </View>
        </View>

      </Animated.View>
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
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FF8C42',
    opacity: 0.05,
  },
  yellowSquare: {
    position: 'absolute',
    top: 400,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: '#FFD23F',
    opacity: 0.08,
    transform: [{ rotate: '15deg' }],
  },
  redAccent: {
    position: 'absolute',
    bottom: 200,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6B35',
    opacity: 0.1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  logoSection: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoWrapper: {
    width: 100,
    height: 100,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF8C42',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  logoImage: {
    width: 75,
    height: 75,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 8,
    fontFamily: 'System',
    letterSpacing: 1.5,
  },
  tagline: {
    fontSize: 16,
    color: '#FF8C42',
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'System',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'System',
    paddingHorizontal: 15,
    marginTop: 8,
  },
  featuresSection: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 40,
    maxHeight: 280,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD23F',
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  orangeIcon: {
    backgroundColor: '#FFF8F2',
    borderWidth: 2,
    borderColor: '#FF8C42',
  },
  yellowIcon: {
    backgroundColor: '#FFFCF2',
    borderWidth: 2,
    borderColor: '#FFD23F',
  },
  redIcon: {
    backgroundColor: '#FFF5F2',
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  qrIconShape: {
    width: 24,
    height: 24,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FF8C42',
    borderRadius: 3,
    position: 'relative',
  },
  qrIconInner: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 6,
    height: 6,
    backgroundColor: '#FF8C42',
    borderRadius: 1,
  },
  qrIconCorner1: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 6,
    height: 6,
    backgroundColor: '#FF8C42',
    borderRadius: 1,
  },
  qrIconCorner2: {
    position: 'absolute',
    bottom: 2,
    left: 2,
    width: 6,
    height: 6,
    backgroundColor: '#FF8C42',
    borderRadius: 1,
  },
  flashIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashIconBolt: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFD23F',
    position: 'absolute',
    top: 2,
  },
  flashIconBoltBottom: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFD23F',
    position: 'absolute',
    bottom: 2,
  },
  shieldIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shieldIconBase: {
    width: 20,
    height: 22,
    backgroundColor: '#FF6B35',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    position: 'relative',
  },
  shieldIconCheck: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 8,
    height: 4,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderLeftColor: '#FFFFFF',
    borderBottomColor: '#FFFFFF',
    transform: [{ rotate: '-45deg' }],
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
    fontFamily: 'System',
  },
  featureDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 22,
    fontFamily: 'System',
  },
  ctaSection: {
    paddingBottom: 45,
  },
  primaryButton: {
    backgroundColor: '#FF8C42',
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#FF8C42',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  secondaryButton: {
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF8C42',
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF8C42',
    fontFamily: 'System',
  },
  boliviaIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boliviaFlag: {
    width: 24,
    height: 16,
    borderRadius: 2,
    overflow: 'hidden',
    marginRight: 8,
    flexDirection: 'column',
  },
  redStripe: {
    flex: 1,
    backgroundColor: '#D52B1E',
  },
  yellowStripe: {
    flex: 1,
    backgroundColor: '#FFD23F',
  },
  greenStripe: {
    flex: 1,
    backgroundColor: '#007934',
  },
  boliviaText: {
    fontSize: 12,
    color: '#999999',
    fontWeight: '500',
    fontFamily: 'System',
  },
});
