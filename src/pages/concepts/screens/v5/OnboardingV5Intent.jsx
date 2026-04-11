import { useState } from 'react';
import { Button } from '../../../../components/Button';


/* ══════════════════════════════════════════════════════════
   V5 · Intent — one goal picker, no taxonomy
   The single onboarding step. Users pick goal-framed items
   that describe what they want to understand about themselves.
   Behind the scenes each goal maps to a {loggers, patterns}
   config so the data layer still gets the split the founder
   asked for. Users never learn the vocabulary.
   ══════════════════════════════════════════════════════════ */

// Each goal has a silent backend mapping. The user never sees this.
//
// Two categories exist because they represent two different kinds of
// work the AI does — and more importantly, two different things the
// user will experience:
//
//   1. `pattern` — things that emerge from reading the journal
//      itself. The user writes normally, Rosebud watches across weeks
//      and surfaces what they wouldn't spot about themselves.
//
//   2. `body` — things the journal writing won't catch on its own
//      (sleep, cycle, physical signals). The user can connect Apple
//      Health OR log it manually. Either path reaches the same goal.
//
// The `syncable` flag just means "Apple Health is one available
// option for this goal" — it's never required. Android users,
// privacy-conscious users, and anyone without HealthKit still get
// the same goal with manual logging as the path.
const GOALS = [
  // ── Pattern goals: things Rosebud notices in your writing ──
  // `featured: true` = shown upfront. The rest hide behind "+ N more"
  // so users don't have to scan all 8 on first load. Goals that apply
  // to almost anyone are featured; more specific ones are hidden.
  {
    id: 'honest',
    label: 'Whether I&rsquo;m being honest with myself',
    category: 'pattern',
    featured: true,
  },
  {
    id: 'returning',
    label: 'Moments I keep returning to',
    category: 'pattern',
    featured: true,
  },
  {
    id: 'different-people',
    label: 'How I change with different people',
    category: 'pattern',
    featured: true,
  },
  {
    id: 'stories',
    label: 'Stories I keep telling about myself',
    category: 'pattern',
    featured: true,
  },
  {
    id: 'outgrowing',
    label: 'Beliefs I&rsquo;m quietly outgrowing',
    category: 'pattern',
    featured: true,
  },
  {
    id: 'attachment',
    label: 'How I attach in close relationships',
    category: 'pattern',
    featured: false,
  },
  {
    id: 'coping',
    label: 'How I cope when things get hard',
    category: 'pattern',
    featured: false,
  },
  {
    id: 'values',
    label: 'Whether I&rsquo;m living by my values',
    category: 'pattern',
    featured: false,
  },
  {
    id: 'almost-saying',
    label: 'What I&rsquo;m almost saying but not',
    category: 'pattern',
    featured: false,
  },
  {
    id: 'inherited',
    label: 'Patterns I absorbed growing up',
    category: 'pattern',
    featured: false,
  },
  {
    id: 'feel-vs-say',
    label: 'The gap between what I feel and what I say',
    category: 'pattern',
    featured: false,
  },
  // ── Body items: things your writing won't catch on its own ──
  // Simple nouns here, not goal framing — for sleep/exercise/meds,
  // you just want to track the thing. "Supplements" and "Medication"
  // can optionally be specified in a follow-up step with free text.
  {
    id: 'sleep',
    label: 'Sleep',
    category: 'body',
    icon: 'sleep',
    syncable: true,
  },
  {
    id: 'cycle',
    label: 'My cycle',
    category: 'body',
    icon: 'cycle',
    syncable: true,
  },
  {
    id: 'exercise',
    label: 'Exercise',
    category: 'body',
    icon: 'exercise',
    syncable: true,
  },
  {
    id: 'meds-supps',
    label: 'Medication / Supplements',
    category: 'body',
    icon: 'medication',
    syncable: false,
    hasDetails: true,
  },
];

