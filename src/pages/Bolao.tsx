import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Trophy, Lock, Target } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useGroups, useGroupMembers } from '@/hooks/useGroups';
import { useGroupMatches } from '@/hooks/useGroupMatches';
import { useGroupBets } from '@/hooks/useGroupBets';
import { useAuthStore } from '@/stores/auth';
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
import { resolveSides } from '@/lib/standings';
import {
  buildLeaderboard,
  isLocked,
  minutesUntilLock,
  pickPoints,
  POINTS,
} from '@/lib/picks';
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

export default function Bolao() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { groups, loading: groupsLoading } = useGroups();
  const activeGroupId = useUIStore((s) => s.activeGroupId);
  const setActiveGroup = useUIStore((s) => s.setActiveGroup);
  const groupId = activeGroupId ?? groups[0]?.id ?? null;
  const group = groups.find((g) => g.id === groupId) ?? null;
  const members = useGroupMembers(groupId);

  const { scores, loading: scoresLoading } = useGroupMatches(groupId);
  const { picksByUser, myPicks, loading: betsLoading, setPick, clearPick } = useGroupBets(groupId);

  const teamById = useMemo(() => {
    const map: Record<string, Team> = {};
    for (const team of TEAMS_SEED) map[team.id] = team;
    return map;
  }, []);

  const resolved = useMemo(() => resolveSides(scores), [scores]);

  const matchesSorted = useMemo(
    () => [...MATCHES_2026].sort((a, b) => matchTimestamp(a) - matchTimestamp(b) || a.num - b.num),
    []
  );

  // tick a cada minuto para atualizar locks/contadores
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);

  const myPoints = useMemo(() => {
    let total = 0;
    for (const [numStr, p] of Object.entries(myPicks)) {
      total += pickPoints(p, scores[Number(numStr)]);
    }
    return total;
  }, [myPicks, scores]);

  if (groupsLoading) {
    return (
      <div className="grid h-[60vh] place-items-center text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!group || !user) {
    return (
      <>
        <PageHeader
          title="Bolão"
          right={
            <Button size="sm" variant="ghost" onClick={() => navigate('/group')}>
              Voltar
            </Button>
          }
        />
        <Card>
          <CardContent className="pt-4 text-sm text-muted-foreground">
            Crie ou entre em um grupo na aba <strong>Grupos</strong> para começar a apostar.
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Bolão"
        subtitle={`${group.name} · ${myPoints} pts · ${Object.keys(myPicks).length}/${MATCHES_2026.length} palpites`}
        right={
          <Button size="sm" variant="ghost" onClick={() => navigate('/group')}>
            Voltar
          </Button>
        }
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

      <Tabs defaultValue="picks">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="picks" className="gap-1">
            <Target className="h-4 w-4" /> Meus palpites
          </TabsTrigger>
          <TabsTrigger value="ranking" className="gap-1">
            <Trophy className="h-4 w-4" /> Ranking
          </TabsTrigger>
          <TabsTrigger value="rules" className="gap-1">
            <Lock className="h-4 w-4" /> Regras
          </TabsTrigger>
        </TabsList>

        <TabsContent value="picks">
          <PicksView
            matches={matchesSorted}
            myPicks={myPicks}
            scores={scores}
            resolved={resolved}
            teamById={teamById}
            now={now}
            loading={scoresLoading || betsLoading}
            onSetPick={setPick}
            onClearPick={clearPick}
          />
        </TabsContent>

        <TabsContent value="ranking">
          <RankingView
            members={members}
            picksByUser={picksByUser}
            scores={scores}
            currentUid={user.uid}
          />
        </TabsContent>

        <TabsContent value="rules">
          <RulesView />
        </TabsContent>
      </Tabs>
    </>
  );
}

// ============================================================
// Meus palpites
// ============================================================

function PicksView({
  matches,
  myPicks,
  scores,
  resolved,
  teamById,
  now,
  loading,
  onSetPick,
  onClearPick,
}: {
  matches: Match2026[];
  myPicks: Record<number, { homeScore: number; awayScore: number }>;
  scores: Record<number, { homeScore: number; awayScore: number } | undefined>;
  resolved: Record<number, { home: string | null; away: string | null }>;
  teamById: Record<string, Team>;
  now: number;
  loading: boolean;
  onSetPick: (n: number, h: number, a: number) => Promise<void>;
  onClearPick: (n: number) => Promise<void>;
}) {
  const [filter, setFilter] = useState<'all' | Stage>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return matches;
    return matches.filter((m) => m.stage === filter);
  }, [matches, filter]);

  if (loading) {
    return (
      <div className="grid h-40 place-items-center text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-3">
      <div className="-mx-1 flex flex-wrap gap-1.5">
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

      {filtered.map((m) => (
        <PickCard
          key={m.num}
          match={m}
          pick={myPicks[m.num]}
          official={scores[m.num]}
          resolved={resolved[m.num]}
          teamById={teamById}
          now={now}
          onSetPick={onSetPick}
          onClearPick={onClearPick}
        />
      ))}
    </div>
  );
}

