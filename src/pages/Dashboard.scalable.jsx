import { Link } from 'react-router-dom';
import { Palette, Sparkles, Blocks, ArrowUpRight } from 'lucide-react';

/* ──────────────────────────────────────────────────────────────────────────
   Dashboard data — scales by appending items to a section.
   Adding a new project = add an entry to `items`. Sections wrap into a
   responsive grid; the layout doesn't change shape with more content.
   ────────────────────────────────────────────────────────────────────────── */

const SECTIONS = [
  {
    id: 'foundation',
    label: 'Foundation',
    description: 'The visual language the product is built on.',
    items: [
      {
        path: '/design-system',
        icon: Palette,
        title: 'Design System',
        summary: 'Color, type, components, and patterns.',
        status: 'In progress',
        updated: 'Updated this week',
        accent: 'rose',
      },
    ],
  },
  {
    id: 'concepts',
    label: 'Concepts',
    description: 'In-progress design explorations and prototypes.',
    items: [
      {
        path: '/tool-calls',
        icon: Sparkles,
        title: 'Tool Calls',
        summary: "How the assistant shows its work without burying the reply.",
        status: 'In review',
        updated: 'Updated today',
        accent: 'sage',
      },
    ],
  },
  {
    id: 'planning',
    label: 'Planning',
    description: 'Proposals and groundwork for what comes next.',
    items: [
      {
        path: '/living-design-system',
        icon: Blocks,
        title: 'Living Design System',
        summary: 'Storybook + react-native-web proposal for design–eng parity.',
        status: 'Proposal',
        updated: 'Drafted this week',
        accent: 'ivory',
      },
    ],
  },
];

const ACCENT = {
  rose: { tile: 'bg-[#FFE2ED] text-[#A40742]', dot: 'bg-[#E31665]' },
  sage: { tile: 'bg-[#DDF3EB] text-[#2F7E63]', dot: 'bg-[#5ABA9D]' },
  ivory: { tile: 'bg-[#FAF3E7] text-[#7A5C28]', dot: 'bg-[#E4AD51]' },
};

const STATUS = {
  Live: 'bg-[#DDF3EB] text-[#2F7E63]',
  'In progress': 'bg-[#E1ECFB] text-[#1F4D8A]',
  'In review': 'bg-[#FFF3D6] text-[#7A5C28]',
  Proposal: 'bg-[#EDEDED] text-[#5A5A5A]',
  Shipped: 'bg-[#DDF3EB] text-[#2F7E63]',
};

function StatusChip({ status }) {
  const cls = STATUS[status] || STATUS.Proposal;
  return (
    <span className={`inline-flex items-center px-[8px] h-[20px] rounded-full text-[10px] leading-[14px] font-[700] tracking-[0.04em] uppercase ${cls}`}>
      {status}
    </span>
  );
}

function ProjectCard({ item }) {
  const Icon = item.icon;
  const accent = ACCENT[item.accent] || ACCENT.rose;
  return (
    <Link
      to={item.path}
      className="group relative flex flex-col h-full p-[20px] rounded-[16px] bg-[var(--color-surface)] border border-[var(--color-outline-light)] hover:border-[var(--color-outline)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)] hover:-translate-y-[2px] transition-all"
    >
      <div className="flex items-start justify-between mb-[14px]">
        <div className={`w-[36px] h-[36px] rounded-[10px] flex items-center justify-center ${accent.tile}`}>
          <Icon size={17} strokeWidth={1.8} />
        </div>
        <StatusChip status={item.status} />
      </div>
      <h3 className="text-[17px] leading-[22px] font-[700] tracking-[-0.01em] text-[var(--color-on-background)] mb-[6px]">
        {item.title}
      </h3>
      <p className="text-[13px] leading-[19px] font-[450] text-[var(--color-secondary-text)] mb-[16px]">
        {item.summary}
      </p>
      <div className="mt-auto flex items-center justify-between gap-[8px]">
        <div className="flex items-center gap-[6px] text-[11px] leading-[14px] font-[500] text-[var(--color-secondary-text)]/80">
          <span className={`w-[5px] h-[5px] rounded-full ${accent.dot}`} />
          {item.updated}
        </div>
        <ArrowUpRight
          size={16}
          className="text-[var(--color-secondary-text)]/60 group-hover:text-[var(--color-on-background)] group-hover:-translate-y-[1px] group-hover:translate-x-[1px] transition-all"
        />
      </div>
    </Link>
  );
}

