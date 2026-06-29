import { useMemo, useState } from 'react';
import { Loader2, CalendarDays, BarChart3, Trophy, ListOrdered } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useGroups } from '@/hooks/useGroups';
import { useGroupMatches } from '@/hooks/useGroupMatches';
import { useUIStore } from '@/stores/ui';
import {
  MATCHES_2026,
  STAGE_LABEL,
  matchTimestamp,
  sideLabel,
  type Match2026,
  type Stage,
} from '@/lib/data/matches';
import { TEAMS_SEED } from '@/lib/data/teams';
import {
  allGroupsComplete,
  computeOverallStandings,
  computeStandings,
  resolveSides,
  type OverallStanding,
  type Scores,
} from '@/lib/standings';
import { cn } from '@/lib/utils';
import type { Team } from '@/types';

const STAGE_FILTERS: Array<{ key: 'all' | Stage; label: string }> = [
  { key: 'all', label: 'Tudo' },
  { key: 'group', label: 'Grupos' },
  { key: 'r32', label: '32-avos' },
  { key: 'r16', label: 'Oitavas' },
  { key: 'qf', label: 'Quartas' },
  { key: 'sf', label: 'Semi' },
  { key: 'tp', label: '3º lugar' },
  { key: 'final', label: 'Final' },
];

