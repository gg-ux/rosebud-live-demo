import { useState, useEffect } from 'react';
import {
  HistoryEntryCard,
  FilterSheet,
  CalendarPicker,
  FILTER_GROUPS,
  MOOD_COLORS,
} from './HistoryFlow';
import { StoryOfYouTakeover } from './StoryOfYouTakeover';
import { StoryOfYouCard } from './ResultsV2Anthology';

/* ═══════════════════════════════════════════════════════════════════════════
   ChaptersFlow — a second History mode that time-groups entries and adds
   AI-generated chapter headlines. Two tabs at top:
     - Entries   : raw chronological archive (default for real users)
     - Chapters  : time-grouped sections with narrative headlines and
                   a Story of You widget that bridges to Patterns

   Reuses HistoryEntryCard, FilterSheet, and CalendarPicker from HistoryFlow
   so the two surfaces stay visually identical and the search/filter stack
   is a single source of truth.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Entries dataset spanning multiple time windows. Uses the same shape
      as HistoryFlow's ENTRIES (emoji, title, excerpt, mood, themes) so
      HistoryEntryCard can render them directly. */
const ENTRIES = [
  // THIS WEEK — the current 7 days
  { id: '1', bucket: 'this-week',    date: 'Apr 9', emoji: '👑', title: 'Princess lessons',             excerpt: 'I cannot handle this. I cannot go to princess lessons every day after school.',                    mood: 'frustrated', themes: ['identity', 'family'] },
  { id: '2', bucket: 'this-week',    date: 'Apr 8', emoji: '🏠', title: 'Abuela showed up at the loft', excerpt: 'Abuela showed up at the loft today with Dad in tow. Dad wanted to find out how things went.',       mood: 'calm',       themes: ['family'] },
  { id: '3', bucket: 'this-week',    date: 'Apr 7', emoji: '🌙', title: 'The strangest dream',          excerpt: 'It wasn\u2019t a dream at all. I danced with Daniel Chen and neither of us said a word.',              mood: 'joyful',     themes: ['friendship', 'romance'] },
  { id: '4', bucket: 'this-week',    date: 'Apr 6', emoji: '😭', title: 'Why? Why??',                   excerpt: 'Derek kissed me in front of Teen People and I knew exactly why.',                                      mood: 'angry',      themes: ['romance', 'identity'] },

  // LAST WEEK
  { id: '5', bucket: 'last-week',    date: 'Apr 5', emoji: '🤫', title: 'Okay, I lied',                 excerpt: 'I brought this book anyway. I made Sven carry it. I\u2019m in the bathroom at the Tavern on the Green.', mood: 'anxious',    themes: ['romance'] },
  { id: '6', bucket: 'last-week',    date: 'Apr 4', emoji: '💭', title: 'Waiting for Derek',            excerpt: 'Sitting here in my new dress, my new shoes, my new nails. And there\u2019s no sign of Derek.',          mood: 'nervous',    themes: ['romance'] },
  { id: '7', bucket: 'last-week',    date: 'Apr 3', emoji: '📞', title: 'When I got home',              excerpt: 'The first thing I did was check to make sure Derek hadn\u2019t called to cancel. He hadn\u2019t.',       mood: 'nervous',    themes: ['romance'] },

  // EARLIER THIS MONTH — entries from earlier in April
  { id: '8',  bucket: 'earlier-month', date: 'Apr 2', emoji: '👵', title: 'Abbreviated lesson', excerpt: 'Abuela is impossible. She wants me to walk with a book on my head.',                      mood: 'frustrated', themes: ['family'] },
  { id: '9',  bucket: 'earlier-month', date: 'Apr 1', emoji: '📝', title: 'Resolutions',        excerpt: '1. Be nicer to everyone. 2. Never ever bite my fingernails, even the fake ones.',          mood: 'hopeful',    themes: ['identity'] },

  // MARCH — older entries, grouped as a month
  { id: '10', bucket: 'march', date: 'Mar 28', emoji: '🎭', title: 'The Gala',                       excerpt: 'The cameras. The cameras. There were so many more than I expected.',                      mood: 'anxious', themes: ['identity'] },
  { id: '11', bucket: 'march', date: 'Mar 22', emoji: '✉️', title: 'A letter from Dad',              excerpt: 'Dad wrote and said he was proud of me. I read it four times.',                            mood: 'hopeful', themes: ['family'] },
  { id: '12', bucket: 'march', date: 'Mar 15', emoji: '🪞', title: 'Who is that girl?',              excerpt: 'I looked in the mirror after the makeover and genuinely didn\u2019t recognize myself.',     mood: 'anxious', themes: ['identity'] },
  { id: '13', bucket: 'march', date: 'Mar 8',  emoji: '🤐', title: 'The secret I haven\u2019t told', excerpt: 'I keep meaning to tell Lilly. Every time I open my mouth, something else comes out.',      mood: 'anxious', themes: ['friendship'] },
  { id: '14', bucket: 'march', date: 'Mar 2',  emoji: '🚗', title: 'The Mustang',                    excerpt: 'Dad gave me a car I can\u2019t even drive yet. I don\u2019t know how to feel about it.',    mood: 'calm',    themes: ['family'] },

  // FEBRUARY — winter, Genovia announcement, the beginning of the change
  { id: '15', bucket: 'february', date: 'Feb 26', emoji: '👑', title: 'The announcement',         excerpt: 'Grandmother said the word &ldquo;princess&rdquo; and I waited for the punchline. There wasn\u2019t one.',  mood: 'anxious', themes: ['identity', 'family'] },
  { id: '16', bucket: 'february', date: 'Feb 18', emoji: '🛏️', title: 'Sleepover at Lilly\u2019s', excerpt: 'We stayed up until four watching bad TV. Nothing important. It was perfect.',                             mood: 'joyful',  themes: ['friendship'] },
  { id: '17', bucket: 'february', date: 'Feb 12', emoji: '💐', title: 'Valentines, sort of',      excerpt: 'Josh Richter handed out cards to every girl in class. I didn\u2019t get one. Lilly says I should be glad.', mood: 'nervous', themes: ['romance'] },
  { id: '18', bucket: 'february', date: 'Feb 5',  emoji: '🎒', title: 'Back to school after snow', excerpt: 'The halls smelled like wet coats and I missed my bed.',                                                      mood: 'frustrated', themes: ['school'] },
  { id: '19', bucket: 'february', date: 'Feb 1',  emoji: '❄️', title: 'February is long',        excerpt: 'Four weeks feels like twelve when nothing is happening. I wrote a poem. It was bad.',                         mood: 'calm',    themes: ['identity'] },

  // JANUARY — new year, new attempts, still the old life
  { id: '20', bucket: 'january', date: 'Jan 22', emoji: '🎨', title: 'Mom\u2019s new painting',  excerpt: 'It\u2019s a woman made entirely of windows. I think it\u2019s about her, but I\u2019m not going to ask.',   mood: 'calm',    themes: ['family'] },
  { id: '21', bucket: 'january', date: 'Jan 14', emoji: '📚', title: 'First day back',          excerpt: 'Everyone acted like they hadn\u2019t seen me in years. It had been 10 days.',                             mood: 'nervous', themes: ['school', 'friendship'] },
  { id: '22', bucket: 'january', date: 'Jan 7',  emoji: '🌅', title: 'New year, attempt 24',    excerpt: 'I always make resolutions and I always forget them by February. This year feels different. Probably not.', mood: 'hopeful', themes: ['identity'] },
  { id: '23', bucket: 'january', date: 'Jan 1',  emoji: '📝', title: 'Resolutions 2026',         excerpt: '1. Stop apologizing so much. 2. Be braver. 3. Actually finish a journal for once.',                        mood: 'hopeful', themes: ['identity'] },

  // 2025 — last year, "before Genovia"
  { id: '24', bucket: '2025', date: 'Dec 20', emoji: '🎄', title: 'Winter break begins',       excerpt: 'Two weeks of nothing. I have never wanted nothing more.',                                                  mood: 'joyful',  themes: ['friendship', 'school'] },
  { id: '25', bucket: '2025', date: 'Nov 28', emoji: '🦃', title: 'Thanksgiving with Mom',    excerpt: 'Mom tried to make a turkey. It was a little raw. We had cereal. It was still my favorite Thanksgiving.', mood: 'joyful',  themes: ['family'] },
  { id: '26', bucket: '2025', date: 'Nov 10', emoji: '🎭', title: 'The cast list',            excerpt: 'I got ensemble again. Lilly says I should be glad. I am not.',                                              mood: 'frustrated', themes: ['school'] },
  { id: '27', bucket: '2025', date: 'Oct 15', emoji: '🍂', title: 'A normal Tuesday',         excerpt: 'Walked home with Lilly. Did homework. Watched something. Bed. Normal. I didn\u2019t know to be grateful.', mood: 'calm',    themes: ['friendship'] },
  { id: '28', bucket: '2025', date: 'Sep 3',  emoji: '🍎', title: 'First day of sophomore year', excerpt: 'New shoes. Old nerves. Lilly has a schedule I don\u2019t recognize.',                                      mood: 'nervous', themes: ['school', 'friendship'] },
  { id: '29', bucket: '2025', date: 'Aug 22', emoji: '🌊', title: 'The last summer day',       excerpt: 'I didn\u2019t want to come back yet. I also did. That\u2019s most days, I guess.',                            mood: 'calm',    themes: ['identity'] },
];

