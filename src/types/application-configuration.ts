export type TApplicationConfiguration = {
  id: string;
  maximumTagLength: number;
  maximumArtistLength: number;
  maximumTagDescriptionLength: number;
  maximumArtistDescriptionLength: number;
  maximumArtistSocialMediaLength: number;
  maximumArtistSocialMediasLength: number;
  maximumLabelsPerPage: number;
  maximumBlacklistedTags: number;
  maximumBlacklistedArtists: number;
  maximumSourceLinkLength: number;
  maximumPostsPerPage: number;
  maximumSimilarPostsPerPost: number;
  maximumTagsPerPost: number;
  maximumArtistsPerPost: number;
  maximumPostDescriptionLength: number;
  maximumCommentsPerPost: number;
  maximumDuplicatesToSearchOnPostUpload: number;
  maximumImagesPerPost: number;
  maximumPostImageUploadSizeMb: number;
  maximumProfilePictureImageUploadSizeMb: number;
  maximumCollectionThumbnailSizeMb: number;
  maximumCommentContentLength: number;
  maximumCommentsPerPage: number;
  maximumCollectionTitleLength: number;
  maximumCollectionDescriptionLength: number;
  maximumPostsPerCollection: number;
  maximumCollectionsPerPage: number;
  minimumUsernameLength: number;
  maximumUsernameLength: number;
  minimumPasswordLength: number;
  maximumPasswordLength: number;
  maximumSiteWideCssLength: number;
  maximumReportReasonDescriptionLength: number;
  maximumReportsPerPage: number;
  maximumTagsPerPage: number;
  maximumArtistsPerPage: number;
  likePostRateLimitMax: number;
  likePostRateLimitWindowMs: number;
  createdAt: string;
  updatedAt: string;
};

export const APPLICATION_CONFIGURATION_DEFAULTS: Omit<
  TApplicationConfiguration,
  'id' | 'createdAt' | 'updatedAt'
> = {
  maximumTagLength: 75,
  maximumArtistLength: 75,
  maximumTagDescriptionLength: 200,
  maximumArtistDescriptionLength: 200,
  maximumArtistSocialMediaLength: 450,
  maximumArtistSocialMediasLength: 5,
  maximumLabelsPerPage: 100,
  maximumBlacklistedTags: 50,
  maximumBlacklistedArtists: 50,
  maximumSourceLinkLength: 450,
  maximumPostsPerPage: 27,
  maximumSimilarPostsPerPost: 6,
  maximumTagsPerPost: 20,
  maximumArtistsPerPost: 5,
  maximumPostDescriptionLength: 500,
  maximumCommentsPerPost: 100,
  maximumDuplicatesToSearchOnPostUpload: 2,
  maximumImagesPerPost: 3,
  maximumPostImageUploadSizeMb: 3.5,
  maximumProfilePictureImageUploadSizeMb: 1.75,
  maximumCollectionThumbnailSizeMb: 3.5,
  maximumCommentContentLength: 1500,
  maximumCommentsPerPage: 35,
  maximumCollectionTitleLength: 100,
  maximumCollectionDescriptionLength: 250,
  maximumPostsPerCollection: 15,
  maximumCollectionsPerPage: 28,
  minimumUsernameLength: 4,
  maximumUsernameLength: 12,
  minimumPasswordLength: 8,
  maximumPasswordLength: 50,
  maximumSiteWideCssLength: 1000,
  maximumReportReasonDescriptionLength: 250,
  maximumReportsPerPage: 30,
  maximumTagsPerPage: 100,
  maximumArtistsPerPage: 100,
  likePostRateLimitMax: 10,
  likePostRateLimitWindowMs: 60000,
};
