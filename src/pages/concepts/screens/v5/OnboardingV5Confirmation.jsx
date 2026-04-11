import { Button } from '../../../../components/Button';
import joySvg from '../../../../symbols/emotes/joy.svg';

/* ══════════════════════════════════════════════════════════
   V5 · Confirmation — celebration + feature promises
   This replaces the old receipt-style confirmation. The screen
   now commits fully to ONE job: making the user feel ready.
   A large celebration sticker is the hero, three feature
   promises tell them what to expect once they start writing,
   and a single CTA drops them into their first entry.
   No picks paragraph, no chart, no caption soup — just the
   "curtain opening" moment at the end of setup.
   ══════════════════════════════════════════════════════════ */
export function OnboardingV5Confirmation({ onBack, step = 3, total = 4 }) {
  return (
    <div className="flex flex-col h-full px-[20px] pt-[8px]">
      {/* Top bar — Back left, nothing right on the final step */}
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

      {/* Progress bar — fully filled on the final step so the
          completed-state is visually obvious */}
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
          centers the hero/title/features cluster in the space between
          the progress bar and the Start Journaling button. Bottom
          padding (pb-[32px]) biases content upward while staying
          conservative enough that the feature card's worst-case row
          wrapping doesn't push the button off the bottom. */}
      <div className="flex-1 flex flex-col justify-center pb-[32px]">
        {/* Hero sticker — large joy emote, centered. This is the
            one visual element doing all the "celebration" work.
            Tight mb-[8px] so the title reads as a caption directly
            under the sticker rather than floating separately. */}
        <div className="flex justify-center mb-[8px]">
          <img
            src={joySvg}
            alt=""
            className="w-[100px] h-[100px]"
          />
        </div>

        {/* Title — confident and celebratory */}
        <h2 className="text-[24px] leading-[30px] font-[700] text-[#191C1A] tracking-[-0.01em] text-center mb-[6px]">
          You&rsquo;re all set
        </h2>
        <p className="text-[13px] leading-[20px] font-[450] text-[#6D6C6A] text-center mb-[20px]">
          Here&rsquo;s what to expect as you write.
        </p>

        {/* Feature promises — three short value props grouped in a
            single soft card with hairline dividers between rows
            (iOS grouped-list pattern). Gives each promise its own
            visual breathing room without turning the screen into a
            SaaS feature grid of individual bordered cards. */}
        <div className="rounded-[16px] bg-[#F7F7F7] px-[16px] divide-y divide-[#EDEDED]">
          <FeatureRow
            title="Thoughtful questions"
            description="Rosebud asks follow-ups to help you dig deeper as you write."
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="M9.5 9.5a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            }
          />
          <FeatureRow
            title="Private and encrypted"
            description="Your entries stay yours. Nothing is shared."
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            }
          />
          <FeatureRow
            title="Insights after each entry"
            description="Get personalized reflections and recommendations tailored to you."
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v2" />
                <path d="M12 19v2" />
                <path d="M5 12H3" />
                <path d="M21 12h-2" />
                <path d="M18.364 5.636l-1.414 1.414" />
                <path d="M7.05 16.95l-1.414 1.414" />
                <path d="M18.364 18.364l-1.414-1.414" />
                <path d="M7.05 7.05L5.636 5.636" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Footer — single CTA. No caption, no secondary action.
          The button is the last thing on the screen and the user's
          only path forward. */}
      <div className="pb-[8px] flex flex-col">
        <Button variant="primary" size="large" className="w-full">
          Start Journaling
        </Button>
      </div>
    </div>
  );
}

/* Single feature promise row — small icon on the left, title +
   description stacked on the right. Bare icon (no background
   shape) keeps it from reading as a SaaS feature grid. */
function FeatureRow({ icon, title, description }) {
  return (
    <div className="flex items-start gap-[12px] py-[10px]">
      <div className="w-[20px] h-[20px] shrink-0 text-[#191C1A] mt-[1px]">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] leading-[18px] font-[600] text-[#191C1A] mb-[1px]">
          {title}
        </div>
        <div className="text-[12px] leading-[17px] font-[450] text-[#6D6C6A]">
          {description}
        </div>
      </div>
    </div>
  );
}
