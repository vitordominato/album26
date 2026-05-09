/**
 * Popula o Firestore com seleções, jogadores placeholder e o catálogo de figurinhas.
 *
 * Uso:
 *   1) Baixe a service-account JSON (Firebase Console → Project Settings → Service accounts)
 *   2) Coloque em ./.firebase/service-account.json (ou aponte GOOGLE_APPLICATION_CREDENTIALS)
 *   3) Rode: npm run seed
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

const POSITIONS: Array<'GK' | 'DEF' | 'MID' | 'FWD'> = [
  'GK', 'DEF', 'DEF', 'DEF', 'DEF',
  'MID', 'MID', 'MID', 'MID',
  'FWD', 'FWD', 'FWD',
  'DEF', 'MID', 'FWD', 'GK', 'DEF',
];

const BATCH_LIMIT = 400;

async function commitInBatches<T>(items: T[], path: (item: T) => string, data: (item: T) => unknown) {
  let batch = db.batch();
  let count = 0;
  let committed = 0;
  for (const item of items) {
    batch.set(db.doc(path(item)), data(item) as Record<string, unknown>, { merge: true });
    count++;
    if (count >= BATCH_LIMIT) {
      await batch.commit();
      committed += count;
      console.log(`[seed]   ${committed}…`);
      batch = db.batch();
      count = 0;
    }
  }
  if (count > 0) {
    await batch.commit();
    committed += count;
  }
  return committed;
}

async function seed() {
  console.log('[seed] Iniciando...');
  const stickers = buildAllStickers(TEAMS_SEED);
  console.log(
    `[seed] ${TEAMS_SEED.length} seleções, ${stickers.length} figurinhas no catálogo.`
  );

  // Teams
  console.log('[seed] Gravando seleções...');
  const teamWrites = await commitInBatches(
    TEAMS_SEED,
    (t) => `teams/${t.id}`,
    (t) => t
  );
  console.log(`[seed]   ${teamWrites} seleções gravadas.`);

  // Players (placeholder: 17 jogadores + 1 técnico por seleção)
  console.log('[seed] Gravando jogadores placeholder...');
  type PlayerSeed = {
    docPath: string;
    data: {
      id: string;
      teamId: string;
      name: string;
      position: 'GK' | 'DEF' | 'MID' | 'FWD' | 'COACH';
      jerseyNumber?: number;
    };
  };
  const players: PlayerSeed[] = [];
  for (const team of TEAMS_SEED) {
    for (let i = 1; i <= STICKERS_PER_TEAM - 2; i++) {
      const isCoach = i === STICKERS_PER_TEAM - 2; // último é técnico
      const pos = isCoach ? 'COACH' : POSITIONS[(i - 1) % POSITIONS.length];
      const playerId = `${team.code}-P${i}`;
      players.push({
        docPath: `teams/${team.id}/players/${playerId}`,
        data: {
          id: playerId,
          teamId: team.id,
          name: isCoach ? 'Técnico' : `Jogador ${i}`,
          position: pos,
          jerseyNumber: isCoach ? undefined : i,
        },
      });
    }
  }
  const playerWrites = await commitInBatches(players, (p) => p.docPath, (p) => p.data);
  console.log(`[seed]   ${playerWrites} jogadores gravados.`);

  // Stickers
  console.log('[seed] Gravando figurinhas...');
  const stickerWrites = await commitInBatches(
    stickers,
    (s) => `stickers/${s.id}`,
    (s) => s
  );
  console.log(`[seed]   ${stickerWrites} figurinhas gravadas.`);

  console.log(`[seed] Pronto! Total: ${teamWrites + playerWrites + stickerWrites} writes.`);
}

seed().catch((e) => {
  console.error('[seed] Falhou:', e);
  process.exit(1);
});
