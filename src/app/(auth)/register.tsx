import { Link, router, Stack } from 'expo-router';
import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';

import { getSelf, registerAccount } from '@/api/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import {
  getEmailRequirements,
  getPasswordRequirements,
  getUsernameRequirements,
  type TAuthFieldRequirements,
} from '@/lib/auth-requirements';
import {
  pickAndPrepareProfilePicture,
  ProfilePictureError,
  type PreparedProfilePicture,
} from '@/lib/profile-picture';
import { useAuthStore } from '@/stores/auth';
import { useConfigStore } from '@/stores/config';
import { APPLICATION_CONFIGURATION_DEFAULTS } from '@/types/application-configuration';

function RequirementList({ requirements }: { requirements: TAuthFieldRequirements }) {
  return (
    <View className="gap-1">
      {requirements.unsatisfied.map((message) => (
        <Text key={`unsatisfied-${message}`} className="text-destructive text-xs">
          {message}
        </Text>
      ))}
      {requirements.satisfied.map((message) => (
        <Text key={`satisfied-${message}`} className="text-xs text-green-600 dark:text-green-400">
          {message}
        </Text>
      ))}
    </View>
  );
}

export default function RegisterScreen() {
  const setUser = useAuthStore((state) => state.setUser);
  const configuration = useConfigStore((state) => state.configuration);

  const usernameLimits = {
    minimumUsernameLength:
      configuration?.minimumUsernameLength ?? APPLICATION_CONFIGURATION_DEFAULTS.minimumUsernameLength,
    maximumUsernameLength:
      configuration?.maximumUsernameLength ?? APPLICATION_CONFIGURATION_DEFAULTS.maximumUsernameLength,
  };
  const passwordLimits = {
    minimumPasswordLength:
      configuration?.minimumPasswordLength ?? APPLICATION_CONFIGURATION_DEFAULTS.minimumPasswordLength,
    maximumPasswordLength:
      configuration?.maximumPasswordLength ?? APPLICATION_CONFIGURATION_DEFAULTS.maximumPasswordLength,
  };
  const maximumAvatarMb =
    configuration?.maximumProfilePictureImageUploadSizeMb ??
    APPLICATION_CONFIGURATION_DEFAULTS.maximumProfilePictureImageUploadSizeMb;

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState<PreparedProfilePicture | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const usernameRequirements = useMemo(
    () => getUsernameRequirements(username, usernameLimits),
    [username, usernameLimits.minimumUsernameLength, usernameLimits.maximumUsernameLength],
  );
  const emailRequirements = useMemo(() => getEmailRequirements(email), [email]);
  const passwordRequirements = useMemo(
    () => getPasswordRequirements(password, passwordLimits),
    [password, passwordLimits.minimumPasswordLength, passwordLimits.maximumPasswordLength],
  );
  const passwordsMatch = password.length > 0 && password === confirmedPassword;
  const canSubmit =
    usernameRequirements.unsatisfied.length === 0 &&
    emailRequirements.unsatisfied.length === 0 &&
    passwordRequirements.unsatisfied.length === 0 &&
    passwordsMatch &&
    !pending;

  async function onPickAvatar() {
    setError(null);
    try {
      const picture = await pickAndPrepareProfilePicture(maximumAvatarMb);
      if (picture) setProfilePicture(picture);
    } catch (caught) {
      const message =
        caught instanceof ProfilePictureError || caught instanceof Error
          ? caught.message
          : 'Could not pick a profile picture';
      setError(message);
    }
  }

  async function onSubmit() {
    if (!canSubmit) return;
    setError(null);
    setPending(true);
    try {
      await registerAccount({
        username,
        email,
        password,
        confirmedPassword,
        profilePicture,
      });
      const { user } = await getSelf();
      setUser(user);
      router.replace('/posts');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Registration failed');
    } finally {
      setPending(false);
    }
  }

  return (
    <KeyboardAvoidingView
      className="bg-background flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Stack.Screen options={{ title: 'Register' }} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="gap-4 p-6"
      >
        <Text variant="h3">Register an account</Text>
        <View className="gap-2">
          <Label>Username</Label>
          <Input
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="username"
            maxLength={usernameLimits.maximumUsernameLength}
            value={username}
            onChangeText={setUsername}
            placeholder="Your username"
          />
          {username.length > 0 ? <RequirementList requirements={usernameRequirements} /> : null}
        </View>
        <View className="gap-2">
          <Label>Email</Label>
          <Input
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            keyboardType="email-address"
            maxLength={254}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
          />
          {email.length > 0 ? <RequirementList requirements={emailRequirements} /> : null}
        </View>
        <View className="gap-2">
          <Label>Password</Label>
          <Input
            autoComplete="new-password"
            secureTextEntry
            maxLength={passwordLimits.maximumPasswordLength}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
          />
          {password.length > 0 ? <RequirementList requirements={passwordRequirements} /> : null}
        </View>
        <View className="gap-2">
          <Label>Confirm password</Label>
          <Input
            autoComplete="new-password"
            secureTextEntry
            maxLength={passwordLimits.maximumPasswordLength}
            value={confirmedPassword}
            onChangeText={setConfirmedPassword}
            placeholder="••••••••"
          />
          {confirmedPassword.length > 0 && !passwordsMatch ? (
            <Text className="text-destructive text-xs">Passwords do not match</Text>
          ) : null}
        </View>
        <View className="items-center gap-3">
          <Avatar className="size-24" alt="Profile picture preview">
            {profilePicture ? <AvatarImage source={{ uri: profilePicture.uri }} /> : null}
            <AvatarFallback>
              <Text variant="muted">{username.slice(0, 2).toUpperCase() || '?'}</Text>
            </AvatarFallback>
          </Avatar>
          <View className="flex-row gap-2">
            <Button variant="outline" onPress={() => void onPickAvatar()}>
              <Text>{profilePicture ? 'Change picture' : 'Add profile picture'}</Text>
            </Button>
            {profilePicture ? (
              <Button variant="ghost" onPress={() => setProfilePicture(null)}>
                <Text>Remove</Text>
              </Button>
            ) : null}
          </View>
          <Text variant="muted">Optional. Square crop, saved as 256×256 PNG.</Text>
        </View>
        {error ? <Text className="text-destructive">{error}</Text> : null}
        <Button disabled={!canSubmit} onPress={() => void onSubmit()}>
          <Text>{pending ? 'Creating account…' : 'Register'}</Text>
        </Button>
        <Link href="/login" asChild>
          <Pressable>
            <Text className="text-primary">Already have an account? Log in</Text>
          </Pressable>
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
