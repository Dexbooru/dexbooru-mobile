import * as Linking from 'expo-linking';

import { OAUTH_PROCESS_PATH } from '@/constants/oauth';
import { SESSION_COOKIE_KEY } from '@/constants/session';
import { getTotpChallengeIdFromLocation, TotpRequiredError } from '@/lib/totp';

export function getOauthReturnUrl(): string {
  return Linking.createURL(OAUTH_PROCESS_PATH);
}

export function getOauthTokenFromRedirectUrl(url: string): string {
  const totpChallengeId = getTotpChallengeIdFromLocation(url);
  if (totpChallengeId) throw new TotpRequiredError(totpChallengeId);

  const parsed = new URL(url, 'http://localhost');

  const oauthError = parsed.searchParams.get('oauthError');
  if (oauthError) throw new Error(oauthError);

  const token = parsed.searchParams.get(SESSION_COOKIE_KEY);
  if (!token) {
    throw new Error('Third-party sign-in failed.');
  }

  return token;
}
