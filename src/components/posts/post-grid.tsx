import { useMemo, useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
  type ViewToken,
} from 'react-native';

import { PostCard } from '@/components/posts/post-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { TPost } from '@/types/posts';

type PostGridProps = {
  posts: TPost[];
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  onRetry: () => void;
  refreshing: boolean;
  onRefresh: () => void;
  onEndReached: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  autoBlurNsfw: boolean;
  hidePostMetadataOnPreview: boolean;
  pageSize: number;
  onVisiblePageChange?: (page: number) => void;
};

type GridItem = TPost | { id: string; placeholder: true };

function isPlaceholder(item: GridItem): item is { id: string; placeholder: true } {
  return 'placeholder' in item;
}

function PostGridSkeletons() {
  return (
    <View className="flex-row flex-wrap p-2">
      {Array.from({ length: 6 }, (_, index) => (
        <View key={index} className="w-1/2 p-1">
          <Skeleton className="aspect-square w-full rounded-md" />
        </View>
      ))}
    </View>
  );
}

export function PostGrid({
  posts,
  isPending,
  isError,
  error,
  onRetry,
  refreshing,
  onRefresh,
  onEndReached,
  hasNextPage,
  isFetchingNextPage,
  autoBlurNsfw,
  hidePostMetadataOnPreview,
  pageSize,
  onVisiblePageChange,
}: PostGridProps) {
  const colorScheme = useColorScheme();
  const onVisiblePageChangeRef = useRef(onVisiblePageChange);
  onVisiblePageChangeRef.current = onVisiblePageChange;
  const pageSizeRef = useRef(pageSize);
  pageSizeRef.current = pageSize;

  const data = useMemo<GridItem[]>(() => {
    if (posts.length % 2 === 0) return posts;
    return [...posts, { id: 'grid-spacer', placeholder: true }];
  }, [posts]);

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 40 }).current;
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const firstVisible = viewableItems
      .filter((token) => token.isViewable && token.item && !isPlaceholder(token.item as GridItem))
      .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))[0];
    if (firstVisible?.index == null) return;
    const nextPage = Math.floor(firstVisible.index / Math.max(pageSizeRef.current, 1)) + 1;
    onVisiblePageChangeRef.current?.(nextPage);
  }).current;

  if (isPending) {
    return <PostGridSkeletons />;
  }

  return (
    <FlatList
      className="flex-1"
      data={data}
      numColumns={2}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View className="flex-1 p-1">
          {isPlaceholder(item) ? null : (
            <PostCard
              post={item}
              autoBlurNsfw={autoBlurNsfw}
              hidePostMetadataOnPreview={hidePostMetadataOnPreview}
            />
          )}
        </View>
      )}
      contentContainerClassName="p-2 pb-8 grow"
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={onViewableItemsChanged}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colorScheme === 'dark' ? '#ffffff' : '#111111'}
        />
      }
      ListEmptyComponent={
        isError ? (
          <View className="items-center gap-3 p-6">
            <Text className="text-destructive text-center">
              {error?.message ?? 'Could not load posts.'}
            </Text>
            <Button onPress={onRetry}>
              <Text>Retry</Text>
            </Button>
          </View>
        ) : (
          <View className="items-center p-6">
            <Text className="text-muted-foreground text-center">No posts found</Text>
          </View>
        )
      }
      ListFooterComponent={
        posts.length === 0 ? null : (
          <View className="items-center py-4">
            {isFetchingNextPage ? (
              <ActivityIndicator />
            ) : isError ? (
              <Button variant="outline" size="sm" onPress={onRetry}>
                <Text>Retry</Text>
              </Button>
            ) : hasNextPage ? null : (
              <Text variant="muted">No more posts</Text>
            )}
          </View>
        )
      }
    />
  );
}
