import { ScreenStub } from '@/components/screen-stub';
import { useLocalSearchParams } from 'expo-router';

export default function CommentThreadScreen() {
  const { commentId } = useLocalSearchParams<{ commentId: string }>();
  return (
    <ScreenStub
      title={`Comment ${commentId}`}
      description="GET /api/comments/:id for a comment chain. Global /comments feeds are SSR-only."
      webPath={`/comments/${commentId}`}
    />
  );
}
