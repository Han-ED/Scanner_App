import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';

// ========================================
// INTERFACE
// ========================================
interface IDCardProps {
  data: {
    id: string;
    name: string;
    company: string;
    position: string;
    phone: string;
    email: string;
    address: string;
    timestamp: string;
  };
}

// ========================================
// BACKGROUND IMAGE PATH
// Ubah path ini untuk ganti background!
// ========================================
const BACKGROUND_IMAGE = require('@/assets/images/id-card-bg.png');
// Alternatif: gunakan URL
// const BACKGROUND_IMAGE = { uri: 'https://your-url.com/background.png' };

export default function IDCardTemplate({ data }: IDCardProps) {
  // ========================================
  // RENDER
  // ========================================
  return (
    <View style={styles.card}>
      {/* Background Image - Ganti di assets/images/id-card-bg.png */}
      <ImageBackground 
        source={BACKGROUND_IMAGE}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Overlay untuk readability */}
        <View style={styles.overlay} />
        
        {/* Content Container */}
        <View style={styles.content}>
          
          {/* Header Section */}
          <View style={styles.header}>
            {/* Company Logo/Icon */}
            <View style={styles.companyLogo}>
              <Text style={styles.logoText}>🏢</Text>
            </View>
            
            {/* Company Name */}
            <Text style={styles.companyName}>{data.company}</Text>
            <View style={styles.divider} />
          </View>

          {/* QR Code Section */}
          <View style={styles.qrSection}>
            <View style={styles.qrContainer}>
              <QRCode
                value={data.id}
                size={180}
                backgroundColor="white"
                color="black"
              />
            </View>
          </View>

          {/* Visitor Info Section */}
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>INFORMASI PENGUNJUNG</Text>
            
            {/* Info Rows */}
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="person" size={18} color="#10b981" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Nama</Text>
                <Text style={styles.infoValue}>{data.name}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="briefcase" size={18} color="#10b981" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Posisi</Text>
                <Text style={styles.infoValue}>{data.position}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="call" size={18} color="#10b981" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Telepon</Text>
                <Text style={styles.infoValue}>{data.phone}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="mail" size={18} color="#10b981" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{data.email}</Text>
              </View>
            </View>

            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="location" size={18} color="#10b981" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Alamat</Text>
                <Text style={styles.infoValue}>{data.address}</Text>
              </View>
            </View>
          </View>

          {/* Footer Section */}
          <View style={styles.footer}>
            <View style={styles.footerRow}>
              <Ionicons name="time" size={14} color="#9CA3AF" />
              <Text style={styles.footerText}>
                Waktu Scan: {data.timestamp}
              </Text>
            </View>
            <Text style={styles.footerBadge}>VISITOR PASS</Text>
          </View>

        </View>
      </ImageBackground>
    </View>
  );
}

// ========================================
// STYLES (B5 Size)
// ========================================
const styles = StyleSheet.create({
  card: {
    width: 515,   // B5 width in pixels
    height: 728,  // B5 height in pixels
    backgroundColor: '#FFFFFF',
  },
  
  // Background Image
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  
  // Overlay untuk readability text
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // White overlay 85% opacity
  },
  
  // Content
  content: {
    flex: 1,
    padding: 32,
    justifyContent: 'space-between',
  },
  
  // Header
  header: {
    alignItems: 'center',
  },
  companyLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoText: {
    fontSize: 40,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textTransform: 'uppercase',
    letterSpacing: 2,
    textAlign: 'center',
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: '#10b981',
    marginTop: 12,
    borderRadius: 2,
  },
  
  // QR Code
  qrSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  qrContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#10b981',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  // Info Section
  infoSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  infoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  
  // Footer
  footer: {
    alignItems: 'center',
    gap: 8,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  footerBadge: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10b981',
    letterSpacing: 2,
    backgroundColor: 'rgba(236, 253, 245, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
});