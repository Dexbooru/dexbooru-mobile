import { apiFetch, apiJson, buildApiUrl } from '@/api/client';
import type { TLikePutBody, TPost, TPostListParams, TPostPaginationData, TUpdatePostBody } from '@/types/posts';

export async function getPosts(params: TPostListParams = {}): Promise<TPostPaginationData> {
  return apiJson<TPostPaginationData>(
    buildApiUrl('/api/posts', {
      pageNumber: params.pageNumber ?? 0,
      ascending: params.ascending ?? false,
      orderBy: params.orderBy ?? 'createdAt',
      category: params.category ?? 'general',
      userId: params.userId,
    }),
  );
}

export async function getPost(postId: string): Promise<TPost> {
  return apiJson<TPost>(`/api/post/${postId}`);
}

export async function getPostsByLabel(
  kind: 'tag' | 'artist' | 'character' | 'source',
  name: string,
  params: TPostListParams = {},
): Promise<TPostPaginationData> {
  return apiJson<TPostPaginationData>(
    buildApiUrl(`/api/posts/${kind}/${encodeURIComponent(name)}`, {
      pageNumber: params.pageNumber ?? 0,
      ascending: params.ascending ?? false,
      orderBy: params.orderBy ?? 'createdAt',
    }),
  );
}

export async function getUserPosts(username: string, params: TPostListParams = {}): Promise<TPostPaginationData> {
  return apiJson<TPostPaginationData>(
    buildApiUrl(`/api/user/${encodeURIComponent(username)}/posts`, {
      pageNumber: params.pageNumber ?? 0,
      ascending: params.ascending ?? false,
      orderBy: params.orderBy ?? 'createdAt',
    }),
  );
}

export async function likePost(postId: string, body: TLikePutBody) {
  return apiJson(`/api/post/${postId}/like`, { method: 'PUT', body });
}

export async function editPost(postId: string, body: TUpdatePostBody) {
  return apiJson(`/api/post/${postId}`, { method: 'PATCH', body });
}

export async function deletePost(postId: string) {
  return apiJson(`/api/post/${postId}`, { method: 'DELETE' });
}

export async function checkDuplicatePosts(hashes: string[]) {
  return apiJson('/api/posts/duplicates', { method: 'POST', body: { hashes } });
}

export async function createPost(formData: FormData) {
  return apiFetch('/api/posts', { method: 'POST', body: formData, retry: false });
}
