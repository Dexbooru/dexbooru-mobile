import type { TComment } from './comments';
import type { UserRole } from './users';

export type PostModerationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type PostSourceType = 'VIDEOGAME' | 'ANIME' | 'MANGA' | 'OTHER';
export type TPostLikeAction = 'like' | 'dislike';
export type TPostOrderByColumn = 'likes' | 'createdAt' | 'views' | 'commentCount' | 'updatedAt';
export type TPostCategory = 'general' | 'liked' | 'uploaded';

export type TLikePutBody = {
  action: TPostLikeAction;
};

export type TPostSource = {
  id: string;
  postId?: string;
  sourceTitle: string;
  sourceType: PostSourceType;
  characterName: string;
};

export type TUpdatePostBody = {
  description: string;
  sourceLink: string;
  deletionPostImageUrls: string[];
  newPostImagesContent: string[];
};

export type THiddenPagePostData = {
  nsfwPosts: TPost[];
  blacklistedPosts: TPost[];
};

export type TPostPaginationData = {
  posts: TPost[];
  pageNumber: number;
  ascending: boolean;
  orderBy: TPostOrderByColumn;
};

export type TPostLabel = {
  id?: string;
  name: string;
  postCount?: number;
};

export type TPost = {
  id: string;
  sourceLink: string;
  isNsfw: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
  imageUrls: string[];
  imageHashes: string[];
  imageWidths: number[];
  imageHeights: number[];
  likes: number;
  views: number;
  author: {
    id: string;
    username: string;
    profilePictureUrl: string;
    role: UserRole;
  };
  authorId: string | null;
  tagString: string;
  tags: TPostLabel[];
  artists: TPostLabel[];
  artistString: string;
  commentCount: number;
  moderationStatus: PostModerationStatus;
  comments: TComment[];
  sources: TPostSource[];
};

export type TPostListParams = {
  pageNumber?: number;
  ascending?: boolean;
  orderBy?: TPostOrderByColumn;
  category?: TPostCategory;
  userId?: string;
};
