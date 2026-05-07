// Matches Figma Goals (4606:3865, Type=Todo / Type=Goals):
// - Top label pill in surfaceVariant
// - Card: surface bg, 12px radius, items separated by 1px background-on-surface lines
// - Each item: row, padding 8/16/8/10, gap (icon+label) — status circle on right
//   - Status: 22×22 stroke 2px circle in onBackground (not done)
//   - Done: filled primary circle with white check
// - Label: Body Medium (16/22) onBackground; done = strikethrough + secondaryTextOnSurface
export function GoalsCard({ type = 'Todo', title, items = [], className = '' }) {
  const typeLabels = { Todo: 'To-do', Goals: 'Goals', Type3: 'Habits' };
  return (
    <div className={`flex flex-col gap-[13px] ${className}`}>
      <span className="px-[10px] py-[4px] rounded-full bg-[var(--color-surface-variant)] text-[13px] leading-[18px] font-[450] text-[var(--color-on-surface)] self-start">
        {typeLabels[type] || type}
      </span>
      <div className="bg-[var(--color-surface)] rounded-[12px] flex flex-col">
        {title && (
          <span className="text-[16px] leading-[22px] font-[500] text-[var(--color-on-surface)] px-[16px] pt-[16px] pb-[8px]">
            {title}
          </span>
        )}
        {items.map((item, i) => (
          <div
            key={i}
            className={`flex items-center justify-between gap-[12px] py-[8px] pr-[16px] pl-[10px] ${
              i > 0 ? 'border-t border-[var(--color-background-on-surface)]' : ''
            }`}
          >
            <span
              className={`text-[16px] leading-[22px] font-[450] flex items-center gap-[8px] ${
                item.done
                  ? 'text-[var(--color-secondary-text-on-surface)] line-through'
                  : 'text-[var(--color-on-surface)]'
              }`}
            >
              {item.label}
            </span>
            <div
              className={`w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 ${
                item.done
                  ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                  : 'border-2 border-[var(--color-on-surface)]'
              }`}
            >
              {item.done && (
                <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
                  <path
                    d="M3 8l3.5 3.5L13 5"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
