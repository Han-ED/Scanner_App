import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import { useRef, useState } from 'react';
import { captureRef } from 'react-native-view-shot';
import IDCardTemplate from '@/components/IDCardTemplate';

export default function ExploreScreen() {
  const { scanHistory } = useAuth();
  const [printingData, setPrintingData] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [printStatus, setPrintStatus] = useState<'preparing' | 'capturing' | 'printing' | 'done'>('preparing');
  const cardRef = useRef<View>(null);

  const handlePrint = async (data: any) => {
    try {
      // Show preview dengan data
      setPrintingData(data);
      setShowPreview(true);
      setPrintStatus('preparing');
      
      // Wait for render
      setTimeout(async () => {
        setPrintStatus('capturing');
        
        setTimeout(async () => {
          if (!cardRef.current) {
            Alert.alert('Error', 'Card reference tidak tersedia');
            handleClosePreview();
            return;
          }

          setPrintStatus('printing');

          // Capture view as image
          const uri = await captureRef(cardRef, {
            format: 'png',
            quality: 1,
            width: 757,
            height: 1069,
          });

          // Print image
          await Print.printAsync({
            uri,
            width: 257,
            height: 364,
          });

          setPrintStatus('done');

          setTimeout(() => {
            handleClosePreview();
            Alert.alert('Success! ✅', 'ID Card berhasil dicetak ulang!');
          }, 1500);

        }, 1500);
      }, 1000);

    } catch (error) {
      console.error('Print error:', error);
      handleClosePreview();
      Alert.alert('Error', 'Gagal mencetak: ' + (error as Error).message);
    }
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setPrintingData(null);
    setPrintStatus('preparing');
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Scan History</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{scanHistory.length} scan</Text>
            </View>
          </View>
          {scanHistory.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyText}>Belum ada riwayat scan</Text>
              <Text style={styles.emptySubtext}>
                Scan QR Code visitor untuk mulai membuat ID Card
              </Text>
            </View>
          ) : (
            scanHistory.map((scan) => (
              <View key={scan.scanId} style={styles.historyItem}>
                <View style={styles.historyHeader}>
                  <View style={styles.historyIcon}>
                    <Ionicons name="person" size={24} color="#10b981" />
                  </View>
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyName}>{scan.name}</Text>
                    <Text style={styles.historyCompany}>{scan.company}</Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => handlePrint(scan)}
                    style={styles.printButton}
                  >
                    <Ionicons name="print" size={20} color="#10b981" />
                    <Text style={styles.printButtonText}>Print</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.historyDetails}>
                  <View style={styles.detailItem}>
                    <Ionicons name="briefcase-outline" size={14} color="#6B7280" />
                    <Text style={styles.detailText}>{scan.position}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="call-outline" size={14} color="#6B7280" />
                    <Text style={styles.detailText}>{scan.phone}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="mail-outline" size={14} color="#6B7280" />
                    <Text style={styles.detailText}>{scan.email}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="location-outline" size={14} color="#6B7280" />
                    <Text style={styles.detailText}>{scan.address}</Text>
                  </View>
                </View>
                <View style={styles.timestampContainer}>
                  <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                  <Text style={styles.timestamp}>{scan.timestamp}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Preview Modal - PURE REACT NATIVE */}
      <Modal
        visible={showPreview}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={styles.previewOverlay}>
          <View style={styles.previewContainer}>
            <View style={styles.previewHeader}>
              <View style={styles.headerIconContainer}>
                <Ionicons name="refresh-circle" size={28} color="#10b981" />
              </View>
              <Text style={styles.previewTitle}>Re-printing ID Card</Text>
            </View>

            <View style={styles.statusContainer}>
              {printStatus === 'preparing' && (
                <>
                  <Ionicons name="refresh" size={20} color="#3B82F6" />
                  <Text style={styles.statusText}>Preparing layout...</Text>
                </>
              )}
              {printStatus === 'capturing' && (
                <>
                  <Ionicons name="camera" size={20} color="#F59E0B" />
                  <Text style={styles.statusText}>Capturing image...</Text>
                </>
              )}
              {printStatus === 'printing' && (
                <>
                  <Ionicons name="print" size={20} color="#10b981" />
                  <Text style={styles.statusText}>Printing...</Text>
                </>
              )}
              {printStatus === 'done' && (
                <>
                  <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                  <Text style={styles.statusText}>Done! ✅</Text>
                </>
              )}
            </View>
            
            {printingData && (
              <View style={styles.previewCardContainer}>
                <ScrollView 
                  style={styles.previewScrollView}
                  contentContainerStyle={styles.previewScrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.previewCardWrapper}>
                    <View 
                      ref={cardRef} 
                      collapsable={false}
                      style={styles.fullSizeCard}
                    >
                      <IDCardTemplate data={printingData} />
                    </View>
                  </View>
                </ScrollView>
              </View>
            )}

            <View style={styles.previewFooter}>
              <View style={styles.footerItem}>
                <Ionicons name="document-outline" size={16} color="#6B7280" />
                <Text style={styles.footerText}>Size: B4</Text>
              </View>
              <View style={styles.footerItem}>
                <Ionicons name="print-outline" size={16} color="#6B7280" />
                <Text style={styles.footerText}>Print Only</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  badge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10b981',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  historyItem: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#FAFAFA',
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  historyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  printButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10b981',
  },
  historyDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#6B7280',
    flex: 1,
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  
  // Preview Modal Styles
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  previewContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
  },
  previewHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  headerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  previewCardContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 8,
    marginBottom: 16,
    maxHeight: 450,
  },
  previewScrollView: {
    maxHeight: 450,
  },
  previewScrollContent: {
    alignItems: 'center',
  },
  previewCardWrapper: {
    width: 300,
    height: 424,
    overflow: 'hidden',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  fullSizeCard: {
    transform: [{ scale: 0.396 }],
    transformOrigin: 'top left',
    width: 757,
    height: 1069,
  },
  previewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
  },
});