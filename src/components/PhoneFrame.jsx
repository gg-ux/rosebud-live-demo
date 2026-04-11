import { useRef, useState, useEffect } from 'react';
import { StatusBar } from './StatusBar';
import { MainNavBar } from './MainNavBar';

const PHONE_W = 360;
const PHONE_H = 680;

export function PhoneFrame({
  children,
  showNavBar = true,
  showStatusBar = true,
  activeTab = 'today',
  className = '',
  // Optional callback ref. When supplied, fires with the inner rounded
  // screen div element so callers can portal full-screen overlays
  // (like a modal with a backdrop covering the status bar and home
  // indicator areas) into the phone screen.
  screenRef,
}) {
  const wrapperRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    function recalc() {
      const availW = el.clientWidth;
      const availH = window.innerHeight - 140;
      const scaleW = availW / PHONE_W;
      const scaleH = availH / PHONE_H;
      setScale(Math.min(1, scaleW, scaleH));
    }

    recalc();
    const observer = new ResizeObserver(recalc);
    observer.observe(el);
    window.addEventListener('resize', recalc);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', recalc);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`flex justify-center ${className}`}
      style={{ height: PHONE_H * scale }}
    >
      <div
        style={{
          width: PHONE_W,
          height: PHONE_H,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
        }}
      >
        {/* Bezel */}
        <div className="relative w-full h-full rounded-[50px] bg-[#000000] p-[8px] shadow-[0_8px_40px_rgba(0,0,0,0.2)]">
          {/* Screen */}
          <div ref={screenRef} className="relative w-full h-full rounded-[42px] bg-[#FFFFFF] overflow-hidden">
            {/* Dynamic Island */}
            <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[90px] h-[28px] rounded-full bg-[#000000] z-30" />

            {/* Status Bar */}
            {showStatusBar && (
              <div className="absolute top-0 left-0 right-0 z-20 bg-[#FFFFFF]">
                <StatusBar />
              </div>
            )}

            {/* Content area */}
            <div
              className="absolute left-0 right-0 overflow-y-auto overflow-x-hidden"
              style={{
                top: showStatusBar ? 47 : 0,
                bottom: showNavBar ? 72 : 34,
              }}
            >
              {children}
            </div>

            {/* Nav Bar — Figma SVG with floating island */}
            {showNavBar && (
              <div className="absolute bottom-0 left-0 right-0 z-20">
                <MainNavBar activeTab={activeTab} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
