import { ScreenStub } from '@/components/screen-stub';
import { useLocalSearchParams } from 'expo-router';

export default function CollectionDetailScreen() {
  const { collectionId } = useLocalSearchParams<{ collectionId: string }>();
  return (
    <ScreenStub
      title={`Collection ${collectionId}`}
      description="GET/PATCH/DELETE /api/collection/:id."
      webPath={`/collections/${collectionId}`}
    />
  );
}
