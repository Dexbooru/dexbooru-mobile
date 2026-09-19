import { ScreenStub } from '@/components/screen-stub';

export default function ArtistsIndexScreen() {
  return (
    <ScreenStub
      title="Artists"
      description="A–Z index via GET /api/artists/:letter?pageNumber=."
      webPath="/artists"
    />
  );
}
