import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function QRScannerScreen({ navigation }) {
  const [isScanning, setIsScanning] = useState(true);
  const [flashEnabled, setFlashEnabled] = useState(false);
  
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const scanAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    if (isScanning) {
      scanAnimation.start();
    }

    return () => {
      scanAnimation.stop();
    };
  }, [isScanning]);

  const simulateQRScan = () => {
    setIsScanning(false);
    
    const qrTypes = [
      {
        type: 'payment_request',
        merchant: 'Tienda Doña María',
        amount: '45.50',
        description: 'Compra de productos'
      },
      {
        type: 'payment_request', 
        merchant: 'Mercado Rodríguez',
        amount: '128.75',
        description: 'Verduras y frutas'
      },
      {
        type: 'payment_request',
        merchant: 'Farmacia Central',
        amount: '67.20',
        description: 'Medicamentos'
      }
    ];

    const randomQR = qrTypes[Math.floor(Math.random() * qrTypes.length)];

    Alert.alert(
      'Solicitud de pago',
      `Comercio: ${randomQR.merchant}\nMonto: ${randomQR.amount} Bs\nConcepto: ${randomQR.description}\n\n¿Confirmar el pago?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: () => setIsScanning(true),
        },
        {
          text: 'Pagar',
          style: 'default',
          onPress: () => processPayment(randomQR),
        },
      ]
    );
  };

  const processPayment = (paymentData) => {
    Alert.alert(
      'Pago procesado',
      `Pago de ${paymentData.amount} Bs enviado a ${paymentData.merchant}\n\nLa transacción se procesará en los próximos minutos.`,
      [
        {
          text: 'Ver comprobante',
          onPress: () => navigation.navigate('Home'),
        },
        {
          text: 'Escanear otro',
          onPress: () => setIsScanning(true),
        },
      ]
    );
  };

  const scanLineTranslateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 240],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" translucent={false} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.headerButtonText}>←</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Escanear código QR</Text>
        
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => setFlashEnabled(!flashEnabled)}
        >
          <View style={[
            styles.flashIcon,
            { backgroundColor: flashEnabled ? '#FFFFFF' : 'transparent' }
          ]} />
        </TouchableOpacity>
      </View>

      {/* Scanner Area */}
      <View style={styles.scannerContainer}>
        <View style={styles.overlay}>
          <View style={styles.overlayTop} />
          <View style={styles.overlayMiddle}>
            <View style={styles.overlaySide} />
            <View style={styles.scanFrame}>
              {/* Corner Indicators */}
              <View style={[styles.corner, styles.cornerTopLeft]} />
              <View style={[styles.corner, styles.cornerTopRight]} />
              <View style={[styles.corner, styles.cornerBottomLeft]} />
              <View style={[styles.corner, styles.cornerBottomRight]} />
              
              {/* Scan Line */}
              {isScanning && (
                <Animated.View 
                  style={[
                    styles.scanLine,
                    {
                      transform: [{ translateY: scanLineTranslateY }]
                    }
                  ]}
                />
              )}
            </View>
            <View style={styles.overlaySide} />
          </View>
          <View style={styles.overlayBottom} />
        </View>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>
          {isScanning ? 'Buscando código QR' : 'Escaneo pausado'}
        </Text>
        <Text style={styles.instructionsText}>
          Posicione el código QR dentro del marco para realizar el pago
        </Text>
        
        {/* Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={styles.demoButton}
            onPress={simulateQRScan}
          >
            <Text style={styles.demoButtonText}>Simular pago de prueba</Text>
          </TouchableOpacity>
          
          <View style={styles.utilityButtons}>
            <TouchableOpacity style={styles.utilityButton}>
              <View style={styles.utilityIcon} />
              <Text style={styles.utilityButtonLabel}>Ayuda</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.utilityButton}
              onPress={() => Alert.alert('Historial', 'Historial de pagos')}
            >
              <View style={styles.utilityIcon} />
              <Text style={styles.utilityButtonLabel}>Historial</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.utilityButton}
              onPress={() => Alert.alert('Mi QR', 'Generar código para cobrar')}
            >
              <View style={styles.utilityIcon} />
              <Text style={styles.utilityButtonLabel}>Mi QR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  flashIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  scannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  overlayMiddle: {
    flexDirection: 'row',
    height: 260,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  scanFrame: {
    width: 260,
    height: 260,
    position: 'relative',
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#FFFFFF',
  },
  instructionsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 50,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'System',
  },
  instructionsText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
    fontFamily: 'System',
  },
  controlsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  demoButton: {
    backgroundColor: '#003DA5',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 24,
  },
  demoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  utilityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  utilityButton: {
    alignItems: 'center',
    padding: 12,
  },
  utilityIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 8,
  },
  utilityButtonLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    fontFamily: 'System',
  },
});
