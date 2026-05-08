import { LogOut, Moon, Sun, Languages } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useUIStore } from '@/stores/ui';
import { dictionary, type Locale } from '@/lib/i18n';

const LOCALES: { value: Locale; label: string }[] = [
  { value: 'pt-BR', label: 'Português' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
];

export default function Profile() {
  const { profile, signOut } = useAuth();
  const { theme, setTheme, locale, setLocale } = useUIStore();
  const t = dictionary[locale];

  return (
    <>
      <PageHeader title={t.nav.profile} />

      <Card className="mb-3">
        <CardContent className="flex items-center gap-4 pt-4">
          {profile?.photoURL ? (
            <img
              src={profile.photoURL}
              alt=""
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="grid h-16 w-16 place-items-center rounded-full bg-muted text-2xl font-bold">
              {profile?.displayName?.charAt(0)?.toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{profile?.displayName}</p>
            <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
          </div>
        </CardContent>
      </Card>

      <h2 className="mb-2 text-sm font-semibold">Preferências</h2>
      <div className="mb-3 space-y-2">
        <Button
          variant="outline"
          className="w-full justify-between"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <span className="flex items-center gap-2">
            {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            Tema
          </span>
          <span className="text-muted-foreground capitalize">{theme}</span>
        </Button>

        <div className="rounded-xl border border-border p-3">
          <p className="mb-2 flex items-center gap-2 text-sm font-medium">
            <Languages className="h-4 w-4" /> Idioma
          </p>
          <div className="flex gap-2">
            {LOCALES.map((l) => (
              <Button
                key={l.value}
                size="sm"
                variant={locale === l.value ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setLocale(l.value)}
              >
                {l.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <Button variant="outline" className="w-full text-destructive" onClick={signOut}>
        <LogOut className="h-4 w-4" /> {t.auth.signOut}
      </Button>
    </>
  );
}
