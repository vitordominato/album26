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
import type { Scores } from '@/lib/standings';

export function useGroupMatches(groupId: string | null) {
  const user = useAuthStore((s) => s.user);
  const [scores, setScores] = useState<Scores>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!groupId) {
      setScores({});
      setLoading(false);
      return;
    }
    setLoading(true);
    const ref = collection(db, 'groups', groupId, 'matches');
    const unsub = onSnapshot(
      ref,
      (snap) => {
        const next: Scores = {};
        snap.forEach((d) => {
          const data = d.data() as {
            homeScore?: number;
            awayScore?: number;
            homePens?: number;
            awayPens?: number;
          };
          if (
            typeof data.homeScore === 'number' &&
            typeof data.awayScore === 'number'
          ) {
            next[Number(d.id)] = {
              homeScore: data.homeScore,
              awayScore: data.awayScore,
              ...(typeof data.homePens === 'number' &&
              typeof data.awayPens === 'number'
                ? { homePens: data.homePens, awayPens: data.awayPens }
                : {}),
            };
          }
        });
        setScores(next);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, [groupId]);

  async function setScore(
    matchNum: number,
    homeScore: number,
    awayScore: number,
    pens?: { homePens: number; awayPens: number } | null
  ) {
    if (!groupId || !user) throw new Error('Sem grupo ativo ou usuário deslogado');
    const ref = doc(db, 'groups', groupId, 'matches', String(matchNum));
    // setDoc sem merge sobrescreve o doc inteiro, então omitir os pênaltis
    // já os remove quando não forem informados.
    await setDoc(ref, {
      homeScore,
      awayScore,
      ...(pens ? { homePens: pens.homePens, awayPens: pens.awayPens } : {}),
      updatedBy: user.uid,
      updatedAt: serverTimestamp(),
    });
  }

  async function clearScore(matchNum: number) {
    if (!groupId) throw new Error('Sem grupo ativo');
    const ref = doc(db, 'groups', groupId, 'matches', String(matchNum));
    await deleteDoc(ref);
  }

  return { scores, loading, setScore, clearScore };
}
