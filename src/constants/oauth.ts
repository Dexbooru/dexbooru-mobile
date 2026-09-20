import type { TOauthAuthorizationUrls, TOauthProviderId } from '@/types/oauth';

export type TOauthProviderOption = {
  id: TOauthProviderId;
  label: string;
  urlKey: keyof TOauthAuthorizationUrls;
};

export const OAUTH_PROCESS_PATH = 'oauth/process';

export const OAUTH_PROVIDERS: TOauthProviderOption[] = [
  { id: 'discord', label: 'Discord', urlKey: 'discordAuthorizationUrl' },
  { id: 'github', label: 'GitHub', urlKey: 'githubAuthorizationUrl' },
  { id: 'google', label: 'Google', urlKey: 'googleAuthorizationUrl' },
];
