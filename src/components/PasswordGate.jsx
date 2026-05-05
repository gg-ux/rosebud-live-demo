import { useState, useEffect } from 'react';

/* ═══════════════════════════════════════════════════════════════════════════
   PasswordGate
   Casual access gate for the live demo. Wraps the entire app and holds
   visitors out until they enter the shared password. Once unlocked, the
   "unlocked" flag is stored in localStorage so the same browser only
   ever sees the gate once.

   Threat model: this is NOT real auth. The check runs client-side and
   the encoded password ships in the JS bundle. Anyone who reads the
   source could bypass it. The point is to keep random visitors and
   crawlers out, not to secure secrets.

   Password is base64-encoded ("blooming333" → "Ymxvb21pbmczMzM=") so it
   doesn't appear as a literal string in the bundle and survives a
   casual search through DevTools.
   ═══════════════════════════════════════════════════════════════════════════ */

const ENCODED_PASSWORD = 'Ymxvb21pbmczMzM=';
const STORAGE_KEY = 'rosebud-demo-unlocked';

// TEMP: gate disabled. Site is open. Flip GATE_DISABLED to false to
// re-enable the password gate.
const GATE_DISABLED = true;

export function PasswordGate({ children }) {
  const [unlocked, setUnlocked] = useState(false);
  const [checked, setChecked] = useState(false); // hydration guard
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  // Read the unlock flag once on mount AND tear down the index.html
  // preloader. The preloader is a CSS-only spinner injected before JS
  // runs (z-index 99999) — without explicitly removing it here, it
  // sits on top of the gate forever and the page looks like it's
  // "loading" indefinitely. This used to be the Loader component's
  // job, but the Loader was rendered as a child of this gate, so on
  // a fresh visit (no localStorage flag) the children never mount and
  // the preloader was never removed.
  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === 'yes') {
        setUnlocked(true);
      }
    } catch {
      // localStorage may be blocked (private mode, etc.) — fall through
      // to showing the gate. Not catastrophic.
    }
    setChecked(true);

    if (typeof document !== 'undefined') {
      const preloader = document.getElementById('preloader');
      if (preloader) {
        preloader.classList.add('hide');
        // Wait for the CSS opacity transition (0.5s in index.html)
        // before removing the node entirely.
        setTimeout(() => preloader.remove(), 500);
      }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof window !== 'undefined' && window.btoa(input) === ENCODED_PASSWORD) {
      try {
        localStorage.setItem(STORAGE_KEY, 'yes');
      } catch {
        // ignore
      }
      setUnlocked(true);
    } else {
      setError(true);
    }
  };

  // While we check localStorage, render nothing — avoids the gate
  // flashing for visitors who already unlocked.
  if (!checked) return null;

  if (GATE_DISABLED || unlocked) return children;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-[20px]"
      style={{
        background: 'linear-gradient(180deg, #F9F3F3 0%, #F0FFF4 100%)',
        fontFamily: "'Circular Std', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div className="w-full max-w-[380px] flex flex-col items-center text-center">
        {/* Rosebud logo */}
        <svg viewBox="0 0 624 625" className="w-[40px] h-[40px] mb-[20px]">
          <path d="M311.967 624.001C453.872 624.001 568.909 508.965 568.909 367.06C311.967 367.06 311.967 146.825 55.0264 146.825V367.06C55.0264 508.965 170.063 624.001 311.967 624.001Z" fill="#E31665" />
          <path d="M568.892 330.351H568.89C454.438 330.351 398.969 283.183 335.836 229.069L335.234 228.554C324.055 218.971 312.645 209.192 300.698 199.565C368.911 102.779 432.929 9.22867e-05 568.892 0V330.351Z" fill="#E31665" />
          <path opacity="0.6" d="M111.278 176.34C111.278 167.699 111.61 159.059 112.109 150.418C94.661 147.593 75.7177 145.931 55.1128 145.599V365.939C55.1128 508.179 170.932 623.999 313.339 623.999C360.863 623.999 405.397 611.038 443.615 588.605C253.684 547.561 111.278 378.568 111.278 176.34Z" fill="#B81457" />
        </svg>

        <h1 className="text-[24px] leading-[30px] font-[700] text-[#191C1A] tracking-[-0.01em] mb-[8px]">
          Rosebud · Pattern Discovery
        </h1>
        <p className="text-[14px] leading-[20px] font-[450] text-[#6D6C6A] mb-[28px]">
          Enter the password to continue.
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-[12px]">
          <input
            type="password"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (error) setError(false);
            }}
            placeholder="Password"
            autoFocus
            autoComplete="off"
            className={`w-full h-[44px] px-[16px] rounded-[12px] border bg-white text-[14px] font-[450] text-[#191C1A] placeholder:text-[#C0C0BF] focus:outline-none transition-colors ${
              error
                ? 'border-[#E31665] focus:border-[#E31665]'
                : 'border-[#C0C0BF] focus:border-[#191C1A]'
            }`}
          />
          {error && (
            <p className="text-[12px] leading-[16px] font-[500] text-[#E31665] -mt-[4px]">
              That doesn&rsquo;t look right. Try again.
            </p>
          )}
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-full h-[44px] rounded-[12px] bg-[#191C1A] text-white text-[14px] font-[600] cursor-pointer hover:opacity-90 transition-opacity disabled:bg-[#E5E5E5] disabled:text-[#C0C0BF] disabled:cursor-not-allowed"
          >
            Enter
          </button>
        </form>

        <p className="text-[11px] leading-[15px] font-[450] text-[#8B828B] mt-[20px]">
          Designed by Grace Guo · April 2026
        </p>
      </div>
    </div>
  );
}
