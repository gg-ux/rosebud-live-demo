import { createContext, useContext, useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';

const PageHeaderContext = createContext({ setActions: () => {}, setCenter: () => {} });

export function usePageActions(actions, deps = []) {
  const { setActions } = useContext(PageHeaderContext);
  useEffect(() => {
    setActions(actions);
    return () => setActions(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// Page-specific content for the header center slot (e.g. the podcast player on the
// Living Design System page). Cleared automatically when the page unmounts.
export function useHeaderCenter(node, deps = []) {
  const { setCenter } = useContext(PageHeaderContext);
  useEffect(() => {
    setCenter(node);
    return () => setCenter(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [actions, setActions] = useState(null);
  const [center, setCenter] = useState(null);

  return (
    <PageHeaderContext.Provider value={{ setActions, setCenter }}>
      <div className="min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-on-background)]">
        <header className="sticky top-0 z-50 h-[56px] flex items-center justify-between px-[16px] md:px-[24px] bg-[var(--color-surface)]/95 backdrop-blur border-b border-[var(--color-outline-light)]">
          <div className="flex items-center gap-[8px]">
            <a href="/" className="flex items-center gap-[8px] hover:opacity-80 transition-opacity">
              <img src="/favicon-rosebud.svg" alt="Rosebud" className="w-[22px] h-[22px]" />
              <span className="hidden sm:inline text-[17px] leading-[24px] font-[700] text-[var(--color-on-background)]">rosebud</span>
            </a>
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              aria-pressed={sidebarOpen}
              className="ml-[4px] p-[6px] rounded-[6px] text-[var(--color-secondary-text)] hover:bg-[var(--color-background)] hover:text-[var(--color-on-surface)] transition-colors cursor-pointer"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            </button>
          </div>
          {/* Center: page-injected content (e.g. podcast player). Absolutely positioned so left/right slots stay aligned. */}
          {center && (
            <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
              {center}
            </div>
          )}
          <div className="flex items-center">
            {actions}
          </div>
        </header>

        <div className="flex flex-1 min-h-0">
          <Sidebar open={sidebarOpen} />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </PageHeaderContext.Provider>
  );
}
