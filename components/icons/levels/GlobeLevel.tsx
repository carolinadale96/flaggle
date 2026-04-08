// Geographer — globe with latitude/longitude lines
export default function GlobeLevel({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="globe-bg" x1="8" y1="4" x2="24" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        <clipPath id="globe-clip">
          <circle cx="16" cy="16" r="12" />
        </clipPath>
      </defs>
      <circle cx="16" cy="16" r="12" fill="url(#globe-bg)" />
      {/* Grid lines clipped to circle */}
      <g clipPath="url(#globe-clip)" stroke="#bae6fd" strokeWidth="0.8" opacity="0.7">
        {/* Latitudes */}
        <ellipse cx="16" cy="16" rx="12" ry="4" />
        <ellipse cx="16" cy="16" rx="12" ry="8" />
        <line x1="4" y1="16" x2="28" y2="16" />
        {/* Longitudes */}
        <ellipse cx="16" cy="16" rx="4" ry="12" />
        <ellipse cx="16" cy="16" rx="8" ry="12" />
        <line x1="16" y1="4" x2="16" y2="28" />
      </g>
      {/* Landmasses */}
      <g clipPath="url(#globe-clip)" fill="#4ade80" opacity="0.85">
        <path d="M10 12 Q12 10 15 11 Q16 13 14 15 Q11 15 10 12z" />
        <path d="M17 13 Q20 11 22 13 Q22 17 19 17 Q17 16 17 13z" />
        <path d="M12 18 Q14 17 16 19 Q15 22 12 21z" />
      </g>
      {/* Shine */}
      <ellipse cx="12" cy="11" rx="3" ry="2" fill="white" opacity="0.2" />
      <circle cx="16" cy="16" r="12" stroke="#0284c7" strokeWidth="1.5" fill="none" />
    </svg>
  );
}
