import { apiJson, buildApiUrl } from '@/api/client';
import { getSessionCookie } from '@/api/session-cookies';
import { getOauthReturnUrl, getOauthTokenFromRedirectUrl } from '@/lib/oauth';
import type { TOauthAuthorizationUrls } from '@/types/oauth';

export async function getOauthAuthorizationUrls(
  redirectTo = '/posts',
): Promise<TOauthAuthorizationUrls> {
  return apiJson<TOauthAuthorizationUrls>(
    buildApiUrl('/api/oauth/authorization-urls', {
      redirectTo,
      nativeReturnUrl: getOauthReturnUrl(),
    }),
  );
}

export async function completeOauthLogin(authorizationUrl: string): Promise<void> {
  const WebBrowser = await import('expo-web-browser');
  const redirectUrl = getOauthReturnUrl();
  WebBrowser.maybeCompleteAuthSession();

  const result = await WebBrowser.openAuthSessionAsync(authorizationUrl, redirectUrl);

  if (result.type === 'cancel' || result.type === 'dismiss') {
    throw new Error('Sign-in was cancelled.');
  }

  if (result.type !== 'success' || !result.url) {
    throw new Error('Third-party sign-in failed.');
  }

  const token = getOauthTokenFromRedirectUrl(result.url);
  await apiJson('/oauth/callback', {
    method: 'POST',
    body: { token },
    retry: false,
  });

  const cookie = await getSessionCookie();
  if (!cookie) {
    throw new Error('Third-party sign-in failed.');
  }
}
