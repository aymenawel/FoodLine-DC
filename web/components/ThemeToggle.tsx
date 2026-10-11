'use client';
import { useTheme } from '@/lib/client/useTheme';

// "Dark mode" switches the whole site back to the original dark look; pressing it again returns to the cream Market theme.
export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const on = theme === 'dark';
  return (
    <button type="button" onClick={toggle} aria-pressed={on}
      className={`inline-flex min-h-11 items-center gap-2.5 rounded-full border border-line-strong bg-panel/90 px-4 text-base font-semibold text-ink backdrop-blur-sm ${className}`}>
      <span aria-hidden className={`relative h-5 w-9 shrink-0 rounded-full border border-line-strong transition-colors ${on ? 'bg-cta' : 'bg-panel-2'}`}>
        <span className={`absolute top-0.5 size-3.5 rounded-full bg-ink transition-all ${on ? 'left-[18px]' : 'left-0.5'}`} />
      </span>
      Dark mode
    </button>
  );
}
