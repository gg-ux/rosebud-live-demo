import { Button } from '../../../../components/Button';

export function OnboardingV2Intent({ data, setData, onNext }) {
  const options = [
    'my energy levels',
    'my menstrual cycle',
    'how sleep affects me',
    'what triggers my anxiety',
    'how medications affect me',
    'patterns in my relationships',
    'my emotional cycles',
  ];
  const selected = data.intents || [];

  function toggle(item) {
    const next = selected.includes(item)
      ? selected.filter(i => i !== item)
      : [...selected, item];
    setData({ intents: next });
  }

  return (
    <div className="flex flex-col h-full px-[20px] pt-[8px]">
      <div className="flex justify-center gap-[5px] mb-[24px]">
        {[0,1,2,3].map(i => (
          <div key={i} className={`h-[5px] rounded-full transition-all ${i === 0 ? 'w-[18px] bg-[#000000]' : 'w-[6px] bg-[#DEDEDE]'}`} />
        ))}
      </div>

      <h2 className="text-[20px] leading-[26px] font-[500] text-[#191C1A] mb-[6px]">
        What patterns matter to you?
      </h2>
      <p className="text-[13px] leading-[20px] font-[450] text-[#6D6C6A] mb-[20px]">
        We&apos;ll connect the dots across your entries over time.
      </p>

      <div className="flex flex-wrap gap-[8px] mb-[20px] flex-1 content-start overflow-y-auto">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => toggle(opt)}
            className={`px-[12px] py-[8px] rounded-full text-[13px] font-[450] border transition-all cursor-pointer ${
              selected.includes(opt)
                ? 'bg-[#F0F0F0] border-[#000000] text-[#000000] font-[500]'
                : 'bg-[#FFFFFF] border-[#DEDEDE] text-[#6D6C6A]'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="pb-[8px] flex flex-col gap-[8px]">
        <Button variant="primary" size="large" className="w-full" onClick={onNext}>Continue</Button>
        <Button variant="secondary" size="large" className="w-full" onClick={onNext}>I&apos;m not sure yet</Button>
      </div>
    </div>
  );
}
