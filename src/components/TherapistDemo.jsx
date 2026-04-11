import { useState, forwardRef, useImperativeHandle } from 'react';
import { Avatar } from './Avatar';

/* ── Sample patients ── */
const PATIENTS = [
  {
    id: 'ellie',
    name: 'Ellie Rodriguez',
    age: 14,
    nextSession: 'Tomorrow, 3:00 PM',
    entries: 9,
    streak: 31,
    lastEntry: 'Today',
    startedTherapy: 'Jan 2026',
    diagnosis: 'Adjustment Disorder',
    frequency: 'Weekly',
  },
  {
    id: 'marcus',
    name: 'Marcus Webb',
    age: 32,
    nextSession: 'Thu, 11:00 AM',
    entries: 4,
    streak: 12,
    lastEntry: '2 days ago',
    startedTherapy: 'Sep 2025',
    diagnosis: 'GAD',
    frequency: 'Biweekly',
  },
  {
    id: 'sarah',
    name: 'Sarah Kim',
    age: 27,
    nextSession: 'Fri, 2:30 PM',
    entries: 6,
    streak: 8,
    lastEntry: 'Yesterday',
    startedTherapy: 'Mar 2026',
    diagnosis: 'Social Anxiety',
    frequency: 'Weekly',
  },
];

/* ── Ellie's weekly summary (derived from journal data) ── */
const WEEKLY_SUMMARY = {
  period: 'Apr 1 – Apr 9',
  moodArc: [
    { day: 'Tu', label: 'Apr 1', mood: 'hopeful', score: 7, event: 'Resolutions list' },
    { day: 'We', label: 'Apr 2', mood: 'anxious', score: 5, event: 'Sleepover at Priya\'s' },
    { day: 'Th', label: 'Apr 3', mood: 'nervous', score: 4, event: 'Parents vs. Derek' },
    { day: 'Fr', label: 'Apr 4', mood: 'excited', score: 7, event: 'Waiting for Derek' },
    { day: 'Sa', label: 'Apr 5', mood: 'disappointed', score: 3, event: 'Date goes wrong' },
    { day: 'Su', label: 'Apr 6', mood: 'angry', score: 1.5, event: 'First kiss betrayal' },
    { day: 'Mo', label: 'Apr 7', mood: 'joyful', score: 9, event: 'Dance with Daniel' },
    { day: 'Tu', label: 'Apr 8', mood: 'calm', score: 7, event: 'Abuela visits' },
    { day: 'We', label: 'Apr 9', mood: 'frustrated', score: 3.5, event: 'Princess lessons' },
  ],
  topThemes: [
    { label: 'Identity & Self-Worth', count: 8, emoji: '🪞' },
    { label: 'Romantic Relationships', count: 7, emoji: '💝' },
    { label: 'Family Dynamics', count: 6, emoji: '👪' },
    { label: 'Peer Pressure', count: 5, emoji: '🎭' },
    { label: 'Authenticity vs. Performance', count: 4, emoji: '🎪' },
  ],
  aiSummary:
    'Ellie experienced a significant emotional arc this week, centered around her first date and first kiss with Derek Thompson. The week began with hopeful anticipation but culminated in a pivotal moment of self-assertion when she confronted Derek for using her princess status for publicity. This represents meaningful growth in her ability to set boundaries and trust her instincts over external validation.',
  suggestedTopics: [
    {
      title: 'Boundary-setting with Derek',
      detail: 'Ellie publicly confronted Derek after he kissed her for cameras. She recognized the manipulation despite strong attraction. Explore what helped her trust that instinct.',
      urgency: 'high',
    },
    {
      title: 'Navigating public identity',
      detail: 'Continued distress about princess identity being public. Tension between wanting normalcy and accepting her role. Her dad told her "you can\'t quit being who you are."',
      urgency: 'medium',
    },
    {
      title: 'Friendship repair with Zoe',
      detail: 'Zoe apologized for being controlling and admitted to a "borderline authoritarian personality disorder." They reconciled at the dance. This is the first time Zoe has taken accountability.',
      urgency: 'medium',
    },
    {
      title: 'Emerging feelings for Daniel',
      detail: 'After the Derek disappointment, Ellie slow-danced with Daniel Chen and discovered a deeper connection. She noted he "smells like soap" vs. Derek\'s Drakkar Noir. Worth exploring what she\'s learning about what she actually wants.',
      urgency: 'low',
    },
  ],
  riskFlags: [
    'Expressed "I hate my life" in latest entry, monitor for persistence',
    'Increased family conflict (parents fighting, Abuela pressure)',
  ],
  lastSessionNotes:
    'Ellie is making progress recognizing when others are trying to use her status. Last session we explored the tension between wanting to be liked for herself vs. as a princess. She identified a pattern: people who knew her before (Zoe, Daniel) feel safer than new attention (Ashley, Derek). Homework was to notice one moment this week where she chose authenticity over approval. She clearly did that at the dance, though in a more dramatic way than expected. Next session: follow up on how that confrontation felt in her body, and whether she can access that assertiveness in lower-stakes situations too.',
};

