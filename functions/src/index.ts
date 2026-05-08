/**
 * Cloud Functions do Álbum Copa 2026.
 *
 * - recalculateMatches: trigger no Firestore que recalcula sugestões de
 *   troca quando a coleção de qualquer membro muda.
 * - onTradeUpdated: cria notificação quando uma troca muda de estado.
 * - notifyOnMatch: dispara push (FCM) quando aparece um match novo.
 */
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { setGlobalOptions } from 'firebase-functions/v2/options';
import { logger } from 'firebase-functions/v2';
import { initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

initializeApp();
setGlobalOptions({ region: 'southamerica-east1', maxInstances: 10 });

const db = getFirestore();

interface CollectionEntry {
  quantity: number;
}

interface MatchData {
  partnerUserId: string;
  partnerName: string;
  iCanGive: string[];
  iCanGet: string[];
  score: number;
  groupId: string;
  updatedAt: FirebaseFirestore.FieldValue;
}

/**
 * Quando a coleção de um usuário muda, recalcula matches dele com cada
 * membro de cada grupo do qual ele faz parte.
 */
export const recalculateMatches = onDocumentWritten(
  'users/{userId}/collection/{stickerId}',
  async (event) => {
    const userId = event.params.userId;
    logger.info('[matches] Recalculando para', userId);

    const groupsSnap = await db
      .collection('groups')
      .where('memberIds', 'array-contains', userId)
      .get();

    if (groupsSnap.empty) return;

    const myCollection = await loadCollection(userId);

    for (const groupDoc of groupsSnap.docs) {
      const group = groupDoc.data();
      const partnerIds: string[] = (group.memberIds ?? []).filter((id: string) => id !== userId);

      for (const partnerId of partnerIds) {
        await computeAndStoreMatch({
          forUserId: userId,
          partnerId,
          groupId: groupDoc.id,
          myCollection,
        });
        // Também recalcula na direção oposta para o parceiro
        const partnerCollection = await loadCollection(partnerId);
        await computeAndStoreMatch({
          forUserId: partnerId,
          partnerId: userId,
          groupId: groupDoc.id,
          myCollection: partnerCollection,
        });
      }
    }
  }
);

async function loadCollection(uid: string): Promise<Map<string, number>> {
  const snap = await db.collection('users').doc(uid).collection('collection').get();
  const map = new Map<string, number>();
  snap.forEach((d) => {
    map.set(d.id, (d.data() as CollectionEntry).quantity ?? 0);
  });
  return map;
}

async function loadProfileName(uid: string): Promise<string> {
  const snap = await db.collection('users').doc(uid).get();
  return (snap.data()?.displayName as string) ?? 'Jogador';
}

async function computeAndStoreMatch(input: {
  forUserId: string;
  partnerId: string;
  groupId: string;
  myCollection: Map<string, number>;
}) {
  const { forUserId, partnerId, groupId, myCollection } = input;
  const partnerCollection = await loadCollection(partnerId);

  // iCanGive: figurinhas que tenho repetida (qty > 1) e o parceiro não tem
  const iCanGive: string[] = [];
  for (const [id, qty] of myCollection) {
    if (qty > 1 && (partnerCollection.get(id) ?? 0) === 0) iCanGive.push(id);
  }
  // iCanGet: figurinhas que faltam pra mim (qty == 0) e o parceiro tem repetida
  const iCanGet: string[] = [];
  for (const [id, qty] of partnerCollection) {
    if (qty > 1 && (myCollection.get(id) ?? 0) === 0) iCanGet.push(id);
  }

  const matchId = `${groupId}_${partnerId}`;
  const ref = db
    .collection('matches')
    .doc(forUserId)
    .collection('suggestions')
    .doc(matchId);

  if (iCanGive.length === 0 || iCanGet.length === 0) {
    await ref.delete().catch(() => undefined);
    return;
  }

  const score = Math.min(iCanGive.length, iCanGet.length);
  const partnerName = await loadProfileName(partnerId);
  const data: MatchData = {
    partnerUserId: partnerId,
    partnerName,
    iCanGive: iCanGive.slice(0, 50),
    iCanGet: iCanGet.slice(0, 50),
    score,
    groupId,
    updatedAt: FieldValue.serverTimestamp(),
  };
  const before = await ref.get();
  await ref.set(data, { merge: true });

  // Se é um match novo (não existia antes) e o score é decente, dispara FCM
  if (!before.exists && score >= 3) {
    await sendMatchNotification(forUserId, partnerName, score);
  }
}

async function sendMatchNotification(uid: string, partnerName: string, score: number) {
  const userSnap = await db.collection('users').doc(uid).get();
  const token = userSnap.data()?.fcmToken as string | undefined;

  // Salva notificação no Firestore independentemente do FCM
  await db.collection('notifications').doc(uid).collection('items').add({
    type: 'trade_match',
    message: `Novo match com ${partnerName} — ${score} figurinhas pra trocar!`,
    read: false,
    createdAt: FieldValue.serverTimestamp(),
  });

  if (!token) return;
  try {
    await getMessaging().send({
      token,
      notification: {
        title: 'Novo match no álbum!',
        body: `${partnerName} tem figurinhas que você precisa.`,
      },
      data: { type: 'trade_match' },
      webpush: {
        fcmOptions: { link: '/trades' },
      },
    });
  } catch (err) {
    logger.warn('[fcm] envio falhou', err);
  }
}

/**
 * Cria notificação quando uma troca muda de status.
 */
export const onTradeUpdated = onDocumentWritten('trades/{tradeId}', async (event) => {
  const after = event.data?.after.data();
  const before = event.data?.before.data();
  if (!after) return;
  if (before && before.status === after.status) return;

  const targetUserId = after.toUserId === after.fromUserId ? null : after.toUserId;
  if (!targetUserId) return;

  let message = '';
  if (after.status === 'pending') {
    message = `${after.fromUserName} propôs uma troca pra você!`;
  } else if (after.status === 'accepted') {
    message = 'Sua troca foi aceita!';
  } else if (after.status === 'done') {
    message = 'Troca concluída — atualize sua coleção!';
  } else if (after.status === 'rejected') {
    message = 'Sua proposta de troca foi recusada.';
  } else {
    return;
  }

  const recipient =
    after.status === 'pending' ? after.toUserId : after.fromUserId;

  await db.collection('notifications').doc(recipient).collection('items').add({
    type: `trade_${after.status}`,
    message,
    data: { tradeId: event.params.tradeId },
    read: false,
    createdAt: FieldValue.serverTimestamp(),
  });
});
