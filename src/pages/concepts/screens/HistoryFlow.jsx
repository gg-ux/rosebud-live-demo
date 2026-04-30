import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';

/* ═══════════════════════════════════════════════════════════════════════════
   HistoryFlow — demonstrates the full loop from chat → bookmark → history
   3 internal views:
     - chat      : filled conversation with bookmarkable messages
     - history   : searchable/filterable entry list (+ bookmark icon top right)
     - bookmarks : saved passages from chats and entries
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Journal entries data ── */
const ENTRIES = [
  {
    id: '1',
    date: 'Apr 9',
    emoji: '👑',
    title: 'Princess lessons',
    excerpt: 'I cannot handle this. This is just too much! I cannot go to princess lessons every day after school. Not with Abuela.',
    mood: 'frustrated',
    themes: ['identity', 'family'],
  },
  {
    id: '2',
    date: 'Apr 8',
    emoji: '🏠',
    title: 'Abuela showed up at the loft',
    excerpt: 'Abuela showed up at the loft today with Dad in tow. Dad wanted to find out how things went at the dance.',
    mood: 'calm',
    themes: ['family'],
  },
  {
    id: '3',
    date: 'Apr 7',
    emoji: '🌙',
    title: 'I just woke from the strangest dream',
    excerpt: 'It wasn\'t a dream at all. I danced with Daniel Chen and neither of us said a word. I have my best friend back.',
    mood: 'joyful',
    themes: ['friendship', 'romance'],
  },
  {
    id: '4',
    date: 'Apr 6',
    emoji: '😭',
    title: 'Why? Why??',
    excerpt: 'I can\'t even believe this is happening. Derek kissed me in front of Teen People and I knew exactly why.',
    mood: 'angry',
    themes: ['romance', 'identity'],
  },
  {
    id: '5',
    date: 'Apr 5',
    emoji: '🤫',
    title: 'Okay, I lied',
    excerpt: 'I brought this book anyway. I made Sven carry it. I\'m in the bathroom at the Tavern on the Green.',
    mood: 'anxious',
    themes: ['romance'],
  },
  {
    id: '6',
    date: 'Apr 4',
    emoji: '💭',
    title: 'Waiting for Derek',
    excerpt: 'Well, sitting here in my new dress, my new shoes, my new nails. And there\'s no sign of Derek.',
    mood: 'anxious',
    themes: ['romance'],
  },
  {
    id: '7',
    date: 'Apr 3',
    emoji: '📞',
    title: 'When I got home',
    excerpt: 'The first thing I did was check to make sure Derek hadn\'t called to cancel. He hadn\'t.',
    mood: 'nervous',
    themes: ['romance'],
  },
  {
    id: '8',
    date: 'Apr 2',
    emoji: '👵',
    title: 'Abbreviated lesson with Abuela',
    excerpt: 'Abbreviated lesson with Abuela today because of my spending the night at Priya\'s.',
    mood: 'calm',
    themes: ['family', 'friendship'],
  },
  {
    id: '9',
    date: 'Apr 1',
    emoji: '📝',
    title: 'Resolutions',
    excerpt: '1. Be nicer to everyone, even Ashley Hamilton. 2. Never ever bite my fingernails, even the fake ones.',
    mood: 'hopeful',
    themes: ['identity'],
  },
];

export const MOOD_COLORS = {
  joyful: '#5ABA9D',
  hopeful: '#7CC4AF',
  calm: '#93CCBB',
  anxious: '#E4AD51',
  nervous: '#EBBC6F',
  frustrated: '#D6165B',
  angry: '#A40742',
  sad: '#7E0230',
};

// Filter groups — AI-generated categories detected from journal entries.
// Each group maps to things the pattern engine can auto-tag.
export const FILTER_GROUPS = [
  {
    id: 'moods',
    label: 'Mood',
    icon: '🌙',
    options: [
      { id: 'joyful', label: 'Joyful' },
      { id: 'hopeful', label: 'Hopeful' },
      { id: 'calm', label: 'Calm' },
      { id: 'anxious', label: 'Anxious' },
      { id: 'nervous', label: 'Nervous' },
      { id: 'frustrated', label: 'Frustrated' },
      { id: 'angry', label: 'Angry' },
      { id: 'sad', label: 'Sad' },
    ],
  },
  {
    id: 'sleep',
    label: 'Sleep quality',
    icon: '😴',
    options: [
      { id: 'good', label: 'Good sleep' },
      { id: 'poor', label: 'Poor sleep' },
      { id: 'restless', label: 'Restless' },
      { id: 'not_mentioned', label: 'Not mentioned' },
    ],
  },
  {
    id: 'exercise',
    label: 'Activity',
    icon: '💪',
    options: [
      { id: 'active', label: 'Active day' },
      { id: 'workout', label: 'Workout mentioned' },
      { id: 'rest', label: 'Rest day' },
    ],
  },
  {
    id: 'cycle',
    label: 'Menstrual cycle',
    icon: '🌸',
    options: [
      { id: 'early', label: 'Days 1–7' },
      { id: 'mid', label: 'Days 8–14' },
      { id: 'late', label: 'Days 15–28' },
      { id: 'pms', label: 'PMS window' },
    ],
  },
  {
    id: 'energy',
    label: 'Energy level',
    icon: '⚡',
    options: [
      { id: 'high', label: 'High energy' },
      { id: 'medium', label: 'Medium' },
      { id: 'low', label: 'Low energy' },
      { id: 'drained', label: 'Drained' },
    ],
  },
  {
    id: 'themes',
    label: 'Theme',
    icon: '🎭',
    options: [
      { id: 'identity', label: 'Identity' },
      { id: 'family', label: 'Family' },
      { id: 'romance', label: 'Romance' },
      { id: 'friendship', label: 'Friendship' },
      { id: 'work', label: 'Work / school' },
    ],
  },
  {
    id: 'people',
    label: 'People mentioned',
    icon: '👥',
    options: [
      { id: 'abuela', label: 'Abuela' },
      { id: 'mom', label: 'Mom' },
      { id: 'derek', label: 'Derek' },
      { id: 'daniel', label: 'Daniel' },
      { id: 'zoe', label: 'Zoe' },
      { id: 'priya', label: 'Priya' },
    ],
  },
  {
    id: 'entryType',
    label: 'Entry type',
    icon: '📝',
    options: [
      { id: 'long', label: 'Long reflection' },
      { id: 'short', label: 'Quick note' },
      { id: 'list', label: 'List' },
      { id: 'voice', label: 'Voice note' },
    ],
  },
];

