import { useEffect, useState } from 'react';
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
import type { MatchSuggestion, Trade, TradeStatus } from '@/types';

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

export function useMatchSuggestions() {
  const user = useAuthStore((s) => s.user);
  const [suggestions, setSuggestions] = useState<MatchSuggestion[]>([]);

  useEffect(() => {
    if (!user) {
      setSuggestions([]);
      return;
    }
    const ref = collection(db, 'matches', user.uid, 'suggestions');
    const unsub = onSnapshot(ref, (snap) => {
      setSuggestions(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<MatchSuggestion, 'id'>) }))
      );
    });
    return unsub;
  }, [user]);

  return suggestions;
}
