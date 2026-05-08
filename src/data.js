// Dados do álbum: 48 seleções × 20 figurinhas + 19 cromos FWC especiais.
// Os nomes dos jogadores e detalhes dos cromos podem ser ajustados quando o
// álbum oficial for divulgado — a estrutura abaixo já cobre toda a UI.

export const STICKERS_PER_TEAM = 20;

export const CONF_ORDER = ['CONMEBOL', 'UEFA', 'CONCACAF', 'CAF', 'AFC', 'OFC'];

export const CONF_LABELS = {
  CONMEBOL: 'Conmebol',
  UEFA: 'UEFA',
  CONCACAF: 'Concacaf',
  CAF: 'CAF',
  AFC: 'AFC',
  OFC: 'OFC',
};

export const TEAMS = [
  // Anfitriões (Concacaf)
  { code: 'USA', name: 'Estados Unidos', conf: 'CONCACAF', flag: '🇺🇸', host: true },
  { code: 'CAN', name: 'Canadá',         conf: 'CONCACAF', flag: '🇨🇦', host: true },
  { code: 'MEX', name: 'México',         conf: 'CONCACAF', flag: '🇲🇽', host: true },

  // Conmebol
  { code: 'BRA', name: 'Brasil',    conf: 'CONMEBOL', flag: '🇧🇷' },
  { code: 'ARG', name: 'Argentina', conf: 'CONMEBOL', flag: '🇦🇷' },
  { code: 'URU', name: 'Uruguai',   conf: 'CONMEBOL', flag: '🇺🇾' },
  { code: 'COL', name: 'Colômbia',  conf: 'CONMEBOL', flag: '🇨🇴' },
  { code: 'ECU', name: 'Equador',   conf: 'CONMEBOL', flag: '🇪🇨' },
  { code: 'PAR', name: 'Paraguai',  conf: 'CONMEBOL', flag: '🇵🇾' },

  // UEFA
  { code: 'ESP', name: 'Espanha',     conf: 'UEFA', flag: '🇪🇸' },
  { code: 'FRA', name: 'França',      conf: 'UEFA', flag: '🇫🇷' },
  { code: 'ENG', name: 'Inglaterra',  conf: 'UEFA', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'POR', name: 'Portugal',    conf: 'UEFA', flag: '🇵🇹' },
  { code: 'GER', name: 'Alemanha',    conf: 'UEFA', flag: '🇩🇪' },
  { code: 'ITA', name: 'Itália',      conf: 'UEFA', flag: '🇮🇹' },
  { code: 'NED', name: 'Países Baixos', conf: 'UEFA', flag: '🇳🇱' },
  { code: 'BEL', name: 'Bélgica',     conf: 'UEFA', flag: '🇧🇪' },
  { code: 'CRO', name: 'Croácia',     conf: 'UEFA', flag: '🇭🇷' },
  { code: 'SUI', name: 'Suíça',       conf: 'UEFA', flag: '🇨🇭' },
  { code: 'DEN', name: 'Dinamarca',   conf: 'UEFA', flag: '🇩🇰' },
  { code: 'POL', name: 'Polônia',     conf: 'UEFA', flag: '🇵🇱' },
  { code: 'AUT', name: 'Áustria',     conf: 'UEFA', flag: '🇦🇹' },
  { code: 'SRB', name: 'Sérvia',      conf: 'UEFA', flag: '🇷🇸' },
  { code: 'TUR', name: 'Turquia',     conf: 'UEFA', flag: '🇹🇷' },
  { code: 'NOR', name: 'Noruega',     conf: 'UEFA', flag: '🇳🇴' },
  { code: 'SCO', name: 'Escócia',     conf: 'UEFA', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },

  // CAF
  { code: 'MAR', name: 'Marrocos',    conf: 'CAF', flag: '🇲🇦' },
  { code: 'SEN', name: 'Senegal',     conf: 'CAF', flag: '🇸🇳' },
  { code: 'EGY', name: 'Egito',       conf: 'CAF', flag: '🇪🇬' },
  { code: 'ALG', name: 'Argélia',     conf: 'CAF', flag: '🇩🇿' },
  { code: 'TUN', name: 'Tunísia',     conf: 'CAF', flag: '🇹🇳' },
  { code: 'NGA', name: 'Nigéria',     conf: 'CAF', flag: '🇳🇬' },
  { code: 'GHA', name: 'Gana',        conf: 'CAF', flag: '🇬🇭' },
  { code: 'CIV', name: 'Costa do Marfim', conf: 'CAF', flag: '🇨🇮' },
  { code: 'CMR', name: 'Camarões',    conf: 'CAF', flag: '🇨🇲' },

  // AFC
  { code: 'JPN', name: 'Japão',         conf: 'AFC', flag: '🇯🇵' },
  { code: 'KOR', name: 'Coreia do Sul', conf: 'AFC', flag: '🇰🇷' },
  { code: 'IRN', name: 'Irã',           conf: 'AFC', flag: '🇮🇷' },
  { code: 'AUS', name: 'Austrália',     conf: 'AFC', flag: '🇦🇺' },
  { code: 'KSA', name: 'Arábia Saudita', conf: 'AFC', flag: '🇸🇦' },
  { code: 'QAT', name: 'Catar',         conf: 'AFC', flag: '🇶🇦' },
  { code: 'UZB', name: 'Uzbequistão',   conf: 'AFC', flag: '🇺🇿' },
  { code: 'JOR', name: 'Jordânia',      conf: 'AFC', flag: '🇯🇴' },

  // Concacaf (vagas restantes)
  { code: 'PAN', name: 'Panamá',     conf: 'CONCACAF', flag: '🇵🇦' },
  { code: 'CRC', name: 'Costa Rica', conf: 'CONCACAF', flag: '🇨🇷' },
  { code: 'JAM', name: 'Jamaica',    conf: 'CONCACAF', flag: '🇯🇲' },

  // OFC
  { code: 'NZL', name: 'Nova Zelândia', conf: 'OFC', flag: '🇳🇿' },

  // Repescagens (placeholders até definir)
  { code: 'PO1', name: 'Repescagem 1', conf: 'AFC', flag: '🏳️' },
  { code: 'PO2', name: 'Repescagem 2', conf: 'CONCACAF', flag: '🏳️' },
];

