// Matches Figma Gratitude Challenge Card (5987:10952 / canvas 24723):
// - bg surface, 12px radius, padding 16, gap 16, column
// - Title "10-Day Gratitude Challenge" Title Large 17/23 medium 500 onSurface
// - Subtitle (e.g. "Day 3: Permission to Grieve") Label Large 14/20 book 450
//   in secondaryTextOnSurface (Figma fill_US1HIN)
// - Day pills: Figma renders one pill per day with checkmark on completed.
//   We use a simpler 6px progress segment row (mobile-friendly minimal version).
// - CTA full-width primary button when given (12px radius, 44h)
export function GratitudeChallengeCard({ title = '10-Day Gratitude Challenge', subtitle, ctaLabel, daysCompleted = 0, totalDays = 10, className = '' }) {
  return (
    <div className={`bg-[var(--color-surface)] rounded-[12px] p-[16px] flex flex-col gap-[16px] ${className}`}>
      <div className="flex flex-col gap-[6px]">
        <span className="text-[17px] leading-[23px] font-[500] text-[var(--color-on-surface)]">{title}</span>
        {subtitle && (
          <p className="text-[14px] leading-[20px] font-[450] text-[var(--color-secondary-text-on-surface)]">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex gap-[6px]">
        {Array.from({ length: totalDays }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-[6px] rounded-full ${i < daysCompleted ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-outline-light)]'}`}
          />
        ))}
      </div>
      {ctaLabel && (
        <button className="h-[44px] w-full px-[32px] rounded-[12px] bg-[var(--color-primary)] text-[var(--color-on-primary)] text-[16px] leading-[22px] font-[500]">
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
