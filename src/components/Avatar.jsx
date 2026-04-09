const sizeStyles = {
  sm: 'w-[32px] h-[32px] text-[12px]',
  md: 'w-[40px] h-[40px] text-[14px]',
  lg: 'w-[56px] h-[56px] text-[16px]',
};

export function Avatar({ src, name, size = 'md', className = '' }) {
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div
      className={`
        ${sizeStyles[size]} rounded-full flex items-center justify-center
        overflow-hidden bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] font-[500]
        ${className}
      `}
    >
      {src ? (
        <img src={src} alt={name || 'Avatar'} className="w-full h-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
