import { Tabs, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

export default function TabLayout() {
  // Detect current route segment
  const segments = useSegments();
  const current = segments[segments.length - 1];

  // Dynamic title per page
  const getPageTitle = (routeName: string) => {
    switch (routeName) {
      case 'index':
        return 'Home';
      case 'profile':
        return 'Profile';
      case 'explore':
        return 'History';
      default:
        return 'QR Scanner';
    }
  };

  return (
    <Tabs
      screenOptions={({ route }) => ({
        // HEADER BIRU PREMIUM
        headerStyle: {
          backgroundColor: '#3B82F6',
          height: 100,
        },
        headerShadowVisible: false,

        headerTitle: () => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              paddingLeft: 5,
            }}
          >
            <Ionicons
              name="qr-code-outline"
              size={26}
              color="white"
              style={{ marginTop: 2 }}
            />
            <Text
              style={{
                fontSize: 20,
                fontWeight: '700',
                color: 'white',
              }}
            >
              QR Scanner | {getPageTitle(route.name)}
            </Text>
          </View>
        ),

        headerTitleAlign: 'left',

        // TAB BAR MODERN
        tabBarStyle: {
          backgroundColor: '#fff',
          height: 68,
          paddingBottom: 10,
          paddingTop: 10,
          borderTopWidth: 0,

          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowOffset: { width: 0, height: -3 },
          shadowRadius: 8,
          elevation: 8,
        },

        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#9CA3AF',
      })}

    >
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}