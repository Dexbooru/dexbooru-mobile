import { getApiOrigin } from '@/api/client';
import {
  IMAGE_FILTER_EXCLUSION_BASE_URLS,
  NSFW_PREVIEW_IMAGE_SUFFIX,
  PREVIEW_IMAGE_SUFFIX,
} from '@/constants/images';
import { NONEXISTENT_USER_ID } from '@/constants/session';
import type { TPost } from '@/types/posts';
import type { TUserPreferences } from '@/types/users';

export const GUEST_USER_PREFERENCES: TUserPreferences = {
  userId: NONEXISTENT_USER_ID,
  twoFactorAuthenticationEnabled: false,
  browseInSafeMode: false,
  autoBlurNsfw: true,
  blacklistedTags: [],
  blacklistedArtists: [],
  customSideWideCss: '',
  hidePostMetadataOnPreview: true,
  hideCollectionMetadataOnPreview: false,
  hideImageCarousel: false,
  createdAt: new Date(0).toISOString(),
  updatedAt: new Date(0).toISOString(),
};

export function resolveMediaUrl(url: string): string {
  if (!url || url.startsWith('http://') || url.startsWith('https://')) return url;
  const origin = getApiOrigin();
  return `${origin}${url.startsWith('/') ? '' : '/'}${url}`;
}

function splitLabelString(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

export function getPostLabelNames(post: TPost | null | undefined, kind: 'tags' | 'artists'): string[] {
  if (!post) return [];
  const labels = kind === 'tags' ? post.tags : post.artists;
  if (labels?.length) return labels.map((label) => label.name);
  return splitLabelString(kind === 'tags' ? post.tagString : post.artistString);
}

export function getPostPreviewUrls(post: TPost, autoBlurNsfw: boolean): string[] {
  const blurImages = post.isNsfw && autoBlurNsfw;

  return (post.imageUrls ?? [])
    .filter((imageUrl) => {
      if (IMAGE_FILTER_EXCLUSION_BASE_URLS.some((baseUrl) => imageUrl.includes(baseUrl))) {
        return true;
      }

      if (blurImages) {
        return imageUrl.endsWith(NSFW_PREVIEW_IMAGE_SUFFIX);
      }

      return imageUrl.endsWith(PREVIEW_IMAGE_SUFFIX) && !imageUrl.endsWith(NSFW_PREVIEW_IMAGE_SUFFIX);
    })
    .map(resolveMediaUrl);
}

export function partitionPosts(posts: TPost[], preferences: TUserPreferences) {
  const { blacklistedArtists, blacklistedTags, browseInSafeMode } = preferences;
  const nsfwPosts: TPost[] = [];
  const blacklistedPosts: TPost[] = [];
  const displayPosts: TPost[] = [];

  for (const post of posts) {
    if (!post) continue;

    const containsBlacklistedTag = getPostLabelNames(post, 'tags').some((name) =>
      blacklistedTags.includes(name),
    );
    const containsBlacklistedArtist = getPostLabelNames(post, 'artists').some((name) =>
      blacklistedArtists.includes(name),
    );

    const canDisplayPost: boolean[] = [];
    if (!containsBlacklistedArtist && !containsBlacklistedTag) {
      canDisplayPost.push(true);
    } else {
      blacklistedPosts.push(post);
      canDisplayPost.push(false);
    }

    if (browseInSafeMode && post.isNsfw) {
      nsfwPosts.push(post);
      canDisplayPost.push(false);
    } else {
      canDisplayPost.push(true);
    }

    if (canDisplayPost.every(Boolean)) {
      displayPosts.push(post);
    }
  }

  return { displayPosts, nsfwPosts, blacklistedPosts };
}
