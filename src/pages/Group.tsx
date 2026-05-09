import { useState } from 'react';
import { Plus, LogIn, Copy, Loader2, Crown } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
              <li
                key={m.userId}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
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
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
