import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useUnlocked } from '../hooks/useUnlocked';

const CONTACT_EMAIL = 'grace@rosebud.app';

/* ───────────────────────────────────────────────────────
   PrivateRoute
   Wraps a route element. If the visitor has unlocked
   (localStorage flag), renders children. Otherwise shows
   a centered password modal — Layout's top nav + sidebar
   stay visible around it, so the gate feels like part of
   the app rather than a wall.
   ─────────────────────────────────────────────────────── */

export function PrivateRoute({ children }) {
  const { unlocked, checked, tryUnlock } = useUnlocked();
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Older browser / blocked clipboard — fall through silently.
    }
  };

  // Avoid flashing the gate for visitors who already unlocked.
  if (!checked) return null;
  if (unlocked) return children;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tryUnlock(input)) setError(true);
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-[24px] bg-[var(--color-background)]">
      <div className="w-full max-w-[400px] p-[28px] rounded-[16px] bg-[var(--color-surface)] border border-[var(--color-outline-light)] shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-[10px] mb-[16px]">
          <img src="/favicon-rosebud.svg" alt="" className="w-[20px] h-[20px]" />
          <span className="text-[11px] font-[700] uppercase tracking-[0.08em] text-[var(--color-secondary-text)]">Private</span>
        </div>
        <h2 className="text-[20px] leading-[26px] font-[700] tracking-[-0.01em] text-[var(--color-on-background)] mb-[6px]">
          This page is not public
        </h2>
        <p className="text-[14px] leading-[20px] font-[450] text-[var(--color-secondary-text)] mb-[20px]">
          Enter the password to view it. If you don't have one, ask Grace ({CONTACT_EMAIL}
          <button
            type="button"
            onClick={handleCopyEmail}
            aria-label={copied ? 'Email copied' : 'Copy email'}
            className="inline-flex items-center align-text-bottom ml-[4px] p-[2px] rounded-[4px] text-[var(--color-secondary-text)] hover:text-[var(--color-on-background)] hover:bg-[var(--color-surface-variant)] transition-colors cursor-pointer"
          >
            {copied ? <Check size={12} className="text-[#5ABA9D]" /> : <Copy size={12} />}
          </button>
          ).
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-[10px]">
          <input
            type="password"
            value={input}
            onChange={(e) => { setInput(e.target.value); if (error) setError(false); }}
            placeholder="Password"
            autoFocus
            autoComplete="off"
            className={`w-full h-[44px] px-[14px] rounded-[10px] border bg-[var(--color-background)] text-[14px] font-[450] text-[var(--color-on-background)] placeholder:text-[var(--color-secondary-text)] outline-none transition-colors ${
              error
                ? 'border-[#E31665] focus:border-[#E31665]'
                : 'border-[var(--color-outline)] focus:border-[var(--color-on-surface)]'
            }`}
          />
          {error && (
            <p className="text-[12px] leading-[16px] font-[500] text-[#E31665]">
              That doesn&rsquo;t look right. Try again.
            </p>
          )}
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-full h-[44px] rounded-[10px] bg-[#191C1A] text-white text-[14px] font-[600] cursor-pointer hover:opacity-90 transition-opacity disabled:bg-[var(--color-outline-light)] disabled:text-[var(--color-secondary-text)] disabled:cursor-not-allowed"
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
}
