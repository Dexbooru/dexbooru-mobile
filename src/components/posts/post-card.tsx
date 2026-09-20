import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { getPostLabelNames, getPostPreviewUrls } from '@/lib/posts';
import type { TPost } from '@/types/posts';

type PostCardProps = {
  post: TPost;
  autoBlurNsfw: boolean;
  hidePostMetadataOnPreview: boolean;
  onPress?: () => void;
};

export function PostCard({ post, autoBlurNsfw, hidePostMetadataOnPreview, onPress }: PostCardProps) {
  const previewUrl = getPostPreviewUrls(post, autoBlurNsfw)[0];
  const tags = getPostLabelNames(post, 'tags');
  const artists = getPostLabelNames(post, 'artists');
  const accessibilityLabel = `${tags.join(', ') || 'Post'} by ${artists.join(', ') || 'unknown'}`;

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={accessibilityLabel}
      onPress={() => {
        onPress?.();
        router.push(`/posts/${post.id}`);
      }}
      className="overflow-hidden"
    >
      <View className="bg-muted aspect-square w-full overflow-hidden rounded-md">
        {previewUrl ? (
          <Image
            source={{ uri: previewUrl }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            recyclingKey={post.id}
            transition={150}
          />
        ) : null}
      </View>
      {hidePostMetadataOnPreview ? null : (
        <View className="mt-1 gap-0.5">
          <Text numberOfLines={1} variant="small">
            {tags.slice(0, 3).join(', ') || 'Untitled'}
          </Text>
          <Text numberOfLines={1} variant="muted">
            {artists.slice(0, 2).join(', ') || 'Unknown artist'}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
