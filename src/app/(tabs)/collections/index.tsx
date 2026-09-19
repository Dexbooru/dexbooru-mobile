import { ScreenStub } from '@/components/screen-stub';

export default function CollectionsIndexScreen() {
  return (
    <ScreenStub
      title="Collections"
      description="List/create collections. Create is POST /api/collections; user lists are GET /api/user/:username/collections."
      webPath="/collections"
    />
  );
}
