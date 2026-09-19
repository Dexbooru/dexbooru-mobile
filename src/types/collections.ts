import type { TPost } from './posts';

export type CollectionModerationStatus = 'FLAGGED' | 'UNFLAGGED';
export type TCollectionOrderByColumn = 'createdAt' | 'updatedAt';

export type TCollectionPaginationData = {
  collections: TPostCollection[];
  pageNumber: number;
  orderBy: TCollectionOrderByColumn;
  ascending: boolean;
};

export type TUpdateCollectionBody = {
  title: string;
  description: string;
};

export type TCollectionHiddenPageData = {
  nsfwCollections: TPostCollection[];
};

export type TPostCollection = {
  id: string;
  title: string;
  description: string;
  isNsfw: boolean;
  moderationStatus: CollectionModerationStatus;
  thumbnailImageUrls: string[];
  createdAt: string;
  updatedAt: string;
  authorId: string | null;
  posts: TPost[];
  author: {
    id: string;
    username: string;
    profilePictureUrl: string;
  };
};

export type TCollectionListParams = {
  pageNumber?: number;
  orderBy?: TCollectionOrderByColumn;
  ascending?: boolean;
};
