import { ArrowLeft } from 'lucide-react';
import { Button } from '../../../../components/Button';

export function OnboardingV2Preview({ onBack, onReset }) {
  return (
    <div className="flex flex-col h-full px-[20px] pt-[8px]">
      <div className="flex justify-center gap-[5px] mb-[24px]">
        {[0,1,2,3].map(i => (
          <div key={i} className={`h-[5px] rounded-full transition-all ${i === 3 ? 'w-[18px] bg-[#000000]' : 'w-[6px] bg-[#DEDEDE]'}`} />
        ))}
      </div>

      <button onClick={onBack} className="mb-[16px] self-start cursor-pointer p-[4px]">
        <ArrowLeft size={20} color="#191C1A" />
      </button>

      <h2 className="text-[20px] leading-[26px] font-[500] text-[#191C1A] mb-[6px]">
        A Preview of Your Future Insights
      </h2>
      <p className="text-[13px] leading-[20px] font-[450] text-[#6D6C6A] mb-[16px]">
        This is what rosebud might surface after a few weeks of entries.
      </p>

      <div className="flex-1 overflow-y-auto space-y-[10px]">
        {/* Insight card 1 */}
        <div className="bg-[#F0F0F0] rounded-[12px] p-[14px]">
          <span className="text-[11px] tracking-[0.06em] uppercase text-[#E31665] font-[500] mb-[4px] block">cycle × mood</span>
          <p className="text-[13px] leading-[20px] font-[450] text-[#191C1A]">
            In the 3 days before your period, you consistently write about feeling &ldquo;not good enough.&rdquo; It&apos;s happened 4 months in a row.
          </p>
        </div>

        {/* Insight card 2 with bars */}
        <div className="bg-[#F0F0F0] rounded-[12px] p-[14px]">
          <span className="text-[11px] tracking-[0.06em] uppercase text-[#E31665] font-[500] mb-[8px] block">sleep × energy</span>
          <div className="space-y-[5px] mb-[8px]">
            {[['under 6h', 30], ['6–7h', 55], ['7–8h', 90]].map(([label, pct]) => (
              <div key={label} className="flex items-center gap-[8px]">
                <span className="text-[11px] font-[450] text-[#6D6C6A] w-[48px] shrink-0">{label}</span>
                <div className="flex-1 h-[6px] bg-[#DEDEDE] rounded-full overflow-hidden">
                  <div className="h-full bg-[#E31665] rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="text-[12px] leading-[18px] font-[450] text-[#6D6C6A]">
            Your writing is noticeably more optimistic when you sleep 7+ hours.
          </p>
        </div>
      </div>

      <div className="pb-[8px] pt-[12px] flex flex-col items-center gap-[8px]">
        <Button variant="primary" size="large" className="w-full">Start Journaling</Button>
        <button
          onClick={onReset}
          className="text-[13px] font-[450] text-[#8B828B] cursor-pointer hover:text-[#191C1A] transition-colors"
        >
          start over
        </button>
      </div>
    </div>
  );
}
