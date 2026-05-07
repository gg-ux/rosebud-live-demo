export function LoadingCard({ progress = 0.7, className = '' }) {
  return (
    <div className={`bg-[var(--color-surface)] rounded-[12px] overflow-hidden ${className}`}>
      <div className="px-[24px] py-[10px] flex items-center">
        <div className="flex-1 h-[6px] rounded-[2px] bg-[var(--color-outline)]">
          <div className="h-full rounded-[2px] bg-[var(--color-primary)]" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
    </div>
  );
}
