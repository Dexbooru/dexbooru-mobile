import type { TPost } from './posts';
import type { TUser } from './users';

export type ModerationReportStatus = 'NOT_REVIEWED' | 'APPROVED' | 'REJECTED';
export type PostModerationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type UserModerationStatus = 'FLAGGED' | 'UNFLAGGED';
export type CollectionModerationStatus = 'FLAGGED' | 'UNFLAGGED';

export type TOwnerAmendResourceModerationBody =
  | { resourceType: 'post'; resourceId: string; status: PostModerationStatus }
  | { resourceType: 'user'; resourceId: string; status: UserModerationStatus }
  | { resourceType: 'postCollection'; resourceId: string; status: CollectionModerationStatus };

export type TModerationPaginationData = {
  moderators: TUser[];
  postReportPageNumber: number;
  userReportPageNumber: number;
  postCollectionReportPageNumber: number;
  pendingPostsPageNumber: number;
  postReports: unknown[];
  userReports: unknown[];
  postCollectionReports: unknown[];
  pendingPosts: TPost[];
};
