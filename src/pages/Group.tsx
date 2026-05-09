import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, LogIn, Copy, Loader2, Crown, ChevronRight } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useReadOnlyUserCollection } from '@/hooks/useCollection';
import { useStickers } from '@/hooks/useTeams';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { useGroups, useGroupMembers } from '@/hooks/useGroups';
import { useUIStore } from '@/stores/ui';

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

  if (loading) {
    return (
      <div className="grid h-[60vh] place-items-center text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
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
              onChange={(e) => setCode(e.target.value.toUpperCase())}
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

          <h2 className="mb-2 text-sm font-semibold">Membros</h2>
          <ul className="space-y-2">
            {members.map((m) => (
              <MemberRow
                key={m.userId}
                groupId={group.id}
                userId={m.userId}
                displayName={m.displayName}
                photoURL={m.photoURL}
                isOwner={m.role === 'owner'}
              />
            ))}
          </ul>
        </>
      )}
    </>
  );
}

function MemberRow({
  groupId,
  userId,
  displayName,
  photoURL,
  isOwner,
}: {
  groupId: string;
  userId: string;
  displayName: string;
  photoURL: string | null;
  isOwner: boolean;
}) {
  const { entries } = useReadOnlyUserCollection(userId);
  const { data: stickers } = useStickers();
  const total = stickers?.length ?? 0;
  const have = stickers
    ? stickers.filter((s) => (entries[s.id]?.quantity ?? 0) > 0).length
    : 0;
  const pct = total > 0 ? Math.round((have / total) * 100) : 0;

  return (
    <li>
      <Link
        to={`/group/${groupId}/member/${userId}`}
        className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition hover:border-fifa-gold"
      >
        {photoURL ? (
          <img src={photoURL} alt="" className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <div className="grid h-10 w-10 place-items-center rounded-full bg-muted text-sm font-bold">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="flex items-center gap-2 truncate text-sm font-semibold">
            {displayName}
            {isOwner && (
              <Badge variant="gold" className="gap-1">
                <Crown className="h-3 w-3" /> dono
              </Badge>
            )}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <Progress value={pct} className="h-1.5 flex-1" />
            <span className="shrink-0 text-[11px] font-mono text-muted-foreground">
              {have}/{total} · <span className="text-fifa-gold">{pct}%</span>
            </span>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Link>
    </li>
  );
}
