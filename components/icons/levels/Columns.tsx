// Diplomat — classical columns building
export default function Columns({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="col-grad" x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
      </defs>
      {/* Roof / pediment */}
      <path d="M4 12 L16 4 L28 12 Z" fill="#f59e0b" />
      <path d="M4 12 L16 4 L28 12" stroke="#d97706" strokeWidth="1" fill="none" />
      {/* Entablature */}
      <rect x="5" y="12" width="22" height="3" fill="#fbbf24" />
      {/* Columns */}
      {[8, 13, 19, 24].map((x) => (
        <g key={x}>
          <rect x={x - 1} y="15" width="2" height="10" fill="url(#col-grad)" />
          {/* Flutes */}
          <line x1={x} y1="15" x2={x} y2="25" stroke="#d97706" strokeWidth="0.4" opacity="0.5" />
          {/* Capital */}
          <rect x={x - 1.5} y="14" width="3" height="1.5" rx="0.5" fill="#fbbf24" />
          {/* Base */}
          <rect x={x - 1.5} y="25" width="3" height="1.5" rx="0.5" fill="#fbbf24" />
        </g>
      ))}
      {/* Steps */}
      <rect x="4" y="26.5" width="24" height="2" rx="0.5" fill="#d97706" />
      <rect x="3" y="28.5" width="26" height="2" rx="0.5" fill="#b45309" />
      {/* Door */}
      <rect x="14" y="19" width="4" height="6" rx="1" fill="#92400e" />
      <path d="M14 19 Q16 17 18 19" fill="#92400e" />
    </svg>
  );
}
