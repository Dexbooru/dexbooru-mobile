import { create } from 'zustand';

import type { TUser } from '@/types/users';

type AuthState = {
  user: TUser | null;
  isHydrated: boolean;
  setUser: (user: TUser | null) => void;
  setHydrated: (isHydrated: boolean) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isHydrated: false,
  setUser: (user) => set({ user }),
  setHydrated: (isHydrated) => set({ isHydrated }),
  clear: () => set({ user: null }),
}));
