import { useQuery } from '@tanstack/react-query';
import { Link, router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';

import { getSelf, getTotpChallenge, submitTotpCode } from '@/api/auth';
import { queryKeys } from '@/api/query-keys';
import { TotpCodeForm, useTotpCountdown } from '@/components/auth/totp-code-form';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useAuthStore } from '@/stores/auth';

export default function TotpChallengeScreen() {
  const setUser = useAuthStore((state) => state.setUser);
  const params = useLocalSearchParams<{ challengeId: string }>();
  const challengeId = Array.isArray(params.challengeId)
    ? params.challengeId[0]
    : params.challengeId;
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const challengeQuery = useQuery({
    queryKey: queryKeys.totp.challenge(challengeId ?? ''),
    queryFn: () => getTotpChallenge(challengeId ?? ''),
    enabled: Boolean(challengeId),
    retry: false,
  });

  const remainingSeconds = useTotpCountdown(challengeQuery.isSuccess);
  const expired = remainingSeconds <= 0;

  useEffect(() => {
    if (challengeQuery.isSuccess && expired) {
      router.replace('/login');
    }
  }, [challengeQuery.isSuccess, expired]);

  async function onSubmit(otpCode: string) {
    if (!challengeId || !challengeQuery.data) return;
    setError(null);
    setPending(true);
    try {
      await submitTotpCode({
        challengeId,
        username: challengeQuery.data.username,
        rememberMe: challengeQuery.data.rememberMe,
        otpCode,
      });
      const { user } = await getSelf();
      setUser(user);
      router.replace('/posts');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'The provided code was incorrect, please try again!');
    } finally {
      setPending(false);
    }
  }

  const loadError =
    challengeQuery.error instanceof Error
      ? challengeQuery.error.message
      : challengeQuery.isError
        ? 'This challenge expired or is not valid. Please log in again.'
        : null;

  return (
    <KeyboardAvoidingView
      className="bg-background flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Stack.Screen options={{ title: 'Two-factor authentication' }} />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerClassName="gap-4 p-6">
        {challengeQuery.isLoading ? (
          <Text variant="muted">Loading your authentication challenge…</Text>
        ) : loadError || !challengeQuery.data ? (
          <View className="gap-4">
            <Text variant="h3">Challenge unavailable</Text>
            <Text className="text-destructive">
              {loadError ?? 'This challenge expired or is not valid. Please log in again.'}
            </Text>
            <Link href="/login" replace asChild>
              <Button>
                <Text>Back to login</Text>
              </Button>
            </Link>
          </View>
        ) : (
          <>
            <TotpCodeForm
              username={challengeQuery.data.username}
              remainingSeconds={remainingSeconds}
              error={error}
              pending={pending}
              onSubmit={(otpCode) => void onSubmit(otpCode)}
            />
            <Link href="/login" replace asChild>
              <Pressable>
                <Text className="text-muted-foreground">Back to login</Text>
              </Pressable>
            </Link>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
