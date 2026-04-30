import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Pencil, Sparkles } from 'lucide-react';
import { TopBar, BottomCTAs } from './TrackingFlow';

/* ═══════════════════════════════════════════════════════════════════════════
   ToolCallFlow — V2 inline collapsed tool-call concept.

   Two scenarios:
     - 'creating-page'  : User shares a memory; AI updates its memory page
     - 'starting-entry' : User says "Good morning"; AI reads notes & suggests

   For 'starting-entry' there's a `mode` prop that toggles the suggestion
   pattern between single-select (auto-submit chips) and sentence-fragment
   (chips that prefill the input area with a blinking cursor).
   ═══════════════════════════════════════════════════════════════════════════ */

const PROMPT = "What's on your mind?";

// One animated tool-call row. Running shows a spinner + shimmer; completed is text-only.
function ToolCallRow({ call, completed }) {
  return (
    <div className="flex items-center gap-[8px] py-[2px]">
      {!completed && (
        <div className="w-[14px] h-[14px] flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" className="w-[12px] h-[12px] animate-spin">
            <circle cx="12" cy="12" r="9" stroke="#C0C0BF" strokeWidth="3" fill="none" />
            <path d="M12 3a9 9 0 0 1 9 9" stroke="#191C1A" strokeWidth="3" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      )}
      <span
        className={`text-[13px] leading-[18px] font-[450] ${
          completed ? 'text-[#6D6C6A]' : 'tool-shimmer'
        }`}
      >
        {call}
      </span>
    </div>
  );
}

// Action row matching the History & Bookmarks treatment: 15px icons, 14px gap,
// 1.6 stroke, color inherited from the parent text bubble.
function ActionIcons({ color = '#6D6C6A' }) {
  const svgProps = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className: 'w-[15px] h-[15px]',
  };
  return (
    <div className="flex items-center gap-[14px] mt-[6px]">
      {/* Play */}
      <button aria-label="Play"><svg {...svgProps}><polygon points="6 4 20 12 6 20 6 4" /></svg></button>
      {/* Copy */}
      <button aria-label="Copy"><svg {...svgProps}><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg></button>
      {/* Thumbs up */}
      <button aria-label="Helpful"><svg {...svgProps}><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg></button>
      {/* Thumbs down */}
      <button aria-label="Not helpful"><svg {...svgProps}><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" /></svg></button>
    </div>
  );
}

// Clickable text bubble — toggles a row of action icons when tapped.
// Coordinates with parent so only one bubble shows actions at a time.
function ClickableText({ id, children, colorClass, iconColor = '#6D6C6A', activeId, setActiveId, mb = '16px' }) {
  const isActive = activeId === id;
  return (
    <div style={{ marginBottom: mb }}>
      <button
        onClick={() => setActiveId(isActive ? null : id)}
        className="text-left w-full cursor-pointer"
      >
        <p className={`text-[14px] leading-[20px] font-[450] ${colorClass}`}>{children}</p>
      </button>
      {isActive && <ActionIcons color={iconColor} />}
    </div>
  );
}

// Live ticker — shows the current running tool call only.
function ToolCallTicker({ call }) {
  if (!call) return null;
  return (
    <div className="mb-[12px]">
      <ToolCallRow call={call} completed={false} />
    </div>
  );
}

