const tabs = [
  { id: 'today', label: 'Today', icon: (c) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" className="w-[20px] h-[20px]">
      <circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2m-10-10h2m16 0h2m-3.5-6.5l-1.4 1.4M6.3 17.7l-1.4 1.4M6.3 6.3L4.9 4.9m12.8 12.8l1.4 1.4" strokeLinecap="round"/>
    </svg>
  )},
  { id: 'explore', label: 'Explore', icon: (c) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" className="w-[20px] h-[20px]">
      <circle cx="12" cy="12" r="10"/><path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )},
  { id: 'write', label: '', icon: () => (
    <div className="w-[40px] h-[40px] rounded-full bg-[#000000] flex items-center justify-center -mt-[8px]">
      <svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" className="w-[18px] h-[18px]"><path d="M12 5v14m-7-7h14" strokeLinecap="round"/></svg>
    </div>
  )},
  { id: 'patterns', label: 'Patterns', icon: (c) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" className="w-[20px] h-[20px]">
      <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 16l4-4 4 4 5-6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )},
  { id: 'history', label: 'History', icon: (c) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" className="w-[20px] h-[20px]">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" strokeLinecap="round" strokeLinejoin="round"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )},
];

export function MainNavBar({ activeTab = 'today' }) {
  return (
    <div className="h-[72px] bg-[#FFFFFF] border-t border-[#F0F0F0] flex items-start justify-around pt-[8px] px-[4px]">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        const color = isActive ? '#000000' : '#C0C0BF';
        return (
          <div key={tab.id} className="flex flex-col items-center gap-[2px] w-[52px]">
            {tab.icon(color)}
            {tab.label && <span className={`text-[9px] leading-[12px] font-[500] ${isActive ? 'text-[#000000]' : 'text-[#C0C0BF]'}`}>{tab.label}</span>}
          </div>
        );
      })}
    </div>
  );
}
