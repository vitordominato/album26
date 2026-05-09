import { Crown } from 'lucide-react';
import type { Team } from '@/types';

export function TeamCover({ team }: { team: Team }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-card p-3 shadow-sm">
      <img
        src={team.flagUrl}
        alt={team.namePt}
        loading="lazy"
        className="h-10 w-14 rounded object-cover ring-1 ring-border"
      />
      <div className="flex-1 min-w-0">
        <p className="flex items-center gap-1 truncate text-sm font-semibold leading-tight">
          {team.namePt}
          {team.isHost && <Crown className="h-3 w-3 shrink-0 text-fifa-gold" />}
        </p>
        <p className="text-xs text-muted-foreground">
          {team.code} · Grupo {team.groupStage}
        </p>
      </div>
    </div>
  );
}
