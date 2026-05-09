import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { detectLocale, type Locale } from '@/lib/i18n';

/**
 * activeAlbumId define qual álbum está sendo editado:
 * - 'personal'         → users/{uid}/collection
 * - 'group:<groupId>'  → groups/{groupId}/collection (compartilhado)
 */
export type ActiveAlbumId = 'personal' | `group:${string}`;

interface UIState {
  locale: Locale;
  theme: 'dark' | 'light';
  activeGroupId: string | null;
  activeAlbumId: ActiveAlbumId;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setActiveGroup: (id: string | null) => void;
  setActiveAlbum: (id: ActiveAlbumId) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      locale: detectLocale(),
      theme: 'dark',
      activeGroupId: null,
      activeAlbumId: 'personal',
      setLocale: (locale) => set({ locale }),
      setTheme: (theme) => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        set({ theme });
      },
      setActiveGroup: (activeGroupId) => set({ activeGroupId }),
      setActiveAlbum: (activeAlbumId) => set({ activeAlbumId }),
    }),
    { name: 'album-ui' }
  )
);
