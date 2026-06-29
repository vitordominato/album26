/**
 * Cálculo de classificação dos grupos e progressão do mata-mata.
 *
 * Pure functions: recebem os jogos + placares e retornam tabela / brackets resolvidos.
 *
 * Limitação conhecida da progressão: a alocação oficial FIFA dos 8 melhores
 * 3º colocados em 32-avos depende de uma tabela de combinatória (qual conjunto
 * de 8 grupos avança). Aqui usamos uma aproximação razoável: ordenamos os
 * thirds e atribuímos do melhor pro pior aos slots que aceitam seu grupo
 * (greedy), sem garantir o mapping oficial.
 */
import type { MatchSide } from '@/lib/data/matches';
import { MATCHES_2026 } from '@/lib/data/matches';
import { TEAMS_SEED } from '@/lib/data/teams';

export interface ScoreEntry {
  homeScore: number;
  awayScore: number;
  /**
   * Pênaltis no mata-mata. Só usados quando o tempo normal/prorrogação
   * termina empatado (`homeScore === awayScore`) para definir quem avança.
   * Ignorados na fase de grupos.
   */
  homePens?: number;
  awayPens?: number;
}

export type Scores = Record<number, ScoreEntry | undefined>;

export interface TeamStanding {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
}

export interface GroupStandings {
  group: string;
  rows: TeamStanding[];
}

export interface OverallStanding extends TeamStanding {
  group: string;
  /** posição (1-based) dentro do próprio grupo */
  groupPosition: number;
}

function emptyRow(teamId: string): TeamStanding {
  return {
    teamId,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDiff: 0,
    points: 0,
  };
}

function applyScore(row: TeamStanding, gf: number, ga: number) {
  row.played += 1;
  row.goalsFor += gf;
  row.goalsAgainst += ga;
  row.goalDiff = row.goalsFor - row.goalsAgainst;
  if (gf > ga) {
    row.won += 1;
    row.points += 3;
  } else if (gf === ga) {
    row.drawn += 1;
    row.points += 1;
  } else {
    row.lost += 1;
  }
}

function sortStandings(rows: TeamStanding[]): TeamStanding[] {
  return [...rows].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.teamId.localeCompare(b.teamId);
  });
}

export function computeStandings(scores: Scores): Record<string, GroupStandings> {
  const teamsByGroup: Record<string, string[]> = {};
  for (const team of TEAMS_SEED) {
    (teamsByGroup[team.groupStage] ??= []).push(team.id);
  }

  const result: Record<string, GroupStandings> = {};
  for (const [group, teamIds] of Object.entries(teamsByGroup)) {
    const rows: Record<string, TeamStanding> = {};
    teamIds.forEach((id) => (rows[id] = emptyRow(id)));

    const groupMatches = MATCHES_2026.filter(
      (m) => m.stage === 'group' && m.group === group
    );
    for (const m of groupMatches) {
      const sc = scores[m.num];
      if (!sc) continue;
      if (m.home.kind !== 'team' || m.away.kind !== 'team') continue;
      const h = rows[m.home.teamId];
      const a = rows[m.away.teamId];
      if (!h || !a) continue;
      applyScore(h, sc.homeScore, sc.awayScore);
      applyScore(a, sc.awayScore, sc.homeScore);
    }

    result[group] = { group, rows: sortStandings(Object.values(rows)) };
  }
  return result;
}

/**
 * Classificação geral: todos os times ranqueados juntos (independente do grupo),
 * ordenados por pontos / saldo de gols / gols pró. Mantém a referência ao grupo
 * e à posição dentro dele — útil pra comparar 3º colocados, etc.
 */
export function computeOverallStandings(scores: Scores): OverallStanding[] {
  const byGroup = computeStandings(scores);
  const all: OverallStanding[] = [];
  for (const gs of Object.values(byGroup)) {
    gs.rows.forEach((row, i) => {
      all.push({ ...row, group: gs.group, groupPosition: i + 1 });
    });
  }
  return all.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.teamId.localeCompare(b.teamId);
  });
}

/**
 * Resolve cada `MatchSide` para um `teamId` quando os jogos anteriores
 * estiverem preenchidos. Retorna `null` quando ainda não dá pra determinar.
 */
