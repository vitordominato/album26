import { useMemo, useState } from 'react';
import { Loader2, ChevronRight, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { TeamCover } from '@/components/TeamCover';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { StickerCard } from '@/components/StickerCard';
import { useTeams, useStickers } from '@/hooks/useTeams';
import { useCollection } from '@/hooks/useCollection';
import { useUIStore } from '@/stores/ui';
import { dictionary } from '@/lib/i18n';
import type { Sticker, Team } from '@/types';

export default function Album() {
  const { data: teams, isLoading: teamsLoading } = useTeams();
  const { data: stickers, isLoading: stickersLoading } = useStickers();
  const { entries, loading: collLoading } = useCollection();
  const locale = useUIStore((s) => s.locale);
  const t = dictionary[locale];
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const stickersByTeam = useMemo(() => {
    const map: Record<string, Sticker[]> = {};
    if (!stickers) return map;
    for (const s of stickers) {
      if (s.teamId) {
        (map[s.teamId] ??= []).push(s);
      }
    }
    return map;
  }, [stickers]);

  const totalHave = Object.values(entries).reduce((acc, e) => acc + (e.quantity > 0 ? 1 : 0), 0);
  const totalCount = stickers?.length ?? 0;
  const pct = totalCount > 0 ? Math.round((totalHave / totalCount) * 100) : 0;

  if (teamsLoading || stickersLoading || collLoading) {
    return (
      <div className="grid h-[60vh] place-items-center text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (selectedTeam && stickers) {
    return (
      <TeamPage
        team={selectedTeam}
        stickers={stickersByTeam[selectedTeam.id] ?? []}
        onBack={() => setSelectedTeam(null)}
      />
    );
  }

  return (
    <>
      <PageHeader
        title={t.appName}
        subtitle={`${totalHave} / ${totalCount} · ${pct}%`}
        right={
          <Button asChild size="sm" variant="ghost">
            <Link to="/dashboard"><BarChart3 className="h-4 w-4" /></Link>
          </Button>
        }
      />

      <div className="mb-4 rounded-xl border border-border bg-card p-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">Progresso geral</p>
        <Progress value={pct} />
        <p className="mt-2 text-2xl font-black text-fifa-gold">{pct}%</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {teams?.map((team) => {
          const teamStickers = stickersByTeam[team.id] ?? [];
          const have = teamStickers.filter((s) => (entries[s.id]?.quantity ?? 0) > 0).length;
          const total = teamStickers.length;
          const teamPct = total > 0 ? Math.round((have / total) * 100) : 0;
          return (
            <button
              key={team.id}
              onClick={() => setSelectedTeam(team)}
              className="group relative flex flex-col gap-2 rounded-xl border border-border bg-card p-3 text-left transition hover:border-fifa-gold"
            >
              <TeamCover team={team} />
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {have}/{total}
                </span>
                <span className="font-semibold text-fifa-gold">{teamPct}%</span>
              </div>
              <Progress value={teamPct} className="h-1.5" />
              <ChevronRight className="absolute right-2 top-3 h-4 w-4 text-muted-foreground transition group-hover:text-foreground" />
            </button>
          );
        })}
      </div>
    </>
  );
}

function TeamPage({
  team,
  stickers,
  onBack,
}: {
  team: Team;
  stickers: Sticker[];
  onBack: () => void;
}) {
  const { entries, incrementQty } = useCollection();
  const have = stickers.filter((s) => (entries[s.id]?.quantity ?? 0) > 0).length;

  return (
    <>
      <PageHeader
        title={team.namePt}
        subtitle={`${have}/${stickers.length} · ${team.confederation}`}
        right={
          <Button onClick={onBack} variant="ghost" size="sm">
            Voltar
          </Button>
        }
      />
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {stickers.map((s) => (
          <StickerCard
            key={s.id}
            sticker={s}
            quantity={entries[s.id]?.quantity ?? 0}
            onIncrement={() => incrementQty(s.id, +1)}
            onDecrement={() => incrementQty(s.id, -1)}
            compact
          />
        ))}
      </div>
    </>
  );
}
