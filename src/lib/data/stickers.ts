import type { Sticker, StickerSection, Team } from '@/types';

/**
 * Estrutura padrão Panini para Copa 2026:
 * - Capa/Abertura: 4 figurinhas (logo, mascote, troféu, bola)
 * - Países-sede: 3 (USA, MEX, CAN)
 * - Estádios: 16
 * - Lendas: 12
 * - 48 seleções × 18 figurinhas (escudo + foto + 18 jogadores + técnico = 20 por team page) = 960
 * - Brilhantes/Special: 30 capitães + 18 craques foil
 * - Fan Festival/Encerramento: 6
 *
 * Os números seguem ordem: cover (1-4), hosts (5-7), stadiums (8-23),
 * legends (24-35), teams (36-995), special (996-1043), fanfest (1044-1049).
 *
 * Total ≈ 670+ figurinhas. Ajuste o número de figurinhas por seleção (`PER_TEAM`)
 * conforme o catálogo oficial quando for divulgado.
 */

export const STICKERS_PER_TEAM = 13; // escudo + foto + 11 jogadores (ajuste conforme catálogo oficial)
export const COVER_COUNT = 4;
export const HOSTS_COUNT = 3;
export const STADIUMS_COUNT = 16;
export const LEGENDS_COUNT = 12;
export const SPECIAL_COUNT = 24;
export const FANFEST_COUNT = 6;

interface SectionRange {
  section: StickerSection;
  start: number;
  end: number;
}

export function buildAllStickers(teams: Team[]): Sticker[] {
  const stickers: Sticker[] = [];
  let n = 1;

  // Capa
  const coverLabels = ['Logo Oficial', 'Mascote Trionda', 'Troféu FIFA', 'Bola Oficial'];
  for (let i = 0; i < COVER_COUNT; i++) {
    stickers.push({
      id: `FWC${n}`,
      number: n,
      code: `FWC${n}`,
      type: 'cover',
      section: 'cover',
      isFoil: i === 2,
      label: coverLabels[i],
    });
    n++;
  }

  // Países-sede
  const hostCodes = ['USA', 'MEX', 'CAN'];
  for (const code of hostCodes) {
    stickers.push({
      id: `FWC${n}`,
      number: n,
      code: `FWC${n}`,
      type: 'host',
      section: 'hosts',
      teamId: code,
      isFoil: false,
      label: `Sede: ${code}`,
    });
    n++;
  }

  // Estádios
  for (let i = 0; i < STADIUMS_COUNT; i++) {
    stickers.push({
      id: `FWC${n}`,
      number: n,
      code: `FWC${n}`,
      type: 'stadium',
      section: 'stadiums',
      isFoil: false,
      label: `Estádio ${i + 1}`,
    });
    n++;
  }

  // Lendas
  for (let i = 0; i < LEGENDS_COUNT; i++) {
    stickers.push({
      id: `FWC${n}`,
      number: n,
      code: `FWC${n}`,
      type: 'legend',
      section: 'legends',
      isFoil: true,
      label: `Lenda ${i + 1}`,
    });
    n++;
  }

  // Seleções
  const sortedTeams = [...teams].sort((a, b) => a.order - b.order);
  for (const team of sortedTeams) {
    // Escudo + foto da equipe
    stickers.push({
      id: `${team.code}1`,
      number: n,
      code: `${team.code}1`,
      type: 'team',
      section: 'team',
      teamId: team.id,
      isFoil: true,
      label: `${team.namePt} — Escudo`,
    });
    n++;
    stickers.push({
      id: `${team.code}2`,
      number: n,
      code: `${team.code}2`,
      type: 'team',
      section: 'team',
      teamId: team.id,
      isFoil: false,
      label: `${team.namePt} — Equipe`,
    });
    n++;

    for (let i = 3; i <= STICKERS_PER_TEAM; i++) {
      stickers.push({
        id: `${team.code}${i}`,
        number: n,
        code: `${team.code}${i}`,
        type: 'player',
        section: 'team',
        teamId: team.id,
        isFoil: false,
        label: `${team.namePt} — Jogador ${i - 2}`,
      });
      n++;
    }
  }

  // Brilhantes
  for (let i = 0; i < SPECIAL_COUNT; i++) {
    stickers.push({
      id: `FWS${i + 1}`,
      number: n,
      code: `FWS${i + 1}`,
      type: 'special',
      section: 'special',
      isFoil: true,
      label: `Special ${i + 1}`,
    });
    n++;
  }

  // Fan Festival
  for (let i = 0; i < FANFEST_COUNT; i++) {
    stickers.push({
      id: `FWF${i + 1}`,
      number: n,
      code: `FWF${i + 1}`,
      type: 'special',
      section: 'fanfest',
      isFoil: false,
      label: `Fan Festival ${i + 1}`,
    });
    n++;
  }

  return stickers;
}

export function sectionRange(stickers: Sticker[], section: StickerSection): SectionRange | null {
  const filtered = stickers.filter((s) => s.section === section);
  if (filtered.length === 0) return null;
  return {
    section,
    start: filtered[0].number,
    end: filtered[filtered.length - 1].number,
  };
}
