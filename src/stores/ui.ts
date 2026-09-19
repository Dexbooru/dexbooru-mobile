import { create } from 'zustand';

import type { TPostCollection } from '@/types/collections';
import type { THiddenPagePostData, TPost } from '@/types/posts';

type UiState = {
  activeModal: string | null;
  hiddenPosts: THiddenPagePostData;
  nsfwPosts: TPost[];
  nsfwCollections: TPostCollection[];
  setActiveModal: (name: string | null) => void;
  setHiddenPosts: (hiddenPosts: THiddenPagePostData) => void;
  setNsfwPosts: (posts: TPost[]) => void;
  setNsfwCollections: (collections: TPostCollection[]) => void;
};

export const useUiStore = create<UiState>((set) => ({
  activeModal: null,
  hiddenPosts: { nsfwPosts: [], blacklistedPosts: [] },
  nsfwPosts: [],
  nsfwCollections: [],
  setActiveModal: (activeModal) => set({ activeModal }),
  setHiddenPosts: (hiddenPosts) => set({ hiddenPosts }),
  setNsfwPosts: (nsfwPosts) => set({ nsfwPosts }),
  setNsfwCollections: (nsfwCollections) => set({ nsfwCollections }),
}));