export function OnboardingV5Intent({ data, setData, onNext, onSkipAll, step = 0, total = 3 }) {
  const selected = data.goals || [];
  const patternGoals = GOALS.filter((g) => g.category === 'pattern');

  // Hide non-featured pattern goals behind a "+ N more" affordance so
  // users don't have to scan all 8 on first load. If a hidden goal is
  // already selected (e.g., from seed state), keep it visible even when
  // collapsed so the selected pill never disappears on the user.
  const [showAll, setShowAll] = useState(false);
  const visiblePatterns = showAll
    ? patternGoals
    : patternGoals.filter((g) => g.featured || selected.includes(g.id));
  const hiddenCount = patternGoals.length - visiblePatterns.length;

  const customGoal = data.customGoal || '';

  function toggle(id) {
    const next = selected.includes(id)
      ? selected.filter((i) => i !== id)
      : [...selected, id];
    setData({ goals: next });
  }

  return (
    <div className="flex flex-col h-full px-[20px] pt-[8px]">
      {/* Top bar: no Back (first step), Skip in the top-right */}
      <div className="flex items-center justify-between h-[32px] mb-[12px]">
        <div className="w-[32px]" />
        {onSkipAll && (
          <button
            onClick={onSkipAll}
            className="h-[32px] px-[4px] text-[12px] leading-[16px] font-[500] text-[#8B828B] hover:text-[#191C1A] transition-colors"
          >
            Skip
          </button>
        )}
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

      {/* Header — no subtitle. The question itself is already the
          prompt, so a helper line would be redundant. */}
      <h2 className="text-[22px] leading-[28px] font-[700] text-[#191C1A] tracking-[-0.01em] mb-[20px]">
        What do you want to understand about yourself?
      </h2>

      {/* Goal chips — featured goals show upfront, rest hide behind
          "+ N more" so the initial screen stays scannable. */}
      <div className="flex flex-wrap gap-[7px] mb-[14px] flex-1 content-start overflow-y-auto">
        {visiblePatterns.map((g) => {
          const isOn = selected.includes(g.id);
          return (
            <button
              key={g.id}
              onClick={() => toggle(g.id)}
              className={`px-[13px] py-[8px] rounded-[18px] border text-[12px] leading-[16px] transition-all cursor-pointer ${
                isOn
                  ? 'bg-[#F0F0F0] border-[#000000] text-[#000000] font-[500]'
                  : 'bg-[#FFFFFF] border-[#DEDEDE] text-[#6D6C6A] font-[450] hover:border-[#C0C0BF]'
              }`}
              dangerouslySetInnerHTML={{ __html: g.label }}
            />
          );
        })}
        {hiddenCount > 0 && (
          <button
            onClick={() => setShowAll(true)}
            className="px-[13px] py-[8px] rounded-[18px] border border-dashed border-[#C0C0BF] text-[12px] leading-[16px] font-[500] text-[#8B828B] hover:text-[#191C1A] hover:border-[#8B828B] transition-colors cursor-pointer"
          >
            + {hiddenCount} more
          </button>
        )}
      </div>

      {/* Custom goal — always visible so users don't miss the escape hatch */}
      <div className="mb-[14px] flex flex-col gap-[5px]">
        <label className="text-[10px] leading-[13px] font-[700] tracking-[0.06em] uppercase text-[#8B828B]">
          Or in your own words
        </label>
        <textarea
          value={customGoal}
          onChange={(e) => setData({ customGoal: e.target.value })}
          placeholder="e.g. Whether I&rsquo;m ready to forgive someone"
          rows={2}
          className="w-full px-[12px] py-[9px] rounded-[12px] border border-[#DEDEDE] bg-white text-[12px] leading-[17px] font-[450] text-[#191C1A] placeholder:text-[#C0C0BF] focus:outline-none focus:border-[#000000] resize-none"
        />
      </div>

      {/* Continue */}
      <div className="pb-[8px]">
        <Button variant="primary" size="large" className="w-full" onClick={onNext}>
          Continue
        </Button>
      </div>
    </div>
  );
}

// Export GOALS so the confirmation screen can look up labels + syncable flags
export { GOALS };
