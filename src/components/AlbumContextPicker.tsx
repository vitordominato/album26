import { Users, User } from 'lucide-react';
import { useGroups } from '@/hooks/useGroups';
import { useUIStore } from '@/stores/ui';
import { cn } from '@/lib/utils';

export function AlbumContextPicker() {
  const { groups } = useGroups();
  const activeAlbum = useUIStore((s) => s.activeAlbumId);
  const setActiveAlbum = useUIStore((s) => s.setActiveAlbum);

  if (groups.length === 0) return null;

  return (
    <div className="mb-3 rounded-xl border border-border bg-card p-2">
      <p className="mb-2 px-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        Editando
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveAlbum('personal')}
          className={cn(
            'flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition',
            activeAlbum === 'personal'
              ? 'border-fifa-gold bg-fifa-gold/15 text-fifa-gold'
              : 'border-border bg-background text-muted-foreground hover:text-foreground'
          )}
        >
          <User className="h-3.5 w-3.5" />
          Meu álbum
        </button>
        {groups.map((g) => {
          const id = `group:${g.id}` as const;
          const active = activeAlbum === id;
          return (
            <button
              key={g.id}
              onClick={() => setActiveAlbum(id)}
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition',
                active
                  ? 'border-fifa-gold bg-fifa-gold/15 text-fifa-gold'
                  : 'border-border bg-background text-muted-foreground hover:text-foreground'
              )}
            >
              <Users className="h-3.5 w-3.5" />
              {g.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
