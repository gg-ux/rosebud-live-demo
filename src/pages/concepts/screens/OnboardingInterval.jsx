import { ArrowLeft } from 'lucide-react';

const INTERVALS = [
  { id: 'daily', label: 'Daily', desc: 'Quick daily pattern summary each evening.' },
  { id: 'weekly', label: 'Weekly', desc: 'A weekly report connecting the dots across your week.' },
  { id: 'monthly', label: 'Monthly', desc: 'Monthly deep-dive into long-term trends and themes.' },
];

export function OnboardingInterval({ data, setData, onNext, onBack }) {
  const selected = data.reviewInterval || 'weekly';

  return (
    <div className="flex flex-col h-full">
      <div className="px-[16px] pt-[8px] pb-[12px]">
        <button onClick={onBack} className="p-[4px] cursor-pointer">
          <ArrowLeft size={20} color="#191C1A" />
        </button>
      </div>

      <div className="px-[24px] flex-1">
        <h2 className="text-[22px] leading-[30px] font-[700] text-[#191C1A] mb-[6px]">
          When should we surface patterns?
        </h2>
        <p className="text-[15px] leading-[20px] font-[450] text-[#6D6C6A] mb-[24px]">
          Choose how often you&apos;d like to see your pattern insights.
        </p>

        {/* Segmented control */}
        <div className="flex rounded-[12px] border border-[#C0C0BF] overflow-hidden mb-[24px]">
          {INTERVALS.map((int) => (
            <button
              key={int.id}
              onClick={() => setData({ reviewInterval: int.id })}
              className={`
                flex-1 h-[44px] text-[14px] font-[500] transition-colors cursor-pointer
                ${selected === int.id
                  ? 'bg-[#000000] text-[#FFFFFF]'
                  : 'bg-[#FFFFFF] text-[#6D6C6A]'
                }
              `}
            >
              {int.label}
            </button>
          ))}
        </div>

        {/* Description for selected interval */}
        <div className="bg-[#FFFFFF] rounded-[12px] p-[20px] ring-1 ring-[#DEDEDE]">
          <p className="text-[16px] leading-[22px] font-[450] text-[#191C1A]">
            {INTERVALS.find(i => i.id === selected)?.desc}
          </p>
        </div>
      </div>

      <div className="px-[24px] py-[16px]">
        <button
          onClick={onNext}
          className="w-full h-[48px] rounded-[12px] bg-[#000000] text-[#FAFAFA] text-[16px] font-[500] cursor-pointer hover:opacity-90 transition-opacity"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
