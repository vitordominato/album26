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
import type { Confederation } from '@/types';

const COLORS = ['#c8a44a', '#0d3520', '#dc2626', '#1e3a8a', '#16a34a', '#7c3aed'];

export default function Dashboard() {
  const { data: stickers, isLoading: sl } = useStickers();
  const { data: teams } = useTeams();
  const { entries } = useCollection();

  const stats = useMemo(() => {
    if (!stickers || !teams) return null;

    const total = stickers.length;
    const have = stickers.filter((s) => (entries[s.id]?.quantity ?? 0) > 0).length;
    const dupes = Object.values(entries).reduce(
      (acc, e) => acc + Math.max(0, e.quantity - 1),
      0
    );

    const sectionMap: Record<string, { total: number; have: number }> = {};
    stickers.forEach((s) => {
      sectionMap[s.section] ??= { total: 0, have: 0 };
      sectionMap[s.section].total++;
      if ((entries[s.id]?.quantity ?? 0) > 0) sectionMap[s.section].have++;
    });

    const teamsByConf: Record<Confederation, string[]> = {
      CONMEBOL: [],
      UEFA: [],
      CONCACAF: [],
      AFC: [],
      CAF: [],
      OFC: [],
    };
    teams.forEach((t) => teamsByConf[t.confederation].push(t.id));

    const confData = (Object.keys(teamsByConf) as Confederation[]).map((conf) => {
      const teamIds = teamsByConf[conf];
      const list = stickers.filter((s) => s.teamId && teamIds.includes(s.teamId));
      const got = list.filter((s) => (entries[s.id]?.quantity ?? 0) > 0).length;
      return { name: conf, total: list.length, have: got };
    });

    return { total, have, dupes, sectionMap, confData };
  }, [stickers, teams, entries]);

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
          <h3 className="mb-2 text-sm font-semibold">Progresso</h3>
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
                  {pieData.map((_entry, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <h3 className="mb-2 text-sm font-semibold">Por confederação</h3>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={stats.confData}>
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
