import { Stack } from 'expo-router';

export default function CollectionsStack() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Collections' }} />
      <Stack.Screen name="[collectionId]" options={{ title: 'Collection' }} />
    </Stack>
  );
}
