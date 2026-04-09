export function ResultsInsights() {
  const insights = [
    {
      emoji: '💡',
      title: 'Cross-session insight',
      body: 'Your sleep quality improves by 40% on days you exercise. This pattern has held consistent for 3 weeks.',
      timespan: 'Across 21 entries',
    },
    {
      emoji: '🔗',
      title: 'Connection found',
      body: 'Afternoon journaling correlates with better evening mood scores. You tend to process difficult emotions more effectively when you write between 2-4pm.',
      timespan: 'Across 14 entries',
    },
    {
      emoji: '📈',
      title: 'Progress detected',
      body: 'Your supplement consistency has improved from 3 days/week to 6 days/week over the past month. Weekend adherence is still a gap.',
      timespan: 'Past 4 weeks',
    },
  ];

  return (
    <div className="px-[20px] pt-[16px] pb-[24px] flex flex-col gap-[20px]">
      <div>
        <h2 className="text-[22px] leading-[30px] font-[700] text-[#191C1A]">Cross-Session Insights</h2>
        <p className="text-[14px] leading-[20px] font-[450] text-[#6D6C6A] mt-[4px]">
          Patterns we&apos;ve connected across your journal history
        </p>
      </div>

      <div className="flex flex-col gap-[12px]">
        {insights.map((insight, i) => (
          <div key={i} className="bg-[#FFFFFF] rounded-[12px] p-[16px] ring-1 ring-[#F0F0F0] flex flex-col gap-[10px]">
            <div className="flex items-center gap-[6px]">
              <span className="text-[16px]">{insight.emoji}</span>
              <span className="text-[14px] leading-[20px] font-[500] text-[#191C1A]">{insight.title}</span>
            </div>
            <p className="text-[15px] leading-[22px] font-[450] text-[#191C1A]">{insight.body}</p>
            <span className="text-[12px] leading-[16px] font-[450] text-[#8B828B]">{insight.timespan}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
