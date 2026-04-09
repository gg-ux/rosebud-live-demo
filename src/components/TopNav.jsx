import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/concepts', label: 'Concepts' },
  { path: '/design-system', label: 'Design System' },
];

export function TopNav({ rightSlot, alwaysVisible = false, className = '' }) {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (alwaysVisible) return;
    function onScroll() {
      const y = window.scrollY;
      if (y < 10) {
        setVisible(true);
      } else if (y > lastScrollY.current) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastScrollY.current = y;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [alwaysVisible]);

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] transition-transform duration-300 ease-out ${
        visible ? 'translate-y-0' : '-translate-y-full'
      } ${className}`}
    >
      <div className="max-w-[1400px] mx-auto px-[16px] md:px-[24px] h-[56px] flex items-center justify-between">
        {/* Left — logo */}
        <a href="/" className="flex items-center gap-[8px] hover:opacity-80 transition-opacity shrink-0">
          <img src="/favicon-rosebud.svg" alt="Rosebud" className="w-[22px] h-[22px]" />
          <span className="hidden sm:inline text-[17px] leading-[24px] font-[700] text-[var(--color-on-background)]">rosebud</span>
        </a>

        {/* Center — nav items */}
        <nav className="flex items-center gap-[4px]">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path;
            return (
              <a
                key={item.path}
                href={item.path}
                className={`
                  px-[12px] md:px-[16px] py-[7px] rounded-full text-[13px] md:text-[14px] leading-[20px] font-[500] transition-colors
                  ${isActive
                    ? 'bg-[var(--color-surface)] text-[var(--color-on-surface)]'
                    : 'text-[var(--color-secondary-text)] hover:text-[var(--color-on-surface)]'
                  }
                `}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Right — optional slot (theme toggle, etc.) */}
        <div className="shrink-0">
          {rightSlot}
        </div>
      </div>
    </header>
  );
}
