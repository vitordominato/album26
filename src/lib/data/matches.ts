/**
 * Tabela completa da Copa do Mundo FIFA 2026 — 104 jogos.
 * Horários em UTC-3 (Brasília). Fonte: tabela oficial FIFA (2024).
 *
 * Cada lado do jogo (`home` / `away`) é um `MatchSide` que pode ser:
 *  - team:      seleção definida (fase de grupos)
 *  - groupPos:  1º/2º colocado de um grupo (eliminatórias)
 *  - thirdOf:   melhor 3º colocado de um pool de grupos (32-avos)
 *  - winnerOf:  vencedor de um jogo anterior (32-avos em diante)
 *  - loserOf:   perdedor de um jogo (3º lugar)
 */
import type { Team } from '@/types';

export type Stage = 'group' | 'r32' | 'r16' | 'qf' | 'sf' | 'tp' | 'final';

export type MatchSide =
  | { kind: 'team'; teamId: string }
  | { kind: 'groupPos'; group: string; position: 1 | 2 }
  | { kind: 'thirdOf'; pool: string[] }
  | { kind: 'winnerOf'; matchNum: number }
  | { kind: 'loserOf'; matchNum: number };

export interface Match2026 {
  num: number;
  stage: Stage;
  group?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm ou 'a definir'
  location: string;
  home: MatchSide;
  away: MatchSide;
}

const t = (teamId: string): MatchSide => ({ kind: 'team', teamId });
const pos = (group: string, position: 1 | 2): MatchSide => ({ kind: 'groupPos', group, position });
const third = (pool: string): MatchSide => ({ kind: 'thirdOf', pool: pool.split('/') });
const w = (matchNum: number): MatchSide => ({ kind: 'winnerOf', matchNum });
const l = (matchNum: number): MatchSide => ({ kind: 'loserOf', matchNum });