function SectionHeader({ label, description, count }) {
  return (
    <div className="flex items-end justify-between gap-[16px] mb-[16px] pb-[12px] border-b border-[var(--color-outline-light)]">
      <div>
        <div className="flex items-baseline gap-[10px] mb-[4px]">
          <h2 className="text-[20px] leading-[26px] font-[700] tracking-[-0.01em] text-[var(--color-on-background)]">
            {label}
          </h2>
          <span className="text-[12px] font-[500] text-[var(--color-secondary-text)]">
            {count}
          </span>
        </div>
        <p className="text-[13px] leading-[19px] font-[450] text-[var(--color-secondary-text)]">{description}</p>
      </div>
    </div>
  );
}

function StatPill({ value, label, accentClass }) {
  return (
    <div className="flex items-center gap-[8px] px-[14px] py-[10px] rounded-[12px] bg-[var(--color-surface)] border border-[var(--color-outline-light)]">
      <span className={`w-[6px] h-[6px] rounded-full ${accentClass}`} />
      <span className="text-[18px] leading-[20px] font-[700] tracking-[-0.01em] text-[var(--color-on-background)]">{value}</span>
      <span className="text-[12px] font-[500] text-[var(--color-secondary-text)]">{label}</span>
    </div>
  );
}

export function Dashboard() {
  const totalProjects = SECTIONS.reduce((sum, s) => sum + s.items.length, 0);
  const inReviewCount = SECTIONS
    .flatMap((s) => s.items)
    .filter((i) => i.status === 'In review').length;
  const proposalCount = SECTIONS
    .flatMap((s) => s.items)
    .filter((i) => i.status === 'Proposal').length;

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[var(--color-background)] text-[var(--color-on-background)]">
      <div className="max-w-[1200px] w-full mx-auto px-[20px] md:px-[32px] py-[36px] md:py-[48px] flex flex-col gap-[40px] md:gap-[48px]">
        {/* Hero — brand strip + title + stats */}
        <header className="flex flex-col gap-[24px]">
          <div className="flex items-center gap-[10px]">
            <img src="/favicon-rosebud.svg" alt="" className="w-[24px] h-[24px]" />
            <span className="text-[14px] font-[700] tracking-[-0.01em] text-[var(--color-on-background)]">rosebud</span>
            <span className="w-[3px] h-[3px] rounded-full bg-[#C0C0BF]" />
            <span className="text-[11px] font-[700] tracking-[0.08em] uppercase text-[var(--color-secondary-text)]">Design</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-[24px]">
            <div>
              <h1 className="text-[34px] md:text-[44px] leading-[40px] md:leading-[52px] font-[700] tracking-[-0.025em] text-[var(--color-on-background)] mb-[10px]">
                Design workspace
              </h1>
              <p className="text-[15px] md:text-[16px] leading-[24px] font-[450] text-[var(--color-secondary-text)] max-w-[560px]">
                System, in-progress concepts, and proposals — built in code so they grow alongside the product.
              </p>
            </div>

            {/* Stat row — useful metrics, scales with content */}
            <div className="flex flex-wrap gap-[10px]">
              <StatPill value={totalProjects} label="projects" accentClass="bg-[#191C1A]" />
              <StatPill value={inReviewCount} label="in review" accentClass="bg-[#E4AD51]" />
              <StatPill value={proposalCount} label="proposals" accentClass="bg-[#5ABA9D]" />
            </div>
          </div>
        </header>

        {/* Sections — each scales independently */}
        {SECTIONS.map((section) => (
          <section key={section.id}>
            <SectionHeader
              label={section.label}
              description={section.description}
              count={`${section.items.length} ${section.items.length === 1 ? 'project' : 'projects'}`}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[14px] md:gap-[16px]">
              {section.items.map((item) => (
                <ProjectCard key={item.path} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
