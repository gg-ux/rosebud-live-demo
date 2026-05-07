import { Lock } from 'lucide-react';

// Matches Figma 5748:8652 (Upgrade to Bloom):
// - bg surface (NOT surfaceVariant), 12px radius, no border
// - column center, gap 18px, padding 20px
// - lock + title row gap 6px (Title Medium W3: 16/22 medium 500)
// - body Body Medium centered, onSurface
// - button full-width (alignSelf: stretch), 12px radius, padding 10px 32px
export function UpgradeCard({ title, body, ctaLabel = 'Upgrade', className = '' }) {
  return (
    <div className={`bg-[var(--color-surface)] rounded-[12px] p-[20px] flex flex-col items-center gap-[18px] ${className}`}>
      <div className="flex items-center gap-[6px]">
        <Lock size={16} strokeWidth={2.2} className="text-[var(--color-on-surface)]" />
        <span className="text-[16px] leading-[22px] font-[500] text-[var(--color-on-surface)]">{title}</span>
      </div>
      <p className="text-[15px] leading-[20px] font-[450] text-[var(--color-on-surface)] text-center">
        {body}
      </p>
      <button className="w-full h-[44px] px-[32px] rounded-[12px] bg-[var(--color-primary)] text-[var(--color-on-primary)] text-[16px] leading-[22px] font-[500]">
        {ctaLabel}
      </button>
    </div>
  );
}
