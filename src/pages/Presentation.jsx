/* ═══════════════════════════════════════════════════════════════════════════
   Pattern Discovery—Live Presentation
   Ported paradigm from Grace's portfolio decks (Cuboid Annotator etc.):
   dark full-bleed slides, framer-motion transitions, keyboard navigation,
   fixed nav chrome (back button, page number, hint, progress bar).

   Branding adapted for Rosebud:
   - Circular Std body font (loaded globally)
   - True black background (#0F0E0E) instead of generic dark
   - Rose #E31665 as primary accent, sage #5ABA9D + amber #E4AD51 secondary
   - "Mono" labels rendered as uppercase Circular Std with letter-spacing,
     no separate mono font

   Key move: slides 7–9 embed the actual interactive phone mockups from
   the concepts page (V5 onboarding, mid-conv V2, V3 Adaptive Patterns)
   so the deck is the artifact—Keynote couldn't do this.
   ═══════════════════════════════════════════════════════════════════════════ */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════
// Animation tokens—same easing curve as the portfolio decks
// ═══════════════════════════════════════════════════════════
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

// Rosebud accent palette for stagger cards
const ROSE = '#E31665';
const SAGE = '#5ABA9D';
const AMBER = '#E4AD51';
const accentColors = [ROSE, SAGE, AMBER];

