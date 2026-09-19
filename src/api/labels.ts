import { apiJson, buildApiUrl } from '@/api/client';
import type { TLabelMetadata } from '@/types/labels';

export async function getTags(letter: string, pageNumber: number) {
  return apiJson(buildApiUrl(`/api/tags/${encodeURIComponent(letter)}`, { pageNumber }));
}

export async function getArtists(letter: string, pageNumber: number) {
  return apiJson(buildApiUrl(`/api/artists/${encodeURIComponent(letter)}`, { pageNumber }));
}

export async function getLabelMetadata(labelType: 'tag' | 'artist', labelName: string) {
  return apiJson<TLabelMetadata>(`/api/${labelType}s/metadata/${encodeURIComponent(labelName)}`);
}

export async function updateLabelMetadata(
  labelType: 'tag' | 'artist',
  labelName: string,
  body: { description?: string; socialMediaLinks?: string[] },
) {
  return apiJson(`/api/${labelType}s/metadata/${encodeURIComponent(labelName)}`, {
    method: 'PATCH',
    body,
  });
}
