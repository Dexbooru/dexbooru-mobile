import { apiJson, buildApiUrl } from '@/api/client';
import type {
  TCollectionListParams,
  TCollectionPaginationData,
  TPostCollection,
  TUpdateCollectionBody,
} from '@/types/collections';

export async function getCollection(collectionId: string): Promise<TPostCollection> {
  return apiJson<TPostCollection>(`/api/collection/${collectionId}`);
}

export async function getUserCollections(
  username: string,
  params: TCollectionListParams = {},
): Promise<TCollectionPaginationData> {
  return apiJson<TCollectionPaginationData>(
    buildApiUrl(`/api/user/${encodeURIComponent(username)}/collections`, {
      pageNumber: params.pageNumber ?? 0,
      orderBy: params.orderBy ?? 'createdAt',
      ascending: params.ascending ?? false,
    }),
  );
}

export async function getPostCollections(postId: string, pageNumber = 0): Promise<TCollectionPaginationData> {
  return apiJson<TCollectionPaginationData>(
    buildApiUrl(`/api/post/${postId}/collections`, { pageNumber }),
  );
}

export async function createCollection(body: TUpdateCollectionBody) {
  return apiJson('/api/collections', { method: 'POST', body });
}

export async function editCollection(collectionId: string, body: TUpdateCollectionBody) {
  return apiJson(`/api/collection/${collectionId}`, { method: 'PATCH', body });
}

export async function deleteCollection(collectionId: string) {
  return apiJson(`/api/collection/${collectionId}`, { method: 'DELETE' });
}

export async function updatePostCollections(
  postId: string,
  collectionActions: Record<string, 'add' | 'delete'>,
) {
  return apiJson('/api/posts/collections', {
    method: 'PATCH',
    body: { postId, collectionActions },
  });
}
