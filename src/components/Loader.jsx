import { useEffect } from 'react';

export function Loader({ minDuration = 1400, onComplete }) {
  useEffect(() => {
    const preloader = document.getElementById('preloader');
    if (!preloader) { onComplete?.(); return; }

    const timer = setTimeout(() => {
      preloader.classList.add('hide');
      setTimeout(() => {
        preloader.remove();
        onComplete?.();
      }, 500);
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration, onComplete]);

  return null;
}
