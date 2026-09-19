import { ScreenStub } from '@/components/screen-stub';

export default function UploadScreen() {
  return (
    <ScreenStub
      title="Upload"
      description="Multipart POST /api/posts plus SSE /api/events/upload-status/:uploadId and duplicate check POST /api/posts/duplicates."
      webPath="/posts/upload"
    />
  );
}
