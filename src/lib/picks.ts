/**
 * Bolão — pontuação clássica e travamento por horário.
 *
 * Regras de pontuação:
 *  - 10 pts: placar exato
 *  -  5 pts: vencedor (ou empate) E saldo de gols corretos
 *  -  3 pts: só o resultado (vitória mandante / empate / vitória visitante)
 *  -  0 pts: errou tudo OU jogo ainda sem placar oficial
 *
 * Travamento: 5 minutos antes do horário marcado.
 */
import { matchTimestamp, type Match2026 } from '@/lib/data/matches';
import type { ScoreEntry } from '@/lib/standings';

export interface Pick {
  uid: string;
  matchNum: number;
  homeScore: number;
  awayScore: number;
}

export const LOCK_BUFFER_MS = 5 * 60 * 1000; // 5 minutos

export const POINTS = {
  exact: 10,
  signedDiff: 5,
  resultOnly: 3,
  miss: 0,
} as const;

export function pickPoints(pick: { homeScore: number; awayScore: number }, official: ScoreEntry | undefined): number {
  if (!official) return 0;
  if (pick.homeScore === official.homeScore && pick.awayScore === official.awayScore) {
    return POINTS.exact;
  }

  const pickRes = Math.sign(pick.homeScore - pick.awayScore);
  const offRes = Math.sign(official.homeScore - official.awayScore);
  if (pickRes !== offRes) return POINTS.miss;

  const pickDiff = pick.homeScore - pick.awayScore;
  const offDiff = official.homeScore - official.awayScore;
  if (pickDiff === offDiff) return POINTS.signedDiff;
  return POINTS.resultOnly;
}

export function isLocked(match: Match2026, now: number = Date.now()): boolean {
  return now >= matchTimestamp(match) - LOCK_BUFFER_MS;
}

/** Quantos minutos restam até o lock. Negativo = já travou. */
export function minutesUntilLock(match: Match2026, now: number = Date.now()): number {
  return Math.floor((matchTimestamp(match) - LOCK_BUFFER_MS - now) / 60000);
}

export interface LeaderboardRow {
  uid: string;
  displayName: string;
  photoURL: string | null;
  points: number;
  exactCount: number;
  signedCount: number;
  resultCount: number;
  betsCount: number;
}

export function buildLeaderboard(
  members: Array<{ userId: string; displayName: string; photoURL: string | null }>,
  picksByUser: Record<string, Record<number, { homeScore: number; awayScore: number }>>,
  officialScores: Record<number, ScoreEntry | undefined>
): LeaderboardRow[] {
  const rows: LeaderboardRow[] = members.map((m) => {
    const picks = picksByUser[m.userId] ?? {};
    let points = 0;
    let exactCount = 0;
    let signedCount = 0;
    let resultCount = 0;
    let betsCount = 0;
    for (const [numStr, pick] of Object.entries(picks)) {
      betsCount += 1;
      const num = Number(numStr);
      const off = officialScores[num];
      const p = pickPoints(pick, off);
      points += p;
      if (p === POINTS.exact) exactCount += 1;
      else if (p === POINTS.signedDiff) signedCount += 1;
      else if (p === POINTS.resultOnly) resultCount += 1;
    }
    return {
      uid: m.userId,
      displayName: m.displayName,
      photoURL: m.photoURL,
      points,
      exactCount,
      signedCount,
      resultCount,
      betsCount,
    };
  });

  rows.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.exactCount !== a.exactCount) return b.exactCount - a.exactCount;
    if (b.signedCount !== a.signedCount) return b.signedCount - a.signedCount;
    return a.displayName.localeCompare(b.displayName);
  });
  return rows;
}
