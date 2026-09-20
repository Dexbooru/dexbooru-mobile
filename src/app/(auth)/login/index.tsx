import { useQuery } from '@tanstack/react-query';
import { Link, router, Stack, type Href } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';

import { getSelf, loginWithPassword } from '@/api/auth';
import { completeOauthLogin, getOauthAuthorizationUrls } from '@/api/oauth';
import { queryKeys } from '@/api/query-keys';
import { OauthLoginChips } from '@/components/auth/oauth-login-chips';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { totpHref, TotpRequiredError } from '@/lib/totp';
import { useAuthStore } from '@/stores/auth';
import type { TOauthProviderId } from '@/types/oauth';

export default function LoginScreen() {
  const setUser = useAuthStore((state) => state.setUser);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [oauthPending, setOauthPending] = useState<TOauthProviderId | null>(null);

  const oauthQuery = useQuery({
    queryKey: queryKeys.oauth.authorizationUrls,
    queryFn: () => getOauthAuthorizationUrls('/posts'),
  });

  const busy = pending || oauthPending !== null;

  function continueIfTotpRequired(caught: unknown): boolean {
    if (!(caught instanceof TotpRequiredError)) return false;
    router.push(totpHref(caught.challengeId) as Href);
    return true;
  }

  async function onSubmit() {
    setError(null);
    setPending(true);
    try {
      await loginWithPassword({ username, password, rememberMe });
      const { user } = await getSelf();
      setUser(user);
      router.replace('/posts');
    } catch (caught) {
      if (!continueIfTotpRequired(caught)) {
        setError(caught instanceof Error ? caught.message : 'Login failed');
      }
    } finally {
      setPending(false);
    }
  }

  async function onOauthSelect(provider: TOauthProviderId, authorizationUrl: string) {
    setError(null);
    setOauthPending(provider);
    try {
      await completeOauthLogin(authorizationUrl);
      const { user } = await getSelf();
      setUser(user);
      router.replace('/posts');
    } catch (caught) {
      if (!continueIfTotpRequired(caught)) {
        setError(caught instanceof Error ? caught.message : 'Third-party sign-in failed');
      }
    } finally {
      setOauthPending(null);
    }
  }

  return (
    <KeyboardAvoidingView
      className="bg-background flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Stack.Screen options={{ title: 'Login' }} />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerClassName="gap-4 p-6">
        <Text variant="h3">Login to Dexbooru</Text>
        <View className="gap-2">
          <Label>Username</Label>
          <Input
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="username"
            value={username}
            onChangeText={setUsername}
            placeholder="username"
          />
        </View>
        <View className="gap-2">
          <Label>Password</Label>
          <Input
            autoComplete="password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
          />
        </View>
        <View className="flex-row items-center justify-between">
          <Text>Remember me</Text>
          <Switch checked={rememberMe} onCheckedChange={setRememberMe} disabled={busy} />
        </View>
        {error ? <Text className="text-destructive">{error}</Text> : null}
        <Button disabled={busy || !username || !password} onPress={() => void onSubmit()}>
          <Text>{pending ? 'Signing in…' : 'Log in'}</Text>
        </Button>
        <OauthLoginChips
          urls={oauthQuery.data ?? null}
          loading={oauthQuery.isPending}
          disabled={busy}
          pendingProvider={oauthPending}
          onSelect={(provider, authorizationUrl) => void onOauthSelect(provider, authorizationUrl)}
        />
        <Link href="/register" asChild>
          <Pressable>
            <Text className="text-primary">Create an account</Text>
          </Pressable>
        </Link>
        <Link href="/forgot-password" asChild>
          <Pressable>
            <Text className="text-muted-foreground">Forgot password</Text>
          </Pressable>
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
