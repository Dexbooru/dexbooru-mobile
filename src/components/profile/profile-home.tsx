import { useQuery } from '@tanstack/react-query';
import { Link, router, Stack } from 'expo-router';
import {
  Bell,
  FolderOpen,
  Heart,
  Images,
  LogOut,
  Settings,
  ShieldAlert,
  Sparkles,
  Users,
} from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { logout } from '@/api/auth';
import { queryKeys } from '@/api/query-keys';
import { getUser } from '@/api/users';
import { OauthProviderIcon } from '@/components/auth/oauth-provider-icon';
import { ProfileActionCard } from '@/components/profile/profile-action-card';
import { UserAvatar } from '@/components/profile/user-avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { OAUTH_PROVIDERS } from '@/constants/oauth';
import {
  formatProfileDate,
  formatProfileStat,
  getUserRoleLabel,
  linkedAccountProviderId,
} from '@/lib/users';
import { useAuthStore } from '@/stores/auth';
import type { TLinkedAccount, TUser, TUserStatistics } from '@/types/users';

const PROFILE_ACTIONS = [
  {
    href: '/posts/liked' as const,
    label: 'Liked posts',
    hint: 'Opens the posts you have liked',
    icon: Heart,
    iconClassName: 'text-red-500',
    iconWrapClassName: 'bg-red-500/15',
  },
  {
    href: '/posts/uploaded' as const,
    label: 'Uploaded posts',
    hint: 'Opens posts you have uploaded',
    icon: Images,
    iconClassName: 'text-sky-500',
    iconWrapClassName: 'bg-sky-500/15',
  },
  {
    href: '/collections' as const,
    label: 'Collections',
    hint: 'Opens your collections',
    icon: FolderOpen,
    iconClassName: 'text-violet-500',
    iconWrapClassName: 'bg-violet-500/15',
  },
  {
    href: '/profile/notifications' as const,
    label: 'Notifications',
    hint: 'Opens your notifications',
    icon: Bell,
    iconClassName: 'text-amber-500',
    iconWrapClassName: 'bg-amber-500/15',
  },
  {
    href: '/profile/friends' as const,
    label: 'Friends',
    hint: 'Opens your friends and friend requests',
    icon: Users,
    iconClassName: 'text-emerald-500',
    iconWrapClassName: 'bg-emerald-500/15',
  },
  {
    href: '/profile/settings' as const,
    label: 'Settings',
    hint: 'Opens account and preference settings',
    icon: Settings,
    iconClassName: 'text-foreground',
    iconWrapClassName: 'bg-muted',
  },
];