/* ── Patient profile data ── */
const PATIENT_PROFILE = {
  emotionalLandscape: {
    dominant: [
      { emotion: 'Anxiety', pct: 34, color: '#E4AD51' },
      { emotion: 'Frustration', pct: 22, color: '#D6165B' },
      { emotion: 'Hope', pct: 18, color: '#5ABA9D' },
      { emotion: 'Joy', pct: 14, color: '#7CC4AF' },
      { emotion: 'Sadness', pct: 12, color: '#A40742' },
    ],
    trend: 'Anxiety trending down 8% over 4 weeks. Joy mentions increased 2x since friendship with Priya began.',
  },
  behavioralCallouts: [
    {
      label: 'Self-deprecation before breakthroughs',
      detail: 'Consistently minimizes herself ("I\'m not even that cute") right before moments of assertiveness. May be a protective mechanism.',
      since: 'Mar 12',
      trend: 'stable',
    },
    {
      label: 'Humor as deflection',
      detail: 'Uses absurd humor (Marcanian national guard, psychic powers) when most anxious. Increases under family stress.',
      since: 'Mar 15',
      trend: 'increasing',
    },
    {
      label: 'Authentic vs. performed connection',
      detail: 'Gravitates toward people who see "the real me." Chose Priya over Ashley, recognized Derek\'s superficiality, drawn to Daniel.',
      since: 'Mar 17',
      trend: 'improving',
    },
    {
      label: 'Avoidance through journaling',
      detail: 'Retreats to journal during family conflict (headphones + writing). Functional coping but may limit direct communication.',
      since: 'Mar 19',
      trend: 'stable',
    },
  ],
  therapeuticTrends: [
    { week: 'W1', label: 'Mar 10–16', selfAwareness: 3, assertiveness: 2, relationships: 4 },
    { week: 'W2', label: 'Mar 17–23', selfAwareness: 5, assertiveness: 3, relationships: 5 },
    { week: 'W3', label: 'Mar 24–30', selfAwareness: 5, assertiveness: 4, relationships: 6 },
    { week: 'W4', label: 'Mar 31–Apr 6', selfAwareness: 7, assertiveness: 7, relationships: 7 },
    { week: 'W5', label: 'Apr 7–9', selfAwareness: 7, assertiveness: 6, relationships: 8 },
  ],
  notes: [
    {
      id: 1,
      date: 'Apr 2, 2026',
      sessionDate: 'Apr 2',
      type: 'session',
      content: 'Discussed Derek asking her to the dance. Ellie was elated but showed awareness that his motives might be tied to her status. We explored what "being liked for me" means to her. She listed qualities she values: honesty, humor, remembering small things. Assigned homework: notice one moment of choosing authenticity over approval.',
      aiSummary: 'Session focused on romantic expectations vs. reality. Ellie shows growing capacity for critical evaluation of others\' motives, but still struggles with self-worth independent of external validation. Key progress: she could articulate what genuine connection looks like.',
    },
    {
      id: 2,
      date: 'Mar 26, 2026',
      sessionDate: 'Mar 26',
      type: 'session',
      content: 'Ellie confronted Abuela about calling the press. Major session. She was shaking while telling me about it. First time she\'s stood up to an authority figure directly. We processed the fear and the pride she felt afterward. Also discussed the ongoing conflict between her parents about Mr. Rivera.',
      aiSummary: 'Breakthrough session around assertiveness with authority figures. Confronting Abuela represents a significant developmental milestone. Ellie is beginning to differentiate her own needs from family expectations. The parent conflict remains a background stressor she monitors but feels powerless over.',
    },
    {
      id: 3,
      date: 'Mar 19, 2026',
      sessionDate: 'Mar 19',
      type: 'session',
      content: 'Post-revelation session. Ellie\'s identity as princess is now public. She feels exposed and overwhelmed. Used most of the session to process the loss of anonymity. She said "I can\'t go back to being just Ellie Rodriguez anymore." Explored grief for her former identity. Parents fighting about the leak.',
      aiSummary: 'Crisis processing session following public exposure. Ellie is grieving loss of her previous identity and autonomy. She shows resilience through humor but underlying distress is significant. Family system is destabilized by the exposure, adding to her burden.',
    },
  ],
  weeklyNoteSummary:
    'Across the last 3 sessions, Ellie has shown a clear trajectory from crisis processing (identity exposure) through assertiveness building (confronting Abuela) to independent judgment (evaluating Derek\'s motives). The therapeutic alliance is strong. She brings genuine material and is increasingly willing to sit with discomfort rather than deflect. Key areas to continue: 1) Helping her internalize that assertiveness is available to her in everyday moments, not just crises. 2) Processing the parent conflict she\'s absorbing. 3) Supporting her as she navigates what genuine connection looks like in friendships and romance.',
};

