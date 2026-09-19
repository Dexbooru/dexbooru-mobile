import { ScreenStub } from '@/components/screen-stub';
import { useLocalSearchParams } from 'expo-router';

export default function PublicProfileScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  return (
    <ScreenStub
      title={`@${username}`}
      description="GET /api/user/:username plus posts and collections nested APIs."
      webPath={`/profile/${username}`}
    />
  );
}
