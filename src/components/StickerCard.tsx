import { motion } from 'framer-motion';
import { Plus, Minus, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { Sticker } from '@/types';

interface Props {
  sticker: Sticker;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  compact?: boolean;
}

export function StickerCard({ sticker, quantity, onIncrement, onDecrement, compact }: Props) {
  const has = quantity > 0;
  const isDup = quantity > 1;

  return (
    <motion.div
      layout
      whileTap={{ scale: 0.97 }}
      className={cn(
        'relative flex flex-col overflow-hidden rounded-lg border-2 transition-all',
        has ? 'border-fifa-gold bg-card' : 'border-dashed border-muted bg-muted/30',
        compact ? 'aspect-[3/4]' : 'aspect-[3/4.4]'
      )}
    >
      <button
        type="button"
        onClick={has ? onIncrement : onIncrement}
        className="relative flex flex-1 items-center justify-center"
        aria-label={has ? `Adicionar mais ${sticker.code}` : `Coletei ${sticker.code}`}
      >
        {has ? (
          <motion.div
            initial={{ scale: 0.6, rotate: -8, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-fifa-green/40 to-fifa-green/10 p-2 text-center"
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
          <span className="text-xs font-bold text-muted-foreground/70">{sticker.code}</span>
        )}
      </button>

      {isDup && (
        <Badge
          variant="gold"
          className="absolute right-1 top-1 px-1.5 py-0 text-[10px]"
        >
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
          className="absolute left-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-card/80 text-muted-foreground hover:text-destructive"
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