// ═══════════════════════════════════════════════════════════
// Slide data—the deck spine. Each entry is one slide.
// Sections (numbered) act as visual chapter dividers.
// ═══════════════════════════════════════════════════════════
const slides = [
  // 1. Title
  {
    type: 'title',
    eyebrow: 'Rosebud · Design Trial',
    title: ['Pattern', 'Discovery'],
    subtitle: 'Helping Rosebud users see the patterns in their own writing.',
    metadata: [
      { label: 'Designer', value: 'Grace Guo' },
      { label: 'Duration', value: '3-day trial' },
      { label: 'Date', value: 'April 2026' },
    ],
  },

  // 2. Section: Framing
  { type: 'section', number: '01', title: 'Framing' },

  // 3. The problem
  {
    type: 'problem',
    eyebrow: 'The problem',
    title: 'Journaling tools stop at the entry.',
    body: "Weeks of honest writing pile up, but users rarely re-read and rarely spot their own patterns. The real design challenge is turning a private archive into something users can see themselves in—without making the writing itself feel watched in the moment.",
  },

  // 4. North star (the Jillian quote)
  {
    type: 'quote',
    eyebrow: 'North star',
    quote: '"I don\u2019t want overly validating insights. I want it to challenge me."',
    attribution: 'Jillian, from the user debrief',
    follow: 'That became the north star. Patterns isn\u2019t about telling users what they already know—it\u2019s about surfacing what they couldn\u2019t see on their own, in a way that builds over time instead of resetting each week.',
  },

  // 5. The setup—what I was given, what I built first
  {
    type: 'setup',
    eyebrow: 'The process',
    title: 'From brief to working prototype, in four days.',
    body: 'After being given a brief and Rosebud\u2019s Figma design system, I translated it into a working React design system using Claude Code so prototypes could feel like product, not static frames, and I could iterate more quickly.',
    cards: [
      {
        label: 'Wed · Apr 8',
        title: 'Brief, scope, design system',
        body: 'Read the brief. Synthesized findings. Narrowed scope around the north star. Ported Rosebud\u2019s Figma design system into React with Claude Code.',
      },
      {
        label: 'Thu · Apr 9',
        title: 'Onboarding + results flows',
        body: 'Built out the two load-bearing flows. Iterating surfaced the adjacent ones—tracking modalities, history, and bookmarks.',
      },
      {
        label: 'Fri · Apr 10',
        title: 'Sync + iterate',
        body: 'Mid-week sync with Chrys. Brought back three threads. Continued iterating and documenting the process.',
      },
      {
        label: 'Sat · Apr 11',
        title: 'Presentation',
        body: 'Prepared the presentation materials. Kept iterating on the work. The deck you\u2019re looking at right now.',
      },
    ],
  },

  // 6. Sequence — how the work built and where the sync inflected it
  {
    type: 'sequence',
    eyebrow: 'Sequence',
    title: 'How the work built on itself.',
    body: 'I started with the two load-bearing ends, then worked toward the middle. Mid-week, the sync with Chrys reshaped a focused second pass through what mattered most.',
    initial: [
      { num: '01', title: 'Onboarding', body: 'How users meet the idea of patterns.' },
      { num: '02', title: 'Patterns Results', body: 'Where insights actually land.' },
      { num: '03', title: 'Tracking modalities', body: 'How structured data lives next to writing.' },
      { num: '04', title: 'History & Bookmarks', body: 'User-driven revisiting of the archive.' },
    ],
    iteration: [
      { num: '05', title: 'Onboarding refinements', body: 'Opinionated defaults, integrations split from patterns.' },
      { num: '06', title: 'Results + empty state', body: 'V3 Adaptive surface with a threshold-based reveal.' },
      { num: '07', title: 'History + Chapters', body: 'Story of You at the top; Chapters as longitudinal anchor.' },
    ],
  },

  // 7. Section: Explorations
  { type: 'section', number: '02', title: 'Explorations' },

  // 8. Mid-week sync—the three threads from Chrys
  {
    type: 'threads',
    eyebrow: 'Mid-week sync',
    title: 'Feedback that reshaped what came next.',
    body: 'Mid-week I synced with Chrys. The conversation surfaced three threads—each became a section of the work I shipped after.',
    threads: [
      {
        num: 'I',
        prompt: '"Can the AI suggest patterns from writing instead of asking upfront?"',
        outcome: 'became Mid-Conversation Onboarding',
        accent: ROSE,
      },
      {
        num: 'II',
        prompt: '"How do we make this feel like it\u2019s building, not AI slop?"',
        outcome: 'became V3 Adaptive Patterns',
        accent: SAGE,
      },
      {
        num: 'III',
        prompt: '"Define KPIs upfront so the design can be evaluated against them."',
        outcome: 'became Success Metrics + MVP Scope',
        accent: AMBER,
      },
    ],
  },

  // 9. Bridge slide—hand off to the live concepts site for the
  //    interactive walkthrough. Replaces the four embedded-mockup slides.
  //    The deck pauses here while we explore the website together;
  //    Section 03 picks up after we come back.
  {
    type: 'bridge',
    eyebrow: 'The work',
    title: 'The prototypes are live. Let\u2019s walk through them.',
    body: 'Everything you\u2019ve heard about—V5 onboarding, mid-conversation flows, V3 Adaptive Patterns, History & Bookmarks—is built and navigable on the concepts site. Let\u2019s open it up.',
    ctaLabel: 'Open concepts site',
    ctaHref: '/concepts',
    helper: 'Opens in a new tab. Switch back here when we\u2019re done—we\u2019ll talk about what I\u2019d ship next.',
  },

  // 10. Section: Where next
  { type: 'section', number: '03', title: 'Where I\u2019d go next' },

  // 14. MVP scope table
  {
    type: 'scope-table',
    eyebrow: 'MVP Scope',
    title: 'What ships first—and what gets cut.',
    body: 'Opinionated bets on the first pass. The deferred column leads with the reason, since deferring is the hard part.',
    rows: [
      { flow: 'Onboarding', ships: 'V5 Curiosity-led + HealthKit integration only', deferred: 'Specialty app catalog. Ship after HealthKit proves the integration pattern.' },
      { flow: 'Mid-conv onboarding', ships: 'V2 Conversational', deferred: 'V1 Modal—only if V2 underperforms in tests.' },
      { flow: 'Quick tracking', ships: 'V1 Guided Stamp during onboarding week, V2 Inline thereafter', deferred: 'They\u2019re complementary. The onboarding-week split is the bet.' },
      { flow: 'Patterns Results', ships: 'V3 Adaptive—themes, people, highlights, emotional arc, echoes', deferred: 'Story of You audio, Bloom paywall, correlation Go Deeper.' },
      { flow: 'History & Bookmarks', ships: 'Archive + bookmark-while-journaling', deferred: 'Bookmarks browse surface—only valuable after week 4.' },
      { flow: 'Chapters', ships: 'Defer entirely past launch', deferred: 'Needs a year of data to feel earned. Story of You is the bigger near-term wedge.' },
    ],
  },

  // 15. Success metrics—what would prove this worked
  {
    type: 'metrics',
    eyebrow: 'Success Metrics',
    title: 'How we\u2019d know it\u2019s working.',
    body: 'No design polish matters if the surface doesn\u2019t change behavior. The numbers I\u2019d watch:',
    metrics: [
      { value: '> 70%', title: 'Onboarding completion', desc: 'V5 vs current baseline, 4-week cohort.' },
      { value: '> 40%', title: 'Day-7 Patterns visits', desc: 'Tab opens segmented by onboarding version.' },
      { value: '> 60%', title: 'Pattern unlock rate', desc: '% of new users crossing the entry threshold by day 14.' },
      { value: '+15%', title: '4-week retention lift', desc: 'A/B between new and old flows + qualitative interviews.' },
    ],
  },

  // 16. End
  { type: 'end', title: 'Thank you', subtitle: 'Questions?' },
];

