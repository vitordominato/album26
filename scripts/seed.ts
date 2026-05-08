/**
 * Popula o Firestore com seleções, jogadores placeholder e o catálogo de figurinhas.
 *
 * Uso:
 *   1) Baixe a service-account JSON (Firebase Console → Project Settings → Service accounts)
 *   2) Coloque em ./.firebase/service-account.json (ou aponte GOOGLE_APPLICATION_CREDENTIALS)
 *   3) Rode: npx tsx scripts/seed.ts
 *
 * Idempotente: pode rodar mais de uma vez. Faz merge de cada documento.
 */
import { cert, initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { TEAMS_SEED } from '../src/lib/data/teams';
import { buildAllStickers, STICKERS_PER_TEAM } from '../src/lib/data/stickers';

const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS ?? './.firebase/service-account.json';

if (existsSync(resolve(credPath))) {
  const cred = JSON.parse(readFileSync(resolve(credPath), 'utf-8'));
  initializeApp({ credential: cert(cred), projectId: cred.project_id });
  process.env.FIREBASE_PROJECT_ID = cred.project_id;
} else {
  console.log('[seed] Sem service-account local; usando applicationDefault().');
  initializeApp({ credential: applicationDefault() });
}

const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });

const POSITIONS: Array<'GK' | 'DEF' | 'MID' | 'FWD'> = ['GK', 'DEF', 'DEF', 'DEF', 'DEF', 'MID', 'MID', 'MID', 'MID', 'FWD', 'FWD'];

async function seed() {
  console.log('[seed] Iniciando...');
  const stickers = buildAllStickers(TEAMS_SEED);
  console.log(`[seed] ${TEAMS_SEED.length} seleções, ${stickers.length} figurinhas no catálogo.`);

  // Teams + players (placeholder)
  let writes = 0;
  for (const team of TEAMS_SEED) {
    const teamRef = db.doc(`teams/${team.id}`);
    await teamRef.set(team, { merge: true });
    writes++;

    for (let i = 1; i <= STICKERS_PER_TEAM - 2; i++) {
      const pos = POSITIONS[(i - 1) % POSITIONS.length];
      const playerId = `${team.code}-P${i}`;
      await db.doc(`teams/${team.id}/players/${playerId}`).set(
        {
          id: playerId,
          teamId: team.id,
          name: `Jogador ${i}`,
          position: pos,
          jerseyNumber: i,
        },
        { merge: true }
      );
      writes++;
    }
  }

  // Stickers
  const batch1 = db.batch();
  let count = 0;
  for (const s of stickers) {
    const ref = db.doc(`stickers/${s.id}`);
    batch1.set(ref, s, { merge: true });
    count++;
    if (count % 400 === 0) {
      await batch1.commit();
    }
  }
  await batch1.commit();
  writes += count;

  console.log(`[seed] ${writes} writes concluídas.`);
  console.log('[seed] Pronto. Revise no Firebase Console.');
}

seed().catch((e) => {
  console.error('[seed] Falhou:', e);
  process.exit(1);
});
