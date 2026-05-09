import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Sticker, Team } from '@/types';
import { TEAMS_SEED } from '@/lib/data/teams';
import { buildAllStickers } from '@/lib/data/stickers';

export function useTeams() {
  return useQuery<Team[]>({
    queryKey: ['teams'],
    queryFn: async () => {
      const snap = await getDocs(query(collection(db, 'teams'), orderBy('order', 'asc')));
      if (snap.empty) {
        // Fallback para o catálogo local enquanto o seed não roda
        return TEAMS_SEED;
      }
      return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Team, 'id'>) }));
    },
    staleTime: 1000 * 60 * 60,
  });
}

export function useStickers() {
  return useQuery<Sticker[]>({
    queryKey: ['stickers'],
    queryFn: async () => {
      const snap = await getDocs(query(collection(db, 'stickers'), orderBy('number', 'asc')));
      if (snap.empty) {
        return buildAllStickers(TEAMS_SEED);
      }
      return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Sticker, 'id'>) }));
    },
    staleTime: 1000 * 60 * 60,
  });
}
