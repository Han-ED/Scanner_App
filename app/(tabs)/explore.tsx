import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import { Alert } from 'react-native';

export default function ExploreScreen() {
  const { scanHistory } = useAuth();

  const handlePrint = async (data: any) => {
    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; }
            .content { margin-top: 20px; }
            .row { margin: 10px 0; }
            .label { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>DATA SCAN QR CODE</h2>
          </div>
          <div class="content">
            <div class="row"><span class="label">Waktu Scan:</span> ${data.timestamp}</div>
            <div class="row"><span class="label">Nama:</span> ${data.name}</div>
            <div class="row"><span class="label">Company:</span> ${data.company}</div>
            <div class="row"><span class="label">Posisi:</span> ${data.position}</div>
            <div class="row"><span class="label">Alamat:</span> ${data.address}</div>
            <div class="row"><span class="label">Telepon:</span> ${data.phone}</div>
            <div class="row"><span class="label">Email:</span> ${data.email}</div>
          </div>
        </body>
      </html>
    `;

    try {
      await Print.printAsync({ html });
    } catch (error) {
      Alert.alert('Error', 'Gagal mencetak');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>Scan History</Text>
          {scanHistory.length === 0 ? (
            <Text style={styles.emptyText}>Belum ada riwayat scan</Text>
          ) : (
            scanHistory.map((scan) => (
              <View key={scan.scanId} style={styles.historyItem}>
                <View style={styles.historyHeader}>
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyName}>{scan.name}</Text>
                    <Text style={styles.historyCompany}>{scan.company}</Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => handlePrint(scan)}
                    style={styles.printButton}
                  >
                    <Ionicons name="print-outline" size={20} color="#3B82F6" />
                  </TouchableOpacity>
                </View>
                <View style={styles.historyDetails}>
                  <Text style={styles.detailText}>Posisi: {scan.position}</Text>
                  <Text style={styles.detailText}>Telepon: {scan.phone}</Text>
                  <Text style={styles.detailText}>Email: {scan.email}</Text>
                  <Text style={styles.detailText}>Alamat: {scan.address}</Text>
                </View>
                <Text style={styles.timestamp}>{scan.timestamp}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    paddingVertical: 32,
  },
  historyItem: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  historyInfo: {
    flex: 1,
  },
  historyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  historyCompany: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  printButton: {
    padding: 8,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
  },
  historyDetails: {
    gap: 4,
  },
  detailText: {
    fontSize: 13,
    color: '#6B7280',
  },
  timestamp: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 8,
  },
});