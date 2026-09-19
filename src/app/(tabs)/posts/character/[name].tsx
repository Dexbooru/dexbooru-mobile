import { ScreenStub } from '@/components/screen-stub';
import { useLocalSearchParams } from 'expo-router';

export default function PostsByCharacterScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  return (
    <ScreenStub
      title={`Character: ${name}`}
      description="GET /api/posts/character/:name with post pagination params."
      webPath={`/posts/character/${name}`}
    />
  );
}
