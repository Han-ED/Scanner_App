import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useAuth } from '@/hooks/useAuth';
import { MOCK_QR_DATA } from '@/constants/MockData';
import * as Print from 'expo-print';
import { captureRef } from 'react-native-view-shot';
import IDCardTemplate from './IDCardTemplate';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function ScannerModal({ visible, onClose }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [simulatedId, setSimulatedId] = useState('1');
  const [showPreview, setShowPreview] = useState(false);
  const [cardData, setCardData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [printStatus, setPrintStatus] = useState<'generating' | 'capturing' | 'printing' | 'done'>('generating');
  const [useCamera, setUseCamera] = useState(false);
  const { addScanHistory } = useAuth();
  const cardRef = useRef<View>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const scanLock = useRef(false); // synchronous flag, jauh lebih cepat dari state

    const handleBarCodeScanned = ({ data }: { data: string }) => {
    // Gunakan ref lock → instant, tidak menunggu render
    if (scanLock.current) return; // langsung stop spam frames
    scanLock.current = true; // lock scanning

    setScanned(true);
    processScan(data);
  };

  const processScan = async (qrData: string) => {
    if (isPrinting) return; 
    setIsPrinting(true);
    const data = MOCK_QR_DATA[qrData];
    if (data) {
      const scanRecord = {
        ...data,
        timestamp: new Date().toLocaleString('id-ID'),
        scanId: Date.now(),
      };

      addScanHistory(scanRecord);
      setCardData(scanRecord);
      setIsProcessing(true);
      setPrintStatus('generating');

      // Close scanner modal, show preview modal
      onClose();
      setUseCamera(false);
      setShowPreview(true);

      // Wait for render to complete
      setTimeout(async () => {
        setPrintStatus('capturing');
        await captureAndPrint();
      }, 2000);
    } else {
      Alert.alert('Error', 'QR Code tidak valid');
      scanLock.current = false;
      setScanned(false);
    }
  };

  const captureAndPrint = async () => {
    try {
      if (!cardRef.current) {
        console.log('cardRef not ready');
        Alert.alert('Error', 'Card reference tidak tersedia');
        handleClosePreview();
        return;
      }

      console.log('Starting capture...');
      setPrintStatus('printing');

      // Capture view as image with high quality
      const uri = await captureRef(cardRef, {
        format: 'png',
        quality: 1,
        width: 757,
        height: 1069,
      });

      console.log('Captured successfully:', uri);

      // Print image
      await Print.printAsync({
        uri,
        width: 257,
        height: 364,
      });

      console.log('Print command sent');

      setPrintStatus('done');

      // Show success
      setTimeout(() => {
        handleClosePreview();
        setIsPrinting(false);
        scanLock.current = false;
        Alert.alert('Success! ✅', 'ID Card berhasil dicetak!');
      }, 1500);

    } catch (error) {
      console.log('Print gagal (ditangani dengan aman)');
      setIsPrinting(false);
      scanLock.current = false;
      handleClosePreview();
      Alert.alert(
        'Pencetakan Tidak Berhasil',
        'Proses pencetakan dibatalkan atau printer tidak merespons.'
      );
    }
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setIsProcessing(false);
    setCardData(null);
    setPrintStatus('generating');
    setScanned(false);
    scanLock.current = false;
  };

  const handleSimulatedScan = () => {
    if (isProcessing) return;
    processScan(simulatedId);
  };

  const handleUseCameraToggle = async () => {
    if (!useCamera && !permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permission Denied', 'Camera permission diperlukan untuk scan QR Code');
        return;
      }
    }
    setUseCamera(!useCamera);
    setScanned(false);
    scanLock.current = false;
  };

  return (
    <>
      {/* Scanner Modal */}
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <Text style={styles.title}>Scan QR Code Visitor</Text>

            {/* Camera View atau Placeholder */}
            {useCamera && permission?.granted ? (
              <View style={styles.cameraContainer}>
                <CameraView
                  style={styles.camera}
                  facing="back"
                  onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                  barcodeScannerSettings={{
                    barcodeTypes: ['qr'],
                  }}
                >
                  <View style={styles.cameraOverlay}>
                    <Text style={styles.cameraText}>Arahkan ke QR Code</Text>
                  </View>
                </CameraView>
              </View>
            ) : (
              <View style={styles.scannerArea}>
                <View style={styles.scannerFrame}>
                  <View style={[styles.corner, styles.topLeft]} />
                  <View style={[styles.corner, styles.topRight]} />
                  <View style={[styles.corner, styles.bottomLeft]} />
                  <View style={[styles.corner, styles.bottomRight]} />
                  <Ionicons name="qr-code-outline" size={100} color="#10b981" />
                </View>
                <Text style={styles.scannerText}>
                  {useCamera ? 'Memuat kamera...' : 'Klik tombol untuk aktifkan kamera'}
                </Text>
                <Text style={styles.scannerSubtext}>ID Card akan otomatis tercetak</Text>
              </View>
            )}

            {/* Toggle Camera Button */}
            <TouchableOpacity
              style={[styles.cameraToggleButton, useCamera && styles.cameraToggleButtonActive]}
              onPress={handleUseCameraToggle}
              disabled={isProcessing}
            >
              <Ionicons
                name={useCamera ? "camera" : "camera-outline"}
                size={20}
                color="#fff"
              />
              <Text style={styles.cameraToggleText}>
                {useCamera ? 'Matikan Kamera' : 'Aktifkan Kamera'}
              </Text>
            </TouchableOpacity>

            {/* Simulasi untuk development
            <View style={styles.simulationContainer}>
              <Text style={styles.simulationLabel}>Mode Simulasi (Development)</Text>
              <View style={styles.pickerContainer}>
                <TouchableOpacity 
                  style={[styles.pickerButton, simulatedId === '1' && styles.pickerButtonActive]}
                  onPress={() => setSimulatedId('1')}
                  disabled={isProcessing}
                >
                  <Text style={[styles.pickerText, simulatedId === '1' && styles.pickerTextActive]}>
                    ID 1 - John Doe
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.pickerButton, simulatedId === '2' && styles.pickerButtonActive]}
                  onPress={() => setSimulatedId('2')}
                  disabled={isProcessing}
                >
                  <Text style={[styles.pickerText, simulatedId === '2' && styles.pickerTextActive]}>
                    ID 2 - Jane Smith
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity 
                style={[styles.simulateButton, isProcessing && styles.simulateButtonDisabled]}
                onPress={handleSimulatedScan}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Ionicons name="hourglass-outline" size={20} color="#fff" />
                    <Text style={styles.simulateButtonText}>Processing...</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="print-outline" size={20} color="#fff" />
                    <Text style={styles.simulateButtonText}>Scan & Print ID Card</Text>
                  </>
                )}
              </TouchableOpacity>
            </View> */}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              disabled={isProcessing}
            >
              <Text style={styles.closeButtonText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Preview & Print Modal - PURE REACT NATIVE! */}
      <Modal
        visible={showPreview}
        transparent={true}
        animationType="fade"
        onRequestClose={() => { }}
      >
        <View style={styles.previewOverlay}>
          <View style={styles.previewContainer}>
            {/* Header */}
            <View style={styles.previewHeader}>
              <View style={styles.headerIconContainer}>
                <Ionicons name="document-text" size={28} color="#10b981" />
              </View>
              <Text style={styles.previewTitle}>ID Card Preview</Text>
            </View>

            {/* Status Indicator */}
            <View style={styles.statusContainer}>
              {printStatus === 'generating' && (
                <>
                  <Ionicons name="refresh" size={20} color="#3B82F6" />
                  <Text style={styles.statusText}>Generating layout...</Text>
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

            {/* ID Card Preview - SCALED VERSION */}
            {cardData && (
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
                      <IDCardTemplate data={cardData} />
                    </View>
                  </View>
                </ScrollView>
              </View>
            )}

            {/* Footer Info */}
            <View style={styles.previewFooter}>
              <View style={styles.footerItem}>
                <Ionicons name="document-outline" size={16} color="#6B7280" />
                <Text style={styles.footerText}>Size: B4 (257x364mm)</Text>
              </View>
              <View style={styles.footerItem}>
                <Ionicons name="print-outline" size={16} color="#6B7280" />
                <Text style={styles.footerText}>Print Only</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  // Scanner Modal Styles
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1F2937',
  },
  cameraContainer: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 20,
  },
  scannerArea: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scannerFrame: {
    width: 250,
    height: 250,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#10b981',
  },
  topLeft: {
    top: 10,
    left: 10,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 10,
    right: 10,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 10,
    left: 10,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 10,
    right: 10,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  scannerText: {
    marginTop: 16,
    color: '#6B7280',
    textAlign: 'center',
    fontSize: 15,
  },
  scannerSubtext: {
    marginTop: 4,
    color: '#10b981',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
  },
  cameraToggleButton: {
    backgroundColor: '#3B82F6',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  cameraToggleButtonActive: {
    backgroundColor: '#EF4444',
  },
  cameraToggleText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  simulationContainer: {
    marginBottom: 16,
  },
  simulationLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  pickerContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  pickerButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  pickerButtonActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  pickerText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  pickerTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  simulateButton: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  simulateButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  simulateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
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