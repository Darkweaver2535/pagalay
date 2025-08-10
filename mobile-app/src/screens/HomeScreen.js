import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const [balanceBOB] = useState('1,247.50');
  const [balanceCrypto] = useState('42.85');
  const [hideBalance, setHideBalance] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const { user } = useAuth();

  const transactions = [
    {
      id: '1',
      type: 'received',
      amount: '125.50',
      contact: 'María González',
      business: 'Tienda Doña María',
      time: 'hace 5 min',
      status: 'completed'
    },
    {
      id: '2',
      type: 'sent',
      amount: '89.20',
      contact: 'Carlos Mamani',
      business: 'Mercado Rodríguez',
      time: 'hace 1 hora',
      status: 'completed'
    },
    {
      id: '3',
      type: 'received',
      amount: '45.00',
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
      'Generar código QR',
      'Seleccione el monto para cobrar:',
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
    Alert.alert(
      'Código QR generado',
      `Código generado por ${amount} Bs\nMuestre este código a su cliente`,
      [{ text: 'Entendido', style: 'default' }]
    );
  };

  const promptCustomAmount = () => {
    Alert.prompt(
      'Monto personalizado',
      'Ingrese el monto en bolivianos:',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Generar', onPress: (amount) => generateQR(amount) },
      ],
      'plain-text',
      '',
      'numeric'
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.greeting}>
            <Text style={styles.greetingText}>Buenos días</Text>
            <Text style={styles.userName}>{user?.firstName || 'Usuario'}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => Alert.alert('Perfil', 'Configuración de perfil')}
          >
            <View style={styles.profileIcon} />
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Saldo disponible</Text>
            <TouchableOpacity 
              onPress={() => setHideBalance(!hideBalance)}
              style={styles.eyeButton}
            >
              <View style={styles.eyeIcon} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.balanceMainText}>
            {hideBalance ? '••••••' : `${balanceBOB} Bs`}
          </Text>
          
          <Text style={styles.balanceSecondary}>
            ≈ ${hideBalance ? '•••••' : balanceCrypto} USDT
          </Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionButton} onPress={handleScanQR}>
              <View style={styles.actionIconContainer}>
                <View style={styles.scanIcon} />
              </View>
              <Text style={styles.actionText}>Pagar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleGenerateQR}>
              <View style={styles.actionIconContainer}>
                <View style={styles.qrIcon} />
              </View>
              <Text style={styles.actionText}>Cobrar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => Alert.alert('Recargar', 'Funcionalidad próximamente')}
            >
              <View style={styles.actionIconContainer}>
                <View style={styles.addIcon} />
              </View>
              <Text style={styles.actionText}>Recargar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => Alert.alert('Más opciones', 'Transferir, retirar, configurar')}
            >
              <View style={styles.actionIconContainer}>
                <View style={styles.moreIcon} />
              </View>
              <Text style={styles.actionText}>Más</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Actividad reciente</Text>
            <TouchableOpacity onPress={() => Alert.alert('Historial', 'Ver historial completo')}>
              <Text style={styles.seeAllText}>Ver todo</Text>
            </TouchableOpacity>
          </View>

          {transactions.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyStateIcon} />
              <Text style={styles.emptyStateTitle}>Sin movimientos</Text>
              <Text style={styles.emptyStateDescription}>
                Sus transacciones aparecerán aquí
              </Text>
            </View>
          ) : (
            <View style={styles.transactionsList}>
              {transactions.map((transaction) => (
                <TouchableOpacity key={transaction.id} style={styles.transactionItem}>
                  <View style={[
                    styles.transactionIcon,
                    { backgroundColor: transaction.type === 'received' ? '#E8F5E8' : '#FFF5E6' }
                  ]}>
                    <View style={[
                      styles.transactionIconDot,
                      { backgroundColor: transaction.type === 'received' ? '#50C878' : '#FFD700' }
                    ]} />
                  </View>
                  
                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionContact}>{transaction.contact}</Text>
                    <Text style={styles.transactionBusiness}>{transaction.business}</Text>
                    <Text style={styles.transactionTime}>{transaction.time}</Text>
                  </View>
                  
                  <Text style={[
                    styles.transactionAmount,
                    { color: transaction.type === 'received' ? '#50C878' : '#1A1A1A' }
                  ]}>
                    {transaction.type === 'received' ? '+' : '-'}{transaction.amount} Bs
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Promotional Banner */}
        <View style={styles.promoCard}>
          <Text style={styles.promoTitle}>Invite y gane</Text>
          <Text style={styles.promoDescription}>
            Por cada amigo que invite, ambos reciben 10 Bs de regalo
          </Text>
          <TouchableOpacity style={styles.promoButton}>
            <Text style={styles.promoButtonText}>Invitar amigos</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 24,
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
    fontSize: 14,
    color: '#666666',
    fontFamily: 'System',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'System',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#CCCCCC',
  },
  balanceCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'System',
  },
  eyeButton: {
    padding: 4,
  },
  eyeIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#DDDDDD',
  },
  balanceMainText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
    fontFamily: 'System',
  },
  balanceSecondary: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'System',
  },
  content: {
    flex: 1,
  },
  actionsContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 24,
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  scanIcon: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#003DA5',
    borderRadius: 4,
  },
  qrIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#003DA5',
    borderRadius: 4,
  },
  addIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#50C878',
  },
  moreIcon: {
    width: 24,
    height: 4,
    backgroundColor: '#666666',
    borderRadius: 2,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1A1A1A',
    fontFamily: 'System',
  },
  activitySection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 20,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    fontFamily: 'System',
  },
  seeAllText: {
    fontSize: 14,
    color: '#003DA5',
    fontWeight: '500',
    fontFamily: 'System',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F0F0',
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '500',
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
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transactionIconDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionContact: {
    fontSize: 16,
    fontWeight: '500',
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
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
  promoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 32,
    borderRadius: 12,
    padding: 20,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
    fontFamily: 'System',
  },
  promoDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
    lineHeight: 20,
    fontFamily: 'System',
  },
  promoButton: {
    backgroundColor: '#003DA5',
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'System',
  },
});
