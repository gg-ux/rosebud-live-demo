export function EntryDraftCard({ title, body, time, className = '' }) {
  return (
    <div className={`bg-[#FFFFFF] rounded-[10px] p-[16px] flex flex-col gap-[10px] border border-[#DEDEDE] border-dashed ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-[14px] leading-[20px] font-[450] text-[#8B828B]">Draft</span>
        {time && <span className="text-[13px] leading-[18px] font-[450] text-[#8B828B]">{time}</span>}
      </div>
      {title && <span className="text-[17px] leading-[23px] font-[500] text-[#191C1A]">{title}</span>}
      {body && <p className="text-[15px] leading-[20px] font-[450] text-[#6D6C6A] line-clamp-2">{body}</p>}
    </div>
  );
}