/* ══════════════════════════════════════════════════════════
   Improved Emotional Arc — SVG line chart with area fill
   ══════════════════════════════════════════════════════════ */
function EmotionalArcChart({ data, height = 120 }) {
  const padX = 24;
  const padTop = 16;
  const padBot = 28;
  const w = 296;
  const plotH = height - padTop - padBot;
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
    return '#C50C51';
  };

  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ height }}>
      {/* Grid lines */}
      {[2, 4, 6, 8].map((v) => {
        const y = padTop + plotH - (v / maxScore) * plotH;
        return (
          <line key={v} x1={padX} y1={y} x2={w - padX} y2={y} stroke="#F0F0F0" strokeWidth="1" />
        );
      })}

      {/* Area fill with gradient */}
      <defs>
        <linearGradient id="arcGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5ABA9D" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#C50C51" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#arcGrad)" />

      {/* Line */}
      <path d={linePath} fill="none" stroke="#191C1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Data points and labels */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4.5" fill={moodColor(p.score)} stroke="#FFFFFF" strokeWidth="2" />
          {/* Day label */}
          <text x={p.x} y={height - 6} textAnchor="middle" fontSize="9" fontWeight="500" fill="#8B828B">
            {p.day}
          </text>
          {/* Mood label on hover-ish: show for extremes */}
          {(p.score <= 2 || p.score >= 8.5) && (
            <text
              x={p.x}
              y={p.y - 10}
              textAnchor="middle"
              fontSize="8"
              fontWeight="500"
              fill={moodColor(p.score)}
            >
              {p.mood}
            </text>
          )}
        </g>
      ))}

      {/* Y-axis labels */}
      <text x={padX - 4} y={padTop + 4} textAnchor="end" fontSize="8" fill="#C0C0BF">High</text>
      <text x={padX - 4} y={padTop + plotH + 3} textAnchor="end" fontSize="8" fill="#C0C0BF">Low</text>
    </svg>
  );
}

