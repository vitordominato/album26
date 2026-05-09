import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { BottomNav } from '@/components/BottomNav';
import { useUIStore } from '@/stores/ui';

const Login = lazy(() => import('@/pages/Login'));
const Onboarding = lazy(() => import('@/pages/Onboarding'));
const Album = lazy(() => import('@/pages/Album'));
const Missing = lazy(() => import('@/pages/Missing'));
const Trades = lazy(() => import('@/pages/Trades'));
const Group = lazy(() => import('@/pages/Group'));
const Profile = lazy(() => import('@/pages/Profile'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const MemberAlbum = lazy(() => import('@/pages/MemberAlbum'));

function FullscreenLoader() {
  return (
    <div className="grid min-h-dvh place-items-center text-muted-foreground">
      <Loader2 className="h-7 w-7 animate-spin" />
    </div>
  );
}

function ProtectedShell({ children }: { children: React.ReactNode }) {
  const { isSignedIn, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullscreenLoader />;
  if (!isSignedIn) return <Navigate to="/login" replace state={{ from: location }} />;
  if (profile && !profile.displayName) return <Navigate to="/onboarding" replace />;

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col">
      <main className="flex-1 px-4 pb-24 pt-2">{children}</main>
      <BottomNav />
    </div>
  );
}

export default function App() {
  const theme = useUIStore((s) => s.theme);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <Suspense fallback={<FullscreenLoader />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/" element={<Navigate to="/album" replace />} />
        <Route
          path="/album"
          element={
            <ProtectedShell>
              <Album />
            </ProtectedShell>
          }
        />
        <Route
          path="/missing"
          element={
            <ProtectedShell>
              <Missing />
            </ProtectedShell>
          }
        />
        <Route
          path="/trades"
          element={
            <ProtectedShell>
              <Trades />
            </ProtectedShell>
          }
        />
        <Route
          path="/group"
          element={
            <ProtectedShell>
              <Group />
            </ProtectedShell>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedShell>
              <Profile />
            </ProtectedShell>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedShell>
              <Dashboard />
            </ProtectedShell>
          }
        />
        <Route
          path="/group/:groupId/member/:userId"
          element={
            <ProtectedShell>
              <MemberAlbum />
            </ProtectedShell>
          }
        />
        <Route path="*" element={<Navigate to="/album" replace />} />
      </Routes>
    </Suspense>
  );
}
