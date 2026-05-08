import { useEffect } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { doc, updateDoc } from 'firebase/firestore';
import { db, getMessagingClient, VAPID_KEY } from '@/lib/firebase';
import { useAuthStore } from '@/stores/auth';

export function useFcm() {
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user || !VAPID_KEY) return;
    let unsubMessage: (() => void) | undefined;

    (async () => {
      const messaging = await getMessagingClient();
      if (!messaging) return;

      try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;
        const token = await getToken(messaging, { vapidKey: VAPID_KEY });
        if (token) {
          await updateDoc(doc(db, 'users', user.uid), { fcmToken: token });
        }
        unsubMessage = onMessage(messaging, (payload) => {
          // foreground notification — pode mostrar toast custom
          console.info('[fcm] foreground', payload);
        });
      } catch (err) {
        console.warn('[fcm] init falhou', err);
      }
    })();

    return () => {
      unsubMessage?.();
    };
  }, [user]);
}
