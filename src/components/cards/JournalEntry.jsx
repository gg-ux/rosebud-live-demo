export function JournalEntry({ emoji = '🌻', title, body, time, emotions = [], className = '' }) {
  return (
    <div className={`bg-[#FFFFFF] rounded-[10px] p-[16px] flex flex-col gap-[12px] ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[4px]">
          <span className="text-[22px]">{emoji}</span>
          <span className="text-[17px] leading-[23px] font-[500] text-[#191C1A]">{title}</span>
        </div>
        {time && <span className="text-[15px] leading-[21px] font-[500] text-[#8B828B]">{time}</span>}
      </div>
      <p className="text-[16px] leading-[22px] font-[450] text-[#191C1A] line-clamp-4">{body}</p>
      {emotions.length > 0 && (
        <div className="flex items-center gap-[8px]">
          {emotions.map((e, i) => (
            <span key={i} className="flex items-center gap-[4px] text-[13px] leading-[18px] font-[450] text-[#6D6C6A]">
              <span>{e.emoji}</span> {e.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
