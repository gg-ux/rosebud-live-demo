export function DailyPromptCard({ title, body, bookmarked = false, className = '' }) {
  return (
    <div className={`bg-[var(--color-surface)] rounded-[12px] p-[16px] flex flex-col gap-[12px] ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-[8px] flex-1">
          <span className="text-[17px] leading-[23px] font-[500] text-[var(--color-on-surface)]">{title}</span>
          <p className="text-[15px] leading-[20px] font-[450] text-[var(--color-secondary-text)]">{body}</p>
        </div>
        <button className="shrink-0 ml-[12px]" aria-label={bookmarked ? 'Bookmarked' : 'Bookmark'}>
          <svg viewBox="0 0 20 20" fill={bookmarked ? '#000000' : 'none'} stroke="currentColor" strokeWidth="1.5" className="w-[20px] h-[20px]">
            <path d="M5 3a2 2 0 00-2 2v12l7-4 7 4V5a2 2 0 00-2-2H5z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
