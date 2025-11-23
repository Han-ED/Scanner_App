import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useAuth } from '@/hooks/useAuth';
import { MOCK_QR_DATA } from '@/constants/MockData';
import * as Print from 'expo-print';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function ScannerModal({ visible, onClose }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [simulatedId, setSimulatedId] = useState('1');
  const { addScanHistory } = useAuth();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    processScan(data);
  };

  const processScan = async (qrData: string) => {
    const data = MOCK_QR_DATA[qrData];

    if (data) {
      const scanRecord = {
        ...data,
        timestamp: new Date().toLocaleString('id-ID'),
        scanId: Date.now(),
      };
      addScanHistory(scanRecord);
      onClose();

      setTimeout(() => autoPrint(scanRecord), 500);
    } else {
      Alert.alert("Error", "QR Code tidak valid");
      setScanned(false);
    }
  };

  const autoPrint = async (data: any) => {
    const html = `
      <html><body>
      <h2>DATA SCAN QR CODE</h2>
      <p><b>Waktu Scan:</b> ${data.timestamp}</p>
      <p><b>Nama:</b> ${data.name}</p>
      <p><b>Company:</b> ${data.company}</p>
      <p><b>Posisi:</b> ${data.position}</p>
      <p><b>Alamat:</b> ${data.address}</p>
      <p><b>Telepon:</b> ${data.phone}</p>
      <p><b>Email:</b> ${data.email}</p>
      </body></html>
    `;

    try {
      await Print.printAsync({ html });
    } catch (error) {
      Alert.alert("Info", "Data berhasil disimpan tanpa print otomatis.");
    }
  };

  const handleSimulatedScan = () => {
    processScan(simulatedId);
  };

  if (!permission?.granted) {
    return null;
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Scan QR Code</Text>

          {/* Camera Scanner */}
          <View style={styles.cameraWrapper}>
            <CameraView
              style={styles.camera}
              facing="back"
              barcodeScannerSettings={{
                barcodeTypes: ["qr"],
              }}
              onBarcodeScanned={handleBarCodeScanned}
            />
          </View>

          {/* Simulation Mode */}
          <View style={styles.simulationContainer}>
            <Text style={styles.simulationLabel}>Simulasi (Development)</Text>
            <View style={styles.pickerContainer}>
              <TouchableOpacity
                style={[styles.pickerButton, simulatedId === '1' && styles.pickerButtonActive]}
                onPress={() => setSimulatedId('1')}
              >
                <Text style={[styles.pickerText, simulatedId === '1' && styles.pickerTextActive]}>
                  ID 1 - John Doe
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.pickerButton, simulatedId === '2' && styles.pickerButtonActive]}
                onPress={() => setSimulatedId('2')}
              >
                <Text style={[styles.pickerText, simulatedId === '2' && styles.pickerTextActive]}>
                  ID 2 - Jane Smith
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.simulateButton} onPress={handleSimulatedScan}>
              <Text style={styles.simulateButtonText}>Scan Manual</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Batal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  cameraWrapper: {
    height: 300,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  simulationContainer: {
    marginTop: 16,
    marginBottom: 20,
  },
  simulationLabel: {
    textAlign: "center",
    fontSize: 13,
    marginBottom: 12,
    color: "#6B7280",
  },
  pickerContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  pickerButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#E5E7EB",
  },
  pickerButtonActive: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  pickerText: {
    textAlign: "center",
    color: "#6B7280",
  },
  pickerTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  simulateButton: {
    backgroundColor: "#3B82F6",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  simulateButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  closeButton: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#6B7280",
    fontWeight: "600",
  },
});