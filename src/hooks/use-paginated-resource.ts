import { useInfiniteQuery, type QueryKey } from '@tanstack/react-query';

import { getNextPageParam } from '@/api/pagination';

export function usePaginatedResource<TItem>(options: {
  queryKey: QueryKey;
  fetchPage: (pageNumber: number) => Promise<TItem[]>;
  pageSize: number;
  enabled?: boolean;
}) {
  return useInfiniteQuery({
    queryKey: options.queryKey,
    enabled: options.enabled ?? true,
    initialPageParam: 0,
    queryFn: ({ pageParam }) => options.fetchPage(pageParam),
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      getNextPageParam(lastPage, lastPageParam, options.pageSize),
    retry: false,
  });
}
