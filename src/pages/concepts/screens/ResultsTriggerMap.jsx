export function ResultsTriggerMap() {
  const connections = [
    { trigger: 'Late caffeine', response: 'Poor sleep', outcome: 'Low energy next day', color: '#E31665' },
    { trigger: 'Morning exercise', response: 'Better mood', outcome: 'Higher productivity', color: '#36846C' },
    { trigger: 'Skipped supplements', response: 'Afternoon crash', outcome: 'Irritability', color: '#D28D1A' },
  ];

  return (
    <div className="px-[20px] pt-[16px] pb-[24px] flex flex-col gap-[20px]">
      <div>
        <h2 className="text-[22px] leading-[30px] font-[700] text-[#191C1A]">Trigger-Response Map</h2>
        <p className="text-[14px] leading-[20px] font-[450] text-[#6D6C6A] mt-[4px]">
          Connections we&apos;ve found across your entries
        </p>
      </div>

      <div className="flex flex-col gap-[16px]">
        {connections.map((conn, i) => (
          <div key={i} className="bg-[#FFFFFF] rounded-[12px] p-[16px] ring-1 ring-[#F0F0F0]">
            <div className="flex items-center gap-[8px]">
              {/* Trigger */}
              <span className="px-[10px] py-[6px] rounded-full bg-[#F0F0F0] text-[13px] font-[500] text-[#191C1A] shrink-0">
                {conn.trigger}
              </span>

              {/* Arrow */}
              <svg viewBox="0 0 24 8" className="w-[24px] h-[8px] shrink-0" fill="none">
                <path d="M0 4h20m0 0l-4-3.5M20 4l-4 3.5" stroke={conn.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              {/* Response */}
              <span className="px-[10px] py-[6px] rounded-full text-[13px] font-[500] text-white shrink-0" style={{ backgroundColor: conn.color }}>
                {conn.response}
              </span>
            </div>

            <div className="flex items-center gap-[8px] mt-[10px] ml-[8px]">
              <svg viewBox="0 0 16 20" className="w-[16px] h-[20px] shrink-0" fill="none">
                <path d="M8 0v16m0 0l-3.5-3.5M8 16l3.5-3.5" stroke="#C0C0BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[14px] leading-[20px] font-[450] text-[#6D6C6A]">{conn.outcome}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#F0FFF4] rounded-[12px] p-[16px]">
        <p className="text-[14px] leading-[20px] font-[450] text-[#36846C]">
          <span className="font-[600]">Pattern detected:</span> Your sleep quality improves 40% on days you exercise before noon.
        </p>
      </div>
    </div>
  );
}
