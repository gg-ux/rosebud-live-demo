/* ═══════════════════════════════════════════════════════════════════════════
   Living Design System — Presentation deck for engineering

   Same dark deck paradigm as Presentation.jsx (Patterns deck), branded
   for the Living Design System proposal:
   - Sage as primary accent (matches the page)
   - Rose + amber as secondary accents
   - Slide spine condensed from the proposal page (~14 slides)
   - Esc returns to /living-design-system (the proposal page)
   ═══════════════════════════════════════════════════════════════════════════ */

import { useState, useEffect, useCallback, useRef, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

const slideVariants = {
  initial: { opacity: 0, y: 12, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.3, ease } },
};

const sectionVariants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.6, ease } },
  exit: { opacity: 0, scale: 1.02, transition: { duration: 0.3 } },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

const SAGE = '#5ABA9D';
const ROSE = '#E31665';
const AMBER = '#E4AD51';

// ═══════════════════════════════════════════════════════════
// Slide spine — condensed proposal narrative for engineering
// ═══════════════════════════════════════════════════════════
const slides = [
  // 1. Title
  {
    type: 'title',
    eyebrow: 'Proposal · For the rosebud-react team',
    title: ['Living', 'Design System'],
    subtitle: 'The end of the design-to-code translation gap.',
    metadata: [
      { label: 'Author', value: 'Grace Guo' },
      { label: 'Stack', value: 'Storybook + react-native-web' },
      { label: 'Estimate', value: '~1 week to v1' },
    ],
  },

  // 2. Manifesto / aspirational pitch
  {
    type: 'manifesto',
    eyebrow: 'What we are building',
    lines: [
      'The Rosebud product, alive on the web.',
      'Designers prototype with real components.',
      'Updates land as pull requests.',
      'Engineering reviews instead of rebuilding.',
    ],
    closing: 'One URL. One truth. Always current with what ships.',
  },

  // SECTION 01 — The Idea
  { type: 'section', number: '01', title: 'The Idea' },

  // 3. What is Storybook?
  {
    type: 'what-is',
    eyebrow: 'The pattern',
    title: 'Like a Figma library — but the components are real production code.',
    body: 'Every component gets its own page. All variants, all states, live in your browser. Industry-standard for both web and native.',
    examples: [
      { org: 'GitHub', system: 'Primer', image: '/storybook-examples/gh-primer.png', url: 'https://primer.style/components/button' },
      { org: 'Atlassian', system: 'Design System', image: '/storybook-examples/atlassian.png', url: 'https://atlassian.design/components/button/examples' },
      { org: 'IBM', system: 'Carbon', image: '/storybook-examples/carbon.png', url: 'https://carbondesignsystem.com/components/button/usage' },
      { org: 'Adobe', system: 'Spectrum', image: '/storybook-examples/spectrum.png', url: 'https://spectrum.adobe.com/page/button/' },
    ],
  },

  // 4. Featured Gluestack — see it in motion
  {
    type: 'featured-gluestack',
    eyebrow: 'Now look closer',
    title: 'Real React Native components, live in the browser.',
    body: 'Gluestack uses the same react-native-web pattern this proposal does. Hover, click, change variants. This is genuinely what Rosebud\'s Living Design System would feel like — except with Rosebud\'s components.',
    image: '/storybook-examples/gluestack-full.png',
    imageHeight: 4500,
    url: 'https://gluestack.io/ui/docs/components/button',
  },

  // 5. The problem — rewritten with real data
  {
    type: 'problem',
    eyebrow: 'The cost of where we are',
    title: 'Designs and code live in two languages. Translation is the hidden tax.',
    stats: [
      {
        value: '52%',
        label: 'of developers cite "differences in assumptions" as their #1 friction working with designers.',
        source: 'Figma Designer & Developer Trends, 2025 (n=900+)',
      },
      {
        value: '47%',
        label: 'longer to build a form from scratch vs. with a design system. 4.2 hours → 2.0 hours.',
        source: 'Sparkbox / IBM Carbon controlled study, 2021',
      },
      {
        value: '5–6 mo',
        label: 'industry baseline for a new engineer to reach full productivity. Most of that ramp is learning UI conventions.',
        source: 'Standard HR ramp-time benchmarks',
      },
    ],
    closing: 'Every Rosebud feature ships through this tax. Every new hire pays it again.',
  },

  // 6. Industry benchmark — what comparable companies did
  {
    type: 'industry-benchmark',
    eyebrow: 'What companies you respect already did',
    title: "This isn't speculative. The companies you'd benchmark against built theirs years ago.",
    headlineStat: {
      value: '~2×',
      desc: 'Companies with mature design practices grew revenue at nearly twice the rate of industry peers over a 5-year tracking period (+32 percentage points higher growth).',
      source: 'McKinsey & Co., The Business Value of Design, 2018 (n=300 publicly traded companies)',
    },
    companies: [
      {
        name: 'Shopify',
        system: 'Polaris',
        proof: '86% of admin UI auto-updated when Polaris shipped one style change.',
      },
      {
        name: 'Airbnb',
        system: 'DLS',
        proof: 'First cross-platform RN design system. Built by Karri Saarinen (now Linear CEO).',
      },
      {
        name: 'Atlassian',
        system: 'Design System',
        proof: 'Dedicated 18-person team supporting ~100 product engineers. Treated as core infrastructure.',
      },
      {
        name: 'IBM',
        system: 'Carbon',
        proof: '47% faster build times in controlled study. 3 of 8 developers improved accessibility using it.',
      },
    ],
  },

  // SECTION 02 — The Proposal
  { type: 'section', number: '02', title: 'The Proposal' },

  // 5. Architecture diagram
  {
    type: 'architecture',
    eyebrow: 'How it works',
    title: 'One new workspace. Zero changes to apps/native.',
    boxes: [
      { name: 'apps/native/src/components/', sub: '69 production RN components — unchanged', tone: 'neutral' },
      { name: 'apps/storybook/', sub: 'New workspace. Stories + .web shims for native modules.', tone: 'rose' },
      { name: 'rosebud-storybook.vercel.app', sub: 'Auto-deployed per PR. Designers see live components.', tone: 'neutral' },
    ],
    footer: 'react-native-web translates RN primitives (View → div, Text → span) on the fly. The same Button.tsx renders on iOS, Android, and web.',
  },

  // 6. Why it fits Rosebud's codebase
  {
    type: 'fit',
    eyebrow: 'Why this fits us',
    title: 'Five things in your repo make this the path of least resistance.',
    items: [
      { code: 'react-native-web ~0.21.2', text: 'Already a dependency. Half the integration work is done.' },
      { code: 'apps/native/src/theme/', text: 'tokens.ts + light.ts + dark.ts exist. Theme decorator = one file.' },
      { code: 'react-native-paper 5.12.3', text: 'Has a first-class web build. Buttons render with real Paper styling.' },
      { code: 'pnpm-workspace.yaml', text: 'Wildcards apps/*. New workspace auto-discovered, no config changes.' },
      { code: 'turbo.json', text: 'types:report and lint:report pattern-matched. CI picks up Storybook for free.' },
    ],
  },

  // 7. Component triage
  {
    type: 'triage',
    eyebrow: 'The actual work',
    title: '69 components, three buckets.',
    buckets: [
      { count: '~40', name: 'Pure', tone: 'rgba(255,255,255,0.85)', desc: 'Only RN primitives + Paper + theme tokens. Works as-is.' },
      { count: '~15-20', name: 'Soft-coupled', tone: AMBER, desc: 'Use Expo modules with web equivalents (haptics → no-op, etc). Need ~10-line shim.' },
      { count: '~10-15', name: 'Hard-coupled', tone: ROSE, desc: 'Camera, biometrics, IAP. Skip in v1, stub with fixtures or placeholder.' },
    ],
    note: '~55 components renderable on web in v1.',
  },

  // SECTION 03 — The Workflow
  { type: 'section', number: '03', title: 'The Workflow' },

  // 8. Designer + Claude Code trifecta
  {
    type: 'trifecta',
    eyebrow: 'The unlock',
    title: 'Three tools, working together.',
    pieces: [
      { name: 'Storybook', role: 'The layout', body: 'Sidebar, live preview, props playground. Out of the box.' },
      { name: 'MDX docs', role: 'The narrative', body: 'When to use it, design intent, do/don\'t — alongside each component.' },
      { name: 'Claude Code', role: 'The bridge', body: 'Designer describes a change in plain English. Edits component, story, docs, opens PR.' },
    ],
  },

  // 9. A day in the loop — walkthrough
  {
    type: 'walkthrough',
    eyebrow: 'A day in this workflow',
    title: 'Fixing a dark mode bug in the journal entry card.',
    steps: [
      { who: 'You', text: 'Notice ItemCard\'s dark mode background looks off. Open Claude Code in rosebud-react.' },
      { who: 'You', text: '"In ItemCard, dark mode background should be surfaceVariant, not surface. Update component, story, and docs."' },
      { who: 'Claude', text: 'Edits ItemCard.tsx, ItemCard.stories.tsx, and ItemCard.mdx in one pass.' },
      { who: 'Storybook', text: 'Auto-reloads. You toggle dark mode in the toolbar. Looks right.' },
      { who: 'Claude', text: 'Opens a PR with a Vercel preview link. Engineering reviews the same artifact you saw.' },
    ],
    closing: 'You wrote no code. You shipped a real fix to production. Engineering was in the loop the whole time.',
  },

  // 10. Source of truth — what the system actually IS for the company
  {
    type: 'source-of-truth',
    eyebrow: 'One source of truth',
    title: 'Components, docs, prototypes — all in one place.',
    cards: [
      { h: 'Documentation lives next to code', b: 'Design intent, do/don\'t, accessibility notes — alongside the components, not on a separate platform.' },
      { h: 'Components modifiable by design', b: 'Describe a change in plain English. Claude updates code + story + docs. Eng reviews the PR.' },
      { h: 'Prototypes use real components', b: 'No more handing off mockups for engineering to rebuild. They review and approve the composition.' },
      { h: 'Scales as the company scales', b: 'Every shipped component is documented and ready. The system gets stronger, not messier, with each release.' },
      { h: 'Web variations come for free', b: 'Components that already render on web are 80% of the way to a future Rosebud web product.' },
      { h: 'Faster onboarding', b: 'New designers and engineers see the entire system on day one. Tribal knowledge → linkable URL.' },
    ],
  },

  // 11. Value — why this matters to designers, engineers, and the business
  {
    type: 'value',
    eyebrow: 'Why this matters',
    title: 'A clear win for every team that touches the product.',
    columns: [
      {
        label: 'For Designers',
        items: [
          'Build with real components, not approximations',
          'Link to live components in Slack, Figma, anywhere',
          'Propose changes without writing code',
          'Spot inconsistencies at a glance',
        ],
      },
      {
        label: 'For Engineers',
        items: [
          'Review the same artifact designers built',
          'Stop translating Figma into React Native',
          'Per-PR preview URL for every component change',
          'Fewer "is this what you meant?" rounds',
        ],
      },
      {
        label: 'For the Business',
        items: [
          'Faster shipping — fewer review rounds, less rework',
          'Easier onboarding for designers and engineers',
          'Sales, investors, marketing all link-shareable',
          'Compounding velocity across every future feature',
        ],
      },
    ],
  },

  // 16. Pull-quote — Saarinen on the Airbnb DLS payoff
  {
    type: 'pull-quote',
    quote: 'After a week or two we began to see huge leaps in productivity by using the library. Product reviews can now focus on the actual concepts and experiences of a design, rather than padding, colors, and type choices.',
    attribution: 'Karri Saarinen',
    role: 'Design Lead at Airbnb (now CEO of Linear), on building the Airbnb DLS',
    source: 'Building a Visual Language, Airbnb Design',
  },

  // 17. Compound velocity — the math, with charts
  {
    type: 'compound-velocity',
    eyebrow: 'The compounding math',
    title: 'Pay once. Save every quarter after.',
    body: 'A design system is not linear ROI. The first feature recoups the build; every feature after pays back compounding interest.',
    barChart: {
      label: 'Time to build a single form',
      bars: [
        { name: 'From scratch', value: 4.2, unit: 'hrs' },
        { name: 'With a design system', value: 2.0, unit: 'hrs', highlight: true },
      ],
      footnote: 'Sparkbox / IBM Carbon controlled study, 2021',
    },
    lineChart: {
      label: 'Cumulative engineering hours saved (illustrative model)',
      points: [
        { x: 'Q1', y: 0, note: '1-week build cost recouped here' },
        { x: 'Q2', y: 60 },
        { x: 'Q3', y: 145 },
        { x: 'Q4', y: 250 },
      ],
      footnote: 'Modeled at conservative 30% per-component savings × ~10 features/quarter, derived from Sparkbox 47% baseline',
    },
  },

  // SECTION 04 — The Ask
  { type: 'section', number: '04', title: 'The Ask' },

  // 10. Rollout
  {
    type: 'rollout',
    eyebrow: 'How we get there',
    title: '~1 week to v1. Shippable at every phase.',
    phases: [
      { num: '1', name: 'Setup', time: '1 day', what: 'Scaffold apps/storybook, get Button rendering on web.' },
      { num: '2', name: 'Triage', time: '½ day', what: 'Run grep script, bucket all 69 components, confirm v1 scope.' },
      { num: '3', name: 'Pure stories', time: '1-2 days', what: 'Generate stories for ~40 pure components.' },
      { num: '4', name: 'Shims', time: '2-3 days', what: 'Write ~15 .web.tsx shims for soft-coupled components.' },
      { num: '5', name: 'Deploy', time: '½ day', what: 'Vercel hookup, GH Action for per-PR previews.' },
      { num: '6', name: 'Hard-coupled', time: 'TBD', what: 'Defer or stub with fixtures, decide based on demand.' },
    ],
  },

  // 11. The ask
  {
    type: 'ask',
    eyebrow: 'The ask',
    title: 'Half a day. One spike. Decide from there.',
    body: 'Spin up apps/storybook on a branch. Get a single component (Button) rendering on web. Deploy to a Vercel preview. Total time including review: half a day. If it doesn\'t feel right, we delete the branch. If it does, we have the foundation for everything above.',
    pillarStats: [
      { stat: '1 wk', label: 'to v1' },
      { stat: '0', label: 'edits to apps/native' },
      { stat: '∞', label: 'compounding velocity' },
    ],
  },

  // 12. End
  { type: 'end', title: 'Questions?', subtitle: 'Living Design System · Proposal for the rosebud-react team' },
];

