export function SegmentedControl({ segments, value, onChange, className = '' }) {
  return (
    <div className={`inline-flex rounded-[12px] border border-[#C0C0BF] overflow-hidden ${className}`}>
      {segments.map((segment, i) => {
        const isSelected = segment.value === value;
        return (
          <button
            key={segment.value}
            type="button"
            onClick={() => onChange?.(segment.value)}
            className={`
              h-[40px] px-[24px] py-[8px]
              text-[14px] leading-[20px] font-[450] transition-colors
              ${isSelected ? 'bg-[#FFFFFF] text-[#000000]' : 'bg-[#F0F0F0] text-[#6D6C6A]'}
              ${i > 0 ? 'border-l border-[#C0C0BF]' : ''}
            `}
          >
            {segment.label}
          </button>
        );
      })}
    </div>
  );
}
