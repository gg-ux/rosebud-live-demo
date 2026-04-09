export function CheckboxCard({ checked = false, onChange, disabled = false, children, className = '' }) {
  const isDisabledChecked = disabled && checked;

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`
        flex items-center gap-[12px] h-[56px] px-[16px] rounded-[12px]
        bg-[#FFFFFF] text-left transition-colors w-full
        ${disabled && !checked ? 'text-[#C0C0BF]' : 'text-[#191C1A]'}
        ${checked && !disabled ? 'ring-1 ring-[#191C1A]' : ''}
        ${isDisabledChecked ? 'ring-1 ring-[#C9CAC9]' : ''}
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <div
        className={`
          w-[20px] h-[20px] rounded-[4px] flex items-center justify-center shrink-0
          ${checked ? 'bg-[#191C1A] text-white' : 'border-2 border-[#C0C0BF]'}
          ${isDisabledChecked ? 'bg-[#C9CAC9]' : ''}
        `}
      >
        {checked && (
          <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
            <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className="text-[16px] leading-[22px] font-[450]">{children}</span>
    </button>
  );
}
