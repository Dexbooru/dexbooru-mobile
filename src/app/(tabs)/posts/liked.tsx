import { ScreenStub } from '@/components/screen-stub';

export default function LikedPostsScreen() {
  return (
    <ScreenStub
      title="Liked posts"
      description="Same list API as the grid with category=liked. Requires session cookie."
      webPath="/posts/liked"
    />
  );
}
