import { TEAM_PLAYERS } from './players.js';

// Estrutura oficial do álbum Panini FIFA World Cup 2026™.
// 48 seleções × 20 cromos = 960
// 19 cromos especiais FWC (FWC-1 a FWC-19)
// (a capa do álbum existe mas não é colável e não entra no progresso)
// Total colável = 979 cromos · Total oficial divulgado = 980 (inclui capa)

export const STICKERS_PER_TEAM = 20;

// Tipos de cromo dentro de uma seleção
//   #1: escudo metalizado
//   #2..#12, #14..#20: jogadores (18 no total)
//   #13: foto do time posado (exclusivo McDonald's, só nos pacotinhos do fast-food)
export const STICKER_KIND = {
  ESCUDO: 'ESCUDO',
  JOGADOR: 'JOGADOR',
  TIME_POSADO: 'TIME_POSADO',
};

export function getTeamStickerKind(num) {
  if (num === 1) return STICKER_KIND.ESCUDO;
  if (num === 13) return STICKER_KIND.TIME_POSADO;
  return STICKER_KIND.JOGADOR;
}

export const CONF_ORDER = ['CONMEBOL', 'UEFA', 'CONCACAF', 'CAF', 'AFC', 'OFC'];

export const CONF_LABELS = {
  CONMEBOL: 'Conmebol',
  UEFA: 'UEFA',
  CONCACAF: 'Concacaf',
  CAF: 'CAF',
  AFC: 'AFC',
  OFC: 'OFC',
};

export const GROUP_ORDER = ['A','B','C','D','E','F','G','H','I','J','K','L'];

