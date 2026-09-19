import { create } from 'zustand';

import {
  APPLICATION_CONFIGURATION_DEFAULTS,
  type TApplicationConfiguration,
} from '@/types/application-configuration';

type ConfigState = {
  configuration: TApplicationConfiguration | null;
  setConfiguration: (configuration: TApplicationConfiguration | null) => void;
};

export const useConfigStore = create<ConfigState>((set) => ({
  configuration: {
    id: 'singleton',
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
    ...APPLICATION_CONFIGURATION_DEFAULTS,
  },
  setConfiguration: (configuration) => set({ configuration }),
}));
