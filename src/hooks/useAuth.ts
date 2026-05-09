import { useEffect } from 'react';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider, appleProvider } from '@/lib/firebase';
import { useAuthStore } from '@/stores/auth';
import type { UserProfile } from '@/types';

export function useAuth() {
  const { user, profile, loading, setUser, setProfile, setLoading } = useAuthStore();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const ref = doc(db, 'users', firebaseUser.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProfile({ uid: firebaseUser.uid, ...snap.data() } as UserProfile);
        } else {
          // primeiro login: cria perfil mínimo (onboarding finaliza depois)
          const newProfile: Partial<UserProfile> = {
            email: firebaseUser.email,
            displayName: firebaseUser.displayName ?? firebaseUser.email?.split('@')[0] ?? 'Jogador',
            photoURL: firebaseUser.photoURL,
            createdAt: serverTimestamp() as unknown as Date,
          };
          await setDoc(ref, newProfile);
          setProfile({ ...(newProfile as UserProfile), uid: firebaseUser.uid });
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, [setUser, setProfile, setLoading]);

  return {
    user,
    profile,
    loading,
    isSignedIn: !!user,
    signInGoogle: () => signInWithPopup(auth, googleProvider),
    signInApple: () => signInWithPopup(auth, appleProvider),
    signInEmail: (email: string, password: string) =>
      signInWithEmailAndPassword(auth, email, password),
    signUpEmail: async (email: string, password: string, displayName: string) => {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName });
      return cred;
    },
    signOut: () => signOut(auth),
    updateUserProfile: async (updates: Partial<UserProfile>) => {
      const fbUser: User | null = auth.currentUser;
      if (!fbUser) throw new Error('not-signed-in');
      const ref = doc(db, 'users', fbUser.uid);
      await updateDoc(ref, { ...updates, updatedAt: serverTimestamp() });
      if (updates.displayName || updates.photoURL !== undefined) {
        await updateProfile(fbUser, {
          displayName: updates.displayName ?? fbUser.displayName,
          photoURL: updates.photoURL ?? fbUser.photoURL,
        });
      }
      setProfile({ ...(profile as UserProfile), ...updates });
    },
  };
}
