import { ArrowLeft } from 'lucide-react';
import { Button } from '../../../../components/Button';

export function OnboardingV2Cadence({ data, setData, onNext, onBack }) {
  const cadence = data.cadence || 'weekly';
  const minHistory = data.minHistory || '2weeks';

  return (
    <div className="flex flex-col h-full px-[20px] pt-[8px]">
      <div className="flex justify-center gap-[5px] mb-[24px]">
        {[0,1,2,3].map(i => (
          <div key={i} className={`h-[5px] rounded-full transition-all ${i === 2 ? 'w-[18px] bg-[#000000]' : 'w-[6px] bg-[#DEDEDE]'}`} />
        ))}
      </div>

      <button onClick={onBack} className="mb-[16px] self-start cursor-pointer p-[4px]">
        <ArrowLeft size={20} color="#191C1A" />
      </button>

      <h2 className="text-[20px] leading-[26px] font-[500] text-[#191C1A] mb-[6px]">
        When Should We Surface Patterns?
      </h2>
      <p className="text-[13px] leading-[20px] font-[450] text-[#6D6C6A] mb-[20px]">
        Rosebud works quietly in the background. Choose when you want to see what it&apos;s finding.
      </p>

      <span className="text-[12px] font-[450] text-[#8B828B] mb-[8px]">Insight cadence</span>
      <div className="flex flex-wrap gap-[8px] mb-[20px]">
        {[['after', 'after each entry'], ['weekly', 'weekly digest'], ['notable', 'when something notable surfaces']].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setData({ cadence: id })}
            className={`px-[12px] py-[8px] rounded-full text-[13px] font-[450] border transition-all cursor-pointer ${
              cadence === id
                ? 'bg-[#F0F0F0] border-[#000000] text-[#000000] font-[500]'
                : 'bg-[#FFFFFF] border-[#DEDEDE] text-[#6D6C6A]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <span className="text-[12px] font-[450] text-[#8B828B] mb-[8px]">Minimum history before drawing conclusions</span>
      <div className="flex flex-wrap gap-[8px] mb-[20px]">
        {[['1week', '1 week'], ['2weeks', '2 weeks'], ['1month', '1 month']].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setData({ minHistory: id })}
            className={`px-[12px] py-[8px] rounded-full text-[13px] font-[450] border transition-all cursor-pointer ${
              minHistory === id
                ? 'bg-[#F0F0F0] border-[#000000] text-[#000000] font-[500]'
                : 'bg-[#FFFFFF] border-[#DEDEDE] text-[#6D6C6A]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-auto pb-[8px]">
        <Button variant="primary" size="large" className="w-full" onClick={onNext}>Set It Up</Button>
      </div>
    </div>
  );
}
