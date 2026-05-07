// Matches Figma Ask Rosebud (5752:8364):
// - bg surface, 10px radius, padding 16, gap 24 between blocks
// - Header row: ✨ + "Ask" Title Small in secondaryTextOnSurface · date / time
//   on the right (also Title Small in secondaryTextOnSurface)
// - Question (Body Medium W06, secondaryText)
// - Answer (Body Large 17/23 onSurface)
export function AskRosebudCard({ question, answer, date, time, className = '' }) {
  return (
    <div className={`bg-[var(--color-surface)] rounded-[10px] p-[16px] pb-[24px] flex flex-col gap-[24px] ${className}`}>
      <div className="flex flex-col gap-[10px]">
        <div className="flex items-center justify-between gap-[8px]">
          <div className="flex items-center gap-[6px]">
            <span className="text-[15px]">✨</span>
            <span className="text-[15px] leading-[21px] font-[500] text-[var(--color-secondary-text-on-surface)]">
              Ask
            </span>
          </div>
          {(date || time) && (
            <div className="flex items-center gap-[6px] text-[15px] leading-[21px] font-[500] text-[var(--color-secondary-text-on-surface)]">
              {date && <span>{date}</span>}
              {time && <span>{time}</span>}
            </div>
          )}
        </div>
        <p className="text-[16px] leading-[22px] font-[450] text-[var(--color-on-surface)]">{question}</p>
      </div>
      {answer && (
        <p className="text-[17px] leading-[23px] font-[450] text-[var(--color-on-surface)]">{answer}</p>
      )}
    </div>
  );
}
