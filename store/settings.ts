'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language } from '@/lib/types';

interface SettingsState {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'notter-settings',
      skipHydration: typeof window === 'undefined',
    }
  )
);