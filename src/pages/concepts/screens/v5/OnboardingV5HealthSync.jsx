import { useState, useMemo } from 'react';
import { Button } from '../../../../components/Button';

/* Each syncable body goal maps to one Apple Health data type. In a
   real build we'd request multiple types per goal (sleep analysis +
   sleep hours, workouts + active energy + heart rate, etc.) but for
   the prototype one per goal keeps the permission sheet scannable. */
const SYNC_METRICS = {
  sleep: { key: 'sleep', label: 'Sleep Analysis', icon: 'moon' },
  cycle: { key: 'cycle', label: 'Cycle Tracking', icon: 'droplet' },
  exercise: { key: 'exercise', label: 'Workouts', icon: 'activity' },
};

/* The full supported-app directory. This is the source of truth for
   "which integrations does Rosebud support?" and it powers the browse
   sheet. Adding a new integration is a one-line change here — no
   other UI updates needed. Categories let us group results if we
   ever want sectioned browsing.

   In a real build this list would come from a backend API so the
   supported-apps catalog can update without shipping a new version. */
const DATA_SOURCES = [
  { id: 'apple-health', name: 'Apple Health', tagline: 'iOS health hub', category: 'Health hubs' },
  { id: 'google-fit', name: 'Google Fit', tagline: 'Android health hub', category: 'Health hubs' },
  { id: 'flo', name: 'Flo', tagline: 'Period and ovulation tracking', category: 'Cycle' },
  { id: 'clue', name: 'Clue', tagline: 'Cycle and symptom tracking', category: 'Cycle' },
  { id: 'natural-cycles', name: 'Natural Cycles', tagline: 'FDA-cleared cycle tracking', category: 'Cycle' },
  { id: 'oura', name: 'Oura', tagline: 'Ring-based sleep and recovery', category: 'Sleep + recovery' },
  { id: 'whoop', name: 'Whoop', tagline: 'Strain, sleep, and recovery', category: 'Sleep + recovery' },
  { id: 'eight-sleep', name: 'Eight Sleep', tagline: 'Smart mattress sleep tracking', category: 'Sleep + recovery' },
  { id: 'garmin', name: 'Garmin Connect', tagline: 'Wearables and activity', category: 'Fitness' },
  { id: 'fitbit', name: 'Fitbit', tagline: 'Wearables and activity', category: 'Fitness' },
  { id: 'strava', name: 'Strava', tagline: 'Running and cycling', category: 'Fitness' },
  { id: 'peloton', name: 'Peloton', tagline: 'Connected fitness classes', category: 'Fitness' },
  { id: 'myfitnesspal', name: 'MyFitnessPal', tagline: 'Nutrition tracking', category: 'Nutrition' },
  { id: 'cronometer', name: 'Cronometer', tagline: 'Detailed nutrition tracking', category: 'Nutrition' },
  { id: 'headspace', name: 'Headspace', tagline: 'Meditation and mindfulness', category: 'Mindfulness' },
  { id: 'calm', name: 'Calm', tagline: 'Meditation and sleep stories', category: 'Mindfulness' },
];

/* Tiny Lucide-style metric icons. currentColor so they pick up the
   parent's text color (Apple Health red inside the permission sheet,
   rose on the main screen). */
function MetricIcon({ name, className }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.8',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className,
    'aria-hidden': 'true',
  };
  switch (name) {
    case 'moon':
      return (
        <svg {...common}>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      );
    case 'droplet':
      return (
        <svg {...common}>
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      );
    case 'activity':
      return (
        <svg {...common}>
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      );
    default:
      return null;
  }
}

/* iOS-style toggle pill with a knob that slides via translate-x
   so the animation stays GPU-accelerated. Color palette matches
   iOS system colors (green #34C759 on, gray #E5E5EA off). */
