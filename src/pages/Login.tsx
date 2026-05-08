import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useUIStore } from '@/stores/ui';
import { dictionary } from '@/lib/i18n';

export default function Login() {
  const navigate = useNavigate();
  const locale = useUIStore((s) => s.locale);
  const t = dictionary[locale];
  const { isSignedIn, loading, signInGoogle, signInApple, signInEmail, signUpEmail } = useAuth();
  const [emailMode, setEmailMode] = useState<'in' | 'up' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (loading) return null;
  if (isSignedIn) return <Navigate to="/album" replace />;

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      if (emailMode === 'up') {
        await signUpEmail(email, password, name || email.split('@')[0]);
      } else {
        await signInEmail(email, password);
      }
      navigate('/album');
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-6 px-6 py-10">
      <div className="text-center">
        <div className="mx-auto mb-3 grid h-20 w-20 place-items-center rounded-3xl bg-fifa-green text-fifa-gold shadow-lg">
          <span className="text-2xl font-black">26</span>
        </div>
        <h1 className="text-2xl font-bold">{t.appName}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Colecione, troque e complete junto com a galera.
        </p>
      </div>

      <div className="w-full space-y-3">
        <Button onClick={signInGoogle} className="w-full" size="lg">
          {t.auth.signInGoogle}
        </Button>
        <Button onClick={signInApple} className="w-full" size="lg" variant="outline">
          {t.auth.signInApple}
        </Button>
        <Button
          onClick={() => setEmailMode((m) => (m ? null : 'in'))}
          variant="ghost"
          className="w-full"
        >
          {emailMode ? 'Voltar' : t.auth.signInEmail}
        </Button>

        {emailMode && (
          <form onSubmit={handleEmail} className="space-y-3 rounded-xl border border-border p-4">
            {emailMode === 'up' && (
              <Input
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            )}
            <Input
              type="email"
              placeholder={t.auth.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <Input
              type="password"
              placeholder={t.auth.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={emailMode === 'up' ? 'new-password' : 'current-password'}
              minLength={6}
              required
            />
            {err && <p className="text-sm text-destructive">{err}</p>}
            <Button type="submit" className="w-full" disabled={busy}>
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {emailMode === 'up' ? t.auth.signUp : t.auth.signIn}
            </Button>
            <button
              type="button"
              onClick={() => setEmailMode(emailMode === 'in' ? 'up' : 'in')}
              className="w-full text-center text-xs text-muted-foreground underline-offset-2 hover:underline"
            >
              {emailMode === 'in' ? 'Não tenho conta, criar uma' : 'Já tenho conta, entrar'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
