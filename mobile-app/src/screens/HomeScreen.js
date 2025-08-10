import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [balanceBOB] = useState('1,247.50');
  const [balanceMATIC] = useState('42.85');
  const [hideBalance, setHideBalance] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { user } = useAuth();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const transactions = [
    {
      id: '1',
      type: 'received',
      amount: '125.50',
      amountMATIC: '2.45',
      contact: 'María González',
      business: 'Tienda Doña María',
      time: 'hace 5 min',
      status: 'completed'
    },
    {
      id: '2',
      type: 'sent',
      amount: '89.20',
      amountMATIC: '1.73',
      contact: 'Carlos Mamani',
      business: 'Mercado Rodríguez',
      time: 'hace 1 hora',
      status: 'completed'
    },
    {
      id: '3',
      type: 'received',
      amount: '45.00',
      amountMATIC: '0.88',
      contact: 'Ana Quispe',
      business: 'Farmacia Central',
      time: 'ayer',
      status: 'completed'
    }
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const handleScanQR = () => {
    navigation.navigate('QRScanner');
  };

  const handleGenerateQR = () => {
    Alert.alert(
      'Generar código QR para cobro',
      'Seleccione el monto en bolivianos:',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: '50 Bs', onPress: () => generateQR(50) },
        { text: '100 Bs', onPress: () => generateQR(100) },
        { text: '200 Bs', onPress: () => generateQR(200) },
        { text: 'Otro monto', onPress: () => promptCustomAmount() },
      ]
    );
  };

  const generateQR = (amount) => {
    const maticEquivalent = (amount / 51.5).toFixed(4); // Ejemplo de conversión
    Alert.alert(
      'QR de cobro generado',
      `💰 Monto: ${amount} Bs\n🔗 Equivale a: ${maticEquivalent} MATIC\n\nMuestre este código a su cliente para recibir el pago`,
      [{ text: 'Entendido', style: 'default' }]
    );
  };

  const promptCustomAmount = () => {
    Alert.prompt(
      'Monto personalizado',
      'Ingrese el monto en bolivianos:',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Generar QR', onPress: (amount) => generateQR(amount) },
      ],
      'plain-text',
      '',
      'numeric'
    );
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

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.greeting}>
              <Text style={styles.greetingText}>Buenos días</Text>
              <Text style={styles.userName}>{user?.firstName || 'Usuario'}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => Alert.alert('Perfil', 'Configuración de cuenta y billetera')}
            >
              <View style={styles.profileIcon}>
                <Text style={styles.profileInitial}>
                  {(user?.firstName || 'U').charAt(0).toUpperCase()}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Main Balance Card */}
          <View style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <Text style={styles.balanceLabel}>Saldo disponible</Text>
              <TouchableOpacity 
                onPress={() => setHideBalance(!hideBalance)}
                style={styles.eyeButton}
              >
                <View style={[styles.eyeIcon, hideBalance && styles.eyeIconClosed]} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.balanceMainText}>
              {hideBalance ? '••••••' : `${balanceBOB} Bs`}
            </Text>
            
            <View style={styles.balanceSecondaryContainer}>
              <View style={styles.maticBadge}>
                <Text style={styles.maticBadgeText}>MATIC</Text>
              </View>
              <Text style={styles.balanceSecondary}>
                {hideBalance ? '••••••' : `${balanceMATIC} MATIC`}
              </Text>
            </View>

            <View style={styles.exchangeRate}>
              <Text style={styles.exchangeRateText}>
                1 MATIC = 51.5 Bs • Polygon Network
              </Text>
            </View>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={['#FF8C42']}
              tintColor="#FF8C42"
            />
          }
        >
          {/* Quick Actions */}
          <View style={styles.actionsContainer}>
            <Text style={styles.actionsTitle}>Acciones rápidas</Text>
            <View style={styles.actionsGrid}>
              
              <TouchableOpacity style={styles.primaryActionCard} onPress={handleScanQR}>
                <View style={[styles.actionIcon, styles.scanActionIcon]}>
                  <View style={styles.qrScanIcon} />
                </View>
                <Text style={styles.primaryActionText}>Pagar con QR</Text>
                <Text style={styles.actionDescription}>Escanear código del comercio</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.primaryActionCard} onPress={handleGenerateQR}>
                <View style={[styles.actionIcon, styles.generateActionIcon]}>
                  <View style={styles.qrGenerateIcon} />
                </View>
                <Text style={styles.primaryActionText}>Cobrar MATIC</Text>
                <Text style={styles.actionDescription}>Generar QR para recibir</Text>
              </TouchableOpacity>

            </View>

            <View style={styles.secondaryActionsRow}>
              <TouchableOpacity 
                style={styles.secondaryActionButton}
                onPress={() => Alert.alert('Recargar MATIC', 'Comprar MATIC con bolivianos próximamente')}
              >
                <View style={[styles.secondaryActionIcon, styles.rechargeIcon]}>
                  <View style={styles.plusIcon} />
                </View>
                <Text style={styles.secondaryActionText}>Recargar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.secondaryActionButton}
                onPress={() => Alert.alert('Enviar MATIC', 'Transferir a otra billetera')}
              >
                <View style={[styles.secondaryActionIcon, styles.sendIcon]}>
                  <View style={styles.arrowIcon} />
                </View>
                <Text style={styles.secondaryActionText}>Enviar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.secondaryActionButton}
                onPress={() => Alert.alert('Convertir', 'MATIC a bolivianos')}
              >
                <View style={[styles.secondaryActionIcon, styles.exchangeIcon]}>
                  <View style={styles.swapIcon} />
                </View>
                <Text style={styles.secondaryActionText}>Convertir</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.secondaryActionButton}
                onPress={() => Alert.alert('Más opciones', 'Historial, soporte, configuración')}
              >
                <View style={[styles.secondaryActionIcon, styles.moreIcon]}>
                  <View style={styles.dotsIcon} />
                </View>
                <Text style={styles.secondaryActionText}>Más</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.activitySection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Actividad reciente</Text>
              <TouchableOpacity onPress={() => Alert.alert('Historial completo', 'Ver todas las transacciones MATIC')}>
                <Text style={styles.seeAllText}>Ver todo</Text>
              </TouchableOpacity>
            </View>

            {transactions.length === 0 ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyStateIcon} />
                <Text style={styles.emptyStateTitle}>Sin transacciones</Text>
                <Text style={styles.emptyStateDescription}>
                  Sus pagos y cobros MATIC aparecerán aquí
                </Text>
              </View>
            ) : (
              <View style={styles.transactionsList}>
                {transactions.map((transaction) => (
                  <TouchableOpacity key={transaction.id} style={styles.transactionCard}>
                    <View style={[
                      styles.transactionIcon,
                      transaction.type === 'received' 
                        ? styles.receivedTransactionIcon 
                        : styles.sentTransactionIcon
                    ]}>
                      <View style={[
                        styles.transactionIconDot,
                        transaction.type === 'received' 
                          ? styles.receivedDot 
                          : styles.sentDot
                      ]} />
                    </View>
                    
                    <View style={styles.transactionDetails}>
                      <Text style={styles.transactionContact}>{transaction.contact}</Text>
                      <Text style={styles.transactionBusiness}>{transaction.business}</Text>
                      <Text style={styles.transactionTime}>{transaction.time}</Text>
                    </View>
                    
                    <View style={styles.transactionAmounts}>
                      <Text style={[
                        styles.transactionAmount,
                        transaction.type === 'received' ? styles.receivedAmount : styles.sentAmount
                      ]}>
                        {transaction.type === 'received' ? '+' : '-'}{transaction.amount} Bs
                      </Text>
                      <Text style={styles.transactionMATIC}>
                        {transaction.amountMATIC} MATIC
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Promotional Card */}
          <View style={styles.promoCard}>
            <View style={styles.promoContent}>
              <View style={styles.promoIcon}>
                <Text style={styles.promoEmoji}>🎁</Text>
              </View>
              <View style={styles.promoText}>
                <Text style={styles.promoTitle}>Invita y gana MATIC</Text>
                <Text style={styles.promoDescription}>
                  Por cada amigo que se registre, ambos reciben 0.2 MATIC gratis
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.promoButton}>
              <Text style={styles.promoButtonText}>Invitar</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
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
    top: 80,
    right: -60,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#FF8C42',
    opacity: 0.06,
  },
  yellowAccent: {
    position: 'absolute',
    top: 350,
    left: -25,
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#FFD23F',
    opacity: 0.08,
    transform: [{ rotate: '20deg' }],
  },
  redDot: {
    position: 'absolute',
    bottom: 200,
    right: 40,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF6B35',
    opacity: 0.1,
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    flex: 1,
  },
  greetingText: {
    fontSize: 15,
    color: '#666666',
    fontFamily: 'System',
  },
  userName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    fontFamily: 'System',
    marginTop: 2,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF8C42',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF8C42',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  profileIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  balanceCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#FF8C42',
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 15,
    color: '#666666',
    fontFamily: 'System',
    fontWeight: '500',
  },
  eyeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#DDDDDD',
  },
  eyeIconClosed: {
    backgroundColor: '#FF8C42',
  },
  balanceMainText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 8,
    fontFamily: 'System',
  },
  balanceSecondaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  maticBadge: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  maticBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  balanceSecondary: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'System',
    fontWeight: '500',
  },
  exchangeRate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exchangeRateText: {
    fontSize: 13,
    color: '#999999',
    fontFamily: 'System',
  },
  scrollContent: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  actionsContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 12,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 20,
    fontFamily: 'System',
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  primaryActionCard: {
    flex: 1,
    backgroundColor: '#FFF8F2',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF8C42',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  scanActionIcon: {
    backgroundColor: '#FF8C42',
  },
  generateActionIcon: {
    backgroundColor: '#FFD23F',
  },
  qrScanIcon: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 3,
  },
  qrGenerateIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  primaryActionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
    fontFamily: 'System',
    textAlign: 'center',
  },
  actionDescription: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    fontFamily: 'System',
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  secondaryActionButton: {
    alignItems: 'center',
    flex: 1,
  },
  secondaryActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  rechargeIcon: {
    backgroundColor: '#E8F5E8',
  },
  sendIcon: {
    backgroundColor: '#FFF5E6',
  },
  exchangeIcon: {
    backgroundColor: '#F0F4FF',
  },
  moreIcon: {
    backgroundColor: '#F5F5F5',
  },
  plusIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#50C878',
  },
  arrowIcon: {
    width: 20,
    height: 2,
    backgroundColor: '#FFD23F',
    borderRadius: 1,
  },
  swapIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3B82F6',
  },
  dotsIcon: {
    width: 20,
    height: 4,
    backgroundColor: '#999999',
    borderRadius: 2,
  },
  secondaryActionText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1A1A1A',
    fontFamily: 'System',
  },
  activitySection: {
    backgroundColor: '#FFFFFF',
    marginTop: 12,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'System',
  },
  seeAllText: {
    fontSize: 14,
    color: '#FF8C42',
    fontWeight: '600',
    fontFamily: 'System',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F0F0',
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
    fontFamily: 'System',
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    fontFamily: 'System',
  },
  transactionsList: {
    gap: 16,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  receivedTransactionIcon: {
    backgroundColor: '#E8F5E8',
  },
  sentTransactionIcon: {
    backgroundColor: '#FFF5E6',
  },
  transactionIconDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  receivedDot: {
    backgroundColor: '#50C878',
  },
  sentDot: {
    backgroundColor: '#FFD23F',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionContact: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
    fontFamily: 'System',
  },
  transactionBusiness: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
    fontFamily: 'System',
  },
  transactionTime: {
    fontSize: 12,
    color: '#999999',
    fontFamily: 'System',
  },
  transactionAmounts: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'System',
    marginBottom: 2,
  },
  receivedAmount: {
    color: '#50C878',
  },
  sentAmount: {
    color: '#1A1A1A',
  },
  transactionMATIC: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '500',
    fontFamily: 'System',
  },
  promoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginVertical: 12,
    marginBottom: 40,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD23F',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  promoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  promoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFCF2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  promoEmoji: {
    fontSize: 24,
  },
  promoText: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
    fontFamily: 'System',
  },
  promoDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    fontFamily: 'System',
  },
  promoButton: {
    backgroundColor: '#FF8C42',
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'System',
  },
});