/* ── Chat messages for the demo ── */
const CHAT_MESSAGES = [
  {
    id: 'm1',
    role: 'assistant',
    content: 'What\'s on your mind?',
    bookmarkable: false,
  },
  {
    id: 'm2',
    role: 'user',
    content: 'I\'m still thinking about the dance. Daniel didn\'t say anything the whole time we were dancing but it felt completely different from when Derek was talking nonstop. With Daniel the silence felt full. With Derek I kept feeling like I was supposed to be someone I wasn\'t.',
    bookmarkable: false,
  },
  {
    id: 'm3',
    role: 'assistant',
    content: 'Notice what you just did — you described the same kind of moment twice, standing next to a boy, not saying much, and one felt like home and the other felt like performing. The difference wasn\'t the words. It was whether you were being seen. The people who saw you before you became a princess are the ones you\'re drawn to now. What was it about Daniel\'s silence that made you feel like yourself?',
    bookmarkable: true,
  },
];

/* ── Initial bookmarks (one pre-seeded to show the feature) ── */
const INITIAL_BOOKMARKS = [
  {
    id: 'b0',
    source: 'assistant',
    sourceLabel: 'Sage',
    text: 'Notice that you ended the most painful moment of your week by walking away, not freezing. That\'s new.',
    entryDate: 'Apr 6',
    entryTitle: 'The dance and the kiss',
    savedAt: '2 days ago',
  },
  {
    id: 'b1',
    source: 'user',
    sourceLabel: 'You',
    text: 'I don\'t care what Lana says anymore. What she thinks about me doesn\'t decide who I am. I do. I am Mia Thermopolis before I am a princess, and that part was mine first.',
    entryDate: 'Apr 2',
    entryTitle: 'After the G&T ambush',
    savedAt: '1 week ago',
  },
];

/* ══════════════════════════════════════════════════════════
   Shared components
   ══════════════════════════════════════════════════════════ */

export function Card({ children, className = '', onClick }) {
  const Comp = onClick ? 'button' : 'div';
  return (
    <Comp
      onClick={onClick}
      className={`bg-white rounded-[12px] p-[14px] border border-[#F0F0F0] ${onClick ? 'w-full text-left hover:border-[#C0C0BF] transition-colors' : ''} ${className}`}
    >
      {children}
    </Comp>
  );
}

/* ══════════════════════════════════════════════════════════
   HistoryEntryCard — the standard entry row used in both the
   raw History list and the Chapters view. Single source of
   truth so both surfaces stay visually identical.
   ══════════════════════════════════════════════════════════ */
export function HistoryEntryCard({ entry, onClick }) {
  return (
    <Card onClick={onClick || (() => {})} className="flex flex-col gap-[6px]">
      <div className="flex items-center justify-between gap-[8px]">
        <div className="flex items-center gap-[8px] min-w-0">
          <span className="text-[16px] shrink-0">{entry.emoji}</span>
          <span className="text-[14px] leading-[19px] font-[600] text-[#191C1A] truncate">{entry.title}</span>
        </div>
        <span className="text-[11px] leading-[14px] font-[500] text-[#8B828B] shrink-0">{entry.date}</span>
      </div>
      <p className="text-[12px] leading-[17px] font-[450] text-[#6D6C6A] line-clamp-2">{entry.excerpt}</p>
      <div className="flex items-center gap-[6px]">
        <span
          className="inline-flex items-center gap-[4px] px-[6px] py-[2px] rounded-full text-[10px] leading-[13px] font-[500]"
          style={{
            backgroundColor: `${MOOD_COLORS[entry.mood] || '#8B828B'}20`,
            color: MOOD_COLORS[entry.mood] || '#8B828B',
          }}
        >
          <span className="w-[5px] h-[5px] rounded-full" style={{ backgroundColor: MOOD_COLORS[entry.mood] || '#8B828B' }} />
          {entry.mood}
        </span>
        {entry.themes?.map((t) => (
          <span key={t} className="text-[10px] leading-[13px] font-[450] text-[#8B828B]">
            · {t}
          </span>
        ))}
      </div>
    </Card>
  );
}

function BookmarkIcon({ filled, size = 16, color }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? (color || '#E31665') : 'none'}
      stroke={filled ? (color || '#E31665') : '#8B828B'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: size, height: size }}
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════
   CHAT VIEW — filled conversation, bookmarkable messages
   ══════════════════════════════════════════════════════════ */
