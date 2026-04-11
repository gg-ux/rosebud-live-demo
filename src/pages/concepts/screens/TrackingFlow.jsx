import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { createPortal } from 'react-dom';

/* ═══════════════════════════════════════════════════════════════════════════
   TrackingFlow — two versions of capturing structured metrics (meds,
   period, sleep) alongside a free-text journal entry.

   v1-guided  : tapping "Finish entry" opens a bottom sheet with explicit tiles
   v2-inline  : tag icon in the bottom row toggles a chip tray, open by default

   Chrome matches the V3 Onboarding / Chat paradigm exactly (Sage dropdown,
   Drafts close, blue prompt text, black user text, icon row, Finish/Go deeper).
   ═══════════════════════════════════════════════════════════════════════════ */

const PROMPT = "What's on your mind?";
const ELLIE_ENTRY = `Ugh. Couldn't sleep last night. Maybe 4 hours if I'm being generous. I think it's the princess lessons.

My head's pounding and I totally forgot to take my allergy meds this morning before school. Also, I'm pretty sure my period is starting. Had cramps during algebra and almost asked Mr. G for a bathroom pass but Lilly was passing notes so I just sat there.

Today is a lot.`;

/* ══════════════════════════════════════════════════════════
   Shared primitives — the one-tap input controls
   ══════════════════════════════════════════════════════════ */

