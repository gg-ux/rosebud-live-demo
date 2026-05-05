import { Link } from 'react-router-dom';
import { Smartphone, AppWindow, Globe, ArrowUpRight } from 'lucide-react';

const ITEMS = [
  {
    path: '/design-system',
    eyebrow: 'Mobile',
    icon: Smartphone,
    title: 'Design System (Mobile App)',
    description:
      'Tokens, components, and screens for the iOS and Android app — extracted from Figma.',
    meta: 'React Native · Figma-sourced',
    accent: 'rose',
  },
  {
    path: '/design-system-web',
    eyebrow: 'Web App',
    icon: AppWindow,
    title: 'Design System (Web App)',
    description:
      'Real Chakra UI components from rosebud-react/apps/web. Prototypes here translate to prod with almost no rework.',
    meta: 'Chakra UI · Live components',
    accent: 'sage',
  },
  {
    path: '/design-system-website',
    eyebrow: 'Marketing',
    icon: Globe,
    title: 'Design System (Website)',
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
        <ArrowUpRight
          size={18}
          className="text-[#C0C0BF] group-hover:text-[#191C1A] group-hover:-translate-y-[2px] group-hover:translate-x-[2px] transition-all"
        />
      </div>
      <span className="block text-[10px] font-[700] tracking-[0.08em] uppercase text-[#6D6C6A] mb-[8px]">
        {item.eyebrow}
      </span>
      <h2 className="text-[19px] md:text-[21px] leading-[24px] md:leading-[26px] font-[700] tracking-[-0.01em] text-[#191C1A] mb-[6px]">
        {item.title}
      </h2>
      <p className="text-[13px] leading-[19px] font-[450] text-[#6D6C6A] mb-[14px]">
        {item.description}
      </p>
      {item.meta && (
        <span className="mt-auto text-[11px] font-[500] tracking-[0.02em] text-[#6D6C6A]/80">
          {item.meta}
        </span>
      )}
    </Link>
  );
}

export function Dashboard() {
  return (
    <div className="min-h-[calc(100vh-56px)] bg-[var(--color-background)] text-[var(--color-on-background)] flex flex-col">
      <div className="relative max-w-[1100px] w-full mx-auto px-[20px] md:px-[24px] py-[40px] md:py-[64px] flex flex-col gap-[28px] md:gap-[40px] flex-1">
        {/* Hero */}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-[10px] mb-[14px]">
            <img src="/favicon-rosebud.svg" alt="" className="w-[28px] h-[28px]" />
            <span className="text-[15px] font-[700] tracking-[-0.01em] text-[#191C1A]">rosebud</span>
            <span className="w-[3px] h-[3px] rounded-full bg-[#C0C0BF]" />
            <span className="text-[12px] font-[600] tracking-[0.08em] uppercase text-[#6D6C6A]">Design</span>
          </div>
          <h1 className="text-[32px] md:text-[44px] leading-[36px] md:leading-[50px] font-[700] tracking-[-0.025em] text-[#191C1A] mb-[10px]">
            Design systems
          </h1>
          <p className="text-[14px] md:text-[16px] leading-[22px] md:leading-[26px] font-[450] text-[#6D6C6A] max-w-[580px]">
            All three surfaces — mobile, web app, and marketing — in one place. Each page includes a "How to use with Claude" prompt cookbook so anyone can prototype on-brand.
          </p>
        </div>

        {/* 3-col card grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[14px] md:gap-[16px]">
          {ITEMS.map((item) => (
            <DashboardCard key={item.path} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
