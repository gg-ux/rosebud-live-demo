import { useState, forwardRef, useImperativeHandle } from 'react';

const STEPS = [
  {
    prompt: 'Before we begin, what patterns are you curious about?',
    placeholder: 'tracking my sleep, exercise, medications, relationships...',
  },
  {
    prompt: 'How often should I share what I find?',
    placeholder: 'send me a weekly digest...',
  },
  {
    prompt: 'Got it. Now, what\'s on your mind today?',
    placeholder: 'woke up feeling off today, maybe the rain...',
  },
];

export const V3_STEP_COUNT = STEPS.length;

export const OnboardingV3Journal = forwardRef(function OnboardingV3Journal(_props, ref) {
  const [step, setStep] = useState(0);
  const [inputs, setInputs] = useState(['', '', '']);
  const [committed, setCommitted] = useState([false, false, false]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      setStep(0);
      setInputs(['', '', '']);
      setCommitted([false, false, false]);
    },
    goToStep: (n) => setStep(n),
    fillCurrentStepWithPlaceholder: (n) => {
      const next = ['', '', ''];
      next[n] = STEPS[n].placeholder || 'I want to understand my emotional patterns better.';
      setInputs(next);
    },
    clearInputs: () => setInputs(['', '', '']),
  }), []);

  const current = STEPS[step];
  const isLastStep = step === STEPS.length - 1;

  function handleChange(val) {
    const next = [...inputs];
    next[step] = val;
    setInputs(next);
  }

  function handleSubmit() {
    if (isLastStep) return;
    const next = [...committed];
    next[step] = true;
    setCommitted(next);
    setStep(step + 1);
  }

  return (
    <div className="flex flex-col h-full bg-[#FFFFFF]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-[8px] h-[48px]">
        <div className="flex items-center gap-[12px] pl-[6px] pr-[12px] py-[6px] rounded-[10px] border border-[#C0C0BF]">
          <div className="w-[24px] h-[24px] rounded-full bg-[#7CC4AF]" />
          <span className="text-[15px] leading-[20px] font-[450] text-[#191C1A]">Sage</span>
          <svg viewBox="0 0 12 12" fill="none" className="w-[12px] h-[12px]">
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="flex items-center gap-[8px]">
          <span className="text-[16px] leading-[22px] font-[500] text-[#000000]">Drafts</span>
          <div className="w-[36px] h-[36px] rounded-full flex items-center justify-center">
            <svg viewBox="0 0 18 18" fill="none" className="w-[18px] h-[18px]">
              <path d="M4.5 4.5L13.5 13.5M13.5 4.5L4.5 13.5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Thread body */}
      <div className="flex-1 overflow-y-auto px-[15px] pt-[12px]">
        {/* Previous completed exchanges */}
        {STEPS.slice(0, step).map((s, i) => (
          <div key={i} className="mb-[24px]">
            <p className="text-[17px] leading-[23px] font-[450] text-[#2B6CB0] mb-[8px]">
              {s.prompt}
            </p>
            <p className="text-[17px] leading-[28px] font-[450] text-[#191C1A]">
              {inputs[i] || s.placeholder}
            </p>
          </div>
        ))}

        {/* Current step */}
        <div className="mb-[24px]">
          <p className="text-[17px] leading-[23px] font-[450] text-[#2B6CB0] mb-[8px]">
            {current.prompt}
          </p>

          {!isLastStep ? (
            <div className="relative">
              {/* Placeholder — visible only when input is empty */}
              {!inputs[step] && current.placeholder && (
                <p className="absolute inset-0 text-[17px] leading-[28px] font-[450] text-[#C0C0BF] pointer-events-none">
                  {current.placeholder}
                </p>
              )}
              <textarea
                value={inputs[step]}
                onChange={e => handleChange(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
                className="w-full text-[17px] leading-[28px] font-[450] text-[#191C1A] bg-transparent outline-none resize-none min-h-[32px]"
                rows={1}
                autoFocus
              />
            </div>
          ) : (
            <div className="flex items-center">
              <span className="inline-block w-[2px] h-[20px] bg-[#191C1A] animate-pulse mr-[2px]" />
              <span className="text-[17px] leading-[23px] font-[450] text-[#C0C0BF]">Write</span>
            </div>
          )}
        </div>

        {/* Quick actions — only on last step */}
        {isLastStep && (
          <div className="flex items-center gap-[16px] mb-[24px]">
            <svg viewBox="0 0 16 16" fill="none" className="w-[16px] h-[16px]"><path d="M11 5L6 9H2v6h4l5 4V5z" stroke="#C0C0BF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M15.54 4.46a5 5 0 010 7.07M13.12 6.88a2.5 2.5 0 010 3.54" stroke="#C0C0BF" strokeWidth="1.2" strokeLinecap="round"/></svg>
            <svg viewBox="0 0 16 16" fill="none" className="w-[16px] h-[16px]"><rect x="5" y="5" width="9" height="9" rx="1.5" stroke="#C0C0BF" strokeWidth="1.2"/><path d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5" stroke="#C0C0BF" strokeWidth="1.2"/></svg>
            <svg viewBox="0 0 16 16" fill="none" className="w-[16px] h-[16px]"><path d="M3 10l3-3 3 3" stroke="#C0C0BF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <svg viewBox="0 0 16 16" fill="none" className="w-[16px] h-[16px]"><path d="M3 6l3 3 3-3" stroke="#C0C0BF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        )}
      </div>

      {/* Bottom CTAs */}
      <div className="border-t border-[#F0F0F0]">
        <div className="flex items-center justify-between px-[18px] pt-[12px]">
          <div className="flex items-center gap-[24px]">
            <svg viewBox="0 0 24 24" fill="none" className="w-[20px] h-[20px]"><path d="M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3z" stroke="#191C1A" strokeWidth="1.5"/><path d="M19 10v1a7 7 0 01-14 0v-1M12 18v4M8 22h8" stroke="#191C1A" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <svg viewBox="0 0 24 24" fill="none" className="w-[20px] h-[20px]"><rect x="3" y="3" width="18" height="18" rx="2" stroke="#191C1A" strokeWidth="1.5"/><circle cx="8.5" cy="8.5" r="1.5" fill="#191C1A"/><path d="M21 15l-5-5L5 21" stroke="#191C1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <svg viewBox="0 0 24 24" fill="none" className="w-[20px] h-[20px]"><path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" stroke="#191C1A" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </div>
        <div className="flex gap-[12px] px-[12px] py-[12px]">
          {inputs[step] ? (
            <>
              <button className="flex-1 h-[44px] rounded-[12px] border border-[#C0C0BF] flex items-center justify-center cursor-pointer">
                <span className="text-[16px] leading-[22px] font-[500] text-[#191C1A]">Finish entry</span>
              </button>
              <button
                onClick={!isLastStep ? handleSubmit : undefined}
                className="flex-1 h-[44px] rounded-[12px] bg-[#191C1A] flex items-center justify-center gap-[6px] cursor-pointer"
              >
                <svg viewBox="0 0 18 18" fill="#FFFFFF" className="w-[14px] h-[14px]">
                  <path d="M9 1l1.3 3.2L13.5 5.5l-3.2 1.3L9 10 7.7 6.8 4.5 5.5l3.2-1.3L9 1zM4 10l.7 1.8L6.5 12.5l-1.8.7L4 15l-.7-1.8L1.5 12.5l1.8-.7L4 10z" />
                </svg>
                <span className="text-[16px] leading-[22px] font-[500] text-[#FFFFFF]">Go deeper</span>
              </button>
            </>
          ) : (
            <>
              <button className="flex-1 h-[44px] rounded-[12px] border border-[#C0C0BF] flex items-center justify-center gap-[8px]">
                <svg viewBox="0 0 18 18" fill="#000000" className="w-[16px] h-[16px]"><path d="M9 1l1.3 3.2L13.5 5.5l-3.2 1.3L9 10 7.7 6.8 4.5 5.5l3.2-1.3L9 1zM4 10l.7 1.8L6.5 12.5l-1.8.7L4 15l-.7-1.8L1.5 12.5l1.8-.7L4 10z"/></svg>
                <span className="text-[16px] leading-[22px] font-[500] text-[#191C1A]">Suggest</span>
              </button>
              <button
                onClick={!isLastStep ? handleSubmit : undefined}
                className="flex-1 h-[44px] rounded-[12px] border border-[#C0C0BF] flex items-center justify-center gap-[8px] cursor-pointer"
              >
                {!isLastStep && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="#191C1A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
                    <path d="M3 7V5a2 2 0 012-2h2" />
                    <path d="M17 3h2a2 2 0 012 2v2" />
                    <path d="M21 17v2a2 2 0 01-2 2h-2" />
                    <path d="M7 21H5a2 2 0 01-2-2v-2" />
                    <line x1="7" y1="12" x2="17" y2="12" />
                  </svg>
                )}
                <span className="text-[16px] leading-[22px] font-[500] text-[#191C1A]">
                  {isLastStep ? 'Finish entry' : 'Scan'}
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
});
