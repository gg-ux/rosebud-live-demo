// Matches Figma Reflection / Weekday Entry (4477:5510, 5599:10378):
// - bg surface, 10px radius, padding 16, column gap 14
// - Title row: emoji (style_O7R36V: 22/23 medium 500) + title (Title Large 17/23
//   medium 500), gap 4
// - Time on the right of the title row, Title Small in secondaryTextOnSurface
// - Body: Body Large 17/23 book 450, onSurface
// - Emotions: small chips at the bottom, Body XSmall in secondaryTextOnSurface
export function JournalEntry({ emoji = '🌻', title, body, time, emotions = [], className = '' }) {
  return (
    <div className={`bg-[var(--color-surface)] rounded-[10px] p-[16px] flex flex-col gap-[14px] ${className}`}>
      <div className="flex items-center justify-between gap-[8px]">
        <div className="flex items-center gap-[4px] min-w-0">
          <span className="text-[22px] leading-[23px] shrink-0">{emoji}</span>
          <span className="text-[17px] leading-[23px] font-[500] text-[var(--color-on-surface)] truncate">{title}</span>
        </div>
        {time && (
          <span className="text-[15px] leading-[21px] font-[500] text-[var(--color-secondary-text-on-surface)] shrink-0">
            {time}
          </span>
        )}
      </div>
      <p className="text-[17px] leading-[23px] font-[450] text-[var(--color-on-surface)] line-clamp-4">{body}</p>
      {emotions.length > 0 && (
        <div className="flex items-center flex-wrap gap-x-[10px] gap-y-[6px]">
          {emotions.map((e, i) => (
            <span
              key={i}
              className="flex items-center gap-[4px] text-[13px] leading-[18px] font-[450] text-[var(--color-secondary-text-on-surface)]"
            >
              <span>{e.emoji}</span> {e.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
