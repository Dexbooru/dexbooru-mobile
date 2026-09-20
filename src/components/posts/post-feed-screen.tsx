import { Link, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { HiddenPostsDialog } from '@/components/posts/hidden-posts-dialog';
import { PostGrid } from '@/components/posts/post-grid';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { getPostSortLabel, getPostSortValue, parsePostSortValue, POST_SORT_OPTIONS } from '@/constants/posts';
import { usePostFeed } from '@/hooks/use-post-feed';
import type { TPostCategory } from '@/types/posts';
import { ChevronDown } from 'lucide-react-native';

const CATEGORY_LINKS: { category: TPostCategory; href: '/posts' | '/posts/liked' | '/posts/uploaded'; label: string }[] =
  [
    { category: 'general', href: '/posts', label: 'Posts' },
    { category: 'liked', href: '/posts/liked', label: 'Liked' },
    { category: 'uploaded', href: '/posts/uploaded', label: 'Uploaded' },
  ];

type PostFeedScreenProps = {
  category: TPostCategory;
};

function hiddenPostsLabel(nsfwCount: number, blacklistedCount: number): string {
  const parts: string[] = [];
  if (nsfwCount > 0) parts.push(`${nsfwCount} NSFW`);
  if (blacklistedCount > 0) parts.push(`${blacklistedCount} blacklisted`);
  return `Show ${parts.join(' and ')} post(s)`;
}

export function PostFeedScreen({ category }: PostFeedScreenProps) {
  const feed = usePostFeed(category);
  const [hiddenOpen, setHiddenOpen] = useState(false);
  const [visiblePage, setVisiblePage] = useState(1);
  const title = category === 'liked' ? 'liked' : category === 'uploaded' ? 'uploaded' : 'posts';
  const headerTitle = category === 'liked' ? 'Liked' : category === 'uploaded' ? 'Uploaded' : 'Posts';
  const hiddenCount = feed.nsfwPosts.length + feed.blacklistedPosts.length;

  useEffect(() => {
    setVisiblePage(1);
  }, [category, feed.orderBy, feed.ascending]);

  return (
    <View className="bg-background flex-1">
      <Stack.Screen
        options={{
          title: headerTitle,
          headerTitleAlign: 'center',
          headerTitle: () => (
            <View className="items-center">
              <Text className="text-foreground font-semibold">{headerTitle}</Text>
              <Text variant="muted">Page {visiblePage}</Text>
            </View>
          ),
        }}
      />
      <View className="gap-2 p-3">
        <View className="flex-row flex-nowrap gap-2">
          {CATEGORY_LINKS.map((link) => {
            const isActive = category === link.category;
            const chip = (
              <Button size="sm" variant={isActive ? 'secondary' : 'outline'}>
                <Text>{link.label}</Text>
              </Button>
            );

            if (isActive) {
              return <View key={link.category}>{chip}</View>;
            }

            return (
              <Link key={link.category} href={link.href} replace asChild>
                {chip}
              </Link>
            );
          })}
        </View>
        <View className="flex-row justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Text numberOfLines={1}>{getPostSortLabel(feed.orderBy, feed.ascending)}</Text>
                <Icon as={ChevronDown} className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="bottom" className="w-56">
              <DropdownMenuRadioGroup
                value={getPostSortValue(feed.orderBy, feed.ascending)}
                onValueChange={(value) => {
                  const option = parsePostSortValue(value);
                  if (option) feed.setSort(option.orderBy, option.ascending);
                }}
              >
                {POST_SORT_OPTIONS.map((option) => (
                  <DropdownMenuRadioItem
                    key={getPostSortValue(option.orderBy, option.ascending)}
                    value={getPostSortValue(option.orderBy, option.ascending)}
                  >
                    <Text>{option.label}</Text>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </View>
      </View>

      {!feed.enabled ? (
        <View className="gap-3 p-6">
          <Text className="text-muted-foreground">Sign in to view {title} posts.</Text>
          <Link href="/login" asChild>
            <Button>
              <Text>Sign in</Text>
            </Button>
          </Link>
        </View>
      ) : (
        <>
          {hiddenCount > 0 ? (
            <View className="px-3 pb-2">
              <Button variant="destructive" size="sm" onPress={() => setHiddenOpen(true)}>
                <Text>{hiddenPostsLabel(feed.nsfwPosts.length, feed.blacklistedPosts.length)}</Text>
              </Button>
            </View>
          ) : null}
          <PostGrid
            posts={feed.posts}
            isPending={feed.isPending}
            isError={feed.isError}
            error={feed.error}
            onRetry={() => void feed.refetch()}
            refreshing={feed.isRefetching && !feed.isFetchingNextPage}
            onRefresh={() => void feed.refetch()}
            onEndReached={() => {
              if (feed.hasNextPage && !feed.isFetchingNextPage) {
                void feed.fetchNextPage();
              }
            }}
            hasNextPage={Boolean(feed.hasNextPage)}
            isFetchingNextPage={feed.isFetchingNextPage}
            autoBlurNsfw={feed.preferences.autoBlurNsfw}
            hidePostMetadataOnPreview={feed.preferences.hidePostMetadataOnPreview}
            pageSize={feed.pageSize}
            onVisiblePageChange={setVisiblePage}
          />
          <HiddenPostsDialog
            open={hiddenOpen}
            onOpenChange={setHiddenOpen}
            nsfwPosts={feed.nsfwPosts}
            blacklistedPosts={feed.blacklistedPosts}
            autoBlurNsfw={feed.preferences.autoBlurNsfw}
            hidePostMetadataOnPreview={feed.preferences.hidePostMetadataOnPreview}
          />
        </>
      )}
    </View>
  );
}
