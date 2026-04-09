export function Switch({ checked = false, onChange, label, disabled = false, className = '' }) {
  return (
    <label className={`inline-flex items-center gap-[12px] cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <button
        role="switch"
        type="button"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={`
          relative w-[51px] h-[30px] rounded-[12px] transition-colors
          ${checked ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-outline)]'}
        `}
      >
        <span
          className={`
            absolute top-[3px] left-[3px] w-[24px] h-[24px] rounded-[10px] bg-white
            transition-transform shadow-sm
            ${checked ? 'translate-x-[21px]' : 'translate-x-0'}
          `}
        />
      </button>
      {label && <span className="text-[14px] leading-[20px] font-[450] text-[var(--color-on-surface)]">{label}</span>}
    </label>
  );
}