export function ProfileHomeScreen() {
  const sessionUser = useAuthStore((state) => state.user);
  const clear = useAuthStore((state) => state.clear);
  const [loggingOut, setLoggingOut] = useState(false);

  const profileQuery = useQuery({
    queryKey: queryKeys.user.profile(sessionUser?.username ?? ''),
    queryFn: () => getUser(sessionUser!.username),
    enabled: Boolean(sessionUser?.username),
  });

  const profileUser = profileQuery.data?.targetUser ?? sessionUser;
  const statistics = profileQuery.data?.userStatistics;
  const linkedAccounts = profileQuery.data?.linkedAccounts ?? profileUser?.linkedAccounts ?? [];

  async function onLogout() {
    setLoggingOut(true);
    try {
      await logout();
      clear();
      router.replace('/login');
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <View className="bg-background flex-1">
      <Stack.Screen options={{ title: 'Profile' }} />
      {profileUser ? (
        <SignedInProfile
          user={profileUser}
          statistics={statistics}
          linkedAccounts={linkedAccounts}
          statsLoading={profileQuery.isPending}
          loggingOut={loggingOut}
          onLogout={() => void onLogout()}
        />
      ) : (
        <SignedOutProfile />
      )}
    </View>
  );
}

function SignedInProfile({
  user,
  statistics,
  linkedAccounts,
  statsLoading,
  loggingOut,
  onLogout,
}: {
  user: TUser;
  statistics?: TUserStatistics;
  linkedAccounts: TLinkedAccount[];
  statsLoading: boolean;
  loggingOut: boolean;
  onLogout: () => void;
}) {
  const joined = formatProfileDate(user.createdAt);
  const roleLabel = getUserRoleLabel(user.role);
  const publicLinks = linkedAccounts.filter((account) => linkedAccountProviderId(account.platform));

  return (
    <ScrollView contentContainerClassName="pb-10">
      <View className="bg-primary relative h-32 overflow-hidden">
        <View className="bg-primary-foreground/15 absolute -top-10 -right-8 size-40 rounded-full" />
        <View className="bg-primary-foreground/10 absolute -bottom-12 -left-10 size-36 rounded-full" />
        <View className="absolute top-6 right-6">
          <Icon as={Sparkles} className="text-primary-foreground size-6 opacity-80" />
        </View>
      </View>

      <View className="-mt-16 items-center px-6">
        <UserAvatar username={user.username} profilePictureUrl={user.profilePictureUrl} />
        <Text
          accessibilityRole="header"
          className="mt-4 text-center text-2xl font-extrabold tracking-tight"
        >
          {user.username}
        </Text>
        <View className="mt-2 flex-row flex-wrap items-center justify-center gap-2">
          <Badge variant={user.role === 'USER' ? 'secondary' : 'default'}>
            <Text>{roleLabel}</Text>
          </Badge>
          {user.emailVerified ? (
            <Badge variant="outline">
              <Text>Email verified</Text>
            </Badge>
          ) : null}
        </View>
        {joined ? (
          <Text variant="muted" className="mt-2">
            Joined {joined}
          </Text>
        ) : null}
        {user.email ? (
          <Text variant="muted" className="mt-1">
            {user.email}
          </Text>
        ) : null}
      </View>

      {user.moderationStatus === 'FLAGGED' ? (
        <View
          accessibilityRole="alert"
          className="border-destructive/40 bg-destructive/10 mx-4 mt-5 flex-row items-center gap-3 rounded-2xl border px-4 py-3"
        >
          <Icon as={ShieldAlert} className="text-destructive size-5" />
          <Text className="text-destructive flex-1 font-medium">
            This account has been flagged by the moderation team.
          </Text>
        </View>
      ) : null}

      <View
        accessibilityLabel={statsSummaryLabel(statistics)}
        className="border-border bg-card mx-4 mt-5 flex-row rounded-2xl border px-2 py-4"
      >
        <ProfileStat
          label="Posts"
          value={statistics?.totalPosts}
          loading={statsLoading}
        />
        <Separator orientation="vertical" className="h-12" />
        <ProfileStat
          label="Likes"
          value={statistics?.totalLikes}
          loading={statsLoading}
        />
        <Separator orientation="vertical" className="h-12" />
        <ProfileStat
          label="Views"
          value={statistics?.totalViews}
          loading={statsLoading}
        />
      </View>

      <View className="mt-6 px-2.5">
        <Text className="text-muted-foreground px-2 pb-1 text-sm font-medium uppercase tracking-wide">
          Quick actions
        </Text>
        <View className="flex-row flex-wrap">
          {PROFILE_ACTIONS.map((action) => (
            <ProfileActionCard key={action.href} {...action} />
          ))}
        </View>
      </View>

      {publicLinks.length > 0 ? (
        <View className="mt-4 px-4">
          <Text className="text-muted-foreground pb-2 text-sm font-medium uppercase tracking-wide">
            Connected accounts
          </Text>
          <View className="gap-2">
            {publicLinks.map((account) => {
              const provider = linkedAccountProviderId(account.platform);
              if (!provider) return null;
              const label =
                OAUTH_PROVIDERS.find((option) => option.id === provider)?.label ?? account.platform;
              return (
                <View
                  key={account.id}
                  accessibilityLabel={`${label} linked as ${account.platformUsername}`}
                  className="border-border bg-card flex-row items-center gap-3 rounded-2xl border px-4 py-3"
                >
                  <OauthProviderIcon provider={provider} />
                  <View className="flex-1">
                    <Text className="font-semibold">{label}</Text>
                    <Text variant="muted">{account.platformUsername}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      ) : null}

      <View className="mt-6 px-4">
        <Button
          variant="outline"
          disabled={loggingOut}
          accessibilityLabel="Log out"
          accessibilityHint="Signs you out of Dexbooru"
          onPress={onLogout}
        >
          <Icon as={LogOut} className="size-4" />
          <Text>{loggingOut ? 'Signing out…' : 'Log out'}</Text>
        </Button>
      </View>
    </ScrollView>
  );
}

function SignedOutProfile() {
  return (
    <ScrollView contentContainerClassName="pb-10">
      <View className="bg-primary relative h-32 overflow-hidden">
        <View className="bg-primary-foreground/15 absolute -top-10 -right-8 size-40 rounded-full" />
        <View className="bg-primary-foreground/10 absolute -bottom-12 -left-10 size-36 rounded-full" />
        <View className="absolute top-6 right-6">
          <Icon as={Sparkles} className="text-primary-foreground size-6 opacity-80" />
        </View>
      </View>
      <View className="-mt-16 items-center px-6">
        <UserAvatar username="" profilePictureUrl={null} />
        <Text accessibilityRole="header" className="mt-4 text-2xl font-extrabold tracking-tight">
          Join Dexbooru
        </Text>
        <Text variant="muted" className="mt-2 text-center">
          Sign in to like posts, upload art, and keep your collections in one place.
        </Text>
      </View>
      <View className="mt-8 gap-3 px-4">
        <Link href="/login" asChild>
          <Button accessibilityLabel="Sign in" accessibilityHint="Opens the login screen">
            <Text>Sign in</Text>
          </Button>
        </Link>
        <Link href="/register" asChild>
          <Button
            variant="outline"
            accessibilityLabel="Create an account"
            accessibilityHint="Opens the registration screen"
          >
            <Text>Create an account</Text>
          </Button>
        </Link>
      </View>
    </ScrollView>
  );
}

function ProfileStat({
  label,
  value,
  loading,
}: {
  label: string;
  value?: number;
  loading: boolean;
}) {
  return (
    <View className="flex-1 items-center gap-1">
      {loading && value == null ? (
        <Skeleton className="h-7 w-12 rounded-md" />
      ) : (
        <Text className="text-xl font-extrabold">{formatProfileStat(value)}</Text>
      )}
      <Text variant="muted">{label}</Text>
    </View>
  );
}

function statsSummaryLabel(statistics?: TUserStatistics): string {
  if (!statistics) return 'Profile statistics';
  return `${formatProfileStat(statistics.totalPosts)} posts, ${formatProfileStat(statistics.totalLikes)} likes, ${formatProfileStat(statistics.totalViews)} views`;
}
