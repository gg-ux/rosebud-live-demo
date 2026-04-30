import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { usePageActions, useHeaderCenter } from '../components/Layout';
import { PodcastPlayer } from '../components/PodcastPlayer';

function GithubMark({ size = 13 }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden="true">
      <path d="M12 .5a11.5 11.5 0 0 0-3.63 22.41c.57.1.78-.25.78-.55v-2c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.74 2.68 1.24 3.34.95.1-.74.4-1.24.73-1.53-2.55-.29-5.23-1.27-5.23-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.17a10.96 10.96 0 0 1 5.74 0c2.19-1.48 3.15-1.17 3.15-1.17.62 1.59.23 2.76.11 3.05.74.8 1.18 1.82 1.18 3.07 0 4.4-2.68 5.36-5.24 5.65.41.36.78 1.06.78 2.13v3.16c0 .31.21.66.79.55A11.5 11.5 0 0 0 12 .5z"/>
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Living Design System — proposal page
   Audience: rosebud-react engineers
   Goal: explain the Storybook + react-native-web proposal in a way that's
         scannable, not overwhelming. Sub-sidebar nav, tabbed component
         triage, collapsible FAQ.
   ────────────────────────────────────────────────────────────────────────── */

const REPO_URL = 'https://github.com/Rising-Tide-Org/rosebud-react';
const FIGMA_URL = 'https://www.figma.com/design/DybhAvDdUTWFHOEoSdmAFH/Rosebud-Design-System';

const SECTIONS = [
  { id: 'tldr', label: 'TL;DR' },
  { id: 'storybook', label: 'What is Storybook?' },
  { id: 'proposal', label: 'The proposal' },
  { id: 'workflow', label: 'Designer workflow' },
  { id: 'where', label: 'Where prototypes live' },
  { id: 'lifecycle', label: 'Adding & modifying' },
  { id: 'claude-workflow', label: 'Designer + Claude Code' },
  { id: 'business', label: 'Business impact' },
  { id: 'why', label: 'Why this fits us' },
  { id: 'components', label: 'Component triage' },
  { id: 'changes', label: 'What changes' },
  { id: 'rollout', label: 'Rollout' },
  { id: 'faq', label: 'FAQ' },
];

/* ── Typography primitives ── */

function Eyebrow({ children, color = 'secondary' }) {
  const colorClass = color === 'sage'
    ? 'text-[var(--color-sage-green-600)]'
    : 'text-[var(--color-secondary-text)]';
  return (
    <span className={`inline-block text-[11px] font-[700] tracking-[0.08em] uppercase ${colorClass} mb-[12px]`}>
      {children}
    </span>
  );
}

function H1({ children }) {
  return (
    <h1 className="text-[32px] md:text-[44px] leading-[38px] md:leading-[50px] font-[700] tracking-[-0.025em] text-[var(--color-on-background)] mb-[16px]">
      {children}
    </h1>
  );
}

function H2({ children }) {
  return (
    <h2 className="text-[22px] md:text-[28px] leading-[28px] md:leading-[36px] font-[700] tracking-[-0.02em] text-[var(--color-on-background)] mb-[12px]">
      {children}
    </h2>
  );
}

function H3({ children }) {
  return (
    <h3 className="text-[15px] leading-[22px] font-[700] text-[var(--color-on-background)] mb-[6px]">
      {children}
    </h3>
  );
}

function Body({ children, size = 'md' }) {
  const sizeClass = size === 'lg'
    ? 'text-[16px] leading-[26px]'
    : 'text-[14px] leading-[22px]';
  return (
    <p className={`${sizeClass} font-[450] text-[var(--color-secondary-text)]`}>
      {children}
    </p>
  );
}

function Code({ children }) {
  return (
    <code className="px-[6px] py-[1px] rounded-[4px] bg-[var(--color-surface-variant)] text-[13px] leading-[18px] font-[500] text-[var(--color-on-background)] border border-[var(--color-outline-light)]">
      {children}
    </code>
  );
}

/* ── Page-specific sub-sidebar (sticky) ── */

function PageSidebar({ active, onJump }) {
  return (
    <aside className="hidden lg:block sticky top-[80px] self-start w-[200px] shrink-0">
      <div className="text-[10px] font-[700] tracking-[0.1em] uppercase text-[var(--color-secondary-text)]/60 mb-[10px] px-[10px]">
        On this page
      </div>
      <nav className="flex flex-col gap-[2px]">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => onJump(s.id)}
            className={`text-left px-[10px] py-[6px] rounded-[8px] text-[13px] leading-[18px] font-[500] transition-colors cursor-pointer ${
              active === s.id
                ? 'bg-[var(--color-background)] text-[var(--color-on-background)] font-[600]'
                : 'text-[var(--color-secondary-text)] hover:bg-[var(--color-surface-variant)] hover:text-[var(--color-on-background)]'
            }`}
          >
            {s.label}
          </button>
        ))}
      </nav>
      <div className="mt-[20px] mx-[10px] pt-[16px] border-t border-[var(--color-outline-light)]">
        <a
          href={REPO_URL}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-[6px] text-[12px] leading-[16px] font-[500] text-[var(--color-secondary-text)] hover:text-[var(--color-on-background)] transition-colors"
        >
          <GithubMark size={13} />
          rosebud-react
          <ExternalLink size={11} />
        </a>
        <a
          href={FIGMA_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-[8px] flex items-center gap-[6px] text-[12px] leading-[16px] font-[500] text-[var(--color-secondary-text)] hover:text-[var(--color-on-background)] transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-[12px] h-[12px]">
            <path d="M8 24a4 4 0 0 0 4-4v-4H8a4 4 0 0 0 0 8zM4 12a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4zM4 4a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4zM12 0h4a4 4 0 0 1 0 8h-4V0zM20 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
          </svg>
          Rosebud Design System (Figma)
          <ExternalLink size={11} />
        </a>
      </div>
    </aside>
  );
}

/* ── Pill / stat / callout primitives ── */

function StatCard({ value, label, color = 'sage' }) {
  const colorMap = {
    sage: 'text-[var(--color-sage-green-600)]',
    rose: 'text-[var(--color-rose-pink-500)]',
    charcoal: 'text-[var(--color-on-background)]',
    ivory: 'text-[var(--color-soft-ivory-700)]',
  };
  return (
    <div className="flex-1 min-w-[140px] p-[20px] rounded-[12px] bg-[var(--color-surface)] border border-[var(--color-outline-light)]">
      <div className={`text-[36px] leading-[42px] font-[700] tracking-[-0.02em] mb-[6px] ${colorMap[color]}`}>
        {value}
      </div>
      <div className="text-[12px] leading-[16px] font-[500] text-[var(--color-secondary-text)]">
        {label}
      </div>
    </div>
  );
}

function Pill({ children, tone = 'neutral' }) {
  const toneMap = {
    neutral: 'bg-[var(--color-surface-variant)] text-[var(--color-on-background)] border-[var(--color-outline-light)]',
    sage: 'bg-[var(--color-sage-green-50)] text-[var(--color-sage-green-900)] border-[var(--color-sage-green-200)]',
    rose: 'bg-[var(--color-rose-pink-50)] text-[var(--color-rose-pink-700)] border-[var(--color-rose-pink-200)]',
    ivory: 'bg-[var(--color-soft-ivory-50)] text-[var(--color-soft-ivory-900)] border-[var(--color-soft-ivory-200)]',
  };
  return (
    <span className={`inline-flex items-center gap-[4px] px-[8px] py-[2px] rounded-full text-[11px] leading-[16px] font-[600] border ${toneMap[tone]}`}>
      {children}
    </span>
  );
}

/* ── Diagram: native source → storybook → web URL ── */

function FlowDiagram() {
  const Box = ({ title, sub, tone = 'neutral' }) => {
    const toneMap = {
      neutral: 'bg-[var(--color-surface)] border-[var(--color-outline-light)]',
      sage: 'bg-[var(--color-sage-green-50)] border-[var(--color-sage-green-200)]',
      ivory: 'bg-[var(--color-soft-ivory-50)] border-[var(--color-soft-ivory-200)]',
    };
    return (
      <div className={`flex-1 min-w-[140px] p-[14px] rounded-[10px] border ${toneMap[tone]}`}>
        <div className="text-[13px] leading-[18px] font-[700] text-[var(--color-on-background)] mb-[2px]">{title}</div>
        <div className="text-[11px] leading-[15px] font-[450] text-[var(--color-secondary-text)]">{sub}</div>
      </div>
    );
  };

  const Arrow = () => (
    <div className="hidden md:flex items-center justify-center w-[32px] shrink-0 text-[var(--color-secondary-text)]">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="13 6 19 12 13 18" />
      </svg>
    </div>
  );

  return (
    <div className="my-[20px] p-[20px] rounded-[14px] bg-[var(--color-background)] border border-[var(--color-outline-light)]">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-[10px]">
        <Box
          title="apps/native/src/components/"
          sub="69 production RN components — unchanged"
          tone="ivory"
        />
        <Arrow />
        <Box
          title="apps/storybook/"
          sub="New workspace. Stories + .web shims for native modules"
          tone="sage"
        />
        <Arrow />
        <Box
          title="rosebud-storybook.vercel.app"
          sub="Auto-deployed per PR. Designers see live components."
        />
      </div>
      <div className="mt-[14px] text-[11px] leading-[16px] font-[450] text-[var(--color-secondary-text)] italic">
        Source of truth stays in <Code>apps/native</Code>. Storybook reads, never writes.
      </div>
    </div>
  );
}

