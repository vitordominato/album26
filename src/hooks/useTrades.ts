import { useEffect, useMemo, useState } from 'react';
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  doc,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/stores/auth';
import { useGroupMembers } from '@/hooks/useGroups';
import { useCollection } from '@/hooks/useCollection';
import type { CollectionEntry, MatchSuggestion, Trade, TradeStatus } from '@/types';

export function useTrades(groupId: string | null) {
  const user = useAuthStore((s) => s.user);
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    if (!user || !groupId) {
      setTrades([]);
      return;
    }
    const q = query(
      collection(db, 'trades'),
      where('groupId', '==', groupId),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setTrades(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Trade, 'id'>) })));
    });
    return unsub;
  }, [user, groupId]);

  async function proposeTrade(input: {
    groupId: string;
    toUserId: string;
    toUserName: string;
    fromUserName: string;
    offerStickerIds: string[];
    requestStickerIds: string[];
    message?: string;
  }) {
    if (!user) throw new Error('not-signed-in');
    await addDoc(collection(db, 'trades'), {
      ...input,
      fromUserId: user.uid,
      status: 'pending' as TradeStatus,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  async function updateStatus(tradeId: string, status: TradeStatus) {
    await updateDoc(doc(db, 'trades', tradeId), { status, updatedAt: serverTimestamp() });
  }

  return { trades, proposeTrade, updateStatus };
}

/**
 * Matching client-side (plano Spark, sem Cloud Functions).
 *
 * Para cada outro membro do grupo, abre um listener na coleção dele e cruza
 * com a sua: o que ele tem repetido e você não tem (iCanGet) × o que você
 * tem repetido e ele não tem (iCanGive). É reativo: muda em tempo real.
 */
export function useMatchSuggestionsForGroup(groupId: string | null): MatchSuggestion[] {
  const user = useAuthStore((s) => s.user);
  const { entries: myEntries } = useCollection();
  const members = useGroupMembers(groupId);

  const partners = useMemo(
    () => members.filter((m) => m.userId !== user?.uid),
    [members, user]
  );

  const [collections, setCollections] = useState<Record<string, Record<string, number>>>({});

  useEffect(() => {
    if (!user || !groupId || partners.length === 0) {
      setCollections({});
      return;
    }
    const unsubs = partners.map((p) =>
      onSnapshot(collection(db, 'users', p.userId, 'collection'), (snap) => {
        const next: Record<string, number> = {};
        snap.forEach((d) => {
          next[d.id] = (d.data() as CollectionEntry).quantity ?? 0;
        });
        setCollections((prev) => ({ ...prev, [p.userId]: next }));
      })
    );
    return () => unsubs.forEach((u) => u());
  }, [user, groupId, partners]);

  return useMemo<MatchSuggestion[]>(() => {
    if (!groupId || !user) return [];
    const myMap: Record<string, number> = {};
    Object.values(myEntries).forEach((e) => {
      myMap[e.stickerId] = e.quantity;
    });

    return partners
      .map((p) => {
        const theirs = collections[p.userId] ?? {};
        const iCanGet: string[] = [];
        const iCanGive: string[] = [];
        for (const [id, qty] of Object.entries(theirs)) {
          if (qty > 1 && (myMap[id] ?? 0) === 0) iCanGet.push(id);
        }
        for (const [id, qty] of Object.entries(myMap)) {
          if (qty > 1 && (theirs[id] ?? 0) === 0) iCanGive.push(id);
        }
        const score = Math.min(iCanGet.length, iCanGive.length);
        return {
          id: `${groupId}_${p.userId}`,
          groupId,
          partnerUserId: p.userId,
          partnerName: p.displayName,
          iCanGive: iCanGive.slice(0, 50),
          iCanGet: iCanGet.slice(0, 50),
          score,
          updatedAt: new Date(),
        } satisfies MatchSuggestion;
      })
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [partners, collections, myEntries, groupId, user]);
}
