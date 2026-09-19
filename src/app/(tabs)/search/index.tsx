import { ScreenStub } from '@/components/screen-stub';

export default function SearchScreen() {
  return (
    <ScreenStub
      title="Search"
      description="Typeahead uses GET /api/search. The advanced search page is SSR-only on web and needs a JSON endpoint."
      webPath="/search"
    />
  );
}
