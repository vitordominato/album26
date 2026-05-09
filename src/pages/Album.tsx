import { useMemo, useState } from 'react';
import { Loader2, ChevronRight, BarChart3, Sparkles, Star } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import type { Sticker, StickerSection, Team } from '@/types';

type View =
  | { kind: 'home' }
  | { kind: 'team'; team: Team }
  | { kind: 'section'; section: StickerSection };

export default function Album() {
  const { data: teams, isLoading: teamsLoading } = useTeams();
  const { data: stickers, isLoading: stickersLoading } = useStickers();
  const { entries, loading: collLoading } = useCollection();
  const locale = useUIStore((s) => s.locale);
  const t = dictionary[locale];
  const [view, setView] = useState<View>({ kind: 'home' });

  const stickersByTeam = useMemo(() => {
    const map: Record<string, Sticker[]> = {};
    stickers?.forEach((s) => {
      if (s.teamId) (map[s.teamId] ??= []).push(s);
    });
    Object.values(map).forEach((arr) => arr.sort((a, b) => (a.teamSlot ?? 0) - (b.teamSlot ?? 0)));
    return map;
  }, [stickers]);

  const stickersBySection = useMemo(() => {
    const map: Record<string, Sticker[]> = { fwc: [], team: [], extras: [] };
    stickers?.forEach((s) => (map[s.section] ??= []).push(s));
    return map;
  }, [stickers]);

  const teamsByGroup = useMemo(() => {
    const map: Record<string, Team[]> = {};
    teams?.forEach((tm) => (map[tm.groupStage] ??= []).push(tm));
    Object.values(map).forEach((arr) => arr.sort((a, b) => a.order - b.order));
    return map;
  }, [teams]);

  const totalHave = stickers?.filter((s) => (entries[s.id]?.quantity ?? 0) > 0).length ?? 0;
  const totalCount = stickers?.length ?? 0;
  const pct = totalCount > 0 ? Math.round((totalHave / totalCount) * 100) : 0;

  if (teamsLoading || stickersLoading || collLoading) {
    return (
      <div className="grid h-[60vh] place-items-center text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (view.kind === 'team') {
    return (
      <SectionGrid
        title={`${view.team.namePt}`}
        subtitle={`Grupo ${view.team.groupStage} · ${view.team.confederation}`}
        stickers={stickersByTeam[view.team.id] ?? []}
        onBack={() => setView({ kind: 'home' })}
      />
    );
  }
  if (view.kind === 'section') {
    return (
      <SectionGrid
        title={t.sections[view.section as 'fwc' | 'team' | 'extras' | 'mcdonalds']}
        stickers={stickersBySection[view.section] ?? []}
        onBack={() => setView({ kind: 'home' })}
      />
    );
  }

  const fwcCount = stickersBySection.fwc.length;
  const fwcHave = stickersBySection.fwc.filter((s) => (entries[s.id]?.quantity ?? 0) > 0).length;
  const exCount = stickersBySection.extras.length;
  const exHave = stickersBySection.extras.filter((s) => (entries[s.id]?.quantity ?? 0) > 0).length;

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

      {/* Seções especiais (FWC / Extras) */}
      <div className="mb-4 grid grid-cols-2 gap-2">
        <SectionTile
          icon={<Sparkles className="h-4 w-4" />}
          title={t.sections.fwc}
          have={fwcHave}
          total={fwcCount}
          onClick={() => setView({ kind: 'section', section: 'fwc' })}
          accent="bg-gradient-to-br from-fifa-gold/30 to-fifa-green/30"
        />
        <SectionTile
          icon={<Star className="h-4 w-4" />}
          title={t.sections.extras}
          have={exHave}
          total={exCount}
          onClick={() => setView({ kind: 'section', section: 'extras' })}
          accent="bg-gradient-to-br from-violet-700/30 to-yellow-400/30"
        />
      </div>

      {/* 12 grupos */}
      <h2 className="mb-2 text-sm font-semibold text-muted-foreground">Grupos</h2>
      <div className="space-y-4">
        {Object.entries(teamsByGroup)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([group, teamsInGroup]) => {
            const list = teamsInGroup.flatMap((tm) => stickersByTeam[tm.id] ?? []);
            const have = list.filter((s) => (entries[s.id]?.quantity ?? 0) > 0).length;
            const total = list.length;
            const groupPct = total > 0 ? Math.round((have / total) * 100) : 0;
            return (
              <div key={group}>
                <div className="mb-2 flex items-baseline justify-between">
                  <h3 className="text-sm font-bold">
                    Grupo {group}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {have}/{total} · {groupPct}%
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {teamsInGroup.map((team) => {
                    const ts = stickersByTeam[team.id] ?? [];
                    const teamHave = ts.filter((s) => (entries[s.id]?.quantity ?? 0) > 0).length;
                    const teamPct = ts.length > 0 ? Math.round((teamHave / ts.length) * 100) : 0;
                    return (
                      <button
                        key={team.id}
                        onClick={() => setView({ kind: 'team', team })}
                        className={cn(
                          'group relative flex flex-col gap-2 rounded-xl border border-border bg-card p-3 text-left transition hover:border-fifa-gold',
                          team.isHost && 'border-fifa-gold/60'
                        )}
                      >
                        <TeamCover team={team} />
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            {teamHave}/{ts.length}
                          </span>
                          <span className="font-semibold text-fifa-gold">{teamPct}%</span>
                        </div>
                        <Progress value={teamPct} className="h-1.5" />
                        <ChevronRight className="absolute right-2 top-3 h-4 w-4 text-muted-foreground transition group-hover:text-foreground" />
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}

function SectionTile({
  icon,
  title,
  have,
  total,
  onClick,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  have: number;
  total: number;
  onClick: () => void;
  accent: string;
}) {
  const pct = total > 0 ? Math.round((have / total) * 100) : 0;
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col gap-2 rounded-xl border border-border p-3 text-left transition hover:border-fifa-gold',
        accent
      )}
    >
      <div className="flex items-center gap-2 text-sm font-semibold">
        {icon}
        {title}
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{have}/{total}</span>
        <span className="font-semibold text-fifa-gold">{pct}%</span>
      </div>
      <Progress value={pct} className="h-1.5" />
    </button>
  );
}

function SectionGrid({
  title,
  subtitle,
  stickers,
  onBack,
}: {
  title: string;
  subtitle?: string;
  stickers: Sticker[];
  onBack: () => void;
}) {
  const { entries, incrementQty } = useCollection();
  const have = stickers.filter((s) => (entries[s.id]?.quantity ?? 0) > 0).length;

  return (
    <>
      <PageHeader
        title={title}
        subtitle={`${have}/${stickers.length}${subtitle ? ` · ${subtitle}` : ''}`}
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
