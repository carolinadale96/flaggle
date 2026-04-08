export default function Flame({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <defs>
        <linearGradient id="flame-outer" x1="12" y1="22" x2="12" y2="2" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="60%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
        <linearGradient id="flame-inner" x1="12" y1="20" x2="12" y2="10" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#fef9c3" />
        </linearGradient>
      </defs>
      {/* Outer flame */}
      <path
        d="M12 2C12 2 7 8 7 13a5 5 0 0 0 10 0c0-2-1-4-2-5 0 0 0 3-2 4-1-3-1-9-1-10z"
        fill="url(#flame-outer)"
      />
      {/* Inner glow */}
      <path
        d="M12 10c0 0-2 3-2 5a2 2 0 0 0 4 0c0-1.5-1-3.5-2-5z"
        fill="url(#flame-inner)"
      />
    </svg>
  );
}