/* ── Chapter data with magazine-spread visual treatment.
      Each chapter gets its own color family, decorative icon, and
      gradient — like Anthology's story cards. "this-week" doubles as
      the Story of You entry (book cover treatment). Other chapters
      render as big gradient story cards in a horizontal scroll. */
const CHAPTERS = [
  {
    id: 'this-week',
    label: 'This week',
    eyebrow: 'This week',
    headline: 'A week of second thoughts',
    subtitle: 'Four entries, all about whether to go along or push back.',
    // Sage family — current, alive, present tense
    bgImage: 'linear-gradient(135deg, #D7F2E5 0%, #A8E4C4 100%)',
    detailBgImage:
      'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.55) 0%, transparent 60%), linear-gradient(180deg, #D7F2E5 0%, #A8E4C4 55%, #7AD2A0 100%)',
    textColor: '#191C1A',
    icon: 'leaf',
    iconColor: '#235E4D',
    // Short prose summary shown at the top of the chapter detail for
    // the current week only. Past weeks don't have a prose layer.
    prose: [
      'This week, Ellie was stretched thin. Princess lessons sat heavier than she wanted to admit, and the cameras at the Gala took something out of her.',
      'She kept returning to three things. The gap between being looked at and being seen. How different silence felt with Daniel than with Derek. And whether pushing back on Abuela makes her ungrateful, or just grown.',
    ],
  },
  {
    id: 'last-week',
    label: 'Last week',
    eyebrow: 'Last week',
    headline: 'Waiting rooms',
    subtitle: 'Three entries about bracing for something that hadn\u2019t happened yet.',
    // Purple family — pensive, waiting
    bgImage: 'linear-gradient(135deg, #E8E4F5 0%, #C4A8E8 100%)',
    detailBgImage:
      'radial-gradient(ellipse at 80% 90%, rgba(255,255,255,0.5) 0%, transparent 55%), linear-gradient(145deg, #E8E4F5 0%, #C4A8E8 55%, #9E7FD4 100%)',
    textColor: '#191C1A',
    icon: 'hourglass',
    iconColor: '#4A2F8A',
    prose: [
      'Three entries, all written in anticipation. The phone that might ring. The dress that might be wrong. The version of the evening that hadn\u2019t happened yet.',
      'All three were written from a sitting posture. Still, waiting, rehearsing. Ellie hadn\u2019t done anything yet. She was just getting ready to.',
    ],
  },
  {
    id: 'earlier-month',
    label: 'Earlier this month',
    eyebrow: 'Earlier this month',
    headline: 'New year energy',
    subtitle: 'Two entries at the start of the month, trying to start clean.',
    // Amber family — warmth, fresh start
    bgImage: 'linear-gradient(135deg, #FFEDCF 0%, #FFD68A 100%)',
    detailBgImage:
      'radial-gradient(ellipse at 20% 85%, rgba(255,255,255,0.5) 0%, transparent 55%), linear-gradient(160deg, #FFEDCF 0%, #FFD68A 55%, #FFB854 100%)',
    textColor: '#191C1A',
    icon: 'sparkle',
    iconColor: '#AF730D',
    prose: [
      'The first two entries of April tried to start clean. A list of resolutions on Apr 1, a quiet reset on Apr 2. The tone is hopeful in a way that feels like it\u2019s trying on an outfit.',
      'In retrospect, these entries read like the calm before a month that wanted something else from her.',
    ],
  },
  {
    id: 'march',
    label: 'March',
    eyebrow: 'March',
    headline: 'Learning to be looked at',
    subtitle: 'Five entries about the gala, the makeover, and what it cost.',
    // Rose family — identity, performance, gaze
    bgImage: 'linear-gradient(135deg, #FFE2ED 0%, #FFC2D8 100%)',
    detailBgImage:
      'radial-gradient(ellipse at 75% 15%, rgba(255,255,255,0.5) 0%, transparent 55%), linear-gradient(135deg, #FFE2ED 0%, #FFC2D8 55%, #FF9EBE 100%)',
    textColor: '#191C1A',
    icon: 'eye',
    iconColor: '#A40742',
    prose: [
      'March was about cameras. The kind that record your face, and the kind that record who you\u2019re becoming.',
      'The Gala, the makeover, the Mustang from Dad. Everything this month handed Ellie a version of herself she hadn\u2019t picked, and asked her to wear it.',
    ],
  },
];

