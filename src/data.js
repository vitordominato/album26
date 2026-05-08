// Dados do álbum FIFA World Cup 2026.
//
// Cobertura:
//   - 48 seleções (3 anfitriões + 6 CONMEBOL + 3 CONCACAF + 16 UEFA + 9 CAF
//     + 8 AFC + 1 OFC + 2 vencedores da repescagem inter-confederações)
//   - 20 figurinhas por seleção (uso #01..#20 como placeholder; preencha
//     TEAM_PLAYERS abaixo com os nomes reais quando tiver o álbum em mãos)
//   - 19 figurinhas FWC: 3 mascotes + bola Trionda + 11 sedes (USA) +
//     4 momentos históricos. Estrutura é palpite — ajuste conforme o álbum.
//
// Itens marcados `// VERIFICAR` dependem de jogos posteriores ao meu corte
// de conhecimento (jan/2026): repescagem UEFA e inter-confederações de mar/2026.

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
  // ===== Anfitriões (CONCACAF) =====
  { code: 'CAN', name: 'Canadá',          conf: 'CONCACAF', flag: '🇨🇦' },
  { code: 'MEX', name: 'México',          conf: 'CONCACAF', flag: '🇲🇽' },
  { code: 'USA', name: 'Estados Unidos',  conf: 'CONCACAF', flag: '🇺🇸' },

  // ===== CONMEBOL (6 diretos) =====
  { code: 'ARG', name: 'Argentina',       conf: 'CONMEBOL', flag: '🇦🇷' },
  { code: 'BRA', name: 'Brasil',          conf: 'CONMEBOL', flag: '🇧🇷' },
  { code: 'COL', name: 'Colômbia',        conf: 'CONMEBOL', flag: '🇨🇴' },
  { code: 'ECU', name: 'Equador',         conf: 'CONMEBOL', flag: '🇪🇨' },
  { code: 'PAR', name: 'Paraguai',        conf: 'CONMEBOL', flag: '🇵🇾' },
  { code: 'URU', name: 'Uruguai',         conf: 'CONMEBOL', flag: '🇺🇾' },

  // ===== CONCACAF adicionais (3 diretos além dos anfitriões) =====
  { code: 'CRC', name: 'Costa Rica',      conf: 'CONCACAF', flag: '🇨🇷' },
  { code: 'HON', name: 'Honduras',        conf: 'CONCACAF', flag: '🇭🇳' },
  { code: 'PAN', name: 'Panamá',          conf: 'CONCACAF', flag: '🇵🇦' },

  // ===== UEFA (12 vencedores de grupo) =====
  { code: 'AUT', name: 'Áustria',         conf: 'UEFA',     flag: '🇦🇹' },
  { code: 'BEL', name: 'Bélgica',         conf: 'UEFA',     flag: '🇧🇪' },
  { code: 'CRO', name: 'Croácia',         conf: 'UEFA',     flag: '🇭🇷' },
  { code: 'ENG', name: 'Inglaterra',      conf: 'UEFA',     flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'ESP', name: 'Espanha',         conf: 'UEFA',     flag: '🇪🇸' },
  { code: 'FRA', name: 'França',          conf: 'UEFA',     flag: '🇫🇷' },
  { code: 'GER', name: 'Alemanha',        conf: 'UEFA',     flag: '🇩🇪' },
  { code: 'ITA', name: 'Itália',          conf: 'UEFA',     flag: '🇮🇹' },
  { code: 'NED', name: 'Holanda',         conf: 'UEFA',     flag: '🇳🇱' },
  { code: 'NOR', name: 'Noruega',         conf: 'UEFA',     flag: '🇳🇴' },
  { code: 'POR', name: 'Portugal',        conf: 'UEFA',     flag: '🇵🇹' },
  { code: 'SUI', name: 'Suíça',           conf: 'UEFA',     flag: '🇨🇭' },

  // ===== UEFA (4 vencedores da repescagem mar/2026 — VERIFICAR) =====
  { code: 'DEN', name: 'Dinamarca',       conf: 'UEFA',     flag: '🇩🇰' }, // VERIFICAR
  { code: 'POL', name: 'Polônia',         conf: 'UEFA',     flag: '🇵🇱' }, // VERIFICAR
  { code: 'SCO', name: 'Escócia',         conf: 'UEFA',     flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' }, // VERIFICAR
  { code: 'TUR', name: 'Turquia',         conf: 'UEFA',     flag: '🇹🇷' }, // VERIFICAR

  // ===== CAF (9 diretos) =====
  { code: 'ALG', name: 'Argélia',         conf: 'CAF',      flag: '🇩🇿' },
  { code: 'CIV', name: 'Costa do Marfim', conf: 'CAF',      flag: '🇨🇮' },
  { code: 'CMR', name: 'Camarões',        conf: 'CAF',      flag: '🇨🇲' },
  { code: 'EGY', name: 'Egito',           conf: 'CAF',      flag: '🇪🇬' },
  { code: 'GHA', name: 'Gana',            conf: 'CAF',      flag: '🇬🇭' },
  { code: 'MAR', name: 'Marrocos',        conf: 'CAF',      flag: '🇲🇦' },
  { code: 'NGA', name: 'Nigéria',         conf: 'CAF',      flag: '🇳🇬' },
  { code: 'SEN', name: 'Senegal',         conf: 'CAF',      flag: '🇸🇳' },
  { code: 'TUN', name: 'Tunísia',         conf: 'CAF',      flag: '🇹🇳' },

  // ===== AFC (8 diretos) =====
  { code: 'AUS', name: 'Austrália',       conf: 'AFC',      flag: '🇦🇺' },
  { code: 'IRN', name: 'Irã',             conf: 'AFC',      flag: '🇮🇷' },
  { code: 'IRQ', name: 'Iraque',          conf: 'AFC',      flag: '🇮🇶' },
  { code: 'JOR', name: 'Jordânia',        conf: 'AFC',      flag: '🇯🇴' },
  { code: 'JPN', name: 'Japão',           conf: 'AFC',      flag: '🇯🇵' },
  { code: 'KOR', name: 'Coreia do Sul',   conf: 'AFC',      flag: '🇰🇷' },
  { code: 'KSA', name: 'Arábia Saudita',  conf: 'AFC',      flag: '🇸🇦' },
  { code: 'UZB', name: 'Uzbequistão',     conf: 'AFC',      flag: '🇺🇿' },

  // ===== OFC (1 direto) =====
  { code: 'NZL', name: 'Nova Zelândia',   conf: 'OFC',      flag: '🇳🇿' },

  // ===== Repescagem inter-confederações (2 vagas — VERIFICAR) =====
  { code: 'BOL', name: 'Bolívia',         conf: 'CONMEBOL', flag: '🇧🇴' }, // VERIFICAR
  { code: 'NCL', name: 'Nova Caledônia',  conf: 'OFC',      flag: '🇳🇨' }, // VERIFICAR
];

