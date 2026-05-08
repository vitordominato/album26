import { ReactNode } from 'react';

export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <header className="safe-top sticky top-0 z-30 -mx-4 mb-3 border-b border-border/60 bg-background/85 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-md items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold leading-none">{title}</h1>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {right}
      </div>
    </header>
  );
}
