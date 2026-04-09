export function UpgradeCard({ title, body, ctaLabel = 'Upgrade', className = '' }) {
  return (
    <div className={`bg-[#F0F0F0] rounded-[12px] border border-[#C0C0BF] px-[30px] py-[30px] flex flex-col items-center gap-[18px] ${className}`}>
      <div className="flex flex-col items-center gap-[21px]">
        <span className="text-[17px] leading-[23px] font-[500] text-[#191C1A] text-center">{title}</span>
        <p className="text-[15px] leading-[20px] font-[450] text-[#6D6C6A] text-center">{body}</p>
      </div>
      <button className="h-[36px] px-[24px] rounded-[8px] bg-[#000000] text-[#FAFAFA] text-[16px] font-[500]">
        {ctaLabel}
      </button>
    </div>
  );
}
