import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MOCK_QR_DATA } from '@/constants/MockData';
import * as Print from 'expo-print';
import { captureRef } from 'react-native-view-shot';
import IDCardTemplate from '@/components/IDCardTemplate';
import { homeStyles as styles } from '@/styles/homeStyles';

export default function HomeScreen() {
  // ========================================
  // HOOKS & STATE
  // ========================================
  const { currentUser, scanHistory, addScanHistory } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraActive, setIsCameraActive] = useState(true); // Default: Camera ON
  const [scanned, setScanned] = useState(false); // Prevent multiple scans
  const [scanSuccess, setScanSuccess] = useState(false); // Show success feedback
  const [countdown, setCountdown] = useState(3); // Countdown 3 seconds
  const [cardData, setCardData] = useState<any>(null); // Data untuk print
  const [isPrinting, setIsPrinting] = useState(false); // Status printing
  const cardRef = useRef<View>(null); // Reference untuk capture card

  // === Prevent Spam Scan ===
  const scanLockRef = useRef(false);

  // ========================================
  // REQUEST CAMERA PERMISSION ON MOUNT
  // ========================================
  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  // ========================================
  // COUNTDOWN TIMER (3 seconds)
  // ========================================
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    // Jika scan success, mulai countdown
    if (scanSuccess && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }

    // Jika countdown habis (0), print!
    if (scanSuccess && countdown === 0) {
      handlePrint();
    }

    return () => clearTimeout(timer);
  }, [scanSuccess, countdown]);

  // ========================================
  // HANDLE BARCODE SCANNED
  // ========================================
  const handleBarCodeScanned = ({ data }: { data: string }) => {
    // ====== DOUBLE SCAN LOCK (5 DETIK) ======
    if (scanLockRef.current) {
      console.log("SCAN DITOLAK — masih dalam cooldown");
      return;
    }

    // Kunci langsung (tanpa re-render)
    scanLockRef.current = true;
    console.log("SCAN MASUK:", data);

    // Buka kembali dalam 5 detik
    setTimeout(() => {
      scanLockRef.current = false;
      console.log("SCAN LOCK DIBUKA");
    }, 5000);

    // ====== PROSES DATA QR ======
    const qrData = MOCK_QR_DATA[data];

    if (!qrData) {
      console.log("QR INVALID:", data);
      Alert.alert("QR Code tidak dikenali");
      return;
    }

    const scanRecord = {
      ...qrData,
      timestamp: new Date().toLocaleString("id-ID"),
      scanId: Date.now(),
    };

    addScanHistory(scanRecord);
    setCardData(scanRecord);

    // Tampilkan feedback + countdown print
    setScanSuccess(true);
    setCountdown(3);

    console.log("SCAN SUCCESS:", scanRecord);
  };

  // ========================================
  // HANDLE PRINT (Auto after 3 seconds)
  // ========================================
  const handlePrint = async () => {
    if (!cardData || !cardRef.current) {
      Alert.alert("Error", "Data tidak tersedia");
      resetScanState();
      scanLockRef.current = false;
      return;
    }

    setIsPrinting(true);
    console.log("PRINT START");

    try {
      // Delay sedikit agar layout kelar render
      await new Promise(resolve => setTimeout(resolve, 400));

      const uri = await captureRef(cardRef, {
        format: "png",
        quality: 1,
      });

      console.log("CAPTURE URI:", uri);

      await Print.printAsync({ uri });

      console.log("PRINT SUCCESS");
      Alert.alert("Berhasil", `ID Card untuk ${cardData.name} dicetak`);

    } catch (err: any) {
      console.log("PRINT ERROR:", err);

      Alert.alert(
        "Gagal Print",
        err?.message || "Printer tidak terdeteksi atau proses gagal"
      );

      // 🔓 buka kunci scan lagi kalau error
      scanLockRef.current = false;

    } finally {
      resetScanState();
    }
  };

  // ========================================
  // RESET SCAN STATE
  // ========================================
  const resetScanState = () => {
    setScanned(false);
    setScanSuccess(false);
    setCountdown(3);
    setCardData(null);
    setIsPrinting(false);

    // Kunci scan dibuka
    scanLockRef.current = false;
    console.log("RESET STATE — LOCK DIBUKA");
  };

  // ========================================
  // TOGGLE CAMERA ON/OFF
  // ========================================
  const toggleCamera = () => {
    setIsCameraActive(!isCameraActive);
    // Reset scan state jika camera dimatikan
    if (isCameraActive) {
      resetScanState();
    }
  };

  // ========================================
  // RENDER
  // ========================================
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ========== CAMERA SCANNER CARD ========== */}
        <View style={styles.scannerCard}>
          {/* Camera Header */}
          <View style={styles.scannerHeader}>
            <View style={styles.scannerTitleContainer}>
              <Ionicons name="qr-code-outline" size={28} color="#10b981" />
              <Text style={styles.scannerTitle}>QR Code Scanner</Text>
            </View>

            {/* Toggle Camera Button */}
            <TouchableOpacity
              style={[
                styles.toggleButton,
                !isCameraActive && styles.toggleButtonOff
              ]}
              onPress={toggleCamera}
              disabled={isPrinting}
            >
              <Ionicons name={isCameraActive ? "camera" : "close"} />
            </TouchableOpacity>
          </View>

          {/* Camera View */}
          {isCameraActive && permission?.granted ? (
            <View style={styles.cameraContainer}>
              <CameraView
                style={styles.camera}
                facing="back"
                onBarcodeScanned={scanLockRef.current ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                  barcodeTypes: ['qr'],
                }}
              >
                {/* Camera Overlay */}
                <View style={styles.cameraOverlay}>
                  {/* Scan Frame */}
                  <View style={styles.scanFrame}>
                    <View style={[styles.corner, styles.topLeft]} />
                    <View style={[styles.corner, styles.topRight]} />
                    <View style={[styles.corner, styles.bottomLeft]} />
                    <View style={[styles.corner, styles.bottomRight]} />

                    {/* Center Icon */}
                    {!scanSuccess && (
                      <Ionicons name="scan" size={80} color="rgba(255,255,255,0.3)" />
                    )}

                    {/* Success Checkmark */}
                    {scanSuccess && (
                      <View style={styles.successContainer}>
                        <Ionicons name="checkmark-circle" size={80} color="#10b981" />
                      </View>
                    )}
                  </View>

                  {/* Status Text */}
                  {!scanSuccess ? (
                    <Text style={styles.cameraText}>
                      Arahkan kamera ke QR Code
                    </Text>
                  ) : (
                    <View style={styles.countdownContainer}>
                      <Text style={styles.countdownText}>
                        Scan Berhasil! ✅
                      </Text>
                      <Text style={styles.countdownNumber}>
                        Print dalam {countdown} detik...
                      </Text>
                    </View>
                  )}
                </View>
              </CameraView>
            </View>
          ) : (
            // Camera Off State
            <View style={styles.cameraOff}>
              <Ionicons name="camera-outline" />
              <Text style={styles.cameraOffText}>
                {!permission?.granted
                  ? 'Izin kamera diperlukan'
                  : 'Kamera dimatikan'}
              </Text>
              {!permission?.granted && (
                <TouchableOpacity
                  style={styles.permissionButton}
                  onPress={requestPermission}
                >
                  <Text style={styles.permissionButtonText}>
                    Izinkan Akses Kamera
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* ========== HOME TITLE ========== */}
        <View style={styles.homeHeader}>
          <Text style={styles.homeTitle}>Home</Text>
          <Text style={styles.homeSubtitle}>
            Scan QR untuk membuat ID Card visitor
          </Text>
        </View>

        {/* ========== STATS CARD ========== */}
        <View style={styles.statsCard}>
          <View style={styles.statsIconContainer}>
            <Ionicons name="people" size={32} color="#10b981" />
          </View>
          <View style={styles.statsContent}>
            <Text style={styles.statsNumber}>{scanHistory.length}</Text>
            <Text style={styles.statsLabel}>Total Visitor Hari Ini</Text>
          </View>
        </View>

        {/* ========== RECENT SCANS ========== */}
        <View style={styles.recentCard}>
          <Text style={styles.recentTitle}>Recent Scans</Text>
          {scanHistory.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>Belum ada scan hari ini</Text>
            </View>
          ) : (
            scanHistory.slice(0, 3).map((scan) => (
              <View key={scan.scanId} style={styles.scanItem}>
                <View style={styles.scanInfo}>
                  <Text style={styles.scanName}>{scan.name}</Text>
                  <Text style={styles.scanTime}>{scan.timestamp}</Text>
                </View>
                <View style={styles.scanQR}>
                  <Ionicons name="qr-code" size={40} color="#10b981" />
                </View>
              </View>
            ))
          )}
        </View>

      </ScrollView>

      {/* ========== HIDDEN ID CARD FOR PRINTING ========== */}
      {cardData && (
        <View style={styles.hiddenCard}>
          <View ref={cardRef} collapsable={false}>
            <IDCardTemplate data={cardData} />
          </View>
        </View>
      )}
    </View>
  );
}