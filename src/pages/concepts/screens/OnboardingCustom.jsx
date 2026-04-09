import { ArrowLeft, Plus, X } from 'lucide-react';
import { useState } from 'react';

export function OnboardingCustom({ data, setData, onNext, onBack }) {
  const [inputValue, setInputValue] = useState('');
  const customItems = data.customItems || [];

  function addItem() {
    const trimmed = inputValue.trim();
    if (trimmed && !customItems.includes(trimmed)) {
      setData({ customItems: [...customItems, trimmed] });
      setInputValue('');
    }
  }

  function removeItem(item) {
    setData({ customItems: customItems.filter(i => i !== item) });
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem();
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-[16px] pt-[8px] pb-[12px]">
        <button onClick={onBack} className="p-[4px] cursor-pointer">
          <ArrowLeft size={20} color="#191C1A" />
        </button>
      </div>

      <div className="px-[24px] flex-1">
        <h2 className="text-[22px] leading-[30px] font-[700] text-[#191C1A] mb-[6px]">
          What else do you want to track?
        </h2>
        <p className="text-[15px] leading-[20px] font-[450] text-[#6D6C6A] mb-[24px]">
          Add anything specific you&apos;d like Rosebud to watch for in your entries.
        </p>

        {/* Input row */}
        <div className="flex gap-[8px] mb-[20px]">
          <input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. caffeine intake, screen time..."
            className="flex-1 h-[48px] px-[16px] rounded-[12px] text-[15px] font-[450] bg-[#FFFFFF] text-[#000000] placeholder:text-[#6D6C6A] outline-none focus:ring-1 focus:ring-[#DEDEDE]"
          />
          <button
            onClick={addItem}
            className="w-[48px] h-[48px] rounded-[12px] bg-[#000000] text-white flex items-center justify-center shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Added items */}
        {customItems.length > 0 && (
          <div className="flex flex-wrap gap-[8px]">
            {customItems.map(item => (
              <span
                key={item}
                className="inline-flex items-center gap-[6px] px-[14px] py-[8px] rounded-full bg-[#F0F0F0] text-[#191C1A] text-[14px] font-[450]"
              >
                {item}
                <button onClick={() => removeItem(item)} className="cursor-pointer hover:opacity-60">
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="px-[24px] py-[16px]">
        <button
          onClick={onNext}
          className="w-full h-[48px] rounded-[12px] bg-[#000000] text-[#FAFAFA] text-[16px] font-[500] cursor-pointer hover:opacity-90 transition-opacity"
        >
          Continue
        </button>
        <button
          onClick={onNext}
          className="w-full text-center text-[14px] font-[450] text-[#6D6C6A] mt-[10px] cursor-pointer hover:text-[#191C1A] transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
