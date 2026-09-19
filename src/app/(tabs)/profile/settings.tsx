import { ScreenStub } from '@/components/screen-stub';

export default function SettingsScreen() {
  return (
    <ScreenStub
      title="Settings"
      description="Preferences, password, avatar, 2FA, and account deletion are SvelteKit form actions on /profile/settings."
      webPath="/profile/settings"
    />
  );
}
