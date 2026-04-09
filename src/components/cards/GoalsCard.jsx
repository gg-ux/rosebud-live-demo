export function GoalsCard({ type = 'Todo', title, items = [], className = '' }) {
  const typeLabels = { Todo: 'To-do', Goals: 'Goals', Type3: 'Habits' };
  return (
    <div className={`flex flex-col gap-[13px] ${className}`}>
      <span className="px-[10px] py-[4px] rounded-full bg-[#F0F0F0] text-[13px] leading-[18px] font-[450] text-[#191C1A] self-start">
        {typeLabels[type] || type}
      </span>
      <div className="bg-[#FFFFFF] rounded-[12px] p-[16px] flex flex-col gap-[12px]">
        {title && <span className="text-[17px] leading-[23px] font-[500] text-[#191C1A]">{title}</span>}
        <div className="flex flex-col gap-[10px]">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-[12px]">
              <div className={`w-[20px] h-[20px] rounded-[4px] flex items-center justify-center shrink-0 ${
                item.done ? 'bg-[#000000] text-white' : 'border-2 border-[#C0C0BF]'
              }`}>
                {item.done && (
                  <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
                    <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className={`text-[15px] leading-[20px] font-[450] ${item.done ? 'text-[#8B828B] line-through' : 'text-[#191C1A]'}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
