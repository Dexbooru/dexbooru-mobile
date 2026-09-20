import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { getProfilePictureUrl, getUserInitials } from '@/lib/users';

type UserAvatarProps = {
  username: string;
  profilePictureUrl?: string | null;
  size?: 'lg' | 'xl';
};

const SIZE_CLASS = {
  lg: 'size-24',
  xl: 'size-32',
} as const;

const INITIALS_CLASS = {
  lg: 'text-2xl',
  xl: 'text-3xl',
} as const;

export function UserAvatar({ username, profilePictureUrl, size = 'xl' }: UserAvatarProps) {
  const uri = getProfilePictureUrl(profilePictureUrl);
  const initials = getUserInitials(username);
  const label = username ? `${username}'s profile picture` : 'Profile picture';

  return (
    <Avatar
      className={cn('border-background bg-muted border-4 shadow-lg shadow-black/20', SIZE_CLASS[size])}
      alt={label}
      accessibilityLabel={label}
    >
      {uri ? <AvatarImage source={{ uri }} /> : null}
      <AvatarFallback>
        <Text className={cn('text-foreground font-bold', INITIALS_CLASS[size])}>{initials}</Text>
      </AvatarFallback>
    </Avatar>
  );
}
