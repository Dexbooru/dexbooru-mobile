export const queryKeys = {
  posts: {
    all: ['posts'] as const,
    list: (params: Record<string, unknown>) => ['posts', 'list', params] as const,
    detail: (postId: string) => ['posts', 'detail', postId] as const,
    comments: (postId: string, parentCommentId: string | null) =>
      ['posts', 'comments', postId, parentCommentId] as const,
  },
  collections: {
    all: ['collections'] as const,
    list: (params: Record<string, unknown>) => ['collections', 'list', params] as const,
    detail: (collectionId: string) => ['collections', 'detail', collectionId] as const,
    byUser: (username: string) => ['collections', 'user', username] as const,
  },
  tags: {
    letter: (letter: string) => ['tags', letter] as const,
    metadata: (name: string) => ['tags', 'metadata', name] as const,
  },
  artists: {
    letter: (letter: string) => ['artists', letter] as const,
    metadata: (name: string) => ['artists', 'metadata', name] as const,
  },
  search: (params: Record<string, unknown>) => ['search', params] as const,
  user: {
    self: ['users', 'self'] as const,
    profile: (username: string) => ['users', username] as const,
    posts: (username: string) => ['users', username, 'posts'] as const,
  },
  notifications: ['notifications'] as const,
  comments: {
    chain: (commentId: string) => ['comments', 'chain', commentId] as const,
    byUser: (authorId: string) => ['comments', 'user', authorId] as const,
  },
  config: ['application-configuration'] as const,
  oauth: {
    authorizationUrls: ['oauth', 'authorization-urls'] as const,
  },
  totp: {
    challenge: (challengeId: string) => ['totp', 'challenge', challengeId] as const,
  },
};
