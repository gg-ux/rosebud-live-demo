// Matches Figma Quote (4606:3863):
// - 404×404 square card, surface bg, 12px radius
// - column center, gap 11, padding 16
// - "Quote" label: UPPERCASE Caption-light (13/20 light 300, secondaryTextOnSurface)
// - Quote text: 16/30 medium 500 onBackground, centered (NOT italic per Figma)
// - Author: same 16/30 medium 500 onBackground, en-dash, centered
export function QuoteCard({ quote, author, className = '' }) {
  return (
    <div className={`bg-[var(--color-surface)] rounded-[12px] p-[16px] flex flex-col items-center justify-center gap-[11px] aspect-square ${className}`}>
      <span className="text-[13px] leading-[20px] font-[300] uppercase tracking-[0.001em] text-[var(--color-secondary-text-on-surface)]">
        Quote
      </span>
      <p className="text-[16px] leading-[30px] font-[500] text-[var(--color-on-surface)] text-center">
        {quote}
      </p>
      {author && (
        <span className="text-[16px] leading-[30px] font-[500] text-[var(--color-on-surface)] text-center">
          – {author}
        </span>
      )}
    </div>
  );
}
