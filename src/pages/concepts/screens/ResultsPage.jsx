import { useState } from 'react';

/* ═══════════════════════════════════════════════════════════════════════════
   Results Page — Ellie's Patterns & Insights
   Rebuilt with a disciplined color system (memory panel is the only accent
   card) and data-viz-led tabs instead of text-heavy lists.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Data model ── */
const ELLIE = {
  memoryProfile: [
    'You process by writing at length, then reach clarity in the last third.',
    'You\'re more critical of yourself than of others, often by a wide margin.',
    'You return to your mom every 6-8 days, usually in a conflicted frame.',
    'You use humor to deflect when something feels too close.',
    'Your clearest insights come right after you\'ve been assertive with someone.',
    'You tend to minimize before you assert ("I\'m not even that cute, but...").',
    'You notice when someone sees you — not for your status, but for you.',
  ],
  weekSummary: {
    period: 'Apr 3 – Apr 9',
    stats: {
      entries: 9,
      words: 13146,
      streak: 31,
    },
    narrative:
      'This week the same dynamic from mid-March resurfaced: the gap between what you wanted people to see and what they actually saw. On Apr 6 you wrote about Derek kissing you for the cameras, and the language echoed what you wrote on Mar 18 about the press ambush. This time you pushed back.',
    moodArc: [
      { day: 'Fr', label: 'Apr 4', mood: 'anticipating', score: 7 },
      { day: 'Sa', label: 'Apr 5', mood: 'disappointed', score: 4 },
      { day: 'Su', label: 'Apr 6', mood: 'angry', score: 2, key: true },
      { day: 'Mo', label: 'Apr 7', mood: 'joyful', score: 9, key: true },
      { day: 'Tu', label: 'Apr 8', mood: 'calm', score: 7 },
      { day: 'We', label: 'Apr 9', mood: 'frustrated', score: 4 },
    ],
    // Emotion composition for the week (percentages sum to ~100)
    emotionMix: [
      { label: 'Joyful', pct: 18, valence: 'pos' },
      { label: 'Hopeful', pct: 14, valence: 'pos' },
      { label: 'Anxious', pct: 22, valence: 'mix' },
      { label: 'Frustrated', pct: 16, valence: 'mix' },
      { label: 'Angry', pct: 18, valence: 'neg' },
      { label: 'Sad', pct: 12, valence: 'neg' },
    ],
    threads: [
      {
        title: 'The gap between performance and being seen',
        excerpt: 'All I felt was embarrassed. I wasn\'t getting the warm gushy feeling everyone talks about.',
        fromEntries: 3,
        dates: ['Apr 5', 'Apr 6', 'Apr 7'],
      },
      {
        title: 'Finding your voice with people who\'ve known you',
        excerpt: 'I couldn\'t say which I liked better, talking to Daniel or dancing with him.',
        fromEntries: 2,
        dates: ['Apr 7', 'Apr 9'],
      },
      {
        title: 'Pushing back on Abuela',
        excerpt: 'I\'m telling him. I\'m telling him the truth. He\'s going to be really mad at you, Abuela.',
        fromEntries: 2,
        dates: ['Apr 3', 'Apr 9'],
      },
    ],
    fromPast: [
      {
        thisWeekDate: 'Apr 6',
        pastDate: 'Mar 18',
        connection:
          'Both days, you described being "dragged" through public attention. In March, by your grandmother. This week, by Derek. The language is almost identical.',
        pastExcerpt: 'Sven gave me his handkerchief. It was just like I was a murderer, or a celebrity, or something.',
      },
      {
        thisWeekDate: 'Apr 7',
        pastDate: 'Mar 17',
        connection:
          'You described what made Daniel feel real to you. You chose "real" over "perfect" then, and again this week.',
        pastExcerpt: 'Daniel is a real person. Derek is like a movie star. You don\'t tell movie stars your most embarrassing secrets.',
      },
    ],
    keyMoments: [
      {
        date: 'Apr 6',
        emoji: '😭',
        title: 'The dance and the kiss',
        excerpt: 'I know you didn\'t kiss me because you like me. You just kissed me because I\'m the princess of Marcania.',
        wordCount: 3311,
        significance: 'First time you confronted someone about using you for your status.',
      },
      {
        date: 'Apr 7',
        emoji: '🌙',
        title: 'Dance with Daniel',
        excerpt: 'Neither of us said a word. But the minute the song was over Daniel started talking again.',
        wordCount: 2083,
        significance: 'First moment of silence that felt full, not empty.',
      },
    ],
  },
  evolution: {
    // Words per week for the growth sparkline
    wordsPerWeek: [
      { week: 'W1', words: 1800 },
      { week: 'W2', words: 3200 },
      { week: 'W3', words: 5400 },
      { week: 'W4', words: 9100 },
      { week: 'W5', words: 13146 },
    ],
    comparedToFourWeeksAgo: [
      {
        label: 'Self-assertion',
        before: '"I couldn\'t help feeling bad"',
        after: '"I don\'t need you. I can get my own publicity."',
        delta: 'From internalizing to naming.',
      },
      {
        label: 'Words per entry',
        before: '~300',
        after: '~1,500',
        delta: 'Sitting longer before reframing.',
      },
      {
        label: 'Use of "I should"',
        before: '9 uses',
        after: '2 uses',
        delta: 'Less judgment, more curiosity.',
      },
    ],
    // Theme activity across 5 weeks (0-4 intensity)
    themeActivity: [
      { theme: 'Hiding identity',       weeks: [4, 4, 2, 1, 0] },
      { theme: 'Authority pushback',    weeks: [0, 1, 2, 3, 4] },
      { theme: 'Authentic connection',  weeks: [1, 2, 2, 3, 4] },
      { theme: 'Self-minimizing',       weeks: [4, 3, 3, 2, 2] },
      { theme: 'Performance vs. self',  weeks: [2, 3, 4, 4, 3] },
    ],
    movedPast: [
      { theme: 'Wanting to hide the princess identity', lastSeen: 'Mar 19' },
      { theme: 'Trying to change Zoe\'s mind about Derek', lastSeen: 'Mar 31' },
    ],
    stillAlive: [
      'What "authentic" means with people who knew you before',
      'Navigating Abuela\'s expectations without losing yourself',
      'The distance between who you are and who you\'re performing',
    ],
    growthMoments: [
      {
        date: 'Mar 17',
        title: 'Chose Priya over Ashley',
        excerpt: 'I told Priya we needed to stick together. Everyone else at this stupid school is completely NUTS.',
        why: 'First friendship you picked on your own terms.',
      },
      {
        date: 'Mar 26',
        title: 'Confronted Abuela about the press',
        excerpt: 'You\'re the one who told all that stuff to Diana Gutierrez.',
        why: 'First time you held an authority figure accountable.',
      },
      {
        date: 'Apr 6',
        title: 'Walked away from Derek',
        excerpt: 'I turned my back on him and walked out.',
        why: 'First time you left a moment instead of freezing.',
      },
    ],
    vocabShifts: [
      {
        concept: 'How you describe yourself',
        before: '"I\'m not even that cute" (Mar 15)',
        after: '"I look better than I ever have" (Apr 4)',
      },
      {
        concept: 'How you talk about Mom',
        before: '"My mom wouldn\'t let me" (3 weeks ago)',
        after: '"My mom is convinced. Nothing will change her mind." (this week)',
      },
    ],
  },
  patterns: {
    themes: [
      { label: 'Being seen vs. being used', frequency: 11, emoji: '👁️' },
      { label: 'Performance vs. authenticity', frequency: 9, emoji: '🎭' },
      { label: 'Authority & pushback', frequency: 7, emoji: '⚡' },
      { label: 'Loneliness in a crowd', frequency: 6, emoji: '🌀' },
      { label: 'First kisses & first times', frequency: 5, emoji: '💫' },
      { label: 'Humor as deflection', frequency: 5, emoji: '🎪' },
    ],
    people: [
      { name: 'Abuela', mentions: 14, valence: 'complicated', note: 'Resisting her expectations.' },
      { name: 'Mom', mentions: 12, valence: 'warm-conflicted', note: 'You defend her more than she defends herself.' },
      { name: 'Zoe', mentions: 11, valence: 'repairing', note: 'Fighting, silence, reconciliation this week.' },
      { name: 'Priya', mentions: 10, valence: 'warm', note: 'Friendship that started when you stopped ranking.' },
      { name: 'Daniel', mentions: 9, valence: 'warm', note: 'Small physical details. Smells like soap.' },
      { name: 'Derek', mentions: 8, valence: 'distanced', note: 'Dramatic words, never small details.' },
    ],
  },
  challenges: [
    {
      type: 'Contradiction',
      body: 'On Mar 29 you wrote "Derek Thompson asked me out!!!" On Apr 6: "I have no intention of doing anything with Derek, ever again." Both felt completely true in the moment. Worth sitting with what shifted.',
    },
    {
      type: 'Avoidance',
      body: 'You\'ve mentioned your dad 17 times in the last month, but only in logistics (he said yes, he said no, he called). You haven\'t written about how you feel about him.',
    },
    {
      type: 'Self-talk',
      body: 'The most common adjective when you describe yourself this month is "stupid." That came up 6 times, always right before you did something assertive.',
    },
    {
      type: 'Recurring loop',
      body: 'Third time you\'ve written "I\'m never going to figure this princess thing out" in similar language. You may be circling what acceptance actually looks like.',
    },
  ],
};