/* ── Echoes: entries from different chapters that rhyme thematically.
      The AI layer noticing that the present is speaking to the past.
      Each echo links back to its earlier chapter when tapped. */
const ECHOES = [
  {
    id: 'echo-real',
    title: 'The word &ldquo;real&rdquo;',
    fromChapter: 'march',
    dates: 'Mar 15 \u2194 Apr 7',
    hint: '11 times this week, 2 times last month',
  },
  {
    id: 'echo-cameras',
    title: 'Cameras pointed at you',
    fromChapter: 'march',
    dates: 'Mar 28 \u2194 Apr 6',
    hint: 'Both times, you smiled when you didn\u2019t want to',
  },
  {
    id: 'echo-silence',
    title: 'Silence that felt different',
    fromChapter: 'last-week',
    dates: 'Apr 3 \u2194 Apr 7',
    hint: 'Waiting for Derek vs dancing with Daniel',
  },
];

/* ── Monthly mood summary. Synthetic 12-month rollback traces Ellie's
      arc from spring 2025 (pre-Genovia) to March 2026 (post-gala).
      Each month has:
        - dominant mood (keyed to MOOD_COLORS from HistoryFlow)
        - weeklyArc: 4 mood keys, one per week, that tell the story
          of the month. Used to render the mood-arc gradient bar in
          the archive list. The bar visualizes how the month felt
          week-to-week, not just which mood was dominant.
      Entry counts drive the year-strip segment widths. */