// Map slide index → section name (for the chrome label).
// Deck shape after the explorations cut: 1 cover · 5 framing slides ·
// 1 threads slide · 1 bridge to live concepts · 1 where-next divider ·
// scope + metrics + end.
function getSectionForSlide(idx) {
  if (idx === 0) return 'Cover';
  if (idx >= 1 && idx <= 7) return 'Framing';
  if (idx === 8) return 'The work';
  return 'Where Next';
}

// ═══════════════════════════════════════════════════════════
// Main component—keyboard nav, touch swipe, slide chrome
// ═══════════════════════════════════════════════════════════
export function Presentation() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showHints, setShowHints] = useState(true);
  const totalSlides = slides.length;

  // Auto-hide nav hints after a few slides
  useEffect(() => {
    if (currentSlide <= 1) setShowHints(true);
    else if (currentSlide >= 3) setShowHints(false);
  }, [currentSlide]);

  // Keyboard navigation
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
          navigate('/concepts');
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

  // Touch swipe (mobile presenter view)
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
      {/* Progress bar / scrubber along the bottom */}
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
          className="absolute bottom-0 left-0 h-[3px] bg-[#E31665] group-hover:h-[5px] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Back button (top-left) */}
      <button
        onClick={() => navigate('/concepts')}
        className="fixed top-6 left-8 p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors z-50 cursor-pointer"
        title="Back to concepts (Esc)"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-white/60">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
      </button>

      {/* Section label (top-center)—shows current chapter */}
      {currentSlide > 0 && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 text-[11px] uppercase tracking-[0.18em] text-white/40 font-[600]">
          {sectionLabel}
        </div>
      )}

      {/* Wordmark (top-right)—Rosebud */}
      <div className="fixed top-7 right-8 z-50 flex items-center gap-[8px] opacity-70">
        <svg viewBox="0 0 624 625" className="w-[18px] h-[18px]">
          <path d="M311.967 624.001C453.872 624.001 568.909 508.965 568.909 367.06C311.967 367.06 311.967 146.825 55.0264 146.825V367.06C55.0264 508.965 170.063 624.001 311.967 624.001Z" fill="#E31665" />
          <path d="M568.892 330.351H568.89C454.438 330.351 398.969 283.183 335.836 229.069L335.234 228.554C324.055 218.971 312.645 209.192 300.698 199.565C368.911 102.779 432.929 9.22867e-05 568.892 0V330.351Z" fill="#E31665" />
          <path opacity="0.6" d="M111.278 176.34C111.278 167.699 111.61 159.059 112.109 150.418C94.661 147.593 75.7177 145.931 55.1128 145.599V365.939C55.1128 508.179 170.932 623.999 313.339 623.999C360.863 623.999 405.397 611.038 443.615 588.605C253.684 547.561 111.278 378.568 111.278 176.34Z" fill="#B81457" />
        </svg>
        <span className="text-[13px] font-[600] text-white/70">rosebud</span>
      </div>

      {/* Page number (bottom-right) */}
      {currentSlide > 0 && (
        <div className="fixed bottom-8 right-8 z-50 text-[12px] tabular-nums text-white/40">
          {String(currentSlide + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
        </div>
      )}

      {/* Nav hints (bottom-left, auto-hides) */}
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
// Slide renderer—switch on slide.type
// ═══════════════════════════════════════════════════════════
function SlideRenderer({ slide }) {
  switch (slide.type) {
    case 'title':
      return <TitleSlide slide={slide} />;
    case 'section':
      return <SectionSlide slide={slide} />;
    case 'problem':
      return <ProblemSlide slide={slide} />;
    case 'quote':
      return <QuoteSlide slide={slide} />;
    case 'setup':
      return <SetupSlide slide={slide} />;
    case 'sequence':
      return <SequenceSlide slide={slide} />;
    case 'threads':
      return <ThreadsSlide slide={slide} />;
    case 'bridge':
      return <BridgeSlide slide={slide} />;
    case 'scope-table':
      return <ScopeTableSlide slide={slide} />;
    case 'metrics':
      return <MetricsSlide slide={slide} />;
    case 'end':
      return <EndSlide slide={slide} />;
    default:
      return null;
  }
}

// ═══════════════════════════════════════════════════════════
// Slide-level shell—wraps each slide in its motion variants
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

function Eyebrow({ children, color = '#E31665' }) {
  return (
    <span className="inline-block text-[11px] font-[700] tracking-[0.18em] uppercase mb-[16px]" style={{ color }}>
      {children}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════
// Title slide
// ═══════════════════════════════════════════════════════════
function TitleSlide({ slide }) {
  return (
    <motion.div
      className="fixed inset-0 flex items-end justify-start pl-[6%] pb-[10%]"
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Soft rose glow in the corner */}
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
            <span key={i} className={i === 1 ? 'block text-[#E31665]' : 'block'}>
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
// Section divider (numbered chapter)
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
// Problem slide
// ═══════════════════════════════════════════════════════════
function ProblemSlide({ slide }) {
  return (
    <SlideShell width="lg">
      <Eyebrow>{slide.eyebrow}</Eyebrow>
      <motion.h2
        className="text-[clamp(2.25rem,4.5vw,3.5rem)] font-[700] tracking-[-0.02em] leading-[1.1] mb-[24px]"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1, ease } }}
      >
        {slide.title}
      </motion.h2>
      <motion.p
        className="text-[clamp(1.125rem,1.5vw,1.375rem)] text-white/60 leading-relaxed font-[450] max-w-3xl"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2, ease } }}
      >
        {slide.body}
      </motion.p>
    </SlideShell>
  );
}

