/**
 * Cálculo de classificação dos grupos e progressão do mata-mata.
 *
 * Pure functions: recebem os jogos + placares e retornam tabela / brackets resolvidos.
 *
 * A alocação dos 8 melhores 3º colocados em 32-avos segue a tabela oficial da
 * FIFA (Anexo C, 495 combinações), em `THIRD_PLACE_ALLOCATION`: para o conjunto
 * de 8 grupos cujos 3º colocados avançam, a tabela define exatamente contra qual
 * grupo-vencedor cada 3º colocado joga — sem heurística.
 */
import type { MatchSide } from '@/lib/data/matches';
import { MATCHES_2026 } from '@/lib/data/matches';
import { TEAMS_SEED } from '@/lib/data/teams';
import { THIRD_PLACE_ALLOCATION, THIRD_WINNER_SLOTS } from '@/lib/data/thirdPlaceAllocation';

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

  // 3º colocado de cada grupo (com jogos disputados) → time
  const groupThirds: Array<{ group: string; teamId: string; row: TeamStanding }> = [];
  for (const gs of Object.values(standings)) {
    const third = gs.rows[2];
    if (third && third.played > 0) {
      groupThirds.push({ group: gs.group, teamId: third.teamId, row: third });
    }
  }
  // melhores 3º (ordenados por pontos / GD / GF) — define QUAIS 8 grupos avançam
  groupThirds.sort((a, b) => {
    if (b.row.points !== a.row.points) return b.row.points - a.row.points;
    if (b.row.goalDiff !== a.row.goalDiff) return b.row.goalDiff - a.row.goalDiff;
    if (b.row.goalsFor !== a.row.goalsFor) return b.row.goalsFor - a.row.goalsFor;
    return a.row.teamId.localeCompare(b.row.teamId);
  });
  const bestThirds = groupThirds.slice(0, 8);
  const thirdTeamByGroup: Record<string, string> = {};
  for (const t of bestThirds) thirdTeamByGroup[t.group] = t.teamId;

  // Tabela oficial FIFA (Anexo C): a chave é o conjunto dos 8 grupos
  // classificados em ordem alfabética; o valor diz, para cada slot de vencedor
  // (1A,1B,1D,1E,1G,1I,1K,1L), qual grupo-3º o enfrenta.
  const allocationKey = bestThirds.map((t) => t.group).sort().join('');
  const allocation = THIRD_PLACE_ALLOCATION[allocationKey];
  // slot de vencedor (ex.: '1E') → grupo do 3º colocado alocado (ex.: 'D')
  const winnerSlotToThirdGroup: Record<string, string> = {};
  if (allocation) {
    THIRD_WINNER_SLOTS.forEach((slot, i) => {
      winnerSlotToThirdGroup[slot] = allocation[i];
    });
  }

  // Cada slot `thirdOf` é o adversário de um vencedor de grupo (groupPos pos 1)
  // no mesmo jogo. O slot '1' + grupo-vencedor identifica a linha da tabela.
  const thirdSlotResolution: Record<number, string | null> = {};
  if (allocation) {
    for (const m of MATCHES_2026) {
      const sides: Array<[MatchSide, MatchSide, boolean]> = [
        [m.home, m.away, true],
        [m.away, m.home, false],
      ];
      for (const [side, opponent, isHome] of sides) {
        if (side.kind !== 'thirdOf') continue;
        if (opponent.kind !== 'groupPos' || opponent.position !== 1) continue;
        const winnerSlot = `1${opponent.group}`;
        const thirdGroup = winnerSlotToThirdGroup[winnerSlot];
        const teamId = thirdGroup ? thirdTeamByGroup[thirdGroup] : undefined;
        if (teamId) {
          const key = isHome ? m.num : -m.num;
          thirdSlotResolution[key] = teamId;
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
