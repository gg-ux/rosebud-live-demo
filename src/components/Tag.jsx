export function Tag({ children, className = '' }) {
  return (
    <span
      className={`
        inline-flex items-center px-[10px] py-[4px] rounded-[8px]
        bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)]
        text-[12px] leading-[17px] font-[450]
        ${className}
      `}
    >
      {children}
    </span>
  );
}