/* ── Component triage tabs ── */

const COMPONENT_BUCKETS = {
  pure: {
    label: 'Pure',
    count: '~40',
    pillTone: 'sage',
    description: "Only imports react-native, react-native-paper, theme tokens, and animation libs that already have web builds. Works out of the box once react-native-web is aliased.",
    examples: [
      'Button', 'ItemCard', 'FormTextInput', 'NumberSelector',
      'EmptyContentCard', 'Tag', 'Pill', 'SegmentedControl',
      'Header', 'Markdown', 'Charts', 'DotIndicator',
      'CountdownTimer', 'ChevronButton', 'FadeGradient',
    ],
    action: 'Write .stories.tsx, ship.',
  },
  soft: {
    label: 'Soft-coupled',
    count: '~15-20',
    pillTone: 'ivory',
    description: "Imports one or more native-only Expo modules with obvious web equivalents (haptics → no-op, expo-image → <img>, linear-gradient → CSS gradient).",
    examples: [
      'BiometricUpsell (uses haptics)',
      'ButtonSheen (uses linear-gradient)',
      'ImageWithLoader (uses expo-image)',
      'Anything with sonner-native toasts',
      'Components using @react-native-masked-view',
    ],
    action: 'Write a .web.tsx shim per native module. Each shim is ~10 lines.',
  },
  hard: {
    label: 'Hard-coupled',
    count: '~10-15',
    pillTone: 'rose',
    description: "Touches camera, biometrics, health data, in-app purchases, push notifications, or other APIs with no meaningful web equivalent.",
    examples: [
      'BiometricProtectionOverlay',
      'BiometricSettingsPrompt',
      'CacheService (touches native filesystem)',
      'Components using react-native-health',
      'Components using react-native-purchases',
    ],
    action: 'Skip in v1. Show "Native-only" placeholder story, or stub with fixture data.',
  },
};