export function resolveSides(scores: Scores): Record<number, { home: string | null; away: string | null }> {
  const standings = computeStandings(scores);

  const winners: Record<number, string | null> = {};
  const losers: Record<number, string | null> = {};

  // assigned thirds per group → teamId (após o greedy)
  const thirdAssignments: Record<string, string> = {};
  const groupThirds: Array<{ group: string; teamId: string; row: TeamStanding }> = [];
  for (const gs of Object.values(standings)) {
    const third = gs.rows[2];
    if (third && third.played > 0) {
      groupThirds.push({ group: gs.group, teamId: third.teamId, row: third });
    }
  }
  // melhores 3º (ordenados por pontos / GD / GF)
  groupThirds.sort((a, b) => {
    if (b.row.points !== a.row.points) return b.row.points - a.row.points;
    if (b.row.goalDiff !== a.row.goalDiff) return b.row.goalDiff - a.row.goalDiff;
    if (b.row.goalsFor !== a.row.goalsFor) return b.row.goalsFor - a.row.goalsFor;
    return a.row.teamId.localeCompare(b.row.teamId);
  });
  const bestThirdGroups = new Set(groupThirds.slice(0, 8).map((t) => t.group));
  for (const t of groupThirds) {
    if (bestThirdGroups.has(t.group)) thirdAssignments[t.group] = t.teamId;
  }

  // greedy: para cada slot `thirdOf` (em ordem do número do jogo), pega o
  // melhor 3º (na ordem ranking) cujo grupo está no pool e que ainda não
  // foi alocado.
  const usedThirds = new Set<string>();
  const thirdSlotResolution: Record<number, string | null> = {};
  for (const m of MATCHES_2026) {
    for (const side of [m.home, m.away]) {
      if (side.kind === 'thirdOf') {
        let picked: string | null = null;
        for (const t of groupThirds) {
          if (!bestThirdGroups.has(t.group)) continue;
          if (!side.pool.includes(t.group)) continue;
          if (usedThirds.has(t.teamId)) continue;
          picked = t.teamId;
          break;
        }
        if (picked) {
          usedThirds.add(picked);
          // chave: matchNum + lado (uso o sinal: positivo home, negativo away)
          const key = side === m.home ? m.num : -m.num;
          thirdSlotResolution[key] = picked;
        }
      }
    }
  }

  function resolveSide(num: number, side: MatchSide, isHome: boolean): string | null {
    switch (side.kind) {
      case 'team':
        return side.teamId;
      case 'groupPos': {
        const gs = standings[side.group];
        if (!gs) return null;
        const row = gs.rows[side.position - 1];
        if (!row || row.played === 0) return null;
        // só considera resolvido quando todos os 6 jogos do grupo foram preenchidos
        if (!groupComplete(side.group, scores)) return null;
        return row.teamId;
      }
      case 'thirdOf': {
        if (!allGroupsComplete(scores)) return null;
        const key = isHome ? num : -num;
        return thirdSlotResolution[key] ?? null;
      }
      case 'winnerOf':
        return winners[side.matchNum] ?? null;
      case 'loserOf':
        return losers[side.matchNum] ?? null;
    }
  }

  const homeAway: Record<number, { home: string | null; away: string | null }> = {};
  for (const m of MATCHES_2026) {
    const home = resolveSide(m.num, m.home, true);
    const away = resolveSide(m.num, m.away, false);
    homeAway[m.num] = { home, away };
    const sc = scores[m.num];
    let winnerSide: 'home' | 'away' | null = null;
    if (sc && home && away) {
      if (sc.homeScore > sc.awayScore) {
        winnerSide = 'home';
      } else if (sc.awayScore > sc.homeScore) {
        winnerSide = 'away';
      } else if (
        sc.homePens != null &&
        sc.awayPens != null &&
        sc.homePens !== sc.awayPens
      ) {
        // empate no tempo normal → quem venceu nos pênaltis avança
        winnerSide = sc.homePens > sc.awayPens ? 'home' : 'away';
      }
    }
    if (winnerSide === 'home') {
      winners[m.num] = home;
      losers[m.num] = away;
    } else if (winnerSide === 'away') {
      winners[m.num] = away;
      losers[m.num] = home;
    } else {
      winners[m.num] = null;
      losers[m.num] = null;
    }
  }

  return homeAway;
}

export function groupComplete(group: string, scores: Scores): boolean {
  const groupMatches = MATCHES_2026.filter(
    (m) => m.stage === 'group' && m.group === group
  );
  return groupMatches.every((m) => !!scores[m.num]);
}

export function allGroupsComplete(scores: Scores): boolean {
  const groupMatches = MATCHES_2026.filter((m) => m.stage === 'group');
  return groupMatches.every((m) => !!scores[m.num]);
}
