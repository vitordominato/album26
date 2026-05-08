import { initializeApp } from 'firebase/app';
import {
  getFirestore, doc, getDoc, setDoc, updateDoc, onSnapshot, deleteField,
} from 'firebase/firestore';

// Configuração do Firebase — variáveis vêm do arquivo .env
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const albumRef = (code) => doc(db, 'albums', code);

// ============== Firestore (álbuns compartilhados) ==============

export async function loadAlbum(code) {
  try {
    const snap = await getDoc(albumRef(code));
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.error('loadAlbum:', err);
    return null;
  }
}

export async function saveAlbum(code, data) {
  try {
    await setDoc(albumRef(code), data);
    return true;
  } catch (err) {
    console.error('saveAlbum:', err);
    return false;
  }
}

/**
 * Inscreve em mudanças do álbum em tempo real.
 * Devolve uma função para cancelar a inscrição.
 */
export function subscribeAlbum(code, onData, onError) {
  return onSnapshot(
    albumRef(code),
    (snap) => {
      if (snap.exists()) onData(snap.data());
    },
    (err) => {
      console.error('subscribeAlbum:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Atualiza figurinhas individuais sem reescrever o documento inteiro.
 * `updates` é um objeto { 'BRA-1': {count: 1}, 'FWC-3': null, ... }
 * Valor null = deletar a entrada.
 */
export async function applyUpdates(code, updates) {
  try {
    const payload = { updatedAt: Date.now() };
    Object.entries(updates).forEach(([k, v]) => {
      payload[`stickers.${k}`] = v === null ? deleteField() : v;
    });
    await updateDoc(albumRef(code), payload);
    return true;
  } catch (err) {
    console.error('applyUpdates:', err);
    return false;
  }
}

// ============== localStorage (lista pessoal de álbuns) ==============

const MY_ALBUMS_KEY = 'album-copa-2026:my-albums';

export async function loadMyAlbums() {
  try {
    const raw = localStorage.getItem(MY_ALBUMS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveMyAlbums(list) {
  try {
    localStorage.setItem(MY_ALBUMS_KEY, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}
