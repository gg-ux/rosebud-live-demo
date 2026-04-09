export function WeeklyReportLocked({ className = '' }) {
  return (
    <div className={`bg-[#FFFFFF] rounded-[12px] px-[20px] py-[20px] flex flex-col items-center gap-[18px] ${className}`}>
      <div className="flex items-center gap-[6px]">
        <svg viewBox="0 0 20 20" fill="#191C1A" className="w-[16px] h-[16px]">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <span className="text-[16px] leading-[22px] font-[500] text-[#191C1A]">Weekly Report</span>
      </div>
      <p className="text-[14px] leading-[20px] font-[450] text-[#6D6C6A] text-center">
        Analysis will be ready in 4 days. Keep writing to unlock personalized insights.
      </p>
    </div>
  );
}
