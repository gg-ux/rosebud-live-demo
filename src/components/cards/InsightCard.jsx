export function InsightCard({ emoji = '💡', title = 'Insight', body, className = '' }) {
  return (
    <div className={`bg-[#F0F0F0] rounded-[12px] p-[16px] flex flex-col gap-[14px] ${className}`}>
      <div className="flex flex-col gap-[8px]">
        <div className="flex items-center gap-[5px]">
          <span className="text-[15px]">{emoji}</span>
          <span className="text-[15px] leading-[21px] font-[500] text-[#191C1A]">{title}</span>
        </div>
        <p className="text-[16px] leading-[22px] font-[450] text-[#191C1A]">{body}</p>
      </div>
    </div>
  );
}
