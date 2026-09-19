import { apiFetch } from '@/api/client';
import { clearSessionCookies } from '@/api/session-cookies';
import type { TUser } from '@/types/users';
import { apiJson } from '@/api/client';

export type LoginInput = {
  username: string;
  password: string;
  rememberMe?: boolean;
  redirectTo?: string;
};

export async function loginWithPassword(input: LoginInput): Promise<void> {
  const body = new URLSearchParams({
    username: input.username,
    password: input.password,
    rememberMe: String(Boolean(input.rememberMe)),
    redirectTo: input.redirectTo ?? '/posts',
  });

  const response = await apiFetch('/login', {
    method: 'POST',
    body,
    retry: false,
    redirect: 'manual',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (response.status >= 400) {
    throw new Error('Login failed. Check your username and password.');
  }
}

export async function logout(): Promise<void> {
  await apiFetch('/profile/logout', { method: 'GET', retry: false, redirect: 'manual' }).catch(
    () => undefined,
  );
  await clearSessionCookies();
}

export async function getSelf(): Promise<{ user: TUser }> {
  return apiJson<{ user: TUser }>('/api/users/self');
}

export async function validateSession(): Promise<void> {
  await apiJson('/api/users/auth');
}

export async function generateUserTotp(password: string) {
  return apiJson('/api/users/totp', {
    method: 'POST',
    body: { password },
  });
}
