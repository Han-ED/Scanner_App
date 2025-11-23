import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AuthScreen() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
    position: '',
    department: '',
  });

  const handleLogin = () => {
    if (!loginData.username || !loginData.password) {
      alert('Username dan password harus diisi');
      return;
    }

    const success = login(loginData.username, loginData.password);
    if (success) {
      router.replace('/(tabs)');
    } else {
      alert('Username atau password salah!');
    }
  };

  const handleRegister = () => {
    // Validasi
    if (!registerData.username || !registerData.password || !registerData.name) {
      alert('Username, password, dan nama harus diisi');
      return;
    }

    const success = register(registerData);
    if (success) {
      alert('Registrasi berhasil! Silakan login.');
      setMode('login');
      setRegisterData({
        username: '',
        password: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        company: '',
        position: '',
        department: '',
      });
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="qr-code" size={48} color="#3B82F6" />
          </View>
          <Text style={styles.title}>QR Scanner</Text>
          <Text style={styles.subtitle}>Scan & Manage QR Codes</Text>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, mode === 'login' && styles.tabActive]}
            onPress={() => setMode('login')}
          >
            <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, mode === 'register' && styles.tabActive]}
            onPress={() => setMode('register')}
          >
            <Text style={[styles.tabText, mode === 'register' && styles.tabTextActive]}>
              Register
            </Text>
          </TouchableOpacity>
        </View>

        {mode === 'login' ? (
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                placeholder="Masukkan username"
                value={loginData.username}
                onChangeText={(text) => setLoginData({ ...loginData, username: text })}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Masukkan password"
                value={loginData.password}
                onChangeText={(text) => setLoginData({ ...loginData, password: text })}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <View style={styles.demoInfo}>
              <Text style={styles.demoText}>Demo Account:</Text>
              <Text style={styles.demoCredentials}>Username: admin</Text>
              <Text style={styles.demoCredentials}>Password: admin123</Text>
            </View>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <ScrollView 
              style={styles.registerScroll}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Username *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  value={registerData.username}
                  onChangeText={(text) => setRegisterData({ ...registerData, username: text })}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={registerData.password}
                  onChangeText={(text) => setRegisterData({ ...registerData, password: text })}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nama Lengkap *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nama lengkap"
                  value={registerData.name}
                  onChangeText={(text) => setRegisterData({ ...registerData, name: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="email@example.com"
                  value={registerData.email}
                  onChangeText={(text) => setRegisterData({ ...registerData, email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Telepon</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+62 812-xxxx-xxxx"
                  value={registerData.phone}
                  onChangeText={(text) => setRegisterData({ ...registerData, phone: text })}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Alamat</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Alamat lengkap"
                  value={registerData.address}
                  onChangeText={(text) => setRegisterData({ ...registerData, address: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Company</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nama perusahaan"
                  value={registerData.company}
                  onChangeText={(text) => setRegisterData({ ...registerData, company: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Posisi</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Jabatan"
                  value={registerData.position}
                  onChangeText={(text) => setRegisterData({ ...registerData, position: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Department</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Departemen"
                  value={registerData.department}
                  onChangeText={(text) => setRegisterData({ ...registerData, department: text })}
                />
              </View>

              <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 40,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#3B82F6',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#fff',
  },
  formContainer: {
    flex: 1,
  },
  registerScroll: {
    maxHeight: 400,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  demoInfo: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  demoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  demoCredentials: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
});