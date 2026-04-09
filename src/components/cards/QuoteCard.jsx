export function QuoteCard({ quote, author, className = '' }) {
  return (
    <div className={`bg-[#FFFFFF] rounded-[12px] p-[16px] flex flex-col items-center justify-center gap-[11px] aspect-square ${className}`}>
      <span className="text-[13px] leading-[20px] font-[300] text-[#6D6C6A]">Quote</span>
      <p className="text-[16px] leading-[22px] font-[450] text-[#191C1A] text-center italic">&ldquo;{quote}&rdquo;</p>
      {author && <span className="text-[13px] leading-[18px] font-[450] text-[#8B828B]">— {author}</span>}
    </div>
  );
}
