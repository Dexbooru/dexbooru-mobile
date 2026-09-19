import { ScreenStub } from '@/components/screen-stub';

export default function TagsIndexScreen() {
  return (
    <ScreenStub
      title="Tags"
      description="A–Z index via GET /api/tags/:letter?pageNumber=."
      webPath="/tags"
    />
  );
}
