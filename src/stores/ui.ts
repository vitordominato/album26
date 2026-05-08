import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { detectLocale, type Locale } from '@/lib/i18n';

interface UIState {
  locale: Locale;
  theme: 'dark' | 'light';
  activeGroupId: string | null;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setActiveGroup: (id: string | null) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      locale: detectLocale(),
      theme: 'dark',
      activeGroupId: null,
      setLocale: (locale) => set({ locale }),
      setTheme: (theme) => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        set({ theme });
      },
      setActiveGroup: (activeGroupId) => set({ activeGroupId }),
    }),
    { name: 'album-ui' }
  )
);
