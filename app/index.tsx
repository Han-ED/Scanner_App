import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function root() {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Redirect href="/(tabs)/profile" />;
  }

  return <Redirect href="/auth" />;
}