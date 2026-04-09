export function ValueCard({ label, value, icon, size = 'M', className = '' }) {
  const isSmall = size === 'S';
  return (
    <div className={`bg-[#FFFFFF] rounded-[12px] p-[16px] flex flex-col ${isSmall ? 'gap-[4px]' : 'gap-[8px]'} ${className}`}>
      <div className="flex items-center gap-[6px]">
        {icon && <span className="text-[14px]">{icon}</span>}
        <span className="text-[14px] leading-[20px] font-[450] text-[#6D6C6A]">{label}</span>
      </div>
      <span className={`font-[500] text-[#191C1A] ${isSmall ? 'text-[20px] leading-[28px]' : 'text-[24px] leading-[32px]'}`}>
        {value}
      </span>
    </div>
  );
}
