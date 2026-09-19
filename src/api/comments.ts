import { apiJson, buildApiUrl } from '@/api/client';
import type { TComment, TCommentCreateBody, TCommentPaginationData } from '@/types/comments';

export async function getComments(
  postId: string,
  parentCommentId: string | null,
  pageNumber: number,
): Promise<TCommentPaginationData> {
  return apiJson<TCommentPaginationData>(
    buildApiUrl(`/api/post/${postId}/comments`, {
      pageNumber,
      parentCommentId: parentCommentId === null ? 'null' : parentCommentId,
    }),
  );
}

export async function getCommentChain(commentId: string): Promise<TComment> {
  return apiJson<TComment>(`/api/comments/${commentId}`);
}

export async function getCommentsByUser(authorId: string, pageNumber: number, pageLimit?: number) {
  return apiJson(
    buildApiUrl(`/api/comments/find/user/${authorId}`, {
      pageNumber,
      pageLimit,
    }),
  );
}

export async function createComment(postId: string, body: TCommentCreateBody) {
  return apiJson(`/api/post/${postId}/comments`, { method: 'POST', body });
}

export async function editComment(postId: string, commentId: string, content: string) {
  return apiJson(`/api/post/${postId}/comments`, {
    method: 'PATCH',
    body: { commentId, content },
  });
}

export async function deleteComment(postId: string, commentId: string) {
  return apiJson(buildApiUrl(`/api/post/${postId}/comments`, { commentId }), { method: 'DELETE' });
}
