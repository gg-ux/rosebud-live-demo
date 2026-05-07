export function PersonaCard({ name, description, avatar, type = 'Default', className = '' }) {
  const badges = {
    Community: { label: 'Community', color: 'bg-[#BEEAF7] text-[#001F26]' },
    Custom: { label: 'Custom', color: 'bg-[#FFE2ED] text-[#7E0230]' },
    Shared: { label: 'Shared', color: 'bg-[#97F7B7] text-[#00210F]' },
  };
  const badge = badges[type];

  return (
    <div className={`bg-[var(--color-surface)] rounded-[12px] p-[16px] flex flex-col gap-[12px] ${className}`}>
      <div className="flex items-center gap-[12px]">
        <div className="w-[40px] h-[40px] rounded-full bg-[var(--color-surface-variant)] flex items-center justify-center overflow-hidden shrink-0">
          {avatar ? (
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[16px]">🤖</span>
          )}
        </div>
        <div className="flex flex-col gap-[2px] flex-1 min-w-0">
          <div className="flex items-center gap-[8px]">
            <span className="text-[16px] leading-[22px] font-[500] text-[var(--color-on-surface)] truncate">{name}</span>
            {badge && (
              <span className={`px-[8px] py-[2px] rounded-full text-[11px] font-[500] shrink-0 ${badge.color}`}>
                {badge.label}
              </span>
            )}
          </div>
          <p className="text-[13px] leading-[18px] font-[450] text-[var(--color-secondary-text)] line-clamp-2">{description}</p>
        </div>
      </div>
    </div>
  );
}
