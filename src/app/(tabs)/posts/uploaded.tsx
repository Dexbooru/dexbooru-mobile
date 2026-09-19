import { ScreenStub } from '@/components/screen-stub';

export default function UploadedPostsScreen() {
  return (
    <ScreenStub
      title="Uploaded posts"
      description="GET /api/posts?category=uploaded or GET /api/user/:username/posts."
      webPath="/posts/uploaded"
    />
  );
}
