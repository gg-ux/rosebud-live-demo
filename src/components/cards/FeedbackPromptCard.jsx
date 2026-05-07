export function FeedbackPromptCard({ questions = [], className = '' }) {
  return (
    <div className={`bg-[var(--color-surface)] rounded-[12px] p-[16px] flex flex-col gap-[16px] ${className}`}>
      <div className="flex items-center gap-[6px]">
        <span className="text-[15px]">🌱</span>
        <span className="text-[15px] leading-[21px] font-[500] text-[var(--color-on-surface)]">Discover yourself</span>
      </div>
      <div className="flex flex-col gap-[12px]">
        {questions.map((q, i) => (
          <p key={i} className="text-[15px] leading-[20px] font-[450] text-[var(--color-secondary-text)]">{q}</p>
        ))}
      </div>
    </div>
  );
}
