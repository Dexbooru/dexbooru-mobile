import { ScreenStub } from '@/components/screen-stub';

export default function ForgotPasswordScreen() {
  return (
    <ScreenStub
      title="Forgot password"
      description="Password recovery is form-action / SSR only on the web app."
      webPath="/forgot-password"
    />
  );
}
