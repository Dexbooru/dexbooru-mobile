import * as WebBrowser from 'expo-web-browser';
import { ActivityIndicator, View } from 'react-native';

import { Text } from '@/components/ui/text';

WebBrowser.maybeCompleteAuthSession();

export default function OauthProcessScreen() {
  return (
    <View className="bg-background flex-1 items-center justify-center gap-3 p-6">
      <ActivityIndicator />
      <Text variant="muted">Completing sign-in…</Text>
    </View>
  );
}
