// Matches Figma Entry Draft (4477:5544 / canvas 21159):
// - bg surface, 12px radius, 1px outlineLight dashed border (visual cue
//   that the entry is unfinished)
// - "Draft" label: UPPERCASE 11/16 Book secondaryTextOnSurface (style_E09EK9)
// - Title (when given): Title Large 17/23 medium 500 onSurface
// - Body: Body Medium W06 16/22 book 450 onSurface (Figma uses fill_8YGL99)
// - Time aligned on the right of the label row (Body Small style)
export function EntryDraftCard({ title, body, time, className = '' }) {
  return (
    <div className={`bg-[var(--color-surface)] rounded-[12px] p-[16px] flex flex-col gap-[10px] border border-[var(--color-outline-light)] border-dashed ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] leading-[16px] font-[450] uppercase tracking-[0.05em] text-[var(--color-secondary-text-on-surface)]">
          Draft
        </span>
        {time && (
          <span className="text-[13px] leading-[18px] font-[450] text-[var(--color-secondary-text-on-surface)]">
            {time}
          </span>
        )}
      </div>
      {title && (
        <span className="text-[17px] leading-[23px] font-[500] text-[var(--color-on-surface)]">
          {title}
        </span>
      )}
      {body && (
        <p className="text-[16px] leading-[22px] font-[450] text-[var(--color-on-surface)] line-clamp-2">
          {body}
        </p>
      )}
    </div>
  );
}
