import { useState } from 'react';
import { createPortal } from 'react-dom';

/* ═══════════════════════════════════════════════════════════════════════════
   StoryOfYouTakeover — audiobook-style full-screen overlay. Reused by:
     - ResultsV2Anthology (weekly + quarter story)
     - ChaptersFlow (all-time character portrait in History)

   The component is visually identical in both places. The data is what
   differs: Anthology passes a week/quarter-scoped story; History passes
   an all-time story (with no period label shown in the header).

   Props:
     story           { period?, prose[], readTime }
     onClose         ()
     hidePeriod      if true, the header shows only "The Story of You"
                     without a period suffix (used in History where the
                     story applies to all time)
     patternsLabel   optional string — if provided, a "See patterns"
                     bridge link renders at the end of the prose. Used
                     in History's usage so readers can step from the
                     narrative into the underlying Patterns surface.
                     Anthology passes nothing since it IS the Patterns
                     surface already.
     onOpenPatterns  optional callback for the bridge link
   ═══════════════════════════════════════════════════════════════════════════ */

export function StoryOfYouTakeover({
  story,
  onClose,
  hidePeriod = false,
  patternsLabel,
  onOpenPatterns,
  // When supplied, portal the takeover into this DOM node so the
  // backdrop covers the status bar / home indicator areas (full bleed
  // inside the phone screen). Falls back to inline rendering otherwise.
  portalContainer,
}) {
  const [playing, setPlaying] = useState(false);

  const overlay = (
    <div className="absolute inset-0 z-40 bg-gradient-to-b from-[#FFFBF2] via-[#FFF8EA] to-[#FFF3DE] flex flex-col">
      {/* Top bar — period label + close */}
      <div className="shrink-0 flex items-center justify-between gap-[8px] px-[16px] pt-[16px] pb-[12px]">
        <div className="flex items-center gap-[8px] min-w-0">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#AF730D"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-[14px] h-[14px] shrink-0"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <span className="text-[10px] leading-[13px] font-[700] tracking-[0.08em] uppercase text-[#AF730D] truncate">
            {hidePeriod || !story.period
              ? 'The Story of You'
              : <>The Story of You &middot; {story.period}</>}
          </span>
        </div>
        <button
          onClick={() => {
            onClose();
            setPlaying(false);
          }}
          className="shrink-0 w-[32px] h-[32px] rounded-full flex items-center justify-center hover:bg-black/5 transition-colors text-[#4A3100]"
          title="Close"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-[18px] h-[18px]">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Scrollable body — audiobook prose */}
      <div className="flex-1 min-h-0 overflow-y-auto px-[28px] pb-[24px] pt-[20px]">
        <div className="flex flex-col gap-[18px]">
          {story.prose.map((p, i) => (
            <p
              key={i}
              className="text-[17px] leading-[28px] font-[450] text-[#2A1F0A]"
            >
              {p}
            </p>
          ))}
        </div>

        {/* Optional bridge to Patterns — shown when patternsLabel is
            passed. Sits at the end of the reading flow so the user
            encounters it after finishing the story, not before. */}
        {patternsLabel && (
          <div className="mt-[28px] flex justify-center">
            <button
              onClick={onOpenPatterns}
              className="inline-flex items-center gap-[6px] px-[14px] py-[9px] rounded-full bg-[#AF730D]/10 hover:bg-[#AF730D]/15 text-[#AF730D] text-[12px] leading-[15px] font-[700] transition-colors cursor-pointer"
            >
              {patternsLabel}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-[12px] h-[12px]">
                <path d="M5 12h14" />
                <path d="M13 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Footer — audio control + bookmark/share */}
      <div className="shrink-0 flex items-center justify-between gap-[12px] px-[20px] pt-[10px] pb-[20px] border-t border-[#F0E8D8] bg-white/40 backdrop-blur-sm">
        <button
          onClick={() => setPlaying((p) => !p)}
          className="inline-flex items-center gap-[10px] pl-[4px] pr-[14px] py-[4px] rounded-full bg-[#AF730D] text-white hover:bg-[#8D5C0A] transition-colors"
          title={playing ? 'Pause narration' : 'Listen to narration'}
        >
          <span className="w-[32px] h-[32px] rounded-full bg-white/20 flex items-center justify-center">
            {playing ? (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-[14px] h-[14px]">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-[14px] h-[14px] ml-[2px]">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </span>
          <span className="text-[12px] leading-[15px] font-[700]">
            {playing ? 'Playing' : 'Listen'}
          </span>
          <span className="text-[11px] leading-[14px] font-[500] opacity-80">
            {story.readTime}
          </span>
        </button>

        <div className="flex items-center gap-[4px]">
          <button
            className="w-[36px] h-[36px] rounded-full flex items-center justify-center hover:bg-black/5 transition-colors text-[#4A3100]"
            title="Bookmark"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
          <button
            className="w-[36px] h-[36px] rounded-full flex items-center justify-center hover:bg-black/5 transition-colors text-[#4A3100]"
            title="Share"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return portalContainer ? createPortal(overlay, portalContainer) : overlay;
}
