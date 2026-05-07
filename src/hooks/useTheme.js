import { useState, useEffect } from 'react';

const STORAGE_KEY = 'theme';

// Page-level pages each render their own dark/light toggle (via usePageActions).
// Without a shared store, each page's local state resets the theme on
// navigation. This hook reads from localStorage on mount and writes back
// on every change, so the toggle persists across pages and reloads.
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof document === 'undefined') return 'light';
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') return stored;
    } catch { /* ignore */ }
    return document.documentElement.getAttribute('data-theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch { /* ignore */ }
  }, [theme]);

  return [theme, setTheme];
}
