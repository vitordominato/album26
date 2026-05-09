import type { Confederation, Team } from '@/types';

const flag = (cc: string) => `https://flagcdn.com/w320/${cc.toLowerCase()}.png`;

interface Seed {
  id: string;
  cc: string; // código ISO pro flagcdn
  namePt: string;
  nameEn: string;
  nameEs: string;
  conf: Confederation;
  isHost?: boolean;
}

/**
 * Os 12 grupos da Copa do Mundo FIFA 2026 (48 seleções).
 * Atualize quando a FIFA confirmar nomes/posições.
 */
const GROUPS: Array<{ group: string; teams: Seed[] }> = [
  {
    group: 'A',
    teams: [
      { id: 'MEX', cc: 'mx', namePt: 'México', nameEn: 'Mexico', nameEs: 'México', conf: 'CONCACAF', isHost: true },
      { id: 'RSA', cc: 'za', namePt: 'África do Sul', nameEn: 'South Africa', nameEs: 'Sudáfrica', conf: 'CAF' },
      { id: 'KOR', cc: 'kr', namePt: 'Coreia do Sul', nameEn: 'South Korea', nameEs: 'Corea del Sur', conf: 'AFC' },
      { id: 'CZE', cc: 'cz', namePt: 'República Tcheca', nameEn: 'Czechia', nameEs: 'República Checa', conf: 'UEFA' },
    ],
  },
  {
    group: 'B',
    teams: [
      { id: 'CAN', cc: 'ca', namePt: 'Canadá', nameEn: 'Canada', nameEs: 'Canadá', conf: 'CONCACAF', isHost: true },
      { id: 'BIH', cc: 'ba', namePt: 'Bósnia e Herzegovina', nameEn: 'Bosnia and Herzegovina', nameEs: 'Bosnia y Herzegovina', conf: 'UEFA' },
      { id: 'QAT', cc: 'qa', namePt: 'Catar', nameEn: 'Qatar', nameEs: 'Catar', conf: 'AFC' },
      { id: 'SUI', cc: 'ch', namePt: 'Suíça', nameEn: 'Switzerland', nameEs: 'Suiza', conf: 'UEFA' },
    ],
  },
  {
    group: 'C',
    teams: [
      { id: 'BRA', cc: 'br', namePt: 'Brasil', nameEn: 'Brazil', nameEs: 'Brasil', conf: 'CONMEBOL' },
      { id: 'MAR', cc: 'ma', namePt: 'Marrocos', nameEn: 'Morocco', nameEs: 'Marruecos', conf: 'CAF' },
      { id: 'HAI', cc: 'ht', namePt: 'Haiti', nameEn: 'Haiti', nameEs: 'Haití', conf: 'CONCACAF' },
      { id: 'SCO', cc: 'gb-sct', namePt: 'Escócia', nameEn: 'Scotland', nameEs: 'Escocia', conf: 'UEFA' },
    ],
  },
  {
    group: 'D',
    teams: [
      { id: 'USA', cc: 'us', namePt: 'Estados Unidos', nameEn: 'United States', nameEs: 'Estados Unidos', conf: 'CONCACAF', isHost: true },
      { id: 'PAR', cc: 'py', namePt: 'Paraguai', nameEn: 'Paraguay', nameEs: 'Paraguay', conf: 'CONMEBOL' },
      { id: 'AUS', cc: 'au', namePt: 'Austrália', nameEn: 'Australia', nameEs: 'Australia', conf: 'AFC' },
      { id: 'TUR', cc: 'tr', namePt: 'Turquia', nameEn: 'Türkiye', nameEs: 'Turquía', conf: 'UEFA' },
    ],
  },
  {
    group: 'E',
    teams: [
      { id: 'GER', cc: 'de', namePt: 'Alemanha', nameEn: 'Germany', nameEs: 'Alemania', conf: 'UEFA' },
      { id: 'CUW', cc: 'cw', namePt: 'Curaçao', nameEn: 'Curaçao', nameEs: 'Curazao', conf: 'CONCACAF' },
      { id: 'CIV', cc: 'ci', namePt: 'Costa do Marfim', nameEn: 'Ivory Coast', nameEs: 'Costa de Marfil', conf: 'CAF' },
      { id: 'ECU', cc: 'ec', namePt: 'Equador', nameEn: 'Ecuador', nameEs: 'Ecuador', conf: 'CONMEBOL' },
    ],
  },
  {
    group: 'F',
    teams: [
      { id: 'NED', cc: 'nl', namePt: 'Holanda', nameEn: 'Netherlands', nameEs: 'Países Bajos', conf: 'UEFA' },
      { id: 'JPN', cc: 'jp', namePt: 'Japão', nameEn: 'Japan', nameEs: 'Japón', conf: 'AFC' },
      { id: 'SWE', cc: 'se', namePt: 'Suécia', nameEn: 'Sweden', nameEs: 'Suecia', conf: 'UEFA' },
      { id: 'TUN', cc: 'tn', namePt: 'Tunísia', nameEn: 'Tunisia', nameEs: 'Túnez', conf: 'CAF' },
    ],
  },
  {
    group: 'G',
    teams: [
      { id: 'BEL', cc: 'be', namePt: 'Bélgica', nameEn: 'Belgium', nameEs: 'Bélgica', conf: 'UEFA' },
      { id: 'EGY', cc: 'eg', namePt: 'Egito', nameEn: 'Egypt', nameEs: 'Egipto', conf: 'CAF' },
      { id: 'IRN', cc: 'ir', namePt: 'Irã', nameEn: 'Iran', nameEs: 'Irán', conf: 'AFC' },
      { id: 'NZL', cc: 'nz', namePt: 'Nova Zelândia', nameEn: 'New Zealand', nameEs: 'Nueva Zelanda', conf: 'OFC' },
    ],
  },
  {
    group: 'H',
    teams: [
      { id: 'ESP', cc: 'es', namePt: 'Espanha', nameEn: 'Spain', nameEs: 'España', conf: 'UEFA' },
      { id: 'CPV', cc: 'cv', namePt: 'Cabo Verde', nameEn: 'Cape Verde', nameEs: 'Cabo Verde', conf: 'CAF' },
      { id: 'KSA', cc: 'sa', namePt: 'Arábia Saudita', nameEn: 'Saudi Arabia', nameEs: 'Arabia Saudita', conf: 'AFC' },
      { id: 'URU', cc: 'uy', namePt: 'Uruguai', nameEn: 'Uruguay', nameEs: 'Uruguay', conf: 'CONMEBOL' },
    ],
  },
  {
    group: 'I',
    teams: [
      { id: 'FRA', cc: 'fr', namePt: 'França', nameEn: 'France', nameEs: 'Francia', conf: 'UEFA' },
      { id: 'SEN', cc: 'sn', namePt: 'Senegal', nameEn: 'Senegal', nameEs: 'Senegal', conf: 'CAF' },
      { id: 'IRQ', cc: 'iq', namePt: 'Iraque', nameEn: 'Iraq', nameEs: 'Iraq', conf: 'AFC' },
      { id: 'NOR', cc: 'no', namePt: 'Noruega', nameEn: 'Norway', nameEs: 'Noruega', conf: 'UEFA' },
    ],
  },
  {
    group: 'J',
    teams: [
      { id: 'ARG', cc: 'ar', namePt: 'Argentina', nameEn: 'Argentina', nameEs: 'Argentina', conf: 'CONMEBOL' },
      { id: 'ALG', cc: 'dz', namePt: 'Argélia', nameEn: 'Algeria', nameEs: 'Argelia', conf: 'CAF' },
      { id: 'AUT', cc: 'at', namePt: 'Áustria', nameEn: 'Austria', nameEs: 'Austria', conf: 'UEFA' },
      { id: 'JOR', cc: 'jo', namePt: 'Jordânia', nameEn: 'Jordan', nameEs: 'Jordania', conf: 'AFC' },
    ],
  },
  {
    group: 'K',
    teams: [
      { id: 'POR', cc: 'pt', namePt: 'Portugal', nameEn: 'Portugal', nameEs: 'Portugal', conf: 'UEFA' },
      { id: 'COD', cc: 'cd', namePt: 'RD do Congo', nameEn: 'DR Congo', nameEs: 'RD del Congo', conf: 'CAF' },
      { id: 'UZB', cc: 'uz', namePt: 'Uzbequistão', nameEn: 'Uzbekistan', nameEs: 'Uzbekistán', conf: 'AFC' },
      { id: 'COL', cc: 'co', namePt: 'Colômbia', nameEn: 'Colombia', nameEs: 'Colombia', conf: 'CONMEBOL' },
    ],
  },
  {
    group: 'L',
    teams: [
      { id: 'ENG', cc: 'gb-eng', namePt: 'Inglaterra', nameEn: 'England', nameEs: 'Inglaterra', conf: 'UEFA' },
      { id: 'CRO', cc: 'hr', namePt: 'Croácia', nameEn: 'Croatia', nameEs: 'Croacia', conf: 'UEFA' },
      { id: 'GHA', cc: 'gh', namePt: 'Gana', nameEn: 'Ghana', nameEs: 'Ghana', conf: 'CAF' },
      { id: 'PAN', cc: 'pa', namePt: 'Panamá', nameEn: 'Panama', nameEs: 'Panamá', conf: 'CONCACAF' },
    ],
  },
];

export const TEAMS_SEED: Team[] = GROUPS.flatMap(({ group, teams }, gi) =>
  teams.map((t, ti) => ({
    id: t.id,
    code: t.id,
    namePt: t.namePt,
    nameEn: t.nameEn,
    nameEs: t.nameEs,
    flagUrl: flag(t.cc),
    confederation: t.conf,
    isHost: !!t.isHost,
    groupStage: group,
    order: gi * 4 + ti + 1,
  }))
);

export const GROUP_LETTERS = GROUPS.map((g) => g.group);

export function getTeamById(id: string): Team | undefined {
  return TEAMS_SEED.find((t) => t.id === id);
}

export function teamsByGroup(): Record<string, Team[]> {
  const map: Record<string, Team[]> = {};
  for (const t of TEAMS_SEED) {
    (map[t.groupStage] ??= []).push(t);
  }
  return map;
}
