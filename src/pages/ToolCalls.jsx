import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { PhoneFrame } from '../components/PhoneFrame';
import { SegmentedControl } from '../components';
import { ToolCallFlow, LoaderIcon } from './concepts/screens/ToolCallFlow';
import { usePageActions } from '../components/Layout';

const NOTION_URL =
  'https://www.notion.so/rosebudjournal/Tool-call-mapping-proposal-350328e8e3f7807ea758d68dde9169d7?source=copy_link';

function Replay({ onClick }) {
  return (
    <div className="flex justify-center mt-[14px]">
      <button
        onClick={onClick}
        className="inline-flex items-center gap-[6px] text-[11px] leading-[14px] font-[500] text-[var(--color-secondary-text)] hover:text-[var(--color-on-background)] transition-colors cursor-pointer"
        title="Replay this flow"
      >
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[11px] h-[11px]">
          <path d="M2 3v4h4" />
          <path d="M2.5 11a6 6 0 1 0 1-7.5L2 7" />
        </svg>
        Replay
      </button>
    </div>
  );
}

function Tagline({ children }) {
  return (
    <span className="inline-block text-[11px] font-[600] tracking-[0.06em] uppercase text-[var(--color-secondary-text)] mb-[8px]">
      {children}
    </span>
  );
}

function Title({ children }) {
  return (
    <h2 className="text-[24px] md:text-[32px] leading-[30px] md:leading-[40px] font-[700] tracking-[-0.02em] text-[var(--color-on-background)] mb-[12px]">
      {children}
    </h2>
  );
}

function Body({ children }) {
  return (
    <p className="text-[14px] md:text-[15px] leading-[22px] md:leading-[24px] font-[450] text-[var(--color-secondary-text)]">
      {children}
    </p>
  );
}

