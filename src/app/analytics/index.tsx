import { ScreenStub } from '@/components/screen-stub';

export default function AnalyticsScreen() {
  return (
    <ScreenStub
      title="Analytics"
      description="Instance analytics are SSR-only on web. Mobile needs a JSON analytics endpoint."
      webPath="/analytics"
    />
  );
}
