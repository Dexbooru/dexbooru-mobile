import { Stack } from 'expo-router';

export default function PostsStack() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Posts' }} />
      <Stack.Screen name="[postId]" options={{ title: 'Post' }} />
      <Stack.Screen name="upload" options={{ title: 'Upload' }} />
      <Stack.Screen name="liked" options={{ title: 'Liked' }} />
      <Stack.Screen name="uploaded" options={{ title: 'Uploaded' }} />
      <Stack.Screen name="tag" options={{ title: 'Tag' }} />
      <Stack.Screen name="artist" options={{ title: 'Artist' }} />
      <Stack.Screen name="character" options={{ title: 'Character' }} />
      <Stack.Screen name="source" options={{ title: 'Source' }} />
    </Stack>
  );
}
