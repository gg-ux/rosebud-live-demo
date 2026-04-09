import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { PhoneFrame } from '../components/PhoneFrame';
import { TopNav } from '../components/TopNav';
import { useFlowStepper } from './concepts/useFlowStepper';
import { OnboardingWelcome } from './concepts/screens/OnboardingWelcome';
import { OnboardingPatterns } from './concepts/screens/OnboardingPatterns';
import { OnboardingLogging } from './concepts/screens/OnboardingLogging';
import { OnboardingInterval } from './concepts/screens/OnboardingInterval';
import { OnboardingConfirmation } from './concepts/screens/OnboardingConfirmation';
import { OnboardingCustom } from './concepts/screens/OnboardingCustom';
import { OnboardingV2Intent } from './concepts/screens/v2/OnboardingV2Intent';
import { OnboardingV2Logging } from './concepts/screens/v2/OnboardingV2Logging';
import { OnboardingV2Cadence } from './concepts/screens/v2/OnboardingV2Cadence';
import { OnboardingV2Preview } from './concepts/screens/v2/OnboardingV2Preview';
import { OnboardingV3Journal } from './concepts/screens/v3/OnboardingV3Journal';
import { ResultsDashboard } from './concepts/screens/ResultsDashboard';
import { ResultsTriggerMap } from './concepts/screens/ResultsTriggerMap';
import { ResultsInsights } from './concepts/screens/ResultsInsights';
import { ResultsEvolution } from './concepts/screens/ResultsEvolution';

