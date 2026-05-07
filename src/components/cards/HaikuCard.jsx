export function HaikuCard({ emoji = '🍃', lines = [], className = '' }) {
  return (
    <div className={`bg-[var(--color-surface)] rounded-[12px] p-[16px] flex flex-col gap-[14px] ${className}`}>
      <div className="flex flex-col gap-[8px]">
        <div className="flex items-center gap-[5px]">
          <span className="text-[15px]">{emoji}</span>
          <span className="text-[15px] leading-[21px] font-[500] text-[var(--color-secondary-text-on-surface)]">Haiku</span>
        </div>
        <div className="flex flex-col gap-[2px]">
          {lines.map((line, i) => (
            <p key={i} className="text-[16px] leading-[22px] font-[450] text-[var(--color-on-surface)] italic">{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
