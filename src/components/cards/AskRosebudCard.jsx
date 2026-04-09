export function AskRosebudCard({ question, answer, className = '' }) {
  return (
    <div className={`bg-[#FFFFFF] rounded-[10px] p-[16px] pb-[24px] flex flex-col gap-[24px] ${className}`}>
      <div className="flex flex-col gap-[10px]">
        <div className="flex items-center gap-[6px]">
          <span className="text-[15px]">✨</span>
          <span className="text-[15px] leading-[21px] font-[500] text-[#191C1A]">Ask Rosebud</span>
        </div>
        <p className="text-[14px] leading-[20px] font-[450] text-[#6D6C6A]">{question}</p>
      </div>
      {answer && <p className="text-[16px] leading-[22px] font-[450] text-[#191C1A]">{answer}</p>}
    </div>
  );
}
