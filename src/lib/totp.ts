import { TOTP_CHALLENGE_QUERY_PARAM, TOTP_REDIRECT_PATH } from '@/constants/totp';

const TOTP_CHALLENGE_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class TotpRequiredError extends Error {
  challengeId: string;

  constructor(challengeId: string) {
    super('Two-factor authentication is required.');
    this.name = 'TotpRequiredError';
    this.challengeId = challengeId;
  }
}

export function parseTotpChallengeId(value: string | null | undefined): string | null {
  if (!value) return null;
  return TOTP_CHALLENGE_ID_PATTERN.test(value) ? value : null;
}

export function getTotpChallengeIdFromPath(path: string | null | undefined): string | null {
  if (!path) return null;
  const match = path.match(/\/login\/totp\/([^/?#]+)/);
  return parseTotpChallengeId(match?.[1]);
}

export function getTotpChallengeIdFromLocation(location: string | null | undefined): string | null {
  if (!location) return null;
  try {
    const parsed = new URL(location, 'http://localhost');
    return (
      parseTotpChallengeId(parsed.searchParams.get(TOTP_CHALLENGE_QUERY_PARAM)) ??
      getTotpChallengeIdFromPath(parsed.pathname)
    );
  } catch {
    return getTotpChallengeIdFromPath(location);
  }
}

export function totpHref(challengeId: string): `/login/totp/${string}` {
  return `${TOTP_REDIRECT_PATH}${challengeId}` as `/login/totp/${string}`;
}
