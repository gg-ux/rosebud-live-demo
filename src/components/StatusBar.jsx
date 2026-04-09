export function StatusBar({ dark = false }) {
  const color = dark ? '#FFFFFF' : '#000000';
  return (
    <div className="h-[47px] px-[24px] flex items-center pt-[4px] justify-between">
      <span className="text-[15px] leading-[20px] font-[600]" style={{ color }}>9:41</span>
      <div className="flex items-center gap-[6px]">
        {/* Signal */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <rect x="0" y="8" width="3" height="4" rx="0.5" fill={color} />
          <rect x="4.5" y="5" width="3" height="7" rx="0.5" fill={color} />
          <rect x="9" y="2" width="3" height="10" rx="0.5" fill={color} />
          <rect x="13.5" y="0" width="3" height="12" rx="0.5" fill={color} />
        </svg>
        {/* Wifi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 11.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" fill={color} />
          <path d="M4.5 7.5a5 5 0 017 0" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M2 4.5a9 9 0 0112 0" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        {/* Battery */}
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
          <rect x="0.5" y="0.5" width="22" height="12" rx="2" stroke={color} strokeOpacity="0.35" />
          <rect x="2" y="2" width="19" height="9" rx="1" fill={color} />
          <path d="M24 4.5v4a2 2 0 000-4z" fill={color} fillOpacity="0.4" />
        </svg>
      </div>
    </div>
  );
}
