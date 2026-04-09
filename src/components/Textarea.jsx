export function Textarea({
  label,
  helper,
  error,
  disabled = false,
  className = '',
  ...props
}) {
  const hasError = !!error;

  return (
    <div className={`flex flex-col gap-[6px] ${className}`}>
      {label && (
        <label className="text-[14px] leading-[20px] font-[450] text-[var(--color-on-surface)]">
          {label}
        </label>
      )}
      <textarea
        disabled={disabled}
        className={`
          min-h-[120px] px-[16px] pt-[16px] pb-[6px] rounded-[12px]
          text-[16px] leading-[22px] font-[450]
          transition-colors resize-y outline-none
          ${disabled
            ? 'bg-[#DEDEDE] text-[#6D6C6A] cursor-not-allowed'
            : 'bg-[#FFFFFF] text-[#000000]'
          }
          placeholder:text-[#6D6C6A]
          ${hasError
            ? 'ring-1 ring-[#BA1A1A]'
            : 'focus:ring-1 focus:ring-[#DEDEDE]'
          }
        `}
        {...props}
      />
      {(helper || error) && (
        <span className={`text-[12px] leading-[16px] font-[500] ${hasError ? 'text-[#BA1A1A]' : 'text-[var(--color-secondary-text)]'}`}>
          {error || helper}
        </span>
      )}
    </div>
  );
}
