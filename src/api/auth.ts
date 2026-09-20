import { apiFetch, apiJson } from '@/api/client';
import { clearSessionCookies, getSessionCookie } from '@/api/session-cookies';
import {
  formActionErrorMessage,
  getActionResultLocation,
  getActionResultType,
  getRedirectPath,
  isFormActionRedirect,
  isRedirectTo,
  pathMatches,
  readResponsePayload,
  SVELTEKIT_ACTION_HEADERS,
  type PathMatcher,
} from '@/lib/form-action';
import { appendProfilePicture, type PreparedProfilePicture } from '@/lib/profile-picture';
import { getTotpChallengeIdFromLocation, TotpRequiredError } from '@/lib/totp';
import type { TTotpChallenge } from '@/types/totp';
import type { TUser } from '@/types/users';

export type LoginInput = {
  username: string;
  password: string;
  rememberMe?: boolean;
  redirectTo?: string;
};

export type RegisterInput = {
  username: string;
  email: string;
  password: string;
  confirmedPassword: string;
  profilePicture?: PreparedProfilePicture | null;
};

export type SubmitTotpInput = {
  challengeId: string;
  username: string;
  rememberMe: boolean;
  otpCode: string;
};

function throwIfTotpRedirect(path: string | null | undefined): void {
  const challengeId = getTotpChallengeIdFromLocation(path);
  if (challengeId) throw new TotpRequiredError(challengeId);
}

async function assertFormActionSession(
  response: Response,
  fallback: string,
  options: { rejectRedirect?: PathMatcher; rejectMessage?: string } = {},
): Promise<void> {
  throwIfTotpRedirect(getRedirectPath(response));

  if (options.rejectRedirect && isRedirectTo(response, options.rejectRedirect)) {
    throw new Error(options.rejectMessage ?? fallback);
  }

  const cookie = await getSessionCookie();
  if (isFormActionRedirect(response.status) && cookie) {
    return;
  }

  const payload = response.bodyUsed ? null : await readResponsePayload(response);
  const actionType = getActionResultType(payload);
  const actionLocation = getActionResultLocation(payload);

  throwIfTotpRedirect(actionLocation);

  if (options.rejectRedirect && pathMatches(actionLocation, options.rejectRedirect)) {
    throw new Error(options.rejectMessage ?? fallback);
  }

  if (actionType === 'redirect' && cookie) {
    return;
  }

  if (actionType === 'failure' || actionType === 'error' || response.status >= 400) {
    throw new Error(formActionErrorMessage(payload, fallback));
  }

  if (cookie && response.status < 400) {
    return;
  }

  throw new Error(formActionErrorMessage(payload, fallback));
}

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
      ...SVELTEKIT_ACTION_HEADERS,
    },
  });

  await assertFormActionSession(response, 'Login failed. Check your username and password.');
}

export async function getTotpChallenge(challengeId: string): Promise<TTotpChallenge> {
  return apiJson<TTotpChallenge>(`/api/users/totp/${encodeURIComponent(challengeId)}`);
}

export async function submitTotpCode(input: SubmitTotpInput): Promise<void> {
  const body = new URLSearchParams({
    otpCode: input.otpCode,
    username: input.username,
    rememberMe: String(Boolean(input.rememberMe)),
  });

  const response = await apiFetch(`/login/totp/${encodeURIComponent(input.challengeId)}`, {
    method: 'POST',
    body,
    retry: false,
    redirect: 'manual',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...SVELTEKIT_ACTION_HEADERS,
    },
  });

  await assertFormActionSession(response, 'The provided code was incorrect, please try again!', {
    rejectRedirect: (path) => path === '/login',
    rejectMessage: 'This challenge expired or is not valid. Please log in again.',
  });
}

export async function registerAccount(input: RegisterInput): Promise<void> {
  const form = new FormData();
  form.append('username', input.username);
  form.append('email', input.email);
  form.append('password', input.password);
  form.append('confirmedPassword', input.confirmedPassword);
  await appendProfilePicture(form, input.profilePicture);

  const response = await apiFetch('/register', {
    method: 'POST',
    body: form,
    retry: false,
    redirect: 'manual',
    headers: {
      ...SVELTEKIT_ACTION_HEADERS,
    },
  });

  await assertFormActionSession(response, 'Registration failed. Check your details and try again.');
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
