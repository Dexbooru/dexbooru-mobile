import { PortalHost } from '@rn-primitives/portal';
import { Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { NAV_THEME } from '@/lib/theme';
import { AppProviders } from '@/providers/app-providers';

import '../global.css';

export default function RootLayout() {
  const scheme = useColorScheme();
  const colorScheme = scheme === 'dark' ? 'dark' : 'light';

  return (
    <View className={colorScheme === 'dark' ? 'dark flex-1' : 'flex-1'}>
      <ThemeProvider value={NAV_THEME[colorScheme]}>
        <AppProviders>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="oauth" />
            <Stack.Screen name="tags" />
            <Stack.Screen name="artists" />
            <Stack.Screen name="comments" />
            <Stack.Screen name="moderation" />
            <Stack.Screen name="analytics" />
            <Stack.Screen name="similarity-search" options={{ headerShown: true, title: 'Similarity' }} />
          </Stack>
          <PortalHost />
        </AppProviders>
      </ThemeProvider>
    </View>
  );
}
