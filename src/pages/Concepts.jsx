import { Fragment, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PhoneFrame } from '../components/PhoneFrame';
import { TopNav } from '../components/TopNav';
import { ExportModal } from '../components/ExportModal';
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
import { OnboardingV5Intent } from './concepts/screens/v5/OnboardingV5Intent';
import { OnboardingV5Body } from './concepts/screens/v5/OnboardingV5Body';
import { OnboardingV5HealthSync } from './concepts/screens/v5/OnboardingV5HealthSync';
import { OnboardingV5Confirmation } from './concepts/screens/v5/OnboardingV5Confirmation';
import { ResultsPage } from './concepts/screens/ResultsPage';
import { ResultsV2Anthology } from './concepts/screens/ResultsV2Anthology';
import { ResultsEmptyState } from './concepts/screens/ResultsEmptyState';
// Character Study was dropped — V3 is now Adaptive (tenure-aware Anthology).
import { HistoryFlow } from './concepts/screens/HistoryFlow';
import { ChaptersFlow } from './concepts/screens/ChaptersFlow';
import { TrackingFlow, MidConversationOnboarding } from './concepts/screens/TrackingFlow';
import { LongTermMemory, WeeklyStar, Brain } from '../icons/concepts-icons';

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

// Consistent replay affordance used below every prototype phone on the
// concepts page. Icon in front, label simply "Replay". Kept small and
// muted so it reads as a prototype-level control, not a product UI
// element. Always wrap the PhoneFrame in a plain block div and place
// this button as a sibling — PhoneFrame's internal scale calc breaks
// in a flex context without an explicit w-full child.
function ReplayButton({ onClick, className = '' }) {
  return (
    <div className={`flex justify-center mt-[14px] ${className}`}>
      <button
        onClick={onClick}
        className="inline-flex items-center gap-[6px] text-[11px] leading-[14px] font-[500] text-[var(--color-secondary-text)] hover:text-[var(--color-on-background)] transition-colors cursor-pointer"
        title="Replay this flow"
      >
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-[11px] h-[11px]"
        >
          <path d="M2 3v4h4" />
          <path d="M2.5 11a6 6 0 1 0 1-7.5L2 7" />
        </svg>
        Replay
      </button>
    </div>
  );
}

