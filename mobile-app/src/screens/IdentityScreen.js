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
  Modal,
  FlatList,
} from 'react-native';

const BOLIVIAN_EXTENSIONS = [
  { code: 'LP', name: 'La Paz' },
  { code: 'CB', name: 'Cochabamba' },
  { code: 'SC', name: 'Santa Cruz' },
  { code: 'OR', name: 'Oruro' },
  { code: 'PT', name: 'Potosí' },
  { code: 'CH', name: 'Chuquisaca' },
  { code: 'TJ', name: 'Tarija' },
  { code: 'BE', name: 'Beni' },
  { code: 'PD', name: 'Pando' },
];

export default function IdentityScreen({ navigation, route }) {
  const [carnetNumber, setCarnetNumber] = useState('');
  const [carnetExtension, setCarnetExtension] = useState('');
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [carnetPhotoFront, setCarnetPhotoFront] = useState(null);
  const [carnetPhotoBack, setCarnetPhotoBack] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { userData } = route.params || {};

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleExtensionSelect = (extension) => {
    setCarnetExtension(extension.code);
    setShowExtensionModal(false);
  };

  const handlePhotoUpload = (side) => {
    Alert.alert(
      `Subir foto del ${side === 'front' ? 'anverso' : 'reverso'}`,
      'Seleccione una opción para cargar su documento',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Tomar foto', 
          onPress: () => {
            if (side === 'front') {
              setCarnetPhotoFront('camera');
            } else {
              setCarnetPhotoBack('camera');
            }
            Alert.alert('Cámara simulada', 'Foto tomada correctamente');
          }
        },
        { 
          text: 'Galería', 
          onPress: () => {
            if (side === 'front') {
              setCarnetPhotoFront('gallery');
            } else {
              setCarnetPhotoBack('gallery');
            }
            Alert.alert('Galería simulada', 'Imagen seleccionada correctamente');
          }
        },
      ]
    );
  };

  const handleContinue = () => {
    console.log('🆔 IdentityScreen - Datos recibidos:', userData);
    console.log('🆔 IdentityScreen - Email recibido:', userData?.email);
    console.log('🆔 IdentityScreen - Nombre recibido:', userData?.firstName, userData?.lastName);
    
    if (!carnetNumber || !carnetExtension) {
      Alert.alert('Datos incompletos', 'Complete el número de carnet y seleccione la extensión');
      return;
    }

    if (!carnetPhotoFront || !carnetPhotoBack) {
      Alert.alert('Fotos requeridas', 'Debe subir ambas fotos del carnet (anverso y reverso)');
      return;
    }

    // Combinar todos los datos del usuario
    const completeUserData = {
      ...userData,
      carnetNumber,
      carnetExtension,
      carnetPhotoFront,
      carnetPhotoBack
    };

    console.log('🆔 IdentityScreen - Enviando datos completos:', completeUserData);

    // Navegar al siguiente paso (SecurityScreen)
    navigation.navigate('SecurityScreen', { userData: completeUserData });
  };

  const renderExtensionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.extensionItem}
      onPress={() => handleExtensionSelect(item)}
    >
      <Text style={styles.extensionCode}>{item.code}</Text>
      <Text style={styles.extensionName}>{item.name}</Text>
    </TouchableOpacity>
  );

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
              <Text style={styles.title}>Verificación de identidad</Text>
              <Text style={styles.subtitle}>Carnet de identidad boliviano</Text>
            </View>
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '33%' }]} />
            </View>
            <Text style={styles.progressText}>Paso 2 de 6</Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <View style={styles.stepIcon}>
                <Text style={styles.stepNumber}>2</Text>
              </View>
              <Text style={styles.formTitle}>Documento de identidad</Text>
            </View>

            {/* Carnet Number + Extension Row */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Número de carnet *</Text>
              <View style={styles.carnetRow}>
                <TextInput
                  style={[
                    styles.carnetInput,
                    focusedInput === 'carnet' && styles.inputFocused
                  ]}
                  placeholder="12345678"
                  value={carnetNumber}
                  onChangeText={setCarnetNumber}
                  keyboardType="numeric"
                  maxLength={8}
                  onFocus={() => setFocusedInput('carnet')}
                  onBlur={() => setFocusedInput(null)}
                  placeholderTextColor="#999999"
                />
                
                <TouchableOpacity
                  style={[
                    styles.extensionSelector,
                    !carnetExtension && styles.extensionSelectorEmpty
                  ]}
                  onPress={() => setShowExtensionModal(true)}
                >
                  <Text style={[
                    styles.extensionSelectorText,
                    !carnetExtension && styles.extensionSelectorTextEmpty
                  ]}>
                    {carnetExtension || 'Ext.'}
                  </Text>
                  <Text style={styles.extensionArrow}>▼</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Photo Upload Section */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Fotos del carnet *</Text>
              
              {/* Front Photo */}
              <TouchableOpacity
                style={[
                  styles.photoUploadCard,
                  carnetPhotoFront && styles.photoUploadCardComplete
                ]}
                onPress={() => handlePhotoUpload('front')}
              >
                <View style={styles.photoUploadIcon}>
                  {carnetPhotoFront ? (
                    <View style={styles.photoCompleteIcon}>
                      <Text style={styles.photoCompleteCheck}>✓</Text>
                    </View>
                  ) : (
                    <View style={styles.photoUploadIconShape} />
                  )}
                </View>
                <View style={styles.photoUploadContent}>
                  <Text style={[
                    styles.photoUploadTitle,
                    carnetPhotoFront && styles.photoUploadTitleComplete
                  ]}>
                    {carnetPhotoFront ? 'Anverso cargado' : 'Subir anverso del carnet'}
                  </Text>
                  <Text style={styles.photoUploadDescription}>
                    {carnetPhotoFront ? 'Toque para cambiar' : 'Lado frontal con foto'}
                  </Text>
                </View>
                <View style={styles.photoUploadArrow}>
                  <Text style={styles.photoArrowText}>→</Text>
                </View>
              </TouchableOpacity>

              {/* Back Photo */}
              <TouchableOpacity
                style={[
                  styles.photoUploadCard,
                  styles.photoUploadCardSpacing,
                  carnetPhotoBack && styles.photoUploadCardComplete
                ]}
                onPress={() => handlePhotoUpload('back')}
              >
                <View style={styles.photoUploadIcon}>
                  {carnetPhotoBack ? (
                    <View style={styles.photoCompleteIcon}>
                      <Text style={styles.photoCompleteCheck}>✓</Text>
                    </View>
                  ) : (
                    <View style={styles.photoUploadIconShape} />
                  )}
                </View>
                <View style={styles.photoUploadContent}>
                  <Text style={[
                    styles.photoUploadTitle,
                    carnetPhotoBack && styles.photoUploadTitleComplete
                  ]}>
                    {carnetPhotoBack ? 'Reverso cargado' : 'Subir reverso del carnet'}
                  </Text>
                  <Text style={styles.photoUploadDescription}>
                    {carnetPhotoBack ? 'Toque para cambiar' : 'Lado posterior con datos'}
                  </Text>
                </View>
                <View style={styles.photoUploadArrow}>
                  <Text style={styles.photoArrowText}>→</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Info Card - Más pequeño */}
            <View style={styles.infoCardSmall}>
              <View style={styles.infoIconSmall}>
                <View style={styles.documentIconSmall} />
              </View>
              <View style={styles.infoContentSmall}>
                <Text style={styles.infoTitleSmall}>Verificación segura</Text>
                <Text style={styles.infoDescriptionSmall}>
                  Datos encriptados con blockchain
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

      {/* Extension Selection Modal */}
      <Modal
        visible={showExtensionModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowExtensionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar extensión</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowExtensionModal(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={BOLIVIAN_EXTENSIONS}
              keyExtractor={(item) => item.code}
              renderItem={renderExtensionItem}
              style={styles.extensionList}
            />
          </View>
        </View>
      </Modal>
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
  carnetRow: {
    flexDirection: 'row',
    gap: 12,
  },
  carnetInput: {
    flex: 1,
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
  extensionSelector: {
    width: 80,
    borderWidth: 2,
    borderColor: '#FF8C42',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#FFF8F2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  extensionSelectorEmpty: {
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  extensionSelectorText: {
    fontSize: 16,
    color: '#FF8C42',
    fontWeight: '600',
    fontFamily: 'System',
  },
  extensionSelectorTextEmpty: {
    color: '#999999',
    fontWeight: '400',
  },
  extensionArrow: {
    fontSize: 12,
    color: '#FF8C42',
  },
  photoUploadCard: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  photoUploadCardComplete: {
    borderColor: '#FFD23F',
    backgroundColor: '#FFFCF2',
    borderStyle: 'solid',
  },
  photoUploadIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  photoUploadIconShape: {
    width: 24,
    height: 20,
    backgroundColor: '#CCCCCC',
    borderRadius: 4,
  },
  photoCompleteIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFD23F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoCompleteCheck: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  photoUploadContent: {
    flex: 1,
  },
  photoUploadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
    fontFamily: 'System',
  },
  photoUploadTitleComplete: {
    color: '#1A1A1A',
  },
  photoUploadDescription: {
    fontSize: 13,
    color: '#666666',
    fontFamily: 'System',
  },
  photoUploadArrow: {
    marginLeft: 12,
  },
  photoArrowText: {
    fontSize: 16,
    color: '#CCCCCC',
    fontWeight: '300',
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
  infoCardSmall: {
    flexDirection: 'row',
    backgroundColor: '#FFF8F2',
    borderRadius: 12,
    padding: 12,
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
  infoIconSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFE8D6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  documentIcon: {
    width: 20,
    height: 24,
    backgroundColor: '#FF8C42',
    borderRadius: 3,
  },
  documentIconSmall: {
    width: 16,
    height: 20,
    backgroundColor: '#FF8C42',
    borderRadius: 3,
  },
  infoContent: {
    flex: 1,
  },
  infoContentSmall: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
    fontFamily: 'System',
  },
  infoTitleSmall: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
    fontFamily: 'System',
  },
  infoDescription: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 16,
    fontFamily: 'System',
  },
  infoDescriptionSmall: {
    fontSize: 10,
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
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'System',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '400',
  },
  extensionList: {
    paddingHorizontal: 20,
  },
  extensionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  extensionCode: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF8C42',
    marginRight: 16,
    fontFamily: 'System',
    width: 40,
  },
  extensionName: {
    fontSize: 16,
    color: '#1A1A1A',
    fontFamily: 'System',
  },
});