const MONTHLY_MOODS = [
  { key: 'mar-26', month: 'March',     year: '2026', title: 'The gala month',         entries: 22, mood: 'angry',      weeklyArc: ['anxious', 'frustrated', 'angry', 'angry'] },
  { key: 'feb-26', month: 'February',  year: '2026', title: 'Waiting for news',       entries: 18, mood: 'anxious',    weeklyArc: ['calm', 'anxious', 'anxious', 'nervous'] },
  { key: 'jan-26', month: 'January',   year: '2026', title: 'New year, attempt 24',  entries: 15, mood: 'hopeful',    weeklyArc: ['hopeful', 'hopeful', 'calm', 'anxious'] },
  { key: 'dec-25', month: 'December',  year: '2025', title: 'Holiday quiet',          entries: 12, mood: 'calm',       weeklyArc: ['calm', 'joyful', 'calm', 'hopeful'] },
  { key: 'nov-25', month: 'November',  year: '2025', title: 'The cast list',          entries: 14, mood: 'frustrated', weeklyArc: ['hopeful', 'hopeful', 'frustrated', 'frustrated'] },
  { key: 'oct-25', month: 'October',   year: '2025', title: 'Normal, in retrospect',  entries: 17, mood: 'calm',       weeklyArc: ['calm', 'calm', 'joyful', 'calm'] },
  { key: 'sep-25', month: 'September', year: '2025', title: 'Sophomore year begins',  entries: 20, mood: 'nervous',    weeklyArc: ['nervous', 'nervous', 'anxious', 'calm'] },
  { key: 'aug-25', month: 'August',    year: '2025', title: 'The last summer day',    entries: 8,  mood: 'joyful',     weeklyArc: ['joyful', 'joyful', 'joyful', 'sad'] },
  { key: 'jul-25', month: 'July',      year: '2025', title: 'Nights that felt long',  entries: 11, mood: 'joyful',     weeklyArc: ['joyful', 'joyful', 'hopeful', 'joyful'] },
  { key: 'jun-25', month: 'June',      year: '2025', title: 'School lets out',        entries: 16, mood: 'hopeful',    weeklyArc: ['anxious', 'nervous', 'joyful', 'hopeful'] },
  { key: 'may-25', month: 'May',       year: '2025', title: 'Finals week',            entries: 19, mood: 'anxious',    weeklyArc: ['nervous', 'anxious', 'anxious', 'frustrated'] },
  { key: 'apr-25', month: 'April',     year: '2025', title: 'Spring restart',         entries: 13, mood: 'hopeful',    weeklyArc: ['calm', 'hopeful', 'hopeful', 'joyful'] },
];

/* ── Story of You data for the History hero card. Applies to ALL time
      — no period label. Reuses StoryOfYouCard from Anthology so the
      two surfaces stay visually identical.

      The same object is also passed to StoryOfYouTakeover when the
      card is tapped, so `prose` + `readTime` drive the audiobook
      reading experience. */
const STORY_OF_YOU = {
  name: 'Ellie',
  hook: 'She is still figuring out who she wants to be when no one is watching.',
  readTime: '3 min read',
  prose: [
    'Ellie is still in the middle of figuring out who she wants to be. Her entries circle around three things: the gap between being looked at and being seen, how different she feels with different people, and whether she is allowed to want something different from what everyone expects.',
    'She is at her most alive when no one is watching. When she and Daniel do not need to speak. When she writes late at night after the cameras have gone. She is at her most exhausted when she has to perform a version of herself that someone else picked out for her.',
    'The people she returns to most often are the ones who knew her before Genovia existed. Lilly. Her mom. Daniel. The ones she writes about with the most uncertainty are the ones she is still learning how to be around. Abuela. Derek. Her father, still, in his absence.',
    'Her entries have gotten longer over the past eight weeks. Her sentences have gotten more first-person, less performative. She is, slowly, becoming someone she can recognize.',
  ],
};

/* Parse "Apr 9" → 9 for date-range filtering. March entries return NaN
   which correctly excludes them when a date range is active (the picker
   only supports April). */
function parseAprilDay(entry) {
  if (!entry.date.startsWith('Apr ')) return NaN;
  return parseInt(entry.date.replace('Apr ', ''), 10);
}

