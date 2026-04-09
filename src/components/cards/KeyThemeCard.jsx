export function KeyThemeCard({ title = 'Key Themes', themes = [], className = '' }) {
  return (
    <div className={`bg-[#FFFFFF] rounded-[12px] p-[16px] flex flex-col gap-[17px] ${className}`}>
      <div className="flex flex-col gap-[12px]">
        <span className="text-[17px] leading-[23px] font-[500] text-[#191C1A]">{title}</span>
        <div className="flex flex-wrap gap-[8px]">
          {themes.map((theme, i) => (
            <span key={i} className="px-[12px] py-[6px] rounded-full bg-[#F0F0F0] text-[13px] leading-[18px] font-[450] text-[#191C1A]">
              {theme}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
