import { ScreenStub } from '@/components/screen-stub';

export default function NotificationsScreen() {
  return (
    <ScreenStub
      title="Notifications"
      description="GET/PATCH /api/notifications (page is 1-based). Live updates use a WebSocket on the notifications service."
      webPath="/notifications"
    />
  );
}
