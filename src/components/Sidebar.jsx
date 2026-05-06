import { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Lock } from 'lucide-react';

const SECTIONS = [
  {
    label: 'Foundation',
    items: [
      { path: '/design-system', label: 'Design System · Mobile App' },
      { path: '/design-system-web', label: 'Design System · Web App' },
      { path: '/design-system-website', label: 'Design System · Website' },
    ],
  },
  {
    label: 'Concepts',
    private: true,
    items: [{ path: '/tool-calls', label: 'Tool Calls' }],
  },
  {
    label: 'Planning',
    private: true,
    items: [{ path: '/living-design-system', label: 'Living Design System' }],
  },
  {
    label: 'Archive',
    private: true,
    items: [
      { path: '/patterns', label: 'Patterns' },
      { path: '/therapist', label: 'For Therapists' },
    ],
  },
];

const PRIVATE_TOGGLE_KEY = 'rosebud-demo-show-private';

function SidebarItem({ item, isActive }) {
  return (
    <Link
      to={item.path}
      className={`block px-[10px] py-[6px] rounded-[8px] text-[13px] leading-[18px] font-[500] transition-colors ${
        isActive
          ? 'bg-[var(--color-background)] text-[var(--color-on-background)] font-[600]'
          : 'text-[var(--color-on-surface)] hover:bg-[var(--color-surface-variant)]'
      }`}
    >
      {item.label}
    </Link>
  );
}

function CollapsibleSection({ section, isActive, forceOpen }) {
  const [userExpanded, setUserExpanded] = useState(true);
  const expanded = forceOpen || userExpanded;
  return (
    <div>
      <button
        onClick={() => setUserExpanded((e) => !e)}
        disabled={forceOpen}
        className={`flex items-center gap-[6px] w-full py-[6px] text-[11px] leading-[14px] font-[700] uppercase tracking-[0.08em] text-[var(--color-secondary-text)]/60 transition-colors ${
          forceOpen ? 'cursor-default' : 'hover:text-[var(--color-secondary-text)] cursor-pointer'
        }`}
      >
        <ChevronRight
          size={12}
          className={`shrink-0 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
        />
        <span>{section.label}</span>
        {section.private && (
          <Lock size={10} className="shrink-0 text-[var(--color-secondary-text)]/60" aria-label="Private" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-[2px] mt-[4px] ml-[6px]">
              {section.items.map((item) => (
                <SidebarItem key={item.path} item={item} isActive={isActive(item.path)} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PrivateToggle({ on, onChange }) {
  return (
    <label className="flex items-center justify-between gap-[10px] px-[10px] py-[8px] rounded-[8px] hover:bg-[var(--color-surface-variant)] cursor-pointer transition-colors">
      <span className="text-[12px] leading-[16px] font-[500] text-[var(--color-secondary-text)]">Show private pages</span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={(e) => { e.preventDefault(); onChange(!on); }}
        className={`relative shrink-0 w-[28px] h-[16px] rounded-full transition-colors ${
          on ? 'bg-[var(--color-on-background)]' : 'bg-[var(--color-outline-light)]'
        }`}
      >
        <span
          className={`absolute top-[2px] left-[2px] w-[12px] h-[12px] rounded-full bg-white transition-transform shadow-sm ${
            on ? 'translate-x-[12px]' : ''
          }`}
        />
      </button>
    </label>
  );
}

export function Sidebar({ open }) {
  const { pathname } = useLocation();
  const [query, setQuery] = useState('');
  const [showPrivate, setShowPrivate] = useState(false);

  // Load persisted toggle state on mount.
  useEffect(() => {
    try {
      if (localStorage.getItem(PRIVATE_TOGGLE_KEY) === 'yes') setShowPrivate(true);
    } catch { /* ignore */ }
  }, []);

  const handleTogglePrivate = (next) => {
    setShowPrivate(next);
    try {
      if (next) localStorage.setItem(PRIVATE_TOGGLE_KEY, 'yes');
      else localStorage.removeItem(PRIVATE_TOGGLE_KEY);
    } catch { /* ignore */ }
  };

  const isActive = (path) => pathname === path;

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    // Hide private sections by default. Search bypasses the filter so a typed
    // query can find anything (Grace's escape hatch).
    const visible = q ? SECTIONS : SECTIONS.filter((s) => showPrivate || !s.private);
    if (!q) return visible;
    return visible
      .map((s) => ({
        ...s,
        items: s.items.filter(
          (i) => i.label.toLowerCase().includes(q) || s.label.toLowerCase().includes(q),
        ),
      }))
      .filter((s) => s.items.length > 0);
  }, [q, showPrivate]);

  return (
    <aside
      className={`shrink-0 sticky top-[56px] self-start h-[calc(100vh-56px)] overflow-hidden transition-[width] duration-200 ease-out border-r border-[var(--color-outline-light)] bg-[var(--color-surface)] ${
        open ? 'w-[240px]' : 'w-0'
      }`}
      aria-hidden={!open}
    >
      <div className="w-[240px] h-full flex flex-col px-[12px] py-[12px] gap-[10px]">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search…"
          className="w-full px-[10px] py-[6px] rounded-[8px] bg-[var(--color-surface-variant)] border border-[var(--color-outline-light)] text-[13px] leading-[18px] font-[450] text-[var(--color-on-surface)] placeholder:text-[var(--color-secondary-text)] outline-none focus:border-[var(--color-primary)] transition-colors"
        />
        <div className="flex-1 overflow-y-auto flex flex-col gap-[10px]">
          {filtered.length === 0 ? (
            <p className="px-[10px] py-[8px] text-[12px] text-[var(--color-secondary-text)]/70">No matches</p>
          ) : (
            filtered.map((section, idx) => (
              <CollapsibleSection
                key={idx}
                section={section}
                isActive={isActive}
                forceOpen={!!q}
              />
            ))
          )}
        </div>
        {/* Bottom: private-pages toggle */}
        <div className="pt-[8px] border-t border-[var(--color-outline-light)]">
          <PrivateToggle on={showPrivate} onChange={handleTogglePrivate} />
        </div>
      </div>
    </aside>
  );
}
