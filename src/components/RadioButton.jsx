export function RadioButton({ checked = false, onChange, label, disabled = false, value, className = '' }) {
  return (
    <label className={`inline-flex items-center gap-[12px] cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <button
        role="radio"
        type="button"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(value)}
        className={`
          w-[24px] h-[24px] rounded-full border-2 flex items-center justify-center transition-colors
          ${checked ? 'border-[#000000]' : 'border-[var(--color-outline)]'}
        `}
      >
        {checked && <span className="w-[12px] h-[12px] rounded-full bg-[#000000]" />}
      </button>
      {label && <span className="text-[14px] leading-[20px] font-[450] text-[var(--color-on-surface)]">{label}</span>}
    </label>
  );
}
