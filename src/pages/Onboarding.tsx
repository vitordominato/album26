import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';

const AVATARS = ['🦁', '⚽', '🏆', '🌟', '🔥', '🇧🇷', '🇺🇸', '🇲🇽'];

export default function Onboarding() {
  const navigate = useNavigate();
  const { isSignedIn, profile, updateUserProfile, loading } = useAuth();
  const [name, setName] = useState(profile?.displayName ?? '');
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [busy, setBusy] = useState(false);

  if (loading) return null;
  if (!isSignedIn) return <Navigate to="/login" replace />;
  if (profile?.displayName && profile.photoURL) return <Navigate to="/album" replace />;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    try {
      await updateUserProfile({
        displayName: name.trim(),
        photoURL: profile?.photoURL ?? `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' fill='%230d3520'/><text x='32' y='44' font-size='40' text-anchor='middle'>${encodeURIComponent(avatar)}</text></svg>`,
      });
      navigate('/album');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-6 px-6 py-10">
      <div>
        <h1 className="text-2xl font-bold">Bem-vindo!</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Como você quer aparecer pros amigos no álbum?
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Nome</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            required
            autoFocus
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Avatar</label>
          <div className="grid grid-cols-4 gap-2">
            {AVATARS.map((a) => (
              <button
                type="button"
                key={a}
                onClick={() => setAvatar(a)}
                className={`grid aspect-square place-items-center rounded-xl text-3xl transition ${
                  avatar === a ? 'bg-fifa-gold text-fifa-green' : 'bg-muted'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          Começar
        </Button>
      </form>
    </div>
  );
}