// ═══════════════════════════════════════════════════════════
// Quote slide (north star)
// ═══════════════════════════════════════════════════════════
function QuoteSlide({ slide }) {
  return (
    <SlideShell width="lg">
      <Eyebrow>{slide.eyebrow}</Eyebrow>
      <motion.blockquote
        className="text-[clamp(2rem,4vw,3.25rem)] font-[700] tracking-[-0.02em] leading-[1.15] mb-[24px] text-white"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1, ease } }}
      >
        {slide.quote}
      </motion.blockquote>
      <motion.div
        className="text-[14px] text-[#E31665] tracking-[0.04em] mb-[28px] font-[500]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.2 } }}
      >
       —{slide.attribution}
      </motion.div>
      <motion.p
        className="text-[clamp(1rem,1.3vw,1.25rem)] text-white/55 leading-relaxed font-[450] max-w-3xl border-l-[2px] border-white/[0.1] pl-[20px]"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3, ease } }}
      >
        {slide.follow}
      </motion.p>
    </SlideShell>
  );
}

// ═══════════════════════════════════════════════════════════
// Setup slide—what I was given, what I built first
// ═══════════════════════════════════════════════════════════
function SetupSlide({ slide }) {
  return (
    <SlideShell width="2xl">
      <Eyebrow>{slide.eyebrow}</Eyebrow>
      <motion.h2
        className="text-[clamp(2rem,3.8vw,3rem)] font-[700] tracking-[-0.02em] leading-[1.1] mb-[20px]"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1, ease } }}
      >
        {slide.title}
      </motion.h2>
      <motion.p
        className="text-[clamp(1rem,1.4vw,1.25rem)] text-white/55 leading-relaxed mb-[40px] max-w-3xl font-[450]"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2, ease } }}
      >
        {slide.body}
      </motion.p>
      <motion.div
        className="grid grid-cols-4 gap-[16px]"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {slide.cards.map((card, i) => (
          <motion.div
            key={i}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-[20px]"
            variants={staggerItem}
          >
            <div className="text-[10px] uppercase tracking-[0.14em] text-[#E31665] mb-[12px] font-[700]">
              {card.label}
            </div>
            <h3 className="text-[18px] font-[600] mb-[10px] text-white">{card.title}</h3>
            <p className="text-[14px] text-white/55 leading-relaxed font-[450]">{card.body}</p>
          </motion.div>
        ))}
      </motion.div>
    </SlideShell>
  );
}

