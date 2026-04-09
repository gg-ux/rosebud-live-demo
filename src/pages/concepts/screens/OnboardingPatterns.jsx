import { ArrowLeft, Moon, Dumbbell, CalendarHeart, Pill, Syringe, PenLine } from 'lucide-react';

const PATTERNS = [
  { id: 'sleep', icon: Moon, label: 'Sleep', desc: 'Quality, duration, dreams' },
  { id: 'workout', icon: Dumbbell, label: 'Workout', desc: 'Exercise type and frequency' },
  { id: 'period', icon: CalendarHeart, label: 'Period', desc: 'Cycle tracking and symptoms' },
  { id: 'supplements', icon: Pill, label: 'Supplements', desc: 'What you take and effects' },
  { id: 'medication', icon: Syringe, label: 'Medication', desc: 'Dosage and side effects' },
  { id: 'custom', icon: PenLine, label: 'Custom', desc: 'Track anything else' },
];

export function OnboardingPatterns({ data, setData, onNext, onBack }) {
  const selected = data.patterns || [];

  function toggle(id) {
    const next = selected.includes(id)
      ? selected.filter(p => p !== id)
      : [...selected, id];
    setData({ patterns: next });
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-[16px] pt-[8px] pb-[12px]">
        <button onClick={onBack} className="p-[4px] cursor-pointer">
          <ArrowLeft size={20} color="#191C1A" />
        </button>
      </div>

      <div className="px-[24px] flex-1 overflow-y-auto">
        <h2 className="text-[22px] leading-[30px] font-[700] text-[#191C1A] mb-[6px]">
          Select patterns to track
        </h2>
        <p className="text-[15px] leading-[20px] font-[450] text-[#6D6C6A] mb-[24px]">
          We&apos;ll look for these patterns across your journal entries.
        </p>

        <div className="flex flex-col gap-[10px]">
          {PATTERNS.map((p) => {
            const isSelected = selected.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => toggle(p.id)}
                className={`
                  flex items-center gap-[14px] p-[16px] rounded-[12px] text-left cursor-pointer transition-all
                  ${isSelected
                    ? 'bg-[#FFFFFF] ring-2 ring-[#000000]'
                    : 'bg-[#FFFFFF] ring-1 ring-[#DEDEDE]'
                  }
                `}
              >
                <div className={`w-[36px] h-[36px] rounded-[10px] flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-[#000000]' : 'bg-[#F0F0F0]'
                }`}>
                  <p.icon size={18} color={isSelected ? '#FFFFFF' : '#191C1A'} />
                </div>
                <div className="flex-1">
                  <span className="text-[16px] leading-[22px] font-[500] text-[#191C1A]">{p.label}</span>
                  <p className="text-[13px] leading-[18px] font-[450] text-[#6D6C6A]">{p.desc}</p>
                </div>
                <div className={`w-[22px] h-[22px] rounded-[6px] flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-[#000000]' : 'border-2 border-[#C0C0BF]'
                }`}>
                  {isSelected && (
                    <svg viewBox="0 0 16 16" fill="none" className="w-[12px] h-[12px]">
                      <path d="M3 8l3.5 3.5L13 5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-[24px] py-[16px]">
        <button
          onClick={onNext}
          disabled={selected.length === 0}
          className={`
            w-full h-[48px] rounded-[12px] text-[16px] font-[500] cursor-pointer transition-opacity
            ${selected.length > 0
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
