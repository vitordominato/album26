import { useEffect, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/stores/auth';

type PickEntry = { homeScore: number; awayScore: number };

/**
 * Subscreve em /groups/{gid}/picks (todos os palpites de todos os membros).
 * Cada documento tem id = `${uid}_${matchNum}`.
 */
export function useGroupBets(groupId: string | null) {
  const user = useAuthStore((s) => s.user);
  const [picksByUser, setPicksByUser] = useState<Record<string, Record<number, PickEntry>>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!groupId) {
      setPicksByUser({});
      setLoading(false);
      return;
    }
    setLoading(true);
    const ref = collection(db, 'groups', groupId, 'picks');
    const unsub = onSnapshot(
      ref,
      (snap) => {
        const next: Record<string, Record<number, PickEntry>> = {};
        snap.forEach((d) => {
          const data = d.data() as {
            uid?: string;
            matchNum?: number;
            homeScore?: number;
            awayScore?: number;
          };
          if (
            !data.uid ||
            typeof data.matchNum !== 'number' ||
            typeof data.homeScore !== 'number' ||
            typeof data.awayScore !== 'number'
          ) {
            return;
          }
          (next[data.uid] ??= {})[data.matchNum] = {
            homeScore: data.homeScore,
            awayScore: data.awayScore,
          };
        });
        setPicksByUser(next);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, [groupId]);

  async function setPick(matchNum: number, homeScore: number, awayScore: number) {
    if (!groupId || !user) throw new Error('Sem grupo ativo ou usuário deslogado');
    const id = `${user.uid}_${matchNum}`;
    const ref = doc(db, 'groups', groupId, 'picks', id);
    await setDoc(ref, {
      uid: user.uid,
      matchNum,
      homeScore,
      awayScore,
      updatedAt: serverTimestamp(),
    });
  }

  async function clearPick(matchNum: number) {
    if (!groupId || !user) throw new Error('Sem grupo ativo');
    const id = `${user.uid}_${matchNum}`;
    const ref = doc(db, 'groups', groupId, 'picks', id);
    await deleteDoc(ref);
  }

  const myPicks = user ? picksByUser[user.uid] ?? {} : {};

  return { picksByUser, myPicks, loading, setPick, clearPick };
}
