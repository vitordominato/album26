import { Sparkles, MessageCircle, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGroups } from '@/hooks/useGroups';
import { useTrades, useMatchSuggestionsForGroup } from '@/hooks/useTrades';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';
import { dictionary } from '@/lib/i18n';
import { whatsappShareUrl } from '@/lib/utils';
import { Link } from 'react-router-dom';

export default function Trades() {
  const { groups, loading } = useGroups();
  const activeGroupId = useUIStore((s) => s.activeGroupId);
  const setActiveGroup = useUIStore((s) => s.setActiveGroup);
  const profile = useAuthStore((s) => s.profile);
  const locale = useUIStore((s) => s.locale);
  const t = dictionary[locale].trades;

  const groupId = activeGroupId ?? groups[0]?.id ?? null;
  const group = groups.find((g) => g.id === groupId) ?? null;
  const { trades, proposeTrade, updateStatus } = useTrades(groupId);
  const groupSuggestions = useMatchSuggestionsForGroup(groupId);

  if (loading) {
    return (
      <div className="grid h-[60vh] place-items-center text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <>
        <PageHeader title={t.title} />
        <div className="rounded-xl border border-dashed border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Você ainda não está em nenhum grupo. Trocas acontecem dentro de grupos com amigos.
          </p>
          <Button asChild className="mt-4">
            <Link to="/group">Criar ou entrar num grupo</Link>
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={t.title}
        subtitle={group?.name}
        right={
          groups.length > 1 ? (
            <select
              className="rounded-lg border border-input bg-background px-2 py-1 text-sm"
              value={groupId ?? ''}
              onChange={(e) => setActiveGroup(e.target.value || null)}
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          ) : null
        }
      />

      {groupSuggestions.length > 0 && (
        <section className="mb-4">
          <h2 className="mb-2 flex items-center gap-1 text-sm font-semibold">
            <Sparkles className="h-4 w-4 text-fifa-gold" /> Sugestões de match
          </h2>
          <div className="space-y-2">
            {groupSuggestions.map((s) => (
              <Card key={s.id}>
                <CardContent className="space-y-2 pt-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{s.partnerName}</p>
                    <Badge variant="gold">{s.score} match</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t.iCanGive}: <span className="font-mono">{s.iCanGive.slice(0, 6).join(', ')}</span>
                    {s.iCanGive.length > 6 && ` +${s.iCanGive.length - 6}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t.iCanGet}: <span className="font-mono">{s.iCanGet.slice(0, 6).join(', ')}</span>
                    {s.iCanGet.length > 6 && ` +${s.iCanGet.length - 6}`}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        groupId &&
                        profile &&
                        proposeTrade({
                          groupId,
                          toUserId: s.partnerUserId,
                          toUserName: s.partnerName,
                          fromUserName: profile.displayName,
                          offerStickerIds: s.iCanGive.slice(0, 5),
                          requestStickerIds: s.iCanGet.slice(0, 5),
                        })
                      }
                    >
                      {t.propose}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        window.open(
                          whatsappShareUrl(
                            `Oi ${s.partnerName}! Vi que temos match no álbum: te dou ${s.iCanGive
                              .slice(0, 5)
                              .join(', ')} e queria ${s.iCanGet.slice(0, 5).join(', ')}.`
                          ),
                          '_blank'
                        )
                      }
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-2 text-sm font-semibold">Trocas</h2>
        <ul className="space-y-2">
          {trades.length === 0 && (
            <li className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Nenhuma troca por aqui ainda.
            </li>
          )}
          {trades.map((tr) => {
            const mine = tr.fromUserId === profile?.uid;
            const counterpart = mine ? tr.toUserName : tr.fromUserName;
            return (
              <li key={tr.id}>
                <Card>
                  <CardContent className="space-y-2 pt-4">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{counterpart}</p>
                      <Badge
                        variant={
                          tr.status === 'done'
                            ? 'gold'
                            : tr.status === 'pending'
                              ? 'default'
                              : 'outline'
                        }
                      >
                        {t[tr.status as keyof typeof t] ?? tr.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {mine ? 'Você oferece' : 'Eles oferecem'}:{' '}
                      <span className="font-mono">{tr.offerStickerIds.join(', ')}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {mine ? 'Você quer' : 'Eles querem'}:{' '}
                      <span className="font-mono">{tr.requestStickerIds.join(', ')}</span>
                    </p>
                    {tr.status === 'pending' && !mine && (
                      <div className="flex gap-2 pt-1">
                        <Button size="sm" onClick={() => updateStatus(tr.id, 'accepted')}>
                          {t.accept}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus(tr.id, 'rejected')}
                        >
                          {t.reject}
                        </Button>
                      </div>
                    )}
                    {tr.status === 'accepted' && (
                      <Button size="sm" onClick={() => updateStatus(tr.id, 'done')}>
                        Marcar como concluída
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
