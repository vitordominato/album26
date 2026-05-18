import { motion } from 'framer-motion';
import { Plus, Minus, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { CocaColaIcon } from '@/components/icons/CocaColaIcon';
import type { ExtraTier, Sticker } from '@/types';

interface Props {
  sticker: Sticker;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  compact?: boolean;
}

const EXTRA_TIER_BG: Record<ExtraTier, string> = {
  regular: 'from-violet-700/70 to-violet-950/70 border-violet-400/60',
  bronze: 'from-amber-700/80 to-amber-950/70 border-amber-500/70',
  silver: 'from-slate-300/70 to-slate-600/70 border-slate-200/80',
  gold: 'from-yellow-400/80 to-amber-700/70 border-yellow-300/90',
};

const EXTRA_TIER_LABEL: Record<ExtraTier, string> = {
  regular: 'Regular',
  bronze: 'Bronze',
  silver: 'Prata',
  gold: 'Ouro',
};

export function StickerCard({ sticker, quantity, onIncrement, onDecrement, compact }: Props) {
  const has = quantity > 0;
  const isDup = quantity > 1;
  const isExtra = sticker.section === 'extras';
  const isCocaCola = sticker.section === 'cocacola';
  const extraTier = sticker.extraTier;

  const borderClass = has
    ? isExtra && extraTier
      ? EXTRA_TIER_BG[extraTier].split(' ').filter((c) => c.startsWith('border')).join(' ')
      : isCocaCola
        ? 'border-red-500'
        : 'border-fifa-gold'
    : isCocaCola
      ? 'border-dashed border-red-500/40'
      : 'border-dashed border-muted';

  const bgClass = has
    ? isExtra && extraTier
      ? `bg-gradient-to-b ${EXTRA_TIER_BG[extraTier].split(' ').filter((c) => !c.startsWith('border')).join(' ')}`
      : isCocaCola
        ? 'bg-gradient-to-b from-red-600/70 to-red-900/60'
        : 'bg-gradient-to-b from-fifa-green/40 to-fifa-green/10'
    : isCocaCola
      ? 'bg-red-950/20'
      : 'bg-muted/30';

  return (
    <motion.div
      layout
      whileTap={{ scale: 0.97 }}
      className={cn(
        'relative flex flex-col overflow-hidden rounded-lg border-2 transition-all',
        borderClass,
        has ? 'bg-card' : '',
        compact ? 'aspect-[3/4]' : 'aspect-[3/4.4]'
      )}
    >
      <button
        type="button"
        onClick={onIncrement}
        className="relative flex flex-1 items-center justify-center"
        aria-label={has ? `Adicionar mais ${sticker.code}` : `Coletei ${sticker.code}`}
      >
        {has ? (
          <motion.div
            initial={{ scale: 0.6, rotate: -8, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className={cn('flex h-full w-full flex-col items-center justify-center p-2 text-center', bgClass)}
          >
            {sticker.imageUrl ? (
              <img
                src={sticker.imageUrl}
                alt={sticker.label ?? sticker.code}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center">
                {sticker.isFoil && <Sparkles className="mb-1 h-5 w-5 text-fifa-gold" />}
                <span className="text-[10px] font-semibold uppercase text-fifa-gold/90">
                  {sticker.code}
                </span>
                <span className="mt-1 text-[10px] text-muted-foreground line-clamp-2">
                  {sticker.label}
                </span>
              </div>
            )}
          </motion.div>
        ) : (
          <span className="text-[10px] font-bold text-muted-foreground/70 px-1 text-center break-all">
            {sticker.code}
          </span>
        )}
      </button>

      {/* badges sobre o card */}
      {isCocaCola && (
        <Badge className="absolute left-1 top-1 gap-1 bg-red-600 px-1.5 py-0 text-[9px] text-white">
          <CocaColaIcon className="h-2.5 w-2.5" />
          Coca-Cola
        </Badge>
      )}
      {isExtra && extraTier && (
        <Badge
          className={cn(
            'absolute left-1 top-1 px-1.5 py-0 text-[9px]',
            extraTier === 'gold' && 'bg-yellow-400 text-amber-900',
            extraTier === 'silver' && 'bg-slate-200 text-slate-900',
            extraTier === 'bronze' && 'bg-amber-700 text-amber-50',
            extraTier === 'regular' && 'bg-violet-600 text-violet-50'
          )}
        >
          {EXTRA_TIER_LABEL[extraTier]}
        </Badge>
      )}
      {isDup && (
        <Badge variant="gold" className="absolute right-1 top-1 px-1.5 py-0 text-[10px]">
          x{quantity}
        </Badge>
      )}

      {has && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDecrement();
          }}
          className="absolute bottom-1 left-1 grid h-7 w-7 place-items-center rounded-full bg-card/80 text-muted-foreground hover:text-destructive"
          aria-label={`Diminuir ${sticker.code}`}
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
      )}

      {has && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onIncrement();
          }}
          className="absolute bottom-1 right-1 grid h-7 w-7 place-items-center rounded-full bg-fifa-gold text-fifa-green"
          aria-label={`Aumentar ${sticker.code}`}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      )}
    </motion.div>
  );
}
