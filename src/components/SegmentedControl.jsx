const sizeSpecs = {
  small:   { height: 'h-[32px]', radius: 'rounded-[8px]',  padding: 'px-[14px] py-[6px]', text: 'text-[13px] leading-[18px]' },
  regular: { height: 'h-[40px]', radius: 'rounded-[12px]', padding: 'px-[24px] py-[8px]', text: 'text-[14px] leading-[20px]' },
};

export function SegmentedControl({ segments, value, onChange, size = 'regular', className = '' }) {
  const specs = sizeSpecs[size];
  return (
    <div className={`inline-flex ${specs.radius} border border-[#C0C0BF] overflow-hidden ${className}`}>
      {segments.map((segment, i) => {
        const isSelected = segment.value === value;
        return (
          <button
            key={segment.value}
            type="button"
            onClick={() => onChange?.(segment.value)}
            className={`
              ${specs.height} ${specs.padding} ${specs.text} font-[450] transition-colors
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
