import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { Link } from 'expo-router';
import { profileStyles as styles } from '@/styles/profileStyles';

export default function ProfileScreen() {
  const { currentUser } = useAuth();

  // Jika belum login, tampilkan prompt untuk login
  if (!currentUser) {
    return (
      <View style={styles.container}>
        <View style={styles.noUserContainer}>
          <View style={styles.noUserIcon}>
            <Ionicons name="person-outline" size={64} color="#9CA3AF" />
          </View>
          <Text style={styles.noUserTitle}>Profile Tidak Tersedia</Text>
          <Text style={styles.noUserText}>
            Login untuk melihat profile Anda dan mendapatkan QR Code personal
          </Text>
          <Link href="/auth" asChild>
            <TouchableOpacity style={styles.loginButton}>
              <Ionicons name="log-in-outline" size={20} color="#fff" />
              <Text style={styles.loginButtonText}>Login / Register</Text>
            </TouchableOpacity>
          </Link>
          <Text style={styles.noUserHint}>
            Anda tetap bisa scan QR Code tanpa login
          </Text>
        </View>
      </View>
    );
  }

  const profileData = [
    { label: 'Company', value: currentUser.company, icon: 'business-outline' },
    { label: 'Department', value: currentUser.department, icon: 'file-tray-full-outline' },
    { label: 'Email', value: currentUser.email, icon: 'mail-outline' },
    { label: 'Telepon', value: currentUser.phone, icon: 'call-outline' },
    { label: 'Alamat', value: currentUser.address, icon: 'location-outline' },
    { label: 'User ID', value: currentUser.id, icon: 'key-outline' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={48} color="#fff" />
            </View>
            <Text style={styles.name}>{currentUser.name}</Text>
            <Text style={styles.position}>{currentUser.position}</Text>
          </View>

          {/* QR Code Section */}
          <View style={styles.qrSection}>
            <Text style={styles.qrTitle}>QR Code Saya</Text>
            <View style={styles.qrWrapper}>
              <QRCode
                value={currentUser.id}
                size={160}
                backgroundColor="white"
                color="black"
              />
            </View>
            <Text style={styles.qrSubtext}>
              Scan untuk melihat data lengkap saya
            </Text>
          </View>

          {/* Profile Details */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Informasi Detail</Text>
            {profileData.map((item, index) => (
              <View 
                key={index} 
                style={[
                  styles.detailRow,
                  index !== profileData.length - 1 && styles.detailBorder
                ]}
              >
                <View style={styles.detailIconContainer}>
                  <Ionicons name={item.icon as any} size={20} color="#3B82F6" />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.label}>{item.label}</Text>
                  <Text style={styles.value}>{item.value}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}