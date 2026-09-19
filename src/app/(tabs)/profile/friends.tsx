import { ScreenStub } from '@/components/screen-stub';

export default function FriendsScreen() {
  return (
    <ScreenStub
      title="Friends"
      description="Mutations exist (friend-requests POST/DELETE, friends DELETE). The friends list is SSR-only on /friends."
      webPath="/friends"
    />
  );
}