// Mapa opcional de jogadores por seleção. Quando vazio, a UI exibe "#XX".
export const TEAM_PLAYERS = {};

// 19 cromos FWC especiais — agrupados por categoria para a tela de detalhes.
export const FWC_STICKERS = [
  { num: 1,  name: 'Logo Oficial 2026',   tag: 'OFICIAL', tagColor: '#d4a437' },
  { num: 2,  name: 'Bola Trionda',         tag: 'OFICIAL', tagColor: '#d4a437' },
  { num: 3,  name: 'Troféu',                tag: 'OFICIAL', tagColor: '#d4a437' },
  { num: 4,  name: 'Maple (Canadá)',        tag: 'MASCOTE', tagColor: '#c1272d' },
  { num: 5,  name: 'Zayu (México)',         tag: 'MASCOTE', tagColor: '#c1272d' },
  { num: 6,  name: 'Clutch (EUA)',          tag: 'MASCOTE', tagColor: '#c1272d' },
  { num: 7,  name: 'Estados Unidos',        tag: 'SEDE',    tagColor: '#1a5634' },
  { num: 8,  name: 'Canadá',                tag: 'SEDE',    tagColor: '#1a5634' },
  { num: 9,  name: 'México',                tag: 'SEDE',    tagColor: '#1a5634' },
  { num: 10, name: 'Uruguai 1930',          tag: 'MOMENTO', tagColor: '#0d3520' },
  { num: 11, name: 'Brasil 1958',           tag: 'MOMENTO', tagColor: '#0d3520' },
  { num: 12, name: 'Inglaterra 1966',       tag: 'MOMENTO', tagColor: '#0d3520' },
  { num: 13, name: 'Brasil 1970',           tag: 'MOMENTO', tagColor: '#0d3520' },
  { num: 14, name: 'Argentina 1986',        tag: 'MOMENTO', tagColor: '#0d3520' },
  { num: 15, name: 'Brasil 1994',           tag: 'MOMENTO', tagColor: '#0d3520' },
  { num: 16, name: 'França 1998',           tag: 'MOMENTO', tagColor: '#0d3520' },
  { num: 17, name: 'Brasil 2002',           tag: 'MOMENTO', tagColor: '#0d3520' },
  { num: 18, name: 'Espanha 2010',          tag: 'MOMENTO', tagColor: '#0d3520' },
  { num: 19, name: 'Argentina 2022',        tag: 'MOMENTO', tagColor: '#0d3520' },
];

export const SPECIAL_SECTIONS = [
  {
    id: 'FWC',
    name: 'FIFA World Cup',
    icon: '🏆',
    count: 19,
    desc: 'Cromos especiais: oficiais, mascotes, sedes e momentos históricos',
  },
];

export const TOTAL_STICKERS =
  TEAMS.length * STICKERS_PER_TEAM +
  SPECIAL_SECTIONS.reduce((s, sec) => s + sec.count, 0);

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
      ? { name: s.name, tag: s.tag, tagColor: s.tagColor }
      : { name: `#${num}`, tag: '', tagColor: '' };
  }
  const players = TEAM_PLAYERS[code];
  const name = players && players[num - 1] ? players[num - 1] : `#${num}`;
  return { name, tag: '', tagColor: '' };
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
