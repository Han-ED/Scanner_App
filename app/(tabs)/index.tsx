import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import ScannerModal from '@/components/ScannerModal';

export default function HomeScreen() {
  const { currentUser, scanHistory } = useAuth();
  const [showScanner, setShowScanner] = useState(false);
  const [showMyQR, setShowMyQR] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Welcome Back!</Text>
          <Text style={styles.welcomeText}>Halo, {currentUser?.name}</Text>
          <Text style={styles.welcomeSubtext}>
            {currentUser?.position} - {currentUser?.company}
          </Text>
        </View>

        {/* My QR Code Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>QR Code Saya</Text>
            <TouchableOpacity onPress={() => setShowMyQR(!showMyQR)}>
              <Ionicons 
                name={showMyQR ? "chevron-up" : "chevron-down"} 
                size={24} 
                color="#6B7280" 
              />
            </TouchableOpacity>
          </View>
          
          {showMyQR && (
            <View style={styles.qrContainer}>
              <View style={styles.qrWrapper}>
                <QRCode
                  value={currentUser?.id || ''}
                  size={200}
                  backgroundColor="white"
                  color="black"
                />
              </View>
              <Text style={styles.qrLabel}>ID: {currentUser?.id}</Text>
              <Text style={styles.qrSubtext}>
                Scan QR ini untuk melihat data Anda
              </Text>
              <View style={styles.qrInfoBox}>
                <View style={styles.qrInfoRow}>
                  <Ionicons name="person-outline" size={16} color="#6B7280" />
                  <Text style={styles.qrInfoText}>{currentUser?.name}</Text>
                </View>
                <View style={styles.qrInfoRow}>
                  <Ionicons name="business-outline" size={16} color="#6B7280" />
                  <Text style={styles.qrInfoText}>{currentUser?.company}</Text>
                </View>
                <View style={styles.qrInfoRow}>
                  <Ionicons name="briefcase-outline" size={16} color="#6B7280" />
                  <Text style={styles.qrInfoText}>{currentUser?.position}</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Quick Action */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <TouchableOpacity 
            style={styles.scanButton}
            onPress={() => setShowScanner(true)}
          >
            <Ionicons name="camera" size={20} color="#fff" />
            <Text style={styles.scanButtonText}>Scan QR Code Orang Lain</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Scans */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Scans</Text>
          {scanHistory.length === 0 ? (
            <Text style={styles.emptyText}>Belum ada scan</Text>
          ) : (
            scanHistory.slice(0, 3).map((scan) => (
              <View key={scan.scanId} style={styles.scanItem}>
                <View style={styles.scanIcon}>
                  <Ionicons name="person" size={20} color="#3B82F6" />
                </View>
                <View style={styles.scanInfo}>
                  <Text style={styles.scanName}>{scan.name}</Text>
                  <Text style={styles.scanCompany}>{scan.company}</Text>
                  <Text style={styles.scanTime}>{scan.timestamp}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Settings Link */}
        <Link href="/modal" asChild>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={20} color="#3B82F6" />
            <Text style={styles.settingsText}>Settings</Text>
          </TouchableOpacity>
        </Link>
      </ScrollView>

      <ScannerModal 
        visible={showScanner} 
        onClose={() => setShowScanner(false)} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  welcomeCard: {
    backgroundColor: '#3B82F6',
    margin: 16,
    padding: 24,
    borderRadius: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: '#E0E7FF',
  },
  welcomeSubtext: {
    fontSize: 14,
    color: '#DBEAFE',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  qrContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  qrWrapper: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  qrLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 8,
  },
  qrSubtext: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 16,
  },
  qrInfoBox: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  qrInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qrInfoText: {
    fontSize: 13,
    color: '#374151',
    flex: 1,
  },
  scanButton: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    paddingVertical: 16,
  },
  scanItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    gap: 12,
  },
  scanIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanInfo: {
    flex: 1,
  },
  scanName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  scanCompany: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  scanTime: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    margin: 16,
    padding: 12,
  },
  settingsText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
});