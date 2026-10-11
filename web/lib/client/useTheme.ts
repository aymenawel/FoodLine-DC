'use client';
import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

// Reads and sets the theme on <html data-theme>. "light" is the default; "dark" restores the original Night Ledger look.
export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');
  useEffect(() => {
    const read = () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);
  const toggle = useCallback(() => {
    const next: Theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    if (next === 'dark') document.documentElement.dataset.theme = 'dark';
    else delete document.documentElement.dataset.theme;
    try { localStorage.setItem('foodline-theme', next); } catch { /* private mode: still works for this visit */ }
  }, []);
  return { theme, toggle };
}