// Nomes dos jogadores por seleção (TEAM_PLAYERS[code][num-1]).
// Vazio = stickers aparecem como "#01", "#02"... Preencha com o álbum em mãos.
//
// Exemplo:
//   BRA: ['Alisson', 'Danilo', 'Marquinhos', /* ... 20 nomes */],
export const TEAM_PLAYERS = {};

// 19 figurinhas FWC (mascotes, bola, sedes, momentos históricos).
// Ajuste conforme o álbum oficial — esta é a melhor estimativa.
export const FWC_STICKERS = [
  { num: 1,  name: 'Mascote Maple',     tag: 'MASCOTE',  tagColor: '#dc2626' }, // Canadá
  { num: 2,  name: 'Mascote Zayu',      tag: 'MASCOTE',  tagColor: '#dc2626' }, // México
  { num: 3,  name: 'Mascote Clutch',    tag: 'MASCOTE',  tagColor: '#dc2626' }, // EUA
  { num: 4,  name: 'Bola Trionda',      tag: 'BOLA',     tagColor: '#d4a437' },
  { num: 5,  name: 'Atlanta',           tag: 'SEDE',     tagColor: '#3b82f6' },
  { num: 6,  name: 'Boston',            tag: 'SEDE',     tagColor: '#3b82f6' },
  { num: 7,  name: 'Dallas',            tag: 'SEDE',     tagColor: '#3b82f6' },
  { num: 8,  name: 'Houston',           tag: 'SEDE',     tagColor: '#3b82f6' },
  { num: 9,  name: 'Kansas City',       tag: 'SEDE',     tagColor: '#3b82f6' },
  { num: 10, name: 'Los Angeles',       tag: 'SEDE',     tagColor: '#3b82f6' },
  { num: 11, name: 'Miami',             tag: 'SEDE',     tagColor: '#3b82f6' },
  { num: 12, name: 'New York / NJ',     tag: 'SEDE',     tagColor: '#3b82f6' },
  { num: 13, name: 'Philadelphia',      tag: 'SEDE',     tagColor: '#3b82f6' },
  { num: 14, name: 'San Francisco Bay', tag: 'SEDE',     tagColor: '#3b82f6' },
  { num: 15, name: 'Seattle',           tag: 'SEDE',     tagColor: '#3b82f6' },
  { num: 16, name: 'Final 1930',        tag: 'MOMENTO',  tagColor: '#a855f7' },
  { num: 17, name: 'Final 1958',        tag: 'MOMENTO',  tagColor: '#a855f7' },
  { num: 18, name: 'Final 1970',        tag: 'MOMENTO',  tagColor: '#a855f7' },
  { num: 19, name: 'Final 2022',        tag: 'MOMENTO',  tagColor: '#a855f7' },
];

export const SPECIAL_SECTIONS = [
  { id: 'FWC', name: 'FIFA World Cup', icon: '🏆', count: 19 },
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
  if (code === 'FWC') {
    const s = FWC_STICKERS[num - 1];
    return s
      ? { name: s.name, tag: s.tag, tagColor: s.tagColor }
      : { name: `#${num}`, tag: '', tagColor: '' };
  }
  const players = TEAM_PLAYERS[code];
  const name = players && players[num - 1]
    ? players[num - 1]
    : `#${String(num).padStart(2, '0')}`;
  return { name, tag: '', tagColor: '' };
}

export function getStickerStatus(album, key) {
  const s = album && album.stickers ? album.stickers[key] : null;
  return { count: s && typeof s.count === 'number' ? s.count : 0 };
}

export function teamProgress(album, teamCode) {
  let have = 0;
  for (let i = 1; i <= STICKERS_PER_TEAM; i++) {
    if (getStickerStatus(album, stickerKey(teamCode, i)).count > 0) have += 1;
  }
  return { have, total: STICKERS_PER_TEAM };
}

export function sectionProgress(album, secId, count) {
  let have = 0;
  for (let i = 1; i <= count; i++) {
    if (getStickerStatus(album, stickerKey(secId, i)).count > 0) have += 1;
  }
  return { have, total: count };
}

export function totalProgress(album) {
  let have = 0;
  TEAMS.forEach(t => { have += teamProgress(album, t.code).have; });
  SPECIAL_SECTIONS.forEach(sec => { have += sectionProgress(album, sec.id, sec.count).have; });
  return { have, total: TOTAL_STICKERS };
}
