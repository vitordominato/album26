import { useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { useStickers, useTeams } from '@/hooks/useTeams';
import { useCollection } from '@/hooks/useCollection';
import { useUIStore } from '@/stores/ui';
import { dictionary } from '@/lib/i18n';
import { GROUP_LETTERS } from '@/lib/data/teams';

const COLORS = ['#c8a44a', '#0d3520', '#dc2626', '#1e3a8a', '#16a34a', '#7c3aed'];

export default function Dashboard() {
  const { data: stickers, isLoading: sl } = useStickers();
  const { data: teams } = useTeams();
  const { entries } = useCollection();
  const locale = useUIStore((s) => s.locale);
  const t = dictionary[locale];

  const stats = useMemo(() => {
    if (!stickers || !teams) return null;

    const total = stickers.length;
    const have = stickers.filter((s) => (entries[s.id]?.quantity ?? 0) > 0).length;
    const dupes = Object.values(entries).reduce((acc, e) => acc + Math.max(0, e.quantity - 1), 0);

    const sectionData: Array<{ name: string; total: number; have: number }> = (
      ['fwc', 'team', 'cocacola', 'extras'] as const
    ).map((sec) => {
      const list = stickers.filter((s) => s.section === sec);
      const got = list.filter((s) => (entries[s.id]?.quantity ?? 0) > 0).length;
      return { name: t.sections[sec], total: list.length, have: got };
    });

    const groupData = GROUP_LETTERS.map((g) => {
      const teamIds = teams.filter((tm) => tm.groupStage === g).map((tm) => tm.id);
      const list = stickers.filter((s) => s.teamId && teamIds.includes(s.teamId));
      const got = list.filter((s) => (entries[s.id]?.quantity ?? 0) > 0).length;
      return { name: g, total: list.length, have: got };
    });

    return { total, have, dupes, sectionData, groupData };
  }, [stickers, teams, entries, t]);

  if (sl || !stats) {
    return (
      <div className="grid h-[60vh] place-items-center text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const pct = Math.round((stats.have / stats.total) * 100);
  const pieData = [
    { name: 'Tenho', value: stats.have },
    { name: 'Faltam', value: stats.total - stats.have },
  ];

  return (
    <>
      <PageHeader title="Dashboard" subtitle={`${stats.have}/${stats.total} · ${pct}%`} />

      <div className="mb-3 grid grid-cols-3 gap-2">
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-[10px] uppercase text-muted-foreground">Tenho</p>
            <p className="text-xl font-bold text-fifa-gold">{stats.have}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-[10px] uppercase text-muted-foreground">Faltam</p>
            <p className="text-xl font-bold">{stats.total - stats.have}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-[10px] uppercase text-muted-foreground">Repetidas</p>
            <p className="text-xl font-bold">{stats.dupes}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-3">
        <CardContent className="pt-4">
          <h3 className="mb-2 text-sm font-semibold">Progresso geral</h3>
          <div className="h-48">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((_e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-3">
        <CardContent className="pt-4">
          <h3 className="mb-2 text-sm font-semibold">Por seção</h3>
          <div className="space-y-2">
            {stats.sectionData.map((row) => {
              const p = row.total > 0 ? Math.round((row.have / row.total) * 100) : 0;
              return (
                <div key={row.name} className="flex items-center justify-between text-sm">
                  <span>{row.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {row.have}/{row.total} · <span className="text-fifa-gold">{p}%</span>
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <h3 className="mb-2 text-sm font-semibold">Por grupo da Copa</h3>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={stats.groupData}>
                <XAxis dataKey="name" stroke="#888" fontSize={11} />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="have" fill="#c8a44a" radius={[6, 6, 0, 0]} />
                <Bar dataKey="total" fill="#0d3520" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
