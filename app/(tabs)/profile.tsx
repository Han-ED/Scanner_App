import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';

export default function ProfileScreen() {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  position: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  qrSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  qrTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  qrWrapper: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  qrSubtext: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
  detailsSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  detailBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  detailIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailContent: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  value: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
  },
});