function ComponentTriage() {
  const [tab, setTab] = useState('pure');
  const bucket = COMPONENT_BUCKETS[tab];

  return (
    <div className="mt-[20px] rounded-[14px] bg-[var(--color-surface)] border border-[var(--color-outline-light)] overflow-hidden">
      <div className="flex border-b border-[var(--color-outline-light)]">
        {Object.entries(COMPONENT_BUCKETS).map(([key, b]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 px-[16px] py-[14px] text-left transition-colors cursor-pointer border-r border-[var(--color-outline-light)] last:border-r-0 ${
              tab === key
                ? 'bg-[var(--color-background)]'
                : 'hover:bg-[var(--color-surface-variant)]'
            }`}
          >
            <div className="flex items-center gap-[8px] mb-[2px]">
              <Pill tone={b.pillTone}>{b.count}</Pill>
              <span className={`text-[13px] leading-[18px] font-[600] ${tab === key ? 'text-[var(--color-on-background)]' : 'text-[var(--color-secondary-text)]'}`}>
                {b.label}
              </span>
            </div>
          </button>
        ))}
      </div>
      <div className="p-[20px]">
        <Body>{bucket.description}</Body>
        <div className="mt-[16px]">
          <div className="text-[11px] font-[700] tracking-[0.08em] uppercase text-[var(--color-secondary-text)] mb-[8px]">
            Examples from your repo
          </div>
          <div className="flex flex-wrap gap-[6px]">
            {bucket.examples.map((ex) => (
              <span
                key={ex}
                className="px-[8px] py-[3px] rounded-[6px] bg-[var(--color-surface-variant)] border border-[var(--color-outline-light)] text-[12px] leading-[16px] font-[500] text-[var(--color-on-background)]"
              >
                {ex}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-[16px] p-[12px] rounded-[8px] bg-[var(--color-background)] border border-[var(--color-outline-light)]">
          <div className="text-[11px] font-[700] tracking-[0.08em] uppercase text-[var(--color-secondary-text)] mb-[4px]">
            What we do
          </div>
          <div className="text-[13px] leading-[19px] font-[500] text-[var(--color-on-background)]">
            {bucket.action}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── What changes / what doesn't ── */

function ChangeMatrix() {
  const Row = ({ what, doesnt = false }) => (
    <div className="flex items-start gap-[10px] py-[10px] border-b border-[var(--color-outline-light)] last:border-b-0">
      <div className={`mt-[2px] shrink-0 w-[16px] h-[16px] rounded-full flex items-center justify-center ${
        doesnt
          ? 'bg-[var(--color-sage-green-100)] text-[var(--color-sage-green-700)]'
          : 'bg-[var(--color-soft-ivory-100)] text-[var(--color-soft-ivory-800)]'
      }`}>
        {doesnt ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-[10px] h-[10px]">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[9px] h-[9px]">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        )}
      </div>
      <span className="text-[14px] leading-[20px] font-[500] text-[var(--color-on-background)]">{what}</span>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] mt-[20px]">
      <div className="p-[20px] rounded-[14px] bg-[var(--color-surface)] border border-[var(--color-outline-light)]">
        <div className="flex items-center gap-[8px] mb-[8px]">
          <Pill tone="ivory">New</Pill>
          <span className="text-[13px] font-[700] text-[var(--color-on-background)]">What changes</span>
        </div>
        <div>
          <Row what="New apps/storybook workspace gets added" />
          <Row what="Vercel project deploys it on every PR" />
          <Row what="Eng adds .web.tsx shim when touching coupled components" />
          <Row what="Stories file added when you ship a new component" />
        </div>
      </div>
      <div className="p-[20px] rounded-[14px] bg-[var(--color-surface)] border border-[var(--color-outline-light)]">
        <div className="flex items-center gap-[8px] mb-[8px]">
          <Pill tone="sage">Same</Pill>
          <span className="text-[13px] font-[700] text-[var(--color-on-background)]">What doesn't change</span>
        </div>
        <div>
          <Row doesnt what="apps/native — zero edits required" />
          <Row doesnt what="Existing component files stay as they are" />
          <Row doesnt what="Theme tokens, react-native-paper, Expo SDK" />
          <Row doesnt what="apps/web (Chakra) — completely independent" />
          <Row doesnt what="Build pipeline, tests, releases" />
        </div>
      </div>
    </div>
  );
}

/* ── Rollout phases ── */

function Rollout() {
  const phases = [
    { num: '1', name: 'Setup', time: '1 day', detail: 'Scaffold apps/storybook, get Button rendering on web' },
    { num: '2', name: 'Triage', time: '½ day', detail: 'Run grep script → bucket all 69 components → confirm v1 scope with eng' },
    { num: '3', name: 'Pure stories', time: '1-2 days', detail: 'Generate stories for ~40 pure components (mostly templated)' },
    { num: '4', name: 'Shims', time: '2-3 days', detail: 'Write ~15 .web.tsx shims for soft-coupled components' },
    { num: '5', name: 'Deploy', time: '½ day', detail: 'Vercel hookup + GH Action for per-PR previews' },
    { num: '6', name: 'Hard-coupled', time: 'TBD', detail: 'Defer or stub with fixtures — decide based on demand' },
  ];

  return (
    <div className="mt-[20px]">
      <div className="rounded-[14px] bg-[var(--color-surface)] border border-[var(--color-outline-light)] overflow-hidden">
        {phases.map((p, i) => (
          <div
            key={p.num}
            className={`flex items-start gap-[16px] p-[16px] ${
              i < phases.length - 1 ? 'border-b border-[var(--color-outline-light)]' : ''
            }`}
          >
            <div className="shrink-0 w-[28px] h-[28px] rounded-full bg-[var(--color-sage-green-100)] text-[var(--color-sage-green-800)] flex items-center justify-center text-[13px] font-[700]">
              {p.num}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-[12px] mb-[2px]">
                <span className="text-[14px] leading-[20px] font-[700] text-[var(--color-on-background)]">{p.name}</span>
                <span className="shrink-0 text-[11px] font-[600] text-[var(--color-secondary-text)] tracking-[0.04em] uppercase">{p.time}</span>
              </div>
              <Body>{p.detail}</Body>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-[12px] text-[12px] leading-[18px] font-[450] text-[var(--color-secondary-text)] italic">
        End state by end of week 1: ~55 production RN components live at a stable web URL with a per-PR preview link.
      </div>
    </div>
  );
}

/* ── FAQ ── */

const FAQ_ITEMS = [
  {
    q: 'Are you asking us to rewrite components?',
    a: "No. The Storybook package only imports your existing component files. The only edits to apps/native would be voluntary — e.g. if you want to extract a hook for testability. Default path: zero changes to apps/native.",
  },
  {
    q: "Won't this drift from production?",
    a: "Stories live in apps/storybook but import from apps/native. If a component is renamed, deleted, or its props change, Storybook breaks loudly in CI. The drift surface is just the .stories.tsx files (which are scoped) and the .web.tsx shims (which are tiny).",
  },
  {
    q: "What's the maintenance burden per new component?",
    a: "One .stories.tsx file (~20 lines, mostly variant/state tables). If the component touches a new native module, one .web.tsx shim (~10 lines). Most new components add only the story.",
  },
  {
    q: 'Why not just point designers at the iOS simulator?',
    a: "Three reasons: (1) designers without a Mac dev env can't access it, (2) simulators can't be linked, screenshotted programmatically, or embedded in mockups, (3) no per-PR preview URL means design review happens after merge instead of in the PR.",
  },
  {
    q: 'How does this relate to react-native-paper?',
    a: "Doesn't conflict. Paper has a web build that works under react-native-web. The Button wrapper at apps/native/src/components/Button.tsx will render with its real Paper-based styling on the web Storybook.",
  },
  {
    q: 'How does this relate to paper.design (the design tool)?',
    a: "Different problem. Paper.design is HTML/CSS-only and would help apps/web (currently Chakra). Storybook+RNW handles the native catalog. The two could coexist — Paper for new web design, Storybook for surfacing existing native components.",
  },
  {
    q: 'What about apps/web?',
    a: "Out of scope for v1. apps/web uses Chakra and doesn't share components with native today. If we ever want a shared design system across web + native, this Storybook becomes the staging ground for that conversation — but it's not a prerequisite.",
  },
  {
    q: "What's the first thing I'd notice as an engineer?",
    a: "When you open a PR that touches a component, Vercel posts a preview URL in the PR. Click it, see your component rendering on web with all variants. Reviewers (including designers) can see the change without checking out the branch.",
  },
];

function FaqItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[var(--color-outline-light)] last:border-b-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-start gap-[10px] py-[14px] text-left cursor-pointer group"
      >
        <ChevronRight
          size={14}
          className={`mt-[3px] shrink-0 text-[var(--color-secondary-text)] transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
        />
        <span className="flex-1 text-[14px] leading-[22px] font-[600] text-[var(--color-on-background)] group-hover:text-[var(--color-sage-green-700)] transition-colors">
          {item.q}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-[14px] pl-[24px] pr-[8px]">
              <Body>{item.a}</Body>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Storybook examples grid ── */

const STORYBOOK_EXAMPLES = [
  {
    org: 'GitHub',
    system: 'Primer',
    description: 'The design system powering all of github.com — used by 100M+ developers.',
    url: 'https://primer.style/components/button',
    accent: '#1F2328',
  },
  {
    org: 'Atlassian',
    system: 'Atlassian Design System',
    description: 'The system behind Jira, Confluence, and Trello.',
    url: 'https://atlassian.design/components/button/examples',
    accent: '#0052CC',
  },
  {
    org: 'IBM',
    system: 'Carbon',
    description: "IBM's open-source design system used across their product portfolio.",
    url: 'https://carbondesignsystem.com/components/button/usage',
    accent: '#0F62FE',
  },
  {
    org: 'Adobe',
    system: 'Spectrum',
    description: 'The design system behind Photoshop, Lightroom, Illustrator, and Creative Cloud.',
    url: 'https://spectrum.adobe.com/page/button/',
    accent: '#FA0F00',
  },
];

function StorybookExamples() {
  return (
    <div className="mt-[20px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[12px]">
      {STORYBOOK_EXAMPLES.map((ex) => (
        <a
          key={ex.org}
          href={ex.url}
          target="_blank"
          rel="noreferrer"
          className="group block p-[20px] rounded-[14px] bg-[var(--color-surface)] border border-[var(--color-outline-light)] hover:border-[var(--color-on-background)] transition-colors relative overflow-hidden"
          style={{ borderTopColor: ex.accent, borderTopWidth: 3 }}
        >
          <div
            className="text-[10px] font-[700] tracking-[0.1em] uppercase mb-[6px]"
            style={{ color: ex.accent }}
          >
            {ex.org}
          </div>
          <div className="flex items-start justify-between gap-[8px] mb-[6px]">
            <span className="text-[15px] leading-[20px] font-[700] text-[var(--color-on-background)]">
              {ex.system}
            </span>
            <ExternalLink size={12} className="shrink-0 mt-[4px] text-[var(--color-secondary-text)] group-hover:text-[var(--color-on-background)] transition-colors" />
          </div>
          <p className="text-[12px] leading-[17px] font-[450] text-[var(--color-secondary-text)]">
            {ex.description}
          </p>
          <div className="mt-[10px] text-[10px] leading-[14px] font-[500] text-[var(--color-secondary-text)] group-hover:text-[var(--color-on-background)] transition-colors truncate">
            {ex.url.replace(/^https?:\/\//, '')}
          </div>
        </a>
      ))}
    </div>
  );
}

function NativeCallout() {
  return (
    <div className="mt-[28px] p-[20px] rounded-[14px] bg-[var(--color-sage-green-50)]/40 border border-[var(--color-sage-green-200)]">
      <div className="flex items-center gap-[8px] mb-[10px]">
        <Pill tone="sage">For native specifically</Pill>
      </div>
      <H3>"OK, but does it work for native apps too?"</H3>
      <Body>
        Yes — with one honest caveat. Public Storybooks for shipped native apps are rare because most iOS and Android apps are closed-source (you can't browse Uber's iOS Storybook because Uber's iOS app isn't open source). What <em>is</em> public are <em>component libraries</em> built for React Native that publish their own browseable catalogs. The cleanest live example uses the exact same technical pattern this proposal does.
      </Body>
      <a
        href="https://gluestack.io/ui/docs/components/button"
        target="_blank"
        rel="noreferrer"
        className="group mt-[16px] block p-[16px] rounded-[12px] bg-[var(--color-surface)] border border-[var(--color-outline-light)] hover:border-[var(--color-on-background)] transition-colors"
        style={{ borderLeftColor: '#18181B', borderLeftWidth: 3 }}
      >
        <div className="flex items-center gap-[8px] mb-[6px] flex-wrap">
          <span className="text-[10px] font-[700] tracking-[0.1em] uppercase" style={{ color: '#18181B' }}>
            Gluestack UI
          </span>
          <Pill tone="sage">Same react-native-web pattern</Pill>
        </div>
        <div className="flex items-start justify-between gap-[8px] mb-[6px]">
          <span className="text-[15px] leading-[20px] font-[700] text-[var(--color-on-background)]">
            React Native components, live in the browser
          </span>
          <ExternalLink size={12} className="shrink-0 mt-[4px] text-[var(--color-secondary-text)] group-hover:text-[var(--color-on-background)] transition-colors" />
        </div>
        <p className="text-[12px] leading-[17px] font-[450] text-[var(--color-secondary-text)]">
          Gluestack is a universal RN+web design system. Their docs render real React Native components in your browser using react-native-web — the exact technical pattern this proposal uses. Hover, click, change variants, see them animate. This is genuinely what Rosebud's Living Design System would look and feel like, just with Rosebud-specific components.
        </p>
        <div className="mt-[10px] text-[10px] leading-[14px] font-[500] text-[var(--color-secondary-text)] group-hover:text-[var(--color-on-background)] transition-colors truncate">
          gluestack.io/ui/docs/components/button
        </div>
      </a>
    </div>
  );
}

function RNToWebTranslator() {
  const mappings = [
    { rn: '<View>', web: '<div>', what: 'Container' },
    { rn: '<Text>', web: '<span>', what: 'Text' },
    { rn: '<Pressable>', web: '<button>', what: 'Tap target' },
    { rn: '<Image>', web: '<img>', what: 'Image' },
    { rn: '<ScrollView>', web: '<div> (scrollable)', what: 'Scroll area' },
  ];
  return (
    <div className="mt-[28px] p-[20px] rounded-[14px] bg-[var(--color-surface)] border border-[var(--color-outline-light)]">
      <div className="flex items-center gap-[8px] mb-[10px]">
        <Pill tone="neutral">Plain-English explainer</Pill>
      </div>
      <H3>"But how does React Native code render in a browser?"</H3>
      <Body>
        A library called <Code>react-native-web</Code> acts as a translator. React Native's building blocks get auto-converted to their web equivalents — no rewrites required. About 80% of your components use only these primitives, so they work as-is.
      </Body>
      <div className="mt-[16px] rounded-[10px] bg-[var(--color-background)] border border-[var(--color-outline-light)] overflow-hidden">
        <div className="grid grid-cols-[1fr_24px_1fr_1fr] text-[10px] font-[700] tracking-[0.08em] uppercase text-[var(--color-secondary-text)] border-b border-[var(--color-outline-light)]">
          <div className="px-[14px] py-[8px]">React Native</div>
          <div className="px-[8px] py-[8px]"></div>
          <div className="px-[14px] py-[8px] border-l border-[var(--color-outline-light)]">Web</div>
          <div className="px-[14px] py-[8px] border-l border-[var(--color-outline-light)]">What it is</div>
        </div>
        {mappings.map((m, i) => (
          <div key={m.rn} className={`grid grid-cols-[1fr_24px_1fr_1fr] text-[12px] leading-[18px] ${i < mappings.length - 1 ? 'border-b border-[var(--color-outline-light)]' : ''}`}>
            <div className="px-[14px] py-[10px] font-mono font-[500] text-[var(--color-on-background)]">{m.rn}</div>
            <div className="px-[4px] py-[10px] flex items-center justify-center text-[var(--color-secondary-text)]">→</div>
            <div className="px-[14px] py-[10px] font-mono font-[500] text-[var(--color-sage-green-700)] border-l border-[var(--color-outline-light)]">{m.web}</div>
            <div className="px-[14px] py-[10px] font-[450] text-[var(--color-secondary-text)] border-l border-[var(--color-outline-light)]">{m.what}</div>
          </div>
        ))}
      </div>
      <p className="mt-[14px] text-[12px] leading-[18px] font-[450] italic text-[var(--color-secondary-text)]">
        For the other ~20% (camera, biometrics, push notifications, in-app purchases), we write tiny ~10-line "web pretend" files called shims. The component file itself stays the same — the same <Code>Button.tsx</Code> renders on iOS, Android, and web.
      </p>
    </div>
  );
}

/* ── Designer workflow comparison ── */

function WorkflowComparison() {
  const today = [
    'Eyeball measurements off app screenshots and rebuild the component as a Figma frame.',
    "Design new screens with approximations of production. Spec colors, paddings, states by hand.",
    'Hand off via Figma comments + Slack screenshots. Engineer interprets the spec.',
    'Engineer ships. Designer reviews via simulator screenshot or pulls the branch on a Mac.',
    "Iterate over screenshot ping-pong. Sometimes the round trip catches a token mismatch nobody noticed.",
    "Months later, the Figma file becomes 'the version we tried in March.' Drift compounds.",
  ];
  const withIt = [
    "Open the design system URL. Find the production component you need — props, variants, states, dark mode, all live.",
    'Compose the new screen as a code-based prototype using the real components.',
    'Share the prototype URL. Engineer ships the same composition — no interpretation gap.',
    'Design review happens in the per-PR preview link. Same browser, same artifact, no setup.',
    "If the design needs a new component, the gap is visible immediately — no quiet drift.",
    'Source of truth lives in code. Figma references it, not the other way around.',
  ];

  const Step = ({ num, text, tone }) => (
    <li className="flex gap-[10px] py-[8px] border-b border-[var(--color-outline-light)] last:border-b-0">
      <div className={`shrink-0 w-[20px] h-[20px] rounded-full flex items-center justify-center text-[11px] font-[700] ${
        tone === 'today'
          ? 'bg-[var(--color-soft-ivory-100)] text-[var(--color-soft-ivory-800)]'
          : 'bg-[var(--color-sage-green-100)] text-[var(--color-sage-green-800)]'
      }`}>
        {num}
      </div>
      <div className="flex-1 text-[13px] leading-[19px] font-[450] text-[var(--color-on-background)]">{text}</div>
    </li>
  );

  return (
    <div className="mt-[20px] grid grid-cols-1 md:grid-cols-2 gap-[16px]">
      <div className="p-[20px] rounded-[14px] bg-[var(--color-surface)] border border-[var(--color-outline-light)]">
        <div className="flex items-center gap-[8px] mb-[12px]">
          <Pill tone="ivory">Today</Pill>
          <span className="text-[13px] font-[700] text-[var(--color-on-background)]">The handoff loop now</span>
        </div>
        <ol className="flex flex-col">
          {today.map((t, i) => <Step key={i} num={i + 1} text={t} tone="today" />)}
        </ol>
      </div>
      <div className="p-[20px] rounded-[14px] bg-[var(--color-sage-green-50)]/40 border border-[var(--color-sage-green-200)]">
        <div className="flex items-center gap-[8px] mb-[12px]">
          <Pill tone="sage">With Living Design System</Pill>
          <span className="text-[13px] font-[700] text-[var(--color-on-background)]">The handoff becomes</span>
        </div>
        <ol className="flex flex-col">
          {withIt.map((t, i) => <Step key={i} num={i + 1} text={t} tone="with" />)}
        </ol>
      </div>
    </div>
  );
}

function HandoffCallout() {
  const items = [
    {
      label: 'Translation gap',
      today: 'Figma frame → engineer interprets → React Native code',
      after: 'Designer composes with real components → engineer ships the composition',
    },
    {
      label: 'Where review happens',
      today: 'Slack threads, screenshots, simulator builds',
      after: 'Per-PR preview URL — same artifact for design and code review',
    },
    {
      label: 'Source of truth',
      today: 'Figma drifts from code over months',
      after: 'Code is canonical. Figma can reference it.',
    },
    {
      label: 'New designer onboarding',
      today: 'Tribal knowledge + outdated Figma file',
      after: 'One URL shows the entire component vocabulary',
    },
  ];
  return (
    <div className="mt-[20px] rounded-[14px] bg-[var(--color-surface)] border border-[var(--color-outline-light)] overflow-hidden">
      <div className="grid grid-cols-[1fr_1fr_1fr] text-[11px] font-[700] tracking-[0.08em] uppercase text-[var(--color-secondary-text)] border-b border-[var(--color-outline-light)]">
        <div className="px-[16px] py-[10px]">Friction point</div>
        <div className="px-[16px] py-[10px] border-l border-[var(--color-outline-light)]">Today</div>
        <div className="px-[16px] py-[10px] border-l border-[var(--color-outline-light)] bg-[var(--color-sage-green-50)]/30">After</div>
      </div>
      {items.map((it, i) => (
        <div
          key={it.label}
          className={`grid grid-cols-[1fr_1fr_1fr] text-[13px] leading-[19px] ${
            i < items.length - 1 ? 'border-b border-[var(--color-outline-light)]' : ''
          }`}
        >
          <div className="px-[16px] py-[12px] font-[600] text-[var(--color-on-background)]">{it.label}</div>
          <div className="px-[16px] py-[12px] font-[450] text-[var(--color-secondary-text)] border-l border-[var(--color-outline-light)]">{it.today}</div>
          <div className="px-[16px] py-[12px] font-[500] text-[var(--color-on-background)] border-l border-[var(--color-outline-light)] bg-[var(--color-sage-green-50)]/30">{it.after}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Where prototypes live ── */

function PrototypeEnvironments() {
  const envs = [
    {
      name: 'rosebud-live-demo',
      tag: 'Today — keep it',
      tagTone: 'ivory',
      role: 'Fast & loose prototyping',
      stack: ['React + Vite + Tailwind', 'Custom phone frame, presentation tools', 'Export-to-zip pipeline'],
      uses: ['Stakeholder pitches', 'Exploratory ideas before they need to look like production', 'Anything Tailwind-fast'],
      tradeoff: 'Components here are reimplementations. Production-faithful detail is approximate.',
    },
    {
      name: 'apps/prototypes',
      tag: 'New — inside rosebud-react',
      tagTone: 'sage',
      role: 'Production-faithful prototyping',
      stack: ['Vite + react-native-web', 'Lives next to apps/native + apps/web', 'Imports directly from apps/native/src/components/'],
      uses: ['Handoff-ready prototypes for engineering', 'Showing PMs what a feature will actually look like', 'Composing screens out of real components'],
      tradeoff: 'Has to play by RN rules — no arbitrary HTML, no Tailwind classes, RN style objects only.',
    },
  ];

  return (
    <div className="mt-[20px] grid grid-cols-1 md:grid-cols-2 gap-[16px]">
      {envs.map((e) => (
        <div
          key={e.name}
          className="p-[20px] rounded-[14px] bg-[var(--color-surface)] border border-[var(--color-outline-light)] flex flex-col"
        >
          <div className="flex items-center justify-between gap-[8px] mb-[10px]">
            <Code>{e.name}</Code>
            <Pill tone={e.tagTone}>{e.tag}</Pill>
          </div>
          <H3>{e.role}</H3>
          <div className="mt-[12px]">
            <div className="text-[10px] font-[700] tracking-[0.08em] uppercase text-[var(--color-secondary-text)] mb-[6px]">
              Stack
            </div>
            <ul className="flex flex-col gap-[2px]">
              {e.stack.map((s) => (
                <li key={s} className="text-[12px] leading-[18px] font-[450] text-[var(--color-on-background)]">• {s}</li>
              ))}
            </ul>
          </div>
          <div className="mt-[12px]">
            <div className="text-[10px] font-[700] tracking-[0.08em] uppercase text-[var(--color-secondary-text)] mb-[6px]">
              Use it for
            </div>
            <ul className="flex flex-col gap-[2px]">
              {e.uses.map((u) => (
                <li key={u} className="text-[12px] leading-[18px] font-[450] text-[var(--color-on-background)]">• {u}</li>
              ))}
            </ul>
          </div>
          <div className="mt-[12px] pt-[12px] border-t border-[var(--color-outline-light)]">
            <div className="text-[10px] font-[700] tracking-[0.08em] uppercase text-[var(--color-secondary-text)] mb-[4px]">
              Tradeoff
            </div>
            <p className="text-[12px] leading-[17px] font-[450] italic text-[var(--color-secondary-text)]">{e.tradeoff}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ClaudeWorkflow() {
  const steps = [
    {
      cmd: 'cd apps/prototypes',
      what: 'Move into the prototype workspace inside rosebud-react.',
    },
    {
      cmd: '"Build me a journal-list screen with three ItemCards"',
      what: "Claude reads apps/native/src/components/, knows the real props, writes the screen using production parts.",
    },
    {
      cmd: 'npm run dev',
      what: 'Vite + react-native-web renders the prototype on http://localhost. Same components, same theme, same look as the iOS app.',
    },
    {
      cmd: 'git push → PR',
      what: 'Vercel deploys the prototype on a preview URL. Send the link to PM, eng, or Slack.',
    },
  ];

  return (
    <div className="mt-[20px] rounded-[14px] bg-[var(--color-background)] border border-[var(--color-outline-light)] overflow-hidden">
      <div className="px-[20px] py-[14px] border-b border-[var(--color-outline-light)] bg-[var(--color-surface)]">
        <div className="text-[11px] font-[700] tracking-[0.08em] uppercase text-[var(--color-secondary-text)] mb-[2px]">
          The Claude Code loop
        </div>
        <div className="text-[14px] leading-[20px] font-[600] text-[var(--color-on-background)]">
          Composing a prototype with real components
        </div>
      </div>
      <div className="p-[20px] flex flex-col gap-[14px]">
        {steps.map((s, i) => (
          <div key={i} className="flex items-start gap-[14px]">
            <div className="shrink-0 w-[20px] h-[20px] rounded-full bg-[var(--color-sage-green-100)] text-[var(--color-sage-green-800)] flex items-center justify-center text-[11px] font-[700] mt-[2px]">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-mono text-[12px] leading-[18px] font-[500] text-[var(--color-on-background)] bg-[var(--color-surface-variant)] border border-[var(--color-outline-light)] rounded-[6px] px-[8px] py-[3px] inline-block mb-[4px] break-words">
                {s.cmd}
              </div>
              <Body>{s.what}</Body>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Component lifecycle: add + modify ── */

function ComponentLifecycle() {
  const modifying = [
    {
      cmd: 'Edit apps/native/src/components/Button.tsx',
      what: "There's only one file. The component you change is the same one production runs.",
    },
    {
      cmd: 'Update Button.stories.tsx if a variant is added',
      what: 'Story files document props and variants. New variant → new story entry.',
    },
    {
      cmd: 'Open PR → Vercel deploys preview Storybook',
      what: 'Designer reviews the change in the preview URL. Same artifact eng is shipping.',
    },
    {
      cmd: 'Merge → main Storybook redeploys',
      what: 'The next iOS/Android build picks up the change. Storybook stays in sync automatically.',
    },
  ];
  const adding = [
    {
      cmd: 'Decide: shared primitive vs screen-local',
      what: 'Used in 2+ screens? Extract to apps/native/src/components/. One screen only? Keep it local.',
    },
    {
      cmd: 'Build it using theme tokens',
      what: 'No hardcoded colors or spacing. Pull from theme/tokens.ts so dark mode and theme changes propagate.',
    },
    {
      cmd: 'Write the story file',
      what: 'apps/storybook/src/stories/[Name].stories.tsx — cover the main props, variants, and edge states.',
    },
    {
      cmd: 'Ship a .web.tsx shim if needed',
      what: 'New native module imported (camera, biometrics, etc.)? Add a web shim in apps/storybook/src/shims/.',
    },
    {
      cmd: 'PR review covers code + story + a11y + dark mode',
      what: 'Reviewers check the preview URL in both themes. No screenshot ping-pong needed.',
    },
  ];

  const Step = ({ num, cmd, what }) => (
    <li className="flex items-start gap-[12px] py-[10px] border-b border-[var(--color-outline-light)] last:border-b-0">
      <div className="shrink-0 w-[20px] h-[20px] rounded-full bg-[var(--color-sage-green-100)] text-[var(--color-sage-green-800)] flex items-center justify-center text-[11px] font-[700] mt-[1px]">
        {num}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-mono text-[11px] leading-[16px] font-[500] text-[var(--color-on-background)] bg-[var(--color-surface-variant)] border border-[var(--color-outline-light)] rounded-[5px] px-[6px] py-[2px] inline-block mb-[4px] break-words">
          {cmd}
        </div>
        <Body>{what}</Body>
      </div>
    </li>
  );

  return (
    <div className="mt-[20px] grid grid-cols-1 md:grid-cols-2 gap-[16px]">
      <div className="p-[20px] rounded-[14px] bg-[var(--color-surface)] border border-[var(--color-outline-light)]">
        <div className="flex items-center gap-[8px] mb-[12px]">
          <Pill tone="neutral">Most common</Pill>
          <span className="text-[13px] font-[700] text-[var(--color-on-background)]">Modifying an existing component</span>
        </div>
        <ol className="flex flex-col">
          {modifying.map((s, i) => <Step key={i} num={i + 1} {...s} />)}
        </ol>
      </div>
      <div className="p-[20px] rounded-[14px] bg-[var(--color-sage-green-50)]/40 border border-[var(--color-sage-green-200)]">
        <div className="flex items-center gap-[8px] mb-[12px]">
          <Pill tone="sage">Less often</Pill>
          <span className="text-[13px] font-[700] text-[var(--color-on-background)]">Adding a new component</span>
        </div>
        <ol className="flex flex-col">
          {adding.map((s, i) => <Step key={i} num={i + 1} {...s} />)}
        </ol>
      </div>
    </div>
  );
}

function PRChecklist() {
  const items = [
    'Story added or updated for any prop/variant changes',
    'Theme tokens used (no hardcoded colors or spacing)',
    'Web shim added if a new native module is imported',
    'Verified in both light and dark mode via Storybook toolbar',
    'Component name + props documented in the story description',
  ];
  return (
    <div className="mt-[20px] p-[20px] rounded-[14px] bg-[var(--color-soft-ivory-50)] border border-[var(--color-soft-ivory-200)]">
      <div className="flex items-center gap-[8px] mb-[12px]">
        <Pill tone="ivory">PR checklist</Pill>
        <span className="text-[13px] font-[700] text-[var(--color-on-background)]">For any PR touching apps/native/src/components/</span>
      </div>
      <ul className="flex flex-col gap-[6px]">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-[10px]">
            <div className="shrink-0 mt-[3px] w-[14px] h-[14px] rounded-[4px] border-[1.5px] border-[var(--color-soft-ivory-700)] bg-white" />
            <span className="text-[13px] leading-[19px] font-[500] text-[var(--color-on-background)]">{it}</span>
          </li>
        ))}
      </ul>
      <p className="mt-[14px] text-[12px] leading-[18px] font-[450] italic text-[var(--color-secondary-text)]">
        CI can enforce most of these — a script that fails the build if a component changed without a story update is one of the easiest wins.
      </p>
    </div>
  );
}

function AIAssistedDocs() {
  const steps = [
    'Claude scans apps/native/src/components/ to inventory every component and its props.',
    'Then sweeps every screen in apps/native/src/screens/ and apps/native/src/app/ to find every place each component is actually used.',
    'Identifies real patterns: which variants get used most, which prop combinations recur, which edge cases exist in the wild that the props alone do not reveal.',
    'Drafts first-pass usage guidelines — when to use what, do/don’t examples, common combinations — from real data, not hypotheticals.',
    'You and engineering review and refine for intent (e.g. "we should never use mode=text for primary actions"), then ship the guidelines into the story files.',
  ];

  return (
    <div className="mt-[20px] p-[20px] rounded-[14px] bg-[var(--color-sage-green-50)]/40 border border-[var(--color-sage-green-200)]">
      <div className="flex items-center gap-[8px] mb-[10px]">
        <Pill tone="sage">Maintenance unlock</Pill>
      </div>
      <H3>AI handles the tedious half of documentation</H3>
      <Body>
        The thing most design systems get wrong is documentation — it goes stale because writing usage guidelines is slow. Claude Code makes that part fast. It can sweep your codebase, find real usage patterns, and draft first-pass docs from actual data.
      </Body>
      <ol className="mt-[16px] flex flex-col">
        {steps.map((s, i) => (
          <li key={i} className="flex items-start gap-[12px] py-[10px] border-b border-[var(--color-sage-green-200)]/50 last:border-b-0">
            <div className="shrink-0 w-[20px] h-[20px] rounded-full bg-[var(--color-sage-green-100)] text-[var(--color-sage-green-800)] flex items-center justify-center text-[11px] font-[700] mt-[1px]">
              {i + 1}
            </div>
            <Body>{s}</Body>
          </li>
        ))}
      </ol>
      <p className="mt-[14px] text-[12px] leading-[18px] font-[450] italic text-[var(--color-secondary-text)]">
        Net effect: the designer's job becomes <strong className="not-italic font-[600] text-[var(--color-on-background)]">taste and intent</strong>, not typing every prop. AI does the inventory work; you do the judgment.
      </p>
    </div>
  );
}

function PromotionRule() {
  return (
    <div className="mt-[20px] p-[20px] rounded-[14px] bg-[var(--color-surface)] border border-[var(--color-outline-light)]">
      <H3>When does a pattern become a shared component?</H3>
      <Body>
        Default rule: <strong className="text-[var(--color-on-background)] font-[600]">used in 2+ screens with the same intent → promote to a shared component.</strong> Anything used once stays screen-local until it earns reuse. Avoids the "we built a kit nobody uses" trap.
      </Body>
      <p className="mt-[10px] text-[13px] leading-[20px] font-[450] text-[var(--color-secondary-text)]">
        Promotion is a 5-minute conversation in the PR — not a committee. The designer and the eng who flagged the duplication agree, then one of them moves the file and writes the story.
      </p>
    </div>
  );
}

/* ── Designer + Claude Code workflow ── */

function TrifectaPieces() {
  const pieces = [
    {
      name: 'Storybook',
      role: 'The layout',
      what: 'Sidebar of components, click one, see it live with all variants. Props panel toggles states in real-time. You don\'t build this — Storybook gives it for free.',
      tag: 'Engineering ergonomics',
      accent: '#FF4785',
    },
    {
      name: 'MDX docs',
      role: 'The narrative',
      what: 'Markdown files that sit next to each component. When to use it, when not to, do/don\'t examples, accessibility notes, design intent. The story files most engineering Storybooks are missing.',
      tag: 'Design narrative',
      accent: '#5ABA9D',
    },
    {
      name: 'Claude Code',
      role: 'The bridge',
      what: 'Running in your terminal. You describe a change in plain English; it edits the component, the story, and the docs in one pass. Opens a PR for engineering review.',
      tag: 'Designer leverage',
      accent: '#D87C2D',
    },
  ];

  return (
    <div className="mt-[20px] grid grid-cols-1 md:grid-cols-3 gap-[12px]">
      {pieces.map((p, i) => (
        <div
          key={p.name}
          className="p-[18px] rounded-[14px] bg-[var(--color-surface)] border border-[var(--color-outline-light)] flex flex-col"
          style={{ borderTopColor: p.accent, borderTopWidth: 3 }}
        >
          <div className="flex items-center gap-[8px] mb-[6px]">
            <span className="text-[14px] leading-[20px] font-[700] text-[var(--color-secondary-text)]">
              {i + 1}
            </span>
            <span className="text-[16px] leading-[22px] font-[700] text-[var(--color-on-background)]">
              {p.name}
            </span>
          </div>
          <div className="text-[11px] font-[700] tracking-[0.08em] uppercase mb-[8px]" style={{ color: p.accent }}>
            {p.role}
          </div>
          <p className="text-[12px] leading-[18px] font-[450] text-[var(--color-secondary-text)] flex-1">
            {p.what}
          </p>
          <div className="mt-[12px] pt-[10px] border-t border-[var(--color-outline-light)] text-[10px] font-[700] tracking-[0.08em] uppercase text-[var(--color-secondary-text)]">
            {p.tag}
          </div>
        </div>
      ))}
    </div>
  );
}

function WalkthroughExample() {
  const steps = [
    {
      who: 'You',
      action: 'Open Claude Code in the rosebud-react repo. Type:',
      cmd: '"In ItemCard, the dark mode background should be theme.colors.surfaceVariant instead of theme.colors.surface. Update the component, update the story to demonstrate the fix, and add a note in the docs about which surface token to use for cards."',
    },
    {
      who: 'Claude',
      action: 'Edits three files in one pass:',
      files: [
        'apps/native/src/components/ItemCard/ItemCard.tsx',
        'apps/storybook/src/stories/ItemCard.stories.tsx',
        'apps/storybook/src/docs/ItemCard.mdx',
      ],
    },
    {
      who: 'Storybook',
      action: 'Auto-reloads in your browser. You see ItemCard update live. Toggle dark mode in the toolbar. Looks right.',
    },
    {
      who: 'Claude',
      action: 'Opens a PR titled "ItemCard: use surfaceVariant for dark mode background." Description includes a link to the Storybook preview URL Vercel just deployed.',
    },
    {
      who: 'Engineering',
      action: 'Reviews the PR — looking at the same artifact you just looked at. Approves, merges. The fix is shipped.',
    },
  ];

  return (
    <div className="mt-[24px] rounded-[14px] bg-[var(--color-surface)] border border-[var(--color-outline-light)] overflow-hidden">
      <div className="px-[20px] py-[14px] border-b border-[var(--color-outline-light)] bg-[var(--color-background)]">
        <div className="text-[11px] font-[700] tracking-[0.08em] uppercase text-[var(--color-secondary-text)] mb-[2px]">
          A day in this workflow
        </div>
        <div className="text-[14px] leading-[20px] font-[600] text-[var(--color-on-background)]">
          Fixing a dark mode bug you noticed in the journal entry card
        </div>
      </div>
      <div className="p-[20px] flex flex-col gap-[16px]">
        {steps.map((s, i) => (
          <div key={i} className="flex items-start gap-[14px]">
            <div className="shrink-0 w-[22px] h-[22px] rounded-full bg-[var(--color-sage-green-100)] text-[var(--color-sage-green-800)] flex items-center justify-center text-[11px] font-[700] mt-[1px]">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-[8px] mb-[4px]">
                <span className="text-[10px] font-[700] tracking-[0.08em] uppercase text-[var(--color-secondary-text)]">
                  {s.who}
                </span>
              </div>
              <p className="text-[13px] leading-[20px] font-[500] text-[var(--color-on-background)]">
                {s.action}
              </p>
              {s.cmd && (
                <div className="mt-[8px] p-[10px] rounded-[8px] bg-[var(--color-background)] border border-[var(--color-outline-light)] font-mono text-[11px] leading-[17px] font-[450] text-[var(--color-on-background)] italic">
                  {s.cmd}
                </div>
              )}
              {s.files && (
                <ul className="mt-[8px] flex flex-col gap-[4px]">
                  {s.files.map((f) => (
                    <li key={f} className="flex items-center gap-[8px] text-[11px] leading-[16px] text-[var(--color-secondary-text)]">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[10px] h-[10px] shrink-0 text-[var(--color-sage-green-700)]">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <code className="font-mono font-[500]">{f}</code>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="px-[20px] py-[14px] border-t border-[var(--color-outline-light)] bg-[var(--color-sage-green-50)]/30">
        <p className="text-[12px] leading-[18px] font-[500] text-[var(--color-on-background)]">
          You wrote no code. You shipped a real component fix to production. Engineering was in the loop the whole time.
        </p>
      </div>
    </div>
  );
}

function ClaudeCapabilities() {
  const rows = [
    { task: 'Add a new component', flow: 'Tell Claude what you want, point at a similar existing one, it scaffolds component + story + docs together.' },
    { task: 'Modify an existing component', flow: 'Describe the change in plain English. Claude edits the three files in sync.' },
    { task: 'Write or refine usage docs', flow: 'Claude scans the codebase to see how the component is actually used, drafts guidelines, you refine.' },
    { task: 'Propose a redesign', flow: 'Claude builds the new variant alongside the old one. The PR shows both side-by-side for comparison.' },
    { task: 'Update design tokens', flow: '"Change the primary color from sage-500 to sage-600" — Claude updates the token, every component using it updates everywhere.' },
  ];

  return (
    <div className="mt-[24px] rounded-[14px] bg-[var(--color-surface)] border border-[var(--color-outline-light)] overflow-hidden">
      <div className="grid grid-cols-[1fr_2fr] text-[10px] font-[700] tracking-[0.08em] uppercase text-[var(--color-secondary-text)] border-b border-[var(--color-outline-light)]">
        <div className="px-[16px] py-[10px]">Task</div>
        <div className="px-[16px] py-[10px] border-l border-[var(--color-outline-light)]">Workflow</div>
      </div>
      {rows.map((r, i) => (
        <div
          key={r.task}
          className={`grid grid-cols-[1fr_2fr] text-[13px] leading-[19px] ${
            i < rows.length - 1 ? 'border-b border-[var(--color-outline-light)]' : ''
          }`}
        >
          <div className="px-[16px] py-[12px] font-[600] text-[var(--color-on-background)]">{r.task}</div>
          <div className="px-[16px] py-[12px] font-[450] text-[var(--color-secondary-text)] border-l border-[var(--color-outline-light)]">{r.flow}</div>
        </div>
      ))}
    </div>
  );
}

function HonestyCallout() {
  const items = [
    {
      h: 'You\'re not editing live in the browser',
      b: 'No "click a button, the component changes" UI. Editing happens in Claude Code (terminal), the result shows up in the browser. This keeps the flow clean — one place to change things, one place to view them.',
    },
    {
      h: 'You\'re not auto-merging to production',
      b: 'Every change Claude makes goes through a PR. Engineering reviews. They might say "actually, that token change has an accessibility implication, let\'s discuss." That review step is what keeps you safe.',
    },
    {
      h: 'You\'re not bypassing engineering',
      b: 'You ARE making fewer demands of them. They review proposed changes instead of building them from scratch. Most engineering teams welcome this — it\'s leverage for them too.',
    },
  ];

  return (
    <div className="mt-[24px] p-[20px] rounded-[14px] bg-[var(--color-soft-ivory-50)]/50 border border-[var(--color-soft-ivory-200)]">
      <div className="flex items-center gap-[8px] mb-[12px]">
        <Pill tone="ivory">Honest about what you're not getting</Pill>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
        {items.map((item) => (
          <div key={item.h}>
            <H3>{item.h}</H3>
            <Body>{item.b}</Body>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Business impact cards ── */

function BusinessImpact() {
  const items = [
    {
      lead: 'Fewer "that’s not quite right" rounds',
      body: 'Designs ship pixel-correct because they are built from real components, not approximations. The most common source of design QA churn disappears.',
      stat: '2–3',
      statLabel: 'avg review rounds saved per feature',
    },
    {
      lead: 'Faster onboarding for new hires',
      body: 'A single URL replaces tribal knowledge. New designers and engineers see every component and variant on day one — no "ask the senior dev" loop.',
      stat: '1 URL',
      statLabel: 'replaces the new-hire scavenger hunt',
    },
    {
      lead: 'Easier demos for sales, investors, and stakeholders',
      body: 'No simulator required. Anyone with a link can click through the actual product surface. Useful for B2B pitches (e.g. the Therapist demo) and internal alignment.',
      stat: '0',
      statLabel: 'dev-env setup to show the product',
    },
    {
      lead: 'Marketing and support get current assets',
      body: 'Screenshots from the design system URL are by definition shippable. Marketing stops shipping outdated mockups; support stops describing UI that no longer exists.',
      stat: 'Always',
      statLabel: 'in sync with what users see',
    },
    {
      lead: 'Compounding velocity',
      body: 'Every component shipped today makes tomorrow’s design and review measurably faster. The investment pays back across the entire roadmap, not a single feature.',
      stat: '∞',
      statLabel: 'value compounds with every component',
    },
    {
      lead: 'Risk reduction on the React Native bet',
      body: 'You already chose RN. Without a web surface, the cost of that bet is "designers and stakeholders need iOS dev environments." This removes that tax permanently.',
      stat: '0',
      statLabel: 'Mac builds required to review designs',
    },
  ];
  return (
    <div className="mt-[20px] grid grid-cols-1 md:grid-cols-2 gap-[12px]">
      {items.map((it) => (
        <div
          key={it.lead}
          className="p-[20px] rounded-[14px] bg-[var(--color-surface)] border border-[var(--color-outline-light)] flex flex-col"
        >
          <div className="flex items-baseline gap-[10px] mb-[8px]">
            <span className="text-[24px] leading-[28px] font-[700] tracking-[-0.02em] text-[var(--color-sage-green-700)] shrink-0">
              {it.stat}
            </span>
            <span className="text-[10px] font-[600] tracking-[0.06em] uppercase text-[var(--color-secondary-text)]">
              {it.statLabel}
            </span>
          </div>
          <H3>{it.lead}</H3>
          <Body>{it.body}</Body>
        </div>
      ))}
    </div>
  );
}

/* ── Section wrapper ── */

function Section({ id, sectionRef, children }) {
  return (
    <section ref={sectionRef} id={id} className="scroll-mt-[80px] mb-[56px]">
      {children}
    </section>
  );
}

/* ── Main page ── */

export function LivingDesignSystem() {
  const [active, setActive] = useState('tldr');
  const sectionRefs = useRef({});

  useHeaderCenter(<PodcastPlayer />, []);

  usePageActions(
    <Link
      to="/living-design-system/present"
      className="inline-flex items-center gap-[6px] px-[12px] py-[7px] rounded-full text-[13px] font-[500] bg-white border border-[#C0C0BF] text-[#191C1A] hover:border-[#191C1A] transition-colors"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px]">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
      Present
    </Link>,
    [],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: [0, 0.1] }
    );
    SECTIONS.forEach((s) => {
      const node = sectionRefs.current[s.id];
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, []);

  const onJump = (id) => {
    const node = sectionRefs.current[id];
    if (node) node.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const setRef = (id) => (node) => {
    if (node) sectionRefs.current[id] = node;
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-[20px] md:px-[32px] py-[40px] md:py-[60px]">
      {/* ── Page header ── */}
      <div className="mb-[40px] md:mb-[56px] max-w-[760px]">
        <Eyebrow color="sage">Planning · Proposal for the rosebud-react team</Eyebrow>
        <H1>Living Design System</H1>
        <Body size="lg">
          The end of the design-to-code translation gap. Designers prototype with real Rosebud components, propose updates as pull requests, and engineering reviews instead of rebuilding. One URL, one truth, always current with what ships.
        </Body>
        <div className="mt-[20px] flex flex-wrap gap-[8px]">
          <Pill tone="sage">Storybook + react-native-web</Pill>
          <Pill tone="neutral">~1 week to v1</Pill>
          <Pill tone="neutral">Zero edits to apps/native</Pill>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className="flex flex-col lg:flex-row gap-[32px] lg:gap-[48px]">
        <PageSidebar active={active} onJump={onJump} />

        <article className="flex-1 min-w-0 max-w-[760px]">
          <Section id="tldr" sectionRef={setRef('tldr')}>
            <H2>TL;DR</H2>
            <Body>
              <Code>react-native-web</Code> is already a dependency in <Code>apps/native</Code>. Spin up a thin Storybook workspace that points at the existing component files, deploy it to a stable URL, and now design and engineering review the same artifact: live production components, on the web, every PR.
            </Body>
            <div className="mt-[24px] flex flex-wrap gap-[12px]">
              <StatCard value="69" label="Components in apps/native" color="charcoal" />
              <StatCard value="~55" label="Renderable on web in v1" color="sage" />
              <StatCard value="~1 wk" label="To stable, deployable URL" color="ivory" />
              <StatCard value="0" label="Edits required to apps/native" color="rose" />
            </div>
          </Section>

          <Section id="storybook" sectionRef={setRef('storybook')}>
            <H2>What is Storybook, exactly?</H2>
            <Body>
              Think of it as a Figma component library — but the components are real production code, and you open it as a website. Every component gets its own page showing all its variants and states. You can click them, change props in real time, and link to specific states (e.g. "Button → destructive → loading"). It is the <strong className="text-[var(--color-on-background)] font-[600]">industry-standard way</strong> most tech companies — both web and native — manage their design systems.
            </Body>
            <div className="mt-[20px]">
              <div className="text-[11px] font-[700] tracking-[0.08em] uppercase text-[var(--color-secondary-text)] mb-[8px]">
                Examples in the wild
              </div>
              <StorybookExamples />
            </div>
            <p className="mt-[16px] text-[13px] leading-[20px] font-[450] italic text-[var(--color-secondary-text)]">
              All four of these are public, live URLs. Click any one to see what a Living Design System looks like in practice — that's roughly what Rosebud's would feel like.
            </p>
            <NativeCallout />
            <RNToWebTranslator />
          </Section>

          <Section id="proposal" sectionRef={setRef('proposal')}>
            <H2>The proposal</H2>
            <Body>
              Add one new workspace: <Code>apps/storybook</Code>. It imports components from <Code>apps/native/src/components/</Code>, runs them under <Code>react-native-web</Code>, and deploys to Vercel on every push.
            </Body>
            <FlowDiagram />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[12px]">
              {[
                { h: 'For designers', b: 'A real URL. Drop components into mockups, screenshot variants, link to specific states in Slack.' },
                { h: 'For engineers', b: 'Per-PR preview URL. Reviewers see the change without pulling the branch or running a simulator.' },
                { h: 'For the codebase', b: 'No parallel system to keep in sync. Storybook is downstream of your real components.' },
              ].map((c) => (
                <div key={c.h} className="p-[16px] rounded-[12px] bg-[var(--color-surface)] border border-[var(--color-outline-light)]">
                  <H3>{c.h}</H3>
                  <Body>{c.b}</Body>
                </div>
              ))}
            </div>
          </Section>

          <Section id="workflow" sectionRef={setRef('workflow')}>
            <H2>Designer workflow & handoff</H2>
            <Body>
              The biggest unlock isn't technical — it's what the day-to-day loop becomes. Side by side, here is the handoff today vs. with a Living Design System in place.
            </Body>
            <WorkflowComparison />
            <div className="mt-[20px]">
              <div className="text-[11px] font-[700] tracking-[0.08em] uppercase text-[var(--color-secondary-text)] mb-[8px]">
                Where the friction goes
              </div>
              <HandoffCallout />
            </div>
            <p className="mt-[16px] text-[13px] leading-[20px] font-[450] italic text-[var(--color-secondary-text)]">
              Net effect: design and engineering stop reviewing different artifacts. The PR preview link is the single source both teams point at.
            </p>
          </Section>

          <Section id="where" sectionRef={setRef('where')}>
            <H2>Where prototypes actually live</H2>
            <Body>
              Two prototyping environments serve two different needs. Both are useful — they just optimize for different things.
            </Body>
            <PrototypeEnvironments />
            <div className="mt-[24px]">
              <ClaudeWorkflow />
            </div>
            <p className="mt-[16px] text-[13px] leading-[20px] font-[450] italic text-[var(--color-secondary-text)]">
              The Storybook proposal earlier in this doc unlocks the right side of this picture. Once <Code>apps/native/src/components/</Code> renders on web, a sibling <Code>apps/prototypes</Code> workspace can compose with it the same way Storybook displays it.
            </p>
          </Section>

          <Section id="lifecycle" sectionRef={setRef('lifecycle')}>
            <H2>Adding & modifying components</H2>
            <Body>
              Two flows cover almost every change. The most common is modifying an existing component — a 4-step loop. Adding a new one is 5 steps and has a small ceremony around story coverage and theme tokens.
            </Body>
            <ComponentLifecycle />
            <PRChecklist />
            <PromotionRule />
            <AIAssistedDocs />
          </Section>

          <Section id="claude-workflow" sectionRef={setRef('claude-workflow')}>
            <H2>Designer + Claude Code: the actual workflow</H2>
            <Body>
              The compelling part of this proposal isn't the catalog itself — it's what becomes possible once it exists. A trifecta of Storybook (the layout), MDX docs (the design narrative), and Claude Code (the bridge) lets you, as a designer, propose real component changes without typing code or interrupting engineering.
            </Body>
            <TrifectaPieces />
            <WalkthroughExample />
            <div className="mt-[24px]">
              <div className="text-[11px] font-[700] tracking-[0.08em] uppercase text-[var(--color-secondary-text)] mb-[8px]">
                What this lets you actually do
              </div>
              <ClaudeCapabilities />
            </div>
            <HonestyCallout />
            <p className="mt-[20px] text-[13px] leading-[20px] font-[450] italic text-[var(--color-secondary-text)]">
              Most design systems suffer from one of two problems: <strong className="not-italic font-[600] text-[var(--color-on-background)]">eng-built and eng-maintained</strong> (great technical playground, no design narrative, designers don't know it exists), or <strong className="not-italic font-[600] text-[var(--color-on-background)]">designer-built and disconnected</strong> (beautiful guidelines, components in production drift away from them). This trifecta solves both. Storybook gives engineering ergonomics. MDX docs give design narrative. Claude Code is the bridge that lets a designer make changes to both surfaces without needing engineering to type for them.
            </p>
          </Section>

          <Section id="business" sectionRef={setRef('business')}>
            <H2>Why the business should care</H2>
            <Body>
              This isn't a tooling project. It's a productivity multiplier — every feature on the roadmap ships faster, with less rework, after this lands.
            </Body>
            <BusinessImpact />
            <div className="mt-[20px] p-[16px] rounded-[12px] bg-[var(--color-soft-ivory-50)] border border-[var(--color-soft-ivory-200)]">
              <div className="text-[11px] font-[700] tracking-[0.08em] uppercase text-[var(--color-soft-ivory-900)] mb-[6px]">
                One-line for leadership
              </div>
              <p className="text-[14px] leading-[22px] font-[500] text-[var(--color-on-background)]">
                "We are spending one engineer-week to build a permanent web preview of our React Native app, so design, eng, marketing, sales, and new hires all stop paying the simulator tax."
              </p>
            </div>
          </Section>

          <Section id="why" sectionRef={setRef('why')}>
            <H2>Why this fits the rosebud-react codebase</H2>
            <Body>
              This isn't a generic recommendation. Five things in your repo right now make this the path of least resistance:
            </Body>
            <ul className="mt-[20px] flex flex-col gap-[14px]">
              {[
                { code: 'react-native-web ~0.21.2', text: 'Already declared in apps/native/package.json. Half the integration work is done.' },
                { code: 'apps/native/src/theme/', text: 'tokens.ts + light.ts + dark.ts exist. The Storybook theme decorator is one file.' },
                { code: 'react-native-paper 5.12.3', text: 'Paper has a first-class web build. Your Button, FormTextInput, etc. render with real Paper styling.' },
                { code: 'pnpm-workspace.yaml', text: "Wildcards apps/*. A new app workspace is auto-discovered — no config changes." },
                { code: 'turbo.json', text: 'types:report and lint:report are pattern-matched. Storybook gets picked up by existing CI tasks for free.' },
              ].map((item) => (
                <li key={item.code} className="flex items-start gap-[12px]">
                  <div className="shrink-0 mt-[1px]">
                    <Code>{item.code}</Code>
                  </div>
                  <Body>{item.text}</Body>
                </li>
              ))}
            </ul>
          </Section>

          <Section id="components" sectionRef={setRef('components')}>
            <H2>Component triage — the actual work</H2>
            <Body>
              The 69 components in <Code>apps/native/src/components/</Code> aren't equally web-renderable. The setup is fast; the time goes to triage. Three buckets:
            </Body>
            <ComponentTriage />
            <p className="mt-[14px] text-[13px] leading-[20px] font-[450] italic text-[var(--color-secondary-text)]">
              Counts above are estimates from a quick grep. The first deliverable is a script that produces the actual table — that's the real v1 scope conversation.
            </p>
          </Section>

          <Section id="changes" sectionRef={setRef('changes')}>
            <H2>What changes vs what doesn't</H2>
            <Body>
              The blast radius is intentionally small. If we tried this and decided to rip it out, deleting <Code>apps/storybook</Code> + the Vercel project = total cleanup.
            </Body>
            <ChangeMatrix />
          </Section>

          <Section id="rollout" sectionRef={setRef('rollout')}>
            <H2>Rollout</H2>
            <Body>Six phases. Each one independently shippable — we can stop at any point.</Body>
            <Rollout />
          </Section>

          <Section id="faq" sectionRef={setRef('faq')}>
            <H2>FAQ</H2>
            <Body>The questions I'd ask if I were on the eng team.</Body>
            <div className="mt-[16px] rounded-[14px] bg-[var(--color-surface)] border border-[var(--color-outline-light)] px-[20px]">
              {FAQ_ITEMS.map((item) => (
                <FaqItem key={item.q} item={item} />
              ))}
            </div>
          </Section>

          <div className="mt-[24px] p-[24px] rounded-[16px] bg-[var(--color-sage-green-50)] border border-[var(--color-sage-green-200)]">
            <H3>Want to see it before you commit?</H3>
            <Body>
              The next step is a 1-day spike on a branch: scaffold <Code>apps/storybook</Code>, get a single component (Button) rendering on web, deploy the static build to a Vercel preview. Total time including review: half a day. If it doesn't feel right, we delete the branch.
            </Body>
          </div>
        </article>
      </div>
    </div>
  );
}
