import { Lock } from 'lucide-react';

// Matches Figma 5749:8295 (Locked: Progress Off) and 5749:8294 (Progress On):
// - bg surface, 12px radius, padding 20px, column center gap 18px
// - lock + title row gap 6px (Title Medium W3: 16/22 medium 500)
// - When `progress` (0..1) is given: render a 12px-tall pill progress bar
//   with 1px outline stroke, then a footer in secondaryTextOnSurface.
// - When no progress: render an Upgrade button (full-width, 12px radius).
export function LockedFeatureCard({
  title,
  body,
  footer,
  progress,
  ctaLabel = 'Upgrade',
  className = '',
}) {
  const showProgress = typeof progress === 'number';
  return (
    <div className={`bg-[var(--color-surface)] rounded-[12px] p-[20px] flex flex-col items-center gap-[18px] ${className}`}>
      <div className="flex items-center gap-[6px]">
        <Lock size={16} strokeWidth={2.2} className="text-[var(--color-on-surface)]" />
        <span className="text-[16px] leading-[22px] font-[500] text-[var(--color-on-surface)]">{title}</span>
      </div>
      {body && (
        <p className="text-[15px] leading-[20px] font-[450] text-[var(--color-on-surface)] text-center">
          {body}
        </p>
      )}
      {showProgress && (
        <div className="w-full h-[12px] rounded-full border border-[var(--color-outline)] bg-[var(--color-surface)] overflow-hidden">
          <div
            className="h-full bg-[var(--color-primary)]"
            style={{ width: `${Math.max(0, Math.min(1, progress)) * 100}%` }}
          />
        </div>
      )}
      {footer && (
        <p className="text-[15px] leading-[20px] font-[450] text-[var(--color-secondary-text-on-surface)] text-center">
          {footer}
        </p>
      )}
      {!showProgress && (
        <button className="w-full h-[44px] px-[32px] rounded-[12px] bg-[var(--color-primary)] text-[var(--color-on-primary)] text-[16px] leading-[22px] font-[500]">
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
