import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { TOTP_CHALLENGE_EXPIRY_SECONDS, TOTP_CODE_LENGTH } from '@/constants/totp';

type TotpCodeFormProps = {
  username: string;
  remainingSeconds: number;
  error: string | null;
  pending: boolean;
  onSubmit: (otpCode: string) => void;
};

export function TotpCodeForm({
  username,
  remainingSeconds,
  error,
  pending,
  onSubmit,
}: TotpCodeFormProps) {
  const [otpCode, setOtpCode] = useState('');
  const canSubmit = otpCode.length === TOTP_CODE_LENGTH && !pending && remainingSeconds > 0;

  useEffect(() => {
    setOtpCode('');
  }, [username]);

  const minutes = Math.max(0, Math.floor(remainingSeconds / 60));
  const seconds = Math.max(0, remainingSeconds % 60)
    .toString()
    .padStart(2, '0');

  return (
    <View className="gap-4">
      <Text variant="h3">Complete OTP challenge</Text>
      <Text variant="muted">
        Hello, {username}! Enter the {TOTP_CODE_LENGTH}-digit code from your authenticator app.
      </Text>
      <Text variant="muted">
        You have {minutes}:{seconds} left. If the timer runs out, you will need to log in again.
      </Text>
      <View className="gap-2">
        <Label>OTP code</Label>
        <Input
          autoFocus
          autoComplete="one-time-code"
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          maxLength={TOTP_CODE_LENGTH}
          value={otpCode}
          onChangeText={(value) => setOtpCode(value.replace(/\D/g, '').slice(0, TOTP_CODE_LENGTH))}
          placeholder="Enter the code from your app"
        />
      </View>
      {error ? <Text className="text-destructive">{error}</Text> : null}
      <Button disabled={!canSubmit} onPress={() => onSubmit(otpCode)}>
        <Text>{pending ? 'Verifying…' : 'Submit code'}</Text>
      </Button>
    </View>
  );
}

export function useTotpCountdown(enabled: boolean) {
  const [remainingSeconds, setRemainingSeconds] = useState(TOTP_CHALLENGE_EXPIRY_SECONDS);

  useEffect(() => {
    if (!enabled) return;
    setRemainingSeconds(TOTP_CHALLENGE_EXPIRY_SECONDS);
    const interval = setInterval(() => {
      setRemainingSeconds((value) => {
        if (value <= 1) {
          clearInterval(interval);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [enabled]);

  return remainingSeconds;
}