// ═══════════════════════════════════════════════════════════
// Sequence slide—how the work built, with the sync inflection
// Two phases: initial pass (4 cards in 2x2) → mid-week sync banner
// → iteration pass (3 cards in 1x3). Numbering 01-07 spans both
// passes so the before/after cardinality reads instantly.
// ═══════════════════════════════════════════════════════════
function SequenceSlide({ slide }) {
  // Small reusable card for both phases
  const Card = ({ item, accent }) => (
    <motion.div
      variants={staggerItem}
      className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-[18px] flex flex-col gap-[6px]"
    >
      <div className="text-[22px] font-[700] tracking-[-0.02em] leading-none" style={{ color: accent }}>
        {item.num}
      </div>
      <h3 className="text-[15px] font-[600] text-white leading-tight">{item.title}</h3>
      <p className="text-[12px] text-white/50 leading-snug font-[450]">{item.body}</p>
    </motion.div>
  );

  return (
    <SlideShell width="2xl">
      <Eyebrow>{slide.eyebrow}</Eyebrow>
      <motion.h2
        className="text-[clamp(1.875rem,3.4vw,2.75rem)] font-[700] tracking-[-0.02em] leading-[1.1] mb-[14px]"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1, ease } }}
      >
        {slide.title}
      </motion.h2>
      <motion.p
        className="text-[15px] text-white/55 leading-relaxed mb-[28px] max-w-3xl font-[450]"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2, ease } }}
      >
        {slide.body}
      </motion.p>

      {/* Phase 1: Initial concepts — 2x2 grid */}
      <div className="mb-[14px] text-[10px] uppercase tracking-[0.18em] text-white/35 font-[700]">
        Initial pass
      </div>
      <motion.div
        className="grid grid-cols-2 gap-[14px] mb-[20px]"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {slide.initial.map((item, i) => (
          <Card key={i} item={item} accent={ROSE} />
        ))}
      </motion.div>

      {/* Sync inflection — the moment the direction shifted */}
      <motion.div
        className="my-[18px] flex items-center gap-[12px] py-[12px] px-[18px] rounded-full bg-[#E31665]/[0.1] border border-[#E31665]/[0.25]"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.45, ease } }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="#E31665" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px] shrink-0">
          <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
          <polyline points="21 3 21 8 16 8" />
        </svg>
        <div className="text-[13px] font-[600] text-white tracking-[0.04em]">
          Mid-week sync with Chrys
        </div>
        <div className="text-[12px] text-white/50 font-[450]">
          reshaped a focused second pass
        </div>
      </motion.div>

      {/* Phase 2: Iteration — 1x3 row */}
      <div className="mb-[14px] text-[10px] uppercase tracking-[0.18em] text-white/35 font-[700]">
        Iteration pass
      </div>
      <motion.div
        className="grid grid-cols-3 gap-[14px]"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {slide.iteration.map((item, i) => (
          <Card key={i} item={item} accent={SAGE} />
        ))}
      </motion.div>
    </SlideShell>
  );
}

