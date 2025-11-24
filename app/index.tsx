// import { Redirect } from 'expo-router';
// import { useAuth } from '@/hooks/useAuth';

// export default function root() {
//   const { currentUser } = useAuth();

//   if (currentUser) {
//     return <Redirect href="/(tabs)/profile" />;
//   }

//   return <Redirect href="/auth" />;
// }
import { Redirect } from 'expo-router';

export default function Index() {
  // SKIP LOGIN - Langsung ke home untuk scan!
  return <Redirect href="/(tabs)" />;
}