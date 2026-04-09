import { ArrowLeft } from 'lucide-react';
import { Button } from '../../../../components/Button';

export function OnboardingV2Logging({ data, setData, onNext, onBack }) {
  const method = data.logMethod || 'mention';
  const customField = data.customWatch || '';

  return (
    <div className="flex flex-col h-full px-[20px] pt-[8px]">
      <div className="flex justify-center gap-[5px] mb-[24px]">
        {[0,1,2,3].map(i => (
          <div key={i} className={`h-[5px] rounded-full transition-all ${i === 1 ? 'w-[18px] bg-[#000000]' : 'w-[6px] bg-[#DEDEDE]'}`} />
        ))}
      </div>

      <button onClick={onBack} className="mb-[16px] self-start cursor-pointer p-[4px]">
        <ArrowLeft size={20} color="#191C1A" />
      </button>

      <h2 className="text-[20px] leading-[26px] font-[500] text-[#191C1A] mb-[6px]">
        How Do You Want to Log These?
      </h2>
      <p className="text-[13px] leading-[20px] font-[450] text-[#6D6C6A] mb-[20px]">
        You can mention these naturally while journaling, or log them directly.
      </p>

      <span className="text-[12px] font-[450] text-[#8B828B] mb-[8px]">Log method</span>
      <div className="flex flex-wrap gap-[8px] mb-[20px]">
        {[['mention', 'mention while writing'], ['checkin', 'quick daily check-in'], ['both', 'both']].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setData({ logMethod: id })}
            className={`px-[12px] py-[8px] rounded-full text-[13px] font-[450] border transition-all cursor-pointer ${
              method === id
                ? 'bg-[#F0F0F0] border-[#000000] text-[#000000] font-[500]'
                : 'bg-[#FFFFFF] border-[#DEDEDE] text-[#6D6C6A]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <span className="text-[12px] font-[450] text-[#8B828B] mb-[8px]">Anything specific rosebud should watch for?</span>
      <input
        value={customField}
        onChange={e => setData({ customWatch: e.target.value })}
        placeholder="e.g. ashwagandha, birth control, metformin..."
        className="w-full h-[56px] px-[16px] rounded-[12px] text-[16px] leading-[22px] font-[450] bg-[#FFFFFF] text-[#000000] placeholder:text-[#6D6C6A] outline-none focus:ring-1 focus:ring-[#DEDEDE] mb-[20px]"
      />

      <div className="mt-auto pb-[8px]">
        <Button variant="primary" size="large" className="w-full" onClick={onNext}>Looks Good</Button>
      </div>
    </div>
  );
}
