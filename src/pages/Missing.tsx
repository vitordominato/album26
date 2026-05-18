import { useMemo, useState } from 'react';
import { Loader2, Share2 } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useStickers, useTeams } from '@/hooks/useTeams';
import { useCollection } from '@/hooks/useCollection';
import { whatsappShareUrl } from '@/lib/utils';

export default function Missing() {
  const { data: stickers, isLoading } = useStickers();
  const { data: teams } = useTeams();
  const { entries, incrementQty } = useCollection();
  const [search, setSearch] = useState('');

  const teamsById = useMemo(() => {
    const m: Record<string, string> = {};
    teams?.forEach((t) => (m[t.id] = t.namePt));
    return m;
  }, [teams]);

  const { missing, dupes } = useMemo(() => {
    const missing = (stickers ?? []).filter((s) => !entries[s.id]);
    const dupes = (stickers ?? []).filter((s) => (entries[s.id]?.quantity ?? 0) > 1);
    const filter = (s: typeof missing[number]) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        s.code.toLowerCase().includes(q) ||
        s.label?.toLowerCase().includes(q) ||
        teamsById[s.teamId ?? '']?.toLowerCase().includes(q)
      );
    };
    return { missing: missing.filter(filter), dupes: dupes.filter(filter) };
  }, [stickers, entries, search, teamsById]);

  if (isLoading) {
    return (
      <div className="grid h-[60vh] place-items-center text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  function shareList(list: typeof missing, title: string) {
    const sectionLabel: Record<string, string> = {
      fwc: 'FIFA World Cup',
      cocacola: 'Coca-Cola',
      extras: 'Extras',
      team: 'Outras',
    };
    const sectionOrder: Record<string, number> = {
      fwc: 1,
      cocacola: 2,
      extras: 3,
      team: 4,
    };
    const groups = new Map<string, { label: string; order: number; items: typeof list }>();
    list.forEach((s) => {
      const key = s.teamId ?? `__${s.section}`;
      const label = s.teamId
        ? teamsById[s.teamId] ?? s.teamId
        : sectionLabel[s.section] ?? s.section;
      const order = s.teamId ? 0 : sectionOrder[s.section] ?? 99;
      if (!groups.has(key)) groups.set(key, { label, order, items: [] });
      groups.get(key)!.items.push(s);
    });
    const slotOf = (s: typeof list[number]) => s.teamSlot ?? s.number;
    const lines = Array.from(groups.values())
      .sort((a, b) => a.order - b.order || a.label.localeCompare(b.label, 'pt-BR'))
      .map((g) => {
        const nums = g.items
          .slice()
          .sort((a, b) => slotOf(a) - slotOf(b))
          .map(slotOf)
          .join(', ');
        return `${g.label} — ${nums}`;
      })
      .join('\n');
    const text = `${title} — Álbum Copa 2026 (${list.length}):\n\n${lines}`;
    window.open(whatsappShareUrl(text), '_blank');
  }

  return (
    <>
      <PageHeader title="Faltam / Repetidas" subtitle={`${missing.length} faltando · ${dupes.length} repetidas`} />
      <Input
        placeholder="Buscar por código, jogador, seleção…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-3"
      />
      <Tabs defaultValue="missing">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="missing">Faltam</TabsTrigger>
          <TabsTrigger value="dupes">Repetidas</TabsTrigger>
        </TabsList>
        <TabsContent value="missing">
          <Button
            variant="outline"
            size="sm"
            className="mb-3 w-full"
            onClick={() => shareList(missing, 'Estou procurando estas')}
          >
            <Share2 className="h-4 w-4" /> Compartilhar lista no WhatsApp
          </Button>
          <ul className="divide-y divide-border rounded-xl border border-border bg-card">
            {missing.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">{s.code}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.label} {s.teamId && `· ${teamsById[s.teamId] ?? s.teamId}`}
                  </p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => incrementQty(s.id, +1)}>
                  + Coletei
                </Button>
              </li>
            ))}
            {missing.length === 0 && (
              <li className="p-6 text-center text-sm text-muted-foreground">
                Você completou tudo aqui!
              </li>
            )}
          </ul>
        </TabsContent>
        <TabsContent value="dupes">
          <Button
            variant="outline"
            size="sm"
            className="mb-3 w-full"
            onClick={() => shareList(dupes, 'Tenho estas repetidas pra trocar')}
          >
            <Share2 className="h-4 w-4" /> Compartilhar repetidas
          </Button>
          <ul className="divide-y divide-border rounded-xl border border-border bg-card">
            {dupes.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">{s.code}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.label} {s.teamId && `· ${teamsById[s.teamId]}`}
                  </p>
                </div>
                <Badge variant="gold">x{entries[s.id]?.quantity}</Badge>
              </li>
            ))}
            {dupes.length === 0 && (
              <li className="p-6 text-center text-sm text-muted-foreground">
                Nenhuma repetida ainda.
              </li>
            )}
          </ul>
        </TabsContent>
      </Tabs>
    </>
  );
}
