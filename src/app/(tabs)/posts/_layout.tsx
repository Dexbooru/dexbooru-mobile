import { Stack } from 'expo-router';

export default function PostsStack() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Posts', animation: 'none' }} />
      <Stack.Screen name="[postId]" options={{ title: 'Post' }} />
      <Stack.Screen name="upload" options={{ title: 'Upload' }} />
      <Stack.Screen name="liked" options={{ title: 'Liked', animation: 'none' }} />
      <Stack.Screen name="uploaded" options={{ title: 'Uploaded', animation: 'none' }} />
      <Stack.Screen name="tag" options={{ title: 'Tag' }} />
      <Stack.Screen name="artist" options={{ title: 'Artist' }} />
      <Stack.Screen name="character" options={{ title: 'Character' }} />
      <Stack.Screen name="source" options={{ title: 'Source' }} />
    </Stack>
  );
}
