export type UserRole = 'OWNER' | 'MODERATOR' | 'USER';
export type UserModerationStatus = 'FLAGGED' | 'UNFLAGGED';

export type TLinkedAccount = {
  id: string;
  platform: string;
  platformUsername: string;
  isPublic: boolean;
};

export type TUser = {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  profilePictureUrl: string;
  role: UserRole;
  moderationStatus: UserModerationStatus;
  createdAt: string;
  updatedAt: string;
  superRolePromotionAt: string | null;
  linkedAccounts: TLinkedAccount[];
};

export type TUserPreferences = {
  userId: string;
  twoFactorAuthenticationEnabled: boolean;
  browseInSafeMode: boolean;
  autoBlurNsfw: boolean;
  blacklistedTags: string[];
  blacklistedArtists: string[];
  customSideWideCss: string;
  hidePostMetadataOnPreview: boolean;
  hideCollectionMetadataOnPreview: boolean;
  hideImageCarousel: boolean;
  createdAt: string;
  updatedAt: string;
};
