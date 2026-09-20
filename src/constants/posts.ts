import type { TPostOrderByColumn } from '@/types/posts';

export type TPostSortOption = {
  label: string;
  orderBy: TPostOrderByColumn;
  ascending: boolean;
};

export const POST_SORT_OPTIONS: TPostSortOption[] = [
  { label: 'Most recent', orderBy: 'createdAt', ascending: false },
  { label: 'Least recent', orderBy: 'createdAt', ascending: true },
  { label: 'Last updated at', orderBy: 'updatedAt', ascending: false },
  { label: 'First updated at', orderBy: 'updatedAt', ascending: true },
  { label: 'Most liked', orderBy: 'likes', ascending: false },
  { label: 'Least liked', orderBy: 'likes', ascending: true },
  { label: 'Most viewed', orderBy: 'views', ascending: false },
  { label: 'Least viewed', orderBy: 'views', ascending: true },
  { label: 'Most commented', orderBy: 'commentCount', ascending: false },
  { label: 'Least commented', orderBy: 'commentCount', ascending: true },
];

export function getPostSortLabel(orderBy: TPostOrderByColumn, ascending: boolean): string {
  return (
    POST_SORT_OPTIONS.find((option) => option.orderBy === orderBy && option.ascending === ascending)
      ?.label ?? 'Most recent'
  );
}

export function getPostSortValue(orderBy: TPostOrderByColumn, ascending: boolean): string {
  return `${orderBy}:${ascending ? 'true' : 'false'}`;
}

export function parsePostSortValue(value: string): TPostSortOption | undefined {
  return POST_SORT_OPTIONS.find((option) => getPostSortValue(option.orderBy, option.ascending) === value);
}
