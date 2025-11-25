import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { explorStyles as styles } from '@/styles/exploreStyles';

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