// ═══════════════════════════════════════════════════════════
// Threads slide—the three Chrys threads
// ═══════════════════════════════════════════════════════════
function ThreadsSlide({ slide }) {
  return (
    <SlideShell width="2xl">
      <Eyebrow>{slide.eyebrow}</Eyebrow>
      <motion.h2
        className="text-[clamp(2rem,3.8vw,3rem)] font-[700] tracking-[-0.02em] leading-[1.1] mb-[20px]"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1, ease } }}
      >
        {slide.title}
      </motion.h2>
      <motion.p
        className="text-[clamp(1rem,1.4vw,1.25rem)] text-white/55 leading-relaxed mb-[44px] max-w-3xl font-[450]"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2, ease } }}
      >
        {slide.body}
      </motion.p>
      <motion.div
        className="flex flex-col gap-[16px]"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {slide.threads.map((t, i) => (
          <motion.div
            key={i}
            variants={staggerItem}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-[24px] flex items-center gap-[24px]"
          >
            <div className="text-[28px] font-[700] tracking-[-0.02em] w-[40px] shrink-0" style={{ color: t.accent }}>
              {t.num}
            </div>
            <div className="flex-1 text-[18px] text-white/85 font-[450] italic leading-relaxed">
              {t.prompt}
            </div>
            <div className="text-[14px] text-white/45 font-[500] shrink-0 flex items-center gap-[10px]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px]">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
              {t.outcome}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </SlideShell>
  );
}

// ═══════════════════════════════════════════════════════════
// Bridge slide—the moment the deck pauses and we open the live
// concepts site. Replaces the old four explorations slides.
// The CTA opens /concepts in a new tab so the deck stays parked
// in this tab and we can switch back when we're done.
// ═══════════════════════════════════════════════════════════
function BridgeSlide({ slide }) {
  return (
    <SlideShell width="xl">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1, ease } }}
        >
          <Eyebrow>{slide.eyebrow}</Eyebrow>
        </motion.div>
        <motion.h2
          className="text-[clamp(2.25rem,4.5vw,3.5rem)] font-[700] tracking-[-0.02em] leading-[1.1] mb-[24px] max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.15, ease } }}
        >
          {slide.title}
        </motion.h2>
        <motion.p
          className="text-[clamp(1.0625rem,1.4vw,1.25rem)] text-white/60 leading-relaxed mb-[44px] max-w-2xl mx-auto font-[450]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.25, ease } }}
        >
          {slide.body}
        </motion.p>

        {/* Big rose CTA — opens concepts in a new tab so the deck stays put */}
        <motion.a
          href={slide.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-[12px] px-[28px] py-[18px] rounded-full bg-[#E31665] hover:bg-[#C9135A] transition-colors text-white text-[17px] font-[600] tracking-[-0.005em] shadow-[0_8px_32px_rgba(227,22,101,0.35)] cursor-pointer"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.4, ease } }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {slide.ctaLabel}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </motion.a>

        {slide.helper && (
          <motion.p
            className="mt-[24px] text-[13px] text-white/40 font-[450]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.55, ease } }}
          >
            {slide.helper}
          </motion.p>
        )}
      </div>
    </SlideShell>
  );
}

