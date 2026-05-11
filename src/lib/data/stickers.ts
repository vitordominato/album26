import type { ExtraTier, Sticker, StickerSection, Team } from '@/types';
import {
  EXTRA_PLAYERS_DATA,
  FWC_COUNT,
  FWC_TITLES,
  PLAYERS_BY_TEAM,
} from '@/lib/data/players';

/**
 * Catálogo oficial Panini Copa do Mundo FIFA 2026:
 *
 * - 20 FWC (FWC-1 a FWC-20) — todas foil
 *   - FWC-1 a FWC-9   → Introdução (emblema, mascotes, slogan, bola, sedes)
 *   - FWC-10 a FWC-20 → FIFA Museum (campeões históricos)
 * - 48 seleções × 20 espaços = 960
 *   - slot 1     → escudo (foil)
 *   - slot 2-12  → jogadores 1 a 11
 *   - slot 13    → foto da seleção
 *   - slot 14-20 → jogadores 12 a 18
 * - 80 Extra Stickers — 20 craques × 4 versões (regular, bronze, prata, ouro)
 *
 * Total: 20 + 960 + 80 = 1.060 figurinhas (980 do álbum + 80 extras).
 *
 * Importante: os IDs (`BRA-13`, `FWC-1`, `EXTRA-3-GOLD`, etc.) são estáveis
 * em relação à versão anterior do catálogo, então coleções já registradas
 * por usuários continuam apontando pra figurinha correta — só os labels e
 * a interpretação semântica de alguns slots foram atualizados pra refletir
 * a checklist oficial Panini 2026.
 */

export const STICKERS_PER_TEAM = 20;
export { FWC_COUNT };
export const EXTRA_PLAYERS = EXTRA_PLAYERS_DATA.length;
export const EXTRA_TIERS: ExtraTier[] = ['regular', 'bronze', 'silver', 'gold'];

const TEAM_PHOTO_SLOT = 13;

const EXTRA_TIER_PT: Record<ExtraTier, string> = {
  regular: 'Regular',
  bronze: 'Bronze',
  silver: 'Prata',
  gold: 'Ouro',
};

function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}

/**
 * Para slot de jogador (2-12 ou 14-20), retorna o índice 0-based no array
 * de PLAYERS_BY_TEAM[teamCode] (18 entradas).
 */
function playerIndexForSlot(slot: number): number | null {
  if (slot >= 2 && slot <= 12) return slot - 2; // 0..10
  if (slot >= 14 && slot <= 20) return slot - 14 + 11; // 11..17
  return null;
}

export function buildAllStickers(teams: Team[]): Sticker[] {
  const stickers: Sticker[] = [];
  let n = 1;

  // 1) FWC (20 figurinhas, todas foil)
  for (let i = 1; i <= FWC_COUNT; i++) {
    const title = FWC_TITLES[i - 1] ?? `FWC ${i}`;
    stickers.push({
      id: `FWC-${i}`,
      number: n,
      code: `FWC-${i}`,
      type: 'fwc',
      section: 'fwc',
      isFoil: true,
      label: title,
    });
    n++;
  }

  // 2) Seleções (48 × 20)
  const sortedTeams = [...teams].sort((a, b) => a.order - b.order);
  for (const team of sortedTeams) {
    const roster = PLAYERS_BY_TEAM[team.code] ?? [];
    for (let slot = 1; slot <= STICKERS_PER_TEAM; slot++) {
      let label: string;
      let type: Sticker['type'];
      let isFoil = false;

      if (slot === 1) {
        type = 'team';
        isFoil = true;
        label = `${team.namePt} — Escudo`;
      } else if (slot === TEAM_PHOTO_SLOT) {
        type = 'team';
        label = `${team.namePt} — Foto da seleção`;
      } else {
        type = 'player';
        const idx = playerIndexForSlot(slot);
        const playerName = idx != null ? roster[idx] : undefined;
        label = `${team.namePt} #${pad2(slot)} — ${playerName ?? 'A confirmar'}`;
      }

      stickers.push({
        id: `${team.code}-${slot}`,
        number: n,
        code: `${team.code}-${slot}`,
        type,
        section: 'team',
        teamId: team.id,
        teamSlot: slot,
        groupStage: team.groupStage,
        isFoil,
        isMcDonalds: false,
        label,
      });
      n++;
    }
  }

  // 3) Extras (20 craques × 4 versões = 80)
  for (let i = 0; i < EXTRA_PLAYERS_DATA.length; i++) {
    const craque = EXTRA_PLAYERS_DATA[i];
    for (const tier of EXTRA_TIERS) {
      stickers.push({
        id: `EXTRA-${i + 1}-${tier.toUpperCase()}`,
        number: n,
        code: `EXTRA-${i + 1}-${tier.toUpperCase()}`,
        type: 'extra',
        section: 'extras',
        isFoil: tier !== 'regular',
        extraTier: tier,
        label: `${craque.player} (${craque.team}) — ${EXTRA_TIER_PT[tier]}`,
      });
      n++;
    }
  }

  return stickers;
}

export interface SectionRange {
  section: StickerSection;
  start: number;
  end: number;
  count: number;
}

export function sectionRanges(stickers: Sticker[]): Record<StickerSection, SectionRange> {
  const result = {} as Record<StickerSection, SectionRange>;
  for (const s of stickers) {
    const r = result[s.section];
    if (!r) {
      result[s.section] = { section: s.section, start: s.number, end: s.number, count: 1 };
    } else {
      r.end = Math.max(r.end, s.number);
      r.count++;
    }
  }
  return result;
}