export function ChaptersFlow({ defaultTab = 'chapters', onSheetOpenChange }) {
  const [tab, setTab] = useState(defaultTab);
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [filters, setFilters] = useState({ moods: [], themes: [], people: [] });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  // Which chapter is open in the detail overlay. null = top level.
  const [openChapterId, setOpenChapterId] = useState(null);
  // Whether the all-time Story of You takeover is open.
  const [storyOfYouOpen, setStoryOfYouOpen] = useState(false);

  // Tell the parent to hide the nav bar when a sheet, chapter detail,
  // or story takeover is open so the overlay covers the full phone viewport.
  useEffect(() => {
    onSheetOpenChange?.(
      calendarOpen || filterSheetOpen || openChapterId !== null || storyOfYouOpen,
    );
  }, [calendarOpen, filterSheetOpen, openChapterId, storyOfYouOpen, onSheetOpenChange]);

  // Full filter stack — text + date + mood + themes — identical to
  // HistoryFlow's logic.
  const filtered = ENTRIES.filter((entry) => {
    if (search) {
      const q = search.toLowerCase();
      if (!entry.title.toLowerCase().includes(q) && !entry.excerpt.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (dateRange.start) {
      const day = parseAprilDay(entry);
      const start = dateRange.start;
      const end = dateRange.end || dateRange.start;
      if (isNaN(day) || day < start || day > end) return false;
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
      <div className="h-full overflow-y-auto px-[16px] pb-[24px] flex flex-col gap-[14px]">
        {/* ── Header ── */}
        <div className="pt-[12px] flex items-start justify-between gap-[12px]">
          <div>
            <h1 className="text-[22px] leading-[28px] font-[700] text-[#191C1A]">History</h1>
            <p className="text-[11px] leading-[14px] font-[450] text-[#8B828B] mt-[2px]">Your journal entries</p>
          </div>
          <button
            className="shrink-0 w-[36px] h-[36px] rounded-full bg-[#F0F0F0] hover:bg-[#E5E5E5] flex items-center justify-center transition-colors"
            aria-label="Bookmarks"
          >
            <svg viewBox="0 0 20 20" fill="none" stroke="#191C1A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
              <path d="M5 3.5A1.5 1.5 0 0 1 6.5 2h7A1.5 1.5 0 0 1 15 3.5V17l-5-3-5 3V3.5Z" />
            </svg>
          </button>
        </div>

        {/* ── Tabs: Entries / Chapters — full width segmented control ── */}
        <div className="flex rounded-[10px] bg-[#F0F0F0] p-[3px]">
          <button
            onClick={() => setTab('entries')}
            className={`flex-1 h-[32px] rounded-[8px] text-[13px] leading-[16px] font-[500] transition-colors cursor-pointer ${
              tab === 'entries' ? 'bg-white text-[#191C1A] shadow-[0_1px_2px_rgba(0,0,0,0.06)]' : 'text-[#6D6C6A]'
            }`}
          >
            Entries
          </button>
          <button
            onClick={() => setTab('chapters')}
            className={`flex-1 h-[32px] rounded-[8px] text-[13px] leading-[16px] font-[500] transition-colors cursor-pointer ${
              tab === 'chapters' ? 'bg-white text-[#191C1A] shadow-[0_1px_2px_rgba(0,0,0,0.06)]' : 'text-[#6D6C6A]'
            }`}
          >
            Chapters
          </button>
        </div>

        {/* ── Search + calendar + filter row — only on Entries tab.
              Chapters is about browsing by AI-grouped time windows, so
              raw search/filter/calendar controls don't add value there. ── */}
        {tab === 'entries' && (
        <>
        <div className="sticky top-0 z-10 -mx-[16px] px-[16px] py-[8px] bg-[#FAFAFA]/95 backdrop-blur-sm flex items-center gap-[8px]">
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
              hasDateFilter ? 'bg-[#191C1A] border-[#191C1A]' : 'bg-[#F8F8F8] border-[#F0F0F0] hover:border-[#C0C0BF]'
            }`}
            aria-label="Filter by date"
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
              activeFilterCount > 0 ? 'bg-[#191C1A] border-[#191C1A]' : 'bg-[#F8F8F8] border-[#F0F0F0] hover:border-[#C0C0BF]'
            }`}
            aria-label="Filters"
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

        {/* ── Active filter chips ── */}
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
        </>
        )}

        {/* ── Body ── */}
        {tab === 'chapters'
          ? <ChaptersView
              entries={filtered}
              onOpenChapter={setOpenChapterId}
              onOpenStoryOfYou={() => setStoryOfYouOpen(true)}
            />
          : <EntriesView entries={filtered} />}
      </div>

      {/* Chapter detail — full-screen takeover overlay when a chapter
          is opened from the Chapters tab */}
      {openChapterId && (
        <ChapterDetail
          chapter={CHAPTERS.find((c) => c.id === openChapterId)}
          entries={filtered.filter((e) => e.bucket === openChapterId)}
          onClose={() => setOpenChapterId(null)}
        />
      )}

      {/* Story of You audiobook takeover — shared component with Anthology.
          Uses all-time prose because History's Story of You is not scoped
          to any timeframe. hidePeriod drops the "· This week" suffix.
          The patternsLabel prop turns on the bridge back to Patterns at
          the end of the reading flow. Anthology doesn't pass it because
          it's already the Patterns surface. */}
      {storyOfYouOpen && (
        <StoryOfYouTakeover
          story={STORY_OF_YOU}
          hidePeriod
          patternsLabel="See patterns across your journal"
          onOpenPatterns={() => {
            // In a real app this would navigate to Patterns. Here we
            // just close the takeover.
            setStoryOfYouOpen(false);
          }}
          onClose={() => setStoryOfYouOpen(false)}
        />
      )}

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
   Local icon set — Lucide-style minimal icons for chapter cards.
   Kept local so ChaptersFlow doesn't have to import from Anthology.
   ══════════════════════════════════════════════════════════ */
function ChapterIcon({ name, className }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.4',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className,
    'aria-hidden': 'true',
  };
  switch (name) {
    case 'eye':
      return (
        <svg {...common}>
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 'hourglass':
      return (
        <svg {...common}>
          <path d="M5 22h14" />
          <path d="M5 2h14" />
          <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
          <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
        </svg>
      );
    case 'sparkle':
      return (
        <svg {...common}>
          <path d="M12 3 L14 10 L21 12 L14 14 L12 21 L10 14 L3 12 L10 10 Z" />
        </svg>
      );
    case 'leaf':
      return (
        <svg {...common}>
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.2 2.96a1 1 0 0 1 1.6.8c0 10-3.4 18.24-9.8 16.24" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6" />
        </svg>
      );
    case 'snowflake':
      return (
        <svg {...common}>
          <line x1="12" y1="2" x2="12" y2="22" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="4.9" y1="4.9" x2="19.1" y2="19.1" />
          <line x1="19.1" y1="4.9" x2="4.9" y2="19.1" />
          <polyline points="8 4 12 8 16 4" />
          <polyline points="16 20 12 16 8 20" />
          <polyline points="4 8 8 12 4 16" />
          <polyline points="20 16 16 12 20 8" />
        </svg>
      );
    case 'sun':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="M4.93 4.93l1.41 1.41" />
          <path d="M17.66 17.66l1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="M4.93 19.07l1.41-1.41" />
          <path d="M17.66 6.34l1.41-1.41" />
        </svg>
      );
    case 'book':
      return (
        <svg {...common}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      );
    default:
      return null;
  }
}

/* ══════════════════════════════════════════════════════════
   Chapters view — magazine spread. Story of You hero + horizontal
   scroll of gradient past-chapter cards + echoes list.
   ══════════════════════════════════════════════════════════ */
function ChaptersView({ entries, onOpenChapter, onOpenStoryOfYou }) {
  // Build the list of chapters that have entries after filtering.
  // Empty chapters auto-hide.
  const visibleChapters = CHAPTERS
    .map((chapter) => ({ chapter, count: entries.filter((e) => e.bucket === chapter.id).length }))
    .filter(({ count }) => count > 0);

  if (visibleChapters.length === 0) {
    return (
      <div className="py-[32px] text-center">
        <span className="text-[13px] font-[450] text-[#8B828B]">No entries match</span>
      </div>
    );
  }

  // Only show echoes that point to a chapter currently visible
  const visibleEchoes = ECHOES.filter((e) =>
    visibleChapters.some(({ chapter }) => chapter.id === e.fromChapter),
  );

  return (
    <div className="flex flex-col gap-[24px]">
      {/* Story of You — reuses the exact Anthology card. Pass the
          STORY_OF_YOU object without a period so the card shows no
          time-scope label. Tapping opens the audiobook takeover. */}
      <StoryOfYouCard study={STORY_OF_YOU} onOpen={onOpenStoryOfYou} />

      {visibleChapters.length > 0 && (
        <div className="flex flex-col gap-[10px]">
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#8B828B]">
              Key chapters
            </span>
            <span className="text-[10px] leading-[13px] font-[500] text-[#8B828B]">Swipe &rarr;</span>
          </div>
          {/* Horizontal scroll of gradient story cards — Anthology-style */}
          <div className="-mx-[16px] px-[16px] overflow-x-auto">
            <div className="flex gap-[10px] w-max pb-[4px]">
              {visibleChapters.map(({ chapter, count }) => (
                <PastChapterCard
                  key={chapter.id}
                  chapter={chapter}
                  count={count}
                  onOpen={() => onOpenChapter(chapter.id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Monthly archive — year dropdown + line chart per row ── */}
      <MonthlyArchiveList />

      {visibleEchoes.length > 0 && (
        <div className="flex flex-col gap-[6px]">
          <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#8B828B]">
            Echoes across chapters
          </span>
          <div className="flex flex-col">
            {visibleEchoes.map((echo, i) => (
              <button
                key={echo.id}
                onClick={() => onOpenChapter(echo.fromChapter)}
                className={`text-left py-[12px] flex items-center justify-between gap-[12px] hover:opacity-70 transition-opacity ${
                  i > 0 ? 'border-t border-[#F0F0F0]' : ''
                }`}
              >
                <div className="min-w-0 flex-1">
                  <h3
                    className="text-[13px] leading-[18px] font-[700] text-[#191C1A] tracking-[-0.005em]"
                    dangerouslySetInnerHTML={{ __html: echo.title }}
                  />
                  <span className="text-[10px] leading-[13px] font-[500] text-[#8B828B] block mt-[3px]">
                    {echo.dates} &middot; {echo.hint}
                  </span>
                </div>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#8B828B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-[12px] h-[12px] shrink-0"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* Story of You hero card is imported from ResultsV2Anthology — same
   visual component, different data. In History we omit `period`
   so the card shows the book cover without the time-scope label. */

/* ── Past chapter card: big gradient story card, Anthology-style ── */
function PastChapterCard({ chapter, count, onOpen }) {
  return (
    <button
      onClick={onOpen}
      style={{ backgroundImage: chapter.bgImage }}
      className="relative overflow-hidden shrink-0 w-[200px] h-[220px] rounded-[18px] p-[16px] flex flex-col justify-end text-left hover:scale-[1.01] transition-transform cursor-pointer"
    >
      {/* Decorative tilted icon, cropping off the top-left corner */}
      {chapter.icon && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-[44px] -left-[44px] w-[180px] h-[180px] opacity-15 -rotate-[14deg]"
          style={{ color: chapter.iconColor || chapter.textColor }}
        >
          <ChapterIcon name={chapter.icon} className="w-full h-full" />
        </div>
      )}
      <span
        className="relative text-[10px] leading-[13px] font-[600] tracking-[0.06em] uppercase block mb-[8px] opacity-70"
        style={{ color: chapter.textColor }}
      >
        {chapter.eyebrow} &middot; {count} {count === 1 ? 'entry' : 'entries'}
      </span>
      <span
        className="relative text-[19px] leading-[24px] font-[700] tracking-[-0.01em] block"
        style={{ color: chapter.textColor }}
      >
        {chapter.headline}
      </span>
      <span
        className="relative text-[11px] leading-[14px] font-[500] block mt-[6px] opacity-70"
        style={{ color: chapter.textColor }}
      >
        {chapter.subtitle}
      </span>
    </button>
  );
}

/* ══════════════════════════════════════════════════════════
   Monthly archive — vertical list, year-scoped, with a mini
   mood-trend line chart per row and a minimalist tone key
   above the list. Max 12 entries per year (one per month).
   ══════════════════════════════════════════════════════════ */

// Tone palette — same draining / mixed / nourishing convention used
// on the Patterns Results surface (PeopleInStory, etc.) so the key
// below reads as a shared visual language instead of reinventing one.
const TONE_COLORS = {
  draining: '#E31665',
  mixed: '#E4AD51',
  nourishing: '#5ABA9D',
};

// Each mood from MOOD_COLORS maps to one of the three tones. Positive
// moods (joyful, hopeful, calm) = nourishing, ambiguous/activated
// moods (anxious, nervous) = mixed, hard moods (frustrated, angry,
// sad) = draining.
const MOOD_TO_TONE = {
  joyful: 'nourishing',
  hopeful: 'nourishing',
  calm: 'nourishing',
  anxious: 'mixed',
  nervous: 'mixed',
  frustrated: 'draining',
  angry: 'draining',
  sad: 'draining',
};

// Y-axis score per mood — used to place each week's dot on the
// micro line chart. Higher = more positive, lower = more negative.
const MOOD_SCORE = {
  joyful: 0.95,
  hopeful: 0.82,
  calm: 0.68,
  anxious: 0.42,
  nervous: 0.52,
  frustrated: 0.22,
  angry: 0.1,
  sad: 0.15,
};

/* Micro mood-trend line chart for one month. Takes a 4-week mood
   array (weeklyArc) and draws a tiny 80x24 SVG polyline where each
   segment transitions color via a horizontal gradient — same pattern
   as the per-person detail chart in ResultsV2Anthology, scaled down.
   The gradient ID has to be unique per instance so multiple charts
   can render on the same page without cross-referencing defs. */
function MiniMoodChart({ weeklyArc, chartId }) {
  const w = 80;
  const h = 24;
  const padX = 6;
  const padY = 4;
  const plotH = h - padY * 2;
  const stepX = (w - padX * 2) / Math.max(weeklyArc.length - 1, 1);

  const points = weeklyArc.map((mood, i) => ({
    x: padX + i * stepX,
    y: padY + plotH - (MOOD_SCORE[mood] ?? 0.5) * plotH,
    tone: MOOD_TO_TONE[mood] || 'mixed',
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(' ');

  const gradId = `mini-mood-${chartId}`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="shrink-0"
      style={{ width: w, height: h }}
      aria-label={`Mood trend: ${weeklyArc.join(', ')}`}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
          {points.map((p, i) => {
            const offset = ((p.x - padX) / (w - padX * 2)) * 100;
            return (
              <stop key={i} offset={`${offset}%`} stopColor={TONE_COLORS[p.tone]} />
            );
          })}
        </linearGradient>
      </defs>
      <path
        d={pathD}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="1.8"
          fill={TONE_COLORS[p.tone]}
          stroke="white"
          strokeWidth="0.8"
        />
      ))}
    </svg>
  );
}

function MonthlyArchiveList() {
  // Year dropdown state. Default to the most recent year that has
  // the most months of data (2025, which covers Apr–Dec = 9 months).
  const years = [...new Set(MONTHLY_MOODS.map((m) => m.year))].sort(
    (a, b) => Number(b) - Number(a),
  );
  const [year, setYear] = useState('2025');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const visible = MONTHLY_MOODS.filter((m) => m.year === year);

  return (
    <div className="flex flex-col gap-[10px]">
      {/* Title row — title left, year dropdown right. No more
          "Option A" eyebrow; the title stands on its own. */}
      <div className="flex items-center justify-between gap-[12px]">
        <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#8B828B]">
          The full archive
        </span>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="inline-flex items-center gap-[4px] px-[10px] py-[5px] rounded-full border border-[#DEDEDE] bg-white text-[11px] leading-[14px] font-[600] text-[#191C1A] hover:border-[#C0C0BF] transition-colors cursor-pointer"
          >
            {year}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[10px] h-[10px]">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {dropdownOpen && (
            <>
              {/* Click-outside backdrop */}
              <button
                onClick={() => setDropdownOpen(false)}
                className="fixed inset-0 z-10 cursor-default"
                aria-label="Close dropdown"
              />
              <div className="absolute right-0 top-[calc(100%+4px)] z-20 min-w-[88px] rounded-[10px] border border-[#EDEDED] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] py-[4px]">
                {years.map((y) => (
                  <button
                    key={y}
                    onClick={() => {
                      setYear(y);
                      setDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-[12px] py-[6px] text-[11px] leading-[14px] font-[500] transition-colors ${
                      y === year
                        ? 'text-[#191C1A] bg-[#F5F5F5]'
                        : 'text-[#6D6C6A] hover:bg-[#FAFAFA]'
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tone key — three-dot legend matching the draining / mixed /
          nourishing convention from the Patterns Results surface so
          we don't reinvent the color language per screen. */}
      <div className="flex items-center gap-[14px] pb-[4px] border-b border-[#F0F0F0]">
        {['draining', 'mixed', 'nourishing'].map((tone) => (
          <div key={tone} className="flex items-center gap-[5px]">
            <span
              className="w-[7px] h-[7px] rounded-full"
              style={{ backgroundColor: TONE_COLORS[tone] }}
            />
            <span className="text-[10px] leading-[13px] font-[500] text-[#8B828B] capitalize">
              {tone}
            </span>
          </div>
        ))}
      </div>

      {/* The list — filtered to the selected year, max 12 rows */}
      <div className="flex flex-col">
        {visible.map((m, i) => (
          <button
            key={m.key}
            className={`w-full text-left py-[12px] flex items-center justify-between gap-[12px] hover:opacity-70 transition-opacity ${
              i > 0 ? 'border-t border-[#F0F0F0]' : ''
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-[6px] mb-[2px]">
                <span className="text-[12px] leading-[15px] font-[700] tracking-[-0.005em] text-[#191C1A]">
                  {m.month}
                </span>
                <span className="text-[10px] leading-[13px] font-[500] text-[#C0C0BF]">
                  {m.year}
                </span>
              </div>
              <p className="text-[11px] leading-[15px] font-[450] text-[#6D6C6A] truncate">
                {m.title} &middot; {m.entries} {m.entries === 1 ? 'entry' : 'entries'}
              </p>
            </div>
            <MiniMoodChart weeklyArc={m.weeklyArc} chartId={m.key} />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ChapterDetail — full-screen takeover with a full-bleed gradient
   hero header matching the card's color family. Magazine-spread
   editorial treatment: big eyebrow, big headline, tilted icon
   decoration. Falls back to a neutral cream hero for chapters
   that have no gradient (e.g. "this week" / Story of You).
   ══════════════════════════════════════════════════════════ */
function ChapterDetail({ chapter, entries, onClose }) {
  const hasGradient = !!chapter.detailBgImage;
  const textColor = chapter.textColor || '#191C1A';

  return (
    <div className="absolute inset-0 z-20 bg-[#FAFAFA] flex flex-col">
      {/* Full-bleed gradient hero — magazine header */}
      <div
        className="shrink-0 relative overflow-hidden"
        style={
          hasGradient
            ? { backgroundImage: chapter.detailBgImage }
            : {
                backgroundImage:
                  'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.6) 0%, transparent 60%), linear-gradient(180deg, #FFF6E8 0%, #FFEDCF 100%)',
              }
        }
      >
        {/* Decorative tilted icon, cropping off the corner */}
        {chapter.icon && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-[40px] -right-[40px] w-[200px] h-[200px] opacity-15 rotate-[12deg]"
            style={{ color: chapter.iconColor || textColor }}
          >
            <ChapterIcon name={chapter.icon} className="w-full h-full" />
          </div>
        )}

        {/* Back button */}
        <div className="relative pt-[16px] px-[16px]">
          <button
            onClick={onClose}
            className="w-[32px] h-[32px] rounded-full bg-white/60 backdrop-blur-sm hover:bg-white/80 flex items-center justify-center transition-colors"
            aria-label="Back"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke={textColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>

        {/* Hero content — eyebrow + headline + subtitle */}
        <div className="relative px-[20px] pt-[24px] pb-[28px]">
          <span
            className="text-[10px] leading-[13px] font-[700] tracking-[0.1em] uppercase block mb-[10px] opacity-70"
            style={{ color: textColor }}
          >
            {chapter.label} &middot; {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </span>
          <h1
            className="text-[26px] leading-[32px] font-[700] tracking-[-0.015em] mb-[8px]"
            style={{ color: textColor }}
          >
            {chapter.headline}
          </h1>
          <p
            className="text-[13px] leading-[19px] font-[450] opacity-75"
            style={{ color: textColor }}
          >
            {chapter.subtitle}
          </p>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 min-h-0 overflow-y-auto px-[16px] pt-[16px] pb-[16px]">
        {/* Prose summary — only for chapters that have it (this week).
            Uses a distinct eyebrow ("The throughline") from the audiobook
            Story of You card so the two concepts don't collide. */}
        {chapter.prose && (
          <div className="mb-[20px] rounded-[14px] bg-gradient-to-br from-[#FFF6E8] via-[#FFFBF2] to-[#FFFFFF] border border-[#F0E8D8] p-[16px] flex flex-col gap-[10px]">
            <span className="text-[10px] leading-[13px] font-[700] tracking-[0.08em] uppercase text-[#AF730D]">
              The throughline
            </span>
            {chapter.prose.map((paragraph, i) => (
              <p key={i} className="text-[12px] leading-[18px] font-[450] text-[#4A3818]">
                {paragraph}
              </p>
            ))}
          </div>
        )}

        {/* Entry list */}
        <div className="mb-[16px]">
          <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#8B828B] px-[2px] block mb-[10px]">
            Entries
          </span>
          <div className="flex flex-col gap-[8px]">
            {entries.map((entry) => (
              <HistoryEntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      </div>

      {/* Sticky footer — bridge to Patterns */}
      <div className="shrink-0 px-[16px] py-[12px] border-t border-[#F0F0F0] bg-white">
        <button className="w-full h-[40px] rounded-[10px] bg-[#191C1A] text-white text-[13px] leading-[18px] font-[500] flex items-center justify-center gap-[6px] hover:opacity-90 transition-opacity">
          See patterns from {chapter.label.toLowerCase()}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-[13px] h-[13px]">
            <path d="M5 12h14" />
            <path d="M13 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Entries view — raw chronological archive, no AI layer.
   This is the product default. Reuses HistoryEntryCard.
   ══════════════════════════════════════════════════════════ */
function EntriesView({ entries }) {
  return (
    <div className="flex flex-col gap-[8px]">
      {entries.length === 0 ? (
        <div className="py-[32px] text-center">
          <span className="text-[13px] font-[450] text-[#8B828B]">No entries match</span>
        </div>
      ) : (
        entries.map((entry) => <HistoryEntryCard key={entry.id} entry={entry} />)
      )}
    </div>
  );
}
