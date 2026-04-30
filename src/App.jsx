import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PhoneFrame } from './components/PhoneFrame';
import { TherapistDemo } from './components/TherapistDemo';
import { ExportModal } from './components/ExportModal';
import { usePageActions } from './components/Layout';

function App() {
  const therapistRef = useRef(null);
  const [exportProgress, setExportProgress] = useState(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  // html-to-image is lazy-loaded on first export so it doesn't block initial page load
  const htmlToImageRef = useRef(null);

  const tick = (ms = 200) => new Promise(resolve => {
    requestAnimationFrame(() => setTimeout(resolve, ms));
  });

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

  // Each entry represents one screen "capture step" — used for both progress and the modal counts
  const allScreens = [
    { flowId: 'list', folder: '01-patient-list', file: '01-list', label: 'Patient list', nav: () => therapistRef.current?.goToList() },
    { flowId: 'summary', folder: '02-weekly-summary', file: '01-ellie-summary', label: 'Weekly summary', nav: () => therapistRef.current?.goToSummary('ellie') },
    { flowId: 'profile-overview', folder: '03-patient-profile', file: '01-overview', label: 'Profile overview', nav: () => therapistRef.current?.goToProfile('ellie', 'overview') },
    { flowId: 'profile-notes', folder: '03-patient-profile', file: '02-notes', label: 'Profile notes', nav: () => therapistRef.current?.goToProfile('ellie', 'notes') },
  ];

  const exportFlows = [
    { id: 'list', label: 'Patient List', description: 'Therapist dashboard with upcoming sessions', count: 1 },
    { id: 'summary', label: 'Weekly Summary', description: 'Ellie\'s journaling summary with mood arc', count: 1 },
    { id: 'profile-overview', label: 'Patient Profile — Overview', description: 'Emotional landscape & behavioral callouts', count: 1 },
    { id: 'profile-notes', label: 'Patient Profile — Notes', description: 'Therapist session notes with AI summaries', count: 1 },
  ];

  async function runExport(selectedFlowIds, format) {
    if (exportProgress) return;
    setExportModalOpen(false);
    const therapist = therapistRef.current;
    if (!therapist) return;

    const selected = new Set(selectedFlowIds);
    const screensToCapture = allScreens.filter(s => selected.has(s.flowId));
    const totalFiles = format === 'both' ? screensToCapture.length * 2 : screensToCapture.length;

    setExportProgress({ current: 0, total: totalFiles, label: 'Loading export tools...' });

    // Lazy-load heavy libs only when the user actually exports
    if (!htmlToImageRef.current) {
      htmlToImageRef.current = await import('html-to-image');
    }
    const { default: JSZip } = await import('jszip');

    const zip = new JSZip();
    let counter = 0;

    for (const s of screensToCapture) {
      s.nav();
      await tick(350);
      const formats = format === 'both' ? ['png', 'svg'] : [format];
      for (const fmt of formats) {
        const blob = await captureNode('[data-export-phone="therapist"]', s.label, fmt);
        counter += 1;
        setExportProgress({ current: counter, total: totalFiles, label: `${s.folder}/${s.file}.${fmt}` });
        if (blob) zip.folder(s.folder).file(`${s.file}.${fmt}`, blob);
      }
    }

    // Reset to initial view
    therapist.goToList();

    setExportProgress({ current: totalFiles, total: totalFiles, label: 'Packaging zip...' });
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rosebud-therapist-screens-${new Date().toISOString().slice(0, 10)}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExportProgress(null);
  }

  usePageActions(
    <div className="flex items-center gap-[8px]">
      <Link
        to="/presentation"
        className="inline-flex items-center gap-[6px] px-[12px] py-[7px] rounded-full text-[13px] font-[500] bg-white border border-[#C0C0BF] text-[#191C1A] hover:border-[#191C1A] transition-colors"
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
        className="inline-flex items-center gap-[6px] px-[12px] py-[7px] rounded-full text-[13px] font-[500] bg-[#191C1A] text-white hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60 disabled:cursor-wait"
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
    </div>,
    [exportProgress]
  );

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(180deg, #F9F3F3 0%, #F0FFF4 100%)' }}
      data-theme="light"
    >
      <ExportModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        flows={exportFlows}
        onExport={runExport}
      />
      {exportProgress && (
        <div className="fixed bottom-[20px] right-[20px] z-50 bg-[#191C1A] text-white rounded-[12px] px-[16px] py-[12px] shadow-lg max-w-[320px]">
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
      <section className="flex-1 w-full pt-[60px] md:pt-[80px] pb-[40px] md:pb-[60px]">
        <div className="max-w-[960px] mx-auto px-[20px] md:px-[24px] flex flex-col lg:flex-row items-center gap-[32px] md:gap-[48px]">
          {/* Left — copy */}
          <div className="flex-1 max-w-[480px]">
            <span className="inline-block text-[13px] font-[600] tracking-[0.06em] uppercase text-[#5ABA9D] mb-[20px]">
              For Therapists
            </span>
            <h1 className="text-[36px] md:text-[52px] leading-[42px] md:leading-[58px] font-[700] text-[#191C1A] mb-[20px] tracking-[-0.03em]">
              Between-session intelligence
            </h1>
            <p className="text-[16px] md:text-[19px] leading-[26px] md:leading-[30px] font-[450] text-[#6D6C6A] mb-[28px] md:mb-[36px]">
              See what your patients are working through between sessions. AI-summarized journal insights, emotional arcs, and suggested topics, so every session starts where it matters.
            </p>
            <div className="flex flex-col gap-[12px]">
              {[
                ['90%', 'of patients conceal something from their therapist'],
                ['79%', 'of Rosebud users are in or recently left therapy'],
              ].map(([stat, desc]) => (
                <div key={stat} className="flex items-center gap-[12px]">
                  <span className="text-[28px] leading-[28px] font-[700] text-[#5ABA9D] w-[56px] shrink-0">{stat}</span>
                  <span className="text-[15px] leading-[20px] font-[450] text-[#6D6C6A]">{desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — phone mockup */}
          <div className="flex-1 flex justify-center lg:justify-end w-full">
            <div data-export-phone="therapist">
              <PhoneFrame showNavBar={false}>
                <TherapistDemo ref={therapistRef} />
              </PhoneFrame>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App
