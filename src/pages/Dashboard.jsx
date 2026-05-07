import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, AppWindow, Globe, ArrowRight, Copy, Check, Sun, Moon } from 'lucide-react';
import { usePageActions } from '../components/Layout';
import { useTheme } from '../hooks/useTheme';

const CONTACT_EMAIL = 'grace@rosebud.app';

const ITEMS = [
  {
    path: '/design-system',
    icon: Smartphone,
    title: 'Mobile App',
    description:
      'Real react-native-paper components from rosebud-react/apps/native, rendered via react-native-web. Same library and theme as the production iOS/Android app.',
    meta: 'react-native-paper · Live components',
    accent: 'rose',
  },
  {
    path: '/design-system-web',
    icon: AppWindow,
    title: 'Web App',
    description:
      'Real Chakra UI components from rosebud-react/apps/web. Prototypes here translate to prod with almost no rework.',
    meta: 'Chakra UI · Live components',
    accent: 'sage',
  },
  {
    path: '/design-system-website',
    icon: Globe,
    title: 'Website',
    description:
      'Tokens and section patterns from the rosebud.app marketing site — for fast landing-page prototypes.',
    meta: 'Tailwind · Webflow-sourced',
    accent: 'ivory',
  },
];

const ACCENT_BG = {
  rose: 'bg-[#FFE2ED] text-[#A40742]',
  sage: 'bg-[#DDF3EB] text-[#2F7E63]',
  ivory: 'bg-[#FAF3E7] text-[#7A5C28]',
};

const ACCENT_DOT = {
  rose: 'bg-[#E31665]',
  sage: 'bg-[#5ABA9D]',
  ivory: 'bg-[#E4AD51]',
};

function DashboardCard({ item }) {
  const Icon = item.icon;
  const iconCls = ACCENT_BG[item.accent] || ACCENT_BG.rose;
  const dotCls = ACCENT_DOT[item.accent] || ACCENT_DOT.rose;
  return (
    <Link
      to={item.path}
      className="group relative flex flex-col h-full p-[20px] md:p-[24px] rounded-[20px] bg-[var(--color-surface)] border border-[var(--color-outline-light)] hover:border-[var(--color-outline)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)] hover:-translate-y-[2px] transition-all"
    >
      <div className="flex items-start justify-between mb-[14px]">
        <div className={`w-[40px] h-[40px] rounded-[12px] flex items-center justify-center ${iconCls}`}>
          <Icon size={18} strokeWidth={1.8} />
        </div>
        <ArrowRight
          size={18}
          className="text-[var(--color-secondary-text)]/60 group-hover:text-[var(--color-on-surface)] group-hover:translate-x-[3px] transition-all"
        />
      </div>
      <h2 className="text-[19px] md:text-[21px] leading-[24px] md:leading-[26px] font-[700] tracking-[-0.01em] text-[var(--color-on-surface)] mb-[6px]">
        {item.title}
      </h2>
      <p className="text-[13px] leading-[19px] font-[450] text-[var(--color-secondary-text)] mb-[14px]">
        {item.description}
      </p>
      {item.meta && (
        <span className="mt-auto text-[11px] font-[500] tracking-[0.02em] text-[var(--color-secondary-text)]/80">
          {item.meta}
        </span>
      )}
    </Link>
  );
}

export function Dashboard() {
  const [theme, setTheme] = useTheme();
  usePageActions(
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-[8px] rounded-[8px] bg-[var(--color-surface)] border border-[var(--color-outline-light)] text-[var(--color-on-surface)] hover:opacity-80 transition-opacity cursor-pointer"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
    </button>,
    [theme]
  );

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[var(--color-background)] text-[var(--color-on-background)] flex flex-col">
      <div className="relative max-w-[1100px] w-full mx-auto px-[20px] md:px-[24px] pt-[40px] md:pt-[64px] pb-[20px] md:pb-[24px] flex flex-col gap-[28px] md:gap-[40px] flex-1">
        {/* Hero */}
        <div className="flex flex-col items-start">
          <h1 className="text-[32px] md:text-[44px] leading-[36px] md:leading-[50px] font-[700] tracking-[-0.025em] text-[var(--color-on-background)] mb-[10px]">
            Rosebud Design System
          </h1>
          <p className="text-[15px] md:text-[17px] leading-[22px] md:leading-[26px] font-[450] text-[var(--color-secondary-text)] max-w-[640px]">
            A calm, warm visual language for tools that help people grow. Disciplined color, editorial typography, soft organic shapes — one voice across mobile, web, and marketing.
          </p>
        </div>

        {/* 3-col card grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[14px] md:gap-[16px]">
          {ITEMS.map((item) => (
            <DashboardCard key={item.path} item={item} />
          ))}
        </div>

        {/* Footer credit */}
        <DashboardFooter />
      </div>
    </div>
  );
}

function DashboardFooter() {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  };
  return (
    <footer className="mt-auto pt-[24px] text-center text-[12px] leading-[18px] font-[450] text-[var(--color-secondary-text)]/80">
      Designed by Grace Guo · {CONTACT_EMAIL}
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? 'Email copied' : 'Copy email'}
        className="inline-flex items-center align-text-bottom ml-[4px] p-[2px] rounded-[4px] text-[var(--color-secondary-text)]/80 hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-variant)] transition-colors cursor-pointer"
      >
        {copied ? <Check size={11} className="text-[#5ABA9D]" /> : <Copy size={11} />}
      </button>
      {' · '}{new Date().getFullYear()}
    </footer>
  );
}
