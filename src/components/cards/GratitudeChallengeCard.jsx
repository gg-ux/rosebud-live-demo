export function GratitudeChallengeCard({ title = '10-Day Gratitude Challenge', subtitle, ctaLabel, daysCompleted = 0, totalDays = 10, className = '' }) {
  return (
    <div className={`bg-[#FFFFFF] rounded-[12px] p-[16px] flex flex-col gap-[16px] ${className}`}>
      <div className="flex flex-col gap-[8px]">
        <span className="text-[17px] leading-[23px] font-[500] text-[#191C1A]">{title}</span>
        {subtitle && <p className="text-[14px] leading-[20px] font-[450] text-[#6D6C6A]">{subtitle}</p>}
      </div>
      <div className="flex gap-[6px]">
        {Array.from({ length: totalDays }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-[6px] rounded-full ${i < daysCompleted ? 'bg-[#000000]' : 'bg-[#DEDEDE]'}`}
          />
        ))}
      </div>
      {ctaLabel && (
        <button className="h-[44px] px-[32px] rounded-[12px] bg-[#000000] text-[#FAFAFA] text-[16px] font-[500] self-start">
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
