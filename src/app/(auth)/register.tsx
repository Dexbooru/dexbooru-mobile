import { ScreenStub } from '@/components/screen-stub';

export default function RegisterScreen() {
  return (
    <ScreenStub
      title="Register"
      description="Account creation still uses the SvelteKit form action on /register. Mobile needs a JSON register endpoint or a documented form-action contract."
      webPath="/register"
    />
  );
}
