// Matches Figma Key Theme (4477:6480):
// - bg surface, 12px radius, column stretch gap 17, padding 16
// - Title "Key Themes" Title Medium W1 (16/22 medium 500), onSurface
// - Optional subtitle (Display Medium 22/30 medium 500, onSurface) — pattern
//   like "Personal Growth & Environment"
// - Tags: 22h pill chips with backgroundOnSurface bg (#F8F8F8), 6px radius,
//   padding 4×6, Body XSmall (13/15) text in onSurface
export function KeyThemeCard({ title = 'Key Themes', subtitle, themes = [], className = '' }) {
  return (
    <div className={`bg-[var(--color-surface)] rounded-[12px] p-[16px] flex flex-col gap-[17px] ${className}`}>
      <div className="flex flex-col gap-[8px]">
        <span className="text-[16px] leading-[22px] font-[500] text-[var(--color-on-surface)]">{title}</span>
        {subtitle && (
          <span className="text-[22px] leading-[30px] font-[500] text-[var(--color-on-surface)]">
            {subtitle}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-[6px]">
        {themes.map((theme, i) => (
          <span
            key={i}
            className="inline-flex items-center px-[6px] py-[4px] h-[22px] rounded-[6px] bg-[var(--color-background-on-surface)] text-[13px] leading-[15px] font-[450] text-[var(--color-on-surface)]"
          >
            {theme}
          </span>
        ))}
      </div>
    </div>
  );
}