// Collapsed summary — title = last tool call; expansion lists prior steps.
function ToolCallSummary({ calls, expanded, onToggle, tight = false }) {
  if (!calls.length) return null;
  const last = calls[calls.length - 1];
  const priorSteps = calls.slice(0, -1);
  return (
    <div className={tight ? 'mb-0' : 'mb-[8px]'}>
      <button
        onClick={onToggle}
        disabled={priorSteps.length === 0}
        className={`w-full flex items-center gap-[8px] py-[4px] px-[8px] -mx-[8px] rounded-[8px] transition-colors ${
          priorSteps.length > 0 ? 'hover:bg-[#F5F5F5] cursor-pointer' : 'cursor-default'
        }`}
      >
        <span className="text-[13px] leading-[18px] font-[500] text-[#6D6C6A] flex-1 text-left">
          {last}
        </span>
        {priorSteps.length > 0 && (
          <ChevronDown
            size={14}
            className={`text-[#6D6C6A] shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
        )}
      </button>
      <AnimatePresence initial={false}>
        {expanded && priorSteps.length > 0 && (
          <motion.div
            key="expansion"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-[2px]">
              {priorSteps.map((c, i) => (
                <ToolCallRow key={i} call={c} completed />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Generic tool-call animator: runs through `calls`, each {running, done}.
// Calls onComplete with the array of "done" labels when finished.
function useToolCallSequence(stagger = 1100) {
  const [phase, setPhase] = useState('idle'); // 'idle' | 'running' | 'done'
  const [tickerIndex, setTickerIndex] = useState(0);
  const [callsConfig, setCallsConfig] = useState([]);
  const onCompleteRef = useRef(null);
  const timersRef = useRef([]);

  const clear = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const start = (calls, onComplete) => {
    clear();
    setCallsConfig(calls);
    onCompleteRef.current = onComplete;
    setPhase('running');
    setTickerIndex(0);
    let cumulative = 0;
    calls.forEach((c, i) => {
      cumulative += c.duration ?? stagger;
      const t = setTimeout(() => {
        if (i < calls.length - 1) {
          setTickerIndex(i + 1);
        } else {
          setPhase('done');
          onCompleteRef.current?.();
        }
      }, cumulative);
      timersRef.current.push(t);
    });
  };

  const reset = () => {
    clear();
    setPhase('idle');
    setTickerIndex(0);
    setCallsConfig([]);
  };

  useEffect(() => () => clear(), []);

  const currentRunning = callsConfig[tickerIndex]?.running;
  const doneLabels = callsConfig.map((c) => c.done);

  return { phase, currentRunning, doneLabels, start, reset };
}

/* ════════════════════════════════════════════════════════════════
   SCENARIO 1 — Creating a new page
   ════════════════════════════════════════════════════════════════ */
const S1_ENTRY = "Today's lunch with my brother was a highlight. We laughed and reminisced about our childhood.";
const S1_AI = 'Your brother seems like an important person, let me update my memory.';
const S1_TOOLS = [
  { running: 'Consulting Page Creator...', done: 'Consulted Page Creator' },
  { running: 'Updating memory...', done: 'Memory updated' },
];

function CreatingPageScenario({ flowRef }) {
  // 'idle' → 'ai-then-tools' (AI message visible, tools running) → 'done'
  const [phase, setPhase] = useState('idle');
  const seq = useToolCallSequence();
  const [expanded, setExpanded] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [draft, setDraft] = useState('');
  const draftRef = useRef(null);

  const reset = () => {
    seq.reset();
    setPhase('idle');
    setExpanded(false);
    setActiveId(null);
    setDraft('');
  };
  useImperativeHandle(flowRef, () => ({ reset }), []);

  const trigger = () => {
    if (phase !== 'idle') return;
    setPhase('ai-then-tools');
    seq.start(S1_TOOLS, () => setPhase('done'));
  };

  return (
    <div className="relative flex flex-col h-full bg-white">
      <TopBar />
      <div className="flex-1 overflow-y-auto px-[15px] pt-[12px] pb-[8px]">
        <p className="text-[14px] leading-[20px] font-[450] text-[#2B6CB0] mb-[6px]">{PROMPT}</p>
        <ClickableText
          id="user-entry"
          colorClass="text-[#191C1A]"
          iconColor="#191C1A"
          activeId={activeId}
          setActiveId={setActiveId}
          mb="16px"
        >
          {S1_ENTRY}
        </ClickableText>

        {phase !== 'idle' && (
          <ClickableText
            id="ai-reply"
            colorClass="text-[#2B6CB0]"
            iconColor="#2B6CB0"
            activeId={activeId}
            setActiveId={setActiveId}
            mb="16px"
          >
            {S1_AI}
          </ClickableText>
        )}

        {seq.phase === 'running' && <ToolCallTicker call={seq.currentRunning} />}
        {phase === 'done' && (
          <>
            <ToolCallSummary
              calls={seq.doneLabels}
              expanded={expanded}
              onToggle={() => setExpanded((e) => !e)}
            />
            <WriteArea value={draft} onChange={setDraft} areaRef={draftRef} />
          </>
        )}
      </div>
      <BottomCTAs
        onFinishEntry={() => {}}
        onGoDeeper={trigger}
        hasContent={phase === 'idle' || draft.trim().length > 0}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SCENARIO 2 — Starting a new entry
   Two iterations: pills inline (top) vs pills in bottom bar.
   Two suggestion modes: single-select vs sentence-fragment.
   ════════════════════════════════════════════════════════════════ */
const S2_AI = 'Good morning. Yesterday you mentioned the lunch with your brother — want to pick up there, or somewhere else?';
const S2_PHASE1 = [{ running: 'Reading notes...', done: 'Read 3 notes' }];
const S2_PHASE2 = [{ running: 'Generating suggestions...', done: 'Generated 3 suggestions' }];

const SINGLE_OPTIONS = [
  'Pick up where I left off',
  "Reflect on yesterday's lunch",
  'Start something new today',
];

const SINGLE_REPLIES = {
  'Pick up where I left off':
    "Okay — yesterday you said the lunch felt easy in a way it usually doesn't. What's stayed with you from it?",
  "Reflect on yesterday's lunch":
    "Got it. Going back to the lunch — what stood out most about being with him?",
  'Start something new today':
    "Sure, fresh start. What's been on your mind this morning?",
};

const FRAGMENT_OPTIONS = [
  'Today I am feeling',
  'Something on my mind is',
  "I'm grateful for",
];

// Write area — always-mounted textarea so the ref is available for
// programmatic focus + cursor placement (used by fragment-prefill flow).
// Native browser behavior gives the empty-state placeholder + focus-on-tap.
function WriteArea({ value, onChange, areaRef }) {
  return (
    <textarea
      ref={areaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={2}
      placeholder="Write"
      className="w-full bg-transparent text-[14px] leading-[20px] font-[450] text-[#191C1A] placeholder:text-[#C0C0BF] focus:outline-none resize-none p-0 border-0 mb-[16px]"
    />
  );
}

// Single-select chips — tap to auto-submit. Same compact pill shape in both
// scrollable (bottom-bar) and inline (wraps) variants.
function SingleSelectList({ items, picked, onPick, scrollable = false }) {
  const containerClass = scrollable
    ? 'flex gap-[6px] overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
    : 'flex flex-wrap gap-[6px]';
  return (
    <div className={containerClass}>
      {items.map((opt) => {
        const isPicked = picked === opt;
        const dimmed = picked && !isPicked;
        return (
          <button
            key={opt}
            disabled={!!picked}
            onClick={() => onPick(opt)}
            className={`shrink-0 px-[12px] py-[7px] rounded-full border text-[13px] leading-[16px] font-[500] transition-colors ${
              isPicked
                ? 'bg-[#191C1A] border-[#191C1A] text-white'
                : dimmed
                ? 'bg-white border-[#F0F0F0] text-[#C0C0BF]'
                : 'bg-white border-[#E5E5E5] text-[#191C1A] hover:border-[#191C1A] cursor-pointer'
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

// Sentence-fragment chips — tap to prefill the Write area.
function FragmentList({ items, onPick, scrollable = false, hidden = false }) {
  if (hidden) return null;
  const containerClass = scrollable
    ? 'flex gap-[6px] overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
    : 'flex flex-wrap gap-[6px]';
  return (
    <div className={containerClass}>
      {items.map((opt) => (
        <button
          key={opt}
          onClick={() => onPick(opt)}
          className="shrink-0 inline-flex items-center gap-[6px] px-[12px] py-[7px] rounded-full border border-[#E5E5E5] bg-white text-[#191C1A] hover:border-[#191C1A] transition-colors cursor-pointer"
        >
          <Pencil size={12} className="text-[#6D6C6A]" />
          <span className="text-[13px] leading-[16px] font-[500]">{opt}...</span>
        </button>
      ))}
    </div>
  );
}

function StartingEntryScenario({ flowRef, mode = 'single', placement = 'top' }) {
  // 'idle' → 'p1-running' → 'p1-done' (AI) → 'p2-running' → 'p2-done' (suggestions) → 'submitted'
  const [phase, setPhase] = useState('idle');
  const seq1 = useToolCallSequence();
  const seq2 = useToolCallSequence();
  const [expanded1, setExpanded1] = useState(false);
  const [expanded2, setExpanded2] = useState(false);
  const [singlePicked, setSinglePicked] = useState(null);
  const [entryDraft, setEntryDraft] = useState('');
  const [draft, setDraft] = useState('');
  const [activeId, setActiveId] = useState(null);
  const entryRef = useRef(null);
  const draftRef = useRef(null);

  const reset = () => {
    seq1.reset();
    seq2.reset();
    setPhase('idle');
    setExpanded1(false);
    setExpanded2(false);
    setSinglePicked(null);
    setEntryDraft('');
    setDraft('');
    setActiveId(null);
  };
  useImperativeHandle(flowRef, () => ({ reset }), []);

  // Reset picked/draft on mode change so the toggle reads cleanly
  useEffect(() => {
    setSinglePicked(null);
    setDraft('');
    setActiveId(null);
  }, [mode]);

  const trigger = () => {
    if (phase !== 'idle') return;
    setPhase('p1-running');
    seq1.start(S2_PHASE1, () => {
      setPhase('p1-done');
      setTimeout(() => {
        setPhase('p2-running');
        seq2.start(S2_PHASE2, () => setPhase('p2-done'));
      }, 800);
    });
  };

  const pickSingle = (opt) => {
    setSinglePicked(opt);
    setPhase('submitted');
  };

  const pickFragment = (text) => {
    const value = text.endsWith(' ') ? text : text + ' ';
    setDraft(value);
    requestAnimationFrame(() => {
      if (draftRef.current) {
        draftRef.current.focus();
        const len = value.length;
        draftRef.current.setSelectionRange(len, len);
      }
    });
  };

  const showSuggestions = phase === 'p2-done';
  const fragmentChosen = !!draft;
  // Once suggestions appear (or after submit), drop the tool-call summaries
  // so the focus is on the user's next move, not the assistant's plumbing.
  const hideToolSummaries = showSuggestions || phase === 'submitted';

  // Suggestion content shared between top placement (inline) and bottom (in bar)
  const suggestionContent =
    mode === 'single' ? (
      <SingleSelectList
        items={SINGLE_OPTIONS}
        picked={singlePicked}
        onPick={pickSingle}
        scrollable={placement === 'bottom'}
      />
    ) : (
      <FragmentList
        items={FRAGMENT_OPTIONS}
        onPick={pickFragment}
        scrollable={placement === 'bottom'}
        hidden={fragmentChosen}
      />
    );

  return (
    <div className="relative flex flex-col h-full bg-white">
      <TopBar />
      <div className="flex-1 overflow-y-auto px-[15px] pt-[12px] pb-[8px]">
        <p className="text-[14px] leading-[20px] font-[450] text-[#2B6CB0] mb-[6px]">{PROMPT}</p>

        {phase === 'idle' && (
          <WriteArea value={entryDraft} onChange={setEntryDraft} areaRef={entryRef} />
        )}

        {seq1.phase === 'running' && <ToolCallTicker call={seq1.currentRunning} />}
        {seq1.phase === 'done' && (
          <ToolCallSummary
            calls={seq1.doneLabels}
            expanded={expanded1}
            onToggle={() => setExpanded1((e) => !e)}
          />
        )}

        {(phase === 'p1-done' || phase === 'p2-running' || phase === 'p2-done' || phase === 'submitted') && (
          <ClickableText
            id="ai-reply"
            colorClass="text-[#2B6CB0]"
            iconColor="#2B6CB0"
            activeId={activeId}
            setActiveId={setActiveId}
            mb="16px"
          >
            {S2_AI}
          </ClickableText>
        )}

        {seq2.phase === 'running' && <ToolCallTicker call={seq2.currentRunning} />}
        {seq2.phase === 'done' && !hideToolSummaries && (
          <ToolCallSummary
            calls={seq2.doneLabels}
            expanded={expanded2}
            onToggle={() => setExpanded2((e) => !e)}
          />
        )}

        {showSuggestions && placement === 'top' && (
          <div className="mb-[16px]">{suggestionContent}</div>
        )}

        {(phase === 'p1-done' || (phase === 'p2-running' && placement !== 'bottom') || phase === 'p2-done' || phase === 'submitted') && (
          phase === 'submitted' && mode === 'single' && singlePicked ? (
            <ClickableText
              id="user-pick"
              colorClass="text-[#191C1A]"
              iconColor="#191C1A"
              activeId={activeId}
              setActiveId={setActiveId}
              mb="16px"
            >
              {singlePicked}
            </ClickableText>
          ) : (
            <WriteArea
              value={draft}
              onChange={setDraft}
              areaRef={draftRef}
            />
          )
        )}

        {phase === 'submitted' && mode === 'single' && singlePicked && (
          <>
            <p className="text-[14px] leading-[20px] font-[450] text-[#2B6CB0] mb-[12px]">
              {SINGLE_REPLIES[singlePicked] || "Got it — let's go."}
            </p>
            <WriteArea value={draft} onChange={setDraft} areaRef={draftRef} />
          </>
        )}
      </div>

      {phase === 'idle' ? (
        <div className="px-[12px] py-[10px]">
          <button
            onClick={trigger}
            className="w-full h-[36px] rounded-[8px] bg-white border border-[#C0C0BF] flex items-center justify-center gap-[6px] cursor-pointer hover:border-[#191C1A] transition-colors"
          >
            <Sparkles size={14} className="text-[#191C1A]" />
            <span className="text-[14px] leading-[18px] font-[500] text-[#191C1A]">Let Rosebud Start</span>
          </button>
        </div>
      ) : (
        <BottomCTAs
          onFinishEntry={() => {}}
          onGoDeeper={trigger}
          hasContent={draft.trim().length > 0}
          extraTop={
            placement === 'bottom' && showSuggestions ? (
              <div className="relative">
                <div className="absolute -top-[20px] left-0 right-0 h-[20px] bg-gradient-to-t from-white to-transparent pointer-events-none" />
                <div className="bg-white pl-[15px] pt-[10px] pb-[10px]">
                  {suggestionContent}
                </div>
              </div>
            ) : null
          }
        />
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SCENARIO 3 — User mentions a date (recall + search, then reply)
   Tool calls run BEFORE the AI reply.
   ════════════════════════════════════════════════════════════════ */
const S3_USER = 'Last week remember when my mom got upset?';
const S3_AI = 'Yeah, I remember that.';
const S3_TOOLS = [
  { running: 'Recalling...', done: 'Recalled 3 memories' },
  { running: 'Searching notes...', done: 'Found 2 matches' },
];

function MentionsDateScenario({ flowRef }) {
  const [phase, setPhase] = useState('idle');
  const seq = useToolCallSequence();
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState('');
  const draftRef = useRef(null);

  const reset = () => {
    seq.reset();
    setPhase('idle');
    setExpanded(false);
    setDraft('');
  };
  useImperativeHandle(flowRef, () => ({ reset }), []);

  const trigger = () => {
    if (phase !== 'idle') return;
    setPhase('tools');
    seq.start(S3_TOOLS, () => setPhase('done'));
  };

  return (
    <div className="relative flex flex-col h-full bg-white">
      <TopBar />
      <div className="flex-1 overflow-y-auto px-[15px] pt-[12px] pb-[8px]">
        <p className="text-[14px] leading-[20px] font-[450] text-[#2B6CB0] mb-[8px]">{PROMPT}</p>
        <p className="text-[14px] leading-[20px] font-[450] text-[#191C1A] mb-[8px]">{S3_USER}</p>

        {seq.phase === 'running' && <ToolCallTicker call={seq.currentRunning} />}
        {seq.phase === 'done' && (
          <ToolCallSummary
            calls={seq.doneLabels}
            expanded={expanded}
            onToggle={() => setExpanded((e) => !e)}
          />
        )}
        {phase === 'done' && (
          <>
            <p className="text-[14px] leading-[20px] font-[450] text-[#2B6CB0] mb-[16px]">{S3_AI}</p>
            <WriteArea value={draft} onChange={setDraft} areaRef={draftRef} />
          </>
        )}
      </div>
      <BottomCTAs onFinishEntry={() => {}} onGoDeeper={trigger} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SCENARIO 4 — Thinking enabled
   Thinking step uses a longer running duration to feel realistic.
   ════════════════════════════════════════════════════════════════ */
const S4_USER = 'What are my deepest fears?';
const S4_AI = 'Complex UIs.';
const S4_THINKING = [{ running: 'Thinking...', done: 'Thought for 4s', duration: 2200 }];
const S4_READING = [{ running: 'Reading notes...', done: 'Read 4 notes' }];

function ThinkingScenario({ flowRef }) {
  const [phase, setPhase] = useState('idle');
  const thinkingSeq = useToolCallSequence();
  const readingSeq = useToolCallSequence();
  const [draft, setDraft] = useState('');
  const draftRef = useRef(null);

  const reset = () => {
    thinkingSeq.reset();
    readingSeq.reset();
    setPhase('idle');
    setDraft('');
  };
  useImperativeHandle(flowRef, () => ({ reset }), []);

  const trigger = () => {
    if (phase !== 'idle') return;
    setPhase('thinking');
    thinkingSeq.start(S4_THINKING, () => {
      setPhase('reading');
      readingSeq.start(S4_READING, () => setPhase('done'));
    });
  };

  return (
    <div className="relative flex flex-col h-full bg-white">
      <TopBar />
      <div className="flex-1 overflow-y-auto px-[15px] pt-[12px] pb-[8px]">
        <p className="text-[14px] leading-[20px] font-[450] text-[#2B6CB0] mb-[8px]">{PROMPT}</p>
        <p className="text-[14px] leading-[20px] font-[450] text-[#191C1A] mb-[8px]">{S4_USER}</p>

        {thinkingSeq.phase === 'running' && <ToolCallTicker call={thinkingSeq.currentRunning} />}
        {thinkingSeq.phase === 'done' && (
          <ToolCallSummary calls={thinkingSeq.doneLabels} expanded={false} onToggle={() => {}} tight />
        )}

        {readingSeq.phase === 'running' && <ToolCallTicker call={readingSeq.currentRunning} />}
        {readingSeq.phase === 'done' && (
          <ToolCallSummary calls={readingSeq.doneLabels} expanded={false} onToggle={() => {}} />
        )}

        {phase === 'done' && (
          <>
            <p className="text-[14px] leading-[20px] font-[450] text-[#2B6CB0] mb-[16px]">{S4_AI}</p>
            <WriteArea value={draft} onChange={setDraft} areaRef={draftRef} />
          </>
        )}
      </div>
      <BottomCTAs onFinishEntry={() => {}} onGoDeeper={trigger} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SCENARIO 5 — Tool call after a text reply
   AI responds in text first, then runs the tool.
   ════════════════════════════════════════════════════════════════ */
const S5_USER = 'Can you update the memory?';
const S5_AI = 'Yes, no problem.';
const S5_TOOLS = [{ running: 'Updating memory...', done: 'Memory updated' }];

function AfterTextScenario({ flowRef }) {
  const [phase, setPhase] = useState('idle');
  const seq = useToolCallSequence();
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState('');
  const draftRef = useRef(null);
  const aiToToolsTimerRef = useRef(null);

  const reset = () => {
    if (aiToToolsTimerRef.current) clearTimeout(aiToToolsTimerRef.current);
    seq.reset();
    setPhase('idle');
    setExpanded(false);
    setDraft('');
  };
  useImperativeHandle(flowRef, () => ({ reset }), []);

  useEffect(() => () => {
    if (aiToToolsTimerRef.current) clearTimeout(aiToToolsTimerRef.current);
  }, []);

  const trigger = () => {
    if (phase !== 'idle') return;
    setPhase('ai');
    aiToToolsTimerRef.current = setTimeout(() => {
      setPhase('tools');
      seq.start(S5_TOOLS, () => setPhase('done'));
    }, 700);
  };

  return (
    <div className="relative flex flex-col h-full bg-white">
      <TopBar />
      <div className="flex-1 overflow-y-auto px-[15px] pt-[12px] pb-[8px]">
        <p className="text-[14px] leading-[20px] font-[450] text-[#2B6CB0] mb-[8px]">{PROMPT}</p>
        <p className="text-[14px] leading-[20px] font-[450] text-[#191C1A] mb-[8px]">{S5_USER}</p>

        {phase !== 'idle' && (
          <p className="text-[14px] leading-[20px] font-[450] text-[#2B6CB0] mb-[8px]">{S5_AI}</p>
        )}
        {seq.phase === 'running' && <ToolCallTicker call={seq.currentRunning} />}
        {seq.phase === 'done' && (
          <ToolCallSummary
            calls={seq.doneLabels}
            expanded={expanded}
            onToggle={() => setExpanded((e) => !e)}
          />
        )}
        {phase === 'done' && (
          <WriteArea value={draft} onChange={setDraft} areaRef={draftRef} />
        )}
      </div>
      <BottomCTAs onFinishEntry={() => {}} onGoDeeper={trigger} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   Public wrapper
   ════════════════════════════════════════════════════════════════ */
export const ToolCallFlow = forwardRef(function ToolCallFlow(
  { scenario = 'creating-page', mode = 'single', placement = 'top' } = {},
  ref,
) {
  if (scenario === 'starting-entry') {
    return <StartingEntryScenario flowRef={ref} mode={mode} placement={placement} />;
  }
  if (scenario === 'mentions-date') {
    return <MentionsDateScenario flowRef={ref} />;
  }
  if (scenario === 'thinking') {
    return <ThinkingScenario flowRef={ref} />;
  }
  if (scenario === 'after-text') {
    return <AfterTextScenario flowRef={ref} />;
  }
  return <CreatingPageScenario flowRef={ref} />;
});