export const MATCHES_2026: Match2026[] = [
  // Fase de grupos — 1ª rodada
  { num: 1,  stage: 'group', group: 'A', date: '2026-06-11', time: '16:00', location: 'Estádio Azteca, Cidade do México (MEX)', home: t('MEX'), away: t('RSA') },
  { num: 2,  stage: 'group', group: 'A', date: '2026-06-11', time: '23:00', location: 'Estadio Akron, Guadalajara (MEX)',       home: t('KOR'), away: t('CZE') },
  { num: 3,  stage: 'group', group: 'B', date: '2026-06-12', time: '16:00', location: 'BMO Field, Toronto (CAN)',                home: t('CAN'), away: t('BIH') },
  { num: 4,  stage: 'group', group: 'D', date: '2026-06-12', time: '22:00', location: 'SoFi Stadium, Los Angeles (EUA)',         home: t('USA'), away: t('PAR') },
  { num: 5,  stage: 'group', group: 'B', date: '2026-06-13', time: '16:00', location: 'Canadá / EUA (Grupo B)',                  home: t('QAT'), away: t('SUI') },
  { num: 6,  stage: 'group', group: 'C', date: '2026-06-13', time: '19:00', location: 'MetLife Stadium, Nova York/NJ (EUA)',     home: t('BRA'), away: t('MAR') },
  { num: 7,  stage: 'group', group: 'C', date: '2026-06-13', time: '22:00', location: 'Costa Leste dos EUA (Grupo C)',           home: t('HAI'), away: t('SCO') },
  { num: 8,  stage: 'group', group: 'D', date: '2026-06-14', time: '01:00', location: 'Costa Oeste EUA / Canadá (Grupo D)',      home: t('AUS'), away: t('TUR') },
  { num: 9,  stage: 'group', group: 'E', date: '2026-06-14', time: '14:00', location: 'EUA / Canadá (Grupo E)',                  home: t('GER'), away: t('CUW') },
  { num: 10, stage: 'group', group: 'F', date: '2026-06-14', time: '17:00', location: 'EUA / México (Grupo F)',                  home: t('NED'), away: t('JPN') },
  { num: 11, stage: 'group', group: 'E', date: '2026-06-14', time: '20:00', location: 'EUA / Canadá (Grupo E)',                  home: t('CIV'), away: t('ECU') },
  { num: 12, stage: 'group', group: 'F', date: '2026-06-14', time: '23:00', location: 'EUA / México (Grupo F)',                  home: t('SWE'), away: t('TUN') },
  { num: 13, stage: 'group', group: 'H', date: '2026-06-15', time: '13:00', location: 'EUA / México (Grupo H)',                  home: t('ESP'), away: t('CPV') },
  { num: 14, stage: 'group', group: 'G', date: '2026-06-15', time: '16:00', location: 'Costa Oeste EUA / Canadá (Grupo G)',      home: t('BEL'), away: t('EGY') },
  { num: 15, stage: 'group', group: 'H', date: '2026-06-15', time: '19:00', location: 'EUA / México (Grupo H)',                  home: t('KSA'), away: t('URU') },
  { num: 16, stage: 'group', group: 'G', date: '2026-06-15', time: '22:00', location: 'Costa Oeste EUA / Canadá (Grupo G)',      home: t('IRN'), away: t('NZL') },
  { num: 17, stage: 'group', group: 'I', date: '2026-06-16', time: '16:00', location: 'EUA (Grupo I)',                            home: t('FRA'), away: t('SEN') },
  { num: 18, stage: 'group', group: 'I', date: '2026-06-16', time: '19:00', location: 'EUA (Grupo I)',                            home: t('IRQ'), away: t('NOR') },
  { num: 19, stage: 'group', group: 'J', date: '2026-06-16', time: '22:00', location: 'EUA (Grupo J)',                            home: t('ARG'), away: t('ALG') },
  { num: 20, stage: 'group', group: 'J', date: '2026-06-17', time: '01:00', location: 'EUA (Grupo J)',                            home: t('AUT'), away: t('JOR') },
  { num: 21, stage: 'group', group: 'K', date: '2026-06-17', time: '14:00', location: 'EUA / México (Grupo K)',                  home: t('POR'), away: t('COD') },
  { num: 22, stage: 'group', group: 'L', date: '2026-06-17', time: '17:00', location: 'EUA / Canadá (Grupo L)',                  home: t('ENG'), away: t('CRO') },
  { num: 23, stage: 'group', group: 'L', date: '2026-06-17', time: '20:00', location: 'EUA / Canadá (Grupo L)',                  home: t('GHA'), away: t('PAN') },
  { num: 24, stage: 'group', group: 'K', date: '2026-06-17', time: '21:00', location: 'EUA / México (Grupo K)',                  home: t('UZB'), away: t('COL') },

  // 2ª rodada
  { num: 25, stage: 'group', group: 'A', date: '2026-06-18', time: '13:00', location: 'México (Grupo A)',                         home: t('CZE'), away: t('RSA') },
  { num: 26, stage: 'group', group: 'B', date: '2026-06-18', time: '16:00', location: 'Canadá / EUA (Grupo B)',                  home: t('SUI'), away: t('BIH') },
  { num: 27, stage: 'group', group: 'B', date: '2026-06-18', time: '19:00', location: 'BC Place, Vancouver (CAN)',                home: t('CAN'), away: t('QAT') },
  { num: 28, stage: 'group', group: 'A', date: '2026-06-18', time: '22:00', location: 'México (Grupo A)',                         home: t('MEX'), away: t('KOR') },
  { num: 29, stage: 'group', group: 'D', date: '2026-06-19', time: '00:00', location: 'Costa Oeste EUA / Canadá (Grupo D)',      home: t('TUR'), away: t('PAR') },
  { num: 30, stage: 'group', group: 'D', date: '2026-06-19', time: '16:00', location: 'Lumen Field, Seattle (EUA)',               home: t('USA'), away: t('AUS') },
  { num: 31, stage: 'group', group: 'C', date: '2026-06-19', time: '19:00', location: 'Costa Leste dos EUA (Grupo C)',           home: t('SCO'), away: t('MAR') },
  { num: 32, stage: 'group', group: 'C', date: '2026-06-19', time: '21:30', location: 'Lincoln Financial Field, Filadélfia (EUA)', home: t('BRA'), away: t('HAI') },
  { num: 33, stage: 'group', group: 'F', date: '2026-06-20', time: '14:00', location: 'EUA / México (Grupo F)',                  home: t('NED'), away: t('SWE') },
  { num: 34, stage: 'group', group: 'E', date: '2026-06-20', time: '17:00', location: 'EUA / Canadá (Grupo E)',                  home: t('GER'), away: t('CIV') },
  { num: 35, stage: 'group', group: 'E', date: '2026-06-20', time: '21:00', location: 'EUA / Canadá (Grupo E)',                  home: t('ECU'), away: t('CUW') },
  { num: 36, stage: 'group', group: 'F', date: '2026-06-20', time: '23:00', location: 'EUA / México (Grupo F)',                  home: t('TUN'), away: t('JPN') },
  { num: 37, stage: 'group', group: 'H', date: '2026-06-21', time: '13:00', location: 'EUA / México (Grupo H)',                  home: t('ESP'), away: t('KSA') },
  { num: 38, stage: 'group', group: 'G', date: '2026-06-21', time: '16:00', location: 'Costa Oeste EUA / Canadá (Grupo G)',      home: t('BEL'), away: t('IRN') },
  { num: 39, stage: 'group', group: 'H', date: '2026-06-21', time: '19:00', location: 'EUA / México (Grupo H)',                  home: t('URU'), away: t('CPV') },
  { num: 40, stage: 'group', group: 'G', date: '2026-06-21', time: '22:00', location: 'Costa Oeste EUA / Canadá (Grupo G)',      home: t('NZL'), away: t('EGY') },
  { num: 41, stage: 'group', group: 'J', date: '2026-06-22', time: '14:00', location: 'EUA (Grupo J)',                            home: t('ARG'), away: t('AUT') },
  { num: 42, stage: 'group', group: 'I', date: '2026-06-22', time: '18:00', location: 'EUA (Grupo I)',                            home: t('FRA'), away: t('IRQ') },
  { num: 43, stage: 'group', group: 'I', date: '2026-06-22', time: '21:00', location: 'EUA (Grupo I)',                            home: t('NOR'), away: t('SEN') },
  { num: 44, stage: 'group', group: 'J', date: '2026-06-23', time: '00:00', location: 'EUA (Grupo J)',                            home: t('JOR'), away: t('ALG') },
  { num: 45, stage: 'group', group: 'K', date: '2026-06-23', time: '14:00', location: 'EUA / México (Grupo K)',                  home: t('POR'), away: t('UZB') },
  { num: 46, stage: 'group', group: 'L', date: '2026-06-23', time: '17:00', location: 'EUA / Canadá (Grupo L)',                  home: t('ENG'), away: t('GHA') },
  { num: 47, stage: 'group', group: 'L', date: '2026-06-23', time: '20:00', location: 'EUA / Canadá (Grupo L)',                  home: t('PAN'), away: t('CRO') },
  { num: 48, stage: 'group', group: 'K', date: '2026-06-23', time: '23:00', location: 'EUA / México (Grupo K)',                  home: t('COL'), away: t('COD') },

  // 3ª rodada (simultâneos)
  { num: 49, stage: 'group', group: 'B', date: '2026-06-24', time: '16:00', location: 'BC Place, Vancouver (CAN)',                home: t('SUI'), away: t('CAN') },
  { num: 50, stage: 'group', group: 'B', date: '2026-06-24', time: '16:00', location: 'Canadá / EUA (Grupo B)',                  home: t('BIH'), away: t('QAT') },
  { num: 51, stage: 'group', group: 'C', date: '2026-06-24', time: '19:00', location: 'Hard Rock Stadium, Miami (EUA)',           home: t('SCO'), away: t('BRA') },
  { num: 52, stage: 'group', group: 'C', date: '2026-06-24', time: '19:00', location: 'Costa Leste dos EUA (Grupo C)',           home: t('MAR'), away: t('HAI') },
  { num: 53, stage: 'group', group: 'A', date: '2026-06-24', time: '22:00', location: 'Estádio Azteca, Cidade do México (MEX)', home: t('CZE'), away: t('MEX') },
  { num: 54, stage: 'group', group: 'A', date: '2026-06-24', time: '22:00', location: 'México (Grupo A)',                         home: t('RSA'), away: t('KOR') },
  { num: 55, stage: 'group', group: 'E', date: '2026-06-25', time: '17:00', location: 'EUA / Canadá (Grupo E)',                  home: t('ECU'), away: t('GER') },
  { num: 56, stage: 'group', group: 'E', date: '2026-06-25', time: '17:00', location: 'EUA / Canadá (Grupo E)',                  home: t('CUW'), away: t('CIV') },
  { num: 57, stage: 'group', group: 'F', date: '2026-06-25', time: '20:00', location: 'EUA / México (Grupo F)',                  home: t('JPN'), away: t('SWE') },
  { num: 58, stage: 'group', group: 'F', date: '2026-06-25', time: '20:00', location: 'EUA / México (Grupo F)',                  home: t('TUN'), away: t('NED') },
  { num: 59, stage: 'group', group: 'D', date: '2026-06-25', time: '23:00', location: 'Costa Oeste EUA / Canadá (Grupo D)',      home: t('TUR'), away: t('USA') },
  { num: 60, stage: 'group', group: 'D', date: '2026-06-25', time: '23:00', location: 'Costa Oeste EUA / Canadá (Grupo D)',      home: t('PAR'), away: t('AUS') },
  { num: 61, stage: 'group', group: 'I', date: '2026-06-26', time: '16:00', location: 'EUA (Grupo I)',                            home: t('NOR'), away: t('FRA') },
  { num: 62, stage: 'group', group: 'I', date: '2026-06-26', time: '16:00', location: 'EUA (Grupo I)',                            home: t('SEN'), away: t('IRQ') },
  { num: 63, stage: 'group', group: 'H', date: '2026-06-26', time: '21:00', location: 'EUA / México (Grupo H)',                  home: t('CPV'), away: t('KSA') },
  { num: 64, stage: 'group', group: 'H', date: '2026-06-26', time: '21:00', location: 'EUA / México (Grupo H)',                  home: t('URU'), away: t('ESP') },
  { num: 65, stage: 'group', group: 'G', date: '2026-06-27', time: '00:00', location: 'Costa Oeste EUA / Canadá (Grupo G)',      home: t('EGY'), away: t('IRN') },
  { num: 66, stage: 'group', group: 'G', date: '2026-06-27', time: '00:00', location: 'Costa Oeste EUA / Canadá (Grupo G)',      home: t('NZL'), away: t('BEL') },
  { num: 67, stage: 'group', group: 'L', date: '2026-06-27', time: '18:00', location: 'EUA / Canadá (Grupo L)',                  home: t('PAN'), away: t('ENG') },
  { num: 68, stage: 'group', group: 'L', date: '2026-06-27', time: '18:00', location: 'EUA / Canadá (Grupo L)',                  home: t('CRO'), away: t('GHA') },
  { num: 69, stage: 'group', group: 'K', date: '2026-06-27', time: '20:30', location: 'EUA / México (Grupo K)',                  home: t('COL'), away: t('POR') },
  { num: 70, stage: 'group', group: 'K', date: '2026-06-27', time: '20:30', location: 'EUA / México (Grupo K)',                  home: t('COD'), away: t('UZB') },
  { num: 71, stage: 'group', group: 'J', date: '2026-06-27', time: '23:00', location: 'EUA (Grupo J)',                            home: t('ALG'), away: t('AUT') },
  { num: 72, stage: 'group', group: 'J', date: '2026-06-27', time: '23:00', location: 'EUA (Grupo J)',                            home: t('JOR'), away: t('ARG') },

  // 32-avos (Round of 32)
  { num: 73, stage: 'r32', date: '2026-06-28', time: 'a definir', location: 'Los Angeles (EUA)',                        home: pos('A', 2), away: pos('B', 2) },
  { num: 74, stage: 'r32', date: '2026-06-29', time: 'a definir', location: 'Boston/Foxborough (EUA)',                  home: pos('E', 1), away: third('A/B/C/D/F') },
  { num: 75, stage: 'r32', date: '2026-06-29', time: 'a definir', location: 'Monterrey (MEX)',                          home: pos('F', 1), away: pos('C', 2) },
  { num: 76, stage: 'r32', date: '2026-06-29', time: 'a definir', location: 'Houston (EUA)',                            home: pos('C', 1), away: pos('F', 2) },
  { num: 77, stage: 'r32', date: '2026-06-30', time: 'a definir', location: 'Nova York/NJ (EUA)',                       home: pos('I', 1), away: third('C/D/F/G/H') },
  { num: 78, stage: 'r32', date: '2026-06-30', time: 'a definir', location: 'Dallas/Arlington (EUA)',                   home: pos('E', 2), away: pos('I', 2) },
  { num: 79, stage: 'r32', date: '2026-06-30', time: 'a definir', location: 'Estádio Azteca, Cidade do México (MEX)',   home: pos('A', 1), away: third('C/E/F/H/I') },
  { num: 80, stage: 'r32', date: '2026-07-01', time: 'a definir', location: 'Atlanta (EUA)',                            home: pos('L', 1), away: third('E/H/I/J/K') },
  { num: 81, stage: 'r32', date: '2026-07-01', time: 'a definir', location: 'Santa Clara/SF (EUA)',                     home: pos('D', 1), away: third('B/E/F/I/J') },
  { num: 82, stage: 'r32', date: '2026-07-01', time: 'a definir', location: 'Seattle (EUA)',                            home: pos('G', 1), away: third('A/E/H/I/J') },
  { num: 83, stage: 'r32', date: '2026-07-02', time: 'a definir', location: 'Toronto (CAN)',                            home: pos('K', 2), away: pos('L', 2) },
  { num: 84, stage: 'r32', date: '2026-07-02', time: 'a definir', location: 'Los Angeles (EUA)',                        home: pos('H', 1), away: pos('J', 2) },
  { num: 85, stage: 'r32', date: '2026-07-02', time: 'a definir', location: 'Vancouver (CAN)',                          home: pos('B', 1), away: third('E/F/G/I/J') },
  { num: 86, stage: 'r32', date: '2026-07-03', time: 'a definir', location: 'Miami (EUA)',                              home: pos('J', 1), away: pos('H', 2) },
  { num: 87, stage: 'r32', date: '2026-07-03', time: 'a definir', location: 'Kansas City (EUA)',                        home: pos('K', 1), away: third('D/E/I/J/L') },
  { num: 88, stage: 'r32', date: '2026-07-03', time: 'a definir', location: 'Dallas/Arlington (EUA)',                   home: pos('D', 2), away: pos('G', 2) },

  // Oitavas
  { num: 89, stage: 'r16', date: '2026-07-04', time: 'a definir', location: 'Filadélfia (EUA)',                         home: w(74), away: w(77) },
  { num: 90, stage: 'r16', date: '2026-07-04', time: 'a definir', location: 'Houston (EUA)',                            home: w(73), away: w(75) },
  { num: 91, stage: 'r16', date: '2026-07-05', time: 'a definir', location: 'Nova York/NJ (EUA)',                       home: w(76), away: w(78) },
  { num: 92, stage: 'r16', date: '2026-07-05', time: 'a definir', location: 'Estádio Azteca, Cidade do México (MEX)',   home: w(79), away: w(80) },
  { num: 93, stage: 'r16', date: '2026-07-06', time: 'a definir', location: 'Dallas/Arlington (EUA)',                   home: w(83), away: w(84) },
  { num: 94, stage: 'r16', date: '2026-07-06', time: 'a definir', location: 'Seattle (EUA)',                            home: w(81), away: w(82) },
  { num: 95, stage: 'r16', date: '2026-07-07', time: 'a definir', location: 'Atlanta (EUA)',                            home: w(86), away: w(88) },
  { num: 96, stage: 'r16', date: '2026-07-07', time: 'a definir', location: 'Vancouver (CAN)',                          home: w(85), away: w(87) },

  // Quartas
  { num: 97,  stage: 'qf', date: '2026-07-09', time: 'a definir', location: 'Boston/Foxborough (EUA)',                  home: w(89), away: w(90) },
  { num: 98,  stage: 'qf', date: '2026-07-10', time: 'a definir', location: 'Los Angeles (EUA)',                        home: w(93), away: w(94) },
  { num: 99,  stage: 'qf', date: '2026-07-12', time: 'a definir', location: 'Miami (EUA)',                              home: w(91), away: w(92) },
  { num: 100, stage: 'qf', date: '2026-07-12', time: 'a definir', location: 'Kansas City (EUA)',                        home: w(95), away: w(96) },

  // Semis
  { num: 101, stage: 'sf', date: '2026-07-14', time: '20:00', location: 'AT&T Stadium, Dallas/Arlington (EUA)',          home: w(97), away: w(98) },
  { num: 102, stage: 'sf', date: '2026-07-15', time: '19:00', location: 'Mercedes-Benz Stadium, Atlanta (EUA)',          home: w(99), away: w(100) },

  // 3º lugar
  { num: 103, stage: 'tp', date: '2026-07-18', time: '17:00', location: 'Hard Rock Stadium, Miami (EUA)',                home: l(101), away: l(102) },

  // Final
  { num: 104, stage: 'final', date: '2026-07-19', time: '18:00', location: 'MetLife Stadium, Nova York/NJ (EUA)',        home: w(101), away: w(102) },
];

export const STAGE_LABEL: Record<Stage, string> = {
  group: 'Fase de grupos',
  r32: '32-avos',
  r16: 'Oitavas',
  qf: 'Quartas',
  sf: 'Semifinal',
  tp: '3º lugar',
  final: 'Final',
};

export function matchTimestamp(m: Match2026): number {
  if (m.time === 'a definir' || !/^\d{2}:\d{2}$/.test(m.time)) {
    return new Date(`${m.date}T12:00:00-03:00`).getTime();
  }
  return new Date(`${m.date}T${m.time}:00-03:00`).getTime();
}

export function sideLabel(side: MatchSide, teamById: Record<string, Team>): string {
  switch (side.kind) {
    case 'team':
      return teamById[side.teamId]?.namePt ?? side.teamId;
    case 'groupPos':
      return `${side.position}º Grupo ${side.group}`;
    case 'thirdOf':
      return `3º ${side.pool.join('/')}`;
    case 'winnerOf':
      return `Vencedor ${side.matchNum}`;
    case 'loserOf':
      return `Perdedor ${side.matchNum}`;
  }
}