// 48 seleções nos 12 grupos do Mundial 2026.
export const TEAMS = [
  // Grupo A
  { code: 'MEX', name: 'México',           conf: 'CONCACAF', flag: '🇲🇽', group: 'A', host: true },
  { code: 'RSA', name: 'África do Sul',    conf: 'CAF',      flag: '🇿🇦', group: 'A' },
  { code: 'KOR', name: 'Coreia do Sul',    conf: 'AFC',      flag: '🇰🇷', group: 'A' },
  { code: 'CZE', name: 'República Tcheca', conf: 'UEFA',     flag: '🇨🇿', group: 'A' },

  // Grupo B
  { code: 'CAN', name: 'Canadá',                conf: 'CONCACAF', flag: '🇨🇦', group: 'B', host: true },
  { code: 'BIH', name: 'Bósnia e Herzegovina',  conf: 'UEFA',     flag: '🇧🇦', group: 'B' },
  { code: 'QAT', name: 'Catar',                 conf: 'AFC',      flag: '🇶🇦', group: 'B' },
  { code: 'SUI', name: 'Suíça',                 conf: 'UEFA',     flag: '🇨🇭', group: 'B' },

  // Grupo C
  { code: 'BRA', name: 'Brasil',   conf: 'CONMEBOL', flag: '🇧🇷', group: 'C' },
  { code: 'MAR', name: 'Marrocos', conf: 'CAF',      flag: '🇲🇦', group: 'C' },
  { code: 'HAI', name: 'Haiti',    conf: 'CONCACAF', flag: '🇭🇹', group: 'C' },
  { code: 'SCO', name: 'Escócia',  conf: 'UEFA',     flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', group: 'C' },

  // Grupo D
  { code: 'USA', name: 'Estados Unidos', conf: 'CONCACAF', flag: '🇺🇸', group: 'D', host: true },
  { code: 'PAR', name: 'Paraguai',       conf: 'CONMEBOL', flag: '🇵🇾', group: 'D' },
  { code: 'AUS', name: 'Austrália',      conf: 'AFC',      flag: '🇦🇺', group: 'D' },
  { code: 'TUR', name: 'Turquia',        conf: 'UEFA',     flag: '🇹🇷', group: 'D' },

  // Grupo E
  { code: 'GER', name: 'Alemanha',        conf: 'UEFA',     flag: '🇩🇪', group: 'E' },
  { code: 'CUW', name: 'Curaçao',         conf: 'CONCACAF', flag: '🇨🇼', group: 'E' },
  { code: 'CIV', name: 'Costa do Marfim', conf: 'CAF',      flag: '🇨🇮', group: 'E' },
  { code: 'ECU', name: 'Equador',         conf: 'CONMEBOL', flag: '🇪🇨', group: 'E' },

  // Grupo F
  { code: 'NED', name: 'Países Baixos', conf: 'UEFA', flag: '🇳🇱', group: 'F' },
  { code: 'JPN', name: 'Japão',         conf: 'AFC',  flag: '🇯🇵', group: 'F' },
  { code: 'SWE', name: 'Suécia',        conf: 'UEFA', flag: '🇸🇪', group: 'F' },
  { code: 'TUN', name: 'Tunísia',       conf: 'CAF',  flag: '🇹🇳', group: 'F' },

  // Grupo G
  { code: 'BEL', name: 'Bélgica',       conf: 'UEFA', flag: '🇧🇪', group: 'G' },
  { code: 'EGY', name: 'Egito',         conf: 'CAF',  flag: '🇪🇬', group: 'G' },
  { code: 'IRN', name: 'Irã',           conf: 'AFC',  flag: '🇮🇷', group: 'G' },
  { code: 'NZL', name: 'Nova Zelândia', conf: 'OFC',  flag: '🇳🇿', group: 'G' },

  // Grupo H
  { code: 'ESP', name: 'Espanha',         conf: 'UEFA',     flag: '🇪🇸', group: 'H' },
  { code: 'CPV', name: 'Cabo Verde',      conf: 'CAF',      flag: '🇨🇻', group: 'H' },
  { code: 'KSA', name: 'Arábia Saudita',  conf: 'AFC',      flag: '🇸🇦', group: 'H' },
  { code: 'URU', name: 'Uruguai',         conf: 'CONMEBOL', flag: '🇺🇾', group: 'H' },

  // Grupo I
  { code: 'FRA', name: 'França',  conf: 'UEFA', flag: '🇫🇷', group: 'I' },
  { code: 'SEN', name: 'Senegal', conf: 'CAF',  flag: '🇸🇳', group: 'I' },
  { code: 'IRQ', name: 'Iraque',  conf: 'AFC',  flag: '🇮🇶', group: 'I' },
  { code: 'NOR', name: 'Noruega', conf: 'UEFA', flag: '🇳🇴', group: 'I' },

  // Grupo J
  { code: 'ARG', name: 'Argentina', conf: 'CONMEBOL', flag: '🇦🇷', group: 'J' },
  { code: 'ALG', name: 'Argélia',   conf: 'CAF',      flag: '🇩🇿', group: 'J' },
  { code: 'AUT', name: 'Áustria',   conf: 'UEFA',     flag: '🇦🇹', group: 'J' },
  { code: 'JOR', name: 'Jordânia',  conf: 'AFC',      flag: '🇯🇴', group: 'J' },

  // Grupo K
  { code: 'POR', name: 'Portugal',     conf: 'UEFA',     flag: '🇵🇹', group: 'K' },
  { code: 'COD', name: 'RD do Congo',  conf: 'CAF',      flag: '🇨🇩', group: 'K' },
  { code: 'UZB', name: 'Uzbequistão',  conf: 'AFC',      flag: '🇺🇿', group: 'K' },
  { code: 'COL', name: 'Colômbia',     conf: 'CONMEBOL', flag: '🇨🇴', group: 'K' },

  // Grupo L
  { code: 'ENG', name: 'Inglaterra', conf: 'UEFA', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'L' },
  { code: 'CRO', name: 'Croácia',    conf: 'UEFA', flag: '🇭🇷', group: 'L' },
  { code: 'GHA', name: 'Gana',       conf: 'CAF',  flag: '🇬🇭', group: 'L' },
  { code: 'PAN', name: 'Panamá',     conf: 'CONCACAF', flag: '🇵🇦', group: 'L' },
];

// Mapa de jogadores por seleção: TEAM_PLAYERS[code][num-1] vira o nome no
// cromo. As listas vivem em players.js — baseadas em convocações recentes,
// devem ser revisadas quando o álbum oficial Panini sair.
export { TEAM_PLAYERS };

// 19 cromos especiais FWC, conforme estrutura oficial divulgada pela Panini.
export const FWC_STICKERS = [
  { num: 1,  name: 'Emblema Oficial',     tag: 'OFICIAL', tagColor: '#d4a437' },
  { num: 2,  name: 'Slogan Oficial',      tag: 'OFICIAL', tagColor: '#d4a437' },
  { num: 3,  name: 'Bola Trionda',        tag: 'OFICIAL', tagColor: '#d4a437' },
  { num: 4,  name: 'Maple (Canadá)',      tag: 'MASCOTE', tagColor: '#c1272d' },
  { num: 5,  name: 'Zayu (México)',       tag: 'MASCOTE', tagColor: '#c1272d' },
  { num: 6,  name: 'Clutch (EUA)',        tag: 'MASCOTE', tagColor: '#c1272d' },
  { num: 7,  name: 'Sede — Canadá',       tag: 'SEDE',    tagColor: '#1a5634' },
  { num: 8,  name: 'Sede — México',       tag: 'SEDE',    tagColor: '#1a5634' },
  { num: 9,  name: 'Sede — Estados Unidos', tag: 'SEDE',  tagColor: '#1a5634' },
  { num: 10, name: 'Uruguai 1930',        tag: 'MOMENTO', tagColor: '#0d3520' },
  { num: 11, name: 'Suíça 1954',          tag: 'MOMENTO', tagColor: '#0d3520' },
  { num: 12, name: 'Brasil 1958',         tag: 'MOMENTO', tagColor: '#0d3520' },
  { num: 13, name: 'Inglaterra 1966',     tag: 'MOMENTO', tagColor: '#0d3520' },
  { num: 14, name: 'Brasil 1970',         tag: 'MOMENTO', tagColor: '#0d3520' },
  { num: 15, name: 'Argentina 1986',      tag: 'MOMENTO', tagColor: '#0d3520' },
  { num: 16, name: 'França 1998',         tag: 'MOMENTO', tagColor: '#0d3520' },
  { num: 17, name: 'Brasil 2002',         tag: 'MOMENTO', tagColor: '#0d3520' },
  { num: 18, name: 'Espanha 2010',        tag: 'MOMENTO', tagColor: '#0d3520' },
  { num: 19, name: 'Argentina 2022',      tag: 'MOMENTO', tagColor: '#0d3520' },
];

export const SPECIAL_SECTIONS = [
  {
    id: 'FWC',
    name: 'FIFA World Cup',
    icon: '🏆',
    count: 19,
    desc: 'Especiais: oficiais, mascotes, sedes e momentos históricos',
  },
];

export const TOTAL_STICKERS =
  TEAMS.length * STICKERS_PER_TEAM +
  SPECIAL_SECTIONS.reduce((s, sec) => s + sec.count, 0);

// Total oficial divulgado pela Panini (inclui a capa, que não é colável).
export const TOTAL_OFICIAL = TOTAL_STICKERS + 1;

export function generateCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 6; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

export function stickerKey(code, num) {
  return `${code}-${num}`;
}

export function getStickerInfo(code, num) {
  const section = SPECIAL_SECTIONS.find(s => s.id === code);
  if (section) {
    const list = code === 'FWC' ? FWC_STICKERS : [];
    const s = list[num - 1];
    return s
      ? { name: s.name, tag: s.tag, tagColor: s.tagColor, kind: 'FWC' }
      : { name: `#${num}`, tag: '', tagColor: '', kind: 'FWC' };
  }
  const kind = getTeamStickerKind(num);
  if (kind === STICKER_KIND.ESCUDO) {
    return { name: 'Escudo', tag: 'METALIZADO', tagColor: '#d4a437', kind };
  }
  if (kind === STICKER_KIND.TIME_POSADO) {
    return { name: 'Time posado', tag: "MCDONALD'S", tagColor: '#c1272d', kind };
  }
  const players = TEAM_PLAYERS[code];
  const name = players && players[num - 1] ? players[num - 1] : `#${num}`;
  return { name, tag: '', tagColor: '', kind };
}

export function getStickerStatus(album, key) {
  const s = album && album.stickers ? album.stickers[key] : null;
  return { count: s && typeof s.count === 'number' ? s.count : 0 };
}

export function teamProgress(album, teamCode) {
  let have = 0, dupes = 0;
  for (let i = 1; i <= STICKERS_PER_TEAM; i++) {
    const c = getStickerStatus(album, stickerKey(teamCode, i)).count;
    if (c > 0) have += 1;
    if (c > 1) dupes += c - 1;
  }
  return { have, total: STICKERS_PER_TEAM, missing: STICKERS_PER_TEAM - have, dupes };
}

export function sectionProgress(album, secId, count) {
  let have = 0, dupes = 0;
  for (let i = 1; i <= count; i++) {
    const c = getStickerStatus(album, stickerKey(secId, i)).count;
    if (c > 0) have += 1;
    if (c > 1) dupes += c - 1;
  }
  return { have, total: count, missing: count - have, dupes };
}

export function totalProgress(album) {
  let have = 0, dupes = 0;
  TEAMS.forEach(t => {
    const p = teamProgress(album, t.code);
    have += p.have; dupes += p.dupes;
  });
  SPECIAL_SECTIONS.forEach(sec => {
    const p = sectionProgress(album, sec.id, sec.count);
    have += p.have; dupes += p.dupes;
  });
  return { have, total: TOTAL_STICKERS, missing: TOTAL_STICKERS - have, dupes };
}
