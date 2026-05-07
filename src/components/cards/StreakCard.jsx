import { Check } from 'lucide-react';

// Matches Figma Streak (4204:3601 / 19996):
// - Title "{count} day streak" Title Large (17/23 medium 500), centered, onSurface
// - Days row: 7 columns; each = day letter (Body Small in secondaryTextOnSurface)
//   above a 28×28 status circle.
//   - Active day (entry completed): primary fill + lucide Check (matches Figma's
//     checkmark-circle component 4242:188).
//   - Empty: 1.5px stroke circle in onBackground at low opacity.
export function StreakCard({
  count = 3,
  days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
  activeDays = 3,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center gap-[24px] ${className}`}>
      <span className="text-[17px] leading-[23px] font-[500] text-[var(--color-on-surface)]">
        {count} day streak
      </span>
      <div className="flex items-center justify-center gap-[16px]">
        {days.map((day, i) => {
          const active = i < activeDays;
          return (
            <div key={i} className="flex flex-col items-center gap-[6px]">
              <div
                className={`w-[28px] h-[28px] rounded-full flex items-center justify-center ${
                  active
                    ? 'bg-[var(--color-primary)]'
                    : 'bg-transparent border-[1.5px] border-[var(--color-outline)]'
                }`}
              >
                {active && <Check size={14} strokeWidth={3} className="text-[var(--color-on-primary)]" />}
              </div>
              <span className="text-[13px] leading-[18px] font-[450] text-[var(--color-secondary-text-on-surface)]">
                {day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
