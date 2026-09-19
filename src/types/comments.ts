import type { UserRole } from './users';

export type TCommentCreateBody = {
  parentCommentId: string | null;
  content: string;
};

export type TComment = {
  id: string;
  createdAt: string;
  updatedAt: string;
  content: string;
  replyCount: number;
  postId: string;
  parentCommentId: string | null;
  authorId: string | null;
  author: {
    id: string;
    username: string;
    profilePictureUrl: string;
    role: UserRole;
  };
  parentComment?: TComment;
};

export type TCommentOrderByColumn = 'createdAt' | 'updatedAt';

export type TCommentPaginationData = {
  pageNumber: number;
  ascending: boolean;
  orderBy: TCommentOrderByColumn;
  comments: TComment[];
};
