import { ScreenStub } from '@/components/screen-stub';
import { useLocalSearchParams } from 'expo-router';

export default function PostsByTagScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  return (
    <ScreenStub
      title={`Tag: ${name}`}
      description="GET /api/posts/tag/:name with post pagination params."
      webPath={`/posts/tag/${name}`}
    />
  );
}
