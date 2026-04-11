/* ═══════════════════════════════════════════════════════════════════════════
   Results — Empty State
   What users see on the Patterns page before they have enough writing
   for meaningful insights. Threshold: 5,000 words (~12 entries).
   ═══════════════════════════════════════════════════════════════════════════ */

import { Button } from '../../../components/Button';
import roseBudThornSvg from '../../../illustrations/rose-bud-thorn.svg';

const CURRENT_WORDS = 2134;
const TARGET_WORDS = 5000;
const CURRENT_ENTRIES = 5;
const ENTRIES_TO_GO = 7;

export function ResultsEmptyState() {
  const progress = Math.min(1, CURRENT_WORDS / TARGET_WORDS);
  const progressPct = Math.round(progress * 100);

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA]">
      {/* Header — matches Anthology layout */}
      <div className="px-[20px] pt-[20px] pb-[16px] flex items-start justify-between">
        <h1 className="text-[24px] leading-[30px] font-[700] text-[#191C1A] tracking-[-0.01em]">
          Patterns
        </h1>
        <button className="w-[36px] h-[36px] rounded-full bg-[#F0F0F0] flex items-center justify-center shrink-0">
          <svg viewBox="0 0 20 20" fill="none" stroke="#191C1A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
            <circle cx="10" cy="10" r="2.5" />
            <path d="M16.66 12.5a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V18a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H2a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33h.01a1.65 1.65 0 001-1.51V2a2 2 0 114 0v.09c.001.65.391 1.236 1 1.51a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.01c.274.609.86.999 1.51 1H18a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        </button>
      </div>

      {/* Single integrated card */}
      <div className="px-[16px]">
        <div className="rounded-[20px] bg-[#F6F5F1] border border-[#EAE7DE] p-[24px] flex flex-col items-center text-center">
          <img
            src={roseBudThornSvg}
            alt=""
            className="w-[128px] h-[128px] mb-[8px]"
          />

          <h2 className="text-[18px] leading-[24px] font-[600] text-[#191C1A] mb-[8px] max-w-[260px]">
            Your patterns are still taking shape
          </h2>
          <p className="text-[13px] leading-[19px] font-[450] text-[#5C5C5B] max-w-[280px] mb-[24px]">
            Keep writing. The more you share, the clearer the connections become.
          </p>

          {/* Integrated progress */}
          <div className="w-full mb-[20px]">
            <div className="flex items-baseline justify-between mb-[8px]">
              <p className="text-[12px] leading-[16px] font-[500] text-[#5C5C5B]">
                <span className="font-[700] text-[#191C1A]">{CURRENT_WORDS.toLocaleString()}</span>
                <span> / {TARGET_WORDS.toLocaleString()} words</span>
              </p>
              <span className="text-[12px] leading-[16px] font-[600] text-[#191C1A]">
                {progressPct}%
              </span>
            </div>
            <div className="h-[6px] rounded-full bg-[#E8E5DC] overflow-hidden">
              <div
                className="h-full bg-[#191C1A] rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-[11px] leading-[14px] font-[450] text-[#8B8B89] mt-[8px]">
              About {ENTRIES_TO_GO} more entries to go
            </p>
          </div>

          <Button
            variant="primary"
            size="small"
            className="w-full"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            }
          >
            Start Journaling
          </Button>
        </div>
      </div>

      <div className="flex-1" />
    </div>
  );
}
