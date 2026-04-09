import { ArrowLeft, Check } from 'lucide-react';

const PATTERN_LABELS = {
  sleep: 'Sleep',
  workout: 'Workout',
  period: 'Period',
  supplements: 'Supplements',
  medication: 'Medication',
  custom: 'Custom',
};

const LOGGING_LABELS = {
  mention: 'Mention while writing',
  checkin: 'Daily check-in',
};

const INTERVAL_LABELS = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

const INSIGHT_EXAMPLES = {
  sleep: { label: 'sleep × mood', text: 'Your mood scores are 2.1 points higher on weeks where you sleep 7+ hours consistently.' },
  workout: { label: 'exercise × energy', text: 'You mention feeling "energized" 3x more often on days you exercise before noon.' },
  period: { label: 'cycle × mood', text: 'In the days before your period, you tend to write about self-doubt. This pattern has repeated for 3 months.' },
  supplements: { label: 'supplements × focus', text: 'Your entries are noticeably more focused and detailed on days you take your supplements.' },
  medication: { label: 'medication × wellbeing', text: 'Since starting your current medication, mentions of anxiety have decreased by 40%.' },
  custom: { label: 'custom tracking', text: 'We\'ll look for patterns in the custom items you\'re tracking across your entries.' },
};

export function OnboardingConfirmation({ data, onBack }) {
  const patterns = data.patterns || [];
  const topTwo = patterns.slice(0, 2);

  return (
    <div className="flex flex-col h-full">
      <div className="px-[16px] pt-[8px] pb-[12px]">
        <button onClick={onBack} className="p-[4px] cursor-pointer">
          <ArrowLeft size={20} color="#191C1A" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-[24px]">
        <div className="flex flex-col items-center mb-[24px]">
          <div className="w-[56px] h-[56px] rounded-full bg-[#000000] flex items-center justify-center mb-[16px]">
            <Check size={28} color="#FFFFFF" />
          </div>
          <h2 className="text-[22px] leading-[30px] font-[700] text-[#191C1A] mb-[4px]">
            You&apos;re all set
          </h2>
          <p className="text-[14px] leading-[20px] font-[450] text-[#6D6C6A] text-center">
            Here&apos;s a preview of what Rosebud might surface.
          </p>
        </div>

        {/* Insight preview cards */}
        <div className="space-y-[10px] mb-[24px]">
          {topTwo.map(p => {
            const insight = INSIGHT_EXAMPLES[p];
            if (!insight) return null;
            return (
              <div key={p} className="bg-[#F6F6F6] rounded-[12px] p-[14px]">
                <span className="text-[11px] tracking-[0.06em] uppercase text-[#E31665] font-[500] mb-[4px] block">{insight.label}</span>
                <p className="text-[13px] leading-[20px] font-[450] text-[#191C1A]">{insight.text}</p>
              </div>
            );
          })}
          {topTwo.length === 0 && (
            <div className="bg-[#F6F6F6] rounded-[12px] p-[14px]">
              <span className="text-[11px] tracking-[0.06em] uppercase text-[#E31665] font-[500] mb-[4px] block">pattern preview</span>
              <p className="text-[13px] leading-[20px] font-[450] text-[#191C1A]">Start journaling and we&apos;ll surface insights based on what you share.</p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="bg-[#FFFFFF] rounded-[12px] p-[16px] ring-1 ring-[#DEDEDE]">
          <div className="flex flex-col gap-[12px]">
            <div>
              <span className="text-[11px] leading-[14px] font-[500] text-[#8B828B] uppercase tracking-wider">Tracking</span>
              <div className="flex flex-wrap gap-[6px] mt-[4px]">
                {patterns.map(p => (
                  <span key={p} className="px-[10px] py-[3px] rounded-full bg-[#F0F0F0] text-[12px] font-[450] text-[#191C1A]">
                    {PATTERN_LABELS[p] || p}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[11px] leading-[14px] font-[500] text-[#8B828B] uppercase tracking-wider">Method</span>
              <p className="text-[14px] leading-[20px] font-[450] text-[#191C1A] mt-[2px]">
                {LOGGING_LABELS[data.loggingPref] || '—'}
              </p>
            </div>
            <div>
              <span className="text-[11px] leading-[14px] font-[500] text-[#8B828B] uppercase tracking-wider">Reviews</span>
              <p className="text-[14px] leading-[20px] font-[450] text-[#191C1A] mt-[2px]">
                {INTERVAL_LABELS[data.reviewInterval] || '—'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-[24px] py-[16px]">
        <button className="w-full h-[48px] rounded-[12px] bg-[#000000] text-[#FAFAFA] text-[16px] font-[500] cursor-pointer hover:opacity-90 transition-opacity">
          Start Journaling
        </button>
      </div>
    </div>
  );
}
