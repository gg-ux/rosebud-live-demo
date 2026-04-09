export function Searchbar({ disabled = false, className = '', ...props }) {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 20 20"
        fill="#6D6C6A"
        className="absolute left-[16px] top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
      >
        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
      </svg>
      <input
        type="search"
        disabled={disabled}
        className={`
          w-full h-[56px] pl-[48px] pr-[16px] rounded-[12px]
          text-[16px] leading-[22px] font-[450] outline-none
          ${disabled
            ? 'bg-[#DEDEDE] text-[#6D6C6A] cursor-not-allowed'
            : 'bg-[#FFFFFF] text-[#000000]'
          }
          placeholder:text-[#6D6C6A]
          focus:ring-1 focus:ring-[#DEDEDE]
        `}
        {...props}
      />
    </div>
  );
}
