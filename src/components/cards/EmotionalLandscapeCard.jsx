export function EmotionalLandscapeCard({ emotions = [], className = '' }) {
  const maxVal = Math.max(...emotions.map(e => e.value), 1);
  return (
    <div className={`bg-[var(--color-surface)] rounded-[12px] p-[16px] flex flex-col gap-[17px] ${className}`}>
      <span className="text-[17px] leading-[23px] font-[500] text-[var(--color-on-surface)]">Emotional Landscape</span>
      <div className="flex items-end gap-[8px] h-[80px]">
        {emotions.map((e, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-[4px]">
            <div
              className="w-full rounded-[4px] bg-[var(--color-primary)]"
              style={{ height: `${(e.value / maxVal) * 64}px` }}
            />
            <span className="text-[10px] leading-[13px] font-[450] text-[var(--color-secondary-text-on-surface)] truncate max-w-full">{e.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