function NumberedInstructions({ items }) {
  const showNumbers = items.length > 1;
  return (
    <ol className="mt-[16px] flex flex-col gap-[8px]">
      {items.map((item, i) => (
        <li key={i} className="flex items-baseline gap-[12px] text-[14px] leading-[22px] font-[450] text-[var(--color-on-background)]">
          {showNumbers && (
            <span className="shrink-0 w-[16px] text-[var(--color-secondary-text)]">{i + 1}.</span>
          )}
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

function SectionLabel({ children }) {
  return (
    <span className="block text-[11px] font-[600] tracking-[0.06em] uppercase text-[var(--color-secondary-text)] mb-[12px]">
      {children}
    </span>
  );
}

function SpecBlock({ behavior, sequence, noBorder = false }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={`mt-[16px] ${noBorder ? 'pb-[12px]' : 'pb-[32px] border-b border-[var(--color-outline-light)]'}`}>
      <button
        onClick={() => setExpanded((e) => !e)}
        className="flex items-center gap-[8px] text-[11px] font-[700] tracking-[0.08em] uppercase text-[var(--color-secondary-text)] hover:text-[var(--color-on-background)] transition-colors cursor-pointer"
      >
        <ChevronRight
          size={12}
          className={`shrink-0 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
        />
        <span>Specs</span>
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px] md:gap-[48px] mt-[24px]">
              {behavior && (
                <div>
                  <SectionLabel>Behavior</SectionLabel>
                  <div className="flex flex-col gap-[16px]">
                    {behavior.map((item, i) => (
                      <div key={i}>
                        <div className="text-[14px] leading-[20px] font-[600] text-[var(--color-on-background)] mb-[4px]">{item.title}</div>
                        {Array.isArray(item.body) ? (
                          <ul className="flex flex-col gap-[2px]">
                            {item.body.map((line, j) => (
                              <li key={j} className="text-[13px] leading-[19px] font-[450] text-[var(--color-secondary-text)]">{line}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-[13px] leading-[19px] font-[450] text-[var(--color-secondary-text)]">{item.body}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {sequence && (
                <div>
                  <SectionLabel>Sequence</SectionLabel>
                  <ol className="flex flex-col gap-[10px]">
                    {sequence.map((item, i) => (
                      <li key={i} className="flex items-baseline gap-[12px] text-[14px] leading-[20px]">
                        <span className="shrink-0 w-[16px] text-[var(--color-secondary-text)] font-[450]">{i + 1}.</span>
                        <span>
                          <span className={item.transient ? 'text-[var(--color-secondary-text)] font-[450]' : 'text-[var(--color-on-background)] font-[600]'}>
                            {item.label}
                          </span>
                          {item.transient && (
                            <span className="text-[12px] text-[var(--color-secondary-text)] ml-[8px]">(transient)</span>
                          )}
                          {item.note && (
                            <span className="text-[12px] text-[var(--color-secondary-text)] italic ml-[8px]">{item.note}</span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const SHARED_BEHAVIOR = [
  { title: 'Single Line Animation', body: 'Each tool call fades in and replaces the previous in the same position.' },
  {
    title: 'States',
    body: [
      'In-progress: Spinning loader + shimmering text',
      'Complete: Static text',
      'Clickable: Expands inline accordion',
    ],
  },
  { title: 'Chevron Behavior', body: 'Down chevron rotates 180° when expanded. Shows previous completed tool calls inline.' },
];

const S1_SEQUENCE = [
  { label: 'Reflecting', transient: true, note: 'pre-AI filler' },
  { label: 'Searching memory', transient: true },
  { label: 'Reading recent entries', transient: true },
  { label: 'AI reply', note: 'persists' },
  { label: 'Reflecting', transient: true, note: 'post-AI filler' },
  { label: 'Consulting Page Creator', transient: true },
  { label: 'Updating memory', transient: true },
  { label: 'Action icons + Write', note: 'persist' },
];

const S2_SEQUENCE = [
  { label: 'Reading notes', transient: true },
  { label: 'Read 3 notes' },
  { label: 'Generating suggestions', transient: true },
  { label: 'Generated 3 suggestions', note: 'hidden when suggestions appear' },
];

const S3_SEQUENCE = [
  { label: 'Recalling', transient: true },
  { label: 'Recalled 3 memories' },
  { label: 'Searching notes', transient: true },
  { label: 'Found 2 matches' },
];

const S4_SEQUENCE = [
  { label: 'Thinking', transient: true, note: 'longer duration than other tool calls' },
  { label: 'Thought for 4s' },
  { label: 'Reading notes', transient: true },
  { label: 'Read 4 notes' },
];

const S5_SEQUENCE = [
  { label: 'Updating memory', transient: true },
  { label: 'Memory updated' },
];

function ScenarioRow({ reverse, phone, copy }) {
  const dirClass = reverse ? 'lg:flex-row-reverse' : 'lg:flex-row';
  return (
    <div className={`flex flex-col ${dirClass} items-center gap-[40px] lg:gap-[80px] py-[40px] md:py-[60px]`}>
      <div className="flex-1 flex justify-center w-full">
        <div className="w-full max-w-[340px]">{phone}</div>
      </div>
      <div className="flex-1 w-full max-w-[480px]">{copy}</div>
    </div>
  );
}

const OLDER_ITERATIONS = [
  {
    id: 'inline-summary',
    label: 'V1',
    name: 'Inline summary',
    tagline: 'Live ticker collapses into a tappable summary',
    description:
      'Tool calls fade in one at a time, then collapse into a single inline accordion above the Write area. The user can tap to expand and see what the assistant did.',
    isLatest: false,
  },
  {
    id: 'snackbar',
    label: 'V2',
    name: 'Bottom snackbar',
    tagline: 'All tool calls run through a floating bottom pill',
    description:
      'Both pre- and post-AI tool calls run through a single floating snackbar above the bottom action bar. Conversation thread stays clean; the snackbar carries all loading state and fades out when complete.',
    isLatest: false,
  },
];

const LOADER_STYLES = [
  { id: 'squiggle', label: 'Squiggle' },
  { id: 'spinner', label: 'Spinner' },
  { id: 'dots', label: 'Dots' },
  { id: 'pulse', label: 'Pulse' },
  { id: 'bloom', label: 'Bloom' },
  { id: 'sparkle', label: 'Sparkle' },
  { id: 'none', label: 'Text only' },
];

// JSX + CSS snippets for each loader. Designer-readable, engineer-copyable.
// Markup uses Tailwind arbitrary-values to match the project; CSS keyframes
// live in src/index.css.
const LOADER_SNIPPETS = {
  spinner: `// JSX (Tailwind animate-spin built-in)
<svg viewBox="0 0 24 24" className="w-[12px] h-[12px] animate-spin">
  <circle cx="12" cy="12" r="9" stroke="#C0C0BF"
          strokeWidth="3" fill="none" />
  <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor"
        strokeWidth="3" strokeLinecap="round" fill="none" />
</svg>`,

  dots: `// JSX
<div className="flex items-center gap-[2px]">
  <span className="w-[3px] h-[3px] rounded-full
                   bg-current animate-loader-dot-1" />
  <span className="w-[3px] h-[3px] rounded-full
                   bg-current animate-loader-dot-2" />
  <span className="w-[3px] h-[3px] rounded-full
                   bg-current animate-loader-dot-3" />
</div>

/* CSS */
@keyframes loader-dot-bounce {
  0%, 80%, 100% { transform: scale(0.5); opacity: 0.4; }
  40%           { transform: scale(1);   opacity: 1; }
}
.animate-loader-dot-1 { animation: loader-dot-bounce 1.2s
  ease-in-out infinite both; }
.animate-loader-dot-2 { animation: loader-dot-bounce 1.2s
  ease-in-out infinite both; animation-delay: 0.16s; }
.animate-loader-dot-3 { animation: loader-dot-bounce 1.2s
  ease-in-out infinite both; animation-delay: 0.32s; }`,

  pulse: `// JSX
<span className="w-[8px] h-[8px] rounded-full
                 bg-current animate-loader-pulse-dot" />

/* CSS */
@keyframes loader-pulse-dot {
  0%, 100% { transform: scale(0.55); opacity: 0.4; }
  50%      { transform: scale(1);    opacity: 1; }
}
.animate-loader-pulse-dot {
  animation: loader-pulse-dot 1.4s ease-in-out infinite;
}`,

  bloom: `// JSX — 4 petals on a cross
<svg viewBox="0 0 14 14" className="w-[14px] h-[14px]">
  <circle cx="7"    cy="2.5"  r="1.4" fill="currentColor"
          className="animate-loader-bloom animate-loader-bloom-1" />
  <circle cx="11.5" cy="7"    r="1.4" fill="currentColor"
          className="animate-loader-bloom animate-loader-bloom-2" />
  <circle cx="7"    cy="11.5" r="1.4" fill="currentColor"
          className="animate-loader-bloom animate-loader-bloom-3" />
  <circle cx="2.5"  cy="7"    r="1.4" fill="currentColor"
          className="animate-loader-bloom animate-loader-bloom-4" />
</svg>

/* CSS */
@keyframes loader-bloom-petal {
  0%, 70%, 100% { transform: scale(0.35); opacity: 0.3; }
  35%           { transform: scale(1);    opacity: 1; }
}
.animate-loader-bloom {
  transform-box: fill-box; transform-origin: center;
  animation: loader-bloom-petal 1.6s ease-in-out infinite;
}
.animate-loader-bloom-1 { animation-delay: 0s; }
.animate-loader-bloom-2 { animation-delay: 0.2s; }
.animate-loader-bloom-3 { animation-delay: 0.4s; }
.animate-loader-bloom-4 { animation-delay: 0.6s; }`,

  squiggle: `// JSX — single sine-wave path, drawn snake-style
<svg viewBox="0 0 14 14" className="w-[14px] h-[14px]">
  <path d="M 1 7 Q 3.5 3, 7 7 T 13 7"
        fill="none" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round"
        className="animate-loader-squiggle" />
</svg>

/* CSS */
@keyframes loader-squiggle-draw {
  0%   { stroke-dashoffset:  18; }
  50%  { stroke-dashoffset:   0; }
  100% { stroke-dashoffset: -18; }
}
.animate-loader-squiggle {
  stroke-dasharray: 18; stroke-dashoffset: 18;
  animation: loader-squiggle-draw 1.6s ease-in-out infinite;
}`,

  sparkle: `// JSX — 4-point concave star, scales + rotates 45°
<svg viewBox="0 0 14 14" className="w-[14px] h-[14px]">
  <path d="M 7 1.5 Q 7.5 6.5, 12.5 7 Q 7.5 7.5, 7 12.5
           Q 6.5 7.5, 1.5 7 Q 6.5 6.5, 7 1.5 Z"
        fill="currentColor"
        className="animate-loader-sparkle" />
</svg>

/* CSS */
@keyframes loader-sparkle {
  0%, 100% { transform: rotate(0deg)  scale(0.5); opacity: 0.45; }
  50%      { transform: rotate(45deg) scale(1);   opacity: 1; }
}
.animate-loader-sparkle {
  transform-box: fill-box; transform-origin: center;
  animation: loader-sparkle 1.4s ease-in-out infinite;
}`,
};

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      }}
      className="text-[11px] font-[500] text-[var(--color-secondary-text)] hover:text-[var(--color-on-background)] transition-colors cursor-pointer"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function LoaderDemoCard({ id, label, code }) {
  return (
    <div className="rounded-[12px] bg-[var(--color-surface)] border border-[var(--color-outline-light)] overflow-hidden">
      <div className="flex items-center justify-between gap-[10px] px-[14px] py-[12px] border-b border-[var(--color-outline-light)]">
        <div className="flex items-center gap-[10px]">
          <div className="w-[18px] h-[18px] flex items-center justify-center text-[#191C1A]">
            <LoaderIcon style={id} />
          </div>
          <span className="text-[13px] font-[600] text-[var(--color-on-background)]">{label}</span>
        </div>
        <CopyButton text={code} />
      </div>
      <pre className="text-[10px] leading-[15px] font-mono text-[var(--color-on-background)] bg-[var(--color-background)] p-[12px] m-0 max-h-[180px] overflow-auto whitespace-pre">
        {code}
      </pre>
    </div>
  );
}

function LoaderGallery() {
  const [expanded, setExpanded] = useState(false);
  const items = LOADER_STYLES.filter((s) => s.id !== 'none');
  return (
    <div className="mt-[16px] pb-[32px] border-b border-[var(--color-outline-light)]">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="flex items-center gap-[8px] text-[11px] font-[700] tracking-[0.08em] uppercase text-[var(--color-secondary-text)] hover:text-[var(--color-on-background)] transition-colors cursor-pointer"
      >
        <ChevronRight
          size={12}
          className={`shrink-0 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
        />
        <span>Loader Gallery</span>
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-[20px]">
              <p className="max-w-[680px] mb-[20px] text-[13px] leading-[20px] font-[450] text-[var(--color-secondary-text)]">
                React + Tailwind. Animations use <code className="font-mono">currentColor</code> so you can tint via the parent's text color. Keyframes live in <code className="font-mono">src/index.css</code>.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
                {items.map((s) => (
                  <LoaderDemoCard
                    key={s.id}
                    id={s.id}
                    label={s.label}
                    code={LOADER_SNIPPETS[s.id]}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LoaderStyleChips({ value, onChange }) {
  return (
    <div className="mt-[24px]">
      <span className="block text-[11px] font-[700] tracking-[0.08em] uppercase text-[var(--color-secondary-text)] mb-[10px]">
        Loader Style
      </span>
      <div className="flex flex-wrap gap-[6px]">
        {LOADER_STYLES.map((s) => (
          <button
            key={s.id}
            onClick={() => onChange(s.id)}
            className={`shrink-0 inline-flex items-center gap-[8px] pl-[10px] pr-[14px] h-[30px] rounded-full text-[12px] font-[500] transition-colors cursor-pointer ${
              value === s.id
                ? 'bg-[var(--color-on-background)] text-white'
                : 'bg-[var(--color-surface-variant)] text-[var(--color-secondary-text)] hover:text-[var(--color-on-background)]'
            }`}
          >
            {s.id !== 'none' && (
              <span className="w-[14px] h-[14px] flex items-center justify-center shrink-0">
                <LoaderIcon style={s.id} />
              </span>
            )}
            <span>{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function FinalProposalSection() {
  const ref = useRef(null);
  const [loaderStyle, setLoaderStyle] = useState('squiggle');

  return (
    <div>
      <ScenarioRow
        reverse={false}
        phone={
          <div>
            <PhoneFrame showNavBar={false}>
              <ToolCallFlow
                ref={ref}
                scenario="creating-page"
                variant="fade-swap"
                loaderStyle={loaderStyle}
              />
            </PhoneFrame>
            <Replay onClick={() => ref.current?.reset()} />
          </div>
        }
        copy={
          <div>
            <Tagline>Scenario 1</Tagline>
            <Title>Minimal In-Line</Title>
            <NumberedInstructions
              items={[
                'Tap “Go deeper” to play the flow.',
                '“Reflecting…” auto-populates while the tool plan loads, then the pre-AI loaders run (searching memory, reading recent entries) and fade out as the AI reply lands.',
                'After the reply, the post-AI loaders run below it (Reflecting → consulting Page Creator → updating memory), then fade out — replaced by the per-message actions and Write.',
              ]}
            />
            <LoaderStyleChips value={loaderStyle} onChange={setLoaderStyle} />
          </div>
        }
      />
      <SpecBlock behavior={SHARED_BEHAVIOR} sequence={S1_SEQUENCE} noBorder />
      <LoaderGallery />
    </div>
  );
}

function OlderIterationsSection() {
  const phoneRef = useRef(null);
  const [iterationId, setIterationId] = useState('inline-summary');

  const choose = (next) => {
    if (next === iterationId) return;
    setIterationId(next);
    phoneRef.current?.reset();
  };

  const active = OLDER_ITERATIONS.find((i) => i.id === iterationId);

  return (
    <div>
      <ScenarioRow
        reverse={false}
        phone={
          <div>
            <PhoneFrame showNavBar={false}>
              <ToolCallFlow ref={phoneRef} scenario="creating-page" variant={iterationId} />
            </PhoneFrame>
            <Replay onClick={() => phoneRef.current?.reset()} />
          </div>
        }
        copy={
          <div>
            <Tagline>Scenario 1 — Older Iterations</Tagline>
            <Title>{active.name}</Title>
            <NumberedInstructions
              items={[
                'Tap “Go deeper” to play through the flow.',
                'Pick another iteration below to compare.',
              ]}
            />
            <div className="flex flex-col gap-[10px] mt-[20px]">
              {OLDER_ITERATIONS.map((it) => (
                <IterationCard
                  key={it.id}
                  active={iterationId === it.id}
                  label={it.label}
                  name={it.name}
                  tagline={it.tagline}
                  isLatest={it.isLatest}
                  onClick={() => choose(it.id)}
                />
              ))}
            </div>
            <p className="text-[13px] leading-[19px] font-[450] text-[var(--color-secondary-text)] mt-[12px] px-[4px]">
              {active.description}
            </p>
          </div>
        }
      />
      <SpecBlock behavior={SHARED_BEHAVIOR} sequence={S1_SEQUENCE} />
    </div>
  );
}

function MentionsDatePhone() {
  const ref = useRef(null);
  return (
    <div>
      <PhoneFrame showNavBar={false}>
        <ToolCallFlow ref={ref} scenario="mentions-date" />
      </PhoneFrame>
      <Replay onClick={() => ref.current?.reset()} />
    </div>
  );
}

function ThinkingPhone() {
  const ref = useRef(null);
  return (
    <div>
      <PhoneFrame showNavBar={false}>
        <ToolCallFlow ref={ref} scenario="thinking" />
      </PhoneFrame>
      <Replay onClick={() => ref.current?.reset()} />
    </div>
  );
}

function AfterTextPhone() {
  const ref = useRef(null);
  return (
    <div>
      <PhoneFrame showNavBar={false}>
        <ToolCallFlow ref={ref} scenario="after-text" />
      </PhoneFrame>
      <Replay onClick={() => ref.current?.reset()} />
    </div>
  );
}

function ChipModeToggle({ mode, onChange }) {
  return (
    <SegmentedControl
      size="small"
      segments={[
        { value: 'single', label: 'Single-select' },
        { value: 'fragment', label: 'Sentence fragment' },
      ]}
      value={mode}
      onChange={onChange}
    />
  );
}

function ViewModeToggle({ compareMode, onChange }) {
  return (
    <button
      onClick={() => onChange(!compareMode)}
      className="text-[13px] leading-[19px] font-[450] text-[var(--color-secondary-text)] underline underline-offset-[3px] hover:text-[var(--color-on-background)] transition-colors cursor-pointer"
    >
      {compareMode ? 'Single view' : 'Compare versions'}
    </button>
  );
}

function VersionLabelChip({ isLatest, label }) {
  return (
    <div
      className={`shrink-0 inline-flex items-center justify-center gap-[4px] px-[10px] h-[24px] rounded-full text-[10px] font-[700] tracking-[0.04em] uppercase ${
        isLatest
          ? 'bg-[#FFE2ED] text-[#A40742]'
          : 'bg-[var(--color-surface-variant)] text-[var(--color-secondary-text)]'
      }`}
    >
      {isLatest && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-[9px] h-[9px]">
          <path d="M12 2l2.09 6.26L20 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l5.91-1.01L12 2z" />
        </svg>
      )}
      {label}
    </div>
  );
}

function ScenarioTwoPhone({ placement, mode, onModeChange, flowRef, showModeToggle = true }) {
  return (
    <div>
      {showModeToggle && (
        <div className="flex justify-center mb-[14px]">
          <ChipModeToggle mode={mode} onChange={onModeChange} />
        </div>
      )}
      <PhoneFrame showNavBar={false}>
        <ToolCallFlow ref={flowRef} scenario="starting-entry" mode={mode} placement={placement} />
      </PhoneFrame>
      <Replay onClick={() => flowRef.current?.reset()} />
    </div>
  );
}

function IterationCard({ active, label, name, isLatest, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-[12px] w-full px-[12px] h-[48px] rounded-[12px] border transition-colors cursor-pointer ${
        active
          ? 'border-[var(--color-on-background)] bg-[var(--color-surface)]'
          : 'border-[var(--color-outline-light)] bg-transparent hover:bg-[var(--color-surface)]/60'
      }`}
    >
      <div
        className={`shrink-0 inline-flex items-center justify-center gap-[4px] px-[8px] h-[22px] rounded-full text-[10px] font-[700] tracking-[0.04em] uppercase transition-colors ${
          isLatest
            ? 'bg-[#FFE2ED] text-[#A40742]'
            : 'bg-[var(--color-surface-variant)] text-[var(--color-secondary-text)]'
        }`}
      >
        {isLatest && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-[9px] h-[9px]">
            <path d="M12 2l2.09 6.26L20 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l5.91-1.01L12 2z" />
          </svg>
        )}
        {label}
      </div>
      <span className="text-[14px] leading-[20px] font-[600] text-[var(--color-on-background)] truncate">{name}</span>
    </button>
  );
}

const SCENARIO_TWO_VERSIONS = [
  {
    id: 'bottom',
    label: 'V1',
    name: 'Bottom-bar pills',
    tagline: 'Always within thumb reach',
    description:
      'Suggestions sit just above the icon row, horizontally scrollable. Longer body content slides behind a soft fade so the chat stays readable.',
    isLatest: true,
  },
  {
    id: 'top',
    label: 'V2',
    name: 'Inline pills',
    tagline: 'Below the assistant’s reply',
    description:
      'Suggestions appear in the conversation, just below the assistant’s reply. Easy to read alongside the AI’s text, but pushes the input area further down.',
    isLatest: false,
  },
];

function ScenarioTwoSection() {
  const singleRef = useRef(null);
  const v1Ref = useRef(null);
  const v2Ref = useRef(null);
  const [compareMode, setCompareMode] = useState(false);
  const [placement, setPlacement] = useState('bottom');
  const [mode, setMode] = useState('single');

  const resetAll = () => {
    singleRef.current?.reset();
    v1Ref.current?.reset();
    v2Ref.current?.reset();
  };

  const choosePlacement = (next) => {
    if (next === placement) return;
    setPlacement(next);
    singleRef.current?.reset();
  };

  const chooseMode = (next) => {
    if (next === mode) return;
    setMode(next);
    resetAll();
  };

  const chooseView = (next) => {
    if (next === compareMode) return;
    setCompareMode(next);
    resetAll();
  };

  const activeVersion = SCENARIO_TWO_VERSIONS.find((v) => v.id === placement);

  const Header = (
    <>
      <Tagline>Scenario 2</Tagline>
      <Title>Starting a new entry</Title>
      <NumberedInstructions
        items={[
          'Tap “Let Rosebud Start” to preview suggestions.',
          'Tap a suggestion — Single-select submits it as your input, Sentence fragment prefills the Write area so you can finish the thought.',
        ]}
      />
      <div className="mt-[20px]">
        <ViewModeToggle compareMode={compareMode} onChange={chooseView} />
      </div>
    </>
  );

  if (compareMode) {
    return (
      <section className="py-[40px] md:py-[60px]">
        <div className="max-w-[680px] mb-[32px]">{Header}</div>
        <div className="max-w-[760px] mx-auto">
          <div className="flex justify-center mb-[24px]">
            <ChipModeToggle mode={mode} onChange={chooseMode} />
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-start gap-[24px] sm:gap-[40px]">
            {SCENARIO_TWO_VERSIONS.map((v) => {
              const ref = v.id === 'bottom' ? v1Ref : v2Ref;
              return (
                <div key={v.id} className="w-full max-w-[340px] flex flex-col">
                  <div className="flex items-center gap-[8px] mb-[12px]">
                    <VersionLabelChip isLatest={v.isLatest} label={v.label} />
                    <span className="text-[14px] leading-[20px] font-[600] text-[var(--color-on-background)]">{v.name}</span>
                  </div>
                  <PhoneFrame showNavBar={false}>
                    <ToolCallFlow ref={ref} scenario="starting-entry" mode={mode} placement={v.id} />
                  </PhoneFrame>
                  <Replay onClick={() => ref.current?.reset()} />
                </div>
              );
            })}
          </div>
        </div>
        <SpecBlock behavior={SHARED_BEHAVIOR} sequence={S2_SEQUENCE} />
      </section>
    );
  }

  return (
    <div>
      <ScenarioRow
        reverse
        phone={
          <ScenarioTwoPhone
            flowRef={singleRef}
            placement={placement}
            mode={mode}
            onModeChange={chooseMode}
            showModeToggle={false}
          />
        }
        copy={
          <div>
            {Header}
            <div className="mt-[20px]">
              <ChipModeToggle mode={mode} onChange={chooseMode} />
            </div>
            <div className="flex flex-col gap-[10px] mt-[16px]">
              {SCENARIO_TWO_VERSIONS.map((v) => (
                <IterationCard
                  key={v.id}
                  active={placement === v.id}
                  label={v.label}
                  name={v.name}
                  tagline={v.tagline}
                  isLatest={v.isLatest}
                  onClick={() => choosePlacement(v.id)}
                />
              ))}
            </div>
            <p className="text-[13px] leading-[19px] font-[450] text-[var(--color-secondary-text)] mt-[12px] px-[4px]">
              {activeVersion.description}
            </p>
          </div>
        }
      />
      <SpecBlock behavior={SHARED_BEHAVIOR} sequence={S2_SEQUENCE} />
    </div>
  );
}

export function ToolCalls() {
  usePageActions(
    <a
      href={NOTION_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-[6px] px-[12px] py-[7px] rounded-full text-[13px] font-[500] bg-white border border-[#C0C0BF] text-[#191C1A] hover:border-[#191C1A] transition-colors"
    >
      Notion Initiative
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[12px] h-[12px]">
        <path d="M7 17L17 7" />
        <path d="M8 7h9v9" />
      </svg>
    </a>,
    [],
  );

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-background)]">
      <section className="max-w-[1200px] mx-auto px-[20px] md:px-[24px] py-[40px] md:py-[60px]">
        <div className="max-w-[680px] mb-[32px] md:mb-[48px]">
          <Tagline>Final Proposal</Tagline>
          <h1 className="text-[32px] md:text-[44px] leading-[38px] md:leading-[50px] font-[700] tracking-[-0.02em]">
            Tool Calls
          </h1>
        </div>

        <div className="mb-[24px] md:mb-[40px]">
          <FinalProposalSection />
        </div>

        <div className="max-w-[680px] mb-[24px] md:mb-[32px]">
          <h2 className="text-[24px] md:text-[32px] leading-[30px] md:leading-[40px] font-[700] tracking-[-0.02em]">
            Older Iterations
          </h2>
        </div>

        <OlderIterationsSection />

        <ScenarioTwoSection />

        <div>
          <ScenarioRow
            reverse={false}
            phone={<MentionsDatePhone />}
            copy={
              <div>
                <Tagline>Scenario 3</Tagline>
                <Title>User mentions a date</Title>
                <NumberedInstructions
                  items={[
                    'Tap “Go deeper” to let Sage recall and search before replying.',
                    'Tap the collapsed summary to expand and see the steps.',
                  ]}
                />
              </div>
            }
          />
          <SpecBlock behavior={SHARED_BEHAVIOR} sequence={S3_SEQUENCE} />
        </div>

        <div>
          <ScenarioRow
            reverse
            phone={<ThinkingPhone />}
            copy={
              <div>
                <Tagline>Scenario 4</Tagline>
                <Title>Thinking enabled</Title>
                <NumberedInstructions
                  items={[
                    'Tap “Go deeper” — thinking runs longer than other tool calls before the reply.',
                    'Tap “Read 4 notes” to expand and see the thinking step that preceded it.',
                  ]}
                />
              </div>
            }
          />
          <SpecBlock behavior={SHARED_BEHAVIOR} sequence={S4_SEQUENCE} />
        </div>

        <div>
          <ScenarioRow
            reverse={false}
            phone={<AfterTextPhone />}
            copy={
              <div>
                <Tagline>Scenario 5</Tagline>
                <Title>Tool call after a text reply</Title>
                <NumberedInstructions
                  items={[
                    'Tap “Go deeper” — Sage replies first, then runs the tool call.',
                    'The collapsed summary lands underneath the reply.',
                  ]}
                />
              </div>
            }
          />
          <SpecBlock behavior={SHARED_BEHAVIOR} sequence={S5_SEQUENCE} />
        </div>
      </section>
    </div>
  );
}