export default function Matches() {
  const { groups, loading: groupsLoading } = useGroups();
  const activeGroupId = useUIStore((s) => s.activeGroupId);
  const setActiveGroup = useUIStore((s) => s.setActiveGroup);
  const groupId = activeGroupId ?? groups[0]?.id ?? null;
  const group = groups.find((g) => g.id === groupId) ?? null;

  const { scores, loading: scoresLoading, setScore, clearScore } = useGroupMatches(groupId);

  const teamById = useMemo(() => {
    const map: Record<string, Team> = {};
    for (const team of TEAMS_SEED) map[team.id] = team;
    return map;
  }, []);

  const resolved = useMemo(() => resolveSides(scores), [scores]);
  const standings = useMemo(() => computeStandings(scores), [scores]);
  const overall = useMemo(() => computeOverallStandings(scores), [scores]);

  const matchesSorted = useMemo(
    () => [...MATCHES_2026].sort((a, b) => matchTimestamp(a) - matchTimestamp(b) || a.num - b.num),
    []
  );

  if (groupsLoading) {
    return (
      <div className="grid h-[60vh] place-items-center text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!group) {
    return (
      <>
        <PageHeader title="Jogos" subtitle="Calendário e bolão da Copa 2026" />
        <Card>
          <CardContent className="space-y-2 pt-4 text-sm text-muted-foreground">
            <p>Você ainda não está em nenhum grupo.</p>
            <p>
              Crie ou entre em um grupo na aba <strong>Grupos</strong> para registrar os placares
              da Copa com seus amigos.
            </p>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Jogos"
        subtitle={`${group.name} · ${Object.keys(scores).length} / ${MATCHES_2026.length} placares`}
      />

      {groups.length > 1 && (
        <select
          className="mb-3 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          value={groupId ?? ''}
          onChange={(e) => setActiveGroup(e.target.value || null)}
        >
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      )}

      <Tabs defaultValue="calendar">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calendar" className="gap-1">
            <CalendarDays className="h-4 w-4" /> Calendário
          </TabsTrigger>
          <TabsTrigger value="standings" className="gap-1">
            <BarChart3 className="h-4 w-4" /> Grupos
          </TabsTrigger>
          <TabsTrigger value="overall" className="gap-1">
            <ListOrdered className="h-4 w-4" /> Geral
          </TabsTrigger>
          <TabsTrigger value="bracket" className="gap-1">
            <Trophy className="h-4 w-4" /> Mata-mata
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <CalendarView
            matches={matchesSorted}
            scores={scores}
            resolved={resolved}
            teamById={teamById}
            loading={scoresLoading}
            onSetScore={setScore}
            onClear={clearScore}
          />
        </TabsContent>

        <TabsContent value="standings">
          <StandingsView standings={standings} teamById={teamById} />
        </TabsContent>

        <TabsContent value="overall">
          <OverallStandingsView overall={overall} teamById={teamById} />
        </TabsContent>

        <TabsContent value="bracket">
          <BracketView
            matches={matchesSorted}
            scores={scores}
            resolved={resolved}
            teamById={teamById}
            onSetScore={setScore}
            onClear={clearScore}
            groupsDone={allGroupsComplete(scores)}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}

// ============================================================
// Calendário
// ============================================================

function CalendarView({
  matches,
  scores,
  resolved,
  teamById,
  loading,
  onSetScore,
  onClear,
}: {
  matches: Match2026[];
  scores: Scores;
  resolved: Record<number, { home: string | null; away: string | null }>;
  teamById: Record<string, Team>;
  loading: boolean;
  onSetScore: (
    n: number,
    h: number,
    a: number,
    pens?: { homePens: number; awayPens: number } | null
  ) => Promise<void>;
  onClear: (n: number) => Promise<void>;
}) {
  const [filter, setFilter] = useState<'all' | Stage>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return matches;
    return matches.filter((m) => m.stage === filter);
  }, [matches, filter]);

  const byDate = useMemo(() => {
    const map: Record<string, Match2026[]> = {};
    for (const m of filtered) (map[m.date] ??= []).push(m);
    return map;
  }, [filtered]);

  if (loading) {
    return (
      <div className="grid h-40 place-items-center text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="-mx-1 mt-3 flex flex-wrap gap-1.5">
        {STAGE_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs transition',
              filter === f.key
                ? 'border-fifa-gold bg-fifa-gold/10 text-fifa-gold'
                : 'border-border text-muted-foreground hover:text-foreground'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {Object.entries(byDate).map(([date, list]) => (
        <div key={date} className="space-y-2">
          <h3 className="sticky top-[60px] z-10 -mx-4 bg-background/90 px-4 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground backdrop-blur">
            {formatDate(date)}
          </h3>
          {list.map((m) => (
            <MatchCard
              key={m.num}
              match={m}
              score={scores[m.num]}
              resolved={resolved[m.num]}
              teamById={teamById}
              onSetScore={onSetScore}
              onClear={onClear}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ============================================================
// MatchCard — card editável
// ============================================================

function MatchCard({
  match,
  score,
  resolved,
  teamById,
  onSetScore,
  onClear,
}: {
  match: Match2026;
  score: { homeScore: number; awayScore: number; homePens?: number; awayPens?: number } | undefined;
  resolved: { home: string | null; away: string | null } | undefined;
  teamById: Record<string, Team>;
  onSetScore: (
    n: number,
    h: number,
    a: number,
    pens?: { homePens: number; awayPens: number } | null
  ) => Promise<void>;
  onClear: (n: number) => Promise<void>;
}) {
  const isKnockout = match.stage !== 'group';
  const [editing, setEditing] = useState(false);
  const [h, setH] = useState<string>(score?.homeScore != null ? String(score.homeScore) : '');
  const [a, setA] = useState<string>(score?.awayScore != null ? String(score.awayScore) : '');
  const [ph, setPh] = useState<string>(score?.homePens != null ? String(score.homePens) : '');
  const [pa, setPa] = useState<string>(score?.awayPens != null ? String(score.awayPens) : '');
  const [busy, setBusy] = useState(false);

  const homeTeamId = resolved?.home ?? (match.home.kind === 'team' ? match.home.teamId : null);
  const awayTeamId = resolved?.away ?? (match.away.kind === 'team' ? match.away.teamId : null);
  const homeTeam = homeTeamId ? teamById[homeTeamId] : null;
  const awayTeam = awayTeamId ? teamById[awayTeamId] : null;

  const canEdit = !!homeTeamId && !!awayTeamId;

  // num mata-mata, empate no tempo normal exige pênaltis para definir quem avança
  const needsPens = isKnockout && h !== '' && a !== '' && Number(h) === Number(a);

  async function save() {
    if (!canEdit) return;
    const hi = Number(h);
    const ai = Number(a);
    if (!Number.isFinite(hi) || hi < 0 || !Number.isFinite(ai) || ai < 0) return;

    let pens: { homePens: number; awayPens: number } | null = null;
    if (isKnockout && hi === ai) {
      const phi = Number(ph);
      const pai = Number(pa);
      if (!Number.isFinite(phi) || phi < 0 || !Number.isFinite(pai) || pai < 0) return;
      if (phi === pai) return; // pênaltis não podem empatar — precisa de um vencedor
      pens = { homePens: phi, awayPens: pai };
    }

    setBusy(true);
    try {
      await onSetScore(match.num, hi, ai, pens);
      setEditing(false);
    } finally {
      setBusy(false);
    }
  }

  async function clear() {
    setBusy(true);
    try {
      await onClear(match.num);
      setH('');
      setA('');
      setPh('');
      setPa('');
      setEditing(false);
    } finally {
      setBusy(false);
    }
  }

  const isDrawWithPens =
    score != null && score.homeScore === score.awayScore && score.homePens != null && score.awayPens != null;

  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="mb-2 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>
          {match.time !== 'a definir' ? `${match.time}` : 'horário a definir'} ·{' '}
          {match.group ? `Grupo ${match.group}` : STAGE_LABEL[match.stage]}
        </span>
        <span className="font-mono">#{match.num}</span>
      </div>

      <div className="flex items-center gap-2">
        <Side label={homeTeam ? homeTeam.namePt : sideLabel(match.home, teamById)} team={homeTeam} align="end" />

        <div className="min-w-[80px]">
          {editing ? (
            <div className="flex items-center gap-1">
              <Input
                type="number"
                inputMode="numeric"
                min={0}
                value={h}
                onChange={(e) => setH(e.target.value)}
                className="h-9 w-10 px-1 text-center"
              />
              <span className="text-muted-foreground">×</span>
              <Input
                type="number"
                inputMode="numeric"
                min={0}
                value={a}
                onChange={(e) => setA(e.target.value)}
                className="h-9 w-10 px-1 text-center"
              />
            </div>
          ) : score ? (
            <button
              type="button"
              disabled={!canEdit}
              onClick={() => setEditing(true)}
              className="w-full rounded-lg bg-fifa-green/10 px-2 py-1 text-center font-mono text-lg font-bold tabular-nums text-fifa-gold"
            >
              {score.homeScore} <span className="text-muted-foreground">×</span> {score.awayScore}
              {isDrawWithPens && (
                <span className="block text-[10px] font-normal text-muted-foreground">
                  pên. {score.homePens}–{score.awayPens}
                </span>
              )}
            </button>
          ) : (
            <button
              type="button"
              disabled={!canEdit}
              onClick={() => setEditing(true)}
              className={cn(
                'w-full rounded-lg border border-dashed border-border px-2 py-1 text-center text-xs',
                canEdit ? 'text-muted-foreground hover:border-fifa-gold' : 'opacity-50'
              )}
            >
              {canEdit ? 'placar' : '—'}
            </button>
          )}
        </div>

        <Side label={awayTeam ? awayTeam.namePt : sideLabel(match.away, teamById)} team={awayTeam} align="start" />
      </div>

      {editing && needsPens && (
        <div className="mt-2 flex items-center justify-center gap-1 text-xs">
          <span className="mr-1 text-muted-foreground">Pênaltis</span>
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            value={ph}
            onChange={(e) => setPh(e.target.value)}
            className="h-8 w-10 px-1 text-center"
          />
          <span className="text-muted-foreground">×</span>
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            value={pa}
            onChange={(e) => setPa(e.target.value)}
            className="h-8 w-10 px-1 text-center"
          />
        </div>
      )}

      {editing && (
        <div className="mt-2 flex gap-2">
          <Button size="sm" disabled={busy} onClick={save} className="flex-1">
            Salvar
          </Button>
          <Button size="sm" variant="outline" disabled={busy} onClick={() => setEditing(false)}>
            Cancelar
          </Button>
          {score && (
            <Button size="sm" variant="outline" disabled={busy} onClick={clear} className="text-destructive">
              Limpar
            </Button>
          )}
        </div>
      )}

      <p className="mt-2 truncate text-[11px] text-muted-foreground">{match.location}</p>
    </div>
  );
}

function Side({
  label,
  team,
  align,
}: {
  label: string;
  team: Team | null;
  align: 'start' | 'end';
}) {
  return (
    <div
      className={cn(
        'flex flex-1 items-center gap-2 min-w-0',
        align === 'end' ? 'justify-end text-right' : 'justify-start text-left'
      )}
    >
      {align === 'start' && team && (
        <img src={team.flagUrl} alt="" className="h-5 w-7 rounded-sm object-cover ring-1 ring-border" loading="lazy" />
      )}
      <span className={cn('truncate text-sm font-semibold', !team && 'italic text-muted-foreground')}>
        {label}
      </span>
      {align === 'end' && team && (
        <img src={team.flagUrl} alt="" className="h-5 w-7 rounded-sm object-cover ring-1 ring-border" loading="lazy" />
      )}
    </div>
  );
}

// ============================================================
// Tabela dos grupos
// ============================================================

function StandingsView({
  standings,
  teamById,
}: {
  standings: ReturnType<typeof computeStandings>;
  teamById: Record<string, Team>;
}) {
  const groups = Object.values(standings).sort((a, b) => a.group.localeCompare(b.group));
  return (
    <div className="mt-3 space-y-4">
      {groups.map((gs) => (
        <Card key={gs.group}>
          <CardContent className="pt-3">
            <h3 className="mb-2 text-sm font-bold">Grupo {gs.group}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="text-muted-foreground">
                  <tr>
                    <th className="pb-1 text-left font-medium">#</th>
                    <th className="pb-1 text-left font-medium">Time</th>
                    <th className="pb-1 text-right font-medium">J</th>
                    <th className="pb-1 text-right font-medium">V</th>
                    <th className="pb-1 text-right font-medium">E</th>
                    <th className="pb-1 text-right font-medium">D</th>
                    <th className="pb-1 text-right font-medium">SG</th>
                    <th className="pb-1 text-right font-bold">P</th>
                  </tr>
                </thead>
                <tbody>
                  {gs.rows.map((r, i) => {
                    const team = teamById[r.teamId];
                    return (
                      <tr
                        key={r.teamId}
                        className={cn(
                          'border-t border-border/60',
                          i < 2 && 'font-medium text-fifa-gold',
                          i === 2 && 'font-medium text-foreground'
                        )}
                      >
                        <td className="py-1 text-left tabular-nums">{i + 1}</td>
                        <td className="py-1 text-left">
                          <div className="flex items-center gap-2">
                            {team && (
                              <img
                                src={team.flagUrl}
                                alt=""
                                className="h-3.5 w-5 rounded-sm object-cover ring-1 ring-border"
                                loading="lazy"
                              />
                            )}
                            <span className="truncate">{team?.namePt ?? r.teamId}</span>
                          </div>
                        </td>
                        <td className="py-1 text-right tabular-nums">{r.played}</td>
                        <td className="py-1 text-right tabular-nums">{r.won}</td>
                        <td className="py-1 text-right tabular-nums">{r.drawn}</td>
                        <td className="py-1 text-right tabular-nums">{r.lost}</td>
                        <td className={cn('py-1 text-right tabular-nums', r.goalDiff > 0 && 'text-fifa-green', r.goalDiff < 0 && 'text-destructive')}>
                          {r.goalDiff > 0 ? `+${r.goalDiff}` : r.goalDiff}
                        </td>
                        <td className="py-1 text-right font-bold tabular-nums">{r.points}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-[10px] text-muted-foreground">
              1º e 2º avançam direto · 3º entra na disputa dos 8 melhores
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ============================================================
// Classificação geral (todos os times juntos)
// ============================================================

function OverallStandingsView({
  overall,
  teamById,
}: {
  overall: OverallStanding[];
  teamById: Record<string, Team>;
}) {
  const anyPlayed = overall.some((r) => r.played > 0);

  if (!anyPlayed) {
    return (
      <p className="mt-6 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        Nenhum placar registrado ainda. Preencha os jogos da fase de grupos na aba{' '}
        <strong>Calendário</strong> para ver a classificação geral.
      </p>
    );
  }

  return (
    <div className="mt-3">
      <Card>
        <CardContent className="pt-3">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="pb-1 text-left font-medium">#</th>
                  <th className="pb-1 text-left font-medium">Time</th>
                  <th className="pb-1 text-center font-medium">Gr</th>
                  <th className="pb-1 text-right font-medium">J</th>
                  <th className="pb-1 text-right font-medium">V</th>
                  <th className="pb-1 text-right font-medium">E</th>
                  <th className="pb-1 text-right font-medium">D</th>
                  <th className="pb-1 text-right font-medium">SG</th>
                  <th className="pb-1 text-right font-bold">P</th>
                </tr>
              </thead>
              <tbody>
                {overall.map((r, i) => {
                  const team = teamById[r.teamId];
                  return (
                    <tr key={r.teamId} className="border-t border-border/60">
                      <td className="py-1 text-left tabular-nums">{i + 1}</td>
                      <td className="py-1 text-left">
                        <div className="flex items-center gap-2">
                          {team && (
                            <img
                              src={team.flagUrl}
                              alt=""
                              className="h-3.5 w-5 rounded-sm object-cover ring-1 ring-border"
                              loading="lazy"
                            />
                          )}
                          <span className="truncate">{team?.namePt ?? r.teamId}</span>
                        </div>
                      </td>
                      <td className="py-1 text-center tabular-nums text-muted-foreground">
                        {r.group}
                        {r.groupPosition}
                      </td>
                      <td className="py-1 text-right tabular-nums">{r.played}</td>
                      <td className="py-1 text-right tabular-nums">{r.won}</td>
                      <td className="py-1 text-right tabular-nums">{r.drawn}</td>
                      <td className="py-1 text-right tabular-nums">{r.lost}</td>
                      <td className={cn('py-1 text-right tabular-nums', r.goalDiff > 0 && 'text-fifa-green', r.goalDiff < 0 && 'text-destructive')}>
                        {r.goalDiff > 0 ? `+${r.goalDiff}` : r.goalDiff}
                      </td>
                      <td className="py-1 text-right font-bold tabular-nums">{r.points}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground">
            Todos os times ranqueados por pontos · saldo de gols · gols pró. A coluna{' '}
            <strong>Gr</strong> mostra o grupo e a posição dentro dele.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================
// Bracket (mata-mata)
// ============================================================

function BracketView({
  matches,
  scores,
  resolved,
  teamById,
  onSetScore,
  onClear,
  groupsDone,
}: {
  matches: Match2026[];
  scores: Scores;
  resolved: Record<number, { home: string | null; away: string | null }>;
  teamById: Record<string, Team>;
  onSetScore: (
    n: number,
    h: number,
    a: number,
    pens?: { homePens: number; awayPens: number } | null
  ) => Promise<void>;
  onClear: (n: number) => Promise<void>;
  groupsDone: boolean;
}) {
  const groupedByStage: Record<Stage, Match2026[]> = {
    group: [],
    r32: [],
    r16: [],
    qf: [],
    sf: [],
    tp: [],
    final: [],
  };
  for (const m of matches) groupedByStage[m.stage].push(m);

  const stages: Stage[] = ['r32', 'r16', 'qf', 'sf', 'tp', 'final'];

  return (
    <div className="mt-3 space-y-4">
      {!groupsDone && (
        <div className="rounded-xl border border-dashed border-border bg-card p-3 text-xs text-muted-foreground">
          Preencha todos os jogos da fase de grupos para o app distribuir automaticamente os
          classificados nas eliminatórias.
        </div>
      )}
      <div className="rounded-xl border border-border bg-card p-3 text-[11px] leading-relaxed text-muted-foreground">
        <strong className="text-foreground">Regras do mata-mata:</strong> avançam os 1º e 2º de
        cada grupo mais os 8 melhores 3º colocados. Jogo eliminatório que terminar empatado abre o
        campo de <strong>pênaltis</strong> — informe o placar da disputa para definir quem avança.
      </div>
      {stages.map((s) => (
        <div key={s}>
          <h3 className="mb-2 text-sm font-bold">{STAGE_LABEL[s]}</h3>
          <div className="space-y-2">
            {groupedByStage[s].map((m) => (
              <MatchCard
                key={m.num}
                match={m}
                score={scores[m.num]}
                resolved={resolved[m.num]}
                teamById={teamById}
                onSetScore={onSetScore}
                onClear={onClear}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// Helpers
// ============================================================

const WEEKDAY = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTH = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map((p) => Number(p));
  const dt = new Date(Date.UTC(y, m - 1, d, 15, 0, 0));
  return `${WEEKDAY[dt.getUTCDay()]} · ${dt.getUTCDate()} ${MONTH[dt.getUTCMonth()]} ${dt.getUTCFullYear()}`;
}
