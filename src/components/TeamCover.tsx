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
      <div className="flex-1">
        <p className="text-sm font-semibold leading-tight">{team.namePt}</p>
        <p className="text-xs text-muted-foreground">{team.code} · {team.confederation}</p>
      </div>
    </div>
  );
}
