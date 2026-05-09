import { useEffect, useMemo, useState, useCallback } from 'react';
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
import { useUIStore, type ActiveAlbumId } from '@/stores/ui';
import type { CollectionEntry } from '@/types';

export type CollectionContext =
  | { kind: 'personal'; uid: string }
  | { kind: 'group'; groupId: string };

export function contextFromActiveId(active: ActiveAlbumId, fallbackUid: string): CollectionContext {
  if (active.startsWith('group:')) {
    return { kind: 'group', groupId: active.slice('group:'.length) };
  }
  return { kind: 'personal', uid: fallbackUid };
}

function pathFor(ctx: CollectionContext): string[] {
  if (ctx.kind === 'group') return ['groups', ctx.groupId, 'collection'];
  return ['users', ctx.uid, 'collection'];
}

/**
 * Hook unificado da coleção: pode ser pessoal (do usuário logado) ou
 * compartilhada (de um grupo). Sem `ctx` argument, segue o `activeAlbumId`
 * da UI store (default: pessoal).
 */
export function useCollection(ctx?: CollectionContext) {
  const user = useAuthStore((s) => s.user);
  const activeAlbum = useUIStore((s) => s.activeAlbumId);

  const effectiveCtx: CollectionContext | null = useMemo(() => {
    if (ctx) return ctx;
    if (!user) return null;
    return contextFromActiveId(activeAlbum, user.uid);
  }, [ctx, user, activeAlbum]);

  const [entries, setEntries] = useState<Record<string, CollectionEntry>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!effectiveCtx) {
      setEntries({});
      setLoading(false);
      return;
    }
    setLoading(true);
    const ref = collection(db, ...(pathFor(effectiveCtx) as [string, ...string[]]));
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
  }, [effectiveCtx]);

  const setQuantity = useCallback(
    async (stickerId: string, quantity: number) => {
      if (!effectiveCtx) return;
      const path = pathFor(effectiveCtx);
      const ref = doc(db, path[0], path[1], path[2], stickerId);
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
    [effectiveCtx, entries]
  );

  const incrementQty = useCallback(
    async (stickerId: string, by = 1) => {
      if (!effectiveCtx) return;
      const path = pathFor(effectiveCtx);
      const current = entries[stickerId]?.quantity ?? 0;
      const next = Math.max(0, current + by);
      const ref = doc(db, path[0], path[1], path[2], stickerId);
      if (next === 0) {
        await deleteDoc(ref);
        return;
      }
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
    [effectiveCtx, entries]
  );

  return { entries, loading, setQuantity, incrementQty, context: effectiveCtx };
}

/**
 * Hook read-only pra olhar a coleção pessoal de outro usuário.
 * Usado pra ver o progresso/faltantes dos amigos no grupo.
 */
export function useReadOnlyUserCollection(uid: string | null) {
  const [entries, setEntries] = useState<Record<string, CollectionEntry>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setEntries({});
      setLoading(false);
      return;
    }
    setLoading(true);
    const ref = collection(db, 'users', uid, 'collection');
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
  }, [uid]);

  return { entries, loading };
}
