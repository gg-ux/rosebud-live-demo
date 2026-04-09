export function OnboardingWelcome({ onNext }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-[24px] text-center gap-[32px]">
      <div className="flex flex-col items-center gap-[16px]">
        <div className="w-[80px] h-[80px] rounded-full bg-[#F0FFF4] flex items-center justify-center">
          <img src={new URL('../../../illustrations/eye.svg', import.meta.url).href} alt="" className="w-[48px] h-[48px]" />
        </div>
        <h1 className="text-[24px] leading-[32px] font-[700] text-[#191C1A]">
          What patterns matter to you?
        </h1>
        <p className="text-[16px] leading-[22px] font-[450] text-[#6D6C6A] max-w-[320px]">
          Rosebud can track patterns across your journal entries and surface insights you can&apos;t see alone.
        </p>
      </div>
      <button
        onClick={onNext}
        className="w-full max-w-[320px] h-[48px] rounded-[12px] bg-[#000000] text-[#FAFAFA] text-[16px] font-[500] cursor-pointer hover:opacity-90 transition-opacity"
      >
        Get Started
      </button>
    </div>
  );
}
