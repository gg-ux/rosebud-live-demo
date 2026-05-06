import { useState, useEffect, useCallback } from 'react';

// Same scheme as the legacy global PasswordGate: base64-encoded password,
// localStorage flag once unlocked. Not real auth — keeps casual visitors
// out of in-progress / archive pages.
const ENCODED_PASSWORD = 'Ymxvb21pbmczMzM=';
const STORAGE_KEY = 'rosebud-demo-unlocked';

export function useUnlocked() {
  const [unlocked, setUnlocked] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === 'yes') setUnlocked(true);
    } catch {
      // localStorage blocked (private mode etc.) — fall through
    }
    setChecked(true);
  }, []);

  const tryUnlock = useCallback((input) => {
    if (typeof window === 'undefined') return false;
    if (window.btoa(input) !== ENCODED_PASSWORD) return false;
    try { localStorage.setItem(STORAGE_KEY, 'yes'); } catch { /* ignore */ }
    setUnlocked(true);
    return true;
  }, []);

  return { unlocked, checked, tryUnlock };
}
