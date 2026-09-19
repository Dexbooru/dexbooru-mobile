import { Link, router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { getSelf, loginWithPassword } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { useAuthStore } from '@/stores/auth';

export default function LoginScreen() {
  const setUser = useAuthStore((state) => state.setUser);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit() {
    setError(null);
    setPending(true);
    try {
      await loginWithPassword({ username, password, rememberMe });
      const { user } = await getSelf();
      setUser(user);
      router.replace('/posts');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Login failed');
    } finally {
      setPending(false);
    }
  }

  return (
    <View className="bg-background flex-1 gap-4 p-6">
      <Text variant="h3">Login to Dexbooru</Text>
      <View className="gap-2">
        <Label>Username</Label>
        <Input
          autoCapitalize="none"
          autoCorrect={false}
          value={username}
          onChangeText={setUsername}
          placeholder="username"
        />
      </View>
      <View className="gap-2">
        <Label>Password</Label>
        <Input
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
        />
      </View>
      <Button variant={rememberMe ? 'secondary' : 'outline'} onPress={() => setRememberMe((value) => !value)}>
        <Text>{rememberMe ? 'Remember me: on' : 'Remember me: off'}</Text>
      </Button>
      {error ? <Text className="text-destructive">{error}</Text> : null}
      <Button disabled={pending || !username || !password} onPress={() => void onSubmit()}>
        <Text>{pending ? 'Signing in…' : 'Log in'}</Text>
      </Button>
      <Link href="/register">
        <Text className="text-primary">Create an account</Text>
      </Link>
      <Link href="/forgot-password">
        <Text className="text-muted-foreground">Forgot password</Text>
      </Link>
    </View>
  );
}
