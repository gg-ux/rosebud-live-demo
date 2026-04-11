import { Button } from '../../../../components/Button';

/* ══════════════════════════════════════════════════════════
   V5 · Body Details — optional free-text for meds/supplements
   This screen only renders if the user picked Supplements or
   Medication on the Body step. It&rsquo;s a pure detour: users can
   specify what they&rsquo;re taking, or skip and come back later.
   ══════════════════════════════════════════════════════════ */
export function OnboardingV5BodyDetails({ data, setData, onNext, onBack, step = 2, total = 4 }) {
  const selected = data.goals || [];
  const hasMedsSupps = selected.includes('meds-supps');

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
          onClick={onNext}
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
        Want to get specific?
      </h2>
      <p className="text-[13px] leading-[20px] font-[450] text-[#6D6C6A] mb-[20px]">
        This is optional and helps Rosebud recognize what to look for. You can change this later.
      </p>

      {/* Single free-text block — modest height so it doesn't imply the
          user needs to write a novel. Empty space below is fine because
          this whole step is optional. */}
      <div className="mb-[16px] flex-1">
        {hasMedsSupps && (
          <textarea
            value={data.takingDetail || ''}
            onChange={(e) => setData({ takingDetail: e.target.value })}
            placeholder="e.g. Vitamin D, Magnesium, Sertraline 50mg, Birth control"
            rows={4}
            className="w-full px-[14px] py-[12px] rounded-[14px] border border-[#DEDEDE] bg-white text-[13px] leading-[19px] font-[450] text-[#191C1A] placeholder:text-[#C0C0BF] focus:outline-none focus:border-[#000000] resize-none"
          />
        )}
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
