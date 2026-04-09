export function Card({ children, className = '' }) {
  return (
    <div className={`rounded-[12px] bg-[var(--color-surface)] border border-[var(--color-outline-light)] p-[16px] ${className}`}>
      {children}
    </div>
  );
}
