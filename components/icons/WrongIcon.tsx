export default function WrongIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <defs>
        <linearGradient id="wrong-bg" x1="14" y1="0" x2="14" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
      </defs>
      <circle cx="14" cy="14" r="13" fill="url(#wrong-bg)" />
      <circle cx="14" cy="14" r="13" stroke="#b91c1c" strokeWidth="1" fill="none" />
      {/* Shine */}
      <ellipse cx="10" cy="8" rx="3" ry="2" fill="white" opacity="0.2" />
      {/* X */}
      <path d="M9 9 L19 19 M19 9 L9 19" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}
