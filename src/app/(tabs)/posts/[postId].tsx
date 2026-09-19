import { ScreenStub } from '@/components/screen-stub';
import { useLocalSearchParams } from 'expo-router';

export default function PostDetailScreen() {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  return (
    <ScreenStub
      title={`Post ${postId}`}
      description="Detail, likes (PUT /api/post/:id/like), tags, and comments use existing JSON APIs."
      webPath={`/posts/${postId}`}
    />
  );
}
