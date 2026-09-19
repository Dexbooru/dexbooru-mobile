import { apiJson, buildApiUrl } from '@/api/client';
import type {
  CollectionModerationStatus,
  ModerationReportStatus,
  PostModerationStatus,
  TOwnerAmendResourceModerationBody,
} from '@/types/moderation';

export async function getModerators() {
  return apiJson('/api/moderators');
}

export async function getPendingPosts(pageNumber: number) {
  return apiJson(buildApiUrl('/api/moderation/posts/pending', { pageNumber }));
}

export async function updatePostModerationStatus(postId: string, status: PostModerationStatus) {
  return apiJson(`/api/moderation/posts/${postId}/status`, {
    method: 'PATCH',
    body: { status },
  });
}

export async function getOwnerResourceModerationStatus(
  resourceType: 'post' | 'user' | 'postCollection',
  resourceId: string,
) {
  return apiJson(
    buildApiUrl('/api/moderation/owner/resource-moderation-status', { resourceType, resourceId }),
  );
}

export async function ownerAmendResourceModeration(body: TOwnerAmendResourceModerationBody) {
  return apiJson('/api/moderation/owner/resource-moderation-status', {
    method: 'PATCH',
    body,
  });
}

export async function updateReportStatus(
  reportId: string,
  reportType: 'postReports' | 'postCollectionReports' | 'userReports',
  status: ModerationReportStatus,
) {
  const typeMap = {
    postReports: 'post',
    postCollectionReports: 'collection',
    userReports: 'user',
  } as const;

  return apiJson(`/api/moderation/reports/${typeMap[reportType]}/${reportId}/status`, {
    method: 'PATCH',
    body: { reviewStatus: status },
  });
}

export type { CollectionModerationStatus };
