import { Link } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useAuthStore } from '@/stores/auth';

export default function PostsIndexScreen() {
  const user = useAuthStore((state) => state.user);

  return (
    <View className="bg-background flex-1 gap-3 p-6">
      <Text variant="h3">Posts</Text>
      <Text className="text-muted-foreground">
        Grid, sort, category, and NSFW/blacklist filtering will land in the posts browse issue. API:
        GET /api/posts with pageNumber, orderBy, ascending, category.
      </Text>
      {user ? (
        <Text>Signed in as {user.username}</Text>
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