function ChatView({ bookmarks, onBookmark }) {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Top bar — matches V3 paradigm: Sage dropdown left, Drafts + close right */}
      <div className="flex items-center justify-between px-[8px] h-[48px] shrink-0">
        <div className="flex items-center gap-[12px] pl-[6px] pr-[12px] py-[6px] rounded-[10px] border border-[#C0C0BF]">
          <div className="w-[24px] h-[24px] rounded-full bg-[#7CC4AF]" />
          <span className="text-[15px] leading-[20px] font-[450] text-[#191C1A]">Sage</span>
          <svg viewBox="0 0 12 12" fill="none" className="w-[12px] h-[12px]">
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="flex items-center gap-[8px]">
          <span className="text-[16px] leading-[22px] font-[500] text-[#000000]">Drafts</span>
          <button className="w-[36px] h-[36px] rounded-full flex items-center justify-center">
            <svg viewBox="0 0 18 18" fill="none" className="w-[18px] h-[18px]">
              <path d="M4.5 4.5L13.5 13.5M13.5 4.5L4.5 13.5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Thread */}
      <div className="flex-1 overflow-y-auto px-[14px] py-[8px] flex flex-col gap-[18px]">
        {CHAT_MESSAGES.map((msg) => {
          const isUser = msg.role === 'user';
          const isBookmarked = bookmarks.some(b => b.id === msg.id);
          return (
            <div key={msg.id} className="flex flex-col gap-[8px]">
              <p
                className={`text-[14px] leading-[20px] font-[450] ${
                  isUser ? 'text-[#191C1A]' : 'text-[#2B6CB0]'
                }`}
              >
                {msg.content}
              </p>
              {/* Action icon row — only on bookmarkable AI messages, mimics Rosebud's real hover state */}
              {msg.bookmarkable && (
                <div className="flex items-center gap-[14px]">
                  {/* Play */}
                  <svg viewBox="0 0 24 24" fill="none" stroke="#2B6CB0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-[15px] h-[15px]">
                    <polygon points="6 4 20 12 6 20 6 4" />
                  </svg>
                  {/* Copy */}
                  <svg viewBox="0 0 24 24" fill="none" stroke="#2B6CB0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-[15px] h-[15px]">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  {/* Thumbs up */}
                  <svg viewBox="0 0 24 24" fill="none" stroke="#2B6CB0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-[15px] h-[15px]">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                  </svg>
                  {/* Thumbs down */}
                  <svg viewBox="0 0 24 24" fill="none" stroke="#2B6CB0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-[15px] h-[15px]">
                    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
                  </svg>
                  {/* Bookmark — the one we added */}
                  <button
                    onClick={() => onBookmark(msg)}
                    className="p-0 -m-[2px]"
                    title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill={isBookmarked ? '#E31665' : 'none'}
                      stroke={isBookmarked ? '#E31665' : '#2B6CB0'}
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-[15px] h-[15px]"
                    >
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom CTAs — matches V3 framework exactly */}
      <div className="border-t border-[#F0F0F0]">
        <div className="flex items-center justify-between px-[18px] pt-[12px]">
          <div className="flex items-center gap-[24px]">
            <svg viewBox="0 0 24 24" fill="none" className="w-[20px] h-[20px]"><path d="M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3z" stroke="#191C1A" strokeWidth="1.5"/><path d="M19 10v1a7 7 0 01-14 0v-1M12 18v4M8 22h8" stroke="#191C1A" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <svg viewBox="0 0 24 24" fill="none" className="w-[20px] h-[20px]"><rect x="3" y="3" width="18" height="18" rx="2" stroke="#191C1A" strokeWidth="1.5"/><circle cx="8.5" cy="8.5" r="1.5" fill="#191C1A"/><path d="M21 15l-5-5L5 21" stroke="#191C1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <svg viewBox="0 0 24 24" fill="none" className="w-[20px] h-[20px]"><path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" stroke="#191C1A" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </div>
        {/* Buttons — since chat shows user input, use the "has input" state: Finish entry + Go deeper */}
        <div className="flex gap-[12px] px-[12px] py-[12px]">
          <button className="flex-1 h-[44px] rounded-[12px] border border-[#C0C0BF] flex items-center justify-center cursor-pointer">
            <span className="text-[16px] leading-[22px] font-[500] text-[#191C1A]">Finish entry</span>
          </button>
          <button className="flex-1 h-[44px] rounded-[12px] bg-[#191C1A] flex items-center justify-center gap-[6px] cursor-pointer">
            <svg viewBox="0 0 18 18" fill="#FFFFFF" className="w-[14px] h-[14px]">
              <path d="M9 1l1.3 3.2L13.5 5.5l-3.2 1.3L9 10 7.7 6.8 4.5 5.5l3.2-1.3L9 1zM4 10l.7 1.8L6.5 12.5l-1.8.7L4 15l-.7-1.8L1.5 12.5l1.8-.7L4 10z"/>
            </svg>
            <span className="text-[16px] leading-[22px] font-[500] text-[#FFFFFF]">Go deeper</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Calendar picker — Airbnb-style, single or range selection
   ══════════════════════════════════════════════════════════ */

// Months data for navigation. Mockup is anchored to Apr 2026.
export const MONTHS = [
  { name: 'February 2026', short: 'Feb 2026', days: 28, firstDay: 0, monthKey: 2 },
  { name: 'March 2026', short: 'Mar 2026', days: 31, firstDay: 0, monthKey: 3 },
  { name: 'April 2026', short: 'Apr 2026', days: 30, firstDay: 3, monthKey: 4 },
  { name: 'May 2026', short: 'May 2026', days: 31, firstDay: 5, monthKey: 5 },
];
export const ANCHOR_MONTH_INDEX = 2; // April 2026
export const ANCHOR_TODAY = 9; // Today = Apr 9

export function CalendarPicker({ dateRange, onChange, onClose }) {
  const [mode, setMode] = useState('range'); // 'single' | 'range'
  const [tempRange, setTempRange] = useState(dateRange);
  const [monthIndex, setMonthIndex] = useState(ANCHOR_MONTH_INDEX);
  const currentMonth = MONTHS[monthIndex];

  // Only support Apr days for the mockup — clicking other months doesn't select
  const isPickableMonth = monthIndex === ANCHOR_MONTH_INDEX;

  const handleDayClick = (day) => {
    if (!isPickableMonth) return;
    if (mode === 'single') {
      setTempRange({ start: day, end: day });
      return;
    }
    if (!tempRange.start || (tempRange.start && tempRange.end && tempRange.start !== tempRange.end)) {
      setTempRange({ start: day, end: null });
    } else if (day < tempRange.start) {
      setTempRange({ start: day, end: tempRange.start });
    } else if (day === tempRange.start) {
      setTempRange({ start: day, end: day });
    } else {
      setTempRange({ start: tempRange.start, end: day });
    }
  };

  const isInRange = (day) => {
    if (!isPickableMonth) return false;
    if (!tempRange.start) return false;
    if (!tempRange.end) return day === tempRange.start;
    return day >= tempRange.start && day <= tempRange.end;
  };
  const isStart = (day) => isPickableMonth && tempRange.start === day;
  const isEnd = (day) => isPickableMonth && tempRange.end === day;
  const isToday = (day) => isPickableMonth && day === ANCHOR_TODAY;

  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const cells = [];
  for (let i = 0; i < currentMonth.firstDay; i++) cells.push(null);
  for (let d = 1; d <= currentMonth.days; d++) cells.push(d);
  // pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  const applyPreset = (preset) => {
    setMonthIndex(ANCHOR_MONTH_INDEX);
    if (preset === 'today') setTempRange({ start: ANCHOR_TODAY, end: ANCHOR_TODAY });
    if (preset === 'week') setTempRange({ start: ANCHOR_TODAY - 3, end: ANCHOR_TODAY });
    if (preset === '7days') setTempRange({ start: ANCHOR_TODAY - 6, end: ANCHOR_TODAY });
    if (preset === '30days') setTempRange({ start: 1, end: ANCHOR_TODAY });
    if (preset === 'month') setTempRange({ start: 1, end: 30 });
  };

  const selectionLabel = () => {
    if (!tempRange.start) return 'Select dates';
    if (mode === 'single' || !tempRange.end || tempRange.start === tempRange.end) {
      return `Apr ${tempRange.start}, 2026`;
    }
    return `Apr ${tempRange.start} – Apr ${tempRange.end}, 2026`;
  };

  return (
    <div className="absolute inset-0 z-20 flex items-stretch justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full bg-white flex flex-col h-full min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with mode toggle and close */}
        <div className="px-[20px] pt-[8px] pb-[12px] flex items-start justify-between gap-[12px] shrink-0 border-b border-[#F0F0F0]">
          <div className="flex-1 min-w-0">
            <span className="text-[11px] leading-[14px] font-[600] tracking-[0.08em] uppercase text-[#8B828B] block mb-[2px]">
              {selectionLabel() === 'Select dates' ? 'Pick a date' : 'Selected'}
            </span>
            <span className="text-[17px] leading-[22px] font-[700] text-[#191C1A] truncate block">
              {selectionLabel()}
            </span>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-[28px] h-[28px] rounded-full hover:bg-[#F0F0F0] flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#191C1A" strokeWidth="2" strokeLinecap="round" className="w-[14px] h-[14px]">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 min-h-0 overflow-y-auto">
        {/* Mode toggle */}
        <div className="px-[20px] pt-[12px] pb-[12px]">
          <div className="flex bg-[#F0F0F0] rounded-[10px] p-[3px]">
            {[
              { id: 'range', label: 'Date range' },
              { id: 'single', label: 'Single date' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setMode(m.id);
                  if (m.id === 'single' && tempRange.start) {
                    setTempRange({ start: tempRange.start, end: tempRange.start });
                  }
                }}
                className={`flex-1 py-[6px] rounded-[8px] text-[12px] leading-[15px] font-[500] transition-all ${
                  mode === m.id
                    ? 'bg-white text-[#191C1A] shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                    : 'text-[#8B828B]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Month navigator */}
        <div className="px-[20px] flex items-center justify-between mb-[8px]">
          <button
            onClick={() => setMonthIndex(Math.max(0, monthIndex - 1))}
            disabled={monthIndex === 0}
            className="w-[28px] h-[28px] rounded-full flex items-center justify-center hover:bg-[#F0F0F0] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#191C1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px]">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <span className="text-[14px] leading-[19px] font-[600] text-[#191C1A]">{currentMonth.name}</span>
          <button
            onClick={() => setMonthIndex(Math.min(MONTHS.length - 1, monthIndex + 1))}
            disabled={monthIndex === MONTHS.length - 1}
            className="w-[28px] h-[28px] rounded-full flex items-center justify-center hover:bg-[#F0F0F0] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#191C1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px]">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Weekday headers */}
        <div className="px-[20px] grid grid-cols-7 mb-[4px]">
          {weekdays.map((wd, i) => (
            <div key={i} className="text-center text-[10px] leading-[13px] font-[600] text-[#8B828B] py-[4px]">
              {wd}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className="px-[20px] grid grid-cols-7 gap-y-[2px]">
          {cells.map((day, i) => {
            if (day === null) return <div key={i} className="aspect-square" />;
            const inRange = isInRange(day);
            const start = isStart(day);
            const end = isEnd(day);
            const isSingleDay = start && end;
            const col = i % 7;
            // Range background layer — fills between dates in the range (airbnb-style)
            const showBackground = inRange && !isSingleDay;
            const isRowStart = col === 0 || !isInRange(day - 1) || start;
            const isRowEnd = col === 6 || !isInRange(day + 1) || end;

            return (
              <div key={i} className="relative aspect-square">
                {showBackground && (
                  <div
                    className={`absolute inset-y-[3px] bg-[#FFE2ED] ${
                      start ? 'left-1/2 right-0' : end ? 'left-0 right-1/2' : 'left-0 right-0'
                    } ${isRowStart && !start ? 'rounded-l-[6px]' : ''} ${isRowEnd && !end ? 'rounded-r-[6px]' : ''}`}
                  />
                )}
                <button
                  onClick={() => handleDayClick(day)}
                  disabled={!isPickableMonth}
                  className={`relative w-full h-full flex items-center justify-center text-[13px] leading-[16px] font-[500] transition-colors ${
                    start || end
                      ? 'bg-[#E31665] text-white rounded-full'
                      : inRange
                      ? 'text-[#A40742]'
                      : isToday(day)
                      ? 'text-[#E31665] font-[700]'
                      : isPickableMonth
                      ? 'text-[#191C1A] hover:bg-[#F0F0F0] rounded-full'
                      : 'text-[#C0C0BF] cursor-not-allowed'
                  }`}
                >
                  {day}
                </button>
              </div>
            );
          })}
        </div>

        {/* Presets */}
        <div className="px-[20px] pt-[16px] pb-[20px]">
          <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#8B828B] block mb-[8px]">
            Quick select
          </span>
          <div className="flex gap-[6px] flex-wrap">
            {[
              { id: 'today', label: 'Today' },
              { id: 'week', label: 'This week' },
              { id: '7days', label: 'Last 7 days' },
              { id: '30days', label: 'Last 30 days' },
              { id: 'month', label: 'This month' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id)}
                className="px-[10px] py-[5px] rounded-full bg-[#F8F8F8] border border-[#F0F0F0] text-[11px] leading-[14px] font-[500] text-[#191C1A] hover:bg-[#F0F0F0] transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        </div>

        {/* Sticky action footer */}
        <div className="shrink-0 px-[20px] py-[14px] border-t border-[#F0F0F0] flex items-center justify-between bg-white">
          <button
            onClick={() => setTempRange({ start: null, end: null })}
            className="text-[13px] leading-[18px] font-[500] text-[#8B828B] hover:text-[#191C1A] underline underline-offset-2"
          >
            Clear
          </button>
          <button
            onClick={() => {
              onChange(tempRange);
              onClose();
            }}
            className="px-[18px] py-[10px] rounded-[12px] bg-[#191C1A] text-white text-[13px] leading-[18px] font-[500]"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Filter sheet — grouped multi-select filters
   ══════════════════════════════════════════════════════════ */
export function FilterSheet({ filters, onChange, onClose }) {
  const [temp, setTemp] = useState(filters);

  const toggle = (groupId, optionId) => {
    const current = temp[groupId] || [];
    const next = current.includes(optionId)
      ? current.filter((x) => x !== optionId)
      : [...current, optionId];
    setTemp({ ...temp, [groupId]: next });
  };

  const activeCount = Object.values(temp).reduce((sum, arr) => sum + (arr?.length || 0), 0);

  return (
    <div className="absolute inset-0 z-20 flex items-stretch justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full bg-white flex flex-col h-full min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-[20px] pt-[16px] pb-[12px] flex items-start justify-between gap-[12px] shrink-0 border-b border-[#F0F0F0]">
          <div className="flex-1 min-w-0">
            <span className="text-[11px] leading-[14px] font-[600] tracking-[0.08em] uppercase text-[#8B828B] block mb-[2px]">
              AI-detected categories
            </span>
            <span className="text-[17px] leading-[22px] font-[700] text-[#191C1A]">Filters</span>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-[28px] h-[28px] rounded-full hover:bg-[#F0F0F0] flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#191C1A" strokeWidth="2" strokeLinecap="round" className="w-[14px] h-[14px]">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable filter groups */}
        <div className="flex-1 min-h-0 overflow-y-auto px-[20px] py-[16px] flex flex-col gap-[20px]">
          {FILTER_GROUPS.map((group) => {
            const activeInGroup = (temp[group.id] || []).length;
            return (
              <div key={group.id} className="flex flex-col gap-[10px]">
                <div className="flex items-center gap-[8px]">
                  <span className="text-[14px]">{group.icon}</span>
                  <span className="text-[13px] leading-[17px] font-[600] text-[#191C1A]">
                    {group.label}
                  </span>
                  {activeInGroup > 0 && (
                    <span className="text-[10px] leading-[13px] font-[500] text-[#E31665]">
                      {activeInGroup} selected
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-[6px]">
                  {group.options.map((opt) => {
                    const isActive = (temp[group.id] || []).includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        onClick={() => toggle(group.id, opt.id)}
                        className={`px-[12px] py-[7px] rounded-full text-[12px] leading-[15px] font-[500] transition-colors ${
                          isActive
                            ? 'bg-[#191C1A] text-white'
                            : 'bg-[#F0F0F0] text-[#6D6C6A] hover:bg-[#E5E5E5]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sticky action footer */}
        <div className="shrink-0 px-[20px] py-[14px] border-t border-[#F0F0F0] flex items-center justify-between bg-white">
          <button
            onClick={() => {
              const empty = {};
              FILTER_GROUPS.forEach((g) => { empty[g.id] = []; });
              setTemp(empty);
            }}
            className="text-[13px] leading-[18px] font-[500] text-[#8B828B] hover:text-[#191C1A] underline underline-offset-2"
          >
            Reset
          </button>
          <button
            onClick={() => {
              onChange(temp);
              onClose();
            }}
            className="px-[18px] py-[10px] rounded-[12px] bg-[#191C1A] text-white text-[13px] leading-[18px] font-[500]"
          >
            {activeCount > 0 ? `Apply (${activeCount})` : 'Apply'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   HISTORY VIEW — stats, search, calendar, filter sheet, entry list
   ══════════════════════════════════════════════════════════ */
function HistoryView({ onOpenBookmarks, bookmarkCount, onSheetOpenChange }) {
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [filters, setFilters] = useState({ moods: [], themes: [], people: [] });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  useEffect(() => {
    onSheetOpenChange?.(calendarOpen || filterSheetOpen);
  }, [calendarOpen, filterSheetOpen, onSheetOpenChange]);

  const parseEntryDay = (entry) => parseInt(entry.date.replace('Apr ', ''), 10);

  const filtered = ENTRIES.filter((entry) => {
    if (search) {
      const q = search.toLowerCase();
      if (!entry.title.toLowerCase().includes(q) && !entry.excerpt.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (dateRange.start) {
      const day = parseEntryDay(entry);
      const start = dateRange.start;
      const end = dateRange.end || dateRange.start;
      if (day < start || day > end) return false;
    }
    if (filters.moods?.length && !filters.moods.includes(entry.mood)) return false;
    if (filters.themes?.length && !entry.themes.some((t) => filters.themes.includes(t))) return false;
    return true;
  });

  const activeFilterCount =
    (filters.moods?.length || 0) + (filters.themes?.length || 0) + (filters.people?.length || 0);
  const hasDateFilter = dateRange.start !== null;

  const dateRangeLabel = !hasDateFilter
    ? null
    : dateRange.end && dateRange.end !== dateRange.start
    ? `Apr ${dateRange.start} – Apr ${dateRange.end}`
    : `Apr ${dateRange.start}`;

  return (
    <div className="relative h-full overflow-hidden">
    <div className="h-full overflow-y-auto px-[16px] pt-[12px] pb-[24px] flex flex-col gap-[14px]">
      {/* Header */}
      <div className="flex items-start justify-between gap-[12px]">
        <div>
          <h1 className="text-[22px] leading-[28px] font-[700] text-[#191C1A]">History</h1>
          <p className="text-[11px] leading-[14px] font-[450] text-[#8B828B] mt-[2px]">Your journal entries</p>
        </div>
        <button
          onClick={onOpenBookmarks}
          className="shrink-0 relative w-[36px] h-[36px] rounded-full bg-[#F0F0F0] hover:bg-[#E5E5E5] flex items-center justify-center transition-colors"
          title="Bookmarks"
        >
          <BookmarkIcon size={16} />
          {bookmarkCount > 0 && (
            <span className="absolute -top-[2px] -right-[2px] min-w-[16px] h-[16px] rounded-full bg-[#E31665] text-white text-[9px] leading-[16px] font-[700] flex items-center justify-center px-[4px]">
              {bookmarkCount}
            </span>
          )}
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-[8px]">
        {[
          { label: 'Entries', value: '9' },
          { label: 'Words', value: '13.1k' },
          { label: 'Streak', value: '31d' },
        ].map((s, i) => (
          <Card key={i} className="!p-[12px] flex flex-col items-center gap-[2px]">
            <span className="text-[18px] leading-[22px] font-[700] text-[#191C1A]">{s.value}</span>
            <span className="text-[10px] leading-[13px] font-[500] text-[#8B828B]">{s.label}</span>
          </Card>
        ))}
      </div>

      {/* Search bar + calendar + filter buttons — sticky at top of scroll */}
      <div className="sticky top-0 z-10 -mx-[16px] px-[16px] py-[8px] bg-white/95 backdrop-blur-sm flex items-center gap-[8px]">
        <div className="relative flex-1">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8B828B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-[12px] top-1/2 -translate-y-1/2 w-[16px] h-[16px] pointer-events-none"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search entries..."
            className="w-full pl-[36px] pr-[12px] h-[40px] rounded-[10px] bg-[#F8F8F8] border border-[#F0F0F0] text-[13px] font-[450] text-[#191C1A] placeholder:text-[#8B828B] outline-none focus:border-[#C0C0BF]"
          />
        </div>
        {/* Calendar button */}
        <button
          onClick={() => setCalendarOpen(true)}
          className={`shrink-0 w-[40px] h-[40px] rounded-[10px] border flex items-center justify-center transition-colors ${
            hasDateFilter
              ? 'bg-[#191C1A] border-[#191C1A]'
              : 'bg-[#F8F8F8] border-[#F0F0F0] hover:border-[#C0C0BF]'
          }`}
          title="Filter by date"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke={hasDateFilter ? 'white' : '#191C1A'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </button>
        {/* Filter button */}
        <button
          onClick={() => setFilterSheetOpen(true)}
          className={`shrink-0 relative w-[40px] h-[40px] rounded-[10px] border flex items-center justify-center transition-colors ${
            activeFilterCount > 0
              ? 'bg-[#191C1A] border-[#191C1A]'
              : 'bg-[#F8F8F8] border-[#F0F0F0] hover:border-[#C0C0BF]'
          }`}
          title="Filters"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke={activeFilterCount > 0 ? 'white' : '#191C1A'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
          {activeFilterCount > 0 && (
            <span className="absolute -top-[4px] -right-[4px] min-w-[15px] h-[15px] rounded-full bg-[#E31665] text-white text-[9px] leading-[15px] font-[700] flex items-center justify-center px-[3px]">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Active filter chips — shows the user what's applied */}
      {(hasDateFilter || activeFilterCount > 0) && (
        <div className="flex items-center gap-[6px] flex-wrap">
          {hasDateFilter && (
            <button
              onClick={() => setDateRange({ start: null, end: null })}
              className="inline-flex items-center gap-[4px] px-[10px] py-[4px] rounded-full bg-[#191C1A] text-white text-[11px] leading-[14px] font-[500]"
            >
              {dateRangeLabel}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-[10px] h-[10px]">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
          {Object.entries(filters).flatMap(([groupId, ids]) =>
            (ids || []).map((id) => {
              const group = FILTER_GROUPS.find((g) => g.id === groupId);
              const opt = group?.options.find((o) => o.id === id);
              if (!opt) return null;
              return (
                <button
                  key={`${groupId}-${id}`}
                  onClick={() => setFilters({ ...filters, [groupId]: (filters[groupId] || []).filter((x) => x !== id) })}
                  className="inline-flex items-center gap-[4px] px-[10px] py-[4px] rounded-full bg-[#191C1A] text-white text-[11px] leading-[14px] font-[500]"
                >
                  {opt.label}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-[10px] h-[10px]">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              );
            })
          )}
        </div>
      )}

      {/* Entry list */}
      <div className="flex flex-col gap-[8px]">
        {filtered.length === 0 ? (
          <div className="py-[32px] text-center">
            <span className="text-[13px] font-[450] text-[#8B828B]">No entries match</span>
          </div>
        ) : (
          filtered.map((entry) => (
            <HistoryEntryCard key={entry.id} entry={entry} />
          ))
        )}
      </div>

    </div>

    {/* Sheets — rendered as siblings of the scroll container so inset-0
        sizes them to the viewport, not the scroll height */}
    {calendarOpen && (
      <CalendarPicker
        dateRange={dateRange}
        onChange={setDateRange}
        onClose={() => setCalendarOpen(false)}
      />
    )}
    {filterSheetOpen && (
      <FilterSheet
        filters={filters}
        onChange={setFilters}
        onClose={() => setFilterSheetOpen(false)}
      />
    )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   BOOKMARKS VIEW — saved passages from chats and entries
   ══════════════════════════════════════════════════════════ */
function BookmarksView({ bookmarks, onBack, onRemove, onOpenQuote }) {
  return (
    <div className="px-[16px] pt-[12px] pb-[24px] flex flex-col gap-[14px]">
      {/* Header */}
      <div className="flex items-center gap-[10px]">
        <button
          onClick={onBack}
          className="shrink-0 w-[32px] h-[32px] rounded-full hover:bg-[#F0F0F0] flex items-center justify-center transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="#191C1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-[20px] leading-[26px] font-[700] text-[#191C1A]">Bookmarks</h1>
          <p className="text-[11px] leading-[14px] font-[450] text-[#8B828B]">
            {bookmarks.length} {bookmarks.length === 1 ? 'saved passage' : 'saved passages'}
          </p>
        </div>
      </div>

      {/* Bookmark list */}
      <div className="flex flex-col gap-[10px]">
        {bookmarks.length === 0 ? (
          <div className="py-[40px] flex flex-col items-center gap-[8px]">
            <BookmarkIcon size={24} color="#C0C0BF" />
            <span className="text-[13px] font-[450] text-[#8B828B]">Nothing saved yet</span>
            <span className="text-[11px] font-[450] text-[#C0C0BF] text-center max-w-[220px]">
              Tap the bookmark icon next to any message in chat to save it here.
            </span>
          </div>
        ) : (
          bookmarks.map((bm) => (
            <button
              key={bm.id}
              onClick={() => onOpenQuote(bm)}
              className="bg-white rounded-[12px] p-[14px] border border-[#F0F0F0] w-full text-left hover:border-[#C0C0BF] transition-colors flex flex-col gap-[10px] cursor-pointer"
            >
              {/* Source tag */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[6px]">
                  <div
                    className={`w-[14px] h-[14px] rounded-full ${
                      bm.source === 'assistant' ? 'bg-[#7CC4AF]' : 'bg-[#E6B8CC]'
                    }`}
                  />
                  <span className="text-[10px] leading-[13px] font-[600] tracking-[0.06em] uppercase text-[#8B828B]">
                    {bm.sourceLabel}
                  </span>
                </div>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(bm.id);
                  }}
                  className="p-[4px] rounded-[6px] hover:bg-[#F0F0F0] transition-colors cursor-pointer"
                  title="Remove bookmark"
                  role="button"
                  tabIndex={0}
                >
                  <BookmarkIcon filled size={14} />
                </span>
              </div>
              {/* Quote */}
              <p className="text-[14px] leading-[21px] font-[450] text-[#191C1A]">
                {bm.text}
              </p>
              {/* Source entry link */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-[1px]">
                  <span className="text-[11px] leading-[14px] font-[500] text-[#191C1A]">
                    {bm.entryTitle}
                  </span>
                  <span className="text-[10px] leading-[13px] font-[450] text-[#8B828B]">
                    {bm.entryDate} · Saved {bm.savedAt}
                  </span>
                </div>
                <svg viewBox="0 0 24 24" fill="none" stroke="#8B828B" strokeWidth="2" className="w-[14px] h-[14px]">
                  <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   BookmarkQuoteCard — full-screen shareable quote takeover.
   Opens when a bookmark is tapped. Warm gradient tinted to
   the speaker's attribution color (sage for Sage, rose for
   You), big pull-quote typography, and subtle Rosebud
   wordmark at the bottom. Designed to screenshot-share.
   ══════════════════════════════════════════════════════════ */
function BookmarkQuoteCard({ bookmark, onClose }) {
  const isAssistant = bookmark.source === 'assistant';
  const bgImage = isAssistant
    ? 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.55) 0%, transparent 60%), linear-gradient(165deg, #F0FFF4 0%, #D7F2E5 45%, #A8E4C4 100%)'
    : 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.55) 0%, transparent 60%), linear-gradient(165deg, #FFF0F5 0%, #FFE2ED 45%, #F8C2D8 100%)';
  const accentColor = isAssistant ? '#235E4D' : '#A40742';
  const softAccent = isAssistant ? '#2F7A61' : '#C01761';

  return (
    <div className="absolute inset-0 z-30 flex flex-col" style={{ backgroundImage: bgImage }}>
      {/* Top bar — close + share */}
      <div className="shrink-0 flex items-center justify-between px-[16px] pt-[16px] pb-[12px]">
        <button
          onClick={onClose}
          className="w-[32px] h-[32px] rounded-full bg-white/50 backdrop-blur-sm hover:bg-white/70 flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round" className="w-[16px] h-[16px]">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <button
          className="w-[32px] h-[32px] rounded-full bg-white/50 backdrop-blur-sm hover:bg-white/70 flex items-center justify-center transition-colors"
          title="Share"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
            <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
        </button>
      </div>

      {/* Main content — centered pull quote */}
      <div className="flex-1 min-h-0 flex flex-col justify-center px-[32px] text-center">
        {/* Decorative open quote */}
        <div
          className="text-[72px] leading-[30px] font-[700] mb-[24px] select-none"
          style={{ color: accentColor, opacity: 0.22 }}
        >
          &ldquo;
        </div>

        {/* Quote text */}
        <p
          className="text-[20px] leading-[30px] font-[500] mb-[28px]"
          style={{ color: accentColor }}
        >
          {bookmark.text}
        </p>

        {/* Attribution */}
        <div className="flex flex-col items-center gap-[4px]">
          <span
            className="text-[11px] leading-[14px] font-[700] tracking-[0.1em] uppercase"
            style={{ color: softAccent, opacity: 0.75 }}
          >
            &mdash; {bookmark.sourceLabel}
          </span>
          <span
            className="text-[10px] leading-[13px] font-[450] italic"
            style={{ color: softAccent, opacity: 0.6 }}
          >
            from {bookmark.entryTitle} &middot; {bookmark.entryDate}
          </span>
        </div>
      </div>

      {/* Subtle Rosebud branding at bottom */}
      <div className="shrink-0 flex justify-center items-center gap-[5px] pb-[24px]">
        {/* Tiny rose sprig */}
        <svg viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-[11px] h-[11px]" style={{ opacity: 0.5 }}>
          <circle cx="12" cy="8" r="3" />
          <path d="M12 11v9" />
          <path d="M9 15c0-1.5 1.5-2 3-2" />
          <path d="M15 17c0-1.5-1.5-2-3-2" />
        </svg>
        <span
          className="text-[10px] leading-[13px] font-[700] tracking-[0.18em] uppercase"
          style={{ color: accentColor, opacity: 0.5 }}
        >
          Rosebud
        </span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN FLOW COMPONENT
   ══════════════════════════════════════════════════════════ */
export const HistoryFlow = forwardRef(function HistoryFlow({ initialView = 'chat', onViewChange, onSheetOpenChange } = {}, ref) {
  const [view, setViewState] = useState(initialView);
  const [bookmarks, setBookmarks] = useState(INITIAL_BOOKMARKS);
  // Which bookmark is open in the full-screen quote card. null = closed.
  const [openBookmark, setOpenBookmark] = useState(null);

  // Forward open-bookmark state to the parent sheet coordinator so
  // the phone's nav bar hides when the quote takeover is showing.
  useEffect(() => {
    if (openBookmark !== null) {
      onSheetOpenChange?.(true);
    }
  }, [openBookmark, onSheetOpenChange]);

  const setView = (next) => {
    setViewState(next);
    if (onViewChange) onViewChange(next);
  };

  const toggleBookmark = (message) => {
    const existing = bookmarks.find((b) => b.id === message.id);
    if (existing) {
      setBookmarks(bookmarks.filter((b) => b.id !== message.id));
    } else {
      setBookmarks([
        {
          id: message.id,
          source: message.role,
          sourceLabel: message.role === 'assistant' ? 'Sage' : 'You',
          text: message.content,
          entryDate: 'Apr 9',
          entryTitle: 'Today\'s chat',
          savedAt: 'just now',
        },
        ...bookmarks,
      ]);
    }
  };

  const removeBookmark = (id) => {
    setBookmarks(bookmarks.filter((b) => b.id !== id));
  };

  useImperativeHandle(ref, () => ({
    goToChat: () => setViewState('chat'),
    goToHistory: () => setViewState('history'),
    goToBookmarks: () => setViewState('bookmarks'),
    reset: () => {
      setViewState('chat');
      setBookmarks(INITIAL_BOOKMARKS);
    },
  }), []);

  return (
    <div className="relative h-full overflow-hidden">
      <div className="h-full overflow-y-auto">
        {view === 'chat' && (
          <ChatView bookmarks={bookmarks} onBookmark={toggleBookmark} />
        )}
        {view === 'history' && (
          <HistoryView
            onOpenBookmarks={() => setView('bookmarks')}
            bookmarkCount={bookmarks.length}
            onSheetOpenChange={onSheetOpenChange}
          />
        )}
        {view === 'bookmarks' && (
          <BookmarksView
            bookmarks={bookmarks}
            onBack={() => setView('history')}
            onRemove={removeBookmark}
            onOpenQuote={setOpenBookmark}
          />
        )}
      </div>

      {/* Full-screen shareable quote card takeover */}
      {openBookmark && (
        <BookmarkQuoteCard
          bookmark={openBookmark}
          onClose={() => {
            setOpenBookmark(null);
            onSheetOpenChange?.(false);
          }}
        />
      )}
    </div>
  );
});
