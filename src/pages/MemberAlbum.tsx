import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useReadOnlyUserCollection } from '@/hooks/useCollection';
import { useStickers, useTeams } from '@/hooks/useTeams';
import { useGroupMembers } from '@/hooks/useGroups';

export default function MemberAlbum() {
  const { groupId, userId } = useParams<{ groupId: string; userId: string }>();
  const members = useGroupMembers(groupId ?? null);
  const member = members.find((m) => m.userId === userId);
  const { entries, loading } = useReadOnlyUserCollection(userId ?? null);
  const { data: stickers } = useStickers();
  const { data: teams } = useTeams();

  const stats = useMemo(() => {
    if (!stickers) return null;
    const have = stickers.filter((s) => (entries[s.id]?.quantity ?? 0) > 0).length;
    const total = stickers.length;
    const pct = total > 0 ? Math.round((have / total) * 100) : 0;
    const missing = stickers.filter((s) => !entries[s.id]);
    const dupes = stickers.filter((s) => (entries[s.id]?.quantity ?? 0) > 1);
    return { have, total, pct, missing, dupes };
  }, [stickers, entries]);

  const teamsById = useMemo(() => {
    const m: Record<string, string> = {};
    teams?.forEach((t) => (m[t.id] = t.namePt));
    return m;
  }, [teams]);

  if (loading || !stats) {
    return (
      <div className="grid h-[60vh] place-items-center text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={member?.displayName ?? 'Membro'}
        subtitle={`${stats.have}/${stats.total} · ${stats.pct}% (somente leitura)`}
        right={
          <Button asChild size="sm" variant="ghost">
            <Link to="/group"><ChevronLeft className="h-4 w-4" /></Link>
          </Button>
        }
      />

      <div className="mb-3 rounded-xl border border-border bg-card p-4">
        <Progress value={stats.pct} />
        <p className="mt-2 text-2xl font-black text-fifa-gold">{stats.pct}%</p>
      </div>

      <Tabs defaultValue="dupes">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dupes">Tem repetidas ({stats.dupes.length})</TabsTrigger>
          <TabsTrigger value="missing">Falta ({stats.missing.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="dupes">
          <ul className="divide-y divide-border rounded-xl border border-border bg-card">
            {stats.dupes.length === 0 && (
              <li className="p-6 text-center text-sm text-muted-foreground">
                Nenhuma repetida pra trocar.
              </li>
            )}
            {stats.dupes.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{s.code}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {s.label} {s.teamId && `· ${teamsById[s.teamId]}`}
                  </p>
                </div>
                <Badge variant="gold">x{entries[s.id]?.quantity}</Badge>
              </li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="missing">
          <ul className="divide-y divide-border rounded-xl border border-border bg-card">
            {stats.missing.length === 0 && (
              <li className="p-6 text-center text-sm text-muted-foreground">
                Já completou tudo!
              </li>
            )}
            {stats.missing.map((s) => (
              <li key={s.id} className="px-4 py-3">
                <p className="text-sm font-semibold">{s.code}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {s.label} {s.teamId && `· ${teamsById[s.teamId]}`}
                </p>
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>
    </>
  );
}