export function Concepts() {
  const onboarding = useFlowStepper(6, { patterns: [], customItems: [], loggingPref: '', reviewInterval: 'weekly' });
  const onboardingV2 = useFlowStepper(4, { intents: [], logMethod: 'mention', customWatch: '', cadence: 'weekly', minHistory: '2weeks' });
  const onboardingV5 = useFlowStepper(4, { goals: ['honest', 'returning', 'sleep', 'meds-supps'], takingDetail: '' });
  const [onboardingVersion, setOnboardingVersion] = useState('v5');
  const [compareMode, setCompareMode] = useState(false);
  // Which 3 onboarding versions to show in compare mode, as an array
  // ordered from oldest selection to newest. FIFO eviction: adding a
  // new one at max capacity drops the oldest (front of the array).
  // V5 sits at the end of the default so it's the last to be evicted.
  const [onboardingCompareSelection, setOnboardingCompareSelection] = useState(
    () => ['v1', 'v3', 'v5']
  );
  const [viewedVersions, setViewedVersions] = useState(new Set(['v5']));
  const [exportProgress, setExportProgress] = useState(null); // null | { current, total, label }
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const v3Ref = useRef(null);

  const selectVersion = (v) => {
    setOnboardingVersion(v);
    setViewedVersions(prev => new Set([...prev, v]));
    onboarding.goTo(0);
    onboardingV2.goTo(0);
  };

  // Wait for the next paint frame so React can flush state changes to the DOM
  const tick = (ms = 200) => new Promise(resolve => {
    requestAnimationFrame(() => setTimeout(resolve, ms));
  });

  // html-to-image is lazy-loaded on first export so it doesn't block initial page load
  const htmlToImageRef = useRef(null);

  // Sticky concept nav — tracks which section is currently in view.
  // Sections can map to nav tabs that don't match their id: the
  // mid-conversation onboarding concept is structurally its own
  // section, but conceptually it's still part of the Onboarding story,
  // so it reports 'onboarding' to the nav.
  const sectionToNav = {
    onboarding: 'onboarding',
    'mid-convo-onboarding': 'onboarding',
    tracking: 'tracking',
    results: 'results',
    history: 'history',
  };
  const [activeConcept, setActiveConcept] = useState('onboarding');
  useEffect(() => {
    const ids = Object.keys(sectionToNav);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Among intersecting entries, prefer the one whose top is
        // closest to (but not past) the top of the detection band.
        // Sort descending by top so the most recently entered section
        // wins — otherwise the section above, whose top is further
        // above the viewport, would stay active because its top value
        // is smaller.
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        visible.sort((a, b) => b.boundingClientRect.top - a.boundingClientRect.top);
        setActiveConcept(sectionToNav[visible[0].target.id] || visible[0].target.id);
      },
      {
        // Fire when the section's top crosses just below the sticky concept nav
        rootMargin: '-72px 0px -65% 0px',
        threshold: 0,
      },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Concept 2: Quick tracking flow
  const trackingFlowRef = useRef(null);
  const [trackingVersion, setTrackingVersion] = useState('v1');
  const [trackingCompareMode, setTrackingCompareMode] = useState(false);
  const [trackingViewedVersions, setTrackingViewedVersions] = useState(new Set(['v1']));
  const selectTrackingVersion = (v) => {
    setTrackingVersion(v);
    setTrackingViewedVersions((prev) => new Set([...prev, v]));
    trackingFlowRef.current?.reset();
  };

  // Concept 1b: Mid-conversation onboarding (pattern discovery from
  // accumulated entries). Two explorations — a formal modal and a
  // conversational blue-voice reply. Component is self-contained; to
  // reset the demo or switch versions we bump a key so React remounts
  // the phone and all internal state clears.
  // `midConvoPhoneScreen` is the inner rounded screen div of PhoneFrame.
  // We capture it via a callback ref and pass it down to V1 modal so
  // the modal overlay can be portaled into it — the backdrop then
  // covers the status bar and home indicator area, full bleed.
  const [midConvoVersion, setMidConvoVersion] = useState('v2');
  const [midConvoResetKey, setMidConvoResetKey] = useState(0);
  const [midConvoPhoneScreen, setMidConvoPhoneScreen] = useState(null);
  const selectMidConvoVersion = (v) => {
    setMidConvoVersion(v);
    setMidConvoResetKey((k) => k + 1);
  };

  // Concept 3: Pattern Results & Insights — 3 versions with compare mode
  const [resultsVersion, setResultsVersion] = useState('v3');
  const [resultsCompareMode, setResultsCompareMode] = useState(false);
  const [resultsViewedVersions, setResultsViewedVersions] = useState(new Set(['v1']));
  // Meta-control for V3 Adaptive. Not a user-facing control — this
  // is a demo toggle that simulates different user tenures so viewers
  // can see how the Patterns page adapts. Lives BELOW the phone, not
  // inside it. Week / month / year correspond to the three states
  // Adaptive picks between based on journaling history.
  const [resultsTenure, setResultsTenure] = useState('week');
  // When V2 Anthology opens a full-page insight detail (story/correlation/style),
  // hide the phone nav bar so the overlay feels edge-to-edge
  const [resultsV2DetailOpen, setResultsV2DetailOpen] = useState(false);
  // Captured ref to the primary results phone's inner rounded screen
  // div, so the V2/V3 Anthology takeovers can portal their full-screen
  // overlays into it (covering the status bar / home indicator areas).
  // Only the single-mode primary phone gets a portal target — compare
  // mode renders inline since multiple portals to the same node would
  // overlap.
  const [resultsPhoneScreen, setResultsPhoneScreen] = useState(null);
  const selectResultsVersion = (v) => {
    setResultsVersion(v);
    setResultsViewedVersions((prev) => new Set([...prev, v]));
  };

  // Concept 3: History & Bookmarks flow
  const historyFlowRef = useRef(null);
  const [historyView, setHistoryView] = useState('chat');
  const [historySheetOpen, setHistorySheetOpen] = useState(false);
  const [chaptersSheetOpen, setChaptersSheetOpen] = useState(false);
  const handleHistoryViewChange = (v) => {
    setHistoryView(v);
    if (v === 'chat') historyFlowRef.current?.goToChat();
    if (v === 'history') historyFlowRef.current?.goToHistory();
    if (v === 'bookmarks') historyFlowRef.current?.goToBookmarks();
  };

  async function captureNode(selector, label, format = 'png') {
    const node = document.querySelector(selector);
    if (!node) {
      console.warn(`[export] node not found: ${selector}`);
      return null;
    }
    try {
      const htmlToImage = htmlToImageRef.current;
      const dataUrl = format === 'svg'
        ? await htmlToImage.toSvg(node, { cacheBust: true })
        : await htmlToImage.toPng(node, { pixelRatio: 2, cacheBust: true });
      const blob = await (await fetch(dataUrl)).blob();
      return blob;
    } catch (err) {
      console.error(`[export] capture (${format}) failed for ${label}:`, err);
      return null;
    }
  }

  // Capture once and add the file(s) to the zip in the requested format(s)
  async function captureAndAdd(zip, selector, folder, baseName, label, format) {
    const formats = format === 'both' ? ['png', 'svg'] : [format];
    for (const fmt of formats) {
      const blob = await captureNode(selector, label, fmt);
      if (blob) {
        zip.folder(folder).file(`${baseName}.${fmt}`, blob);
      }
    }
  }

  // Static flow counts (the actual screen arrays are declared further down in this
  // component, so we can't reference their .length here without hitting the TDZ).
  const exportFlows = [
    { id: 'v1', label: 'Onboarding V1 — Guided', description: 'Step-by-step with preset choices', count: 6 },
    { id: 'v2', label: 'Onboarding V2 — Intent-first', description: 'Start from what you want to understand', count: 4 },
    { id: 'v3', label: 'Onboarding V3 — Zero-friction', description: 'Set up while journaling (empty + filled states)', count: 6 },
    { id: 'tracking-v1', label: 'Tracking V1 — Guided Stamp', description: 'Post-save sheet with tiles (writing, sheet open, saved)', count: 3 },
    { id: 'tracking-v2', label: 'Tracking V2 — Inline Tag', description: 'Tag icon tray (open empty, filled, minimized)', count: 3 },
    { id: 'results-v1', label: 'Results V1 — Dashboard', description: 'Hero mood arc, stats row, theme of the week, echoes', count: 1 },
    { id: 'results-v2', label: 'Results V2 — Anthology', description: 'Stories row, archetypes, format-varied analysis', count: 1 },
    { id: 'results-v3', label: 'Results V3 — Adaptive', description: 'Anthology with no timeframe dropdown; system picks the period', count: 1 },
  ];

  async function runExport(selectedFlowIds, format) {
    if (exportProgress) return;
    setExportModalOpen(false);

    const selected = new Set(selectedFlowIds);

    // Compute total file count (each capture writes 2 files when format === 'both')
    const screenCount = exportFlows
      .filter(f => selected.has(f.id))
      .reduce((sum, f) => sum + f.count, 0);
    const totalFiles = format === 'both' ? screenCount * 2 : screenCount;

    setExportProgress({ current: 0, total: totalFiles, label: 'Loading export tools...' });

    // Lazy-load heavy libs only when the user actually exports
    if (!htmlToImageRef.current) {
      htmlToImageRef.current = await import('html-to-image');
    }
    const { default: JSZip } = await import('jszip');

    // Force single mode + reset
    setCompareMode(false);
    await tick(300);

    const zip = new JSZip();
    let counter = 0;

    // Wraps captureAndAdd to also tick the progress UI
    const captureWithProgress = async (selector, folder, baseName, label) => {
      const formats = format === 'both' ? ['png', 'svg'] : [format];
      for (const fmt of formats) {
        const blob = await captureNode(selector, label, fmt);
        counter += 1;
        setExportProgress({ current: counter, total: totalFiles, label: `${folder}/${baseName}.${fmt}` });
        if (blob) {
          zip.folder(folder).file(`${baseName}.${fmt}`, blob);
        }
      }
    };

    // ── Onboarding V1 ──
    if (selected.has('v1')) {
      setOnboardingVersion('v1');
      await tick(300);
      for (let i = 0; i < onboardingScreens.length; i++) {
        onboarding.goTo(i);
        await tick(250);
        const baseName = `${String(i + 1).padStart(2, '0')}-step-${i + 1}`;
        await captureWithProgress('[data-export-phone="onboarding"]', '01-onboarding-v1-guided', baseName, `v1-step-${i}`);
      }
    }

    // ── Onboarding V2 ──
    if (selected.has('v2')) {
      setOnboardingVersion('v2');
      onboardingV2.goTo(0);
      await tick(300);
      for (let i = 0; i < onboardingV2Screens.length; i++) {
        onboardingV2.goTo(i);
        await tick(250);
        const baseName = `${String(i + 1).padStart(2, '0')}-step-${i + 1}`;
        await captureWithProgress('[data-export-phone="onboarding"]', '02-onboarding-v2-intent-first', baseName, `v2-step-${i}`);
      }
    }

    // ── Onboarding V3 (empty + filled per step) ──
    if (selected.has('v3')) {
      setOnboardingVersion('v3');
      await tick(300);
      v3Ref.current?.reset();
      await tick(150);
      const stepLabels = ['patterns', 'cadence', 'journal'];
      let fileIdx = 0;
      for (let i = 0; i < stepLabels.length; i++) {
        // Empty state
        v3Ref.current?.goToStep(i);
        v3Ref.current?.clearInputs();
        await tick(200);
        fileIdx += 1;
        await captureWithProgress(
          '[data-export-phone="onboarding"]',
          '03-onboarding-v3-zero-friction',
          `${String(fileIdx).padStart(2, '0')}-${stepLabels[i]}-empty`,
          `v3-${stepLabels[i]}-empty`,
        );

        // Filled state
        v3Ref.current?.fillCurrentStepWithPlaceholder(i);
        await tick(250);
        fileIdx += 1;
        await captureWithProgress(
          '[data-export-phone="onboarding"]',
          '03-onboarding-v3-zero-friction',
          `${String(fileIdx).padStart(2, '0')}-${stepLabels[i]}-filled`,
          `v3-${stepLabels[i]}-filled`,
        );
      }
      v3Ref.current?.reset();
    }

    // ── Tracking V1 — Guided Stamp ──
    if (selected.has('tracking-v1')) {
      setTrackingVersion('v1');
      setTrackingCompareMode(false);
      await tick(300);
      trackingFlowRef.current?.reset();
      await tick(200);

      // 1. writing state
      await captureWithProgress(
        '[data-export-phone="tracking"]',
        '05-tracking-v1-guided-stamp',
        '01-writing',
        'tracking-v1-writing',
      );

      // 2. sheet open
      trackingFlowRef.current?.v1GoTo('sheet');
      await tick(300);
      await captureWithProgress(
        '[data-export-phone="tracking"]',
        '05-tracking-v1-guided-stamp',
        '02-sheet-open',
        'tracking-v1-sheet',
      );

      // 3. saved + micro-insight
      trackingFlowRef.current?.v1GoTo('saved');
      await tick(250);
      await captureWithProgress(
        '[data-export-phone="tracking"]',
        '05-tracking-v1-guided-stamp',
        '03-saved-insight',
        'tracking-v1-saved',
      );

      trackingFlowRef.current?.reset();
    }

    // ── Tracking V2 — Inline Tag ──
    if (selected.has('tracking-v2')) {
      setTrackingVersion('v2');
      setTrackingCompareMode(false);
      await tick(300);
      trackingFlowRef.current?.reset();
      await tick(200);

      // 1. tray open, chips empty (default state)
      await captureWithProgress(
        '[data-export-phone="tracking"]',
        '06-tracking-v2-inline-tag',
        '01-tray-open-empty',
        'tracking-v2-open-empty',
      );

      // 2. tray open, all chips filled
      trackingFlowRef.current?.v2SetTrackers({ meds: 'missed', period: 'light', sleep: 4 });
      await tick(250);
      await captureWithProgress(
        '[data-export-phone="tracking"]',
        '06-tracking-v2-inline-tag',
        '02-tray-open-filled',
        'tracking-v2-open-filled',
      );

      // 3. tray minimized with pink dot (reset trackers so the dot shows)
      trackingFlowRef.current?.v2SetTrackers({ meds: null, period: null, sleep: null });
      trackingFlowRef.current?.v2SetTrayOpen(false);
      await tick(250);
      await captureWithProgress(
        '[data-export-phone="tracking"]',
        '06-tracking-v2-inline-tag',
        '03-tray-minimized-dot',
        'tracking-v2-minimized',
      );

      trackingFlowRef.current?.reset();
    }

    // ── Results V1 — Dashboard ──
    if (selected.has('results-v1')) {
      setResultsVersion('v1');
      setResultsCompareMode(false);
      await tick(400);
      await captureWithProgress(
        '[data-export-phone="results"]',
        '08-results-v1-dashboard',
        '01-dashboard',
        'results-v1',
      );
    }

    // ── Results V2 — Anthology ──
    if (selected.has('results-v2')) {
      setResultsVersion('v2');
      setResultsCompareMode(false);
      await tick(400);
      await captureWithProgress(
        '[data-export-phone="results"]',
        '09-results-v2-anthology',
        '01-anthology',
        'results-v2',
      );
    }

    // ── Results V3 — Adaptive ──
    if (selected.has('results-v3')) {
      setResultsVersion('v3');
      setResultsCompareMode(false);
      await tick(400);
      await captureWithProgress(
        '[data-export-phone="results"]',
        '10-results-v3-adaptive',
        '01-adaptive',
        'results-v3',
      );
    }

    setExportProgress({ current: totalFiles, total: totalFiles, label: 'Packaging zip...' });
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rosebud-pattern-discovery-screens-${new Date().toISOString().slice(0, 10)}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExportProgress(null);
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

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

  // V5 conditionally inserts a HealthKit sync step when the user
  // picked any syncable body goal (sleep, cycle, exercise). The
  // meds-supps detail input moved inline onto the Body screen itself,
  // so there's no longer a separate details step. Final step is the
  // celebration screen. Flow shape:
  //   syncable picked:    Intent → Body → HealthSync → Confirmation
  //   no syncable picked: Intent → Body → Confirmation
  const v5HasSyncable = (onboardingV5.data.goals || []).some((id) =>
    ['sleep', 'cycle', 'exercise'].includes(id),
  );
  const v5Total = v5HasSyncable ? 4 : 3;
  const v5SkipAll = () => {
    // Skip setup entirely — clear every pick and jump to the celebration
    // screen. Matches the Skip link on Intent.
    onboardingV5.setData({ goals: [], customGoal: '', takingDetail: '' });
    onboardingV5.goTo(v5Total - 1);
  };
  const onboardingV5Screens = [
    <OnboardingV5Intent key="v5intent" step={0} total={v5Total} data={onboardingV5.data} setData={onboardingV5.setData} onNext={onboardingV5.next} onSkipAll={v5SkipAll} />,
    <OnboardingV5Body key="v5body" step={1} total={v5Total} data={onboardingV5.data} setData={onboardingV5.setData} onNext={onboardingV5.next} onBack={onboardingV5.back} />,
    ...(v5HasSyncable
      ? [<OnboardingV5HealthSync key="v5healthsync" step={2} total={v5Total} data={onboardingV5.data} onNext={onboardingV5.next} onBack={onboardingV5.back} />]
      : []),
    <OnboardingV5Confirmation key="v5confirm" step={v5Total - 1} total={v5Total} data={onboardingV5.data} onBack={onboardingV5.back} onReset={() => onboardingV5.goTo(0)} />,
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-background)]">
      <TopNav
        sticky={false}
        className="bg-[var(--color-surface)]/95"
        rightSlot={
          <div className="flex items-center gap-[8px]">
            <Link
              to="/presentation"
              className="inline-flex items-center gap-[6px] px-[12px] py-[7px] rounded-full text-[13px] font-[500] bg-[var(--color-background)] border border-[var(--color-outline)] text-[var(--color-on-background)] hover:border-[var(--color-on-background)] transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px]">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              Present overview
            </Link>
            <button
              onClick={() => setExportModalOpen(true)}
              disabled={!!exportProgress}
              className="inline-flex items-center gap-[6px] px-[12px] py-[7px] rounded-full text-[13px] font-[500] bg-[var(--color-on-background)] text-[var(--color-background)] hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60 disabled:cursor-wait"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px]">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {exportProgress
                ? `${exportProgress.current}/${exportProgress.total}`
                : 'Export screens'}
            </button>
          </div>
        }
      />
      <ExportModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        flows={exportFlows}
        onExport={runExport}
      />
      {/* Export progress overlay */}
      {exportProgress && (
        <div className="fixed bottom-[20px] right-[20px] z-50 bg-[var(--color-on-background)] text-[var(--color-background)] rounded-[12px] px-[16px] py-[12px] shadow-lg max-w-[320px]">
          <div className="text-[13px] font-[500] mb-[6px]">
            Capturing screens... {exportProgress.current} / {exportProgress.total}
          </div>
          <div className="text-[11px] opacity-70 mb-[8px] truncate">{exportProgress.label}</div>
          <div className="h-[4px] bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-200"
              style={{ width: `${(exportProgress.current / exportProgress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

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

                {/* Mood data points — emotes at global min/max, dots elsewhere */}
                {(() => {
                  const moodData = [
                    { x: 72, y: 208, score: 5.5 },
                    { x: 120, y: 222, score: 4.8 },
                    { x: 168, y: 190, score: 6.2 },
                    { x: 216, y: 210, score: 5.4 },
                    { x: 264, y: 170, score: 7.0 },
                    { x: 312, y: 150, score: 7.8 },
                    { x: 360, y: 183, score: 6.5 },
                    { x: 408, y: 158, score: 7.5 },
                  ];
                  const minIdx = moodData.reduce((m, d, i, a) => (d.score < a[m].score ? i : m), 0);
                  const maxIdx = moodData.reduce((m, d, i, a) => (d.score > a[m].score ? i : m), 0);
                  return moodData.map((d, i) => {
                    const emote =
                      i === minIdx ? '/src/symbols/emotes/mood-unimpressed.svg' :
                      i === maxIdx ? '/src/symbols/emotes/joy.svg' :
                      null;
                    return (
                      <g key={i} className="animate-hero-dot" style={{ animationDelay: `${2.2 + i * 0.08}s` }}>
                        {emote ? (
                          <image href={emote} x={d.x - 12} y={d.y - 12} width="24" height="24" />
                        ) : (
                          <>
                            <circle cx={d.x} cy={d.y} r="7" fill="#E31665" fillOpacity="0.06" />
                            <circle cx={d.x} cy={d.y} r="4" fill="white" stroke="#E31665" strokeWidth="2" />
                          </>
                        )}
                      </g>
                    );
                  });
                })()}

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
          <div className="max-w-[820px] mx-auto text-center">
            <span className="inline-block text-[13px] font-[600] tracking-[0.06em] uppercase text-[var(--color-secondary-text)] mb-[32px]">
              The Opportunity
            </span>

            {/* Quote as headline */}
            <div className="relative mb-[28px]">
              <span
                aria-hidden="true"
                className="absolute -top-[60px] left-1/2 -translate-x-1/2 text-[220px] leading-[1] font-[700] select-none pointer-events-none"
                style={{ color: '#7CC4AF', opacity: 0.14, fontFamily: 'Georgia, serif' }}
              >
                &ldquo;
              </span>
              <blockquote className="relative text-[28px] md:text-[40px] leading-[38px] md:leading-[52px] font-[500] text-[var(--color-on-background)] tracking-[-0.02em]">
                I don&apos;t want overly validating insights. I want it to challenge me. I want to see what I can&apos;t see.
              </blockquote>
            </div>

            {/* Attribution */}
            <div className="flex items-center justify-center gap-[10px] mb-[40px]">
              <div
                className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-[13px] font-[600] text-white shrink-0"
                style={{ backgroundColor: '#7CC4AF' }}
              >
                G
              </div>
              <span className="text-[14px] leading-[20px] font-[450] text-[var(--color-secondary-text)]">
                <span className="font-[600] text-[var(--color-on-background)]">Gillian</span> · Post-crisis, daily voice journaler
              </span>
            </div>

            {/* Divider */}
            <div className="w-[40px] h-[2px] bg-[var(--color-outline-light)] mx-auto mb-[32px]" />

            {/* Answer — product thesis */}
            <p className="text-[17px] md:text-[18px] leading-[27px] md:leading-[28px] font-[450] text-[var(--color-secondary-text)] max-w-[620px] mx-auto">
              Rosebud already excels at reframing the present moment. The opportunity is to draw from weeks and months of history, surfacing patterns users can&apos;t spot alone. Once the initial magic settles, clearly seeing their own evolution is what keeps users coming back.
            </p>
          </div>
        </section>

        {/* ═══ PROJECT SCOPE ═══ */}
        <section className="pt-[40px] md:pt-[60px] pb-[100px]">
          <div className="text-center max-w-[720px] mx-auto mb-[56px]">
            <span className="inline-block text-[13px] font-[600] tracking-[0.06em] uppercase text-[var(--color-secondary-text)] mb-[16px]">
              Project Scope
            </span>
            <h2 className="text-[28px] md:text-[36px] leading-[36px] md:leading-[44px] font-[700] text-[var(--color-on-background)] mb-[20px] tracking-[-0.02em]">
              From two flows outward
            </h2>
            <p className="text-[17px] md:text-[18px] leading-[27px] md:leading-[28px] font-[450] text-[var(--color-secondary-text)]">
              Three days isn&apos;t enough to redesign an entire product, so I started with the two load-bearing flows. Each one surfaced the next problem worth solving, and the scope grew from there.
            </p>

            {/* Project Overview PDF download */}
            <a
              href="/rosebud-project-overview.pdf"
              download
              className="inline-flex items-center gap-[8px] mt-[24px] px-[18px] py-[11px] rounded-full bg-[var(--color-on-background)] text-[var(--color-background)] text-[14px] leading-[18px] font-[600] hover:opacity-90 transition-opacity"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <polyline points="9 15 12 18 15 15" />
              </svg>
              Project Overview PDF
            </a>
          </div>

          {/* Three stages — side by side on wide screens, stacked on mobile */}
          <div className="max-w-[1080px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-[20px] md:gap-[20px]">
            {[
              {
                number: '01',
                label: 'The starting point',
                title: 'Input and output',
                body: 'Pattern discovery has two ends: the signal going in, and the payoff coming out. I started here first, because decisions at the edges shape everything in between.',
                concepts: ['Pattern Tracking Onboarding', 'Pattern Results & Insights'],
                accent: '#E31665',
              },
              {
                number: '02',
                label: 'What the input revealed',
                title: 'Some things aren\'t stories',
                body: 'Onboarding surfaced a gap. Users can tell Rosebud what to track—meds, sleep, cycle—but the entry had nowhere to log it. Journaling is narrative. These are tags.',
                concepts: ['Quick tracking with each entry'],
                accent: '#7CC4AF',
              },
              {
                number: '03',
                label: 'The other half of the loop',
                title: 'Tools for looking back',
                body: 'Pattern discovery means looking back. But History was a flat scroll, and users couldn\'t save the insights that landed. Bookmarks fix both, and also tell Rosebud what each user values.',
                concepts: ['History', 'Bookmarks'],
                accent: '#E4AD51',
              },
            ].map((stage) => (
              <div
                key={stage.number}
                className="card-soft p-[24px] md:p-[28px] flex flex-col gap-[14px]"
              >
                <div className="flex items-baseline gap-[12px]">
                  <span
                    className="text-[26px] leading-[30px] font-[700] tracking-[-0.02em]"
                    style={{ color: stage.accent }}
                  >
                    {stage.number}
                  </span>
                  <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[var(--color-secondary-text)]">
                    {stage.label}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-[19px] md:text-[21px] leading-[26px] md:leading-[28px] font-[700] text-[var(--color-on-background)] mb-[10px] tracking-[-0.01em]">
                    {stage.title}
                  </h3>
                  <p className="text-[14px] md:text-[15px] leading-[22px] md:leading-[23px] font-[450] text-[var(--color-secondary-text)]">
                    {stage.body}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-x-[8px] gap-y-[6px] pt-[14px] border-t border-dashed border-[var(--color-outline-light)]">
                  <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[var(--color-secondary-text)] w-full mb-[2px]">
                    Shows up in
                  </span>
                  {stage.concepts.map((concept) => (
                    <span
                      key={concept}
                      className="inline-flex items-center gap-[5px] px-[9px] py-[4px] rounded-full bg-[var(--color-surface-variant)] text-[11px] leading-[14px] font-[500] text-[var(--color-on-background)]"
                    >
                      <span
                        className="w-[5px] h-[5px] rounded-full"
                        style={{ backgroundColor: stage.accent }}
                      />
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* ═══ WHERE IT LIVES ═══ */}
        <section className="pt-[40px] pb-[180px]">
          <div
            className="relative rounded-[24px] md:rounded-[32px] px-[24px] py-[56px] md:px-[64px] md:py-[72px] overflow-hidden"
            style={{
              backgroundImage: 'radial-gradient(circle, color-mix(in srgb, var(--color-outline) 60%, transparent) 1px, transparent 1.2px)',
              backgroundSize: '22px 22px',
              backgroundPosition: '0 0',
              maskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)',
            }}
          >
          <div className="text-center max-w-[680px] mx-auto mb-[48px]">
            <span className="inline-block text-[13px] font-[600] tracking-[0.06em] uppercase text-[var(--color-secondary-text)] mb-[16px]">
              Where It Lives
            </span>
            <h2 className="text-[24px] md:text-[32px] leading-[32px] md:leading-[40px] font-[700] text-[var(--color-on-background)] mb-[16px] tracking-[-0.02em]">
              Same Nav, Sharper Intent
            </h2>
            <p className="text-[18px] leading-[28px] font-[450] text-[var(--color-secondary-text)]">
              Two micro-changes. A pen invites the user to write. Patterns replaces Insights so the tab tells users what they&rsquo;ll actually find. No new real estate, no new muscle memory, sharper meaning.
            </p>
          </div>

          {(() => {
            // Icons used in both before and after
            const todayIcon = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[22px] h-[22px]"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2m-10-10h2m16 0h2m-3.5-6.5l-1.4 1.4M6.3 17.7l-1.4 1.4M6.3 6.3L4.9 4.9m12.8 12.8l1.4 1.4"/></svg>;
            const exploreIcon = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[22px] h-[22px]"><circle cx="12" cy="12" r="10"/><path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z"/></svg>;
            const historyIcon = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[22px] h-[22px]"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>;

            // Center button — plus (before) and pen (after)
            const plusCenter = (
              <div className="w-[44px] h-[44px] rounded-full bg-[#000000] flex items-center justify-center -mt-[10px]">
                <svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" className="w-[22px] h-[22px]"><path d="M12 5v14m-7-7h14"/></svg>
              </div>
            );
            const penCenter = (
              <div className="w-[44px] h-[44px] rounded-full bg-[#000000] flex items-center justify-center -mt-[10px]">
                <svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
            );

            // 4th-slot tabs — Insights (before) and Patterns (after)
            const insightsTab = { key: 'insights', label: 'Insights', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]"><path d="M9 21h6"/><path d="M12 3a6 6 0 00-4 10.5V17h8v-3.5A6 6 0 0012 3z"/></svg> };
            const patternsTab = { key: 'patterns', label: 'Patterns', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[22px] h-[22px]"><path d="M3 3v18h18"/><path d="M7 16l4-4 4 4 5-6"/></svg> };

            function NavBar({ centerSlot, fourthTab, highlightKeys, highlightColor }) {
              const tabs = [
                { key: 'today', label: 'Today', icon: todayIcon, isCenter: false },
                { key: 'explore', label: 'Explore', icon: exploreIcon, isCenter: false },
                { key: 'write', label: '', icon: centerSlot, isCenter: true },
                { ...fourthTab, isCenter: false },
                { key: 'history', label: 'History', icon: historyIcon, isCenter: false },
              ];
              return (
                <div className="card-soft p-[24px] w-[320px]">
                  <div className="flex items-end justify-around">
                    {tabs.map((tab) => {
                      const isHighlight = highlightKeys.includes(tab.key);
                      // Center slot is always rendered at full opacity since it's the action button
                      const isCenter = tab.isCenter;
                      return (
                        <div
                          key={tab.key}
                          className="relative flex flex-col items-center gap-[4px]"
                          style={{
                            color: isCenter ? '#000000' : (isHighlight ? highlightColor : '#E5E5E5'),
                            opacity: isCenter ? 1 : (isHighlight ? 1 : 0.5),
                          }}
                        >
                          {isHighlight && !isCenter && (
                            <span
                              className="absolute -inset-x-[10px] -inset-y-[6px] rounded-[10px]"
                              style={{ backgroundColor: `${highlightColor}12` }}
                            />
                          )}
                          {isHighlight && isCenter && (
                            <span
                              className="absolute -inset-x-[6px] -inset-y-[6px] rounded-full"
                              style={{ backgroundColor: `${highlightColor}1f` }}
                            />
                          )}
                          <div className="relative">{tab.icon}</div>
                          {tab.label && <span className="relative text-[10px] font-[500]">{tab.label}</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }

            return (
              <div className="flex justify-center items-start gap-[28px] flex-wrap">
                {/* Before */}
                <div className="flex flex-col items-center gap-[12px]">
                  <span className="text-[11px] font-[600] tracking-[0.08em] uppercase text-[var(--color-secondary-text)]">Before</span>
                  <NavBar
                    centerSlot={plusCenter}
                    fourthTab={insightsTab}
                    highlightKeys={['write', 'insights']}
                    highlightColor="#8B828B"
                  />
                  <div className="flex flex-col items-center gap-[4px] mt-[8px]">
                    <span className="text-[11px] font-[450] text-[var(--color-secondary-text)]">A generic plus.</span>
                    <span className="text-[11px] font-[450] text-[var(--color-secondary-text)]">A vague label.</span>
                  </div>
                </div>

                {/* After */}
                <div className="flex flex-col items-center gap-[12px]">
                  <span className="text-[11px] font-[600] tracking-[0.08em] uppercase text-[#E31665]">After</span>
                  <NavBar
                    centerSlot={penCenter}
                    fourthTab={patternsTab}
                    highlightKeys={['write', 'patterns']}
                    highlightColor="#E31665"
                  />
                  <div className="flex flex-col items-center gap-[4px] mt-[8px]">
                    <span className="text-[11px] font-[500] text-[#E31665]">A pen invites writing.</span>
                    <span className="text-[11px] font-[500] text-[#E31665]">A name that means something.</span>
                  </div>
                </div>
              </div>
            );
          })()}
          </div>
        </section>

        {/* ═══ CONCEPT NAV — sticky anchor links above the concepts ═══ */}
        <div className="sticky top-0 z-40 bg-[var(--color-background)]">
          {/* Top line — fades out at left/right edges */}
          <div
            className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
            style={{
              background:
                'linear-gradient(to right, transparent 0%, var(--color-outline-light) 20%, var(--color-outline-light) 80%, transparent 100%)',
            }}
          />
          {/* Bottom line — fades out at left/right edges */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[1px] pointer-events-none"
            style={{
              background:
                'linear-gradient(to right, transparent 0%, var(--color-outline-light) 20%, var(--color-outline-light) 80%, transparent 100%)',
            }}
          />
          <div className="relative max-w-[1400px] mx-auto px-[16px] md:px-[24px] h-[56px] flex items-center justify-center gap-[4px] md:gap-[8px] overflow-x-auto">
            {[
              { id: 'onboarding', label: 'Onboarding' },
              { id: 'tracking', label: 'Tracking' },
              { id: 'results', label: 'Results' },
              { id: 'history', label: 'History' },
            ].map((item) => {
              const isActive = activeConcept === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`relative shrink-0 h-full px-[12px] md:px-[16px] flex items-center text-[13px] md:text-[14px] leading-[20px] font-[500] transition-colors ${
                    isActive
                      ? 'text-[var(--color-on-background)]'
                      : 'text-[var(--color-secondary-text)] hover:text-[var(--color-on-background)]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute left-[12px] right-[12px] md:left-[16px] md:right-[16px] bottom-0 h-[2px] bg-[#E31665]" />
                  )}
                </a>
              );
            })}
          </div>
        </div>

        {/* ═══ ONBOARDING FLOW ═══ */}
        <section id="onboarding" className="pt-[120px] pb-[100px] scroll-mt-[72px]">
          {(() => {
            const versions = [
              {
                id: 'v5',
                name: 'Curiosity-led',
                status: 'latest',
                tagline: 'Ask what the user wants to understand, hide the rest',
                description: 'Patterns (what Rosebud notices in your writing) and logs (sleep, cycle, medication) feed the same pattern-recognition system but stay visually separated in the UI. Earlier versions blurred the two. Rosebud handles cadence and routing with opinionated defaults so users aren\u2019t burdened with decisions they shouldn\u2019t have to make. The body step is reframed as integrations: Apple Health as the primary path, plus a searchable catalog of specialty apps like Flo, Oura, Whoop, and Strava for data that lives elsewhere.',
              },
              {
                id: 'v1',
                name: 'Guided',
                status: 'exploration',
                tagline: 'Step-by-step with preset choices',
                description: 'First exploration. Capture what matters during onboarding so the AI knows what to look for from day one. Treated all tracking as one list and asked users to pick a reporting cadence.',
              },
              {
                id: 'v2',
                name: 'Intent-first',
                status: 'exploration',
                tagline: 'Start from what you want to understand',
                description: 'Second exploration. A more conversational approach that frames tracking around intent, not categories. Still mixed loggers with patterns and still asked about cadence.',
              },
              {
                id: 'v3',
                name: 'Zero-friction',
                status: 'exploration',
                tagline: 'Set up while journaling',
                description: 'Third exploration, the most seamless option. Pattern setup happens inline during the first journal session as a natural conversation with the AI. Dropped the separate screens entirely but still asked how often users wanted updates.',
              },
            ];
            const activeIdx = versions.findIndex(v => v.id === onboardingVersion);
            const activeVersion = versions[activeIdx];
            const allViewed = versions.every(v => viewedVersions.has(v.id));

            const renderPhone = (vid, scale = 1) => {
              const inner = vid === 'v1' ? (
                <PhoneFrame showNavBar={onboarding.step === onboardingScreens.length - 1} activeTab="home">
                  {onboardingScreens[onboarding.step]}
                </PhoneFrame>
              ) : vid === 'v2' ? (
                <PhoneFrame showNavBar={false}>
                  {onboardingV2Screens[onboardingV2.step]}
                </PhoneFrame>
              ) : vid === 'v3' ? (
                <PhoneFrame showNavBar={false} showStatusBar={true}>
                  <OnboardingV3Journal ref={v3Ref} />
                </PhoneFrame>
              ) : (
                <PhoneFrame showNavBar={false}>
                  {onboardingV5Screens[onboardingV5.step]}
                </PhoneFrame>
              );
              return inner;
            };

            /* Horizontal entry-point flow chart — shown above the demo area */
            const FlowChart = () => {
              const entryPoints = [
                { id: 'signup', label: 'New signup', sub: 'Formal onboarding flow', versionId: 'v1' },
                { id: 'patterns', label: 'Taps Patterns tab', sub: 'Contextual, first time', versionId: 'v2' },
                { id: 'chat', label: 'Starts first chat', sub: 'Inline while writing', versionId: 'v3' },
              ];
              const versionMeta = {
                v1: { label: 'V1 · Guided', color: '#E31665' },
                v2: { label: 'V2 · Intent-first', color: '#E4AD51' },
                v3: { label: 'V3 · Zero-friction', color: '#5ABA9D' },
              };
              return (
                <div className="mb-[32px]">
                  <span className="text-[11px] leading-[14px] font-[600] tracking-[0.08em] uppercase text-[var(--color-secondary-text)] block mb-[12px]">
                    Entry points
                  </span>
                  <div className="relative rounded-[16px] border border-[var(--color-outline-light)] bg-[var(--color-surface)] px-[16px] py-[20px] md:px-[24px] md:py-[24px] overflow-hidden">
                    {/* Dotted background grid for blueprint feel */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundImage: 'radial-gradient(circle, color-mix(in srgb, var(--color-outline) 50%, transparent) 1px, transparent 1.2px)',
                        backgroundSize: '20px 20px',
                        maskImage: 'radial-gradient(ellipse at center, black 55%, transparent 100%)',
                        WebkitMaskImage: 'radial-gradient(ellipse at center, black 55%, transparent 100%)',
                      }}
                    />

                    <div className="relative flex flex-col md:flex-row items-stretch justify-between gap-[20px] md:gap-[12px]">
                      {entryPoints.map((ep, i) => {
                        const v = versionMeta[ep.versionId];
                        return (
                          <div key={ep.id} className="flex-1 flex flex-col items-center gap-[8px]">
                            {/* Entry point card */}
                            <div className="w-full bg-[var(--color-background)] border border-dashed border-[var(--color-outline)] rounded-[10px] px-[12px] py-[10px] text-center">
                              <div className="text-[12px] leading-[16px] font-[600] text-[var(--color-on-background)]">{ep.label}</div>
                              <div className="text-[10px] leading-[13px] font-[450] text-[var(--color-secondary-text)] mt-[1px]">{ep.sub}</div>
                            </div>
                            {/* Arrow down */}
                            <svg viewBox="0 0 12 18" className="w-[10px] h-[14px]" fill="none" stroke="var(--color-outline)" strokeWidth="1.5">
                              <path d="M6 1v15m0 0l-4-4m4 4l4-4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {/* Version card */}
                            <div
                              className="w-full rounded-[10px] px-[12px] py-[10px] text-center text-white"
                              style={{ backgroundColor: v.color }}
                            >
                              <div className="text-[12px] leading-[16px] font-[700]">{v.label}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Converging lines + final node */}
                    <div className="relative mt-[16px] flex flex-col items-center">
                      <svg viewBox="0 0 600 40" className="w-full max-w-[540px] h-[28px]" fill="none" stroke="var(--color-outline)" strokeWidth="1.5">
                        {/* Three lines converging to center */}
                        <path d="M100 2 Q100 20 300 20" strokeLinecap="round" />
                        <path d="M300 2 L300 20" strokeLinecap="round" />
                        <path d="M500 2 Q500 20 300 20" strokeLinecap="round" />
                        <path d="M300 20 L300 36" strokeLinecap="round" />
                        <path d="M296 32 L300 36 L304 32" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="inline-flex items-center gap-[6px] px-[14px] py-[8px] rounded-full bg-[var(--color-on-background)] text-[var(--color-background)]">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[12px] h-[12px]">
                          <path d="M3 3v18h18" />
                          <path d="M7 16l4-4 4 4 5-6" />
                        </svg>
                        <span className="text-[12px] leading-[16px] font-[600]">Pattern results unlock</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            };

            const HeaderText = ({ showSubtitle = true }) => (
              <>
                <h2 className={`text-[24px] md:text-[32px] leading-[32px] md:leading-[40px] font-[700] text-[var(--color-on-background)] tracking-[-0.02em] ${showSubtitle ? 'mb-[8px]' : ''}`}>
                  Pattern Tracking Onboarding
                </h2>
                {showSubtitle && (
                  <p className="text-[16px] md:text-[17px] leading-[24px] md:leading-[26px] font-[450] text-[var(--color-secondary-text)]">
                    The first moment users tell Rosebud what to watch for. Three approaches, different tradeoffs.
                  </p>
                )}
              </>
            );

            const ModeToggle = () => (
              <div className="inline-flex self-start rounded-[12px] border border-[var(--color-outline-light)] bg-[var(--color-surface)] p-[4px]">
                <button
                  onClick={() => setCompareMode(false)}
                  className={`px-[16px] py-[8px] text-[13px] md:text-[14px] leading-[20px] font-[500] rounded-[8px] transition-colors cursor-pointer ${
                    !compareMode
                      ? 'bg-[var(--color-on-background)] text-[var(--color-background)]'
                      : 'bg-transparent text-[var(--color-secondary-text)] hover:text-[var(--color-on-background)]'
                  }`}
                >
                  Single view
                </button>
                <button
                  onClick={() => {
                    setCompareMode(true);
                    setViewedVersions(new Set(versions.map(v => v.id)));
                  }}
                  className={`px-[16px] py-[8px] text-[13px] md:text-[14px] leading-[20px] font-[500] rounded-[8px] transition-colors cursor-pointer ${
                    compareMode
                      ? 'bg-[var(--color-on-background)] text-[var(--color-background)]'
                      : 'bg-transparent text-[var(--color-secondary-text)] hover:text-[var(--color-on-background)]'
                  }`}
                >
                  Compare versions
                </button>
              </div>
            );

            return (
              <div className="max-w-[960px] mx-auto">
                {/* Stacked modes with choreographed transition */}
                <div className="grid">
                  {/* ─── SINGLE MODE: Left col (header + cards) + right phone ─── */}
                  <div
                    className={`col-start-1 row-start-1 flex flex-col lg:flex-row gap-[32px] md:gap-[48px] items-start transition-all duration-[500ms] ease-out ${
                      !compareMode
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-0 -translate-x-6 pointer-events-none'
                    }`}
                  >
                    {/* Left — header + version cards */}
                    <div className="flex-1 max-w-[480px] flex flex-col gap-[10px]">
                      <HeaderText />
                      <div className="mt-[12px]" />
                      <ModeToggle />
                      <div className="mt-[12px]" />
                      {versions.map((v) => {
                        const isActive = onboardingVersion === v.id;
                        const isLatest = v.status === 'latest';
                        return (
                          <button
                            key={v.id}
                            onClick={() => selectVersion(v.id)}
                            className={`text-left p-[16px] rounded-[14px] border transition-all cursor-pointer ${
                              isActive
                                ? 'border-[var(--color-on-background)] bg-[var(--color-surface)] shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
                                : 'border-[var(--color-outline-light)] bg-transparent hover:border-[var(--color-outline)] hover:bg-[var(--color-surface)]'
                            }`}
                          >
                            <div className="flex items-start gap-[14px]">
                              <div
                                className={`shrink-0 inline-flex items-center justify-center gap-[4px] px-[10px] h-[28px] rounded-full text-[11px] font-[700] tracking-[0.04em] uppercase transition-colors ${
                                  isLatest
                                    ? 'bg-[#FFE2ED] text-[#A40742]'
                                    : 'bg-[var(--color-surface-variant)] text-[var(--color-secondary-text)]'
                                }`}
                              >
                                {isLatest && (
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-[10px] h-[10px]">
                                    <path d="M12 2l2.09 6.26L20 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l5.91-1.01L12 2z" />
                                  </svg>
                                )}
                                {isLatest ? 'Latest' : v.id.toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-[6px] mb-[2px]">
                                  <span className="text-[15px] leading-[22px] font-[600] text-[var(--color-on-background)]">{v.name}</span>
                                </div>
                                <p className="text-[13px] leading-[19px] font-[450] text-[var(--color-secondary-text)]">{v.tagline}</p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                      {/* Description of active version */}
                      <p className="text-[13px] leading-[19px] font-[450] text-[var(--color-secondary-text)] mt-[8px] px-[4px]">
                        {activeVersion.description}
                      </p>
                    </div>

                    {/* Right — single phone */}
                    <div className="flex-1 flex justify-center lg:justify-end">
                      <div className="w-full max-w-[340px]" data-export-phone="onboarding">
                        {renderPhone(onboardingVersion)}
                        {/* Replay caption — lives OUTSIDE the phone so the
                            mockup stays clean and the replay control reads
                            as a prototype-level affordance. Wrapped in a
                            centered flex container (not items-center on
                            the phone wrapper itself) so the phone wrapper
                            stays a plain block — PhoneFrame's internal
                            scale calculation breaks in a flex context
                            without an explicit w-full child, rendering
                            the phone at full 360px instead of scaled. */}
                        {onboardingVersion === 'v5' && onboardingV5.step === v5Total - 1 && (
                          <ReplayButton onClick={() => onboardingV5.goTo(0)} />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ─── COMPARE MODE: Header at top + 3 phones below ─── */}
                  <div
                    className={`col-start-1 row-start-1 flex flex-col transition-all duration-[500ms] ease-out ${
                      compareMode
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-0 translate-x-6 pointer-events-none'
                    }`}
                  >
                    <div className="mb-[20px] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-[16px]">
                      <div className="max-w-[600px]">
                        <HeaderText showSubtitle={false} />
                      </div>
                      <ModeToggle />
                    </div>

                    {/* Version selector — pick up to 3 to compare side-by-side.
                        Soft outlined pills; a small check glyph marks the
                        selected ones. No color inversion so selected and
                        unselected live at a similar visual weight. */}
                    <div className="mb-[24px] flex items-center flex-wrap gap-[8px]">
                      <span className="text-[11px] leading-[14px] font-[500] text-[var(--color-secondary-text)] mr-[2px]">
                        Compare
                      </span>
                      {versions.map((v) => {
                        const isSelected = onboardingCompareSelection.includes(v.id);
                        const isLatest = v.status === 'latest';
                        return (
                          <button
                            key={v.id}
                            onClick={() => {
                              setOnboardingCompareSelection((prev) => {
                                if (isSelected) {
                                  // Prevent dropping below 1 so the grid is never empty
                                  if (prev.length <= 1) return prev;
                                  return prev.filter((id) => id !== v.id);
                                }
                                // Adding: append to end, evict oldest (front) if at cap
                                const next = [...prev, v.id];
                                if (next.length > 3) next.shift();
                                return next;
                              });
                            }}
                            className={`inline-flex items-center gap-[6px] pl-[8px] pr-[12px] py-[6px] rounded-full border transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[var(--color-surface-variant)] border-[var(--color-outline)] text-[var(--color-on-background)]'
                                : 'bg-transparent border-[var(--color-outline-light)] text-[var(--color-secondary-text)] hover:border-[var(--color-outline)] hover:text-[var(--color-on-background)]'
                            }`}
                          >
                            {/* Fixed-width icon slot so selected/unselected
                                pills don't shift horizontally when toggling */}
                            <span className="w-[12px] h-[12px] inline-flex items-center justify-center shrink-0">
                              {isSelected ? (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-[11px] h-[11px]">
                                  <path d="M20 6L9 17l-5-5" />
                                </svg>
                              ) : (
                                <span className="w-[8px] h-[8px] rounded-full border border-current opacity-40" />
                              )}
                            </span>
                            <span className="text-[12px] leading-[16px] font-[500]">{v.name}</span>
                          </button>
                        );
                      })}
                      <span className="text-[10px] leading-[13px] font-[500] text-[var(--color-secondary-text)] ml-[2px]">
                        {onboardingCompareSelection.length} / 3
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] md:gap-[16px]">
                      {versions.filter((v) => onboardingCompareSelection.includes(v.id)).map((v, i) => {
                        return (
                          <div
                            key={v.id}
                            className="flex flex-col items-center gap-[12px]"
                            style={{
                              transitionDelay: compareMode ? `${i * 80}ms` : '0ms',
                              transform: compareMode ? 'translateX(0)' : 'translateX(20px)',
                              opacity: compareMode ? 1 : 0,
                              transition: 'transform 500ms ease-out, opacity 500ms ease-out',
                            }}
                          >
                            <button
                              onClick={() => { selectVersion(v.id); setCompareMode(false); }}
                              className="flex items-center gap-[8px] cursor-pointer hover:opacity-70 transition-opacity"
                              title="Focus on this version"
                            >
                              <span className="text-[15px] leading-[20px] font-[600] text-[var(--color-on-background)]">
                                {v.name}
                              </span>
                            </button>
                            <div className="w-full">
                              {renderPhone(v.id)}
                            </div>
                            <p className="text-[12px] leading-[17px] font-[450] text-[var(--color-secondary-text)] text-center max-w-[220px]">
                              {v.tagline}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </section>

        {/* ═══ ENTRY POINTS COMPARISON ═══ */}
        <section className="pb-[100px]">
          <div className="max-w-[960px] mx-auto">
            <div className="max-w-[640px] mb-[32px]">
              <span className="inline-block text-[11px] font-[600] tracking-[0.08em] uppercase text-[var(--color-secondary-text)] mb-[12px]">
                Entry points
              </span>
              <h2 className="text-[24px] md:text-[32px] leading-[32px] md:leading-[40px] font-[700] text-[var(--color-on-background)] mb-[12px] tracking-[-0.02em]">
                When should users meet this flow?
              </h2>
              <p className="text-[16px] md:text-[17px] leading-[24px] md:leading-[26px] font-[450] text-[var(--color-secondary-text)]">
                The onboarding variant is only half the story. The moment we trigger it matters as much as the design itself. Here&apos;s how each entry point trades off.
              </p>
            </div>

            {(() => {
              // Each entry point scored 0–3 on each dimension.
              // All rows are "higher = better" so dots scan consistently.
              const entryPoints = [
                {
                  id: 'signup',
                  label: 'New signup',
                  variant: 'V1 / V2',
                  bestFor: 'Users expecting a formal setup moment',
                  scores: { friction: 2, signal: 1, reach: 3, intent: 1 },
                },
                {
                  id: 'firstTap',
                  label: 'First Patterns tap',
                  variant: 'V1 / V2',
                  bestFor: 'Curious returning users',
                  scores: { friction: 3, signal: 2, reach: 1, intent: 3 },
                },
                {
                  id: 'delayed',
                  label: 'After X entries',
                  variant: 'V1 / V2',
                  bestFor: 'Data-rich personalization',
                  scores: { friction: 2, signal: 3, reach: 2, intent: 1 },
                },
                {
                  id: 'gear',
                  label: 'Patterns page gear icon',
                  variant: 'V1 / V2',
                  bestFor: 'Editing patterns after they\'re already set',
                  secondary: true,
                  scores: { friction: 3, signal: 0, reach: 1, intent: 3 },
                },
                {
                  id: 'firstEntry',
                  label: 'First journal entry',
                  variant: 'V3',
                  bestFor: 'Zero-friction activation',
                  scores: { friction: 3, signal: 2, reach: 3, intent: 1 },
                },
              ];

              const dimensions = [
                {
                  key: 'friction',
                  label: 'Low friction',
                  hint: 'How easy is it to complete?',
                },
                {
                  key: 'signal',
                  label: 'Signal quality',
                  hint: 'How personal is the data the AI gets?',
                },
                {
                  key: 'reach',
                  label: 'User reach',
                  hint: 'What fraction of users does this catch?',
                },
                {
                  key: 'intent',
                  label: 'User initiative',
                  hint: 'Did they actively seek out this moment?',
                },
              ];

              // Total points across all dimensions. Max per cell is 3
              // and there are 4 dimensions, so the theoretical ceiling
              // is 12. Used to rank entry points in the final row.
              const maxTotal = dimensions.length * 3;
              const totalFor = (ep) =>
                dimensions.reduce((sum, d) => sum + (ep.scores[d.key] || 0), 0);

              const Dots = ({ score }) => (
                <div className="flex items-center gap-[3px]">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className={`w-[8px] h-[8px] rounded-full ${
                        i < score
                          ? 'bg-[var(--color-on-background)]'
                          : 'bg-[var(--color-outline-light)]'
                      }`}
                    />
                  ))}
                </div>
              );

              return (
                <div className="flex flex-col gap-[16px]">
                  {/* Matrix — horizontal-only dividers, no vertical lines */}
                  <div className="card-soft overflow-x-auto p-[8px] md:p-[12px]">
                    <div className="min-w-[720px] grid grid-cols-[180px_repeat(5,1fr)] gap-x-[4px]">
                      {/* Header row: empty corner + entry point labels */}
                      <div className="px-[12px] pt-[12px] pb-[16px]" />
                      {entryPoints.map((ep) => (
                        <div
                          key={ep.id}
                          className="px-[12px] pt-[12px] pb-[16px] flex flex-col"
                        >
                          <span className="text-[14px] leading-[19px] font-[600] text-[var(--color-on-background)]">
                            {ep.label}
                          </span>
                        </div>
                      ))}

                      {/* Dimension rows */}
                      {dimensions.map((dim, dimIdx) => (
                        <>
                          <div
                            key={`${dim.key}-label`}
                            className="px-[12px] py-[16px] flex flex-col gap-[3px] border-t border-[var(--color-outline-light)]"
                          >
                            <span className="text-[14px] leading-[19px] font-[600] text-[var(--color-on-background)]">
                              {dim.label}
                            </span>
                            <span className="text-[12px] leading-[16px] font-[450] text-[var(--color-secondary-text)]">
                              {dim.hint}
                            </span>
                          </div>
                          {entryPoints.map((ep) => (
                            <div
                              key={`${dim.key}-${ep.id}`}
                              className="px-[12px] py-[16px] flex items-center justify-center border-t border-[var(--color-outline-light)]"
                            >
                              <Dots score={ep.scores[dim.key]} />
                            </div>
                          ))}
                        </>
                      ))}

                      {/* Total score row — sum of all dimension points.
                          Highlights the entry points that win on raw points. */}
                      {(() => {
                        const maxScore = Math.max(...entryPoints.map(totalFor));
                        return (
                          <>
                            <div className="px-[12px] py-[16px] flex flex-col gap-[3px] border-t border-[var(--color-outline-light)]">
                              <span className="text-[14px] leading-[19px] font-[600] text-[var(--color-on-background)]">
                                Total score
                              </span>
                              <span className="text-[12px] leading-[16px] font-[450] text-[var(--color-secondary-text)]">
                                Sum of points across all dimensions.
                              </span>
                            </div>
                            {entryPoints.map((ep) => {
                              const total = totalFor(ep);
                              const isTop = total === maxScore;
                              return (
                                <div
                                  key={`total-${ep.id}`}
                                  className="px-[12px] py-[16px] flex items-center justify-center border-t border-[var(--color-outline-light)]"
                                >
                                  <span
                                    className={`inline-flex items-baseline gap-[3px] ${
                                      isTop ? 'text-[#A40742]' : 'text-[var(--color-on-background)]'
                                    }`}
                                  >
                                    <span className="text-[20px] leading-[24px] font-[700] tracking-[-0.01em]">
                                      {total}
                                    </span>
                                    <span className="text-[11px] leading-[14px] font-[500] opacity-60">
                                      / {maxTotal}
                                    </span>
                                  </span>
                                </div>
                              );
                            })}
                          </>
                        );
                      })()}

                      {/* "Best for" row — softer separator, no heavy border */}
                      <div className="px-[12px] pt-[20px] pb-[12px] border-t border-[var(--color-outline-light)]">
                        <span className="text-[11px] leading-[14px] font-[600] tracking-[0.08em] uppercase text-[var(--color-secondary-text)]">
                          Best for
                        </span>
                      </div>
                      {entryPoints.map((ep) => (
                        <div
                          key={`${ep.id}-best`}
                          className="px-[12px] pt-[20px] pb-[12px] border-t border-[var(--color-outline-light)] flex flex-col gap-[5px]"
                        >
                          {ep.secondary && (
                            <span className="inline-flex self-start items-center text-[9px] leading-[12px] font-[600] tracking-[0.08em] uppercase px-[6px] py-[2px] rounded-full bg-[var(--color-outline-light)] text-[var(--color-secondary-text)]">
                              Secondary
                            </span>
                          )}
                          <span className="text-[13px] leading-[15px] font-[500] text-[var(--color-on-background)] block">
                            {ep.bestFor}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex items-center justify-end gap-[16px] text-[11px] leading-[14px] font-[450] text-[var(--color-secondary-text)] pr-[4px]">
                    <div className="flex items-center gap-[6px]">
                      <div className="flex items-center gap-[3px]">
                        <span className="w-[6px] h-[6px] rounded-full bg-[var(--color-outline-light)]" />
                        <span className="w-[6px] h-[6px] rounded-full bg-[var(--color-outline-light)]" />
                        <span className="w-[6px] h-[6px] rounded-full bg-[var(--color-outline-light)]" />
                      </div>
                      <span>Weak</span>
                    </div>
                    <div className="flex items-center gap-[6px]">
                      <div className="flex items-center gap-[3px]">
                        <span className="w-[6px] h-[6px] rounded-full bg-[var(--color-on-background)]" />
                        <span className="w-[6px] h-[6px] rounded-full bg-[var(--color-on-background)]" />
                        <span className="w-[6px] h-[6px] rounded-full bg-[var(--color-on-background)]" />
                      </div>
                      <span>Strong</span>
                    </div>
                  </div>

                  {/* Takeaway — matches the "Out of scope" callout style */}
                  <div className="flex flex-col sm:flex-row items-start gap-[12px] sm:gap-[16px] p-[20px] rounded-[14px] border border-dashed border-[var(--color-outline-light)] mt-[4px]">
                    <span className="text-[11px] leading-[14px] font-[600] tracking-[0.08em] uppercase text-[var(--color-secondary-text)] shrink-0 sm:mt-[2px]">
                      Takeaway
                    </span>
                    <p className="text-[14px] leading-[22px] font-[450] text-[var(--color-secondary-text)]">
                      The earlier explorations each earned a line in the final design.{' '}
                      <span className="font-[600] text-[var(--color-on-background)]">V3&rsquo;s zero-friction instinct</span> became the principle that no decision should block the first entry.{' '}
                      <span className="font-[600] text-[var(--color-on-background)]">V2&rsquo;s intent-first framing</span> shaped how we ask: goals, not taxonomies. And{' '}
                      <span className="font-[600] text-[var(--color-on-background)]">V1&rsquo;s guided cadence</span> is exactly the decision we took off the user&rsquo;s plate.{' '}
                      <span className="font-[600] text-[var(--color-on-background)]">Curiosity-led</span> is the version that kept what each one got right and dropped what none of them needed.
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        </section>

        {/* ═══ MID-CONVERSATION ONBOARDING ═══
             Conceptually part of the Onboarding story — scroll spy maps
             this section back to the Onboarding nav tab. Two versions
             of the same moment: Rosebud has been watching across entries
             and wants to propose patterns to track going forward. V1 is
             a formal modal, V2 is conversational in the blue journal
             voice. */}
        <section id="mid-convo-onboarding" className="pt-[16px] pb-[100px] scroll-mt-[72px]">
          <div className="max-w-[960px] mx-auto">
            {(() => {
              const versions = [
                {
                  id: 'v1',
                  name: 'Modal alert',
                  tagline: 'A formal pop-up mid-conversation',
                  description: 'When Rosebud notices a recurring thread across entries, it surfaces a modal over the thread with an explicit yes/no ask. Clear and unambiguous, but interrupts the writing flow and reads more like a system alert than Rosebud talking.',
                },
                {
                  id: 'v2',
                  name: 'Conversational',
                  tagline: 'Rosebud extends the thread in its own voice',
                  description: 'Instead of a modal, Rosebud speaks back in the same blue voice that asked \u201CWhat\u2019s on your mind?\u201D. The user replies in free text, parsed for yes/no intent, so the exchange reads as one continuous thread. No branded card intrusion, no context switch. Language stays observational: \u201CI noticed\u201D over \u201CI detected.\u201D',
                },
              ];
              const activeVersion = versions.find((v) => v.id === midConvoVersion) || versions[0];

              return (
                <div className="flex flex-col lg:flex-row gap-[32px] md:gap-[48px] items-center">
                  {/* Left — phone (plain block wrapper so PhoneFrame scales right) */}
                  <div className="flex-1 flex justify-center lg:justify-start order-2 lg:order-1">
                    <div className="w-full max-w-[340px]">
                      <PhoneFrame
                        showNavBar={false}
                        showStatusBar={true}
                        screenRef={setMidConvoPhoneScreen}
                      >
                        <MidConversationOnboarding
                          key={`${midConvoVersion}-${midConvoResetKey}`}
                          version={midConvoVersion}
                          portalContainer={midConvoPhoneScreen}
                        />
                      </PhoneFrame>
                      <ReplayButton onClick={() => setMidConvoResetKey((k) => k + 1)} />
                    </div>
                  </div>

                  {/* Right — headline + lede + version cards */}
                  <div className="flex-1 max-w-[480px] flex flex-col gap-[10px] order-1 lg:order-2">
                    <h2 className="text-[24px] md:text-[32px] leading-[32px] md:leading-[40px] font-[700] text-[var(--color-on-background)] tracking-[-0.02em] mb-[8px]">
                      Mid-conversation, low-friction onboarding
                    </h2>
                    <p className="text-[16px] md:text-[17px] leading-[24px] md:leading-[26px] font-[450] text-[var(--color-secondary-text)] mb-[12px]">
                      Rosebud pays attention as the user writes. When a recurring thread shows up across entries, it proposes what to watch for right inside the journal thread. No upfront decision, no chip tray on every entry.
                    </p>
                    {versions.map((v, i) => {
                      const isActive = midConvoVersion === v.id;
                      return (
                        <button
                          key={v.id}
                          onClick={() => selectMidConvoVersion(v.id)}
                          className={`text-left p-[16px] rounded-[14px] border transition-all cursor-pointer ${
                            isActive
                              ? 'border-[var(--color-on-background)] bg-[var(--color-surface)] shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
                              : 'border-[var(--color-outline-light)] bg-transparent hover:border-[var(--color-outline)] hover:bg-[var(--color-surface)]'
                          }`}
                        >
                          <div className="flex items-start gap-[14px]">
                            <div
                              className={`shrink-0 px-[10px] h-[28px] rounded-full flex items-center justify-center text-[11px] font-[700] tracking-[0.04em] uppercase transition-colors ${
                                isActive
                                  ? 'bg-[#E31665] text-white'
                                  : 'bg-[var(--color-surface-variant)] text-[var(--color-secondary-text)]'
                              }`}
                            >
                              V{i + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-[6px] mb-[2px]">
                                <span className="text-[15px] leading-[22px] font-[600] text-[var(--color-on-background)]">
                                  {v.name}
                                </span>
                              </div>
                              <p className="text-[13px] leading-[19px] font-[450] text-[var(--color-secondary-text)]">
                                {v.tagline}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                    <p className="text-[13px] leading-[19px] font-[450] text-[var(--color-secondary-text)] mt-[8px] px-[4px]">
                      {activeVersion.description}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
          <div className="max-w-[960px] mx-auto mt-[48px] border-t border-[var(--color-outline-light)]" />
        </section>

        {/* ═══ QUICK TRACKING (2 versions) ═══ */}
        <section id="tracking" className="pt-[16px] pb-[72px] scroll-mt-[72px]">
          <div className="max-w-[960px] mx-auto">
            {(() => {
              const versions = [
                {
                  id: 'v1',
                  name: 'Guided Stamp',
                  tagline: 'Post-save bottom sheet with explicit tiles',
                  description: 'After the entry is written, Finish entry opens a sheet asking about meds, period, and sleep as one-tap tiles. Skippable, but present. Matches the expectation that tracking is a deliberate moment.',
                },
                {
                  id: 'v2',
                  name: 'Inline Tag',
                  tagline: 'A tag icon in the footer toggles a chip tray',
                  description: 'A tag icon sits in the bottom row next to mic and image. Tapping it toggles a tray of optional chips (meds, period, sleep). Open by default so chips are visible right away, minimized with one tap. A small pink dot on the tag reminds the user when tags are still empty.',
                },
              ];
              const activeIdx = versions.findIndex((v) => v.id === trackingVersion);
              const activeVersion = versions[activeIdx];

              const renderPhone = (vid) => (
                <PhoneFrame showNavBar={false} showStatusBar={true}>
                  {vid === trackingVersion ? (
                    <TrackingFlow ref={trackingFlowRef} version={vid} />
                  ) : (
                    <TrackingFlow version={vid} />
                  )}
                </PhoneFrame>
              );

              const HeaderText = ({ showSubtitle = true }) => (
                <>
                  <h2
                    className={`text-[24px] md:text-[32px] leading-[32px] md:leading-[40px] font-[700] text-[var(--color-on-background)] tracking-[-0.02em] ${
                      showSubtitle ? 'mb-[8px]' : ''
                    }`}
                  >
                    Quick tracking with each entry
                  </h2>
                  {showSubtitle && (
                    <p className="text-[16px] md:text-[17px] leading-[24px] md:leading-[26px] font-[450] text-[var(--color-secondary-text)]">
                      Some things the user wants to track aren&apos;t stories. They&apos;re tags. Meds, period, sleep. The question isn&apos;t whether to capture them, it&apos;s how much to ask for.
                    </p>
                  )}
                </>
              );

              const ModeToggle = () => (
                <div className="inline-flex self-start rounded-[12px] border border-[var(--color-outline-light)] bg-[var(--color-surface)] p-[4px]">
                  <button
                    onClick={() => setTrackingCompareMode(false)}
                    className={`px-[16px] py-[8px] text-[13px] md:text-[14px] leading-[20px] font-[500] rounded-[8px] transition-colors cursor-pointer ${
                      !trackingCompareMode
                        ? 'bg-[var(--color-on-background)] text-[var(--color-background)]'
                        : 'bg-transparent text-[var(--color-secondary-text)] hover:text-[var(--color-on-background)]'
                    }`}
                  >
                    Single view
                  </button>
                  <button
                    onClick={() => {
                      setTrackingCompareMode(true);
                      setTrackingViewedVersions(new Set(versions.map((v) => v.id)));
                    }}
                    className={`px-[16px] py-[8px] text-[13px] md:text-[14px] leading-[20px] font-[500] rounded-[8px] transition-colors cursor-pointer ${
                      trackingCompareMode
                        ? 'bg-[var(--color-on-background)] text-[var(--color-background)]'
                        : 'bg-transparent text-[var(--color-secondary-text)] hover:text-[var(--color-on-background)]'
                    }`}
                  >
                    Compare both
                  </button>
                </div>
              );

              return (
                <>
                  <div className="grid">
                    {/* ─── SINGLE MODE ─── */}
                    <div
                      className={`col-start-1 row-start-1 flex flex-col lg:flex-row gap-[32px] md:gap-[48px] items-center transition-all duration-[500ms] ease-out ${
                        !trackingCompareMode
                          ? 'opacity-100 translate-x-0'
                          : 'opacity-0 -translate-x-6 pointer-events-none'
                      }`}
                    >
                      {/* Right (desktop) — phone. Source order keeps the
                          phone first so mobile shows content above the
                          phone via order classes. The lg:order flips
                          here put phone on the right so consecutive
                          sections don't share a side. */}
                      <div className="flex-1 flex justify-center lg:justify-end order-2 lg:order-2">
                        <div className="w-full max-w-[340px]" data-export-phone="tracking">
                          {renderPhone(trackingVersion)}
                        </div>
                      </div>

                      {/* Left (desktop) — header + version cards */}
                      <div className="flex-1 max-w-[480px] flex flex-col gap-[10px] order-1 lg:order-1">
                        <HeaderText />
                        <div className="mt-[12px]" />
                        <ModeToggle />
                        <div className="mt-[12px]" />
                        {versions.map((v, i) => {
                          const isActive = trackingVersion === v.id;
                          return (
                            <button
                              key={v.id}
                              onClick={() => selectTrackingVersion(v.id)}
                              className={`text-left p-[16px] rounded-[14px] border transition-all cursor-pointer ${
                                isActive
                                  ? 'border-[var(--color-on-background)] bg-[var(--color-surface)] shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
                                  : 'border-[var(--color-outline-light)] bg-transparent hover:border-[var(--color-outline)] hover:bg-[var(--color-surface)]'
                              }`}
                            >
                              <div className="flex items-start gap-[14px]">
                                <div
                                  className={`shrink-0 px-[10px] h-[28px] rounded-full flex items-center justify-center text-[11px] font-[700] tracking-[0.04em] uppercase transition-colors ${
                                    isActive
                                      ? 'bg-[#E31665] text-white'
                                      : 'bg-[var(--color-surface-variant)] text-[var(--color-secondary-text)]'
                                  }`}
                                >
                                  V{i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-[6px] mb-[2px]">
                                    <span className="text-[15px] leading-[22px] font-[600] text-[var(--color-on-background)]">
                                      {v.name}
                                    </span>
                                  </div>
                                  <p className="text-[13px] leading-[19px] font-[450] text-[var(--color-secondary-text)]">
                                    {v.tagline}
                                  </p>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                        <p className="text-[13px] leading-[19px] font-[450] text-[var(--color-secondary-text)] mt-[8px] px-[4px]">
                          {activeVersion.description}
                        </p>
                      </div>
                    </div>

                    {/* ─── COMPARE MODE ─── */}
                    <div
                      className={`col-start-1 row-start-1 flex flex-col transition-all duration-[500ms] ease-out ${
                        trackingCompareMode
                          ? 'opacity-100 translate-x-0'
                          : 'opacity-0 translate-x-6 pointer-events-none'
                      }`}
                    >
                      <div className="mb-[32px] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-[16px]">
                        <div className="max-w-[600px]">
                          <HeaderText showSubtitle={false} />
                        </div>
                        <ModeToggle />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] md:gap-[16px] max-w-[640px] mx-auto">
                        {versions.map((v, i) => (
                          <div
                            key={v.id}
                            className="flex flex-col items-center gap-[12px]"
                            style={{
                              transitionDelay: trackingCompareMode ? `${i * 80}ms` : '0ms',
                              transform: trackingCompareMode ? 'translateX(0)' : 'translateX(20px)',
                              opacity: trackingCompareMode ? 1 : 0,
                              transition: 'transform 500ms ease-out, opacity 500ms ease-out',
                            }}
                          >
                            <button
                              onClick={() => {
                                selectTrackingVersion(v.id);
                                setTrackingCompareMode(false);
                              }}
                              className="flex items-center gap-[8px] cursor-pointer hover:opacity-70 transition-opacity"
                              title="Focus on this version"
                            >
                              <span className="text-[15px] leading-[20px] font-[600] text-[var(--color-on-background)]">
                                {v.name}
                              </span>
                            </button>
                            <div className="w-full">
                              <PhoneFrame showNavBar={false} showStatusBar={true}>
                                <TrackingFlow version={v.id} />
                              </PhoneFrame>
                            </div>
                            <p className="text-[12px] leading-[17px] font-[450] text-[var(--color-secondary-text)] text-center max-w-[220px]">
                              {v.tagline}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
          <div className="max-w-[960px] mx-auto mt-[48px] border-t border-[var(--color-outline-light)]" />
        </section>

        {/* ═══ TRACKING COMPARISON MATRIX (removed) ═══ */}
        <section className="pb-[100px] hidden">
          <div className="max-w-[960px] mx-auto">
            <div className="max-w-[640px] mb-[32px]">
              <span className="inline-block text-[11px] font-[600] tracking-[0.08em] uppercase text-[var(--color-secondary-text)] mb-[12px]">
                Capture moment tradeoffs
              </span>
              <h2 className="text-[24px] md:text-[32px] leading-[32px] md:leading-[40px] font-[700] text-[var(--color-on-background)] mb-[12px] tracking-[-0.02em]">
                Which capture model fits which user?
              </h2>
              <p className="text-[16px] md:text-[17px] leading-[24px] md:leading-[26px] font-[450] text-[var(--color-secondary-text)]">
                Each version trades something for something. Same data, different feel. Same user goals, different levels of explicit effort.
              </p>
            </div>

            {(() => {
              const trackingVariants = [
                {
                  id: 'v1',
                  label: 'Guided Stamp',
                  variant: 'V1',
                  bestFor: 'Users who expect a deliberate tracking moment',
                  scores: { lowFriction: 1, captureRate: 3, calmness: 1, deliberateness: 3 },
                },
                {
                  id: 'v2',
                  label: 'Inline Tag',
                  variant: 'V2',
                  bestFor: 'Users who hate popups and want quiet control',
                  scores: { lowFriction: 3, captureRate: 1, calmness: 3, deliberateness: 1 },
                },
              ];

              const dimensions = [
                { key: 'lowFriction', label: 'Low friction', hint: 'How light is the capture action?' },
                { key: 'captureRate', label: 'Capture rate', hint: 'How often will users actually log?' },
                { key: 'calmness', label: 'Calmness', hint: 'How non-intrusive does it feel?' },
                { key: 'deliberateness', label: 'Feels intentional', hint: 'Does each log feel like a chosen moment?' },
              ];

              const Dots = ({ score }) => (
                <div className="flex items-center gap-[3px]">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className={`w-[8px] h-[8px] rounded-full ${
                        i < score
                          ? 'bg-[var(--color-on-background)]'
                          : 'bg-[var(--color-outline-light)]'
                      }`}
                    />
                  ))}
                </div>
              );

              return (
                <div className="flex flex-col gap-[16px]">
                  <div className="card-soft overflow-x-auto p-[8px] md:p-[12px]">
                    <div className="min-w-[480px] grid grid-cols-[180px_repeat(2,1fr)] gap-x-[4px]">
                      {/* Header row */}
                      <div className="px-[12px] pt-[12px] pb-[16px]" />
                      {trackingVariants.map((tv) => (
                        <div key={tv.id} className="px-[12px] pt-[12px] pb-[16px] flex flex-col items-center gap-[8px]">
                          <span
                            className="inline-flex items-center text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase px-[7px] py-[3px] rounded-full bg-[#FFE2ED] text-[#A40742]"
                          >
                            {tv.variant}
                          </span>
                          <span className="text-[14px] leading-[19px] font-[600] text-[var(--color-on-background)] text-center">
                            {tv.label}
                          </span>
                        </div>
                      ))}

                      {/* Dimensions */}
                      {dimensions.map((dim) => (
                        <div key={dim.key} className="contents">
                          <div className="px-[12px] py-[16px] flex flex-col gap-[3px] border-t border-[var(--color-outline-light)]">
                            <span className="text-[14px] leading-[19px] font-[600] text-[var(--color-on-background)]">
                              {dim.label}
                            </span>
                            <span className="text-[12px] leading-[16px] font-[450] text-[var(--color-secondary-text)]">
                              {dim.hint}
                            </span>
                          </div>
                          {trackingVariants.map((tv) => (
                            <div
                              key={`${dim.key}-${tv.id}`}
                              className="px-[12px] py-[16px] flex items-center justify-center border-t border-[var(--color-outline-light)]"
                            >
                              <Dots score={tv.scores[dim.key]} />
                            </div>
                          ))}
                        </div>
                      ))}

                      {/* Best for */}
                      <div className="px-[12px] pt-[20px] pb-[12px] border-t border-[var(--color-outline-light)]">
                        <span className="text-[11px] leading-[14px] font-[600] tracking-[0.08em] uppercase text-[var(--color-secondary-text)]">
                          Best for
                        </span>
                      </div>
                      {trackingVariants.map((tv) => (
                        <div
                          key={`${tv.id}-best`}
                          className="px-[12px] pt-[20px] pb-[12px] border-t border-[var(--color-outline-light)] flex flex-col gap-[5px]"
                        >
                          <span className="text-[13px] leading-[17px] font-[500] text-[var(--color-on-background)] block">
                            {tv.bestFor}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex items-center justify-end gap-[16px] text-[11px] leading-[14px] font-[450] text-[var(--color-secondary-text)] pr-[4px]">
                    <div className="flex items-center gap-[6px]">
                      <div className="flex items-center gap-[3px]">
                        <span className="w-[6px] h-[6px] rounded-full bg-[var(--color-outline-light)]" />
                        <span className="w-[6px] h-[6px] rounded-full bg-[var(--color-outline-light)]" />
                        <span className="w-[6px] h-[6px] rounded-full bg-[var(--color-outline-light)]" />
                      </div>
                      <span>Weak</span>
                    </div>
                    <div className="flex items-center gap-[6px]">
                      <div className="flex items-center gap-[3px]">
                        <span className="w-[6px] h-[6px] rounded-full bg-[var(--color-on-background)]" />
                        <span className="w-[6px] h-[6px] rounded-full bg-[var(--color-on-background)]" />
                        <span className="w-[6px] h-[6px] rounded-full bg-[var(--color-on-background)]" />
                      </div>
                      <span>Strong</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start gap-[12px] sm:gap-[16px] p-[20px] rounded-[14px] border border-dashed border-[var(--color-outline-light)] mt-[4px]">
                    <span className="text-[11px] leading-[14px] font-[600] tracking-[0.08em] uppercase text-[var(--color-secondary-text)] shrink-0 sm:mt-[2px]">
                      Takeaway
                    </span>
                    <p className="text-[14px] leading-[22px] font-[450] text-[var(--color-secondary-text)]">
                      V1 wins on capture rate and deliberateness, V2 wins on friction and calmness. They&apos;re genuine opposites. The strongest play is probably <span className="font-[600] text-[var(--color-on-background)]">V1 reserved for onboarding week</span> (so new users learn what&apos;s trackable via an unmissable moment) then <span className="font-[600] text-[var(--color-on-background)]">V2 as the ongoing default</span> (quiet tag icon with a pink dot reminder, out of the way once the habit lands).
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        </section>

        {/* ═══ RESULTS — empty state + 3 versions ═══ */}
        <section id="results" className="pb-[100px] scroll-mt-[72px]">
          <div className="max-w-[960px] mx-auto">
            <div className="flex flex-col lg:flex-row gap-[32px] md:gap-[48px] items-center">
              {/* Right on desktop — text (mobile: top) */}
              <div className="flex-1 max-w-[480px] order-1 lg:order-2">
                <h2 className="text-[24px] md:text-[32px] leading-[32px] md:leading-[40px] font-[700] text-[var(--color-on-background)] mb-[8px] tracking-[-0.02em]">
                  The Empty State
                </h2>
                <p className="text-[16px] md:text-[17px] leading-[24px] md:leading-[26px] font-[450] text-[var(--color-secondary-text)] mb-[28px]">
                  Real patterns need a minimum amount of writing to surface. Until then, the Patterns page educates instead of fakes it.
                </p>

                <div className="space-y-[20px]">
                  <div>
                    <p className="text-[11px] font-[700] tracking-[0.08em] uppercase text-[var(--color-secondary-text)] mb-[6px]">
                      The problem
                    </p>
                    <p className="text-[15px] leading-[23px] font-[450] text-[var(--color-on-background)]">
                      Early reports built on thin data feel shallow and undermine trust. Worse than no insight at all.
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-[700] tracking-[0.08em] uppercase text-[var(--color-secondary-text)] mb-[6px]">
                      The threshold
                    </p>
                    <p className="text-[15px] leading-[23px] font-[450] text-[var(--color-on-background)]">
                      5,000 words is the floor for meaningful detection. Counting words instead of entries rewards depth, so one long reflection counts more than three throwaways.
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-[700] tracking-[0.08em] uppercase text-[var(--color-secondary-text)] mb-[6px]">
                      Why this works
                    </p>
                    <p className="text-[15px] leading-[23px] font-[450] text-[var(--color-on-background)]">
                      Honest expectations beat fake insights. The progress bar gives users a concrete sense of how close they are, and a clear next action keeps the moment encouraging instead of empty.
                    </p>
                  </div>
                </div>
              </div>

              {/* Left on desktop — phone mockup */}
              <div className="flex-1 flex justify-center lg:justify-start order-2 lg:order-1">
                <div className="w-full max-w-[340px]">
                  <PhoneFrame showNavBar activeTab="patterns">
                    <div className="flex flex-col h-full">
                      <div className="flex-1 overflow-y-auto">
                        <ResultsEmptyState />
                      </div>
                    </div>
                  </PhoneFrame>
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-[960px] mx-auto mt-[80px] mb-[80px] border-t border-[var(--color-outline-light)]" />

          {/* ─── Pattern Results & Insights ─── */}
          <div className="max-w-[960px] mx-auto">
            {(() => {
              const resultsVersions = [
                {
                  id: 'v3',
                  name: 'Adaptive',
                  status: 'latest',
                  statusLabel: 'Latest',
                  tagline: 'Anthology that grows with the user',
                  description: 'The design that ships. Keeps Anthology\u2019s editorial format but removes the timeframe dropdown. Patterns picks the right period based on how long you\u2019ve been journaling \u2014 your first week, your first month, your first year. The user never has to decide. Use the selector below the phone to simulate different user tenures.',
                },
                {
                  id: 'v2',
                  name: 'Anthology',
                  status: 'v1',
                  statusLabel: 'V1',
                  tagline: 'Magazine-style, format-varied',
                  description: 'Second exploration. Each kind of insight gets its own visual treatment \u2014 bold gradient story cards, an emotional arc chart, behavioral highlights, tone-grouped people, echoes from earlier entries, and a third-person Story of You closing section. Big editorial win, but users still pick their own timeframe, which assumes they know what window they want to see.',
                },
                {
                  id: 'v1',
                  name: 'Dashboard',
                  status: 'rough',
                  statusLabel: 'Rough',
                  tagline: 'Show me everything, data-rich',
                  description: 'First exploration. The comprehensive view \u2014 hero mood arc, quick stats, theme of the week, people mentioned, echoes from the past. Strong on one-glance legibility but reads like every other wellness app\u2019s weekly review. The version where the user is in charge of every control, including timeframe.',
                },
              ];
              const activeResultsIdx = resultsVersions.findIndex((v) => v.id === resultsVersion);
              const activeResultsVersion = resultsVersions[activeResultsIdx];

              const renderResultsPhone = (vid, { primary = false } = {}) => {
                // V2 Anthology and V3 Adaptive both hide the nav bar when a full-page insight detail is open
                const showNavBar = vid === 'v1' ? true : !resultsV2DetailOpen;
                // Only the primary single-mode phone gets a portal
                // target — compare-mode renders the takeovers inline
                // inside each smaller phone (no portal collision).
                return (
                  <PhoneFrame
                    showNavBar={showNavBar}
                    activeTab="patterns"
                    screenRef={primary ? setResultsPhoneScreen : undefined}
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex-1 overflow-y-auto">
                        {vid === 'v1' && <ResultsPage />}
                        {vid === 'v2' && (
                          <ResultsV2Anthology
                            onDetailOpenChange={setResultsV2DetailOpen}
                            portalContainer={primary ? resultsPhoneScreen : null}
                          />
                        )}
                        {vid === 'v3' && (
                          <ResultsV2Anthology
                            adaptive
                            tenure={resultsTenure}
                            onDetailOpenChange={setResultsV2DetailOpen}
                            portalContainer={primary ? resultsPhoneScreen : null}
                          />
                        )}
                      </div>
                    </div>
                  </PhoneFrame>
                );
              };

              const ResultsHeader = ({ showSubtitle = true }) => (
                <>
                  <h2
                    className={`text-[24px] md:text-[32px] leading-[32px] md:leading-[40px] font-[700] text-[var(--color-on-background)] tracking-[-0.02em] ${
                      showSubtitle ? 'mb-[8px]' : ''
                    }`}
                  >
                    Pattern Results & Insights
                  </h2>
                  {showSubtitle && (
                    <p className="text-[16px] md:text-[17px] leading-[24px] md:leading-[26px] font-[450] text-[var(--color-secondary-text)]">
                      After weeks of journaling, what the user actually sees. Anthology is the primary concept; the other two are earlier explorations kept for reference.
                    </p>
                  )}
                </>
              );

              const ResultsModeToggle = () => (
                <div className="inline-flex self-start rounded-[12px] border border-[var(--color-outline-light)] bg-[var(--color-surface)] p-[4px]">
                  <button
                    onClick={() => setResultsCompareMode(false)}
                    className={`px-[16px] py-[8px] text-[13px] md:text-[14px] leading-[20px] font-[500] rounded-[8px] transition-colors cursor-pointer ${
                      !resultsCompareMode
                        ? 'bg-[var(--color-on-background)] text-[var(--color-background)]'
                        : 'bg-transparent text-[var(--color-secondary-text)] hover:text-[var(--color-on-background)]'
                    }`}
                  >
                    Single view
                  </button>
                  <button
                    onClick={() => {
                      setResultsCompareMode(true);
                      setResultsViewedVersions(new Set(resultsVersions.map((v) => v.id)));
                    }}
                    className={`px-[16px] py-[8px] text-[13px] md:text-[14px] leading-[20px] font-[500] rounded-[8px] transition-colors cursor-pointer ${
                      resultsCompareMode
                        ? 'bg-[var(--color-on-background)] text-[var(--color-background)]'
                        : 'bg-transparent text-[var(--color-secondary-text)] hover:text-[var(--color-on-background)]'
                    }`}
                  >
                    Compare all 3
                  </button>
                </div>
              );

              return (
                <div className="grid">
                  {/* ─── SINGLE MODE ─── */}
                  <div
                    className={`col-start-1 row-start-1 flex flex-col lg:flex-row gap-[32px] md:gap-[48px] items-start transition-all duration-[500ms] ease-out ${
                      !resultsCompareMode
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-0 -translate-x-6 pointer-events-none'
                    }`}
                  >
                    {/* Left on desktop — header + version cards (order 1) */}
                    <div className="flex-1 max-w-[480px] flex flex-col gap-[10px] order-1 lg:order-1">
                      <ResultsHeader />
                      <div className="mt-[12px]" />
                      <ResultsModeToggle />
                      <div className="mt-[12px]" />
                      {resultsVersions.map((v) => {
                        const isActive = resultsVersion === v.id;
                        const isLatest = v.status === 'latest';
                        return (
                          <button
                            key={v.id}
                            onClick={() => selectResultsVersion(v.id)}
                            className={`text-left p-[16px] rounded-[14px] border transition-all cursor-pointer ${
                              isActive
                                ? 'border-[var(--color-on-background)] bg-[var(--color-surface)] shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
                                : 'border-[var(--color-outline-light)] bg-transparent hover:border-[var(--color-outline)] hover:bg-[var(--color-surface)]'
                            }`}
                          >
                            <div className="flex items-start gap-[14px]">
                              <div
                                className={`shrink-0 inline-flex items-center gap-[4px] px-[10px] h-[28px] rounded-full text-[11px] font-[700] tracking-[0.04em] uppercase transition-colors ${
                                  isLatest
                                    ? 'bg-[#FFE2ED] text-[#A40742]'
                                    : 'bg-[var(--color-surface-variant)] text-[var(--color-secondary-text)]'
                                }`}
                              >
                                {isLatest && (
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-[10px] h-[10px]">
                                    <path d="M12 2l2.09 6.26L20 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l5.91-1.01L12 2z" />
                                  </svg>
                                )}
                                {v.statusLabel || (isLatest ? 'Latest' : 'Rough')}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-[6px] mb-[2px]">
                                  <span className="text-[15px] leading-[22px] font-[600] text-[var(--color-on-background)]">
                                    {v.name}
                                  </span>
                                </div>
                                <p className="text-[13px] leading-[19px] font-[450] text-[var(--color-secondary-text)]">
                                  {v.tagline}
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                      <p className="text-[13px] leading-[19px] font-[450] text-[var(--color-secondary-text)] mt-[8px] px-[4px]">
                        {activeResultsVersion.description}
                      </p>
                    </div>

                    {/* Right on desktop — phone (order 2) + tenure meta-control for V3 */}
                    <div className="flex-1 flex flex-col items-center lg:items-end order-2 lg:order-2">
                      <div className="w-full max-w-[340px]" data-export-phone="results">
                        {renderResultsPhone(resultsVersion, { primary: true })}
                      </div>

                      {/* Meta demo control — only shown for V3 Adaptive.
                          This is NOT an in-product UI; it lives OUTSIDE the
                          phone frame and uses a neutral visual treatment so
                          viewers understand it's a viewer control that
                          simulates how Patterns adapts to different user
                          tenures. */}
                      {resultsVersion === 'v3' && (
                        <div className="mt-[20px] w-full max-w-[340px] flex flex-col gap-[8px]">
                          <div className="flex items-center gap-[8px]">
                            <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary-text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[12px] h-[12px]">
                              <circle cx="12" cy="12" r="10" />
                              <path d="M12 8v4l2 2" />
                            </svg>
                            <span className="text-[10px] leading-[13px] font-[600] tracking-[0.08em] uppercase text-[var(--color-secondary-text)]">
                              Simulate user tenure
                            </span>
                          </div>
                          <div className="flex rounded-[10px] border border-[var(--color-outline-light)] bg-[var(--color-surface)] p-[3px]">
                            {[
                              { id: 'week', label: '3k words' },
                              { id: 'month', label: '15k words' },
                              { id: 'year', label: '87k words' },
                            ].map((t) => {
                              const isActive = resultsTenure === t.id;
                              return (
                                <button
                                  key={t.id}
                                  onClick={() => setResultsTenure(t.id)}
                                  className={`flex-1 py-[7px] rounded-[7px] text-[12px] leading-[16px] font-[500] transition-colors cursor-pointer ${
                                    isActive
                                      ? 'bg-[var(--color-on-background)] text-[var(--color-background)]'
                                      : 'bg-transparent text-[var(--color-secondary-text)] hover:text-[var(--color-on-background)]'
                                  }`}
                                >
                                  {t.label}
                                </button>
                              );
                            })}
                          </div>
                          <p className="text-[11px] leading-[15px] font-[450] text-[var(--color-secondary-text)] italic">
                            Demo control. In production, the system picks the right period based on journaling history.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ─── COMPARE MODE ─── */}
                  <div
                    className={`col-start-1 row-start-1 flex flex-col transition-all duration-[500ms] ease-out ${
                      resultsCompareMode
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-0 translate-x-6 pointer-events-none'
                    }`}
                  >
                    <div className="mb-[32px] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-[16px]">
                      <div className="max-w-[600px]">
                        <ResultsHeader showSubtitle={false} />
                      </div>
                      <ResultsModeToggle />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] md:gap-[16px]">
                      {resultsVersions.map((v, i) => (
                        <div
                          key={v.id}
                          className="flex flex-col items-center gap-[12px]"
                          style={{
                            transitionDelay: resultsCompareMode ? `${i * 80}ms` : '0ms',
                            transform: resultsCompareMode ? 'translateX(0)' : 'translateX(20px)',
                            opacity: resultsCompareMode ? 1 : 0,
                            transition: 'transform 500ms ease-out, opacity 500ms ease-out',
                          }}
                        >
                          <button
                            onClick={() => {
                              selectResultsVersion(v.id);
                              setResultsCompareMode(false);
                            }}
                            className="flex items-center gap-[8px] cursor-pointer hover:opacity-70 transition-opacity"
                            title="Focus on this version"
                          >
                            <span
                              className={`inline-flex items-center gap-[4px] px-[8px] py-[2px] rounded-full text-[9px] leading-[12px] font-[700] tracking-[0.06em] uppercase ${
                                v.status === 'latest'
                                  ? 'bg-[#FFE2ED] text-[#A40742]'
                                  : 'bg-[var(--color-surface-variant)] text-[var(--color-secondary-text)]'
                              }`}
                            >
                              {v.status === 'latest' && (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-[9px] h-[9px]">
                                  <path d="M12 2l2.09 6.26L20 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l5.91-1.01L12 2z" />
                                </svg>
                              )}
                              {v.statusLabel || (v.status === 'latest' ? 'Latest' : 'Rough')}
                            </span>
                            <span className="text-[15px] leading-[20px] font-[600] text-[var(--color-on-background)]">
                              {v.name}
                            </span>
                          </button>
                          <div className="w-full">
                            {renderResultsPhone(v.id)}
                          </div>
                          <p className="text-[12px] leading-[17px] font-[450] text-[var(--color-secondary-text)] text-center max-w-[220px]">
                            {v.tagline}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
          <div className="max-w-[960px] mx-auto mt-[80px] border-t border-[var(--color-outline-light)]" />
        </section>

        {/* ═══ CONCEPT 3 — HISTORY & BOOKMARKS ═══ */}
        <section id="history" className="pb-[100px] scroll-mt-[72px]">
          <div className="max-w-[960px] mx-auto">
            {(() => {
              const historySteps = [
                {
                  id: 'chat',
                  label: 'Bookmark While Journaling',
                  tagline: 'Save any moment worth keeping.',
                  description: 'When the AI says something that lands, tap the bookmark icon in the action row to save it. The saved passage stays attached to its source entry.',
                },
                {
                  id: 'history',
                  label: 'History',
                  tagline: 'Browse and revisit without the analysis.',
                  description: 'A vertical scroll of every entry, with search and filter. Fast to skim, easy to jump back. The bookmark icon in the top-right opens saved passages.',
                },
                {
                  id: 'bookmarks',
                  label: 'Bookmarks',
                  tagline: 'Your personal canon, attributed to its source.',
                  description: 'Every saved passage lives here with who said it, which entry it came from, and when it was saved. Over time, a short anthology of what matters.',
                },
              ];
              const activeStep = historySteps.find(s => s.id === historyView) || historySteps[0];

              return (
                <div className="flex flex-col lg:flex-row gap-[32px] md:gap-[48px] items-center">
                  {/* Right on desktop — header + step cards */}
                  <div className="flex-1 max-w-[480px] flex flex-col gap-[10px] order-1 lg:order-2">
                    <h2 className="text-[24px] md:text-[32px] leading-[32px] md:leading-[40px] font-[700] text-[var(--color-on-background)] mb-[8px] tracking-[-0.02em]">
                      History & Bookmarks
                    </h2>
                    <p className="text-[16px] md:text-[17px] leading-[24px] md:leading-[26px] font-[450] text-[var(--color-secondary-text)]">
                      Patterns is where users <span className="font-[600] text-[var(--color-on-background)]">receive insights</span>. History is where they <span className="font-[600] text-[var(--color-on-background)]">browse and revisit</span>. Bookmarks turn any moment from a chat into something worth keeping.
                    </p>
                    <div className="mt-[20px]" />
                    {historySteps.map((step, i) => {
                      const isActive = historyView === step.id;
                      return (
                        <button
                          key={step.id}
                          onClick={() => handleHistoryViewChange(step.id)}
                          className={`text-left p-[16px] rounded-[14px] border transition-all cursor-pointer ${
                            isActive
                              ? 'border-[var(--color-on-background)] bg-[var(--color-surface)] shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
                              : 'border-[var(--color-outline-light)] bg-transparent hover:border-[var(--color-outline)] hover:bg-[var(--color-surface)]'
                          }`}
                        >
                          <div className="flex items-start gap-[14px]">
                            <div
                              className={`shrink-0 px-[10px] h-[28px] rounded-full flex items-center justify-center text-[12px] font-[700] transition-colors ${
                                isActive
                                  ? 'bg-[#E31665] text-white'
                                  : 'bg-[var(--color-surface-variant)] text-[var(--color-secondary-text)]'
                              }`}
                            >
                              Step {i + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-[6px] mb-[2px]">
                                <span className="text-[15px] leading-[22px] font-[600] text-[var(--color-on-background)]">{step.label}</span>
                              </div>
                              <p className="text-[13px] leading-[19px] font-[450] text-[var(--color-secondary-text)]">{step.tagline}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                    <p className="text-[13px] leading-[19px] font-[450] text-[var(--color-secondary-text)] mt-[8px] px-[4px]">
                      {activeStep.description}
                    </p>
                  </div>

                  {/* Left on desktop — single phone */}
                  <div className="flex-1 flex justify-center lg:justify-start order-2 lg:order-1">
                    <div className="w-full max-w-[340px]" data-export-phone="history">
                      <PhoneFrame
                        showNavBar={historyView !== 'chat' && !historySheetOpen}
                        showStatusBar={true}
                        activeTab="history"
                      >
                        <HistoryFlow
                          ref={historyFlowRef}
                          initialView="chat"
                          onViewChange={(v) => setHistoryView(v)}
                          onSheetOpenChange={setHistorySheetOpen}
                        />
                      </PhoneFrame>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </section>

        {/* ═══ SEPARATION DEBATE — History vs Patterns ═══ */}
        <section id="separation" className="pb-[100px] scroll-mt-[72px]">
          <div className="max-w-[960px] mx-auto">
            <h2 className="text-[24px] md:text-[32px] leading-[32px] md:leading-[40px] font-[700] text-[var(--color-on-background)] tracking-[-0.02em] mb-[8px]">
              Should History and Patterns live in separate homes?
            </h2>
            <p className="text-[16px] md:text-[17px] leading-[24px] md:leading-[26px] font-[450] text-[var(--color-secondary-text)] mb-[24px] max-w-[720px]">
              The design above keeps History as a pure archive (your entries, nothing else) and puts all AI interpretation inside Patterns. Below is the actual research on whether this split helps or hurts. It&rsquo;s more contested than it looks.
            </p>

            {/* At-a-glance comparison chart — styled like the Discovery matrix */}
            <div className="mb-[24px] card-soft overflow-x-auto p-[8px] md:p-[12px]">
              <div className="min-w-[640px] grid grid-cols-[160px_repeat(2,1fr)] gap-x-[4px]">
                {/* Header row */}
                <div className="px-[12px] pt-[12px] pb-[16px]" />
                <div className="px-[12px] pt-[12px] pb-[16px] flex items-center gap-[8px]">
                  <span className="w-[8px] h-[8px] rounded-full bg-[#5ABA9D] shrink-0" />
                  <span className="text-[14px] leading-[19px] font-[600] text-[var(--color-on-background)]">
                    For separation
                  </span>
                </div>
                <div className="px-[12px] pt-[12px] pb-[16px] flex items-center gap-[8px]">
                  <span className="w-[8px] h-[8px] rounded-full bg-[#E31665] shrink-0" />
                  <span className="text-[14px] leading-[19px] font-[600] text-[var(--color-on-background)]">
                    Against separation
                  </span>
                </div>

                {/* Dimension rows */}
                {[
                  {
                    key: 'core',
                    label: 'Core claim',
                    hint: 'What each side argues',
                    forSide: 'Writing itself is the therapy. No analytical layer needed.',
                    againstSide: 'Meaning only lands when writing becomes a coherent story.',
                  },
                  {
                    key: 'protects',
                    label: 'What it protects',
                    hint: 'The main user value',
                    forSide: 'A private, unmonitored space to write the honest parts.',
                    againstSide: 'Active engagement with patterns users wouldn\u2019t catch alone.',
                  },
                  {
                    key: 'source',
                    label: 'Strongest source',
                    hint: 'The anchor citation',
                    forSide: 'Pennebaker\u2019s 40-year expressive-writing protocol.',
                    againstSide: 'Isaacs\u2019 Echo study \u2014 the one direct experimental test.',
                  },
                  {
                    key: 'depth',
                    label: 'Research depth',
                    hint: 'Volume of evidence',
                    forSide: '100+ replicated studies, ~0.16 effect size on health.',
                    againstSide: '1 targeted RCT plus supporting narrative-identity theory.',
                  },
                  {
                    key: 'risk',
                    label: 'Biggest risk',
                    hint: 'What could go wrong',
                    forSide: 'Users never visit Patterns on the days they need it.',
                    againstSide: 'Writers self-censor knowing entries will be parsed.',
                  },
                ].map((row) => (
                  <Fragment key={row.key}>
                    <div className="px-[12px] py-[16px] flex flex-col gap-[3px] border-t border-[var(--color-outline-light)]">
                      <span className="text-[14px] leading-[19px] font-[600] text-[var(--color-on-background)]">
                        {row.label}
                      </span>
                      <span className="text-[12px] leading-[16px] font-[450] text-[var(--color-secondary-text)]">
                        {row.hint}
                      </span>
                    </div>
                    <div className="px-[12px] py-[16px] border-t border-[var(--color-outline-light)]">
                      <span className="text-[13px] leading-[19px] font-[450] text-[var(--color-on-background)]">
                        {row.forSide}
                      </span>
                    </div>
                    <div className="px-[12px] py-[16px] border-t border-[var(--color-outline-light)]">
                      <span className="text-[13px] leading-[19px] font-[450] text-[var(--color-on-background)]">
                        {row.againstSide}
                      </span>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px] md:gap-[24px]">
              {/* FOR separation */}
              <div className="flex flex-col h-[420px] card-soft overflow-hidden">
                <div className="shrink-0 min-h-[112px] flex flex-col gap-[10px] p-[20px] md:p-[24px] pb-[14px] border-b border-[var(--color-outline-light)]">
                  <div className="flex items-center gap-[8px]">
                    <span className="inline-flex items-center gap-[5px] px-[9px] py-[3px] rounded-full text-[10px] leading-[13px] font-[700] tracking-[0.06em] uppercase bg-[#F0FFF4] text-[#235E4D]">
                      For separation
                    </span>
                  </div>
                  <h3 className="text-[17px] leading-[23px] font-[700] text-[var(--color-on-background)] tracking-[-0.01em]">
                    The act of writing is the therapy. Let it stay private.
                  </h3>
                </div>
                <ul className="flex-1 min-h-0 overflow-y-scroll flex flex-col gap-[16px] p-[20px] md:p-[24px] pt-[16px] [scrollbar-width:thin] [scrollbar-color:#C0C0BF_transparent] [&::-webkit-scrollbar]:w-[8px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#C0C0BF] [&::-webkit-scrollbar-thumb]:rounded-full">
                  <li className="flex flex-col gap-[4px]">
                    <p className="text-[14px] leading-[21px] font-[500] text-[var(--color-on-background)]">
                      Expressive writing works without any analysis on top of it.
                    </p>
                    <p className="text-[13px] leading-[19px] font-[450] text-[var(--color-secondary-text)]">
                      Pennebaker&rsquo;s forty years of expressive-writing research finds physical and mental health benefits simply from writing about emotional experiences. Effect size ~0.16 across 100+ studies, with no interpretive layer in the protocol. The writing itself <em>is</em> the therapy, so History doesn&rsquo;t need Patterns sitting on top of it to be valuable.
                    </p>
                    <a
                      href="https://journals.sagepub.com/doi/full/10.1177/1745691617707315"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] leading-[15px] font-[500] text-[#E31665] hover:underline"
                    >
                      Pennebaker (2018), <em>Psychological Science</em> &rarr;
                    </a>
                  </li>

                  <li className="flex flex-col gap-[4px]">
                    <p className="text-[14px] leading-[21px] font-[500] text-[var(--color-on-background)]">
                      The proven protocol specifically excludes re-reading.
                    </p>
                    <p className="text-[13px] leading-[19px] font-[450] text-[var(--color-secondary-text)]">
                      Pennebaker&rsquo;s standard method has participants write for 15&ndash;20 minutes and stop. No review, no annotation, no interpretive re-pass. Forty years of replication on exactly that form. Surfacing every entry inside a thematic view is adding a step the therapeutic evidence doesn&rsquo;t validate &mdash; keeping History as a write-and-close space matches the protocol that works.
                    </p>
                    <a
                      href="https://journals.sagepub.com/doi/full/10.1177/1745691617707315"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] leading-[15px] font-[500] text-[#E31665] hover:underline"
                    >
                      Pennebaker (2018), <em>Psychological Science</em> &rarr;
                    </a>
                  </li>

                  <li className="flex flex-col gap-[4px]">
                    <p className="text-[14px] leading-[21px] font-[500] text-[var(--color-on-background)]">
                      Visible analysis changes what people are willing to write.
                    </p>
                    <p className="text-[13px] leading-[19px] font-[450] text-[var(--color-secondary-text)]">
                      Dataveillance research finds that when people know they&rsquo;re being monitored or interpreted, they self-censor in everyday digital behavior. If users know every entry will be parsed, quoted in a theme card, or surfaced in a pattern read, they may write the parts they&rsquo;re comfortable seeing later instead of the honest ones. A sacred, non-interpreted archive protects the honest writing.
                    </p>
                    <a
                      href="https://journals.sagepub.com/doi/10.1177/20539517211065368"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] leading-[15px] font-[500] text-[#E31665] hover:underline"
                    >
                      B&uuml;chi et al. (2022), <em>Big Data &amp; Society</em> &rarr;
                    </a>
                  </li>

                  <li className="flex flex-col gap-[4px]">
                    <p className="text-[14px] leading-[21px] font-[500] text-[var(--color-on-background)]">
                      &ldquo;Bake reflection into everything&rdquo; is a design default no one has checked.
                    </p>
                    <p className="text-[13px] leading-[19px] font-[450] text-[var(--color-secondary-text)]">
                      Baumer et al. reviewed 76 HCI papers invoking reflection and found most didn&rsquo;t define the term or actually evaluate reflection as an outcome. The field assumes more reflection is better. The evidence for that assumption is thin &mdash; which is a reason to keep analysis as a deliberate, bounded destination rather than a global overlay.
                    </p>
                    <a
                      href="https://dl.acm.org/doi/10.1145/2598510.2598598"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] leading-[15px] font-[500] text-[#E31665] hover:underline"
                    >
                      Baumer et al. (2014), <em>DIS</em> &rarr;
                    </a>
                  </li>
                </ul>
              </div>

              {/* AGAINST separation */}
              <div className="flex flex-col h-[420px] card-soft overflow-hidden">
                <div className="shrink-0 min-h-[112px] flex flex-col gap-[10px] p-[20px] md:p-[24px] pb-[14px] border-b border-[var(--color-outline-light)]">
                  <div className="flex items-center gap-[8px]">
                    <span className="inline-flex items-center gap-[5px] px-[9px] py-[3px] rounded-full text-[10px] leading-[13px] font-[700] tracking-[0.06em] uppercase bg-[#FFE2ED] text-[#A40742]">
                      Against separation
                    </span>
                  </div>
                  <h3 className="text-[17px] leading-[23px] font-[700] text-[var(--color-on-background)] tracking-[-0.01em]">
                    Raw entries don&rsquo;t turn into meaning on their own.
                  </h3>
                </div>
                <ul className="flex-1 min-h-0 overflow-y-scroll flex flex-col gap-[16px] p-[20px] md:p-[24px] pt-[16px] [scrollbar-width:thin] [scrollbar-color:#C0C0BF_transparent] [&::-webkit-scrollbar]:w-[8px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#C0C0BF] [&::-webkit-scrollbar-thumb]:rounded-full">
                  <li className="flex flex-col gap-[4px]">
                    <p className="text-[14px] leading-[21px] font-[500] text-[var(--color-on-background)]">
                      The one study that tested re-surfacing entries built one integrated app.
                    </p>
                    <p className="text-[13px] leading-[19px] font-[450] text-[var(--color-secondary-text)]">
                      Isaacs et al.&rsquo;s Echo captured daily experiences and re-surfaced them back to users with emotional context. Across 44 users and 12,000+ entries, well-being improved and the effects persisted long-term. That study wasn&rsquo;t &ldquo;entries here, patterns over there.&rdquo; It was a single surface. The experimental evidence for &ldquo;show past content back&rdquo; is specifically evidence for integrated designs, not separated ones.
                    </p>
                    <a
                      href="https://dl.acm.org/doi/10.1145/2470654.2466137"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] leading-[15px] font-[500] text-[#E31665] hover:underline"
                    >
                      Isaacs et al. (2013), <em>CHI</em> &rarr;
                    </a>
                  </li>

                  <li className="flex flex-col gap-[4px]">
                    <p className="text-[14px] leading-[21px] font-[500] text-[var(--color-on-background)]">
                      Pennebaker himself found benefits were strongest when writing became coherent narrative.
                    </p>
                    <p className="text-[13px] leading-[19px] font-[450] text-[var(--color-secondary-text)]">
                      The same forty-year research program cited on the other side also showed that people who benefited <em>more</em> were the ones whose writing progressed from disorganized descriptions to coherent stories. Something has to do the organizing. A raw archive doesn&rsquo;t. A Patterns view that pulls themes out of the writing does.
                    </p>
                    <a
                      href="https://journals.sagepub.com/doi/full/10.1177/1745691617707315"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] leading-[15px] font-[500] text-[#E31665] hover:underline"
                    >
                      Pennebaker (2018), <em>Psychological Science</em> &rarr;
                    </a>
                  </li>

                  <li className="flex flex-col gap-[4px]">
                    <p className="text-[14px] leading-[21px] font-[500] text-[var(--color-on-background)]">
                      Selfhood is built by re-engaging with your stories, not by archiving them.
                    </p>
                    <p className="text-[13px] leading-[19px] font-[450] text-[var(--color-secondary-text)]">
                      McAdams&rsquo;s life-story model of identity holds that people in modern societies give their lives unity and purpose by constructing and <em>re-evolving</em> internalized narratives of the self. That requires revisiting past experiences with new framing, not just storing them. An unread History is a pile of text; Patterns is the structure that turns it into autobiography.
                    </p>
                    <a
                      href="https://journals.sagepub.com/doi/10.1037/1089-2680.5.2.100"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] leading-[15px] font-[500] text-[#E31665] hover:underline"
                    >
                      McAdams (2001), <em>Review of General Psychology</em> &rarr;
                    </a>
                  </li>

                  <li className="flex flex-col gap-[4px]">
                    <p className="text-[14px] leading-[21px] font-[500] text-[var(--color-on-background)]">
                      Discoverability isn&rsquo;t the same as engagement.
                    </p>
                    <p className="text-[13px] leading-[19px] font-[450] text-[var(--color-secondary-text)]">
                      Yes, Patterns is a top-level tab, not a hidden screen. But a one-tap-away destination still goes unvisited on the exact days users most need it &mdash; the heavy ones. Echo&rsquo;s study worked because past content came <em>to</em> users on a schedule, not because users thought to go look for it. If meaning only assembles itself when users actively visit the second room, the people who need it most may never arrive.
                    </p>
                    <a
                      href="https://dl.acm.org/doi/10.1145/2470654.2466137"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] leading-[15px] font-[500] text-[#E31665] hover:underline"
                    >
                      Isaacs et al. (2013), <em>CHI</em> &rarr;
                    </a>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </section>

        {/* ═══ CHAPTERS — time-grouped History view ═══ */}
        <section id="chapters" className="pb-[100px] scroll-mt-[72px]">
          <div className="max-w-[960px] mx-auto">
            <div className="flex flex-col lg:flex-row gap-[32px] md:gap-[48px] items-center">
              {/* Right on desktop — phone */}
              <div className="flex-1 flex justify-center lg:justify-end order-2 lg:order-2">
                <div className="w-full max-w-[340px]">
                  <PhoneFrame showNavBar={!chaptersSheetOpen} showStatusBar={true} activeTab="history">
                    <ChaptersFlow defaultTab="chapters" onSheetOpenChange={setChaptersSheetOpen} />
                  </PhoneFrame>
                </div>
              </div>

              {/* Left on desktop — header + labeled subsections */}
              <div className="flex-1 max-w-[480px] order-1 lg:order-1">
                <span className="inline-flex items-center gap-[5px] px-[10px] py-[4px] rounded-full text-[10px] leading-[13px] font-[700] tracking-[0.08em] uppercase bg-[var(--color-on-background)] text-[var(--color-background)] mb-[14px]">
                  The solution
                </span>
                <h2 className="text-[24px] md:text-[32px] leading-[32px] md:leading-[40px] font-[700] text-[var(--color-on-background)] mb-[10px] tracking-[-0.02em]">
                  Entries and Chapters
                </h2>
                <p className="text-[15px] md:text-[16px] leading-[23px] md:leading-[25px] font-[450] text-[var(--color-secondary-text)] mb-[28px]">
                  One content set, two very different intents.
                </p>

                <div className="space-y-[22px]">
                  <div>
                    <p className="text-[11px] font-[700] tracking-[0.08em] uppercase text-[var(--color-secondary-text)] mb-[6px]">
                      Entries
                    </p>
                    <p className="text-[15px] leading-[23px] font-[450] text-[var(--color-on-background)]">
                      The default tab. A pure chronological archive, untouched by AI. It&rsquo;s the sacred write-and-close space, so users who just want to browse never see interpretation they didn&rsquo;t ask for.
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-[700] tracking-[0.08em] uppercase text-[var(--color-secondary-text)] mb-[6px]">
                      Chapters
                    </p>
                    <p className="text-[15px] leading-[23px] font-[450] text-[var(--color-on-background)]">
                      The opt-in narrative layer on top. Entries grouped into predictable time windows with AI-generated headlines, photos surfaced alongside the writing, and quiet bridges out to Patterns when a user wants to go deeper.
                    </p>
                  </div>
                </div>
              </div>
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
                Icon: LongTermMemory,
                title: 'Cross-session recognition',
                body: 'The pattern analyzer connects entries across weeks and months, delivering the #1 most requested insight type that no single-session tool can match.',
              },
              {
                Icon: WeeklyStar,
                title: 'Visible progress',
                body: 'Users feel they\'re growing but can\'t prove it. The dashboard and evolution timeline make change tangible, the most requested but least served need.',
              },
              {
                Icon: Brain,
                title: 'Memory as relationship',
                body: 'By learning what to track from day one, Rosebud builds a model that deepens over time. 59% of users say memory is what makes Rosebud feel real.',
              },
            ].map((card, i) => (
              <div key={i} className="card-soft p-[24px] flex flex-col gap-[12px]">
                <div className="w-[40px] h-[40px] rounded-full bg-[var(--color-primary-container)] flex items-center justify-center text-[var(--color-primary)]">
                  <card.Icon className="w-[22px] h-[22px]" />
                </div>
                <h3 className="text-[17px] leading-[23px] font-[600] text-[var(--color-on-background)]">{card.title}</h3>
                <p className="text-[15px] leading-[22px] font-[450] text-[var(--color-secondary-text)]">{card.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ MVP SCOPE ═══
             Sits between the design exploration above and the success
             metrics below. Designs were the "what." Metrics are the
             "how we'd measure." Scope is the missing leg: the explicit
             cuts and bets for the first pass. Each deferred row leads
             with the reason, since deferring is the hard part — anyone
             can list features, the value is in defending which ones
             get cut. */}
        <section className="pb-[100px]">
          <SectionLabel>MVP Scope</SectionLabel>
          <h2 className="text-[32px] leading-[40px] font-[700] text-[var(--color-on-background)] mb-[10px]">
            What I&rsquo;d ship first
          </h2>
          <p className="text-[15px] md:text-[16px] leading-[23px] md:leading-[25px] font-[450] text-[var(--color-secondary-text)] mb-[32px] max-w-[680px]">
            Not a roadmap. Opinionated cuts and bets for the first pass: which version of each flow ships, and what gets deferred &mdash; with the reasoning, since deferring is the hard part.
          </p>

          {/* Scope table — matches the Success Metrics table below in
              card-soft styling, padding, line treatment, and grid. Three
              columns: flow on the left, what ships first in the middle,
              deferred-with-reason on the right. The "deferred" column is
              the widest because the reason is the load-bearing part. */}
          <div className="card-soft overflow-x-auto p-[8px] md:p-[12px]">
            <div className="min-w-[720px] grid grid-cols-[160px_1fr_1.3fr] gap-x-[4px]">
              {/* Header row */}
              <div className="px-[12px] pt-[12px] pb-[14px]">
                <span className="text-[11px] leading-[14px] font-[700] tracking-[0.06em] uppercase text-[var(--color-secondary-text)]">
                  Flow
                </span>
              </div>
              <div className="px-[12px] pt-[12px] pb-[14px]">
                <span className="text-[11px] leading-[14px] font-[700] tracking-[0.06em] uppercase text-[var(--color-secondary-text)]">
                  Ships first
                </span>
              </div>
              <div className="px-[12px] pt-[12px] pb-[14px]">
                <span className="text-[11px] leading-[14px] font-[700] tracking-[0.06em] uppercase text-[var(--color-secondary-text)]">
                  Deferred &mdash; and why
                </span>
              </div>

              {/* Scope rows */}
              {[
                {
                  key: 'onboarding',
                  flow: 'Onboarding',
                  ships: 'V5 Curiosity-led, with Apple Health as the only integration at launch.',
                  deferred: 'Specialty app catalog (Flo, Oura, Whoop, Strava). Adds value but isn\u2019t blocking — ship after Apple Health proves the integration pattern works for one source.',
                },
                {
                  key: 'mid-convo',
                  flow: 'Mid-conversation onboarding',
                  ships: 'V2 Conversational. Reuses the existing blue-voice journal thread, no new visual language to build.',
                  deferred: 'V1 Modal alert. Same intent, more interruptive. Only worth shipping if V2 underperforms in tests for users who miss inline cues.',
                },
                {
                  key: 'tracking',
                  flow: 'Quick tracking',
                  ships: 'V1 Guided Stamp during onboarding week, V2 Inline Tag thereafter.',
                  deferred: 'Neither alone. The bet is that V1 teaches what\u2019s trackable via an unmissable moment, then V2 takes over once the habit lands. They\u2019re complementary, not competing.',
                },
                {
                  key: 'patterns',
                  flow: 'Patterns Results',
                  ships: 'V3 Adaptive: themes, people, behavioral highlights, emotional arc, echoes.',
                  deferred: 'Story of You audio playback, Rosebud Bloom paywall, correlation Go Deeper layer. All value-add layers, not the entry path. Ship them once the core surface earns its return rate.',
                },
                {
                  key: 'history',
                  flow: 'History & Bookmarks',
                  ships: 'History archive + bookmark-while-journaling.',
                  deferred: 'Bookmarks browse surface. It\u2019s only valuable after a user has accumulated bookmarks worth returning to — ship around week 4 of usage, not at launch.',
                },
                {
                  key: 'chapters',
                  flow: 'Chapters',
                  ships: 'Defer entirely past initial launch.',
                  deferred: 'Chapters needs a year of data to feel earned. Premature now, compelling later. The Story of You is the bigger near-term wedge into longitudinal storytelling — start there.',
                },
              ].map((row) => (
                <Fragment key={row.key}>
                  <div className="px-[12px] py-[16px] border-t border-[var(--color-outline-light)]">
                    <span className="text-[14px] leading-[19px] font-[600] text-[var(--color-on-background)]">
                      {row.flow}
                    </span>
                  </div>
                  <div className="px-[12px] py-[16px] border-t border-[var(--color-outline-light)]">
                    <p className="text-[13px] leading-[19px] font-[450] text-[var(--color-on-background)]">
                      {row.ships}
                    </p>
                  </div>
                  <div className="px-[12px] py-[16px] border-t border-[var(--color-outline-light)]">
                    <p className="text-[13px] leading-[19px] font-[450] text-[var(--color-secondary-text)]">
                      {row.deferred}
                    </p>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ SUCCESS METRICS ═══ */}
        <section className="pb-[100px]">
          <SectionLabel>Success Metrics</SectionLabel>
          <h2 className="text-[32px] leading-[40px] font-[700] text-[var(--color-on-background)] mb-[10px]">
            How we&rsquo;d know it&rsquo;s working
          </h2>
          <p className="text-[15px] md:text-[16px] leading-[23px] md:leading-[25px] font-[450] text-[var(--color-secondary-text)] mb-[32px] max-w-[680px]">
            No amount of design polish matters if the surface doesn&rsquo;t change user behavior. Here&rsquo;s what I&rsquo;d measure to prove the new Patterns surface is actually working.
          </p>

          {/* Metrics table — matches the separation section's comparison
              matrix in typography, padding, and line treatment. Each
              row has a metric label + plain-English hint, a target
              pill in the middle, and a "how we'd measure" description
              on the right. Important keywords (A/B, bookmark taps,
              Bloom trial start) stay in the descriptions but are
              surrounded by human framing so the row reads clearly at
              a glance. */}
          <div className="card-soft overflow-x-auto p-[8px] md:p-[12px]">
            <div className="min-w-[640px] grid grid-cols-[180px_auto_1fr] gap-x-[4px]">
              {/* Header row */}
              <div className="px-[12px] pt-[12px] pb-[14px]">
                <span className="text-[11px] leading-[14px] font-[700] tracking-[0.06em] uppercase text-[var(--color-secondary-text)]">
                  Metric
                </span>
              </div>
              <div className="px-[12px] pt-[12px] pb-[14px]">
                <span className="text-[11px] leading-[14px] font-[700] tracking-[0.06em] uppercase text-[var(--color-secondary-text)]">
                  Target
                </span>
              </div>
              <div className="px-[12px] pt-[12px] pb-[14px]">
                <span className="text-[11px] leading-[14px] font-[700] tracking-[0.06em] uppercase text-[var(--color-secondary-text)]">
                  How we&rsquo;d measure
                </span>
              </div>

              {/* Metric rows */}
              {[
                {
                  key: 'onboarding',
                  kpi: 'Onboarding completion',
                  hint: 'Did they finish the setup flow?',
                  target: '> 70%',
                  test: 'A/B test the V5 flow against the current onboarding, measured across a 4-week cohort.',
                },
                {
                  key: 'day7',
                  kpi: 'Day-7 Patterns visits',
                  hint: 'Do users come back to the tab within a week?',
                  target: '> 40%',
                  test: 'Count tab-open events segmented by onboarding version. No baseline yet — this would set the reference point.',
                },
                {
                  key: 'time-on-patterns',
                  kpi: 'Time spent on Patterns',
                  hint: 'Are users actually reading the surface, or bouncing after a glance?',
                  target: '> 90s / session',
                  test: 'Session duration per tab visit. Differentiates a curious click from a real read.',
                },
                {
                  key: 'unlock',
                  kpi: 'Pattern unlock rate',
                  hint: 'Do new users journal enough for Patterns to surface at all?',
                  target: '> 60% by day 14',
                  test: '% of new users who cross the entry threshold that makes Patterns worth showing. Ties directly to the minimum-data-gate question below.',
                },
                {
                  key: 'bookmark',
                  kpi: 'Pattern bookmark rate',
                  hint: 'Are users saving the insights that resonate?',
                  target: '> 1 / user / week',
                  test: 'Track bookmark taps and Go Deeper opens. A proxy for whether an insight actually landed.',
                },
                {
                  key: 'retention',
                  kpi: '4-week retention lift',
                  hint: 'Are they still journaling a month later?',
                  target: '+ 15%',
                  test: 'Retention A/B between new and old flows, plus 5–8 qualitative interviews for why the delta exists.',
                },
                {
                  key: 'bloom',
                  kpi: 'Rosebud Bloom conversion',
                  hint: 'Do users upgrade when they go deeper?',
                  target: '> 8%',
                  test: 'Funnel from the Go Deeper view to a Bloom trial start. Sets the baseline we don\u2019t currently have.',
                },
              ].map((row) => (
                <Fragment key={row.key}>
                  <div className="px-[12px] py-[16px] flex flex-col gap-[3px] border-t border-[var(--color-outline-light)]">
                    <span className="text-[14px] leading-[19px] font-[600] text-[var(--color-on-background)]">
                      {row.kpi}
                    </span>
                    <span className="text-[12px] leading-[16px] font-[450] text-[var(--color-secondary-text)]">
                      {row.hint}
                    </span>
                  </div>
                  <div className="px-[12px] py-[16px] border-t border-[var(--color-outline-light)] flex items-start">
                    <span className="inline-flex items-center px-[10px] py-[3px] rounded-full bg-[var(--color-primary-container)] text-[var(--color-primary)] text-[12px] leading-[15px] font-[700] whitespace-nowrap">
                      {row.target}
                    </span>
                  </div>
                  <div className="px-[12px] py-[16px] border-t border-[var(--color-outline-light)]">
                    <span className="text-[13px] leading-[19px] font-[450] text-[var(--color-on-background)]">
                      {row.test}
                    </span>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>

        </section>

      </main>

      <footer className="border-t border-[var(--color-outline-light)] py-[32px] text-center text-[13px] text-[var(--color-secondary-text-on-surface)]">
        Pattern Discovery — Design Concept by Grace Guo
      </footer>
    </div>
  );
}