/* ── Therapeutic Trends mini multi-line chart ── */
function TherapeuticTrendsChart({ data }) {
  const h = 100;
  const padX = 28;
  const padTop = 8;
  const padBot = 22;
  const w = 296;
  const plotH = h - padTop - padBot;
  const maxVal = 10;
  const stepX = (w - padX * 2) / (data.length - 1);

  const series = [
    { key: 'selfAwareness', label: 'Self-awareness', color: '#5ABA9D' },
    { key: 'assertiveness', label: 'Assertiveness', color: '#D6165B' },
    { key: 'relationships', label: 'Relationships', color: '#E4AD51' },
  ];

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: h }}>
        {/* Grid lines */}
        {[2.5, 5, 7.5].map((v) => {
          const y = padTop + plotH - (v / maxVal) * plotH;
          return <line key={v} x1={padX} y1={y} x2={w - padX} y2={y} stroke="#F0F0F0" strokeWidth="1" />;
        })}

        {series.map((s) => {
          const pts = data.map((d, i) => ({
            x: padX + i * stepX,
            y: padTop + plotH - (d[s.key] / maxVal) * plotH,
          }));
          const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
          return (
            <g key={s.key}>
              <path d={path} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              {pts.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="3" fill={s.color} stroke="#FFFFFF" strokeWidth="1.5" />
              ))}
            </g>
          );
        })}

        {/* X labels */}
        {data.map((d, i) => (
          <text key={i} x={padX + i * stepX} y={h - 4} textAnchor="middle" fontSize="8" fontWeight="500" fill="#8B828B">
            {d.week}
          </text>
        ))}
      </svg>
      <div className="flex items-center justify-center gap-[12px] mt-[4px]">
        {series.map((s) => (
          <div key={s.key} className="flex items-center gap-[4px]">
            <span className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-[10px] leading-[14px] text-[#8B828B]">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Emotion bar chart ── */
function EmotionBars({ emotions }) {
  const max = Math.max(...emotions.map((e) => e.pct));
  return (
    <div className="flex flex-col gap-[8px]">
      {emotions.map((e, i) => (
        <div key={i} className="flex items-center gap-[8px]">
          <span className="text-[12px] leading-[17px] font-[450] text-[#6D6C6A] w-[72px] text-right shrink-0">
            {e.emotion}
          </span>
          <div className="flex-1 h-[14px] bg-[#F8F8F8] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${(e.pct / max) * 100}%`, backgroundColor: e.color }}
            />
          </div>
          <span className="text-[11px] leading-[16px] font-[500] text-[#8B828B] w-[28px]">
            {e.pct}%
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Urgency dot ── */
function UrgencyDot({ level }) {
  const colors = { high: '#C50C51', medium: '#E4AD51', low: '#5ABA9D' };
  return (
    <span
      className="inline-block w-[8px] h-[8px] rounded-full shrink-0 mt-[6px]"
      style={{ backgroundColor: colors[level] || '#C0C0BF' }}
    />
  );
}

/* ── Trend arrow ── */
function TrendBadge({ trend }) {
  const config = {
    improving: { label: 'Improving', color: '#235E4D', bg: '#F0FFF4' },
    stable: { label: 'Stable', color: '#6D6C6A', bg: '#F8F8F8' },
    increasing: { label: 'Increasing', color: '#AF730D', bg: '#FFF6E8' },
  };
  const c = config[trend] || config.stable;
  return (
    <span
      className="text-[10px] leading-[14px] font-[500] px-[6px] py-[2px] rounded-full"
      style={{ color: c.color, backgroundColor: c.bg }}
    >
      {c.label}
    </span>
  );
}

/* ── Sticky header shared component ── */
function StickyHeader({ onBack, left, right, children }) {
  return (
    <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm px-[16px] py-[10px] flex items-center gap-[10px] border-b border-[#F0F0F0]">
      <button onClick={onBack} className="p-[4px] -ml-[4px]">
        <svg viewBox="0 0 24 24" fill="none" stroke="#191C1A" strokeWidth="2" className="w-[20px] h-[20px]">
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SCREEN: Patient List
   ══════════════════════════════════════════════════════════ */
function PatientListScreen({ onSelect }) {
  return (
    <div className="px-[16px] pt-[8px] pb-[24px]">
      <div className="flex items-center justify-between mb-[20px]">
        <div>
          <p className="text-[13px] leading-[18px] font-[450] text-[#8B828B]">Good morning</p>
          <h1 className="text-[22px] leading-[30px] font-[700] text-[#191C1A]">Dr. Patel</h1>
        </div>
        <div className="w-[36px] h-[36px] rounded-full bg-[#5ABA9D] flex items-center justify-center">
          <span className="text-[14px] font-[700] text-white">DP</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-[12px]">
        <span className="text-[15px] leading-[21px] font-[500] text-[#191C1A]">Upcoming sessions</span>
        <span className="text-[13px] leading-[18px] font-[450] text-[#8B828B]">{PATIENTS.length} patients</span>
      </div>

      <div className="flex flex-col gap-[10px]">
        {PATIENTS.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p)}
            className="w-full text-left bg-[#FFFFFF] rounded-[14px] p-[14px] border border-[#F0F0F0] flex items-center gap-[12px] active:scale-[0.98] transition-transform"
          >
            <Avatar name={p.name} size="lg" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[16px] leading-[22px] font-[500] text-[#191C1A]">{p.name}</span>
                {p.id === 'ellie' && <span className="w-[8px] h-[8px] rounded-full bg-[#C50C51]" />}
              </div>
              <p className="text-[13px] leading-[18px] font-[450] text-[#8B828B] mt-[2px]">{p.nextSession}</p>
              <div className="flex items-center gap-[12px] mt-[6px]">
                <span className="text-[12px] leading-[17px] font-[450] text-[#6D6C6A]">{p.entries} entries this week</span>
                <span className="text-[12px] leading-[17px] font-[450] text-[#6D6C6A]">🔥 {p.streak}</span>
                <span className="text-[12px] leading-[17px] font-[450] text-[#8B828B]">Last: {p.lastEntry}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-[6px] mt-[24px] opacity-40">
        <img src="/favicon-rosebud.svg" alt="" className="w-[14px] h-[14px]" />
        <span className="text-[11px] leading-[16px] font-[500] text-[#8B828B]">Rosebud for Therapists</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SCREEN: Weekly Summary (detail page)
   ══════════════════════════════════════════════════════════ */
function WeeklySummaryScreen({ patient, onBack, onOpenProfile }) {
  const s = WEEKLY_SUMMARY;
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);

  return (
    <div className="pb-[24px]">
      <StickyHeader onBack={onBack}>
        <button onClick={onOpenProfile} className="shrink-0">
          <Avatar name={patient.name} size="sm" />
        </button>
        <div className="flex-1 min-w-0">
          <span className="text-[15px] leading-[21px] font-[500] text-[#191C1A]">{patient.name}</span>
          <p className="text-[11px] leading-[16px] font-[450] text-[#8B828B]">Weekly Summary · {s.period}</p>
        </div>
      </StickyHeader>

      <div className="px-[16px] pt-[16px] flex flex-col gap-[16px]">
        {/* Emotional Arc — improved SVG line chart */}
        <div className="bg-[#FFFFFF] rounded-[14px] p-[14px] border border-[#F0F0F0]">
          <div className="flex items-center justify-between mb-[4px]">
            <span className="text-[15px] leading-[21px] font-[500] text-[#191C1A]">Emotional Arc</span>
            <span className="text-[11px] leading-[16px] font-[450] text-[#8B828B]">This week</span>
          </div>
          <EmotionalArcChart data={s.moodArc} />
          {/* Clickable event timeline below chart */}
          <div className="mt-[8px] flex flex-col gap-[4px]">
            {s.moodArc.filter((d) => d.score <= 2 || d.score >= 8.5).map((d, i) => {
              const moodColor = d.score >= 7 ? '#5ABA9D' : d.score >= 4 ? '#E4AD51' : '#C50C51';
              return (
                <div key={i} className="flex items-center gap-[6px]">
                  <span className="w-[6px] h-[6px] rounded-full shrink-0" style={{ backgroundColor: moodColor }} />
                  <span className="text-[11px] leading-[16px] font-[450] text-[#6D6C6A]">
                    <span className="font-[500] text-[#191C1A]">{d.label}:</span> {d.event}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between mt-[8px]">
            <div className="flex items-center gap-[4px]">
              <span className="w-[6px] h-[6px] rounded-full bg-[#5ABA9D]" />
              <span className="text-[10px] text-[#8B828B]">Positive</span>
            </div>
            <div className="flex items-center gap-[4px]">
              <span className="w-[6px] h-[6px] rounded-full bg-[#E4AD51]" />
              <span className="text-[10px] text-[#8B828B]">Mixed</span>
            </div>
            <div className="flex items-center gap-[4px]">
              <span className="w-[6px] h-[6px] rounded-full bg-[#C50C51]" />
              <span className="text-[10px] text-[#8B828B]">Distressed</span>
            </div>
          </div>
        </div>

        {/* AI Summary of journal entries */}
        <div className="bg-[#F0FFF4] rounded-[14px] p-[14px] border border-[#C2E6DB]">
          <div className="flex items-center gap-[6px] mb-[8px]">
            <span className="text-[14px]">✨</span>
            <span className="text-[13px] leading-[18px] font-[500] text-[#235E4D]">AI Summary</span>
          </div>
          <p className="text-[14px] leading-[20px] font-[450] text-[#235E4D]">{s.aiSummary}</p>
        </div>

        {/* Risk flags */}
        {s.riskFlags.length > 0 && (
          <div className="bg-[#FFF6E8] rounded-[14px] p-[14px] border border-[#FAD8A1]">
            <div className="flex items-center gap-[6px] mb-[8px]">
              <span className="text-[14px]">⚠️</span>
              <span className="text-[13px] leading-[18px] font-[500] text-[#AF730D]">Flags to Monitor</span>
            </div>
            <div className="flex flex-col gap-[6px]">
              {s.riskFlags.map((flag, i) => (
                <p key={i} className="text-[13px] leading-[18px] font-[450] text-[#AF730D] pl-[4px]">· {flag}</p>
              ))}
            </div>
          </div>
        )}

        {/* Your Notes from Last Session — AI summary */}
        <div className="bg-[#FFFFFF] rounded-[14px] p-[14px] border border-[#F0F0F0]">
          <div className="flex items-center gap-[6px] mb-[8px]">
            <svg viewBox="0 0 24 24" fill="none" stroke="#191C1A" strokeWidth="2" className="w-[14px] h-[14px]">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 2v6h6M16 13H8m8 4H8m2-8H8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[13px] leading-[18px] font-[500] text-[#191C1A]">Your Notes — Last Session</span>
            <span className="text-[11px] leading-[16px] font-[450] text-[#8B828B] ml-auto">Apr 2</span>
          </div>
          <p className="text-[13px] leading-[19px] font-[450] text-[#6D6C6A]">{s.lastSessionNotes}</p>
        </div>

        {/* Suggested Topics */}
        <div>
          <span className="text-[15px] leading-[21px] font-[500] text-[#191C1A] mb-[10px] block">
            Suggested Topics for Session
          </span>
          <div className="flex flex-col gap-[8px]">
            {s.suggestedTopics.map((topic, i) => (
              <button
                key={i}
                onClick={() => setExpandedTopic(expandedTopic === i ? null : i)}
                className="w-full text-left bg-[#FFFFFF] rounded-[12px] p-[12px] border border-[#F0F0F0] transition-all"
              >
                <div className="flex items-start gap-[8px]">
                  <UrgencyDot level={topic.urgency} />
                  <div className="flex-1 min-w-0">
                    <span className="text-[14px] leading-[20px] font-[500] text-[#191C1A]">{topic.title}</span>
                    {expandedTopic === i && (
                      <p className="text-[13px] leading-[18px] font-[450] text-[#6D6C6A] mt-[6px]">{topic.detail}</p>
                    )}
                  </div>
                  <svg
                    viewBox="0 0 24 24" fill="none" stroke="#C0C0BF" strokeWidth="2"
                    className={`w-[16px] h-[16px] shrink-0 mt-[2px] transition-transform ${expandedTopic === i ? 'rotate-180' : ''}`}
                  >
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Top Themes */}
        <div>
          <span className="text-[15px] leading-[21px] font-[500] text-[#191C1A] mb-[10px] block">Top Themes</span>
          <div className="flex flex-wrap gap-[8px]">
            {s.topThemes.map((theme, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-[4px] px-[10px] py-[6px] rounded-full bg-[#F8F8F8] text-[13px] leading-[18px] font-[450] text-[#191C1A]"
              >
                <span>{theme.emoji}</span>
                {theme.label}
                <span className="text-[#8B828B] ml-[2px]">({theme.count})</span>
              </span>
            ))}
          </div>
        </div>

        {/* Privacy footer */}
        <div className="flex items-center justify-center gap-[6px] mt-[8px] opacity-40">
          <svg viewBox="0 0 20 20" fill="#8B828B" className="w-[12px] h-[12px]">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span className="text-[10px] leading-[14px] font-[450] text-[#8B828B]">Shared with patient consent · End-to-end encrypted</span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SCREEN: Patient Profile
   ══════════════════════════════════════════════════════════ */
function PatientProfileScreen({ patient, onBack, activeTab: activeTabProp, onTabChange }) {
  const p = PATIENT_PROFILE;
  const [activeTabState, setActiveTabState] = useState('overview');
  const activeTab = activeTabProp ?? activeTabState;
  const setActiveTab = onTabChange ?? setActiveTabState;
  const [expandedNote, setExpandedNote] = useState(null);
  const [showAddNote, setShowAddNote] = useState(false);
  const [noteText, setNoteText] = useState('');

  return (
    <div className="pb-[24px]">
      <StickyHeader onBack={onBack}>
        <div className="flex-1 min-w-0">
          <span className="text-[15px] leading-[21px] font-[500] text-[#191C1A]">Patient Profile</span>
        </div>
      </StickyHeader>

      {/* Profile header */}
      <div className="px-[16px] pt-[16px] pb-[12px] flex flex-col items-center gap-[8px]">
        <Avatar name={patient.name} size="lg" />
        <div className="text-center">
          <h2 className="text-[20px] leading-[28px] font-[700] text-[#191C1A]">{patient.name}</h2>
          <p className="text-[13px] leading-[18px] font-[450] text-[#8B828B]">
            Age {patient.age} · {patient.diagnosis} · Since {patient.startedTherapy}
          </p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="px-[16px] mb-[16px]">
        <div className="flex bg-[#F8F8F8] rounded-[10px] p-[3px]">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'notes', label: 'Notes' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-[7px] rounded-[8px] text-[13px] leading-[18px] font-[500] transition-all ${
                activeTab === tab.id
                  ? 'bg-[#FFFFFF] text-[#191C1A] shadow-sm'
                  : 'text-[#8B828B]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="px-[16px] flex flex-col gap-[16px]">
          {/* Emotional Landscape */}
          <div className="bg-[#FFFFFF] rounded-[14px] p-[14px] border border-[#F0F0F0]">
            <span className="text-[15px] leading-[21px] font-[500] text-[#191C1A] block mb-[12px]">
              Emotional Landscape
            </span>
            <EmotionBars emotions={p.emotionalLandscape.dominant} />
            <p className="text-[12px] leading-[17px] font-[450] text-[#5ABA9D] mt-[10px] bg-[#F0FFF4] rounded-[8px] p-[8px]">
              {p.emotionalLandscape.trend}
            </p>
          </div>

          {/* Behavioral Callouts */}
          <div>
            <span className="text-[15px] leading-[21px] font-[500] text-[#191C1A] block mb-[10px]">
              Behavioral Callouts
            </span>
            <div className="flex flex-col gap-[8px]">
              {p.behavioralCallouts.map((b, i) => (
                <div key={i} className="bg-[#FFFFFF] rounded-[12px] p-[12px] border border-[#F0F0F0]">
                  <div className="flex items-center justify-between mb-[4px]">
                    <span className="text-[13px] leading-[18px] font-[500] text-[#191C1A]">{b.label}</span>
                    <TrendBadge trend={b.trend} />
                  </div>
                  <p className="text-[12px] leading-[17px] font-[450] text-[#6D6C6A]">{b.detail}</p>
                  <span className="text-[10px] leading-[14px] font-[450] text-[#C0C0BF] mt-[4px] block">
                    First noted {b.since}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Therapeutic Trends */}
          <div className="bg-[#FFFFFF] rounded-[14px] p-[14px] border border-[#F0F0F0]">
            <span className="text-[15px] leading-[21px] font-[500] text-[#191C1A] block mb-[8px]">
              Therapeutic Progress
            </span>
            <p className="text-[12px] leading-[17px] font-[450] text-[#8B828B] mb-[12px]">
              Tracked across 5 weeks of therapy
            </p>
            <TherapeuticTrendsChart data={p.therapeuticTrends} />
          </div>
        </div>
      ) : (
        <div className="px-[16px] flex flex-col gap-[16px]">
          {/* Weekly AI Summary of Notes */}
          <div className="bg-[#F0FFF4] rounded-[14px] p-[14px] border border-[#C2E6DB]">
            <div className="flex items-center gap-[6px] mb-[8px]">
              <span className="text-[14px]">✨</span>
              <span className="text-[13px] leading-[18px] font-[500] text-[#235E4D]">AI Notes Summary — All Sessions</span>
            </div>
            <p className="text-[13px] leading-[19px] font-[450] text-[#235E4D]">{p.weeklyNoteSummary}</p>
          </div>

          {/* Add Note */}
          {showAddNote ? (
            <div className="bg-[#FFFFFF] rounded-[14px] p-[14px] border border-[#5ABA9D]">
              <div className="flex items-center justify-between mb-[8px]">
                <span className="text-[13px] leading-[18px] font-[500] text-[#191C1A]">New Session Note</span>
                <button onClick={() => setShowAddNote(false)} className="text-[12px] text-[#8B828B]">Cancel</button>
              </div>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Write your session notes..."
                className="w-full h-[100px] text-[13px] leading-[19px] font-[450] text-[#191C1A] bg-[#F8F8F8] rounded-[10px] p-[10px] resize-none outline-none border-none placeholder:text-[#C0C0BF]"
              />
              <div className="flex justify-end mt-[8px]">
                <button className="px-[16px] py-[8px] bg-[#191C1A] text-[#FFFFFF] text-[13px] font-[500] rounded-full">
                  Save Note
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddNote(true)}
              className="w-full py-[12px] rounded-[12px] border-2 border-dashed border-[#DEDEDE] text-[13px] leading-[18px] font-[500] text-[#8B828B] flex items-center justify-center gap-[6px] active:bg-[#F8F8F8] transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#8B828B" strokeWidth="2" className="w-[16px] h-[16px]">
                <path d="M12 5v14m-7-7h14" strokeLinecap="round" />
              </svg>
              Add Session Note
            </button>
          )}

          {/* Existing notes */}
          <div>
            <span className="text-[15px] leading-[21px] font-[500] text-[#191C1A] block mb-[10px]">Session Notes</span>
            <div className="flex flex-col gap-[10px]">
              {p.notes.map((note) => (
                <div key={note.id} className="bg-[#FFFFFF] rounded-[14px] border border-[#F0F0F0] overflow-hidden">
                  {/* Note header — always visible */}
                  <button
                    onClick={() => setExpandedNote(expandedNote === note.id ? null : note.id)}
                    className="w-full text-left p-[14px] flex items-start gap-[8px]"
                  >
                    <div className="w-[28px] h-[28px] rounded-full bg-[#F8F8F8] flex items-center justify-center shrink-0 mt-[1px]">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#6D6C6A" strokeWidth="2" className="w-[14px] h-[14px]">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M14 2v6h6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[14px] leading-[20px] font-[500] text-[#191C1A]">
                          Session — {note.sessionDate}
                        </span>
                        <svg
                          viewBox="0 0 24 24" fill="none" stroke="#C0C0BF" strokeWidth="2"
                          className={`w-[14px] h-[14px] shrink-0 transition-transform ${expandedNote === note.id ? 'rotate-180' : ''}`}
                        >
                          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <p className="text-[12px] leading-[17px] font-[450] text-[#8B828B] mt-[2px]">{note.date}</p>
                    </div>
                  </button>

                  {/* Expanded content */}
                  {expandedNote === note.id && (
                    <div className="px-[14px] pb-[14px] flex flex-col gap-[10px]">
                      {/* Raw note */}
                      <div className="bg-[#F8F8F8] rounded-[10px] p-[10px]">
                        <span className="text-[11px] leading-[16px] font-[500] text-[#8B828B] block mb-[4px]">Your Notes</span>
                        <p className="text-[13px] leading-[19px] font-[450] text-[#191C1A]">{note.content}</p>
                      </div>
                      {/* AI summary of this note */}
                      <div className="bg-[#F0FFF4] rounded-[10px] p-[10px]">
                        <div className="flex items-center gap-[4px] mb-[4px]">
                          <span className="text-[11px]">✨</span>
                          <span className="text-[11px] leading-[16px] font-[500] text-[#235E4D]">AI Analysis</span>
                        </div>
                        <p className="text-[12px] leading-[17px] font-[450] text-[#235E4D]">{note.aiSummary}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT — Navigation Controller
   ══════════════════════════════════════════════════════════ */
export const TherapistDemo = forwardRef(function TherapistDemo(_props, ref) {
  const [screen, setScreen] = useState('list'); // 'list' | 'detail' | 'profile'
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [profileTab, setProfileTab] = useState('overview');

  // Expose navigation methods for screen export
  useImperativeHandle(ref, () => ({
    goToList: () => {
      setScreen('list');
      setSelectedPatient(null);
    },
    goToSummary: (patientId = 'ellie') => {
      const patient = PATIENTS.find(p => p.id === patientId) || PATIENTS[0];
      setSelectedPatient(patient);
      setScreen('detail');
    },
    goToProfile: (patientId = 'ellie', tab = 'overview') => {
      const patient = PATIENTS.find(p => p.id === patientId) || PATIENTS[0];
      setSelectedPatient(patient);
      setProfileTab(tab);
      setScreen('profile');
    },
  }), []);

  if (screen === 'profile' && selectedPatient) {
    return (
      <PatientProfileScreen
        patient={selectedPatient}
        onBack={() => setScreen('detail')}
        activeTab={profileTab}
        onTabChange={setProfileTab}
      />
    );
  }

  if (screen === 'detail' && selectedPatient) {
    return (
      <WeeklySummaryScreen
        patient={selectedPatient}
        onBack={() => { setScreen('list'); setSelectedPatient(null); }}
        onOpenProfile={() => { setProfileTab('overview'); setScreen('profile'); }}
      />
    );
  }

  return (
    <PatientListScreen
      onSelect={(p) => { setSelectedPatient(p); setScreen('detail'); }}
    />
  );
});
