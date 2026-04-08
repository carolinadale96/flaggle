// Flag Master — crown
export default function Crown({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="crown-grad" x1="16" y1="6" x2="16" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="60%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      {/* Crown body */}
      <path d="M5 24 L7 13 L12 18 L16 8 L20 18 L25 13 L27 24 Z" fill="url(#crown-grad)" />
      <path d="M5 24 L7 13 L12 18 L16 8 L20 18 L25 13 L27 24 Z" stroke="#d97706" strokeWidth="1" strokeLinejoin="round" fill="none" />
      {/* Base band */}
      <rect x="5" y="22" width="22" height="4" rx="1" fill="#d97706" />
      <rect x="5" y="22" width="22" height="4" rx="1" stroke="#b45309" strokeWidth="0.5" fill="none" />
      {/* Gems on points */}
      <circle cx="16" cy="9" r="2.5" fill="#ef4444" />
      <circle cx="16" cy="9" r="2.5" stroke="#dc2626" strokeWidth="0.5" fill="none" />
      <circle cx="7.5" cy="14" r="2" fill="#3b82f6" />
      <circle cx="24.5" cy="14" r="2" fill="#3b82f6" />
      {/* Gem shines */}
      <circle cx="15.2" cy="8.2" r="0.8" fill="white" opacity="0.6" />
      <circle cx="6.8" cy="13.2" r="0.6" fill="white" opacity="0.6" />
      <circle cx="23.8" cy="13.2" r="0.6" fill="white" opacity="0.6" />
      {/* Base gems */}
      <circle cx="11" cy="24" r="1.5" fill="#a855f7" />
      <circle cx="16" cy="24" r="1.5" fill="#ef4444" />
      <circle cx="21" cy="24" r="1.5" fill="#22c55e" />
    </svg>
  );
}
