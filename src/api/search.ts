import { apiJson, buildApiUrl } from '@/api/client';
import type { TAppSearchResult, TSearchSection } from '@/types/search';

export async function getGlobalSearchResults(
  query: string,
  searchSection: TSearchSection = 'all',
  limit?: number,
): Promise<TAppSearchResult> {
  return apiJson<TAppSearchResult>(
    buildApiUrl('/api/search', {
      query,
      searchSection,
      limit,
    }),
  );
}
