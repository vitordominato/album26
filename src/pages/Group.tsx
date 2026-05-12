import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, LogIn, Copy, Loader2, Crown, ChevronRight, Trophy } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { useGroups, useGroupMembers, useMemberCollection } from '@/hooks/useGroups';
import { useStickers, useTeams } from '@/hooks/useTeams';
import { useUIStore } from '@/stores/ui';
import type { Sticker, Team } from '@/types';

type ListKind = 'missing' | 'dupes';

type View =
  | { kind: 'members' }
  | { kind: 'member'; userId: string };

export default function Group() {
  const { groups, loading, createGroup, joinGroupByCode, leaveGroup } = useGroups();
  const activeGroupId = useUIStore((s) => s.activeGroupId);
  const setActiveGroup = useUIStore((s) => s.setActiveGroup);
  const groupId = activeGroupId ?? groups[0]?.id ?? null;
  const group = groups.find((g) => g.id === groupId) ?? null;
  const members = useGroupMembers(groupId);

  const [newName, setNewName] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [view, setView] = useState<View>({ kind: 'members' });

  if (loading) {
    return (
      <div className="grid h-[60vh] place-items-center text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (view.kind === 'member') {
    const member = members.find((m) => m.userId === view.userId);
    if (!member) {
      setView({ kind: 'members' });
      return null;
    }
    return (
      <MemberView
        member={member}
        onBack={() => setView({ kind: 'members' })}
      />
    );
  }

  return (
    <>
      <PageHeader
        title="Grupos"
        subtitle={group ? `${members.length} membros · ${group.inviteCode}` : 'Sem grupos ainda'}
      />

      <div className="mb-3 flex gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex-1" size="sm">
              <Plus className="h-4 w-4" /> Criar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar grupo</DialogTitle>
              <DialogDescription>
                Quem entrar com o código vê e participa das trocas.
              </DialogDescription>
            </DialogHeader>
            <Input
              placeholder="Nome do grupo (ex: Família, Trampo, Faculdade)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            {err && <p className="text-sm text-destructive">{err}</p>}
            <DialogClose asChild>
              <Button
                disabled={busy || !newName.trim()}
                onClick={async () => {
                  setBusy(true);
                  setErr(null);
                  try {
                    const g = await createGroup(newName);
                    setActiveGroup(g.id);
                    setNewName('');
                  } catch (e) {
                    setErr((e as Error).message);
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                Criar
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex-1" size="sm">
              <LogIn className="h-4 w-4" /> Entrar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Entrar com código</DialogTitle>
              <DialogDescription>Cole o código de 6 caracteres.</DialogDescription>
            </DialogHeader>
            <Input
              placeholder="ABCDEF"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\s+/g, '').toUpperCase())}
              className="font-mono uppercase tracking-widest"
            />
            {err && <p className="text-sm text-destructive">{err}</p>}
            <DialogClose asChild>
              <Button
                disabled={busy || code.length !== 6}
                onClick={async () => {
                  setBusy(true);
                  setErr(null);
                  try {
                    const g = await joinGroupByCode(code);
                    setActiveGroup(g.id);
                    setCode('');
                  } catch (e) {
                    setErr((e as Error).message);
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                Entrar
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>

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

      {group && (
        <>
          <Card className="mb-3">
            <CardContent className="space-y-3 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Código de convite</p>
                  <p className="font-mono text-xl font-bold tracking-widest">{group.inviteCode}</p>
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => navigator.clipboard?.writeText(group.inviteCode)}
                  aria-label="Copiar código"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-destructive"
                onClick={() => leaveGroup(group.id)}
              >
                Sair do grupo
              </Button>
            </CardContent>
          </Card>

          <Button
            asChild
            size="lg"
            className="mb-4 w-full justify-between bg-gradient-to-br from-fifa-gold/30 to-fifa-green/30 text-foreground hover:from-fifa-gold/40 hover:to-fifa-green/40"
          >
            <Link to="/bolao">
              <span className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-fifa-gold" />
                <span className="font-bold">Abrir bolão</span>
              </span>
              <ChevronRight className="h-5 w-5" />
            </Link>
          </Button>

          <h2 className="mb-2 text-sm font-semibold">Membros</h2>
          <ul className="space-y-2">
            {members.map((m) => (
              <li key={m.userId}>
                <button
                  type="button"
                  onClick={() => setView({ kind: 'member', userId: m.userId })}
                  className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition hover:border-fifa-gold"
                >
                  {m.photoURL ? (
                    <img
                      src={m.photoURL}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-muted text-sm font-bold">
                      {m.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="flex-1 text-sm font-medium">{m.displayName}</span>
                  {m.role === 'owner' && (
                    <Badge variant="gold" className="gap-1">
                      <Crown className="h-3 w-3" /> dono
                    </Badge>
                  )}
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

function MemberView({
  member,
  onBack,
}: {
  member: { userId: string; displayName: string; photoURL: string | null };
  onBack: () => void;
}) {
  const { data: stickers, isLoading: stickersLoading } = useStickers();
  const { data: teams, isLoading: teamsLoading } = useTeams();
  const { entries, loading: collLoading } = useMemberCollection(member.userId);
  const [tab, setTab] = useState<ListKind>('missing');

  const stickersByTeam = useMemo(() => {
    const map: Record<string, Sticker[]> = {};
    stickers?.forEach((s) => {
      if (s.teamId) (map[s.teamId] ??= []).push(s);
    });
    Object.values(map).forEach((arr) => arr.sort((a, b) => (a.teamSlot ?? 0) - (b.teamSlot ?? 0)));
    return map;
  }, [stickers]);

  const teamsByGroup = useMemo(() => {
    const map: Record<string, Team[]> = {};
    teams?.forEach((tm) => (map[tm.groupStage] ??= []).push(tm));
    Object.values(map).forEach((arr) => arr.sort((a, b) => a.order - b.order));
    return map;
  }, [teams]);

  if (stickersLoading || teamsLoading || collLoading) {
    return (
      <div className="grid h-[60vh] place-items-center text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const missingTotal = Object.values(stickersByTeam).reduce(
    (acc, arr) => acc + filterByList(arr, entries, 'missing').length,
    0
  );
  const dupesTotal = Object.values(stickersByTeam).reduce(
    (acc, arr) => acc + filterByList(arr, entries, 'dupes').length,
    0
  );

  return (
    <>
      <PageHeader
        title={member.displayName}
        subtitle={`${missingTotal} faltando · ${dupesTotal} repetidas`}
        right={
          <Button size="sm" variant="ghost" onClick={onBack}>
            Voltar
          </Button>
        }
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as ListKind)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="missing">Faltam ({missingTotal})</TabsTrigger>
          <TabsTrigger value="dupes">Repetidas ({dupesTotal})</TabsTrigger>
        </TabsList>
        <TabsContent value="missing">
          <StickersByFlag
            teamsByGroup={teamsByGroup}
            stickersByTeam={stickersByTeam}
            entries={entries}
            list="missing"
          />
        </TabsContent>
        <TabsContent value="dupes">
          <StickersByFlag
            teamsByGroup={teamsByGroup}
            stickersByTeam={stickersByTeam}
            entries={entries}
            list="dupes"
          />
        </TabsContent>
      </Tabs>
    </>
  );
}

function StickersByFlag({
  teamsByGroup,
  stickersByTeam,
  entries,
  list,
}: {
  teamsByGroup: Record<string, Team[]>;
  stickersByTeam: Record<string, Sticker[]>;
  entries: Record<string, number>;
  list: ListKind;
}) {
  const sections = Object.entries(teamsByGroup)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([groupStage, teamsInGroup]) => ({
      groupStage,
      teams: teamsInGroup
        .map((team) => ({
          team,
          items: filterByList(stickersByTeam[team.id] ?? [], entries, list),
        }))
        .filter((t) => t.items.length > 0),
    }))
    .filter((s) => s.teams.length > 0);

  if (sections.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        {list === 'missing'
          ? 'Esse jogador completou todas as seleções.'
          : 'Nenhuma repetida ainda.'}
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {sections.map(({ groupStage, teams }) => (
        <section key={groupStage}>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Grupo {groupStage}
          </h3>
          <div className="space-y-3">
            {teams.map(({ team, items }) => (
              <div
                key={team.id}
                className="overflow-hidden rounded-xl border border-border bg-card"
              >
                <div className="flex items-center gap-3 border-b border-border bg-muted/30 px-3 py-2">
                  <img
                    src={team.flagUrl}
                    alt=""
                    loading="lazy"
                    className="h-6 w-9 rounded object-cover ring-1 ring-border"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold leading-tight">
                      {team.namePt}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{team.code}</p>
                  </div>
                  <Badge variant={list === 'missing' ? 'gold' : 'default'}>
                    {items.length}
                  </Badge>
                </div>
                <ul className="divide-y divide-border">
                  {items.map((s) => (
                    <li
                      key={s.id}
                      className="flex items-center justify-between gap-3 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">{s.code}</p>
                        <p className="truncate text-xs text-muted-foreground">{s.label}</p>
                      </div>
                      {list === 'dupes' && (
                        <Badge variant="gold">x{entries[s.id] ?? 0}</Badge>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function filterByList(
  stickers: Sticker[],
  entries: Record<string, number>,
  list: ListKind
): Sticker[] {
  if (list === 'missing') {
    return stickers.filter((s) => (entries[s.id] ?? 0) === 0);
  }
  return stickers.filter((s) => (entries[s.id] ?? 0) > 1);
}
