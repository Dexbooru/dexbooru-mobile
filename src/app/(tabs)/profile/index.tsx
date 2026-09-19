import { Link, router } from 'expo-router';
import { View } from 'react-native';

import { logout } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useAuthStore } from '@/stores/auth';

export default function ProfileIndexScreen() {
  const user = useAuthStore((state) => state.user);
  const clear = useAuthStore((state) => state.clear);

  async function onLogout() {
    await logout();
    clear();
    router.replace('/login');
  }

  return (
    <View className="bg-background flex-1 gap-3 p-6">
      <Text variant="h3">Profile</Text>
      {user ? (
        <>
          <Text>{user.username}</Text>
          <Link href="/profile/settings">
            <Text className="text-primary">Settings</Text>
          </Link>
          <Link href="/profile/notifications">
            <Text className="text-primary">Notifications</Text>
          </Link>
          <Link href="/profile/friends">
            <Text className="text-primary">Friends</Text>
          </Link>
          <Button variant="outline" onPress={() => void onLogout()}>
            <Text>Log out</Text>
          </Button>
        </>
      ) : (
        <Link href="/login" asChild>
          <Button>
            <Text>Sign in</Text>
          </Button>
        </Link>
      )}
    </View>
  );
}