// ═══════════════════════════════════════════════════════════
// MVP scope table slide
// ═══════════════════════════════════════════════════════════
function ScopeTableSlide({ slide }) {
  return (
    <SlideShell width="2xl">
      <Eyebrow>{slide.eyebrow}</Eyebrow>
      <motion.h2
        className="text-[clamp(2rem,3.8vw,3rem)] font-[700] tracking-[-0.02em] leading-[1.1] mb-[16px]"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1, ease } }}
      >
        {slide.title}
      </motion.h2>
      <motion.p
        className="text-[16px] text-white/55 leading-relaxed mb-[28px] max-w-3xl font-[450]"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2, ease } }}
      >
        {slide.body}
      </motion.p>
      <motion.div
        className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3, ease } }}
      >
        <div className="grid grid-cols-[160px_1fr_1.3fr] gap-x-[4px]">
          {/* Header row */}
          <div className="px-[16px] pt-[16px] pb-[12px] text-[10px] uppercase tracking-[0.14em] text-white/40 font-[700]">Flow</div>
          <div className="px-[16px] pt-[16px] pb-[12px] text-[10px] uppercase tracking-[0.14em] text-white/40 font-[700]">Ships first</div>
          <div className="px-[16px] pt-[16px] pb-[12px] text-[10px] uppercase tracking-[0.14em] text-white/40 font-[700]">Deferred—and why</div>
          {/* Rows */}
          {slide.rows.map((r, i) => (
            <div key={i} className="contents">
              <div className="px-[16px] py-[14px] border-t border-white/[0.06] text-[14px] font-[600] text-white">
                {r.flow}
              </div>
              <div className="px-[16px] py-[14px] border-t border-white/[0.06] text-[13px] text-white/75 font-[450] leading-relaxed">
                {r.ships}
              </div>
              <div className="px-[16px] py-[14px] border-t border-white/[0.06] text-[13px] text-white/50 font-[450] leading-relaxed">
                {r.deferred}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </SlideShell>
  );
}

// ═══════════════════════════════════════════════════════════
// Metrics slide
// ═══════════════════════════════════════════════════════════
function MetricsSlide({ slide }) {
  return (
    <SlideShell width="2xl">
      <Eyebrow>{slide.eyebrow}</Eyebrow>
      <motion.h2
        className="text-[clamp(2rem,3.8vw,3rem)] font-[700] tracking-[-0.02em] leading-[1.1] mb-[16px]"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1, ease } }}
      >
        {slide.title}
      </motion.h2>
      <motion.p
        className="text-[16px] text-white/55 leading-relaxed mb-[36px] max-w-3xl font-[450]"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2, ease } }}
      >
        {slide.body}
      </motion.p>
      <motion.div
        className="grid grid-cols-4 gap-[20px]"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {slide.metrics.map((m, i) => (
          <motion.div
            key={i}
            variants={staggerItem}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-[24px]"
          >
            <div className="text-[40px] font-[700] tracking-[-0.02em] mb-[8px]" style={{ color: accentColors[i % accentColors.length] }}>
              {m.value}
            </div>
            <div className="text-[15px] font-[600] text-white mb-[6px]">{m.title}</div>
            <p className="text-[12px] text-white/50 leading-relaxed font-[450]">{m.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </SlideShell>
  );
}

// ═══════════════════════════════════════════════════════════
// End slide
// ═══════════════════════════════════════════════════════════
function EndSlide({ slide }) {
  return (
    <motion.div
      className="text-center relative"
      variants={sectionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(227,22,101,0.12) 0%, rgba(227,22,101,0) 70%)' }}
      />
      <h2 className="relative text-[clamp(3rem,6vw,5rem)] font-[700] tracking-[-0.02em] mb-[20px]">
        {slide.title}
      </h2>
      <p className="relative text-[clamp(1.125rem,1.5vw,1.5rem)] text-white/50 font-[450]">
        {slide.subtitle}
      </p>
    </motion.div>
  );
}
