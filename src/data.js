// Stub data module — populate with the real album data (48 teams × 20 stickers,
// 19 FWC stickers, special sections) before shipping to users. The structure
// below matches what App.jsx imports.

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
  { code: 'BRA', name: 'Brasil', conf: 'CONMEBOL', flag: '🇧🇷' },
  { code: 'ARG', name: 'Argentina', conf: 'CONMEBOL', flag: '🇦🇷' },
  { code: 'USA', name: 'Estados Unidos', conf: 'CONCACAF', flag: '🇺🇸' },
  { code: 'CAN', name: 'Canadá', conf: 'CONCACAF', flag: '🇨🇦' },
  { code: 'MEX', name: 'México', conf: 'CONCACAF', flag: '🇲🇽' },
];

export const TEAM_PLAYERS = {};

export const FWC_STICKERS = Array.from({ length: 19 }, (_, i) => ({
  num: i + 1,
  name: `FWC ${i + 1}`,
  tag: 'FWC',
  tagColor: '#d4a437',
}));

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
    return s ? { name: s.name, tag: s.tag, tagColor: s.tagColor } : { name: `#${num}`, tag: '', tagColor: '' };
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
