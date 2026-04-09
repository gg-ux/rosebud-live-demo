export function StreakCard({ count = 3, days = ['M','T','W','T','F','S','S'], activeDays = 3, className = '' }) {
  return (
    <div className={`flex flex-col items-center gap-[24px] ${className}`}>
      <span className="text-[17px] leading-[23px] font-[500] text-[#191C1A]">{count} day streak</span>
      <div className="flex items-center justify-center gap-[16px]">
        {days.map((day, i) => (
          <div key={i} className="flex flex-col items-center gap-[6px]">
            <div className={`w-[32px] h-[32px] rounded-full flex items-center justify-center text-[14px] font-[500] ${
              i < activeDays ? 'bg-[#000000] text-[#FFFFFF]' : 'bg-[#F0F0F0] text-[#6D6C6A]'
            }`}>
              {i < activeDays ? '🔥' : ''}
            </div>
            <span className="text-[12px] leading-[16px] font-[450] text-[#8B828B]">{day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
