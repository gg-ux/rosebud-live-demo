import { useEffect, useRef, useState } from 'react';

/* ──────────────────────────────────────────────────────────────────────────
   PodcastPlayer — compact pill that lives in the main top nav bar.
   Themed for the light Layout chrome.
   Audio file expected at /public/podcasts/living-design-system.mp3
   When the file is missing, gracefully shows "Podcast unavailable" state.
   ────────────────────────────────────────────────────────────────────────── */

const ROSE = '#E31665';

function formatTime(seconds) {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function PodcastPlayer({ src = '/podcasts/living-design-system.mp3' }) {
  const audioRef = useRef(null);
  const seekRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onLoaded = () => setDuration(audio.duration || 0);
    const onTime = () => setCurrentTime(audio.currentTime);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    const onError = () => setHasError(true);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    // Sync check — if the element already errored before the listener attached
    // (e.g. 404 on initial src load), reflect that state immediately.
    if (audio.error || audio.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
      setHasError(true);
    }
    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || hasError) return;
    if (audio.paused) audio.play().catch(() => setHasError(true));
    else audio.pause();
  };

  const seekTo = (clientX) => {
    const audio = audioRef.current;
    const bar = seekRef.current;
    if (!audio || !bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    audio.currentTime = pct * duration;
    setCurrentTime(audio.currentTime);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center justify-center" style={{ width: 380 }}>
      <audio ref={audioRef} src={src} preload="metadata" />
      <div
        className="w-full flex items-center gap-[10px] pl-[5px] pr-[12px] py-[5px] rounded-full bg-[var(--color-background)] border border-[var(--color-outline-light)] hover:border-[var(--color-on-background)]/30 transition-colors"
      >
        {/* Play/pause */}
        <button
          onClick={togglePlay}
          disabled={hasError}
          aria-label={isPlaying ? 'Pause podcast' : 'Play podcast'}
          className={`shrink-0 w-[26px] h-[26px] rounded-full flex items-center justify-center transition-opacity ${
            hasError ? 'cursor-not-allowed bg-[var(--color-surface-variant)]' : 'cursor-pointer hover:opacity-90'
          }`}
          style={{ backgroundColor: hasError ? undefined : ROSE }}
        >
          {hasError ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[11px] h-[11px] text-[var(--color-secondary-text)]">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : isPlaying ? (
            <svg viewBox="0 0 24 24" fill="white" className="w-[9px] h-[9px]">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="white" className="w-[10px] h-[10px] ml-[1px]">
              <polygon points="6,4 20,12 6,20" />
            </svg>
          )}
        </button>

        {/* Label + seek bar stacked */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-[10px] mb-[3px]">
            <span className={`text-[11px] font-[600] tracking-[0.02em] truncate ${
              hasError ? 'text-[var(--color-secondary-text)]' : 'text-[var(--color-on-background)]'
            }`}>
              {hasError ? 'Podcast unavailable' : 'Living Design System Podcast'}
            </span>
            <span className="text-[10px] tabular-nums font-[500] text-[var(--color-secondary-text)] shrink-0">
              {hasError ? 'Add audio file' : `${formatTime(currentTime)} / ${formatTime(duration)}`}
            </span>
          </div>
          {/* Seek bar */}
          <div
            ref={seekRef}
            onClick={(e) => seekTo(e.clientX)}
            onMouseDown={(e) => seekTo(e.clientX)}
            className={`relative h-[3px] rounded-full overflow-hidden bg-[var(--color-outline-light)] ${
              hasError ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <div
              className="absolute top-0 left-0 h-full transition-all duration-100"
              style={{ width: `${progress}%`, backgroundColor: hasError ? 'var(--color-outline-light)' : ROSE }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
