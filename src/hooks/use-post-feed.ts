import { useEffect, useMemo, useState } from 'react';

import { getPosts } from '@/api/posts';
import { queryKeys } from '@/api/query-keys';
import { APPLICATION_CONFIGURATION_DEFAULTS } from '@/types/application-configuration';
import { usePaginatedResource } from '@/hooks/use-paginated-resource';
import { GUEST_USER_PREFERENCES, partitionPosts } from '@/lib/posts';
import { useAuthStore } from '@/stores/auth';
import { useConfigStore } from '@/stores/config';
import { usePreferencesStore } from '@/stores/preferences';
import { useUiStore } from '@/stores/ui';
import type { TPostCategory, TPostOrderByColumn } from '@/types/posts';

export function usePostFeed(category: TPostCategory) {
  const user = useAuthStore((state) => state.user);
  const preferences = usePreferencesStore((state) => state.preferences);
  const pageSize =
    useConfigStore((state) => state.configuration?.maximumPostsPerPage) ??
    APPLICATION_CONFIGURATION_DEFAULTS.maximumPostsPerPage;
  const setHiddenPosts = useUiStore((state) => state.setHiddenPosts);
  const setNsfwPosts = useUiStore((state) => state.setNsfwPosts);

  const [orderBy, setOrderBy] = useState<TPostOrderByColumn>('createdAt');
  const [ascending, setAscending] = useState(false);

  const enabled = category === 'general' || user != null;
  const resolvedPreferences = preferences ?? GUEST_USER_PREFERENCES;

  const query = usePaginatedResource({
    queryKey: queryKeys.posts.list({ category, orderBy, ascending }),
    fetchPage: async (pageNumber) => {
      const data = await getPosts({ pageNumber, orderBy, ascending, category });
      return data.posts ?? [];
    },
    pageSize,
    enabled,
  });

  const rawPosts = useMemo(
    () => (query.data?.pages ?? []).flatMap((page) => (Array.isArray(page) ? page : [])),
    [query.data],
  );
  const partitioned = useMemo(
    () => partitionPosts(rawPosts, resolvedPreferences),
    [rawPosts, resolvedPreferences],
  );

  useEffect(() => {
    if (!enabled) return;
    setHiddenPosts({
      nsfwPosts: partitioned.nsfwPosts,
      blacklistedPosts: partitioned.blacklistedPosts,
    });
    setNsfwPosts(partitioned.nsfwPosts);
  }, [enabled, partitioned, setHiddenPosts, setNsfwPosts]);

  function setSort(nextOrderBy: TPostOrderByColumn, nextAscending: boolean) {
    setOrderBy(nextOrderBy);
    setAscending(nextAscending);
  }

  return {
    ...query,
    posts: partitioned.displayPosts,
    nsfwPosts: partitioned.nsfwPosts,
    blacklistedPosts: partitioned.blacklistedPosts,
    orderBy,
    ascending,
    setSort,
    preferences: resolvedPreferences,
    enabled,
    user,
    pageSize,
  };
}