// ═══════════════════════════════════════════════════════════
// Section labeling helper for top-of-screen chrome
// ═══════════════════════════════════════════════════════════
function getSectionForSlide(idx) {
  if (idx === 0 || idx === 1) return 'Cover';
  if (idx >= 2 && idx <= 6) return 'The Idea';
  if (idx >= 7 && idx <= 10) return 'The Proposal';
  if (idx >= 11 && idx <= 17) return 'The Workflow';
  return 'The Ask';
}

// ═══════════════════════════════════════════════════════════
// Main component
// ═══════════════════════════════════════════════════════════
export function LivingDesignSystemPresentation() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showHints, setShowHints] = useState(true);
  const totalSlides = slides.length;

  useEffect(() => {
    if (currentSlide <= 1) setShowHints(true);
    else if (currentSlide >= 3) setShowHints(false);
  }, [currentSlide]);

  const handleKeyDown = useCallback(
    (e) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
        case 'Enter':
          e.preventDefault();
          setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setCurrentSlide((prev) => Math.max(prev - 1, 0));
          break;
        case 'Home':
          e.preventDefault();
          setCurrentSlide(0);
          break;
        case 'End':
          e.preventDefault();
          setCurrentSlide(totalSlides - 1);
          break;
        case 'Escape':
          navigate('/living-design-system');
          break;
        case 'f':
        case 'F':
          if (!e.metaKey && !e.ctrlKey) {
            if (document.fullscreenElement) document.exitFullscreen();
            else document.documentElement.requestFullscreen();
          }
          break;
      }
    },
    [totalSlides, navigate],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const [touchStart, setTouchStart] = useState(0);
  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) setCurrentSlide((p) => Math.min(p + 1, totalSlides - 1));
      else setCurrentSlide((p) => Math.max(p - 1, 0));
    }
  };

  const progress = ((currentSlide + 1) / totalSlides) * 100;
  const slide = slides[currentSlide];
  const sectionLabel = getSectionForSlide(currentSlide);

  return (
    <div
      className="fixed inset-0 bg-[#0F0E0E] text-white overflow-hidden"
      style={{ fontFamily: "'Circular Std', -apple-system, BlinkMacSystemFont, sans-serif" }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Progress bar / scrubber */}
      <div
        className="fixed bottom-0 left-0 right-0 h-[12px] group z-50 cursor-pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = (e.clientX - rect.left) / rect.width;
          setCurrentSlide(Math.max(0, Math.min(Math.floor(pct * totalSlides), totalSlides - 1)));
        }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/[0.06] group-hover:h-[5px] transition-all" />
        <div
          className="absolute bottom-0 left-0 h-[3px] group-hover:h-[5px] transition-all"
          style={{ width: `${progress}%`, backgroundColor: ROSE }}
        />
      </div>

      {/* Back button */}
      <button
        onClick={() => navigate('/living-design-system')}
        className="fixed top-6 left-8 p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors z-50 cursor-pointer"
        title="Back to proposal (Esc)"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-white/60">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
      </button>

      {/* Section label */}
      {currentSlide > 0 && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 text-[11px] uppercase tracking-[0.18em] text-white/40 font-[600]">
          {sectionLabel}
        </div>
      )}

      {/* Wordmark */}
      <div className="fixed top-7 right-8 z-50 flex items-center gap-[8px] opacity-70">
        <svg viewBox="0 0 624 625" className="w-[18px] h-[18px]">
          <path d="M311.967 624.001C453.872 624.001 568.909 508.965 568.909 367.06C311.967 367.06 311.967 146.825 55.0264 146.825V367.06C55.0264 508.965 170.063 624.001 311.967 624.001Z" fill={ROSE} />
          <path d="M568.892 330.351H568.89C454.438 330.351 398.969 283.183 335.836 229.069L335.234 228.554C324.055 218.971 312.645 209.192 300.698 199.565C368.911 102.779 432.929 9.22867e-05 568.892 0V330.351Z" fill={ROSE} />
          <path opacity="0.6" d="M111.278 176.34C111.278 167.699 111.61 159.059 112.109 150.418C94.661 147.593 75.7177 145.931 55.1128 145.599V365.939C55.1128 508.179 170.932 623.999 313.339 623.999C360.863 623.999 405.397 611.038 443.615 588.605C253.684 547.561 111.278 378.568 111.278 176.34Z" fill="#B81457" />
        </svg>
        <span className="text-[13px] font-[600] text-white/70">rosebud</span>
      </div>

      {/* Page number */}
      {currentSlide > 0 && (
        <div className="fixed bottom-8 right-8 z-50 text-[12px] tabular-nums text-white/40">
          {String(currentSlide + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
        </div>
      )}

      {/* Nav hints */}
      <div
        className="fixed bottom-6 left-8 z-50 text-[11px] tracking-wide text-white/40 flex items-center gap-[6px] transition-opacity duration-700 pointer-events-none"
        style={{ opacity: showHints ? 1 : 0 }}
      >
        <span className="text-[13px]">←</span>
        <span className="text-[13px]">→</span>
        <span className="ml-[4px]">navigate</span>
        <span className="mx-[6px] opacity-40">·</span>
        <span>ESC exit</span>
        <span className="mx-[6px] opacity-40">·</span>
        <span>F fullscreen</span>
      </div>

      {/* Slide stage */}
      <div className="w-full h-full flex items-center justify-center px-[6%] py-[8%]">
        <AnimatePresence mode="wait">
          <SlideRenderer key={currentSlide} slide={slide} />
        </AnimatePresence>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Slide renderer
// ═══════════════════════════════════════════════════════════
function SlideRenderer({ slide }) {
  switch (slide.type) {
    case 'title': return <TitleSlide slide={slide} />;
    case 'manifesto': return <ManifestoSlide slide={slide} />;
    case 'section': return <SectionSlide slide={slide} />;
    case 'what-is': return <WhatIsSlide slide={slide} />;
    case 'featured-gluestack': return <FeaturedGluestackSlide slide={slide} />;
    case 'problem': return <ProblemSlide slide={slide} />;
    case 'industry-benchmark': return <IndustryBenchmarkSlide slide={slide} />;
    case 'pull-quote': return <PullQuoteSlide slide={slide} />;
    case 'compound-velocity': return <CompoundVelocitySlide slide={slide} />;
    case 'architecture': return <ArchitectureSlide slide={slide} />;
    case 'fit': return <FitSlide slide={slide} />;
    case 'triage': return <TriageSlide slide={slide} />;
    case 'trifecta': return <TrifectaSlide slide={slide} />;
    case 'walkthrough': return <WalkthroughSlide slide={slide} />;
    case 'source-of-truth': return <SourceOfTruthSlide slide={slide} />;
    case 'value': return <ValueSlide slide={slide} />;
    case 'rollout': return <RolloutSlide slide={slide} />;
    case 'ask': return <AskSlide slide={slide} />;
    case 'end': return <EndSlide slide={slide} />;
    default: return null;
  }
}

// ═══════════════════════════════════════════════════════════
// Shared shell + Eyebrow
// ═══════════════════════════════════════════════════════════
function SlideShell({ children, width = 'xl', className = '' }) {
  const widths = {
    md: 'max-w-3xl',
    lg: 'max-w-4xl',
    xl: 'max-w-5xl',
    '2xl': 'max-w-6xl',
  };
  return (
    <motion.div
      className={`w-full ${widths[width]} ${className}`}
      variants={slideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children, color = ROSE }) {
  return (
    <span className="inline-block text-[11px] font-[700] tracking-[0.22em] uppercase mb-[16px]" style={{ color }}>
      {children}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════
// 1. Title slide — bottom-left composition with rose corner glow
// (Mirrors the Patterns deck TitleSlide for visual consistency)
// ═══════════════════════════════════════════════════════════
function TitleSlide({ slide }) {
  return (
    <motion.div
      className="fixed inset-0 flex items-end justify-start pl-[6%] pb-[10%]"
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Soft rose glow in the corner — matches Patterns deck */}
      <div
        className="absolute top-0 right-0 w-[60%] h-[60%] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top right, rgba(227,22,101,0.18) 0%, rgba(227,22,101,0) 60%)',
        }}
      />

      <div className="relative max-w-3xl">
        <motion.div
          className="text-[11px] uppercase tracking-[0.22em] text-white/40 mb-[18px] font-[600]"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.2, ease } }}
        >
          {slide.eyebrow}
        </motion.div>

        <motion.h1
          className="text-[clamp(3rem,6.5vw,5.5rem)] font-[700] tracking-[-0.03em] leading-[1.02] mb-[24px]"
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, delay: 0.3, ease } }}
        >
          {slide.title.map((line, i) => (
            <span key={i} className={i === 1 ? 'block' : 'block'} style={i === 1 ? { color: ROSE } : {}}>
              {line}
            </span>
          ))}
        </motion.h1>

        <motion.p
          className="text-[clamp(1.125rem,1.6vw,1.5rem)] text-white/55 leading-relaxed mb-[36px] max-w-xl font-[450]"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.45, ease } }}
        >
          {slide.subtitle}
        </motion.p>

        <motion.div
          className="w-full max-w-md h-px bg-white/[0.1] mb-[20px]"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1, transition: { duration: 0.6, delay: 0.55, ease } }}
        />

        <motion.div
          className="flex gap-[40px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.65 } }}
        >
          {slide.metadata.map((item) => (
            <div key={item.label}>
              <div className="text-[10px] uppercase tracking-[0.14em] text-white/35 mb-[4px] font-[600]">
                {item.label}
              </div>
              <div className="text-[15px] text-white/85 font-[500]">{item.value}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// 2. Manifesto slide
// ═══════════════════════════════════════════════════════════
function ManifestoSlide({ slide }) {
  return (
    <SlideShell width="lg">
      <Eyebrow>{slide.eyebrow}</Eyebrow>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="flex flex-col gap-[20px] mb-[40px]"
      >
        {slide.lines.map((line, i) => (
          <motion.p
            key={i}
            variants={staggerItem}
            className="text-[clamp(2rem,3.5vw,2.75rem)] leading-[1.15] font-[700] tracking-[-0.025em] text-white"
          >
            {line}
          </motion.p>
        ))}
      </motion.div>
      <p className="text-[18px] md:text-[20px] leading-[1.5] font-[450] italic text-white/55 max-w-[600px]">
        {slide.closing}
      </p>
    </SlideShell>
  );
}

// ═══════════════════════════════════════════════════════════
// Section divider — giant faded number behind the title
// (Mirrors the Patterns deck SectionSlide for visual consistency)
// ═══════════════════════════════════════════════════════════
function SectionSlide({ slide }) {
  return (
    <motion.div
      className="text-center relative"
      variants={sectionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[clamp(12rem,22vw,20rem)] text-white/[0.04] select-none pointer-events-none font-[700] leading-none"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1, transition: { delay: 0.1, duration: 0.8, ease } }}
      >
        {slide.number}
      </motion.div>
      <h2 className="relative text-[clamp(2.5rem,5.5vw,4.5rem)] font-[700] tracking-[-0.02em] leading-[1.1]">
        {slide.title}
      </h2>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// 3. What is Storybook slide
// ═══════════════════════════════════════════════════════════
function WhatIsSlide({ slide }) {
  return (
    <SlideShell width="2xl">
      <Eyebrow>{slide.eyebrow}</Eyebrow>
      <h2 className="text-[clamp(2rem,4vw,3rem)] leading-[1.1] font-[700] tracking-[-0.025em] text-white mb-[16px] max-w-[900px]">
        {slide.title}
      </h2>
      <p className="text-[clamp(0.95rem,1.3vw,1.125rem)] leading-[1.55] font-[450] text-white/60 mb-[32px] max-w-[700px]">
        {slide.body}
      </p>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 md:grid-cols-4 gap-[12px]"
      >
        {slide.examples.map((ex) => (
          <motion.a
            key={ex.org}
            href={ex.url}
            target="_blank"
            rel="noreferrer"
            variants={staggerItem}
            className="rounded-[10px] overflow-hidden bg-white/[0.03] border border-white/10 flex flex-col group hover:border-white/30 transition-colors"
          >
            {/* Browser-chrome bar */}
            <div className="px-[10px] py-[6px] flex items-center gap-[5px] bg-white/[0.04] border-b border-white/[0.08]">
              <span className="w-[7px] h-[7px] rounded-full bg-white/15" />
              <span className="w-[7px] h-[7px] rounded-full bg-white/15" />
              <span className="w-[7px] h-[7px] rounded-full bg-white/15" />
            </div>
            {/* Screenshot */}
            <div className="aspect-[16/10] bg-white overflow-hidden">
              <img
                src={ex.image}
                alt={`${ex.org} ${ex.system} screenshot`}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                loading="eager"
              />
            </div>
            {/* Caption */}
            <div className="px-[12px] py-[10px] border-t border-white/[0.08] flex items-center justify-between gap-[6px]">
              <div className="min-w-0 flex-1">
                <div className="text-[9px] font-[700] tracking-[0.22em] uppercase mb-[2px] text-white/45">
                  {ex.org}
                </div>
                <div className="text-[13px] font-[700] text-white truncate">{ex.system}</div>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[12px] h-[12px] shrink-0 text-white/30 group-hover:text-white/70 transition-colors">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </SlideShell>
  );
}

// ═══════════════════════════════════════════════════════════
// 4. Problem slide
// ═══════════════════════════════════════════════════════════
function ProblemSlide({ slide }) {
  return (
    <SlideShell width="2xl">
      <Eyebrow>{slide.eyebrow}</Eyebrow>
      <h2 className="text-[clamp(2rem,4vw,3rem)] leading-[1.1] font-[700] tracking-[-0.025em] text-white mb-[36px] max-w-[900px]">
        {slide.title}
      </h2>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-3 gap-[16px] mb-[24px]"
      >
        {slide.stats.map((s) => (
          <motion.div key={s.value} variants={staggerItem} className="p-[24px] rounded-[14px] bg-white/[0.04] border border-white/10 flex flex-col">
            <div className="text-[clamp(2.5rem,5vw,3.75rem)] leading-[1] font-[700] tracking-[-0.03em] mb-[12px]" style={{ color: ROSE }}>
              {s.value}
            </div>
            <p className="text-[14px] leading-[20px] font-[450] text-white/80 flex-1 mb-[10px]">{s.label}</p>
            <div className="text-[10px] leading-[14px] font-[500] text-white/40 italic">
              {s.source}
            </div>
          </motion.div>
        ))}
      </motion.div>
      <p className="text-[15px] leading-[1.5] font-[500] italic text-white/65">{slide.closing}</p>
    </SlideShell>
  );
}

// ═══════════════════════════════════════════════════════════
// Industry benchmark — what comparable companies did
// ═══════════════════════════════════════════════════════════
function IndustryBenchmarkSlide({ slide }) {
  return (
    <SlideShell width="2xl">
      <Eyebrow>{slide.eyebrow}</Eyebrow>
      <h2 className="text-[clamp(1.875rem,3.5vw,2.625rem)] leading-[1.15] font-[700] tracking-[-0.025em] text-white mb-[28px] max-w-[900px]">
        {slide.title}
      </h2>

      {/* Headline McKinsey stat */}
      <div className="mb-[28px] p-[24px] rounded-[14px] border" style={{ backgroundColor: `${ROSE}10`, borderColor: `${ROSE}40` }}>
        <div className="flex flex-col md:flex-row md:items-center gap-[16px] md:gap-[28px]">
          <div className="text-[clamp(3rem,6vw,4.5rem)] leading-[1] font-[700] tracking-[-0.03em] shrink-0" style={{ color: ROSE }}>
            {slide.headlineStat.value}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] leading-[22px] font-[500] text-white/85 mb-[6px]">{slide.headlineStat.desc}</p>
            <div className="text-[11px] leading-[16px] font-[500] text-white/45 italic">{slide.headlineStat.source}</div>
          </div>
        </div>
      </div>

      {/* Company tiles */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 md:grid-cols-4 gap-[12px]"
      >
        {slide.companies.map((c) => (
          <motion.div
            key={c.name}
            variants={staggerItem}
            className="p-[16px] rounded-[12px] bg-white/[0.04] border border-white/10"
          >
            <div className="text-[10px] font-[700] tracking-[0.22em] uppercase text-white/45 mb-[2px]">{c.name}</div>
            <div className="text-[15px] font-[700] text-white mb-[8px]">{c.system}</div>
            <p className="text-[12px] leading-[17px] font-[450] text-white/65">{c.proof}</p>
          </motion.div>
        ))}
      </motion.div>
    </SlideShell>
  );
}

// ═══════════════════════════════════════════════════════════
// Pull-quote — Saarinen on Airbnb DLS payoff
// ═══════════════════════════════════════════════════════════
function PullQuoteSlide({ slide }) {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center px-[8%]"
      variants={sectionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Soft rose glow behind quote */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(227,22,101,0.10) 0%, rgba(227,22,101,0) 60%)',
        }}
      />
      <div className="relative max-w-4xl">
        <div className="text-[clamp(4rem,8vw,7rem)] leading-[0.5] font-[700] mb-[-10px]" style={{ color: ROSE }}>
          “
        </div>
        <blockquote className="text-[clamp(1.5rem,2.8vw,2.25rem)] leading-[1.35] font-[500] tracking-[-0.015em] text-white/95 mb-[32px]">
          {slide.quote}
        </blockquote>
        <div className="flex items-baseline gap-[12px] flex-wrap">
          <div className="w-[24px] h-[1px]" style={{ backgroundColor: ROSE }} />
          <div className="text-[16px] font-[700] text-white">{slide.attribution}</div>
          <div className="text-[14px] font-[450] text-white/60">— {slide.role}</div>
        </div>
        <div className="mt-[8px] ml-[36px] text-[11px] font-[500] italic text-white/40">{slide.source}</div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// Compound velocity — bar chart + cumulative line chart
// ═══════════════════════════════════════════════════════════
function CompoundVelocitySlide({ slide }) {
  const { barChart, lineChart } = slide;

  // Bar chart: 2 bars
  const maxBar = Math.max(...barChart.bars.map((b) => b.value));

  // Line chart geometry
  const lineW = 600;
  const lineH = 180;
  const padX = 40;
  const padY = 20;
  const maxY = Math.max(...lineChart.points.map((p) => p.y));
  const stepX = (lineW - padX * 2) / (lineChart.points.length - 1);
  const yScale = (v) => padY + (1 - v / maxY) * (lineH - padY * 2);
  const lineCoords = lineChart.points.map((p, i) => [padX + i * stepX, yScale(p.y)]);
  const linePath = lineCoords.map(([x, y], i) => (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`)).join(' ');
  const areaPath = `${linePath} L ${lineCoords[lineCoords.length - 1][0]} ${lineH - padY} L ${padX} ${lineH - padY} Z`;

  return (
    <SlideShell width="2xl">
      <Eyebrow>{slide.eyebrow}</Eyebrow>
      <h2 className="text-[clamp(2rem,4vw,3rem)] leading-[1.15] font-[700] tracking-[-0.025em] text-white mb-[12px]">
        {slide.title}
      </h2>
      <p className="text-[14px] md:text-[15px] leading-[1.55] font-[450] text-white/65 mb-[28px] max-w-[800px]">
        {slide.body}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
        {/* Bar chart */}
        <div className="p-[24px] rounded-[14px] bg-white/[0.04] border border-white/10">
          <div className="text-[11px] font-[700] tracking-[0.18em] uppercase text-white/45 mb-[20px]">{barChart.label}</div>
          <div className="flex items-end gap-[20px] h-[180px] mb-[16px]">
            {barChart.bars.map((b) => {
              const heightPct = (b.value / maxBar) * 100;
              return (
                <div key={b.name} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div className="text-[18px] font-[700] mb-[6px]" style={{ color: b.highlight ? ROSE : 'rgba(255,255,255,0.5)' }}>
                    {b.value} {b.unit}
                  </div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPct}%` }}
                    transition={{ duration: 0.9, ease, delay: b.highlight ? 0.4 : 0.2 }}
                    className="w-full rounded-t-[6px]"
                    style={{ backgroundColor: b.highlight ? ROSE : 'rgba(255,255,255,0.18)' }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex items-end gap-[20px]">
            {barChart.bars.map((b) => (
              <div key={b.name} className="flex-1 text-center text-[12px] font-[500] text-white/65">{b.name}</div>
            ))}
          </div>
          <div className="mt-[16px] pt-[12px] border-t border-white/[0.06] text-[10px] leading-[14px] font-[500] italic text-white/40">
            {barChart.footnote}
          </div>
        </div>

        {/* Line chart */}
        <div className="p-[24px] rounded-[14px] bg-white/[0.04] border border-white/10">
          <div className="text-[11px] font-[700] tracking-[0.18em] uppercase text-white/45 mb-[16px]">{lineChart.label}</div>
          <svg viewBox={`0 0 ${lineW} ${lineH + 32}`} className="w-full h-auto">
            {/* horizontal gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
              const y = padY + t * (lineH - padY * 2);
              return <line key={i} x1={padX} y1={y} x2={lineW - padX} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />;
            })}
            {/* area under curve */}
            <motion.path
              d={areaPath}
              fill={ROSE}
              fillOpacity="0.12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            />
            {/* line */}
            <motion.path
              d={linePath}
              fill="none"
              stroke={ROSE}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease, delay: 0.3 }}
            />
            {/* dots + values */}
            {lineCoords.map(([x, y], i) => (
              <g key={i}>
                <motion.circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill={ROSE}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 + i * 0.18 }}
                />
                <text x={x} y={y - 12} textAnchor="middle" fill="white" fillOpacity="0.85" fontSize="11" fontWeight="700">
                  {lineChart.points[i].y}
                </text>
                <text x={x} y={lineH + 18} textAnchor="middle" fill="white" fillOpacity="0.5" fontSize="11" fontWeight="600">
                  {lineChart.points[i].x}
                </text>
              </g>
            ))}
          </svg>
          <div className="mt-[8px] pt-[12px] border-t border-white/[0.06] text-[10px] leading-[14px] font-[500] italic text-white/40">
            {lineChart.footnote}
          </div>
        </div>
      </div>
    </SlideShell>
  );
}

// ═══════════════════════════════════════════════════════════
// 5. Architecture slide
// ═══════════════════════════════════════════════════════════
function ArchitectureSlide({ slide }) {
  const toneMap = {
    rose: { bg: `${ROSE}10`, border: `${ROSE}55`, label: ROSE },
    neutral: { bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.12)', label: 'rgba(255,255,255,0.55)' },
  };
  return (
    <SlideShell width="2xl">
      <Eyebrow>{slide.eyebrow}</Eyebrow>
      <h2 className="text-[clamp(2rem,4vw,3rem)] leading-[1.15] font-[700] tracking-[-0.025em] text-white mb-[40px] max-w-[900px]">
        {slide.title}
      </h2>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="flex flex-col md:flex-row items-stretch md:items-center gap-[8px] mb-[28px]"
      >
        {slide.boxes.map((b, i) => (
          <Fragment key={b.name}>
            <motion.div
              variants={staggerItem}
              className="flex-1 min-w-[200px] p-[20px] rounded-[12px] border"
              style={{ backgroundColor: toneMap[b.tone].bg, borderColor: toneMap[b.tone].border }}
            >
              <div className="font-mono text-[13px] leading-[18px] font-[600] mb-[6px]" style={{ color: toneMap[b.tone].label }}>
                {b.name}
              </div>
              <div className="text-[13px] leading-[18px] font-[450] text-white/65">{b.sub}</div>
            </motion.div>
            {i < slide.boxes.length - 1 && (
              <motion.div variants={staggerItem} className="hidden md:flex items-center justify-center w-[40px] shrink-0">
                <svg viewBox="0 0 40 16" fill="none" className="w-full h-[12px]">
                  <line x1="0" y1="8" x2="34" y2="8" stroke={ROSE} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
                  <polyline points="30 3 36 8 30 13" fill="none" stroke={ROSE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            )}
          </Fragment>
        ))}
      </motion.div>
      <p className="text-[14px] leading-[1.55] font-[450] italic text-white/55 max-w-[800px]">
        {slide.footer}
      </p>
    </SlideShell>
  );
}

// ═══════════════════════════════════════════════════════════
// 6. Fit slide (why this fits Rosebud)
// ═══════════════════════════════════════════════════════════
function FitSlide({ slide }) {
  return (
    <SlideShell width="xl">
      <Eyebrow>{slide.eyebrow}</Eyebrow>
      <h2 className="text-[clamp(2rem,4vw,3rem)] leading-[1.15] font-[700] tracking-[-0.025em] text-white mb-[36px] max-w-[800px]">
        {slide.title}
      </h2>
      <motion.ul
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="flex flex-col gap-[14px]"
      >
        {slide.items.map((it) => (
          <motion.li key={it.code} variants={staggerItem} className="flex items-start gap-[16px]">
            <div className="shrink-0 mt-[2px]">
              <code className="font-mono text-[13px] leading-[20px] font-[600] px-[10px] py-[3px] rounded-[6px] bg-white/[0.06] border border-white/15 text-white/85">
                {it.code}
              </code>
            </div>
            <span className="text-[16px] leading-[24px] font-[450] text-white/75 flex-1">{it.text}</span>
          </motion.li>
        ))}
      </motion.ul>
    </SlideShell>
  );
}

// ═══════════════════════════════════════════════════════════
// 7. Triage slide
// ═══════════════════════════════════════════════════════════
function TriageSlide({ slide }) {
  return (
    <SlideShell width="2xl">
      <Eyebrow>{slide.eyebrow}</Eyebrow>
      <h2 className="text-[clamp(2.25rem,4.5vw,3.5rem)] leading-[1.1] font-[700] tracking-[-0.025em] text-white mb-[36px]">
        {slide.title}
      </h2>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-3 gap-[16px] mb-[24px]"
      >
        {slide.buckets.map((b) => (
          <motion.div
            key={b.name}
            variants={staggerItem}
            className="p-[24px] rounded-[14px] bg-white/[0.04] border border-white/10"
            style={{ borderTopColor: b.tone, borderTopWidth: 3 }}
          >
            <div className="flex items-baseline gap-[10px] mb-[12px]">
              <span className="text-[44px] leading-[44px] font-[700] tracking-[-0.02em]" style={{ color: b.tone }}>
                {b.count}
              </span>
              <span className="text-[16px] font-[700] text-white/85">{b.name}</span>
            </div>
            <p className="text-[14px] leading-[20px] font-[450] text-white/65">{b.desc}</p>
          </motion.div>
        ))}
      </motion.div>
      <p className="text-[16px] leading-[1.45] font-[500] text-white/65">{slide.note}</p>
    </SlideShell>
  );
}

// ═══════════════════════════════════════════════════════════
// 8. Trifecta slide
// ═══════════════════════════════════════════════════════════
function TrifectaSlide({ slide }) {
  return (
    <SlideShell width="2xl">
      <Eyebrow>{slide.eyebrow}</Eyebrow>
      <h2 className="text-[clamp(2.25rem,4.5vw,3.5rem)] leading-[1.1] font-[700] tracking-[-0.025em] text-white mb-[40px]">
        {slide.title}
      </h2>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-3 gap-[16px]"
      >
        {slide.pieces.map((p, i) => (
          <motion.div
            key={p.name}
            variants={staggerItem}
            className="p-[24px] rounded-[14px] bg-white/[0.04] border border-white/10 relative"
          >
            <div className="absolute top-0 left-0 w-[40px] h-[2px]" style={{ backgroundColor: ROSE }} />
            <div className="flex items-baseline gap-[10px] mb-[10px]">
              <span className="text-[36px] leading-[36px] font-[700] tracking-[-0.02em]" style={{ color: ROSE }}>
                0{i + 1}
              </span>
              <span className="text-[20px] font-[700] text-white">{p.name}</span>
            </div>
            <div className="text-[11px] font-[700] tracking-[0.22em] uppercase mb-[12px] text-white/40">
              {p.role}
            </div>
            <p className="text-[14px] leading-[20px] font-[450] text-white/65">{p.body}</p>
          </motion.div>
        ))}
      </motion.div>
    </SlideShell>
  );
}

// ═══════════════════════════════════════════════════════════
// 9. Walkthrough slide
// ═══════════════════════════════════════════════════════════
function WalkthroughSlide({ slide }) {
  return (
    <SlideShell width="xl">
      <Eyebrow>{slide.eyebrow}</Eyebrow>
      <h2 className="text-[clamp(2rem,3.5vw,2.75rem)] leading-[1.15] font-[700] tracking-[-0.025em] text-white mb-[32px]">
        {slide.title}
      </h2>
      <motion.ol
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="flex flex-col gap-[14px] mb-[28px]"
      >
        {slide.steps.map((s, i) => (
          <motion.li key={i} variants={staggerItem} className="flex items-start gap-[16px]">
            <div
              className="shrink-0 w-[28px] h-[28px] rounded-full flex items-center justify-center text-[12px] font-[700] mt-[1px]"
              style={{ backgroundColor: `${ROSE}25`, color: ROSE }}
            >
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-[700] tracking-[0.18em] uppercase text-white/40 mb-[2px]">{s.who}</div>
              <p className="text-[16px] leading-[22px] font-[500] text-white/85">{s.text}</p>
            </div>
          </motion.li>
        ))}
      </motion.ol>
      <p className="text-[15px] leading-[1.5] font-[500] italic" style={{ color: ROSE }}>
        {slide.closing}
      </p>
    </SlideShell>
  );
}

// ═══════════════════════════════════════════════════════════
// 10. Rollout slide
// ═══════════════════════════════════════════════════════════
function RolloutSlide({ slide }) {
  return (
    <SlideShell width="2xl">
      <Eyebrow>{slide.eyebrow}</Eyebrow>
      <h2 className="text-[36px] md:text-[48px] leading-[1.15] font-[700] tracking-[-0.025em] text-white mb-[36px]">
        {slide.title}
      </h2>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 gap-x-[24px] gap-y-[16px]"
      >
        {slide.phases.map((p) => (
          <motion.div key={p.num} variants={staggerItem} className="flex items-start gap-[16px] p-[16px] rounded-[12px] bg-white/[0.04] border border-white/10">
            <div
              className="shrink-0 w-[32px] h-[32px] rounded-full flex items-center justify-center text-[14px] font-[700] mt-[1px]"
              style={{ backgroundColor: `${ROSE}25`, color: ROSE }}
            >
              {p.num}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-[12px] mb-[2px]">
                <span className="text-[16px] font-[700] text-white">{p.name}</span>
                <span className="shrink-0 text-[11px] font-[600] tracking-[0.06em] uppercase text-white/40">{p.time}</span>
              </div>
              <p className="text-[13px] leading-[18px] font-[450] text-white/60">{p.what}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </SlideShell>
  );
}

// ═══════════════════════════════════════════════════════════
// 11. Ask slide (the closing pitch)
// ═══════════════════════════════════════════════════════════
function AskSlide({ slide }) {
  return (
    <SlideShell width="xl">
      <Eyebrow>{slide.eyebrow}</Eyebrow>
      <h2 className="text-[clamp(2.75rem,5vw,4rem)] leading-[1.05] font-[700] tracking-[-0.03em] text-white mb-[28px] max-w-[900px]">
        {slide.title}
      </h2>
      <p className="text-[18px] md:text-[20px] leading-[1.55] font-[450] text-white/70 mb-[48px] max-w-[800px]">
        {slide.body}
      </p>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="flex flex-wrap gap-[40px]"
      >
        {slide.pillarStats.map((s) => (
          <motion.div key={s.label} variants={staggerItem}>
            <div className="text-[clamp(3rem,6vw,4.5rem)] leading-[1] font-[700] tracking-[-0.03em] mb-[6px]" style={{ color: ROSE }}>
              {s.stat}
            </div>
            <div className="text-[11px] font-[700] tracking-[0.18em] uppercase text-white/45">{s.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </SlideShell>
  );
}

// ═══════════════════════════════════════════════════════════
// Featured Gluestack — full-page screenshot scrolls within a frame
// ═══════════════════════════════════════════════════════════
function FeaturedGluestackSlide({ slide }) {
  const frameHeight = 540;
  const imageWidth = 1400;
  const aspectRatio = slide.imageHeight / imageWidth;

  const viewportRef = useRef(null);
  const [scrollAmount, setScrollAmount] = useState(0);

  useEffect(() => {
    const update = () => {
      if (viewportRef.current) {
        const w = viewportRef.current.offsetWidth;
        const displayedImageHeight = w * aspectRatio;
        // Stop scrolling exactly when bottom of image meets bottom of frame
        setScrollAmount(Math.max(0, displayedImageHeight - frameHeight));
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [aspectRatio]);

  return (
    <SlideShell width="2xl">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-[40px] items-center">
        {/* Left — copy */}
        <div>
          <Eyebrow>{slide.eyebrow}</Eyebrow>
          <h2 className="text-[clamp(1.875rem,3.5vw,2.625rem)] leading-[1.15] font-[700] tracking-[-0.025em] text-white mb-[20px]">
            {slide.title}
          </h2>
          <p className="text-[14px] md:text-[15px] leading-[1.55] font-[450] text-white/65 mb-[24px]">
            {slide.body}
          </p>
          <a
            href={slide.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-[6px] text-[12px] font-[600] text-white/70 hover:text-white transition-colors"
          >
            <span>Open gluestack.io</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[12px] h-[12px]">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>

        {/* Right — animated browser frame, dark mode chrome */}
        <div className="rounded-[12px] overflow-hidden bg-[#0F0E0E] border border-white/10 shadow-2xl">
          {/* Browser chrome — dark */}
          <div className="px-[12px] py-[8px] flex items-center gap-[6px] bg-white/[0.05] border-b border-white/[0.06]">
            <span className="w-[10px] h-[10px] rounded-full bg-[#FF5F57]" />
            <span className="w-[10px] h-[10px] rounded-full bg-[#FEBC2E]" />
            <span className="w-[10px] h-[10px] rounded-full bg-[#28C840]" />
            <div className="flex-1 mx-[12px] px-[10px] py-[3px] rounded-[4px] bg-white/[0.04] border border-white/[0.06] text-[10px] text-white/55 font-mono truncate">
              gluestack.io/ui/docs/components/button
            </div>
          </div>
          {/* Scrolling viewport — fixed height, image scrolls inside */}
          <div ref={viewportRef} className="relative bg-[#0F0E0E] overflow-hidden" style={{ height: frameHeight }}>
            <motion.img
              src={slide.image}
              alt="Gluestack UI Button docs page"
              className="w-full block"
              initial={{ y: 0 }}
              animate={{ y: -scrollAmount }}
              transition={{
                duration: 30,
                ease: 'linear',
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
            {/* Soft dark gradients at top + bottom to suggest more content */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[20px] bg-gradient-to-b from-[#0F0E0E]/70 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[20px] bg-gradient-to-t from-[#0F0E0E]/70 to-transparent" />
          </div>
        </div>
      </div>
    </SlideShell>
  );
}

// ═══════════════════════════════════════════════════════════
// Source of truth — what the system IS for the company
// ═══════════════════════════════════════════════════════════
function SourceOfTruthSlide({ slide }) {
  return (
    <SlideShell width="2xl">
      <Eyebrow>{slide.eyebrow}</Eyebrow>
      <h2 className="text-[clamp(2.25rem,4.5vw,3.5rem)] leading-[1.1] font-[700] tracking-[-0.025em] text-white mb-[36px] max-w-[800px]">
        {slide.title}
      </h2>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-3 gap-[14px]"
      >
        {slide.cards.map((c, i) => (
          <motion.div
            key={c.h}
            variants={staggerItem}
            className="p-[20px] rounded-[12px] bg-white/[0.04] border border-white/10 relative"
          >
            <div className="text-[10px] font-[700] tracking-[0.2em] mb-[10px]" style={{ color: ROSE }}>
              0{i + 1}
            </div>
            <div className="text-[15px] leading-[20px] font-[700] text-white mb-[6px]">{c.h}</div>
            <p className="text-[12px] leading-[18px] font-[450] text-white/60">{c.b}</p>
          </motion.div>
        ))}
      </motion.div>
    </SlideShell>
  );
}

// ═══════════════════════════════════════════════════════════
// Value — three audiences, three columns
// ═══════════════════════════════════════════════════════════
function ValueSlide({ slide }) {
  return (
    <SlideShell width="2xl">
      <Eyebrow>{slide.eyebrow}</Eyebrow>
      <h2 className="text-[clamp(2.25rem,4.5vw,3.5rem)] leading-[1.1] font-[700] tracking-[-0.025em] text-white mb-[40px] max-w-[900px]">
        {slide.title}
      </h2>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-3 gap-[24px]"
      >
        {slide.columns.map((col) => (
          <motion.div key={col.label} variants={staggerItem} className="p-[24px] rounded-[14px] bg-white/[0.04] border border-white/10">
            <div className="flex items-center gap-[10px] mb-[16px]">
              <div className="w-[28px] h-[1px]" style={{ backgroundColor: ROSE }} />
              <div className="text-[11px] font-[700] tracking-[0.22em] uppercase" style={{ color: ROSE }}>
                {col.label}
              </div>
            </div>
            <ul className="flex flex-col gap-[10px]">
              {col.items.map((item) => (
                <li key={item} className="flex items-start gap-[10px]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[12px] h-[12px] mt-[5px] shrink-0 text-white/45">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-[14px] leading-[20px] font-[450] text-white/80">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </SlideShell>
  );
}

// ═══════════════════════════════════════════════════════════
// 12. End slide
// ═══════════════════════════════════════════════════════════
function EndSlide({ slide }) {
  return (
    <motion.div
      variants={sectionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col items-center justify-center text-center"
    >
      <h2 className="text-[80px] md:text-[120px] leading-[0.95] font-[700] tracking-[-0.04em] text-white mb-[24px]">
        {slide.title}
      </h2>
      <p className="text-[16px] md:text-[18px] leading-[1.5] font-[450] text-white/50 max-w-[600px]">
        {slide.subtitle}
      </p>
    </motion.div>
  );
}
