import { Link, type Href } from 'expo-router';
import type { LucideIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

type ProfileActionCardProps = {
  href: Href;
  label: string;
  hint: string;
  icon: LucideIcon;
  iconClassName: string;
  iconWrapClassName: string;
};

export function ProfileActionCard({
  href,
  label,
  hint,
  icon,
  iconClassName,
  iconWrapClassName,
}: ProfileActionCardProps) {
  return (
    <View className="w-1/2 p-1.5">
      <Link href={href} asChild>
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={label}
          accessibilityHint={hint}
          className="border-border bg-card min-h-28 justify-center gap-3 rounded-2xl border px-3 py-4 active:opacity-80"
        >
          <View className={cn('size-11 items-center justify-center rounded-full', iconWrapClassName)}>
            <Icon as={icon} className={cn('size-5', iconClassName)} />
          </View>
          <Text className="font-semibold">{label}</Text>
        </Pressable>
      </Link>
    </View>
  );
}
