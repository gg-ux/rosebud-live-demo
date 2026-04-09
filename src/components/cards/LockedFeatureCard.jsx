export function LockedFeatureCard({ icon, title, body, className = '' }) {
  return (
    <div className={`bg-[#FFFFFF] rounded-[18px] px-[20px] py-[20px] flex flex-col gap-[14px] ${className}`}>
      <div className="flex flex-col gap-[9px]">
        <div className="flex items-center gap-[6px]">
          {icon && <span className="text-[16px]">{icon}</span>}
          <span className="text-[17px] leading-[23px] font-[500] text-[#191C1A]">{title}</span>
        </div>
        <p className="text-[15px] leading-[20px] font-[450] text-[#6D6C6A]">{body}</p>
      </div>
      <button className="h-[36px] px-[24px] rounded-[8px] bg-[#000000] text-[#FAFAFA] text-[16px] font-[500] self-start">
        Upgrade
      </button>
    </div>
  );
}
