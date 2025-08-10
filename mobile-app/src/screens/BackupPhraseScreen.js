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
  Clipboard,
} from 'react-native';

export default function BackupPhraseScreen({ navigation, route }) {
  const [seedPhraseRevealed, setSeedPhraseRevealed] = useState(false);
  const [phraseConfirmed, setPhraseConfirmed] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { userData } = route.params || {};
  
  // Convertir la frase en array de palabras
  const seedPhraseWords = userData?.seedPhrase?.split(' ') || [];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleRevealPhrase = () => {
    Alert.alert(
      'Frase de respaldo',
      'Su frase de respaldo es muy importante. Guárdela en un lugar seguro y nunca la comparta con nadie.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Entiendo', 
          onPress: () => setSeedPhraseRevealed(true)
        }
      ]
    );
  };

  const handleCopyToClipboard = async () => {
    try {
      await Clipboard.setString(userData.seedPhrase);
      setCopiedToClipboard(true);
      Alert.alert('Copiado', 'Frase de respaldo copiada al portapapeles');
      
      // Reset después de 3 segundos
      setTimeout(() => {
        setCopiedToClipboard(false);
      }, 3000);
    } catch (error) {
      Alert.alert('Error', 'No se pudo copiar la frase');
    }
  };

  const handleConfirmBackup = () => {
    Alert.alert(
      'Confirmar respaldo',
      '¿Ha guardado su frase de respaldo en un lugar seguro?',
      [
        { text: 'No, aún no', style: 'cancel' },
        { 
          text: 'Sí, la guardé', 
          onPress: () => {
            setPhraseConfirmed(true);
          }
        }
      ]
    );
  };

  const handleContinue = () => {
    console.log('📝 BackupPhraseScreen - Datos recibidos:', userData);
    console.log('📝 BackupPhraseScreen - Email recibido:', userData?.email);
    console.log('📝 BackupPhraseScreen - Nombre recibido:', userData?.firstName, userData?.lastName);
    
    if (!phraseConfirmed) {
      Alert.alert(
        'Respaldo requerido', 
        'Debe confirmar que ha guardado su frase de respaldo para continuar'
      );
      return;
    }

    const completeUserData = {
      ...userData,
      backupConfirmed: true,
      backupDate: new Date().toISOString()
    };

    console.log('📝 BackupPhraseScreen - Enviando datos completos:', completeUserData);

    // Navegar al paso 6 final (CompletionScreen)
    navigation.navigate('CompletionScreen', { userData: completeUserData });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.backgroundElements}>
        <View style={styles.orangeCircle} />
        <View style={styles.yellowAccent} />
        <View style={styles.greenAccent} />
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
              <Text style={styles.title}>Frase de respaldo</Text>
              <Text style={styles.subtitle}>Proteja su billetera MATIC</Text>
            </View>
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '83%' }]} />
            </View>
            <Text style={styles.progressText}>Paso 5 de 6</Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <View style={styles.stepIcon}>
                <Text style={styles.stepNumber}>5</Text>
              </View>
              <Text style={styles.formTitle}>Frase de recuperación</Text>
            </View>

            {/* Security Warning */}
            <View style={styles.warningCard}>
              <View style={styles.warningIconContainer}>
                <View style={styles.warningIconShape}>
                  <Text style={styles.warningExclamation}>!</Text>
                </View>
              </View>
              <View style={styles.warningContent}>
                <Text style={styles.warningTitle}>Muy importante</Text>
                <Text style={styles.warningDescription}>
                  Esta frase es la única forma de recuperar su billetera si pierde acceso
                </Text>
              </View>
            </View>

            {!seedPhraseRevealed ? (
              // Reveal Phrase Section
              <View style={styles.revealSection}>
                <Text style={styles.revealDescription}>
                  Su frase de respaldo consiste en 12 palabras que le permitirán recuperar su billetera en cualquier momento.
                </Text>

                <View style={styles.securityTips}>
                  <Text style={styles.tipsTitle}>Consejos de seguridad:</Text>
                  
                  <View style={styles.tipItem}>
                    <Text style={styles.tipBullet}>•</Text>
                    <Text style={styles.tipText}>Escríbala en papel y guárdela en lugar seguro</Text>
                  </View>
                  
                  <View style={styles.tipItem}>
                    <Text style={styles.tipBullet}>•</Text>
                    <Text style={styles.tipText}>Nunca la comparta con nadie</Text>
                  </View>
                  
                  <View style={styles.tipItem}>
                    <Text style={styles.tipBullet}>•</Text>
                    <Text style={styles.tipText}>No la guarde en dispositivos conectados a internet</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.revealButton}
                  onPress={handleRevealPhrase}
                  activeOpacity={0.9}
                >
                  <Text style={styles.revealButtonText}>Mostrar frase de respaldo</Text>
                  <View style={styles.revealIcon}>
                    <Text style={styles.revealIconText}>👁️</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              // Seed Phrase Display Section
              <View style={styles.phraseSection}>
                <Text style={styles.phraseInstructions}>
                  Escriba estas 12 palabras en orden y guárdelas en un lugar seguro:
                </Text>

                <View style={styles.seedPhraseContainer}>
                  {seedPhraseWords.map((word, index) => (
                    <View key={index} style={styles.seedWordCard}>
                      <Text style={styles.seedWordNumber}>{index + 1}</Text>
                      <Text style={styles.seedWord}>{word}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.phraseActions}>
                  <TouchableOpacity
                    style={[
                      styles.copyButton,
                      copiedToClipboard && styles.copyButtonSuccess
                    ]}
                    onPress={handleCopyToClipboard}
                    activeOpacity={0.8}
                  >
                    <Text style={[
                      styles.copyButtonText,
                      copiedToClipboard && styles.copyButtonTextSuccess
                    ]}>
                      {copiedToClipboard ? 'Copiado ✓' : 'Copiar frase'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.confirmButton,
                      phraseConfirmed && styles.confirmButtonSuccess
                    ]}
                    onPress={handleConfirmBackup}
                    activeOpacity={0.8}
                  >
                    <Text style={[
                      styles.confirmButtonText,
                      phraseConfirmed && styles.confirmButtonTextSuccess
                    ]}>
                      {phraseConfirmed ? 'Respaldo confirmado ✓' : 'Ya guardé mi frase'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Info Card */}
            <View style={styles.infoCardSmall}>
              <View style={styles.infoIconSmall}>
                <View style={styles.keyIcon} />
              </View>
              <View style={styles.infoContentSmall}>
                <Text style={styles.infoTitleSmall}>Clave maestra</Text>
                <Text style={styles.infoDescriptionSmall}>
                  Esta frase es su clave maestra para acceder a sus MATIC
                </Text>
              </View>
            </View>

          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={[
              styles.continueButton,
              !phraseConfirmed && styles.continueButtonDisabled
            ]}
            onPress={handleContinue}
            activeOpacity={0.9}
            disabled={!phraseConfirmed}
          >
            <Text style={[
              styles.continueButtonText,
              !phraseConfirmed && styles.continueButtonTextDisabled
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
    top: 400,
    left: -30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFD23F',
    opacity: 0.08,
  },
  greenAccent: {
    position: 'absolute',
    bottom: 150,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#50C878',
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
  warningCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#FF8C42',
  },
  warningIconContainer: {
    marginRight: 12,
  },
  warningIconShape: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF8C42',
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningExclamation: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
    lineHeight: 22,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
    fontFamily: 'System',
  },
  warningDescription: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
    fontFamily: 'System',
  },
  revealSection: {
    alignItems: 'center',
  },
  revealDescription: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    fontFamily: 'System',
  },
  securityTips: {
    width: '100%',
    marginBottom: 32,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
    fontFamily: 'System',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipBullet: {
    fontSize: 16,
    color: '#FF8C42',
    marginRight: 8,
    marginTop: 2,
  },
  tipText: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
    flex: 1,
    fontFamily: 'System',
  },
  revealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF8C42',
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 24,
    shadowColor: '#FF8C42',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  revealButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  revealIcon: {
    marginLeft: 8,
  },
  revealIconText: {
    fontSize: 16,
  },
  phraseSection: {
    width: '100%',
  },
  phraseInstructions: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'System',
  },
  seedPhraseContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  seedWordCard: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  seedWordNumber: {
    fontSize: 12,
    color: '#999999',
    fontWeight: '600',
    marginRight: 8,
    fontFamily: 'System',
    minWidth: 16,
  },
  seedWord: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    fontFamily: 'System',
    flex: 1,
  },
  phraseActions: {
    gap: 12,
  },
  copyButton: {
    backgroundColor: '#F8F9FA',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  copyButtonSuccess: {
    backgroundColor: '#E8F5E8',
    borderColor: '#50C878',
  },
  copyButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    fontFamily: 'System',
  },
  copyButtonTextSuccess: {
    color: '#50C878',
  },
  confirmButton: {
    backgroundColor: '#FFD23F',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonSuccess: {
    backgroundColor: '#50C878',
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'System',
  },
  confirmButtonTextSuccess: {
    color: '#FFFFFF',
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
  keyIcon: {
    width: 16,
    height: 12,
    backgroundColor: '#FF8C42',
    borderRadius: 6,
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