/* ═══════════════════════════════════════════════════════════
   Chart helpers
   ═══════════════════════════════════════════════════════════ */

/* Hero mood arc — full-bleed, rose-tinted area, inflection labels */
function MoodArcChart({ data }) {
  const padX = 20;
  const padTop = 32;
  const padBot = 32;
  const w = 328;
  const h = 180;
  const plotH = h - padTop - padBot;
  const maxScore = 10;
  const stepX = (w - padX * 2) / (data.length - 1);

  const points = data.map((d, i) => ({
    x: padX + i * stepX,
    y: padTop + plotH - (d.score / maxScore) * plotH,
    ...d,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaPath = `${linePath} L${points[points.length - 1].x},${padTop + plotH} L${points[0].x},${padTop + plotH} Z`;

  const moodColor = (score) => {
    if (score >= 7) return '#5ABA9D';
    if (score >= 4) return '#E4AD51';
    return '#E31665';
  };

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: h }}>
      <defs>
        <linearGradient id="resArcGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E31665" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#E31665" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#resArcGrad)" />
      <path d={linePath} fill="none" stroke="#191C1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={p.key ? 6 : 3.5} fill={moodColor(p.score)} stroke="#FFFFFF" strokeWidth="2.5" />
          {p.key && (
            <text
              x={p.x}
              y={p.score >= 6 ? p.y - 14 : p.y + 22}
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
              fill={moodColor(p.score)}
            >
              {p.mood}
            </text>
          )}
          <text x={p.x} y={h - 10} textAnchor="middle" fontSize="9" fontWeight="500" fill="#8B828B">
            {p.day}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* Emotion composition — horizontal stacked bar */
function EmotionMixBar({ data }) {
  const colors = {
    pos: '#5ABA9D',
    mix: '#E4AD51',
    neg: '#E31665',
  };
  return (
    <div className="flex flex-col gap-[10px]">
      {/* Stacked bar */}
      <div className="flex w-full h-[14px] rounded-full overflow-hidden">
        {data.map((e, i) => (
          <div
            key={i}
            className="h-full"
            style={{
              width: `${e.pct}%`,
              backgroundColor: colors[e.valence],
            }}
            title={`${e.label} ${e.pct}%`}
          />
        ))}
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-x-[10px] gap-y-[4px]">
        {data.map((e, i) => (
          <div key={i} className="flex items-center gap-[5px]">
            <span
              className="w-[7px] h-[7px] rounded-full"
              style={{ backgroundColor: colors[e.valence] }}
            />
            <span className="text-[11px] leading-[14px] font-[500] text-[#191C1A]">{e.label}</span>
            <span className="text-[11px] leading-[14px] font-[450] text-[#8B828B]">{e.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Word count sparkline — simple SVG showing growth */
function WordCountSparkline({ data }) {
  const w = 296;
  const h = 70;
  const padX = 16;
  const padY = 10;
  const plotH = h - padY * 2;
  const maxWords = Math.max(...data.map(d => d.words));
  const stepX = (w - padX * 2) / (data.length - 1);

  const points = data.map((d, i) => ({
    x: padX + i * stepX,
    y: padY + plotH - (d.words / maxWords) * plotH,
    ...d,
  }));
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaPath = `${linePath} L${points[points.length - 1].x},${padY + plotH} L${points[0].x},${padY + plotH} Z`;

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: h }}>
        <defs>
          <linearGradient id="wordSparkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5ABA9D" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#5ABA9D" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#wordSparkGrad)" />
        <path d={linePath} fill="none" stroke="#5ABA9D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="#5ABA9D" stroke="#FFFFFF" strokeWidth="1.5" />
        ))}
      </svg>
      <div className="flex justify-between mt-[2px] px-[16px]">
        {data.map((d, i) => (
          <span key={i} className="text-[10px] leading-[13px] font-[500] text-[#8B828B]">{d.week}</span>
        ))}
      </div>
    </div>
  );
}

/* Theme activity heatmap — intensity grid */
function ThemeActivityHeatmap({ themes, weekLabels = ['W1', 'W2', 'W3', 'W4', 'W5'] }) {
  const shade = (intensity) => {
    const alpha = intensity / 4;
    return `rgba(25, 28, 26, ${0.08 + alpha * 0.72})`;
  };
  return (
    <div className="flex flex-col gap-[6px]">
      <div className="grid grid-cols-[112px_repeat(5,1fr)] gap-[3px] items-center">
        <div />
        {weekLabels.map((w, i) => (
          <div key={i} className="text-center text-[9px] leading-[12px] font-[500] text-[#8B828B]">
            {w}
          </div>
        ))}
      </div>
      {themes.map((t, i) => (
        <div key={i} className="grid grid-cols-[112px_repeat(5,1fr)] gap-[3px] items-center">
          <span className="text-[11px] leading-[14px] font-[500] text-[#191C1A] truncate pr-[4px]">
            {t.theme}
          </span>
          {t.weeks.map((intensity, wi) => (
            <div
              key={wi}
              className="aspect-square rounded-[3px]"
              style={{ backgroundColor: shade(intensity) }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/* People mention bar chart */
function PeopleBarChart({ people }) {
  const maxMentions = Math.max(...people.map(p => p.mentions));
  const valenceColor = {
    warm: '#5ABA9D',
    'warm-conflicted': '#E4AD51',
    complicated: '#E4AD51',
    distanced: '#8B828B',
    repairing: '#7CC4AF',
  };
  return (
    <div className="flex flex-col gap-[8px]">
      {people.map((p, i) => {
        const color = valenceColor[p.valence] || '#8B828B';
        const width = (p.mentions / maxMentions) * 100;
        return (
          <button key={i} className="w-full text-left flex flex-col gap-[4px] group">
            <div className="flex items-center justify-between">
              <span className="text-[13px] leading-[17px] font-[600] text-[#191C1A]">{p.name}</span>
              <span className="text-[11px] leading-[14px] font-[500] text-[#8B828B]">{p.mentions}</span>
            </div>
            <div className="h-[6px] w-full rounded-full bg-[#F0F0F0] overflow-hidden">
              <div
                className="h-full rounded-full transition-all group-hover:opacity-80"
                style={{ width: `${width}%`, backgroundColor: color }}
              />
            </div>
            <span className="text-[11px] leading-[14px] font-[450] text-[#6D6C6A]">{p.note}</span>
          </button>
        );
      })}
    </div>
  );
}

/* Theme bubble cluster — frequency-sized */
function ThemeBubbleCluster({ themes }) {
  const max = Math.max(...themes.map(t => t.frequency));
  const min = Math.min(...themes.map(t => t.frequency));
  const sizeFor = (freq) => {
    // Map frequency to font size between 11-17px
    const ratio = (freq - min) / (max - min || 1);
    return 11 + ratio * 6;
  };
  return (
    <div className="flex flex-wrap gap-[8px]">
      {themes.map((t, i) => {
        const size = sizeFor(t.frequency);
        return (
          <button
            key={i}
            className="inline-flex items-center gap-[6px] px-[12px] py-[8px] rounded-full bg-[#FAFAFA] border border-[#F0F0F0] hover:border-[#C0C0BF] transition-colors"
          >
            <span style={{ fontSize: `${size}px` }}>{t.emoji}</span>
            <span
              className="font-[500] text-[#191C1A] leading-[17px]"
              style={{ fontSize: `${size}px` }}
            >
              {t.label}
            </span>
            <span className="text-[10px] leading-[13px] font-[500] text-[#8B828B]">{t.frequency}</span>
          </button>
        );
      })}
    </div>
  );
}

/* Section header */
function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="flex flex-col gap-[4px]">
      {eyebrow && (
        <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#8B828B]">
          {eyebrow}
        </span>
      )}
      <h2 className="text-[17px] leading-[23px] font-[700] text-[#191C1A]">{title}</h2>
      {description && (
        <p className="text-[12px] leading-[17px] font-[450] text-[#6D6C6A] mt-[2px]">{description}</p>
      )}
    </div>
  );
}

/* Entry date chip */
function EntryChip({ date }) {
  return (
    <span className="inline-flex items-center gap-[4px] px-[8px] py-[3px] rounded-full bg-[#F0F0F0] text-[11px] leading-[14px] font-[500] text-[#6D6C6A] hover:bg-[#E5E5E5] transition-colors">
      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-[9px] h-[9px]">
        <path d="M5 2v6m0 0l-2-2m2 2l2-2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 10h8" strokeLinecap="round" />
      </svg>
      {date}
    </span>
  );
}

/* Memory panel (warm ivory — the only accent card) */
function MemoryPanel({ profile }) {
  return (
    <div className="bg-gradient-to-br from-[#FFF6E8] to-[#FFEDCF] rounded-[14px] p-[16px] flex flex-col gap-[12px]">
      <div className="flex items-center gap-[6px]">
        <span className="text-[14px]">✨</span>
        <span className="text-[11px] leading-[14px] font-[600] tracking-[0.08em] uppercase text-[#AF730D]">
          What I've learned about you
        </span>
      </div>
      <div className="flex flex-col gap-[8px]">
        {profile.slice(0, 5).map((line, i) => (
          <div key={i} className="flex items-start gap-[8px]">
            <span className="shrink-0 w-[4px] h-[4px] rounded-full bg-[#D28D1A] mt-[8px]" />
            <p className="text-[13px] leading-[19px] font-[450] text-[#5C4300]">{line}</p>
          </div>
        ))}
      </div>
      <button className="self-start text-[11px] leading-[14px] font-[500] text-[#AF730D] underline underline-offset-2">
        + {profile.length - 5} more
      </button>
    </div>
  );
}

/* Standard card — soft tinted surface, no hard border */
function Card({ children, className = '' }) {
  return (
    <div className={`bg-[#FAFAFA] rounded-[16px] p-[16px] ${className}`}>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   RESULTS PAGE — 4 tabs (This Week / Evolution / Patterns / Challenge)
   ══════════════════════════════════════════════════════════ */
export function ResultsPage() {
  const d = ELLIE;
  const [activeTab, setActiveTab] = useState('week');

  const tabs = [
    { id: 'week', label: 'This Week' },
    { id: 'evolution', label: 'Evolution' },
    { id: 'patterns', label: 'Patterns' },
    { id: 'challenge', label: 'Challenge' },
  ];

  return (
    <div className="px-[16px] pt-[12px] pb-[32px] flex flex-col gap-[16px]">
      {/* Header with period + settings */}
      <div className="flex items-start justify-between gap-[12px]">
        <div>
          <h1 className="text-[22px] leading-[28px] font-[700] text-[#191C1A]">Your Patterns</h1>
          <p className="text-[11px] leading-[14px] font-[450] text-[#8B828B] mt-[2px]">{d.weekSummary.period} · Week 5 of 5</p>
        </div>
        <button
          className="shrink-0 w-[36px] h-[36px] rounded-full bg-[#F0F0F0] hover:bg-[#E5E5E5] flex items-center justify-center transition-colors"
          title="Edit pattern preferences"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="#191C1A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        </button>
      </div>

      {/* Tab bar */}
      <div className="sticky top-0 -mx-[16px] px-[16px] py-[6px] bg-white/95 backdrop-blur-sm z-10">
        <div className="flex bg-[#F0F0F0] rounded-[10px] p-[3px]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-[7px] rounded-[8px] text-[11px] leading-[15px] font-[500] transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-[#191C1A] shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                  : 'text-[#8B828B]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ THIS WEEK ═══ */}
      {activeTab === 'week' && (
        <div className="flex flex-col gap-[20px]">
          <MemoryPanel profile={d.memoryProfile} />

          {/* ── Hero: full-bleed mood arc + big stat ── */}
          <div className="-mx-[4px]">
            <div className="flex items-baseline justify-between px-[4px] mb-[2px]">
              <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#8B828B]">
                Emotional arc
              </span>
              <div className="flex items-baseline gap-[4px]">
                <span className="text-[24px] leading-[28px] font-[700] text-[#5ABA9D] tracking-[-0.02em]">+3</span>
                <span className="text-[9px] leading-[12px] font-[500] tracking-[0.06em] uppercase text-[#8B828B]">vs last week</span>
              </div>
            </div>
            <MoodArcChart data={d.weekSummary.moodArc} />
          </div>

          {/* ── Quiet stats row ── */}
          <div className="grid grid-cols-3 gap-[12px] pt-[4px] pb-[8px] border-y border-[#F0F0F0]">
            {[
              { value: d.weekSummary.stats.entries, label: 'Entries' },
              { value: '13.1k', label: 'Words' },
              { value: `${d.weekSummary.stats.streak}d`, label: 'Streak' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center py-[8px]">
                <span className="text-[26px] leading-[30px] font-[700] text-[#191C1A] tracking-[-0.02em]">
                  {s.value}
                </span>
                <span className="text-[9px] leading-[12px] font-[600] tracking-[0.08em] uppercase text-[#8B828B] mt-[2px]">
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* ── Theme of the week — editorial pull quote ── */}
          <div className="flex flex-col gap-[10px]">
            <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#8B828B]">
              Theme of the week
            </span>
            <h2 className="text-[20px] leading-[26px] font-[700] text-[#191C1A] tracking-[-0.01em]">
              The gap between performance and being seen
            </h2>
            <p className="text-[15px] leading-[23px] font-[450] italic text-[#6D6C6A]">
              &ldquo;All I felt was embarrassed. I wasn&apos;t getting the warm gushy feeling everyone talks about.&rdquo;
            </p>
            <p className="text-[12px] leading-[17px] font-[450] text-[#8B828B]">
              {d.weekSummary.narrative}
            </p>
          </div>

          {/* Other threads — skipping the first (it's the theme of the week above) */}
          <div>
            <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#8B828B] block mb-[10px]">
              Also on your mind
            </span>
            <div className="flex flex-col gap-[10px]">
              {d.weekSummary.threads.slice(1).map((t, i) => (
                <div key={i} className="flex flex-col gap-[6px]">
                  <span className="text-[14px] leading-[19px] font-[600] text-[#191C1A]">{t.title}</span>
                  <p className="text-[13px] leading-[20px] font-[450] italic text-[#6D6C6A]">
                    &ldquo;{t.excerpt}&rdquo;
                  </p>
                  <div className="flex items-center gap-[4px] flex-wrap">
                    <span className="text-[10px] leading-[13px] font-[500] text-[#8B828B]">From {t.fromEntries} entries:</span>
                    {t.dates.map((date) => <EntryChip key={date} date={date} />)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* From your past — echoes across time */}
          <div>
            <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#8B828B] block mb-[8px]">
              From your past
            </span>
            <div className="flex flex-col gap-[8px]">
              {d.weekSummary.fromPast.map((item, i) => (
                <button key={i} className="w-full text-left">
                  <Card className="flex flex-col gap-[10px] hover:bg-[#F5F5F5] transition-colors">
                    <div className="flex items-center gap-[6px]">
                      <span className="w-[6px] h-[6px] rounded-full bg-[#E31665]" />
                      <span className="text-[10px] leading-[13px] font-[700] tracking-[0.08em] uppercase text-[#E31665]">
                        Echo
                      </span>
                      <span className="text-[10px] leading-[13px] font-[500] text-[#8B828B] ml-auto">
                        {item.thisWeekDate} &middot; {item.pastDate}
                      </span>
                    </div>
                    <p className="text-[13px] leading-[19px] font-[450] text-[#191C1A]">{item.connection}</p>
                    <span className="text-[10px] leading-[13px] font-[500] text-[#8B828B]">Tap to read both &rarr;</span>
                  </Card>
                </button>
              ))}
            </div>
          </div>

          {/* Key moments */}
          <div>
            <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#8B828B] block mb-[8px]">
              Key moments
            </span>
            <div className="flex flex-col gap-[8px]">
              {d.weekSummary.keyMoments.map((m, i) => (
                <button key={i} className="w-full text-left">
                  <Card className="flex flex-col gap-[6px] hover:border-[#C0C0BF] transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-[8px] min-w-0">
                        <span className="text-[16px] shrink-0">{m.emoji}</span>
                        <span className="text-[14px] leading-[19px] font-[600] text-[#191C1A] truncate">{m.title}</span>
                      </div>
                      <span className="text-[11px] leading-[14px] font-[500] text-[#8B828B] shrink-0">{m.date}</span>
                    </div>
                    <p className="text-[12px] leading-[17px] font-[450] text-[#6D6C6A]">
                      {m.significance}
                    </p>
                  </Card>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ EVOLUTION ═══ */}
      {activeTab === 'evolution' && (
        <div className="flex flex-col gap-[16px]">
          <SectionHeader
            eyebrow="Evolution"
            title="How you've changed"
            description="Last 4 weeks vs. the 4 before that."
          />

          {/* Word count sparkline */}
          <Card>
            <div className="flex items-baseline justify-between mb-[4px]">
              <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#8B828B]">
                Writing expansion
              </span>
              <span className="text-[11px] leading-[14px] font-[600] text-[#5ABA9D]">+630%</span>
            </div>
            <WordCountSparkline data={d.evolution.wordsPerWeek} />
          </Card>

          {/* Compared to 4 weeks ago — simplified inline deltas */}
          <Card>
            <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#8B828B] block mb-[12px]">
              Then vs. now
            </span>
            <div className="flex flex-col gap-[12px]">
              {d.evolution.comparedToFourWeeksAgo.map((item, i) => (
                <div key={i} className="flex flex-col gap-[4px]">
                  <span className="text-[12px] leading-[16px] font-[600] text-[#191C1A]">{item.label}</span>
                  <div className="flex items-start gap-[8px]">
                    <span className="text-[13px] leading-[18px] font-[450] italic text-[#8B828B] flex-1">{item.before}</span>
                    <svg viewBox="0 0 16 16" fill="none" stroke="#5ABA9D" strokeWidth="2" className="w-[12px] h-[12px] shrink-0 mt-[3px]">
                      <path d="M3 8h10m-4-4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-[13px] leading-[18px] font-[500] text-[#191C1A] flex-1">{item.after}</span>
                  </div>
                  <span className="text-[11px] leading-[14px] font-[450] text-[#5ABA9D]">{item.delta}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Theme activity heatmap */}
          <Card>
            <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#8B828B] block mb-[12px]">
              Theme activity over 5 weeks
            </span>
            <ThemeActivityHeatmap themes={d.evolution.themeActivity} />
          </Card>

          {/* Moved past / still alive */}
          <div className="grid grid-cols-2 gap-[8px]">
            <Card className="flex flex-col gap-[8px]">
              <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#8B828B]">
                Moved past
              </span>
              {d.evolution.movedPast.map((t, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-[12px] leading-[16px] font-[500] text-[#191C1A]">{t.theme}</span>
                  <span className="text-[10px] leading-[13px] font-[450] text-[#8B828B]">Last: {t.lastSeen}</span>
                </div>
              ))}
            </Card>
            <Card className="flex flex-col gap-[8px]">
              <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#8B828B]">
                Still alive
              </span>
              {d.evolution.stillAlive.map((t, i) => (
                <span key={i} className="text-[12px] leading-[16px] font-[500] text-[#191C1A]">
                  {t}
                </span>
              ))}
            </Card>
          </div>

          {/* Growth moments */}
          <div>
            <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#8B828B] block mb-[10px]">
              Growth moments
            </span>
            <div className="relative">
              <div className="absolute left-[7px] top-[6px] bottom-[6px] w-[2px] bg-[#E5E5E5]" />
              <div className="flex flex-col gap-[12px]">
                {d.evolution.growthMoments.map((m, i) => (
                  <div key={i} className="flex gap-[10px] items-start">
                    <div className="relative shrink-0 w-[16px] h-[16px] rounded-full bg-[#5ABA9D] ring-[3px] ring-white mt-[2px]" />
                    <Card className="flex-1">
                      <div className="flex items-center justify-between mb-[4px]">
                        <span className="text-[13px] leading-[17px] font-[600] text-[#191C1A]">{m.title}</span>
                        <EntryChip date={m.date} />
                      </div>
                      <p className="text-[13px] leading-[19px] font-[450] italic text-[#6D6C6A] mb-[4px]">
                        &ldquo;{m.excerpt}&rdquo;
                      </p>
                      <p className="text-[11px] leading-[14px] font-[450] text-[#8B828B]">{m.why}</p>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Vocab shifts */}
          <div>
            <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#8B828B] block mb-[8px]">
              Language shifts
            </span>
            <div className="flex flex-col gap-[8px]">
              {d.evolution.vocabShifts.map((v, i) => (
                <Card key={i}>
                  <span className="text-[12px] leading-[16px] font-[600] text-[#191C1A] block mb-[6px]">{v.concept}</span>
                  <p className="text-[12px] leading-[17px] font-[450] italic text-[#8B828B] mb-[2px]">{v.before}</p>
                  <p className="text-[12px] leading-[17px] font-[450] italic text-[#191C1A]">{v.after}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ PATTERNS ═══ */}
      {activeTab === 'patterns' && (
        <div className="flex flex-col gap-[16px]">
          <SectionHeader
            eyebrow="Patterns"
            title="Themes & people"
            description="What keeps showing up across your entries."
          />

          {/* Theme bubble cluster */}
          <Card>
            <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#8B828B] block mb-[10px]">
              Recurring themes
            </span>
            <ThemeBubbleCluster themes={d.patterns.themes} />
          </Card>

          {/* People bar chart */}
          <Card>
            <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#8B828B] block mb-[12px]">
              People in your story
            </span>
            <PeopleBarChart people={d.patterns.people} />
          </Card>
        </div>
      )}

      {/* ═══ CHALLENGE ═══ */}
      {activeTab === 'challenge' && (
        <div className="flex flex-col gap-[16px]">
          <SectionHeader
            eyebrow="Challenge me"
            title="What you might not be seeing"
            description="Things I noticed. Gently."
          />
          <div className="flex flex-col gap-[8px]">
            {d.challenges.map((c, i) => (
              <Card key={i} className="flex flex-col gap-[6px]">
                <div className="flex items-center gap-[6px]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#E31665" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[12px] h-[12px]">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[#8B828B]">
                    {c.type}
                  </span>
                </div>
                <p className="text-[13px] leading-[19px] font-[450] text-[#191C1A]">{c.body}</p>
                <button className="self-start text-[11px] leading-[14px] font-[500] text-[#E31665] mt-[2px]">
                  Explore this →
                </button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-center gap-[6px] pt-[8px] opacity-40">
        <img src="/favicon-rosebud.svg" alt="" className="w-[12px] h-[12px]" />
        <span className="text-[9px] leading-[12px] font-[500] text-[#8B828B]">Rosebud Patterns & Insights</span>
      </div>
    </div>
  );
}