function Toggle({ on, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-[40px] h-[24px] rounded-full transition-colors shrink-0 ${
        on ? 'bg-[#34C759]' : 'bg-[#E5E5EA]'
      }`}
      aria-label={on ? 'On' : 'Off'}
    >
      <div
        className={`absolute top-[2px] left-[2px] w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform ${
          on ? 'translate-x-[16px]' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

/* A single row in the browse sheet. Uniform neutral treatment (first
   letter in a gray square) so we don't need real app logos and the
   catalog feels consistent regardless of how many apps are added. */
function AppRow({ app, connected, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-[12px] w-full px-[12px] py-[10px] rounded-[10px] hover:bg-[#F8F8F8] transition-colors text-left cursor-pointer"
    >
      {/* Initial badge — neutral gray square with the app's first letter.
          Avoids trademark issues and keeps all rows visually uniform. */}
      <div className="w-[36px] h-[36px] rounded-[9px] bg-[#F2F2F7] flex items-center justify-center text-[14px] font-[700] text-[#6D6C6A] shrink-0">
        {app.name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] leading-[17px] font-[600] text-[#191C1A] truncate">
          {app.name}
        </div>
        <div className="text-[11px] leading-[14px] font-[450] text-[#8B828B] truncate">
          {app.tagline}
        </div>
      </div>
      {/* Connection state — checkmark if connected, plus if not */}
      {connected ? (
        <div className="w-[24px] h-[24px] rounded-full bg-[#34C759] flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="w-[12px] h-[12px]">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
      ) : (
        <div className="w-[24px] h-[24px] rounded-full border border-[#DEDEDE] flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="#8B828B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[12px] h-[12px]">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </div>
      )}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════
   V5 · Health Sync — Apple Health primary + searchable catalog
   Apple Health stays the recommended primary path (one tap for
   most iOS users since it's the hub most health apps write to).
   A small "Browse all supported apps" link opens a searchable
   sheet showing the full app catalog — users can discover what
   Rosebud supports, search for their specific app, and connect
   whatever matches. If nothing matches their search, an empty
   state lets them request the app. No chip row means the main
   screen doesn't get crowded as the catalog grows.
   ══════════════════════════════════════════════════════════ */
export function OnboardingV5HealthSync({ data, onNext, onBack, step = 2, total = 4 }) {
  const selected = data.goals || [];
  // Scope the Apple Health sheet to ONLY the metrics matching the
  // user's picks. If they picked only sleep, only sleep shows up.
  const syncableItems = ['sleep', 'cycle', 'exercise']
    .filter((id) => selected.includes(id))
    .map((id) => SYNC_METRICS[id]);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [permissions, setPermissions] = useState({});
  const [browserOpen, setBrowserOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [connectedSources, setConnectedSources] = useState([]);

  // Filter the catalog by search query. Matches against name AND
  // tagline so "period" finds Flo, "ring" finds Oura, etc.
  const filteredSources = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return DATA_SOURCES;
    return DATA_SOURCES.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const openSheet = () => {
    // Reset all metric permissions to "on" each time the sheet opens.
    // Matches iOS default behavior for HealthKit requests.
    const init = {};
    syncableItems.forEach((item) => {
      init[item.key] = true;
    });
    setPermissions(init);
    setSheetOpen(true);
  };
  const closeSheet = () => setSheetOpen(false);
  const handleAllow = () => {
    setSheetOpen(false);
    onNext();
  };
  const togglePermission = (key) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const openBrowser = () => {
    setSearchQuery('');
    setBrowserOpen(true);
  };
  const closeBrowser = () => setBrowserOpen(false);
  const toggleSource = (id) => {
    setConnectedSources((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <div className="flex flex-col h-full px-[20px] pt-[8px] relative">
      {/* Top bar — Back only. The "later" escape hatch is an explicit
          secondary button in the footer. */}
      <div className="flex items-center justify-between h-[32px] mb-[12px]">
        <button
          onClick={onBack}
          className="w-[32px] h-[32px] rounded-full flex items-center justify-center hover:bg-[#F0F0F0] transition-colors text-[#191C1A]"
          aria-label="Back"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <div className="w-[32px]" />
      </div>

      {/* Progress bar */}
      <div className="flex gap-[4px] mb-[18px]">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-[3px] rounded-full transition-colors ${
              i <= step ? 'bg-[#191C1A]' : 'bg-[#EDEDED]'
            }`}
          />
        ))}
      </div>

      {/* Centered content region — flex-1 + justify-center vertically
          centers the hero/title/metrics cluster in the space between
          the progress bar and the footer. Bottom padding shifts the
          effective center upward so the hero sits slightly above true
          middle (feels more balanced than dead-center vertically). */}
      <div className="flex-1 flex flex-col justify-center pb-[48px]">
        {/* Hero — heart emote in a soft-pink rounded card. Tight
            mb-[14px] so the title reads close to the card rather than
            floating separately. */}
        <div className="flex justify-center mb-[14px]">
          <div className="w-[96px] h-[96px] rounded-[24px] bg-[#FFE5EB] flex items-center justify-center">
            <img
              src="/src/symbols/emotes/heart.svg"
              alt=""
              className="w-[60px] h-[60px]"
            />
          </div>
        </div>

        {/* Title + subtitle — source-agnostic framing. The specific
            metrics Rosebud will read show up on the permission sheet
            itself (with toggles), so no need to list them here too. */}
        <h2 className="text-[22px] leading-[28px] font-[700] text-[#191C1A] tracking-[-0.01em] text-center mb-[6px]">
          Connect your data?
        </h2>
        <p className="text-[13px] leading-[20px] font-[450] text-[#6D6C6A] text-center">
          Auto-sync from apps you already use so you never log by hand.
        </p>
      </div>

      {/* Footer — two real buttons stacked (primary + secondary) with
          a tertiary skip link below. Clear visual hierarchy: Apple
          Health is the recommended path, Browse All is the named
          alternative, "later" is the escape hatch. */}
      <div className="pb-[8px] flex flex-col">
        <Button variant="primary" size="large" className="w-full" onClick={openSheet}>
          Connect Apple Health
        </Button>
        <Button variant="secondary" size="large" className="w-full mt-[8px]" onClick={openBrowser}>
          Browse All Apps
        </Button>
        <button
          onClick={onNext}
          className="text-[12px] leading-[16px] font-[500] text-[#8B828B] hover:text-[#191C1A] transition-colors py-[10px] mt-[2px] text-center"
        >
          I&rsquo;ll input manually
        </button>
      </div>

      {/* ════ Mock iOS Health Access sheet ════
          Slides up when Connect Apple Health is tapped. */}
      {sheetOpen && (
        <>
          <div
            onClick={closeSheet}
            className="absolute inset-0 bg-black/40 z-10"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[20px] px-[20px] pt-[8px] pb-[20px] z-20 shadow-[0_-8px_24px_rgba(0,0,0,0.15)]">
            {/* Grabber */}
            <div className="flex justify-center mb-[10px]">
              <div className="w-[36px] h-[4px] rounded-full bg-[#DEDEDE]" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-[18px]">
              <button
                onClick={closeSheet}
                className="text-[15px] leading-[20px] font-[400] text-[#007AFF]"
              >
                Cancel
              </button>
              <span className="text-[15px] leading-[20px] font-[600] text-[#191C1A]">
                Health Access
              </span>
              <div className="w-[50px]" />
            </div>

            {/* App identity */}
            <div className="flex items-center gap-[12px] mb-[14px]">
              <div className="w-[40px] h-[40px] rounded-[9px] bg-white border border-[#F0F0F0] flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="#FF2D55" className="w-[22px] h-[22px]">
                  <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] leading-[16px] font-[600] text-[#191C1A]">
                  Rosebud
                </div>
                <div className="text-[11px] leading-[14px] font-[400] text-[#8B828B]">
                  would like to read:
                </div>
              </div>
            </div>

            {/* Permission rows */}
            <div className="rounded-[12px] bg-[#F2F2F7] overflow-hidden mb-[16px]">
              {syncableItems.map((item, i) => (
                <div
                  key={item.key}
                  className={`flex items-center justify-between px-[14px] py-[12px] ${
                    i < syncableItems.length - 1 ? 'border-b border-[#E5E5EA]' : ''
                  }`}
                >
                  <div className="flex items-center gap-[10px] min-w-0">
                    <MetricIcon name={item.icon} className="w-[16px] h-[16px] text-[#FF2D55] shrink-0" />
                    <span className="text-[14px] leading-[18px] font-[400] text-[#191C1A] truncate">
                      {item.label}
                    </span>
                  </div>
                  <Toggle
                    on={!!permissions[item.key]}
                    onChange={() => togglePermission(item.key)}
                  />
                </div>
              ))}
            </div>

            {/* Allow */}
            <button
              onClick={handleAllow}
              className="w-full h-[44px] rounded-[12px] bg-[#007AFF] text-white text-[15px] leading-[20px] font-[600] transition-colors active:bg-[#0062CC] cursor-pointer"
            >
              Allow
            </button>
          </div>
        </>
      )}

      {/* ════ Browse all supported apps sheet ════
          Full-height sheet sliding up over the phone content when the
          "Browse all supported apps" link is tapped. Shows the entire
          DATA_SOURCES catalog with a search filter at the top. Users
          can search by name, tagline, or category. Tapping a row
          toggles that app's connected state (visual only — in a real
          build each source would kick off its own OAuth flow). */}
      {browserOpen && (
        <div className="absolute inset-0 bg-white z-30 flex flex-col">
          {/* Header — iOS-style nav bar with close X */}
          <div className="flex items-center justify-between h-[48px] px-[16px] border-b border-[#EDEDED] shrink-0">
            <button
              onClick={closeBrowser}
              className="w-[32px] h-[32px] rounded-full flex items-center justify-center hover:bg-[#F0F0F0] transition-colors text-[#191C1A]"
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <span className="text-[15px] leading-[20px] font-[600] text-[#191C1A]">
              Supported apps
            </span>
            <div className="w-[32px]" />
          </div>

          {/* Search bar — iOS-style with a search icon prefix */}
          <div className="px-[16px] py-[12px] shrink-0">
            <div className="flex items-center gap-[8px] px-[12px] h-[36px] rounded-[10px] bg-[#F2F2F7]">
              <svg viewBox="0 0 24 24" fill="none" stroke="#8B828B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px] shrink-0">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search apps..."
                className="flex-1 bg-transparent text-[13px] leading-[18px] font-[450] text-[#191C1A] placeholder:text-[#8B828B] focus:outline-none"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-[#8B828B] hover:text-[#191C1A] shrink-0"
                  aria-label="Clear search"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[14px] h-[14px]">
                    <circle cx="12" cy="12" r="10" fill="#C0C0BF" />
                    <path d="M9 9l6 6M15 9l-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* App list — scrollable. Rows are tappable; tapping toggles
              the "connected" state so users can see the interaction
              pattern without needing a separate OAuth mock for every
              single integration. */}
          <div className="flex-1 overflow-y-auto px-[8px] pb-[16px]">
            {filteredSources.length > 0 ? (
              <div className="flex flex-col gap-[2px]">
                {filteredSources.map((app) => (
                  <AppRow
                    key={app.id}
                    app={app}
                    connected={connectedSources.includes(app.id)}
                    onClick={() => toggleSource(app.id)}
                  />
                ))}
              </div>
            ) : (
              /* Empty state — no matches. Offers a "request this app"
                 affordance so users feel heard even when we don't
                 support what they're looking for. */
              <div className="flex flex-col items-center text-center pt-[40px] px-[24px]">
                <div className="text-[32px] mb-[8px]">🔍</div>
                <div className="text-[14px] leading-[18px] font-[600] text-[#191C1A] mb-[4px]">
                  No apps match &ldquo;{searchQuery}&rdquo;
                </div>
                <div className="text-[12px] leading-[17px] font-[450] text-[#8B828B] mb-[16px]">
                  Don&rsquo;t see yours? Let us know what to add.
                </div>
                <button className="px-[14px] py-[8px] rounded-[12px] border border-[#DEDEDE] text-[12px] leading-[16px] font-[500] text-[#191C1A] hover:bg-[#F8F8F8] transition-colors cursor-pointer">
                  Request an app
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
