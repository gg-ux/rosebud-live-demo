export function ResultsEvolution() {
  const weeks = [
    { label: 'Week 1', themes: ['Stress', 'Sleep issues', 'Work anxiety'], mood: 5.2 },
    { label: 'Week 2', themes: ['Exercise routine', 'Sleep improving', 'Stress'], mood: 6.1 },
    { label: 'Week 3', themes: ['Balance', 'Gratitude', 'Energy'], mood: 7.4 },
    { label: 'Week 4', themes: ['Growth', 'Calm', 'Self-care'], mood: 8.1 },
  ];

  return (
    <div className="px-[20px] pt-[16px] pb-[24px] flex flex-col gap-[20px]">
      <div>
        <h2 className="text-[22px] leading-[30px] font-[700] text-[#191C1A]">Theme Evolution</h2>
        <p className="text-[14px] leading-[20px] font-[450] text-[#6D6C6A] mt-[4px]">
          How your patterns and themes have shifted over time
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[15px] top-[8px] bottom-[8px] w-[2px] bg-[#DEDEDE]" />

        <div className="flex flex-col gap-[20px]">
          {weeks.map((week, i) => (
            <div key={i} className="flex gap-[16px] items-start">
              {/* Dot */}
              <div className={`w-[32px] h-[32px] rounded-full flex items-center justify-center shrink-0 z-10 ${
                i === weeks.length - 1 ? 'bg-[#000000]' : 'bg-[#FFFFFF] ring-2 ring-[#DEDEDE]'
              }`}>
                <span className={`text-[12px] font-[600] ${i === weeks.length - 1 ? 'text-[#FFFFFF]' : 'text-[#191C1A]'}`}>
                  {i + 1}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 bg-[#FFFFFF] rounded-[12px] p-[14px] ring-1 ring-[#F0F0F0]">
                <div className="flex items-center justify-between mb-[8px]">
                  <span className="text-[14px] font-[500] text-[#191C1A]">{week.label}</span>
                  <span className="text-[13px] font-[500] text-[#36846C]">Mood: {week.mood}</span>
                </div>
                <div className="flex flex-wrap gap-[6px]">
                  {week.themes.map((theme, j) => (
                    <span key={j} className="px-[8px] py-[3px] rounded-full bg-[#F0F0F0] text-[12px] font-[450] text-[#191C1A]">
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary insight */}
      <div className="bg-[#F0FFF4] rounded-[12px] p-[16px]">
        <p className="text-[14px] leading-[20px] font-[450] text-[#36846C]">
          <span className="font-[600]">Your journey:</span> Over 4 weeks, your dominant themes shifted from stress and anxiety to balance and self-care. Mood improved 56%.
        </p>
      </div>
    </div>
  );
}
