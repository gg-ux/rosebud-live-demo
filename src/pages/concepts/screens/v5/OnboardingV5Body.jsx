import { Button } from '../../../../components/Button';
import { GOALS } from './OnboardingV5Intent';

/* Minimalist Lucide-style icons for the body pills. currentColor so
   they pick up the pill's text color in both selected and unselected
   states without any extra wiring. */
function BodyIcon({ name, className }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.8',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className,
    'aria-hidden': 'true',
  };
  switch (name) {
    case 'sleep':
      return (
        <svg {...common}>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      );
    case 'cycle':
      return (
        <svg {...common}>
          <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5S5 13 5 15a7 7 0 0 0 7 7z" />
        </svg>
      );
    case 'exercise':
      return (
        <svg {...common}>
          {/* Bar */}
          <line x1="7" y1="12" x2="17" y2="12" />
          {/* Left weight */}
          <rect x="3.5" y="8" width="3" height="8" rx="0.5" />
          {/* Right weight */}
          <rect x="17.5" y="8" width="3" height="8" rx="0.5" />
        </svg>
      );
    case 'supplements':
      return (
        <svg {...common}>
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.2 2.3c1.7 2.4 2.1 11.9-6.2 17.7z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6" />
        </svg>
      );
    case 'medication':
      return (
        <svg {...common}>
          <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
          <path d="m8.5 8.5 7 7" />
        </svg>
      );
    default:
      return null;
  }
}

/* ══════════════════════════════════════════════════════════
   V5 · Body — things your writing won't catch on its own
   Step 2 of 3. Uses the same goal-framing language and pill
   pattern as the Intent step but scoped to body-data goals
   (sleep, cycle, physical signals). Explicit about the fact
   that Apple Health is ONE option and manual logging is the
   other — no user locked out of a goal by not having HealthKit.
   ══════════════════════════════════════════════════════════ */
export function OnboardingV5Body({ data, setData, onNext, onBack, step = 1, total = 3 }) {
  const selected = data.goals || [];
  const bodyGoals = GOALS.filter((g) => g.category === 'body');

  function toggle(id) {
    const next = selected.includes(id)
      ? selected.filter((i) => i !== id)
      : [...selected, id];
    setData({ goals: next });
  }

  function handleSkip() {
    // Semantic "none of these apply" — clear body picks + advance
    const patternOnly = (data.goals || []).filter((id) => {
      const g = GOALS.find((x) => x.id === id);
      return g && g.category !== 'body';
    });
    setData({ goals: patternOnly });
    onNext();
  }

  return (
    <div className="flex flex-col h-full px-[20px] pt-[8px]">
      {/* Top bar — Back left, Skip right */}
      <div className="flex items-center justify-between h-[32px] mb-[12px]">
        <button
          onClick={onBack}
          className="w-[32px] h-[32px] rounded-full flex items-center justify-center hover:bg-[#F0F0F0] transition-colors text-[#191C1A]"
          aria-label="Back"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <button
          onClick={handleSkip}
          className="h-[32px] px-[4px] text-[12px] leading-[16px] font-[500] text-[#8B828B] hover:text-[#191C1A] transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Progress bar — segmented, filled left-to-right */}
      <div className="flex gap-[4px] mb-[20px]">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-[3px] rounded-full transition-colors ${
              i <= step ? 'bg-[#191C1A]' : 'bg-[#EDEDED]'
            }`}
          />
        ))}
      </div>

      {/* Header */}
      <h2 className="text-[22px] leading-[28px] font-[700] text-[#191C1A] tracking-[-0.01em] mb-[6px]">
        What else do you want to track?
      </h2>
      <p className="text-[13px] leading-[20px] font-[450] text-[#6D6C6A] mb-[16px]">
        Tracking these alongside your journaling can uncover patterns between your body and mind.
      </p>

      {/* Body pills — icon + label. Container is flex-1 so pills
          anchor to the top and the conditional meds textarea below
          gets pushed down near the button (matching step 1's
          custom-goal textarea pattern). */}
      <div className="flex flex-wrap gap-[7px] mb-[14px] flex-1 content-start">
        {bodyGoals.map((g) => {
          const isOn = selected.includes(g.id);
          return (
            <button
              key={g.id}
              onClick={() => toggle(g.id)}
              className={`inline-flex items-center gap-[6px] px-[13px] py-[8px] rounded-[18px] border text-[12px] leading-[16px] transition-all cursor-pointer ${
                isOn
                  ? 'bg-[#F0F0F0] border-[#000000] text-[#000000] font-[500]'
                  : 'bg-[#FFFFFF] border-[#DEDEDE] text-[#6D6C6A] font-[450] hover:border-[#C0C0BF]'
              }`}
            >
              <BodyIcon name={g.icon} className="w-[13px] h-[13px] shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: g.label }} />
            </button>
          );
        })}
      </div>

      {/* Inline meds/supps detail — appears only when Medication /
          Supplements is selected. Mirrors the custom-goal textarea
          pattern from step 1 so users don't have to leave the screen
          to add specifics. Skippable by leaving blank. */}
      {selected.includes('meds-supps') && (
        <div className="mb-[14px] flex flex-col gap-[5px]">
          <label className="text-[10px] leading-[13px] font-[700] tracking-[0.06em] uppercase text-[#8B828B]">
            Add specifics (optional)
          </label>
          <textarea
            value={data.takingDetail || ''}
            onChange={(e) => setData({ takingDetail: e.target.value })}
            placeholder="e.g. Vitamin D, Magnesium, Sertraline 50mg, Birth control"
            rows={2}
            className="w-full px-[12px] py-[9px] rounded-[12px] border border-[#DEDEDE] bg-white text-[12px] leading-[17px] font-[450] text-[#191C1A] placeholder:text-[#C0C0BF] focus:outline-none focus:border-[#000000] resize-none"
          />
        </div>
      )}

      {/* Continue */}
      <div className="pb-[8px]">
        <Button variant="primary" size="large" className="w-full" onClick={onNext}>
          Continue
        </Button>
      </div>
    </div>
  );
}
