import { apiJson, buildApiUrl } from '@/api/client';
import type { TMarkAsReadRequest, TRealtimeNotification, TUserNotifications } from '@/types/notifications';

export async function getNotifications(page = 1, limit = 20, read?: boolean) {
  return apiJson<TUserNotifications>(
    buildApiUrl('/api/notifications', {
      page,
      limit,
      read,
    }),
  );
}

export async function markNotificationsAsRead(request: TMarkAsReadRequest) {
  return apiJson<{ markedCount: number }>('/api/notifications', {
    method: 'PATCH',
    body: request,
  });
}

export async function enrichRealtimeNotifications(notifications: TRealtimeNotification[]) {
  return apiJson<{ notifications: TRealtimeNotification[] }>('/api/notifications/enrich', {
    method: 'POST',
    body: { notifications },
  });
}
