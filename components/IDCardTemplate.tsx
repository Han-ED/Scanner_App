import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import Svg, { Path, Defs, LinearGradient, Stop, Ellipse } from 'react-native-svg';

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

export default function IDCardTemplate({ data }: IDCardProps) {
  const cardWidth = 757; // B4 width in pixels (257mm at 72dpi)
  const cardHeight = 1069; // B4 height in pixels (364mm at 72dpi)

  return (
    <View style={[styles.card, { width: cardWidth, height: cardHeight }]}>
      {/* Wave Background Top */}
      <View style={styles.waveTopContainer}>
        <Svg width={cardWidth} height={200} viewBox={`0 0 ${cardWidth} 200`}>
          <Defs>
            <LinearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#059669" stopOpacity="1" />
              <Stop offset="50%" stopColor="#10b981" stopOpacity="1" />
              <Stop offset="100%" stopColor="#6ee7b7" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Ellipse
            cx={cardWidth / 2}
            cy={0}
            rx={cardWidth * 0.6}
            ry={180}
            fill="url(#grad1)"
          />
        </Svg>
        <View style={styles.waveTopOutline} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Company Logo */}
        <View style={styles.companyLogo}>
          <Text style={styles.logoText}>🏢</Text>
        </View>

        {/* Company Name */}
        <Text style={styles.companyName}>{data.company}</Text>
        <View style={styles.divider} />

        {/* QR Code */}
        <View style={styles.qrContainer}>
          <QRCode
            value={data.id}
            size={200}
            backgroundColor="white"
            color="black"
          />
        </View>

        {/* Visitor Info */}
        <View style={styles.visitorInfo}>
          <Text style={styles.infoTitle}>INFORMASI PENGUNJUNG</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="person" size={20} color="#10b981" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Nama</Text>
              <Text style={styles.infoValue}>{data.name}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="briefcase" size={20} color="#10b981" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Posisi</Text>
              <Text style={styles.infoValue}>{data.position}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="call" size={20} color="#10b981" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Telepon</Text>
              <Text style={styles.infoValue}>{data.phone}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="mail" size={20} color="#10b981" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{data.email}</Text>
            </View>
          </View>

          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="location" size={20} color="#10b981" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Alamat</Text>
              <Text style={styles.infoValue}>{data.address}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Scan Time */}
      <View style={styles.scanTimeContainer}>
        <Ionicons name="time" size={16} color="#6B7280" />
        <Text style={styles.scanTime}>Waktu Scan: {data.timestamp}</Text>
      </View>

      {/* Footer Text */}
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>VISITOR PASS</Text>
      </View>

      {/* Wave Background Bottom */}
      <View style={styles.waveBottomContainer}>
        <Svg width={cardWidth} height={220} viewBox={`0 0 ${cardWidth} 220`} style={styles.waveBottomSvg}>
          {/* Layer 3 - Lightest */}
          <Ellipse
            cx={cardWidth / 2}
            cy={220}
            rx={cardWidth * 0.75}
            ry={90}
            fill="#6ee7b7"
            opacity={0.5}
          />
          {/* Layer 2 - Medium */}
          <Ellipse
            cx={cardWidth / 2}
            cy={220}
            rx={cardWidth * 0.7}
            ry={100}
            fill="#10b981"
            opacity={0.7}
          />
          {/* Layer 1 - Darkest */}
          <Ellipse
            cx={cardWidth / 2}
            cy={220}
            rx={cardWidth * 0.65}
            ry={120}
            fill="#059669"
          />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  waveTopContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  waveTopOutline: {
    position: 'absolute',
    top: 165,
    left: 0,
    right: 0,
    height: 80,
    borderTopWidth: 2,
    borderTopColor: '#059669',
    borderTopLeftRadius: 9999,
    borderTopRightRadius: 9999,
  },
  content: {
    position: 'relative',
    zIndex: 10,
    paddingTop: 240,
    paddingBottom: 240,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  companyLogo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  logoText: {
    fontSize: 60,
  },
  companyName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 3,
    textAlign: 'center',
  },
  divider: {
    width: 100,
    height: 4,
    backgroundColor: '#059669',
    marginVertical: 24,
    borderRadius: 2,
  },
  qrContainer: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#059669',
    marginVertical: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
  visitorInfo: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 32,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 24,
    textTransform: 'uppercase',
    letterSpacing: 2,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 16,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 17,
    color: '#1F2937',
    fontWeight: '600',
  },
  scanTimeContainer: {
    position: 'absolute',
    bottom: 260,
    left: 0,
    right: 0,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  scanTime: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    zIndex: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  waveBottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 220,
    zIndex: 1,
  },
  waveBottomSvg: {
    position: 'absolute',
    bottom: 0,
  },
});