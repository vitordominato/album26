import { NavLink } from 'react-router-dom';
import { Album, Search, ArrowLeftRight, Users, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/ui';
import { dictionary } from '@/lib/i18n';

const items = [
  { to: '/album', icon: Album, key: 'album' },
  { to: '/missing', icon: Search, key: 'missing' },
  { to: '/trades', icon: ArrowLeftRight, key: 'trades' },
  { to: '/group', icon: Users, key: 'group' },
  { to: '/profile', icon: User, key: 'profile' },
] as const;

export function BottomNav() {
  const locale = useUIStore((s) => s.locale);
  const t = dictionary[locale].nav;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur safe-bottom">
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {items.map(({ to, icon: Icon, key }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex min-h-[64px] flex-1 flex-col items-center justify-center gap-1 px-2 py-2 text-xs transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            <Icon className="h-5 w-5" />
            <span className="text-[11px] font-medium">{t[key]}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