function MedsToggle({ value, onChange }) {
  const opts = [
    { id: 'taken', label: 'Taken', color: '#5ABA9D' },
    { id: 'missed', label: 'Missed', color: '#E4AD51' },
  ];
  return (
    <div className="flex gap-[6px]">
      {opts.map((o) => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            onClick={() => onChange(active ? null : o.id)}
            className={`flex-1 h-[36px] rounded-[10px] text-[12px] leading-[15px] font-[600] transition-all ${
              active
                ? 'text-white shadow-[0_1px_3px_rgba(0,0,0,0.12)]'
                : 'bg-[#F0F0F0] text-[#6D6C6A] hover:bg-[#E5E5E5]'
            }`}
            style={active ? { backgroundColor: o.color } : undefined}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function PeriodButton({ value, onChange }) {
  const opts = [
    { id: 'none', label: 'Not on', fill: '#E5E5E5' },
    { id: 'light', label: 'Light', fill: '#FCC7D9' },
    { id: 'medium', label: 'Medium', fill: '#F47FA8' },
    { id: 'heavy', label: 'Heavy', fill: '#E31665' },
  ];
  return (
    <div className="grid grid-cols-4 gap-[6px]">
      {opts.map((o) => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            onClick={() => onChange(active ? null : o.id)}
            className={`flex flex-col items-center gap-[4px] py-[8px] rounded-[10px] transition-all ${
              active
                ? 'bg-white border border-[#191C1A] shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                : 'bg-[#F0F0F0] border border-transparent hover:bg-[#E5E5E5]'
            }`}
          >
            <span
              className="w-[16px] h-[16px] rounded-full border border-[#00000014]"
              style={{ backgroundColor: o.fill }}
            />
            <span className="text-[10px] leading-[13px] font-[600] text-[#191C1A]">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function SleepPicker({ value, onChange }) {
  const opts = [4, 5, 6, 7, 8];
  return (
    <div className="flex gap-[6px]">
      {opts.map((n) => {
        const active = value === n;
        return (
          <button
            key={n}
            onClick={() => onChange(active ? null : n)}
            className={`flex-1 h-[36px] rounded-[10px] text-[13px] leading-[16px] font-[700] transition-all ${
              active
                ? 'bg-[#191C1A] text-white shadow-[0_1px_3px_rgba(0,0,0,0.12)]'
                : 'bg-[#F0F0F0] text-[#6D6C6A] hover:bg-[#E5E5E5]'
            }`}
          >
            {n === 8 ? '8+' : n}
          </button>
        );
      })}
    </div>
  );
}

function TrackerBlock({ icon, label, status, children }) {
  return (
    <div className="flex flex-col gap-[8px]">
      <div className="flex items-center gap-[6px]">
        <span className="text-[14px]">{icon}</span>
        <span className="text-[12px] leading-[15px] font-[600] text-[#191C1A]">{label}</span>
        {status && (
          <span className="text-[10px] leading-[13px] font-[500] text-[#8B828B]">· {status}</span>
        )}
      </div>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Shared chrome — matches V3 Journal / Chat exactly
   ══════════════════════════════════════════════════════════ */

function TopBar() {
  return (
    <div className="flex items-center justify-between px-[8px] h-[48px] shrink-0">
      <div className="flex items-center gap-[12px] pl-[6px] pr-[12px] py-[6px] rounded-[10px] border border-[#C0C0BF]">
        <div className="w-[24px] h-[24px] rounded-full bg-[#7CC4AF]" />
        <span className="text-[15px] leading-[20px] font-[450] text-[#191C1A]">Sage</span>
        <svg viewBox="0 0 12 12" fill="none" className="w-[12px] h-[12px]">
          <path
            d="M2.5 4.5L6 8L9.5 4.5"
            stroke="#000000"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="flex items-center gap-[8px]">
        <span className="text-[16px] leading-[22px] font-[500] text-[#000000]">Drafts</span>
        <button className="w-[36px] h-[36px] rounded-full flex items-center justify-center">
          <svg viewBox="0 0 18 18" fill="none" className="w-[18px] h-[18px]">
            <path
              d="M4.5 4.5L13.5 13.5M13.5 4.5L4.5 13.5"
              stroke="#000000"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Bottom CTAs — icon row + Finish entry / Go deeper. `extraTop` lets V2 slide
// its tracker chips into the footer just above the icons. `trackerAffordance`
// inserts the V2 tag-icon-with-badge into the left icon row. `onGoDeeper`
// wires up the right-side button (V3 uses it to trigger the conversational
// Rosebud suggestion flow; V1 and V2 leave it unhandled).
function BottomCTAs({ onFinishEntry, onGoDeeper, extraTop = null, trackerAffordance = null }) {
  return (
    <div className="border-t border-[#F0F0F0]">
      {extraTop}
      <div className="flex items-center justify-between px-[18px] pt-[12px]">
        <div className="flex items-center gap-[24px]">
          {/* Mic */}
          <svg viewBox="0 0 24 24" fill="none" className="w-[20px] h-[20px]">
            <path
              d="M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3z"
              stroke="#191C1A"
              strokeWidth="1.5"
            />
            <path
              d="M19 10v1a7 7 0 01-14 0v-1M12 18v4M8 22h8"
              stroke="#191C1A"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          {/* Image */}
          <svg viewBox="0 0 24 24" fill="none" className="w-[20px] h-[20px]">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="#191C1A" strokeWidth="1.5" />
            <circle cx="8.5" cy="8.5" r="1.5" fill="#191C1A" />
            <path
              d="M21 15l-5-5L5 21"
              stroke="#191C1A"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {/* Tag — V2/V3 tracker affordance, with optional badge indicator */}
          {trackerAffordance && (() => {
            const {
              active,
              showBadge,
              badgeColor = '#5ABA9D',
              mutedActive = false,
              onClick,
            } = trackerAffordance;
            // Stroke color: muted active = slightly faded neutral, tinted active = green
            const strokeColor = active
              ? mutedActive
                ? '#C0C0BF'
                : '#5ABA9D'
              : '#191C1A';
            return (
              <button
                onClick={onClick}
                className="relative flex items-center justify-center"
                title="Tag this entry"
              >
                <svg viewBox="0 0 24 24" fill="none" className="w-[20px] h-[20px]">
                  <path
                    d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"
                    stroke={strokeColor}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="7" cy="7" r="1" fill={strokeColor} />
                </svg>
                {showBadge && !active && (
                  <span
                    className="absolute -top-[3px] -right-[3px] w-[10px] h-[10px] rounded-full border-[1.5px] border-white"
                    style={{ backgroundColor: badgeColor }}
                  />
                )}
              </button>
            );
          })()}
        </div>
        {/* Speaker */}
        <svg viewBox="0 0 24 24" fill="none" className="w-[20px] h-[20px]">
          <path
            d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"
            stroke="#191C1A"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="flex gap-[12px] px-[12px] py-[12px]">
        <button
          onClick={onFinishEntry}
          className="flex-1 h-[44px] rounded-[12px] border border-[#C0C0BF] flex items-center justify-center cursor-pointer"
        >
          <span className="text-[16px] leading-[22px] font-[500] text-[#191C1A]">Finish entry</span>
        </button>
        <button
          onClick={onGoDeeper}
          className="flex-1 h-[44px] rounded-[12px] bg-[#191C1A] flex items-center justify-center gap-[6px] cursor-pointer"
        >
          <svg viewBox="0 0 18 18" fill="#FFFFFF" className="w-[14px] h-[14px]">
            <path d="M9 1l1.3 3.2L13.5 5.5l-3.2 1.3L9 10 7.7 6.8 4.5 5.5l3.2-1.3L9 1zM4 10l.7 1.8L6.5 12.5l-1.8.7L4 15l-.7-1.8L1.5 12.5l1.8-.7L4 10z" />
          </svg>
          <span className="text-[16px] leading-[22px] font-[500] text-[#FFFFFF]">Go deeper</span>
        </button>
      </div>
    </div>
  );
}

// Thread body — shared by all three versions. Renders the blue prompt +
// Ellie's entry in the Rosebud journal style. Children render AI responses
// below (used by V3 for the inference banner).
function ThreadBody({ children }) {
  return (
    <div className="flex-1 overflow-y-auto px-[15px] pt-[12px] pb-[8px]">
      <div className="mb-[24px]">
        <p className="text-[14px] leading-[20px] font-[450] text-[#2B6CB0] mb-[8px]">{PROMPT}</p>
        <p className="text-[14px] leading-[20px] font-[450] text-[#191C1A] whitespace-pre-line">
          {ELLIE_ENTRY}
        </p>
      </div>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   V1 — GUIDED STAMP
   Finish entry → bottom sheet with tiles
   ══════════════════════════════════════════════════════════ */
function V1Guided({ state, setState, trackers, setTrackers }) {
  const loggedCount = Object.values(trackers).filter((v) => v != null).length;

  return (
    <div className="relative flex flex-col h-full bg-white">
      <TopBar />
      <ThreadBody>
        {state === 'saved' && (
          <div className="mb-[24px] rounded-[14px] border border-[#D0ECDE] bg-[#F0FFF4] px-[14px] py-[12px] flex items-start gap-[10px]">
            <div className="w-[20px] h-[20px] rounded-full bg-[#5ABA9D] flex items-center justify-center shrink-0 mt-[1px]">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-[12px] h-[12px]">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] leading-[18px] font-[600] text-[#235E4D]">
                Saved. {loggedCount > 0 ? `${loggedCount} tag${loggedCount === 1 ? '' : 's'} attached.` : 'No tags attached.'}
              </p>
              <p className="text-[11px] leading-[15px] font-[450] text-[#4A7A67] mt-[2px]">
                3rd low-sleep entry this week. Sage will surface the pattern Friday.
              </p>
            </div>
          </div>
        )}
      </ThreadBody>
      <BottomCTAs onFinishEntry={() => setState('sheet')} />

      {/* Bottom sheet */}
      {state === 'sheet' && (
        <div
          className="absolute inset-0 z-20 flex items-stretch justify-center bg-black/40"
          onClick={() => setState('writing')}
        >
          <div
            className="w-full bg-white flex flex-col h-full min-h-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-[20px] pt-[16px] pb-[12px] shrink-0 border-b border-[#F0F0F0] flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <span className="text-[11px] leading-[14px] font-[600] tracking-[0.08em] uppercase text-[#8B828B] block mb-[2px]">
                  Stamp today&apos;s entry
                </span>
                <span className="text-[17px] leading-[22px] font-[700] text-[#191C1A]">Quick tags</span>
              </div>
              <button
                onClick={() => setState('writing')}
                className="shrink-0 w-[28px] h-[28px] rounded-full hover:bg-[#F0F0F0] flex items-center justify-center"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="#191C1A" strokeWidth="2" strokeLinecap="round" className="w-[14px] h-[14px]">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Scrollable tiles */}
            <div className="flex-1 min-h-0 overflow-y-auto px-[20px] py-[16px] flex flex-col gap-[18px]">
              <p className="text-[12px] leading-[17px] font-[450] text-[#6D6C6A]">
                Log what you&apos;d like us to correlate with today&apos;s entry to help us find patterns. Everything&apos;s optional.
              </p>

              <TrackerBlock icon="💊" label="Allergy meds" status={trackers.meds}>
                <MedsToggle
                  value={trackers.meds}
                  onChange={(v) => setTrackers({ ...trackers, meds: v })}
                />
              </TrackerBlock>

              <TrackerBlock icon="🩸" label="Period" status={trackers.period}>
                <PeriodButton
                  value={trackers.period}
                  onChange={(v) => setTrackers({ ...trackers, period: v })}
                />
              </TrackerBlock>

              <TrackerBlock
                icon="🌙"
                label="Sleep last night"
                status={trackers.sleep != null ? `${trackers.sleep}${trackers.sleep === 8 ? '+' : ''} hrs` : null}
              >
                <SleepPicker
                  value={trackers.sleep}
                  onChange={(v) => setTrackers({ ...trackers, sleep: v })}
                />
              </TrackerBlock>
            </div>

            {/* Sticky footer */}
            <div className="shrink-0 px-[20px] py-[14px] border-t border-[#F0F0F0] flex items-center justify-between bg-white">
              <button
                onClick={() => {
                  setTrackers({ meds: null, period: null, sleep: null });
                  setState('saved');
                }}
                className="text-[13px] leading-[18px] font-[500] text-[#8B828B] hover:text-[#191C1A] underline underline-offset-2"
              >
                Save without tags
              </button>
              <button
                onClick={() => setState('saved')}
                className="px-[18px] py-[10px] rounded-[12px] bg-[#191C1A] text-white text-[13px] leading-[18px] font-[500]"
              >
                {loggedCount > 0 ? `Save (${loggedCount})` : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   V2 — INLINE FOOTER
   Tag icon in the bottom row toggles a chip tray. Open by
   default — users see the chips immediately and can tap the
   tag again to minimize. Never a modal.
   ══════════════════════════════════════════════════════════ */
function V2Inline({ trackers, setTrackers, expanded, setExpanded, trayOpen, setTrayOpen }) {
  const Chip = ({ id, icon, label, value, formatValue }) => {
    const isActive = expanded === id;
    const hasValue = value != null;
    return (
      <button
        onClick={() => setExpanded(isActive ? null : id)}
        className={`shrink-0 inline-flex items-center gap-[5px] px-[10px] h-[28px] rounded-full border text-[12px] leading-[15px] font-[500] transition-colors ${
          hasValue
            ? 'bg-[#191C1A] text-white border-[#191C1A]'
            : isActive
            ? 'bg-white text-[#191C1A] border-[#191C1A]'
            : 'bg-[#F8F8F8] text-[#6D6C6A] border-[#F0F0F0] hover:border-[#C0C0BF]'
        }`}
      >
        <span className="text-[12px]">{icon}</span>
        <span>
          {label}
          {hasValue && formatValue ? `: ${formatValue(value)}` : ''}
        </span>
        {!hasValue && (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className={`w-[10px] h-[10px] transition-transform ${isActive ? 'rotate-45' : ''}`}
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        )}
      </button>
    );
  };

  const trackerStrip = (
    <div className="px-[15px] pt-[12px] pb-[4px] flex flex-col gap-[8px]">
      <div className="flex items-center gap-[6px]">
        <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#8B828B]">
          Today&apos;s trackers · optional
        </span>
      </div>
      <div className="flex flex-wrap gap-[6px]">
        <Chip
          id="meds"
          icon="💊"
          label="Meds"
          value={trackers.meds}
          formatValue={(v) => v}
        />
        <Chip
          id="period"
          icon="🩸"
          label="Period"
          value={trackers.period}
          formatValue={(v) => v}
        />
        <Chip
          id="sleep"
          icon="🌙"
          label="Sleep"
          value={trackers.sleep}
          formatValue={(v) => `${v}${v === 8 ? '+' : ''}h`}
        />
      </div>

      {expanded && (
        <div className="rounded-[12px] border border-[#F0F0F0] bg-[#FAFAFA] p-[12px] mt-[2px]">
          {expanded === 'meds' && (
            <MedsToggle
              value={trackers.meds}
              onChange={(v) => {
                setTrackers({ ...trackers, meds: v });
                setExpanded(null);
              }}
            />
          )}
          {expanded === 'period' && (
            <PeriodButton
              value={trackers.period}
              onChange={(v) => {
                setTrackers({ ...trackers, period: v });
                setExpanded(null);
              }}
            />
          )}
          {expanded === 'sleep' && (
            <SleepPicker
              value={trackers.sleep}
              onChange={(v) => {
                setTrackers({ ...trackers, sleep: v });
                setExpanded(null);
              }}
            />
          )}
        </div>
      )}
    </div>
  );

  const hasIncomplete =
    trackers.meds == null || trackers.period == null || trackers.sleep == null;

  return (
    <div className="flex flex-col h-full bg-white">
      <TopBar />
      <ThreadBody />
      <BottomCTAs
        extraTop={trayOpen ? trackerStrip : null}
        trackerAffordance={{
          showBadge: hasIncomplete,
          badgeColor: '#E31665',
          active: trayOpen,
          mutedActive: true,
          onClick: () => setTrayOpen(!trayOpen),
        }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MID-CONVERSATION ONBOARDING
   Two explorations of the same moment: Rosebud has been
   watching across entries and wants to propose a set of
   patterns to track going forward. The question is how to
   ask.

   V1 — MODAL: the formal version. A pop-up over the thread
   with a sparkle icon, explicit title, explanatory body, and
   an unambiguous yes/no. Clear but interruptive.

   V2 — CONVERSATIONAL: Rosebud speaks back in the same blue
   voice that asked "What's on your mind?". The user replies
   in free-form text parsed for yes/no intent. No branded
   card intrusion; blue is already the established semantic
   for "Rosebud speaking."

   The wrapper picks between them based on a version prop.
   Both variants manage their own state — to reset either
   variant, mount with a new `key`.
   ══════════════════════════════════════════════════════════ */

// Shared confirmation / dismissal messages used by both variants.
const MC_ACCEPTED_COPY = "Got it. I\u2019ll keep an eye on sleep, meds, and your cycle as you write. You can always adjust in Patterns.";
const MC_DECLINED_COPY = "No worries. I\u2019ll stay quiet. You can ask me anytime from Patterns.";

// ── V1: Modal ────────────────────────────────────────────
// The things Rosebud noticed across recent entries. Each row in the
// modal corresponds to one of these. Icons match the existing tracker
// vocabulary in V1 Guided Stamp / V2 Inline Tag.
const MC_ITEMS = [
  { id: 'sleep', icon: '🌙', label: 'Sleep' },
  { id: 'meds', icon: '💊', label: 'Allergy meds' },
  { id: 'cycle', icon: '🩸', label: 'Cycle' },
];

// Format a list of labels as natural English ("sleep", "sleep and meds",
// "sleep, meds, and cycle"). Used in the post-confirmation copy so it
// reflects exactly which items the user chose to track.
function formatList(items) {
  const lower = items.map((i) => i.toLowerCase());
  if (lower.length === 0) return '';
  if (lower.length === 1) return lower[0];
  if (lower.length === 2) return `${lower[0]} and ${lower[1]}`;
  return `${lower.slice(0, -1).join(', ')}, and ${lower[lower.length - 1]}`;
}

function MidConvoModal({ portalContainer }) {
  // 'writing' | 'modal' | 'tracked' | 'dismissed'
  const [state, setState] = useState('writing');
  const [selected, setSelected] = useState(() => new Set(MC_ITEMS.map((i) => i.id)));
  const [trackedItems, setTrackedItems] = useState([]);
  // Drives the fade-in transition each time the modal mounts. Starts at
  // 0, bumped to 1 on the next animation frame so the CSS transition
  // fires once on mount.
  const [modalOpacity, setModalOpacity] = useState(0);

  // Auto-show the modal a beat after the user "finishes" the entry —
  // simulates Rosebud catching up to what was just written. The Replay
  // button on the section remounts this component (via key bump) which
  // re-runs this effect, so the fade-in is the demo-able moment.
  useEffect(() => {
    if (state !== 'writing') return;
    const t = setTimeout(() => setState('modal'), 700);
    return () => clearTimeout(t);
  }, [state]);

  // Each time we enter the 'modal' state, kick the fade-in by resetting
  // opacity to 0 then bumping to 1 on the next frame so the CSS
  // transition runs.
  useEffect(() => {
    if (state !== 'modal') {
      setModalOpacity(0);
      return;
    }
    setModalOpacity(0);
    const r = requestAnimationFrame(() => setModalOpacity(1));
    return () => cancelAnimationFrame(r);
  }, [state]);

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleTrack = () => {
    const items = MC_ITEMS.filter((i) => selected.has(i.id)).map((i) => i.label);
    setTrackedItems(items);
    setState('tracked');
  };

  return (
    <div className="relative flex flex-col h-full bg-white">
      <TopBar />
      <ThreadBody>
        {state === 'tracked' && (
          <div className="mb-[24px] rounded-[14px] border border-[#D0ECDE] bg-[#F0FFF4] px-[14px] py-[12px] flex items-start gap-[10px]">
            <div className="w-[20px] h-[20px] rounded-full bg-[#5ABA9D] flex items-center justify-center shrink-0 mt-[1px]">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-[12px] h-[12px]">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] leading-[18px] font-[600] text-[#235E4D]">
                {trackedItems.length > 0
                  ? `Now tracking ${formatList(trackedItems)}.`
                  : 'Nothing new being tracked.'}
              </p>
              <p className="text-[11px] leading-[15px] font-[450] text-[#4A7A67] mt-[2px]">
                Rosebud will surface patterns in your Weekly Summary.
              </p>
            </div>
          </div>
        )}
        {state === 'dismissed' && (
          <p className="text-[13px] leading-[18px] font-[450] text-[#8B828B] italic mb-[24px]">
            Dismissed. You can enable pattern tracking anytime from Patterns.
          </p>
        )}
      </ThreadBody>

      <BottomCTAs
        onFinishEntry={() => {}}
        onGoDeeper={() => {
          // In V1 the modal auto-appears, so Go deeper is a manual
          // override — useful if the user dismissed it and wants it back.
          if (state !== 'modal') setState('modal');
        }}
      />

      {/* Modal overlay — fades in each time it mounts. Portaled to
          PhoneFrame's rounded screen div (when available) so the
          backdrop covers the status bar at top and the home indicator
          area at the bottom. Falls back to inline rendering inside the
          content area if no portal target was provided, which means
          the backdrop stops at the content-area insets — visually
          almost identical for the demo, just less full-bleed. */}
      {state === 'modal' && (() => {
        const overlay = (
          <div
            className="absolute inset-0 z-40 flex items-center justify-center px-[20px] bg-black/40 transition-opacity duration-[300ms] ease-out"
            style={{ opacity: modalOpacity }}
          >
            <div
              className="w-full max-w-[296px] bg-white rounded-[18px] p-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.16)] flex flex-col gap-[10px]"
            >
            <div className="w-[36px] h-[36px] rounded-full bg-[#FFE2ED] flex items-center justify-center">
              <svg viewBox="0 0 18 18" fill="#E31665" className="w-[16px] h-[16px]">
                <path d="M9 1l1.3 3.2L13.5 5.5l-3.2 1.3L9 10 7.7 6.8 4.5 5.5l3.2-1.3L9 1zM4 10l.7 1.8L6.5 12.5l-1.8.7L4 15l-.7-1.8L1.5 12.5l1.8-.7L4 10z" />
              </svg>
            </div>
            <h3 className="text-[16px] leading-[22px] font-[700] text-[#191C1A] tracking-[-0.01em]">
              We noticed something
            </h3>
            <p className="text-[13px] leading-[19px] font-[450] text-[#6D6C6A]">
              A few things keep coming up across your entries. Logging them can help unlock patterns between your mind and body.
            </p>

            {/* Multi-select checklist */}
            <div className="flex flex-col gap-[6px] mt-[6px]">
              {MC_ITEMS.map((item) => {
                const isSelected = selected.has(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    className={`flex items-center gap-[10px] px-[12px] h-[40px] rounded-[10px] border transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-[#191C1A] bg-[#F8F8F8]'
                        : 'border-[#E5E5E5] bg-white hover:border-[#C0C0BF]'
                    }`}
                  >
                    <span className="text-[14px] leading-none">{item.icon}</span>
                    <span className="flex-1 text-left text-[13px] leading-[18px] font-[500] text-[#191C1A]">
                      {item.label}
                    </span>
                    <div
                      className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-[#191C1A] border-[#191C1A]'
                          : 'bg-white border-[#C0C0BF]'
                      }`}
                    >
                      {isSelected && (
                        <svg
                          viewBox="0 0 16 16"
                          fill="none"
                          stroke="white"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-[10px] h-[10px]"
                        >
                          <path d="M3 8l3.5 3.5L13 4.5" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-[8px] mt-[10px]">
              <button
                onClick={handleTrack}
                disabled={selected.size === 0}
                className={`w-full h-[40px] rounded-[12px] text-[13px] leading-[18px] font-[600] transition-colors ${
                  selected.size === 0
                    ? 'bg-[#E5E5E5] text-[#C0C0BF] cursor-not-allowed'
                    : 'bg-[#191C1A] text-white cursor-pointer hover:opacity-90'
                }`}
              >
                {selected.size === 0
                  ? 'Select to track'
                  : `Track selected (${selected.size})`}
              </button>
              <button
                onClick={() => setState('dismissed')}
                className="w-full h-[40px] rounded-[12px] border border-[#DEDEDE] bg-white text-[#6D6C6A] text-[13px] leading-[18px] font-[500] cursor-pointer hover:border-[#C0C0BF]"
              >
                Not now
              </button>
            </div>
            </div>
          </div>
        );
        return portalContainer ? createPortal(overlay, portalContainer) : overlay;
      })()}
    </div>
  );
}

// ── V2: Conversational ───────────────────────────────────
function MidConvoConversational() {
  const [state, setState] = useState('writing'); // 'writing' | 'suggesting' | 'accepted' | 'declined'
  const [reply, setReply] = useState('');
  const [submittedReply, setSubmittedReply] = useState('');

  const handleSubmit = () => {
    const trimmed = reply.trim();
    if (!trimmed) return;
    setSubmittedReply(trimmed);
    setReply('');
    // Parse the reply for yes/no intent. Negative phrases win first
    // (so "no thanks" beats a stray "yes please") and if nothing
    // matches, default to accepted — the safer fallback when users
    // engage at all is usually affirmative.
    const lower = trimmed.toLowerCase();
    const negative = /\b(no|nope|nah|not|don'?t|skip|later|never|stop)\b/.test(lower);
    const positive = /\b(yes|yeah|yep|yup|sure|ok|okay|sounds good|please|do it|go)\b/.test(lower);
    if (negative && !positive) {
      setState('declined');
    } else {
      setState('accepted');
    }
  };

  return (
    <div className="relative flex flex-col h-full bg-white">
      <TopBar />
      <ThreadBody>
        {state !== 'writing' && (
          <p className="text-[14px] leading-[20px] font-[450] text-[#2B6CB0] mb-[12px]">
            That sounds like a lot at once &mdash; sleep, meds, your period, a headache. All of those might be talking to each other. Want me to watch for them going forward?
          </p>
        )}

        {state === 'suggesting' && (
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Sure, let&rsquo;s do it"
            autoFocus
            rows={2}
            className="w-full bg-transparent text-[14px] leading-[20px] font-[450] text-[#191C1A] placeholder:text-[#C0C0BF] focus:outline-none resize-none mb-[24px] p-0 border-0"
          />
        )}

        {(state === 'accepted' || state === 'declined') && submittedReply && (
          <p className="text-[14px] leading-[20px] font-[450] text-[#191C1A] mb-[20px] whitespace-pre-line">
            {submittedReply}
          </p>
        )}

        {state === 'accepted' && (
          <p className="text-[14px] leading-[20px] font-[450] text-[#2B6CB0] mb-[24px]">{MC_ACCEPTED_COPY}</p>
        )}

        {state === 'declined' && (
          <p className="text-[14px] leading-[20px] font-[450] text-[#2B6CB0] mb-[24px]">{MC_DECLINED_COPY}</p>
        )}
      </ThreadBody>

      <BottomCTAs
        onFinishEntry={() => {}}
        onGoDeeper={() => {
          if (state === 'writing') setState('suggesting');
        }}
      />
    </div>
  );
}

// Wrapper — picks between the two explorations. `portalContainer` is
// only used by V1 (the modal); it gets forwarded so the modal overlay
// can be portaled into PhoneFrame's screen div for a full-bleed
// backdrop that covers the status bar and home indicator areas.
export function MidConversationOnboarding({ version = 'v2', portalContainer }) {
  if (version === 'v1') return <MidConvoModal portalContainer={portalContainer} />;
  return <MidConvoConversational />;
}

/* ══════════════════════════════════════════════════════════
   MAIN FLOW COMPONENT
   ══════════════════════════════════════════════════════════ */
export const TrackingFlow = forwardRef(function TrackingFlow({ version = 'v1' } = {}, ref) {
  const [v1State, setV1State] = useState('writing'); // 'writing' | 'sheet' | 'saved'
  const [v1Trackers, setV1Trackers] = useState({ meds: null, period: null, sleep: null });

  const [v2Trackers, setV2Trackers] = useState({ meds: null, period: null, sleep: null });
  const [v2Expanded, setV2Expanded] = useState(null);
  const [v2TrayOpen, setV2TrayOpen] = useState(true);

  useImperativeHandle(
    ref,
    () => ({
      reset: () => {
        setV1State('writing');
        setV1Trackers({ meds: null, period: null, sleep: null });
        setV2Trackers({ meds: null, period: null, sleep: null });
        setV2Expanded(null);
        setV2TrayOpen(true);
      },
      v1GoTo: (state) => setV1State(state),
      v2Expand: (chipId) => setV2Expanded(chipId),
      v2SetTrackers: (t) => setV2Trackers(t),
      v2SetTrayOpen: (open) => setV2TrayOpen(open),
    }),
    [],
  );

  if (version === 'v2') {
    return (
      <V2Inline
        trackers={v2Trackers}
        setTrackers={setV2Trackers}
        expanded={v2Expanded}
        setExpanded={setV2Expanded}
        trayOpen={v2TrayOpen}
        setTrayOpen={setV2TrayOpen}
      />
    );
  }

  return (
    <V1Guided
      state={v1State}
      setState={setV1State}
      trackers={v1Trackers}
      setTrackers={setV1Trackers}
    />
  );
});
