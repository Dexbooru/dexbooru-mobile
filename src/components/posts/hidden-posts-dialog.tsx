import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { PostCard } from '@/components/posts/post-card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import type { TPost } from '@/types/posts';

type HiddenPostsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nsfwPosts: TPost[];
  blacklistedPosts: TPost[];
  autoBlurNsfw: boolean;
  hidePostMetadataOnPreview: boolean;
};

function HiddenPostGrid({
  posts,
  autoBlurNsfw,
  hidePostMetadataOnPreview,
  onPressCard,
}: {
  posts: TPost[];
  autoBlurNsfw: boolean;
  hidePostMetadataOnPreview: boolean;
  onPressCard: () => void;
}) {
  if (posts.length === 0) {
    return (
      <View className="items-center py-6">
        <Text variant="muted">No posts in this bucket</Text>
      </View>
    );
  }

  return (
    <View className="flex-row flex-wrap">
      {posts.map((post) => (
        <View key={post.id} className="w-1/2 p-1">
          <PostCard
            post={post}
            autoBlurNsfw={autoBlurNsfw}
            hidePostMetadataOnPreview={hidePostMetadataOnPreview}
            onPress={onPressCard}
          />
        </View>
      ))}
    </View>
  );
}

export function HiddenPostsDialog({
  open,
  onOpenChange,
  nsfwPosts,
  blacklistedPosts,
  autoBlurNsfw,
  hidePostMetadataOnPreview,
}: HiddenPostsDialogProps) {
  const defaultTab = nsfwPosts.length > 0 ? 'nsfw' : 'blacklisted';
  const [tab, setTab] = useState(defaultTab);

  useEffect(() => {
    if (open) setTab(nsfwPosts.length > 0 ? 'nsfw' : 'blacklisted');
  }, [open, nsfwPosts.length]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-full">
        <DialogHeader>
          <DialogTitle>
            <Text className="text-lg font-semibold">Hidden posts</Text>
          </DialogTitle>
          <DialogDescription>
            NSFW and blacklisted posts filtered out of this feed.
          </DialogDescription>
        </DialogHeader>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="nsfw">
              <Text>NSFW ({nsfwPosts.length})</Text>
            </TabsTrigger>
            <TabsTrigger value="blacklisted">
              <Text>Blacklisted ({blacklistedPosts.length})</Text>
            </TabsTrigger>
          </TabsList>
          <ScrollView className="max-h-[50vh]">
            <TabsContent value="nsfw">
              <HiddenPostGrid
                posts={nsfwPosts}
                autoBlurNsfw={autoBlurNsfw}
                hidePostMetadataOnPreview={hidePostMetadataOnPreview}
                onPressCard={() => onOpenChange(false)}
              />
            </TabsContent>
            <TabsContent value="blacklisted">
              <HiddenPostGrid
                posts={blacklistedPosts}
                autoBlurNsfw={autoBlurNsfw}
                hidePostMetadataOnPreview={hidePostMetadataOnPreview}
                onPressCard={() => onOpenChange(false)}
              />
            </TabsContent>
          </ScrollView>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
