export function HaikuCard({ emoji = '🍃', lines = [], className = '' }) {
  return (
    <div className={`bg-[#F0F0F0] rounded-[12px] p-[16px] flex flex-col gap-[14px] ${className}`}>
      <div className="flex flex-col gap-[8px]">
        <div className="flex items-center gap-[5px]">
          <span className="text-[15px]">{emoji}</span>
          <span className="text-[15px] leading-[21px] font-[500] text-[#191C1A]">Haiku</span>
        </div>
        <div className="flex flex-col gap-[2px]">
          {lines.map((line, i) => (
            <p key={i} className="text-[16px] leading-[22px] font-[450] text-[#191C1A] italic">{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
