import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';

export default function ExploreScreen() {
  // ========================================
  // HOOKS & STATE
  // ========================================
  const { scanHistory } = useAuth();

  // ========================================
  // RENDER
  // ========================================
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* ========== HEADER WITH STATS ========== */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Scan History</Text>
            <Text style={styles.subtitle}>Riwayat scan hari ini</Text>
          </View>
          <View style={styles.statsContainer}>
            <Text style={styles.statsNumber}>{scanHistory.length}</Text>
            <Text style={styles.statsLabel}>Visitor</Text>
          </View>
        </View>

        {/* ========== HISTORY LIST ========== */}
        <View style={styles.listContainer}>
          {scanHistory.length === 0 ? (
            // Empty State
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
              </View>
              <Text style={styles.emptyTitle}>Belum Ada Riwayat</Text>
              <Text style={styles.emptyText}>
                Scan QR Code visitor akan muncul di sini
              </Text>
            </View>
          ) : (
            // History Items
            scanHistory.map((scan) => (
              <View key={scan.scanId} style={styles.historyItem}>
                {/* Left: Info */}
                <View style={styles.historyInfo}>
                  <Text style={styles.historyName}>{scan.name}</Text>
                  <Text style={styles.historyTime}>{scan.timestamp}</Text>
                </View>
                
                {/* Right: QR Code Icon */}
                <View style={styles.historyQR}>
                  <Ionicons name="qr-code" size={48} color="#10b981" />
                </View>
              </View>
            ))
          )}
        </View>

        {/* ========== TOTAL COUNTER (Bottom) ========== */}
        {scanHistory.length > 0 && (
          <View style={styles.totalContainer}>
            <Ionicons name="people-outline" size={20} color="#6B7280" />
            <Text style={styles.totalText}>
              Total {scanHistory.length} orang sudah scan hari ini
            </Text>
          </View>
        )}

      </ScrollView>
    </View>
  );
}

// ========================================
// STYLES
// ========================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  statsContainer: {
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  statsNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#10b981',
  },
  statsLabel: {
    fontSize: 12,
    color: '#059669',
    marginTop: 2,
  },
  
  // List Container
  listContainer: {
    padding: 16,
  },
  
  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  
  // History Item
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  historyInfo: {
    flex: 1,
  },
  historyName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  historyTime: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  historyQR: {
    marginLeft: 16,
    opacity: 0.8,
  },
  
  // Total Counter
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  totalText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
});