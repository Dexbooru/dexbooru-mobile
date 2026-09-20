import { resolveMediaUrl } from '@/lib/posts';
import type { TOauthProviderId } from '@/types/oauth';
import type { UserRole } from '@/types/users';

export function getProfilePictureUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  return resolveMediaUrl(url);
}

export function getUserInitials(username: string | null | undefined): string {
  const trimmed = username?.trim() ?? '';
  if (!trimmed) return '?';
  const parts = trimmed.split(/[\s._-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
  }
  return trimmed.slice(0, 2).toUpperCase();
}

export function getUserRoleLabel(role: UserRole | null | undefined): string {
  if (role === 'OWNER') return 'Owner';
  if (role === 'MODERATOR') return 'Moderator';
  return 'Member';
}

export function formatProfileDate(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatProfileStat(value: number | null | undefined): string {
  const amount = typeof value === 'number' && Number.isFinite(value) ? value : 0;
  return Math.round(amount).toLocaleString();
}

export function linkedAccountProviderId(platform: string): TOauthProviderId | null {
  const normalized = platform.trim().toLowerCase();
  if (normalized === 'discord' || normalized === 'github' || normalized === 'google') {
    return normalized;
  }
  return null;
}
