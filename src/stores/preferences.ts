import { create } from 'zustand';

import type { TUserPreferences } from '@/types/users';

type PreferencesState = {
  preferences: TUserPreferences | null;
  setPreferences: (preferences: TUserPreferences | null) => void;
};

export const usePreferencesStore = create<PreferencesState>((set) => ({
  preferences: null,
  setPreferences: (preferences) => set({ preferences }),
}));
