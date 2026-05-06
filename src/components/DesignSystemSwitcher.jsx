import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, AppWindow, Globe, ChevronDown, Check } from 'lucide-react';

// Same icon + accent palette as the Dashboard cards, for visual continuity.
const SYSTEMS = [
  {
    key: 'mobile',
    label: 'Mobile App',
    path: '/design-system',
    Icon: Smartphone,
    iconBg: 'bg-[#FFE2ED]',
    iconFg: 'text-[#A40742]',
  },
  {
    key: 'web',
    label: 'Web App',
    path: '/design-system-web',
    Icon: AppWindow,
    iconBg: 'bg-[#DDF3EB]',
    iconFg: 'text-[#2F7E63]',
  },
  {
    key: 'website',
    label: 'Website',
    path: '/design-system-website',
    Icon: Globe,
    iconBg: 'bg-[#FAF3E7]',
    iconFg: 'text-[#7A5C28]',
  },
];

/* ───────────────────────────────────────────────────────
   DesignSystemSwitcher
   The sticky title at the top of each design system's
   in-page sidebar. Accent-colored icon + label + chevron;
   click opens a dropdown of all 3 systems for one-click
   switching.
   ─────────────────────────────────────────────────────── */

export function DesignSystemSwitcher({ current }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const currentSys = SYSTEMS.find((s) => s.key === current);
  if (!currentSys) return null;
  const CurrentIcon = currentSys.Icon;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-[10px] w-full text-left rounded-[8px] -mx-[4px] px-[4px] py-[4px] hover:bg-[var(--color-surface-variant)] transition-colors cursor-pointer"
      >
        <div className={`shrink-0 w-[32px] h-[32px] rounded-[10px] flex items-center justify-center ${currentSys.iconBg} ${currentSys.iconFg}`}>
          <CurrentIcon size={16} strokeWidth={1.8} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-[700] uppercase tracking-[0.08em] text-[var(--color-secondary-text)] leading-[12px] mb-[2px]">
            Design System
          </p>
          <div className="flex items-center gap-[4px]">
            <span className="text-[14px] leading-[18px] font-[600] text-[var(--color-on-background)] truncate">
              {currentSys.label}
            </span>
            <ChevronDown
              size={14}
              className={`shrink-0 text-[var(--color-secondary-text)] transition-transform ${open ? 'rotate-180' : ''}`}
            />
          </div>
        </div>
      </button>
      {open && (
        <div
          role="listbox"
          className="absolute top-full left-0 right-0 mt-[6px] z-30 rounded-[10px] bg-[var(--color-surface)] border border-[var(--color-outline-light)] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden p-[4px]"
        >
          {SYSTEMS.map((s) => {
            const ItemIcon = s.Icon;
            const isCurrent = s.key === current;
            return (
              <Link
                key={s.key}
                to={s.path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-[10px] px-[8px] py-[8px] rounded-[8px] text-[13px] leading-[18px] transition-colors ${
                  isCurrent
                    ? 'bg-[var(--color-surface-variant)] text-[var(--color-on-background)] font-[600]'
                    : 'text-[var(--color-on-surface)] font-[500] hover:bg-[var(--color-surface-variant)]'
                }`}
              >
                <div className={`shrink-0 w-[24px] h-[24px] rounded-[6px] flex items-center justify-center ${s.iconBg} ${s.iconFg}`}>
                  <ItemIcon size={12} strokeWidth={1.8} />
                </div>
                <span className="flex-1">{s.label}</span>
                {isCurrent && <Check size={12} className="text-[var(--color-secondary-text)]" />}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
