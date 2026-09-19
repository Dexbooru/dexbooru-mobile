import { Link } from 'expo-router';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';

type ScreenStubProps = {
  title: string;
  description: string;
  webPath: string;
};

export function ScreenStub({ title, description, webPath }: ScreenStubProps) {
  return (
    <View className="bg-background flex-1 gap-3 p-6">
      <Text variant="h3">{title}</Text>
      <Text className="text-muted-foreground">{description}</Text>
      <Text className="text-muted-foreground text-sm">
        Web route: {webPath}. Product UI ships in a follow-up GitHub issue; this screen is a
        navigation stub.
      </Text>
      <Link href="/posts" className="text-primary mt-4">
        <Text className="text-primary">Back to posts</Text>
      </Link>
    </View>
  );
}
