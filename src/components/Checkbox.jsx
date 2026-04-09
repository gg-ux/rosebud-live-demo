export function Checkbox({ checked = false, onChange, label, disabled = false, className = '' }) {
  return (
    <label className={`inline-flex items-center gap-[12px] cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <button
        role="checkbox"
        type="button"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={`
          w-[24px] h-[24px] rounded-[6px] flex items-center justify-center transition-colors
          ${checked
            ? 'bg-[#000000] text-white'
            : 'bg-transparent border-2 border-[var(--color-outline)] text-transparent'
          }
        `}
      >
        <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
          <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {label && <span className="text-[14px] leading-[20px] font-[450] text-[var(--color-on-surface)]">{label}</span>}
    </label>
  );
}
