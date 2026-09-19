import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import { type ReactNode, useEffect, useState } from 'react';
import { View } from 'react-native';

import { getApplicationConfiguration } from '@/api/application-configuration';
import { getSelf } from '@/api/auth';
import { getSessionCookie } from '@/api/session-cookies';
import { useAuthStore } from '@/stores/auth';
import { useConfigStore } from '@/stores/config';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 30_000,
    },
  },
});

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionBootstrap>{children}</SessionBootstrap>
    </QueryClientProvider>
  );
}

function SessionBootstrap({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);
  const setHydrated = useAuthStore((state) => state.setHydrated);
  const setConfiguration = useConfigStore((state) => state.setConfiguration);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      try {
        const configuration = await getApplicationConfiguration();
        if (!cancelled) setConfiguration(configuration);
      } catch {
        // Keep compiled defaults until the instance is reachable.
      }

      try {
        const cookie = await getSessionCookie();
        if (cookie) {
          const { user } = await getSelf();
          if (!cancelled) setUser(user);
        }
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) {
          setHydrated(true);
          setReady(true);
          await SplashScreen.hideAsync().catch(() => undefined);
        }
      }
    }

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, [setConfiguration, setHydrated, setUser]);

  if (!ready) {
    return <View className="bg-background flex-1" />;
  }

  return children;
}
