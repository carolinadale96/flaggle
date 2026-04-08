export default function Trophy({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <defs>
        <linearGradient id="trophy-body" x1="12" y1="2" x2="12" y2="16" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      {/* Cup body */}
      <path d="M7 2h10v8a5 5 0 0 1-10 0V2z" fill="url(#trophy-body)" />
      {/* Shine */}
      <path d="M9 3h2v5a2 2 0 0 1-2-2V3z" fill="#fef9c3" opacity="0.6" />
      {/* Handles */}
      <path d="M7 4H4a2 2 0 0 0 0 4h3" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M17 4h3a2 2 0 0 1 0 4h-3" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Stem */}
      <rect x="11" y="14" width="2" height="4" fill="#f59e0b" />
      {/* Base */}
      <rect x="8" y="18" width="8" height="2" rx="1" fill="#d97706" />
      {/* Star on cup */}
      <path d="M12 5l.5 1.5H14l-1.2.9.4 1.5L12 8l-1.2.9.4-1.5L10 6.5h1.5z" fill="#fef9c3" />
    </svg>
  );
}
