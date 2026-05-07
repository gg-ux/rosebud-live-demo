import { Lock } from 'lucide-react';

// Matches Figma 4477:5510 (Weekly Report Locked):
// - bg surface, 12px radius, padding 20px, column center gap 18px
// - icon+title row gap 6px (Title Medium W3: 16/22 medium 500)
// - body Body Medium centered, onSurface
// - footer Body Medium W06 in secondaryTextOnSurface
export function WeeklyReportLocked({
  title = 'Unlocks Sunday',
  body = 'Get a weekly in-depth AI analysis of your themes, patterns, and more.',
  footer = 'Requires 1 more entry',
  className = '',
}) {
  return (
    <div className={`bg-[var(--color-surface)] rounded-[12px] p-[20px] flex flex-col items-center gap-[18px] ${className}`}>
      <div className="flex items-center gap-[6px]">
        <Lock size={16} strokeWidth={2.2} className="text-[var(--color-on-surface)]" />
        <span className="text-[16px] leading-[22px] font-[500] text-[var(--color-on-surface)]">{title}</span>
      </div>
      <p className="text-[15px] leading-[20px] font-[450] text-[var(--color-on-surface)] text-center">
        {body}
      </p>
      {footer && (
        <p className="text-[15px] leading-[20px] font-[450] text-[var(--color-secondary-text-on-surface)] text-center">
          {footer}
        </p>
      )}
    </div>
  );
}
