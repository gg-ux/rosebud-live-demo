import { ArrowLeft, PenLine, CalendarCheck } from 'lucide-react';

const OPTIONS = [
  {
    id: 'mention',
    icon: PenLine,
    title: 'Mention while writing',
    desc: 'We\'ll detect patterns naturally from your journal entries — no extra steps needed.',
  },
  {
    id: 'checkin',
    icon: CalendarCheck,
    title: 'Daily check-in',
    desc: 'A quick daily prompt to log your patterns in under 30 seconds.',
  },
];

export function OnboardingLogging({ data, setData, onNext, onBack }) {
  const selected = data.loggingPref || '';

  return (
    <div className="flex flex-col h-full">
      <div className="px-[16px] pt-[8px] pb-[12px]">
        <button onClick={onBack} className="p-[4px] cursor-pointer">
          <ArrowLeft size={20} color="#191C1A" />
        </button>
      </div>

      <div className="px-[24px] flex-1">
        <h2 className="text-[22px] leading-[30px] font-[700] text-[#191C1A] mb-[6px]">
          How should we log this?
        </h2>
        <p className="text-[15px] leading-[20px] font-[450] text-[#6D6C6A] mb-[24px]">
          Choose how you&apos;d like Rosebud to capture pattern data.
        </p>

        <div className="flex flex-col gap-[12px]">
          {OPTIONS.map((opt) => {
            const isSelected = selected === opt.id;
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                onClick={() => setData({ loggingPref: opt.id })}
                className={`
                  flex items-start gap-[14px] p-[20px] rounded-[12px] text-left cursor-pointer transition-all
                  ${isSelected
                    ? 'bg-[#FFFFFF] ring-2 ring-[#000000]'
                    : 'bg-[#FFFFFF] ring-1 ring-[#DEDEDE]'
                  }
                `}
              >
                <div className={`w-[40px] h-[40px] rounded-[10px] flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-[#000000]' : 'bg-[#F0F0F0]'
                }`}>
                  <Icon size={20} color={isSelected ? '#FFFFFF' : '#191C1A'} />
                </div>
                <div className="flex-1">
                  <span className="text-[16px] leading-[22px] font-[500] text-[#191C1A]">{opt.title}</span>
                  <p className="text-[14px] leading-[20px] font-[450] text-[#6D6C6A] mt-[4px]">{opt.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-[24px] py-[16px]">
        <button
          onClick={onNext}
          disabled={!selected}
          className={`
            w-full h-[48px] rounded-[12px] text-[16px] font-[500] cursor-pointer transition-opacity
            ${selected
              ? 'bg-[#000000] text-[#FAFAFA] hover:opacity-90'
              : 'bg-[#C9CAC9] text-[#FAFAFA] cursor-not-allowed'
            }
          `}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