function PickCard({
  match,
  pick,
  official,
  resolved,
  teamById,
  now,
  onSetPick,
  onClearPick,
}: {
  match: Match2026;
  pick: { homeScore: number; awayScore: number } | undefined;
  official: { homeScore: number; awayScore: number } | undefined;
  resolved: { home: string | null; away: string | null } | undefined;
  teamById: Record<string, Team>;
  now: number;
  onSetPick: (n: number, h: number, a: number) => Promise<void>;
  onClearPick: (n: number) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [h, setH] = useState<string>(pick?.homeScore != null ? String(pick.homeScore) : '');
  const [a, setA] = useState<string>(pick?.awayScore != null ? String(pick.awayScore) : '');
  const [busy, setBusy] = useState(false);

  const locked = isLocked(match, now);
  const minsLeft = minutesUntilLock(match, now);

  const homeTeamId = resolved?.home ?? (match.home.kind === 'team' ? match.home.teamId : null);
  const awayTeamId = resolved?.away ?? (match.away.kind === 'team' ? match.away.teamId : null);
  const homeTeam = homeTeamId ? teamById[homeTeamId] : null;
  const awayTeam = awayTeamId ? teamById[awayTeamId] : null;

  const pts = pick ? pickPoints(pick, official) : null;

  async function save() {
    const hi = Number(h);
    const ai = Number(a);
    if (!Number.isFinite(hi) || hi < 0 || !Number.isFinite(ai) || ai < 0) return;
    setBusy(true);
    try {
      await onSetPick(match.num, hi, ai);
      setEditing(false);
    } finally {
      setBusy(false);
    }
  }

  async function clear() {
    setBusy(true);
    try {
      await onClearPick(match.num);
      setH('');
      setA('');
      setEditing(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="mb-2 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>
          {match.time !== 'a definir' ? match.time : 'horário a definir'} ·{' '}
          {match.group ? `Grupo ${match.group}` : STAGE_LABEL[match.stage]}
        </span>
        <div className="flex items-center gap-2">
          {locked && official && pts != null && (
            <Badge variant={pts > 0 ? 'gold' : 'outline'} className="gap-1">
              {pts} pts
            </Badge>
          )}
          {locked && !official && (
            <Badge variant="outline" className="gap-1">
              <Lock className="h-3 w-3" /> aguardando placar
            </Badge>
          )}
          {!locked && (
            <span className="text-[10px]">
              {minsLeft > 60
                ? `trava em ${Math.floor(minsLeft / 60)}h${minsLeft % 60 ? `${minsLeft % 60}m` : ''}`
                : `trava em ${Math.max(0, minsLeft)}m`}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <PickSide
          label={homeTeam ? homeTeam.namePt : sideLabel(match.home, teamById)}
          team={homeTeam}
          align="end"
        />

        <div className="min-w-[80px]">
          {editing && !locked ? (
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
          ) : pick ? (
            <button
              type="button"
              disabled={locked}
              onClick={() => setEditing(true)}
              className={cn(
                'w-full rounded-lg px-2 py-1 text-center font-mono text-lg font-bold tabular-nums',
                pts === POINTS.exact
                  ? 'bg-fifa-gold/20 text-fifa-gold'
                  : pts === POINTS.signedDiff
                  ? 'bg-fifa-green/20 text-fifa-green'
                  : pts === POINTS.resultOnly
                  ? 'bg-foreground/10 text-foreground'
                  : 'bg-fifa-green/10 text-fifa-gold'
              )}
            >
              {pick.homeScore} <span className="text-muted-foreground">×</span> {pick.awayScore}
            </button>
          ) : (
            <button
              type="button"
              disabled={locked}
              onClick={() => setEditing(true)}
              className={cn(
                'w-full rounded-lg border border-dashed border-border px-2 py-1 text-center text-xs',
                locked ? 'opacity-50' : 'text-muted-foreground hover:border-fifa-gold'
              )}
            >
              {locked ? '—' : 'palpite'}
            </button>
          )}
        </div>

        <PickSide
          label={awayTeam ? awayTeam.namePt : sideLabel(match.away, teamById)}
          team={awayTeam}
          align="start"
        />
      </div>

      {editing && !locked && (
        <div className="mt-2 flex gap-2">
          <Button size="sm" disabled={busy} onClick={save} className="flex-1">
            Salvar palpite
          </Button>
          <Button size="sm" variant="outline" disabled={busy} onClick={() => setEditing(false)}>
            Cancelar
          </Button>
          {pick && (
            <Button size="sm" variant="outline" disabled={busy} onClick={clear} className="text-destructive">
              Limpar
            </Button>
          )}
        </div>
      )}

      {official && (
        <p className="mt-2 text-[11px] text-muted-foreground">
          Oficial: <span className="font-mono font-semibold text-foreground">{official.homeScore}×{official.awayScore}</span>
        </p>
      )}
    </div>
  );
}

function PickSide({
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
// Ranking
// ============================================================

function RankingView({
  members,
  picksByUser,
  scores,
  currentUid,
}: {
  members: Array<{ userId: string; displayName: string; photoURL: string | null }>;
  picksByUser: Record<string, Record<number, { homeScore: number; awayScore: number }>>;
  scores: Record<number, { homeScore: number; awayScore: number } | undefined>;
  currentUid: string;
}) {
  const leaderboard = useMemo(
    () => buildLeaderboard(members, picksByUser, scores),
    [members, picksByUser, scores]
  );

  if (leaderboard.length === 0) {
    return (
      <p className="mt-6 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        Sem membros no grupo ainda.
      </p>
    );
  }

  return (
    <div className="mt-3">
      <Card>
        <CardContent className="pt-3">
          <table className="w-full text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="pb-1 text-left text-xs font-medium">#</th>
                <th className="pb-1 text-left text-xs font-medium">Jogador</th>
                <th className="pb-1 text-right text-xs font-medium">Cravadas</th>
                <th className="pb-1 text-right text-xs font-medium">Pts</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((r, i) => (
                <tr
                  key={r.uid}
                  className={cn(
                    'border-t border-border/60',
                    r.uid === currentUid && 'bg-fifa-gold/5',
                    i === 0 && 'text-fifa-gold'
                  )}
                >
                  <td className="py-2 text-left tabular-nums">{i + 1}</td>
                  <td className="py-2 text-left">
                    <div className="flex items-center gap-2">
                      {r.photoURL ? (
                        <img src={r.photoURL} alt="" className="h-6 w-6 rounded-full object-cover" />
                      ) : (
                        <div className="grid h-6 w-6 place-items-center rounded-full bg-muted text-[10px] font-bold">
                          {r.displayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="truncate text-sm font-medium">{r.displayName}</span>
                    </div>
                  </td>
                  <td className="py-2 text-right tabular-nums">{r.exactCount}</td>
                  <td className="py-2 text-right font-bold tabular-nums">{r.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      <p className="mt-2 px-1 text-[11px] text-muted-foreground">
        Pontos atualizam automaticamente quando o placar oficial é preenchido na aba <strong>Jogos</strong>.
      </p>
    </div>
  );
}

// ============================================================
// Regras
// ============================================================

function RulesView() {
  return (
    <Card className="mt-3">
      <CardContent className="space-y-3 pt-4 text-sm">
        <div>
          <h3 className="font-semibold">Pontuação</h3>
          <ul className="mt-1 space-y-1 text-muted-foreground">
            <li>
              <span className="font-mono font-bold text-fifa-gold">10 pts</span> — placar exato (ex.: você 2×1, oficial 2×1)
            </li>
            <li>
              <span className="font-mono font-bold text-fifa-green">5 pts</span> — acertou o vencedor (ou empate) e a diferença de gols
            </li>
            <li>
              <span className="font-mono font-bold">3 pts</span> — só o resultado (vitória mandante / empate / vitória visitante)
            </li>
            <li>
              <span className="font-mono">0 pt</span> — errou
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Travamento</h3>
          <p className="mt-1 text-muted-foreground">
            Os palpites travam <strong>5 minutos antes</strong> do horário marcado do jogo. Depois disso, não dá mais
            pra editar.
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Placar oficial</h3>
          <p className="mt-1 text-muted-foreground">
            O placar oficial é preenchido manualmente por qualquer membro do grupo na aba <strong>Jogos → Calendário</strong>.
            Os pontos do bolão são calculados automaticamente em cima desse placar.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
