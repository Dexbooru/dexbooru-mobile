import { ScreenStub } from '@/components/screen-stub';
import { useLocalSearchParams } from 'expo-router';

export default function PostsBySourceScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  return (
    <ScreenStub
      title={`Source: ${name}`}
      description="GET /api/posts/source/:name with post pagination params."
      webPath={`/posts/source/${name}`}
    />
  );
}
