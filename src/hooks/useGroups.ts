import { useEffect, useState } from 'react';
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/stores/auth';
import { generateInviteCode } from '@/lib/utils';
import type { Group, GroupMember } from '@/types';

export function useGroups() {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setGroups([]);
      setLoading(false);
      return;
    }
    const q = query(collection(db, 'groups'), where('memberIds', 'array-contains', user.uid));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setGroups(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Group, 'id'>) })));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, [user]);

  async function createGroup(name: string): Promise<Group> {
    if (!user || !profile) throw new Error('not-signed-in');
    const inviteCode = generateInviteCode();
    const data = {
      name: name.trim(),
      inviteCode,
      createdBy: user.uid,
      createdAt: serverTimestamp(),
      memberIds: [user.uid],
    };
    const ref = await addDoc(collection(db, 'groups'), data);
    const memberRef = doc(db, 'groups', ref.id, 'members', user.uid);
    await setDoc(memberRef, {
      role: 'owner',
      joinedAt: serverTimestamp(),
      displayName: profile.displayName,
      photoURL: profile.photoURL,
    } satisfies Omit<GroupMember, 'userId'>);
    return { id: ref.id, ...(data as unknown as Omit<Group, 'id'>) };
  }

  async function joinGroupByCode(code: string): Promise<Group> {
    if (!user || !profile) throw new Error('not-signed-in');
    const cleaned = code.trim().toUpperCase();
    const q = query(collection(db, 'groups'), where('inviteCode', '==', cleaned), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) throw new Error('group-not-found');
    const docSnap = snap.docs[0];
    const groupId = docSnap.id;
    const groupData = docSnap.data() as Omit<Group, 'id'>;

    if (!groupData.memberIds.includes(user.uid)) {
      await updateDoc(doc(db, 'groups', groupId), {
        memberIds: arrayUnion(user.uid),
      });
      await setDoc(doc(db, 'groups', groupId, 'members', user.uid), {
        role: 'member',
        joinedAt: serverTimestamp(),
        displayName: profile.displayName,
        photoURL: profile.photoURL,
      } satisfies Omit<GroupMember, 'userId'>);
    }
    return { id: groupId, ...groupData };
  }

  async function leaveGroup(groupId: string) {
    if (!user) throw new Error('not-signed-in');
    await updateDoc(doc(db, 'groups', groupId), { memberIds: arrayRemove(user.uid) });
  }

  return { groups, loading, createGroup, joinGroupByCode, leaveGroup };
}

export function useGroupMembers(groupId: string | null) {
  const [members, setMembers] = useState<(GroupMember & { userId: string })[]>([]);
  useEffect(() => {
    if (!groupId) {
      setMembers([]);
      return;
    }
    const ref = collection(db, 'groups', groupId, 'members');
    const unsub = onSnapshot(ref, (snap) => {
      setMembers(
        snap.docs.map((d) => ({
          userId: d.id,
          ...(d.data() as Omit<GroupMember, 'userId'>),
        }))
      );
    });
    return unsub;
  }, [groupId]);
  return members;
}
