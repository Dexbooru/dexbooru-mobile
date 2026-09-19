export type TSearchSection = 'posts' | 'tags' | 'artists' | 'users' | 'collections' | 'all';

export type TAppSearchParams = {
  query: string;
  searchSection?: TSearchSection;
  limit?: number;
};

export type TPostCollectionSearchResults = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  uploaderName: string;
  uploaderProfilePictureUrl: string;
}[];

export type TPostSearchResults = {
  id: string;
  description: string;
  createdAt: string;
  uploaderName: string;
  uploaderProfilePictureUrl: string;
}[];

export type TUserSearchResults = {
  id: string;
  createdAt: string;
  username: string;
  profilePictureUrl: string;
}[];

export type TLabelSearchResult = {
  id: string;
  name: string;
};

export type TAppSearchResult = {
  posts?: TPostSearchResults;
  users?: TUserSearchResults;
  tags?: TLabelSearchResult[];
  artists?: TLabelSearchResult[];
  collections?: TPostCollectionSearchResults;
};