function StepDots({ total, current, onSelect }) {
  return (
    <div className="flex gap-[8px] justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={`w-[8px] h-[8px] rounded-full transition-all cursor-pointer ${
            i === current ? 'bg-[var(--color-on-background)] w-[24px]' : 'bg-[var(--color-outline-light)]'
          }`}
        />
      ))}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <span className="inline-block px-[12px] py-[4px] rounded-full bg-[var(--color-surface-variant)] text-[12px] font-[600] tracking-[0.05em] uppercase text-[var(--color-secondary-text)] mb-[16px]">
      {children}
    </span>
  );
}

export function Concepts() {
  const onboarding = useFlowStepper(6, { patterns: [], customItems: [], loggingPref: '', reviewInterval: 'weekly' });
  const onboardingV2 = useFlowStepper(4, { intents: [], logMethod: 'mention', customWatch: '', cadence: 'weekly', minHistory: '2weeks' });
  const results = useFlowStepper(4);
  const [theme, setTheme] = useState('light');
  const [onboardingVersion, setOnboardingVersion] = useState('v1');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const hasCustom = (onboarding.data.patterns || []).includes('custom');
  const onboardingScreens = [
    <OnboardingWelcome key="welcome" onNext={onboarding.next} />,
    <OnboardingPatterns key="patterns" data={onboarding.data} setData={onboarding.setData} onNext={onboarding.next} onBack={onboarding.back} />,
    ...(hasCustom ? [<OnboardingCustom key="custom" data={onboarding.data} setData={onboarding.setData} onNext={onboarding.next} onBack={onboarding.back} />] : []),
    <OnboardingLogging key="logging" data={onboarding.data} setData={onboarding.setData} onNext={onboarding.next} onBack={onboarding.back} />,
    <OnboardingInterval key="interval" data={onboarding.data} setData={onboarding.setData} onNext={onboarding.next} onBack={onboarding.back} />,
    <OnboardingConfirmation key="confirm" data={onboarding.data} onBack={onboarding.back} onReset={() => onboarding.goTo(0)} />,
  ];

  const onboardingV2Screens = [
    <OnboardingV2Intent key="v2intent" data={onboardingV2.data} setData={onboardingV2.setData} onNext={onboardingV2.next} />,
    <OnboardingV2Logging key="v2logging" data={onboardingV2.data} setData={onboardingV2.setData} onNext={onboardingV2.next} onBack={onboardingV2.back} />,
    <OnboardingV2Cadence key="v2cadence" data={onboardingV2.data} setData={onboardingV2.setData} onNext={onboardingV2.next} onBack={onboardingV2.back} />,
    <OnboardingV2Preview key="v2preview" onBack={onboardingV2.back} onReset={() => onboardingV2.goTo(0)} />,
  ];

  const resultsScreens = [
    <ResultsDashboard key="dashboard" />,
    <ResultsTriggerMap key="triggers" />,
    <ResultsInsights key="insights" />,
    <ResultsEvolution key="evolution" />,
  ];

  const resultsLabels = ['Dashboard', 'Triggers', 'Insights', 'Evolution'];

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-background)]">
      <TopNav
        className="bg-[var(--color-surface)]/95"
        rightSlot={
          <button
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            className="p-[8px] rounded-[8px] bg-[var(--color-background)] border border-[var(--color-outline-light)] text-[var(--color-on-surface)] hover:opacity-80 transition-opacity cursor-pointer"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        }
      />

      {/* ═══ HERO — full width, outside main ═══ */}
      <section className="w-full bg-[var(--color-surface)] pt-[60px] md:pt-[80px] pb-[40px] md:pb-[60px]">
        <div className="max-w-[1200px] mx-auto px-[20px] md:px-[24px] flex flex-col lg:flex-row items-center gap-[32px] md:gap-[48px]">
            {/* Left — copy */}
            <div className="flex-1 max-w-[480px]">
              <span className="inline-block text-[13px] font-[600] tracking-[0.06em] uppercase text-[#E31665] mb-[20px]">
                Design Concept
              </span>
              <h1 className="text-[36px] md:text-[52px] leading-[42px] md:leading-[58px] font-[700] text-[var(--color-on-background)] mb-[20px] tracking-[-0.03em]">
                Pattern Discovery
              </h1>
              <p className="text-[16px] md:text-[19px] leading-[26px] md:leading-[30px] font-[450] text-[var(--color-secondary-text)] mb-[28px] md:mb-[36px]">
                Surface cross-session patterns, longitudinal themes, and evolving self-knowledge in a way that gets more valuable the longer someone uses it.
              </p>
              <div className="flex flex-col gap-[12px]">
                {[
                  ['74%', 'join for pattern recognition'],
                  ['76%', 'stay for insights'],
                  ['59%', 'cite memory as differentiator'],
                ].map(([stat, desc]) => (
                  <div key={stat} className="flex items-center gap-[12px]">
                    <span className="text-[28px] leading-[28px] font-[700] text-[#E31665] w-[56px] shrink-0">{stat}</span>
                    <span className="text-[15px] leading-[20px] font-[450] text-[var(--color-secondary-text)]">{desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — animated analysis illustration */}
            <div className="flex-1 flex justify-center lg:justify-end w-full">
              <svg viewBox="0 0 480 400" fill="none" className="w-full max-w-[100%] md:max-w-[580px]">
                <defs>
                  <linearGradient id="heroGradSleep" x1="240" y1="90" x2="240" y2="290" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#E31665" stopOpacity="0.10" />
                    <stop offset="1" stopColor="#E31665" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="heroGradExercise" x1="240" y1="140" x2="240" y2="290" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#7CC4AF" stopOpacity="0.07" />
                    <stop offset="1" stopColor="#7CC4AF" stopOpacity="0" />
                  </linearGradient>
                  <filter id="heroShadow">
                    <feDropShadow dx="0" dy="3" stdDeviation="8" floodColor="#000000" floodOpacity="0.06" />
                  </filter>
                </defs>

                {/* Dot grid */}
                {Array.from({ length: 13 }).map((_, col) =>
                  Array.from({ length: 11 }).map((_, row) => (
                    <circle key={`${col}-${row}`} cx={50 + col * 32} cy={30 + row * 32} r="1" style={{ fill: 'var(--color-outline)' }} opacity="0.25" />
                  ))
                )}

                {/*
                  8 evenly-spaced weeks. X positions: 72, 120, 168, 216, 264, 312, 360, 408
                  Sleep quality: 5.2, 5.0, 5.4, 5.8, 6.5, 7.2, 7.8, 8.2
                  Exercise days: 1, 1, 2, 2, 3, 4, 4, 5
                  Y mapping sleep: 5→240, 9→100 (35px per point)
                  Y mapping exercise: 0→275, 6→100 (29px per day)
                  Sleep Y: 233, 240, 226, 212, 187, 163, 142, 128
                  Exercise Y: 246, 246, 217, 217, 188, 159, 159, 130
                */}

                {/* Card */}
                <rect x="40" y="50" width="400" height="280" rx="16" style={{ fill: 'var(--color-surface)' }} filter="url(#heroShadow)" />

                {/* Dot grid */}
                {[120, 170, 220, 270].map(y =>
                  [72, 120, 168, 216, 264, 312, 360, 408].map(x => (
                    <circle key={`g${x}-${y}`} cx={x} cy={y} r="1.2" style={{ fill: 'var(--color-outline-light)' }} />
                  ))
                )}

                {/* Y-axis: Sleep (left) — colored to match line */}
                {[['9', 120], ['7', 170], ['5', 220], ['3', 270]].map(([l, y]) => (
                  <text key={y} x="58" y={y + 4} fill="#E31665" fillOpacity="0.5" fontSize="11" fontFamily="Circular Std, sans-serif" textAnchor="end">{l}</text>
                ))}

                {/* Y-axis: Exercise (right) — colored to match line */}
                {[['7', 120], ['5', 170], ['3', 220], ['1', 270]].map(([l, y]) => (
                  <text key={`r${y}`} x="422" y={y + 4} fill="#7CC4AF" fillOpacity="0.6" fontSize="11" fontFamily="Circular Std, sans-serif">{l}</text>
                ))}

                {/* X-axis: weeks */}
                {[['W1', 72], ['W2', 120], ['W3', 168], ['W4', 216], ['W5', 264], ['W6', 312], ['W7', 360], ['W8', 408]].map(([l, x]) => (
                  <text key={x} x={x} y="310" style={{ fill: 'var(--color-secondary-text)' }} fontSize="11" fontFamily="Circular Std, sans-serif" textAnchor="middle">{l}</text>
                ))}

                {/*
                  Mood (1-10) vs Exercise (days/wk) — realistic fluctuations
                  Mood:     5.5, 4.8, 6.2, 5.4, 7.0, 7.8, 6.5, 7.5
                  Exercise: 2,   1,   3,   2,   4,   5,   3,   5

                  Grid: y=120(top, high) to y=270(bottom, low). 150px range.
                  Mood scale: 3→270, 9→120 → each 1pt = 25px
                  Exercise scale: 1→270, 7→120 → each 1day = 25px

                  Mood Y:    208, 222, 190, 210, 170, 150, 183, 158
                  Exercise Y: 245, 270, 220, 245, 195, 170, 220, 170
                */}

                {/* Exercise area fill — smooth monotone spline */}
                <path
                  d="M72,245 C92,245 100,270 120,270 C140,270 148,220 168,220 C188,220 196,245 216,245 C236,245 244,195 264,195 C284,195 292,170 312,170 C332,170 340,220 360,220 C380,220 388,170 408,170 L408,290 L72,290 Z"
                  fill="url(#heroGradExercise)"
                  className="animate-hero-area"
                />

                {/* Exercise line — smooth monotone spline */}
                <path
                  d="M72,245 C92,245 100,270 120,270 C140,270 148,220 168,220 C188,220 196,245 216,245 C236,245 244,195 264,195 C284,195 292,170 312,170 C332,170 340,220 360,220 C380,220 388,170 408,170"
                  stroke="#7CC4AF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                  className="animate-hero-line-delay"
                />

                {/* Mood area fill — smooth monotone spline */}
                <path
                  d="M72,208 C92,208 100,222 120,222 C140,222 148,190 168,190 C188,190 196,210 216,210 C236,210 244,170 264,170 C284,170 292,150 312,150 C332,150 340,183 360,183 C380,183 388,158 408,158 L408,290 L72,290 Z"
                  fill="url(#heroGradSleep)"
                  className="animate-hero-area"
                />

                {/* Mood line — smooth monotone spline */}
                <path
                  d="M72,208 C92,208 100,222 120,222 C140,222 148,190 168,190 C188,190 196,210 216,210 C236,210 244,170 264,170 C284,170 292,150 312,150 C332,150 340,183 360,183 C380,183 388,158 408,158"
                  stroke="#E31665"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                  className="animate-hero-line"
                />

                {/* Mood data points */}
                {[[72,208],[120,222],[168,190],[216,210],[264,170],[312,150],[360,183],[408,158]].map(([cx,cy], i) => (
                  <g key={i}>
                    <circle cx={cx} cy={cy} r="7" fill="#E31665" fillOpacity="0.06" className="animate-hero-dot" style={{ animationDelay: `${2.2 + i * 0.08}s` }} />
                    <circle cx={cx} cy={cy} r="4" fill="white" stroke="#E31665" strokeWidth="2" className="animate-hero-dot" style={{ animationDelay: `${2.2 + i * 0.08}s` }} />
                  </g>
                ))}

                {/* Exercise data points */}
                {[[72,245],[120,270],[168,220],[216,245],[264,195],[312,170],[360,220],[408,170]].map(([cx,cy], i) => (
                  <circle key={`e${i}`} cx={cx} cy={cy} r="3.5" fill="white" stroke="#7CC4AF" strokeWidth="1.5" className="animate-hero-dot" style={{ animationDelay: `${2.8 + i * 0.08}s` }} />
                ))}

                {/* Callout card */}
                <g className="animate-hero-callout">
                  <rect x="72" y="46" width="260" height="68" rx="14" style={{ fill: 'var(--color-surface)' }} filter="url(#heroShadow)" />
                  {/* Dumbbell icon — minimal */}
                  <g transform="translate(86, 66)">
                    <path d="M4,14 L7,14 M25,14 L28,14 M7,8 L7,20 M25,8 L25,20 M7,14 L25,14 M10,10 L10,18 M22,10 L22,18" stroke="#E31665" strokeWidth="2" strokeLinecap="round" fill="none" />
                  </g>
                  {/* Text — right of icon */}
                  <text x="130" y="76" style={{ fill: 'var(--color-on-background)' }} fontSize="13" fontWeight="600" fontFamily="Circular Std, sans-serif">Pattern found</text>
                  <text x="130" y="96" style={{ fill: 'var(--color-secondary-text)' }} fontSize="11" fontWeight="450" fontFamily="Circular Std, sans-serif">Mood +2.1 in weeks with 4+ workouts</text>
                </g>

                {/* Legend */}
                <g className="animate-hero-callout" style={{ animationDelay: '2s' }}>
                  <circle cx="130" cy="360" r="4.5" style={{ fill: 'var(--color-surface)' }} stroke="#E31665" strokeWidth="2" />
                  <text x="142" y="364" style={{ fill: 'var(--color-secondary-text)' }} fontSize="11.5" fontFamily="Circular Std, sans-serif">Mood (1-10)</text>
                  <circle cx="260" cy="360" r="4" style={{ fill: 'var(--color-surface)' }} stroke="#7CC4AF" strokeWidth="1.5" />
                  <text x="272" y="364" style={{ fill: 'var(--color-secondary-text)' }} fontSize="11.5" fontFamily="Circular Std, sans-serif">Exercise (days/wk)</text>
                </g>
              </svg>
            </div>
        </div>
      </section>

      {/* Gradient transition from hero to content */}
      <div className="h-[60px] md:h-[120px] -mt-[1px]" style={{ background: 'linear-gradient(to bottom, var(--color-surface), var(--color-background))' }} />

      <main className="max-w-[1200px] mx-auto px-[20px] md:px-[24px]">

        {/* ═══ THE OPPORTUNITY ═══ */}
        <section className="pb-[100px]">
          <div className="text-center max-w-[640px] mx-auto mb-[48px]">
            <span className="inline-block text-[13px] font-[600] tracking-[0.06em] uppercase text-[var(--color-secondary-text)] mb-[16px]">
              The Opportunity
            </span>
            <h2 className="text-[24px] md:text-[32px] leading-[32px] md:leading-[40px] font-[700] text-[var(--color-on-background)] mb-[16px] tracking-[-0.02em]">
              Join for the reflection. Stay for the revelation.
            </h2>
            <p className="text-[18px] leading-[28px] font-[450] text-[var(--color-secondary-text)]">
              Rosebud already excels at reframing the present moment. The opportunity is to draw from weeks and months of history, surfacing patterns users can&apos;t spot alone. Once the initial magic settles, clearly seeing their own evolution is what keeps users coming back.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
            {[
              {
                quote: 'There\'s like a three-second window between the feeling and my brain spinning a story. I hadn\'t had that pause before.',
                name: 'Elle',
                detail: 'IT security, 7-month daily user',
                initials: 'E',
                color: '#E31665',
              },
              {
                quote: 'I don\'t want overly validating insights. I want it to challenge me. I want to see what I can\'t see.',
                name: 'Gillian',
                detail: 'Post-crisis, daily voice journaler',
                initials: 'G',
                color: '#7CC4AF',
              },
              {
                quote: 'It really remembered. That was the first moment where I was like, holy... this feels like a real relationship.',
                name: 'Meike',
                detail: 'Long-term subscriber',
                initials: 'M',
                color: '#5184D3',
              },
            ].map((t) => (
              <div key={t.name} className="card-soft p-[28px] flex flex-col justify-between gap-[20px]">
                <div>
                  <svg viewBox="0 0 24 24" fill={t.color} opacity="0.2" className="w-[28px] h-[28px] mb-[12px]">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-[16px] leading-[25px] font-[450] text-[var(--color-on-background)]">
                    {t.quote}
                  </p>
                </div>
                <div className="flex items-center gap-[12px]">
                  <div
                    className="w-[36px] h-[36px] rounded-full flex items-center justify-center text-[14px] font-[600] text-white shrink-0"
                    style={{ backgroundColor: t.color }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-[14px] leading-[18px] font-[600] text-[var(--color-on-background)]">{t.name}</p>
                    <p className="text-[12px] leading-[16px] font-[450] text-[var(--color-secondary-text)]">{t.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ THE RESEARCH ═══ */}
        <section className="pb-[100px]">
          <div className="text-center max-w-[680px] mx-auto mb-[40px]">
            <span className="inline-block text-[13px] font-[600] tracking-[0.06em] uppercase text-[var(--color-secondary-text)] mb-[16px]">
              The Research
            </span>
            <h2 className="text-[24px] md:text-[32px] leading-[32px] md:leading-[40px] font-[700] text-[var(--color-on-background)] mb-[16px] tracking-[-0.02em]">
              Seeing is believing (and retaining)
            </h2>
            <p className="text-[16px] md:text-[18px] leading-[26px] md:leading-[28px] font-[450] text-[var(--color-secondary-text)]">
              When people can see their own data, they stick around longer and change faster. For Rosebud, pattern visualization isn&apos;t just a feature, it&apos;s the retention mechanism.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px] max-w-[800px] mx-auto">
            {[
              {
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="#E31665" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
                title: 'People who visualize personal data gain deeper self-awareness',
                source: 'Choe et al., IEEE 2015',
                url: 'https://pubmed.ncbi.nlm.nih.gov/25974930/',
              },
              {
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="#7CC4AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
                title: 'Richer visual feedback = significantly higher retention',
                source: 'Baumel et al., JMIR 2019',
                url: 'https://pubmed.ncbi.nlm.nih.gov/31573916/',
              },
              {
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="#E31665" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]"><path d="M3 3v18h18"/><path d="M7 16l4-4 4 4 5-6"/></svg>,
                title: 'Personalized visual feedback drives real behavior change',
                source: 'Rabbi et al., JMIR 2015',
                url: 'https://pubmed.ncbi.nlm.nih.gov/25977197/',
              },
              {
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="#7CC4AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]"><path d="M12 3a6 6 0 00-4 10.5V17h8v-3.5A6 6 0 0012 3z"/><path d="M9 21h6"/></svg>,
                title: 'Mood self-monitoring reduces depression and anxiety',
                source: 'Bakker & Rickard, 2018',
                url: 'https://pubmed.ncbi.nlm.nih.gov/29154165/',
              },
            ].map((item, i) => (
              <a
                key={i}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card-soft p-[20px] flex items-start gap-[14px] group hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-shadow"
              >
                <div className="w-[36px] h-[36px] rounded-[10px] bg-[var(--color-surface-variant)] flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] leading-[20px] font-[500] text-[var(--color-on-background)] mb-[4px]">{item.title}</p>
                  <span className="inline-flex items-center gap-[4px] text-[12px] leading-[16px] font-[450] text-[var(--color-secondary-text)] group-hover:text-[var(--color-on-background)] transition-colors">
                    {item.source}
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[11px] h-[11px]"><path d="M5 3h8v8m0-8L5 11" /></svg>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ═══ WHERE IT LIVES ═══ */}
        <section className="pt-[40px] pb-[120px]">
          <div className="text-center max-w-[640px] mx-auto mb-[48px]">
            <span className="inline-block text-[13px] font-[600] tracking-[0.06em] uppercase text-[var(--color-secondary-text)] mb-[16px]">
              Where It Lives
            </span>
            <h2 className="text-[24px] md:text-[32px] leading-[32px] md:leading-[40px] font-[700] text-[var(--color-on-background)] mb-[16px] tracking-[-0.02em]">
              Insights, redefined
            </h2>
            <p className="text-[18px] leading-[28px] font-[450] text-[var(--color-secondary-text)]">
              We replace the existing Insights tab with Patterns, elevating pattern discovery to a primary navigation destination.
            </p>
          </div>

          <div className="flex justify-center gap-[32px] flex-wrap">
            {/* Before */}
            <div className="flex flex-col items-center gap-[12px]">
              <span className="text-[12px] font-[600] tracking-[0.05em] uppercase text-[var(--color-secondary-text)]">Before</span>
              <div className="card-soft p-[24px] w-[340px]">
                <div className="flex items-end justify-around">
                  {[
                    { label: 'Today', icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[22px] h-[22px]"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2m-10-10h2m16 0h2m-3.5-6.5l-1.4 1.4M6.3 17.7l-1.4 1.4M6.3 6.3L4.9 4.9m12.8 12.8l1.4 1.4"/></svg>
                    ), active: false },
                    { label: 'Explore', icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[22px] h-[22px]"><circle cx="12" cy="12" r="10"/><path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z"/></svg>
                    ), active: false },
                    { label: '', icon: (
                      <div className="w-[44px] h-[44px] rounded-full bg-[#000000] flex items-center justify-center -mt-[10px]">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" className="w-[22px] h-[22px]"><path d="M12 5v14m-7-7h14"/></svg>
                      </div>
                    ), active: false },
                    { label: 'Insights', icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]"><path d="M9 21h6"/><path d="M12 3a6 6 0 00-4 10.5V17h8v-3.5A6 6 0 0012 3z"/></svg>
                    ), active: true },
                    { label: 'History', icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[22px] h-[22px]"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
                    ), active: false },
                  ].map((tab) => (
                    <div key={tab.label || 'write'} className="flex flex-col items-center gap-[4px]" style={{ color: tab.active ? '#000000' : '#C0C0BF' }}>
                      {tab.icon}
                      {tab.label && <span className="text-[10px] font-[500]">{tab.label}</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center pt-[24px]">
              <svg viewBox="0 0 24 24" fill="none" className="w-[24px] h-[24px]" stroke="var(--color-secondary-text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14m-4-4l4 4-4 4" />
              </svg>
            </div>

            {/* After */}
            <div className="flex flex-col items-center gap-[12px]">
              <span className="text-[12px] font-[600] tracking-[0.05em] uppercase text-[#E31665]">After</span>
              <div className="card-soft p-[24px] w-[340px] ring-2 ring-[#E31665]/20">
                <div className="flex items-end justify-around">
                  {[
                    { label: 'Today', icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[22px] h-[22px]"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2m-10-10h2m16 0h2m-3.5-6.5l-1.4 1.4M6.3 17.7l-1.4 1.4M6.3 6.3L4.9 4.9m12.8 12.8l1.4 1.4"/></svg>
                    ), active: false },
                    { label: 'Explore', icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[22px] h-[22px]"><circle cx="12" cy="12" r="10"/><path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z"/></svg>
                    ), active: false },
                    { label: '', icon: (
                      <div className="w-[44px] h-[44px] rounded-full bg-[#000000] flex items-center justify-center -mt-[10px]">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" className="w-[22px] h-[22px]"><path d="M12 5v14m-7-7h14"/></svg>
                      </div>
                    ), active: false },
                    { label: 'Patterns', icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[22px] h-[22px]"><path d="M3 3v18h18"/><path d="M7 16l4-4 4 4 5-6"/></svg>
                    ), active: true },
                    { label: 'History', icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[22px] h-[22px]"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
                    ), active: false },
                  ].map((tab) => (
                    <div key={tab.label || 'write'} className="flex flex-col items-center gap-[4px]" style={{ color: tab.active ? '#000000' : '#C0C0BF' }}>
                      {tab.icon}
                      {tab.label && <span className="text-[10px] font-[500]">{tab.label}</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ ONBOARDING FLOW ═══ */}
        <section className="pb-[100px]">
          <div className="flex flex-col lg:flex-row gap-[40px] items-center">
            {/* Text — left, vertically centered */}
            <div className="lg:w-[340px] shrink-0">
              {/* Version toggle */}
              <div className="inline-flex rounded-[10px] border border-[var(--color-outline-light)] overflow-hidden mb-[20px]">
                {['v1', 'v2', 'v3'].map(v => (
                  <button
                    key={v}
                    onClick={() => { setOnboardingVersion(v); onboarding.goTo(0); onboardingV2.goTo(0); }}
                    className={`px-[16px] py-[6px] text-[13px] font-[500] transition-colors cursor-pointer ${
                      onboardingVersion === v
                        ? 'bg-[var(--color-on-background)] text-[var(--color-background)]'
                        : 'bg-transparent text-[var(--color-secondary-text)] hover:text-[var(--color-on-background)]'
                    }`}
                  >
                    {v.toUpperCase()}
                  </button>
                ))}
              </div>
              <h2 className="text-[24px] md:text-[32px] leading-[32px] md:leading-[40px] font-[700] text-[var(--color-on-background)] mb-[12px]">
                Pattern Tracking Onboarding
              </h2>
              <p className="text-[17px] leading-[26px] font-[450] text-[var(--color-secondary-text)]">
                {onboardingVersion === 'v1'
                  ? 'Capture what matters during onboarding so the AI knows what to look for from day one.'
                  : onboardingVersion === 'v2'
                  ? 'A more conversational approach — frame tracking around intent, not categories. Let users describe what they want to understand.'
                  : 'The most seamless option — pattern setup happens inline during the first journal session, as a natural conversation with the AI.'
                }
              </p>
            </div>

            {/* Phone + caption — right */}
            <div className="flex-1 flex flex-col items-center gap-[12px]">
              <div className="w-full max-w-[340px]">
                {onboardingVersion === 'v1' ? (
                  <PhoneFrame showNavBar={onboarding.step === onboardingScreens.length - 1} activeTab="home">
                    {onboardingScreens[onboarding.step]}
                  </PhoneFrame>
                ) : onboardingVersion === 'v2' ? (
                  <PhoneFrame showNavBar={false}>
                    {onboardingV2Screens[onboardingV2.step]}
                  </PhoneFrame>
                ) : (
                  <PhoneFrame showNavBar={false} showStatusBar={true}>
                    <OnboardingV3Journal data={onboarding.data} setData={onboarding.setData} onNext={onboarding.next} />
                  </PhoneFrame>
                )}
              </div>
              <span className="text-[13px] font-[450] text-[var(--color-secondary-text)]">Tap to interact</span>
            </div>
          </div>
        </section>

        {/* ═══ RESULTS ═══ */}
        <section className="pb-[100px]">
          <div className="flex flex-col lg:flex-row gap-[40px] items-center">
            {/* Text — left, vertically centered */}
            <div className="lg:w-[340px] shrink-0">
              <SectionLabel>Concept 2</SectionLabel>
              <h2 className="text-[24px] md:text-[32px] leading-[32px] md:leading-[40px] font-[700] text-[var(--color-on-background)] mb-[12px]">
                Pattern Results & Insights
              </h2>
              <p className="text-[17px] leading-[26px] font-[450] text-[var(--color-secondary-text)]">
                After weeks of journaling, here&apos;s what the pattern discovery engine surfaces.
              </p>
            </div>

            {/* Phone + caption — right */}
            <div className="flex-1 flex flex-col items-center gap-[12px]">
              <div className="w-full max-w-[340px]">
                <PhoneFrame showNavBar activeTab="insights">
                  <div className="flex flex-col h-full">
                    {/* In-phone tab bar */}
                    <div className="flex border-b border-[var(--color-outline-light)] px-[4px] pt-[4px] shrink-0">
                      {resultsLabels.map((label, i) => (
                        <button
                          key={label}
                          onClick={() => results.goTo(i)}
                          className={`flex-1 py-[10px] text-[12px] font-[500] text-center transition-colors cursor-pointer relative ${
                            results.step === i
                              ? 'text-[var(--color-on-background)]'
                              : 'text-[var(--color-outline)]'
                          }`}
                        >
                          {label}
                          {results.step === i && (
                            <span className="absolute bottom-0 left-[20%] right-[20%] h-[2px] bg-[var(--color-on-background)] rounded-full" />
                          )}
                        </button>
                      ))}
                    </div>
                    {/* Screen content */}
                    <div className="flex-1 overflow-y-auto">
                      {resultsScreens[results.step]}
                    </div>
                  </div>
                </PhoneFrame>
              </div>
              <span className="text-[13px] font-[450] text-[var(--color-secondary-text)]">Tap to interact</span>
            </div>
          </div>
        </section>

        {/* ═══ WHY THIS WORKS ═══ */}
        <section className="pb-[100px]">
          <SectionLabel>Why This Works</SectionLabel>
          <h2 className="text-[32px] leading-[40px] font-[700] text-[var(--color-on-background)] mb-[32px]">
            Designed around the research
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
            {[
              {
                emoji: '🔗',
                title: 'Cross-session recognition',
                body: 'The pattern analyzer connects entries across weeks and months — delivering the #1 most requested insight type that no single-session tool can match.',
              },
              {
                emoji: '📈',
                title: 'Visible progress',
                body: 'Users feel they\'re growing but can\'t prove it. The dashboard and evolution timeline make change tangible — the most requested but least served need.',
              },
              {
                emoji: '🧠',
                title: 'Memory as relationship',
                body: 'By learning what to track from day one, Rosebud builds a model that deepens over time. 59% of users say memory is what makes Rosebud feel real.',
              },
            ].map((card, i) => (
              <div key={i} className="card-soft p-[24px] flex flex-col gap-[12px]">
                <span className="text-[28px]">{card.emoji}</span>
                <h3 className="text-[17px] leading-[23px] font-[600] text-[var(--color-on-background)]">{card.title}</h3>
                <p className="text-[15px] leading-[22px] font-[450] text-[var(--color-secondary-text)]">{card.body}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      <footer className="border-t border-[var(--color-outline-light)] py-[32px] text-center text-[13px] text-[var(--color-secondary-text-on-surface)]">
        Pattern Discovery — Design Concept by Grace Guo
      </footer>
    </div>
  );
}
