export function ResultsDashboard() {
  return (
    <div className="px-[20px] pt-[16px] pb-[24px] flex flex-col gap-[20px]">
      <h2 className="text-[22px] leading-[30px] font-[700] text-[#191C1A]">Your Patterns</h2>

      {/* Value cards */}
      <div className="grid grid-cols-2 gap-[10px]">
        {[
          { label: 'Sleep Quality', value: '7.2', sub: 'avg hrs', trend: '+0.4' },
          { label: 'Workout', value: '4x', sub: '/week', trend: '+1' },
          { label: 'Mood Score', value: '8.1', sub: '/10', trend: '+1.3' },
          { label: 'Streak', value: '12', sub: 'days', trend: '' },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#FFFFFF] rounded-[12px] p-[14px] ring-1 ring-[#F0F0F0]">
            <span className="text-[12px] leading-[16px] font-[450] text-[#6D6C6A]">{stat.label}</span>
            <div className="flex items-baseline gap-[4px] mt-[4px]">
              <span className="text-[24px] leading-[32px] font-[600] text-[#191C1A]">{stat.value}</span>
              <span className="text-[13px] font-[450] text-[#8B828B]">{stat.sub}</span>
            </div>
            {stat.trend && (
              <span className="text-[12px] font-[500] text-[#36846C] mt-[2px] block">{stat.trend} this week</span>
            )}
          </div>
        ))}
      </div>

      {/* Trend chart */}
      <div className="bg-[#FFFFFF] rounded-[12px] p-[16px] ring-1 ring-[#F0F0F0]">
        <span className="text-[14px] leading-[20px] font-[500] text-[#191C1A] mb-[12px] block">Sleep & Mood — 4 Weeks</span>
        <svg viewBox="0 0 340 100" className="w-full" fill="none">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(y => (
            <line key={y} x1="0" y1={y} x2="340" y2={y} stroke="#F0F0F0" strokeWidth="1" />
          ))}
          {/* Sleep line */}
          <polyline
            points="0,70 40,60 80,55 120,65 160,50 200,45 240,40 280,35 320,30 340,28"
            stroke="#0A84FF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Mood line */}
          <polyline
            points="0,80 40,75 80,65 120,70 160,55 200,50 240,45 280,40 320,35 340,30"
            stroke="#E31665"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="flex gap-[16px] mt-[10px]">
          <div className="flex items-center gap-[6px]">
            <div className="w-[12px] h-[3px] rounded bg-[#0A84FF]" />
            <span className="text-[11px] text-[#6D6C6A]">Sleep</span>
          </div>
          <div className="flex items-center gap-[6px]">
            <div className="w-[12px] h-[3px] rounded bg-[#E31665]" />
            <span className="text-[11px] text-[#6D6C6A]">Mood</span>
          </div>
        </div>
      </div>
    </div>
  );
}
