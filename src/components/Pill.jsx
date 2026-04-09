export function Pill({ children, icon, iconOnly = false, className = '' }) {
  return (
    <span
      className={`
        inline-flex items-center gap-[6px] px-[12px] py-[8px]
        rounded-full bg-[#F8F8F8] text-[#000000]
        text-[13px] leading-[18px] font-[450]
        ${className}
      `}
    >
      {icon && <span className="w-4 h-4 flex items-center justify-center">{icon}</span>}
      {!iconOnly && children}
    </span>
  );
}
