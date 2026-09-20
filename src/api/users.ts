import { apiJson, buildApiUrl } from '@/api/client';
import type { TFriendRequestHandleBody } from '@/types/friends';
import type { TUserProfile, UserRole } from '@/types/users';

export async function getUser(username: string): Promise<TUserProfile> {
  return apiJson<TUserProfile>(`/api/user/${encodeURIComponent(username)}`);
}

export async function addFriend(username: string) {
  return apiJson(`/api/user/${encodeURIComponent(username)}/friend-requests`, { method: 'POST' });
}

export async function handleFriendRequest(username: string, body: TFriendRequestHandleBody) {
  return apiJson(
    buildApiUrl(`/api/user/${encodeURIComponent(username)}/friend-requests`, { action: body.action }),
    { method: 'DELETE' },
  );
}

export async function deleteFriend(username: string) {
  return apiJson(`/api/user/${encodeURIComponent(username)}/friends`, { method: 'DELETE' });
}

export async function updateUserRole(username: string, newRole: UserRole) {
  return apiJson(`/api/user/${encodeURIComponent(username)}/promote`, {
    method: 'PATCH',
    body: { newRole },
  });
}
