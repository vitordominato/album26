import type { ExtraTier, Sticker, StickerSection, Team } from '@/types';

/**
 * Catálogo oficial Panini Copa do Mundo FIFA 2026:
 *
 * - 19 FWC (FWC-1 a FWC-19) — abertura/destaque/ícones
 * - 48 seleções × 20 figurinhas = 960
 *   - posições por seleção (XYZ-N): 1=escudo, 2=foto da equipe,
 *     3..19=jogadores, 20=técnico
 *   - posição #13 de cada seleção é exclusiva McDonald's (rara)
 * - 80 Extra Stickers — 20 estrelas × 4 versões (regular, bronze, prata, ouro)
 *
 * Total: 19 + 960 + 80 = 1.059 figurinhas.
 */

export const STICKERS_PER_TEAM = 20;
export const FWC_COUNT = 19;
export const EXTRA_PLAYERS = 20;
export const EXTRA_TIERS: ExtraTier[] = ['regular', 'bronze', 'silver', 'gold'];
export const MCDONALDS_SLOT = 13;

const SLOT_LABELS: Record<number, string | undefined> = {
  1: 'Escudo',
  2: 'Foto da equipe',
  20: 'Técnico',
};

const EXTRA_TIER_PT: Record<ExtraTier, string> = {
  regular: 'Regular',
  bronze: 'Bronze',
  silver: 'Prata',
  gold: 'Ouro',
};

function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}

export function buildAllStickers(teams: Team[]): Sticker[] {
  const stickers: Sticker[] = [];
  let n = 1;

  // 1) FWC (19 figurinhas, todas brilhantes)
  for (let i = 1; i <= FWC_COUNT; i++) {
    stickers.push({
      id: `FWC-${i}`,
      number: n,
      code: `FWC-${i}`,
      type: 'fwc',
      section: 'fwc',
      isFoil: true,
      label: `FWC ${i}`,
    });
    n++;
  }

  // 2) Seleções (48 × 20)
  const sortedTeams = [...teams].sort((a, b) => a.order - b.order);
  for (const team of sortedTeams) {
    for (let slot = 1; slot <= STICKERS_PER_TEAM; slot++) {
      const isMcDonalds = slot === MCDONALDS_SLOT;
      const isFoil = slot === 1; // escudo brilhante (padrão Panini)
      const slotLabel = SLOT_LABELS[slot] ?? `Jogador ${slot - 2}`;
      stickers.push({
        id: `${team.code}-${slot}`,
        number: n,
        code: `${team.code}-${slot}`,
        type: slot === 1 || slot === 2 ? 'team' : 'player',
        section: 'team',
        teamId: team.id,
        teamSlot: slot,
        groupStage: team.groupStage,
        isFoil,
        isMcDonalds,
        label: `${team.namePt} #${pad2(slot)} — ${slotLabel}${isMcDonalds ? ' (McDonald’s)' : ''}`,
      });
      n++;
    }
  }

  // 3) Extras (20 estrelas × 4 versões = 80)
  for (let i = 1; i <= EXTRA_PLAYERS; i++) {
    for (const tier of EXTRA_TIERS) {
      stickers.push({
        id: `EXTRA-${i}-${tier.toUpperCase()}`,
        number: n,
        code: `EXTRA-${i}-${tier.toUpperCase()}`,
        type: 'extra',
        section: 'extras',
        isFoil: tier !== 'regular',
        extraTier: tier,
        label: `Estrela ${i} — ${EXTRA_TIER_PT[tier]}`,
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
