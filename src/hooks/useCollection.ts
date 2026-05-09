import { useEffect, useState, useCallback } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  deleteDoc,
  increment,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/stores/auth';
import type { CollectionEntry } from '@/types';

export function useCollection() {
  const user = useAuthStore((s) => s.user);
  const [entries, setEntries] = useState<Record<string, CollectionEntry>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setEntries({});
      setLoading(false);
      return;
    }
    const ref = collection(db, 'users', user.uid, 'collection');
    const unsub = onSnapshot(
      ref,
      (snap) => {
        const next: Record<string, CollectionEntry> = {};
        snap.forEach((d) => {
          next[d.id] = { stickerId: d.id, ...(d.data() as Omit<CollectionEntry, 'stickerId'>) };
        });
        setEntries(next);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, [user]);

  const setQuantity = useCallback(
    async (stickerId: string, quantity: number) => {
      if (!user) return;
      const ref = doc(db, 'users', user.uid, 'collection', stickerId);
      if (quantity <= 0) {
        await deleteDoc(ref);
        return;
      }
      await setDoc(
        ref,
        {
          quantity,
          obtainedAt: entries[stickerId]?.obtainedAt ?? serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    },
    [user, entries]
  );

  const incrementQty = useCallback(
    async (stickerId: string, by = 1) => {
      if (!user) return;
      const current = entries[stickerId]?.quantity ?? 0;
      const next = Math.max(0, current + by);
      if (next === 0) {
        await deleteDoc(doc(db, 'users', user.uid, 'collection', stickerId));
        return;
      }
      const ref = doc(db, 'users', user.uid, 'collection', stickerId);
      if (current === 0) {
        await setDoc(ref, {
          quantity: next,
          obtainedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else {
        await updateDoc(ref, { quantity: increment(by), updatedAt: serverTimestamp() });
      }
    },
    [user, entries]
  );

  return { entries, loading, setQuantity, incrementQty };
}
