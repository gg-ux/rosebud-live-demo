const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-colors cursor-pointer font-[var(--font-sans)] text-[16px] leading-[22px]';

const typeStyles = {
  primary: {
    default: 'bg-[#000000] text-[#FAFAFA]',
    clicked: 'bg-[#191C1A] text-[#FAFAFA]',
    disabled: 'bg-[#C9CAC9] text-[#FAFAFA] cursor-not-allowed',
  },
  secondary: {
    default: 'bg-[#FFFFFF] text-[#191C1A] border border-[#C9CAC9]',
    clicked: 'bg-[#DEDEDE] text-[#191C1A] border border-[#C9CAC9]',
    disabled: 'bg-[#FFFFFF] text-[#C9CAC9] border border-[#DEDEDE] cursor-not-allowed',
  },
  tertiary: {
    default: 'bg-[#FFFFFF] text-[#191C1A]',
    clicked: 'bg-[#DEDEDE] text-[#191C1A]',
    disabled: 'bg-[#FFFFFF] text-[#C9CAC9] cursor-not-allowed',
  },
  destructive: {
    default: 'bg-[#FFFFFF] text-[#BA1A1A]',
    clicked: 'bg-[#DEDEDE] text-[#BA1A1A]',
    disabled: 'bg-[#FFFFFF] text-[#FFDAD6] cursor-not-allowed',
  },
  naked: {
    default: 'bg-transparent text-[#000000]',
    clicked: 'bg-transparent text-[#191C1A]',
    disabled: 'bg-transparent text-[#C9CAC9] cursor-not-allowed',
  },
};

const sizeSpecs = {
  small:   { height: 'h-[36px]', radius: 'rounded-[8px]',  padding: 'px-[24px] py-[8px]',  iconPadding: 'p-[8px]' },
  regular: { height: 'h-[44px]', radius: 'rounded-[12px]', padding: 'px-[32px] py-[10px]', iconPadding: 'p-[10px]' },
  large:   { height: 'h-[48px]', radius: 'rounded-[12px]', padding: 'px-[32px] py-[12px]', iconPadding: 'p-[12px]' },
};

export function Button({
  variant = 'primary',
  size = 'regular',
  icon,
  iconOnly = false,
  disabled = false,
  children,
  className = '',
  ...props
}) {
  const state = disabled ? 'disabled' : 'default';
  const colors = typeStyles[variant][state];
  const specs = sizeSpecs[size];
  const isNakedIconOnly = variant === 'naked' && iconOnly;

  return (
    <button
      disabled={disabled}
      className={`
        ${baseStyles} ${colors} ${specs.height}
        ${isNakedIconOnly ? 'rounded-full' : specs.radius}
        ${iconOnly ? specs.iconPadding : specs.padding}
        ${!disabled ? 'hover:opacity-90 active:opacity-80' : ''}
        ${className}
      `}
      {...props}
    >
      {icon && <span className="w-5 h-5 flex items-center justify-center">{icon}</span>}
      {!iconOnly && children}
    </button>
  );
}
