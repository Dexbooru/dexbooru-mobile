import { View } from 'react-native';

import { OauthProviderIcon } from '@/components/auth/oauth-provider-icon';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { OAUTH_PROVIDERS } from '@/constants/oauth';
import type { TOauthAuthorizationUrls, TOauthProviderId } from '@/types/oauth';

type OauthLoginChipsProps = {
  urls: TOauthAuthorizationUrls | null;
  loading?: boolean;
  disabled?: boolean;
  pendingProvider?: TOauthProviderId | null;
  onSelect: (provider: TOauthProviderId, authorizationUrl: string) => void;
};

export function OauthLoginChips({
  urls,
  loading = false,
  disabled = false,
  pendingProvider = null,
  onSelect,
}: OauthLoginChipsProps) {
  const providers = OAUTH_PROVIDERS.map((provider) => ({
    ...provider,
    authorizationUrl: urls?.[provider.urlKey] ?? '',
  })).filter((provider) => provider.authorizationUrl.length > 0);

  if (loading && !urls) {
    return (
      <View className="gap-3">
        <OauthDivider />
        {OAUTH_PROVIDERS.map((provider) => (
          <Skeleton key={provider.id} className="h-10 w-full" />
        ))}
      </View>
    );
  }

  if (providers.length === 0) return null;

  return (
    <View className="gap-3">
      <OauthDivider />
      {providers.map((provider) => {
        const isPending = pendingProvider === provider.id;
        return (
          <Button
            key={provider.id}
            variant="outline"
            disabled={disabled}
            onPress={() => onSelect(provider.id, provider.authorizationUrl)}
          >
            <OauthProviderIcon provider={provider.id} />
            <Text>{isPending ? `Continuing with ${provider.label}…` : `Sign in with ${provider.label}`}</Text>
          </Button>
        );
      })}
    </View>
  );
}

function OauthDivider() {
  return (
    <View className="flex-row items-center gap-3">
      <Separator className="flex-1" />
      <Text variant="muted">OR</Text>
      <Separator className="flex-1" />
    </View>
  );
}
