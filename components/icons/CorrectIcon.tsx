export default function CorrectIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <defs>
        <linearGradient id="correct-bg" x1="14" y1="0" x2="14" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
      </defs>
      <circle cx="14" cy="14" r="13" fill="url(#correct-bg)" />
      <circle cx="14" cy="14" r="13" stroke="#15803d" strokeWidth="1" fill="none" />
      {/* Shine */}
      <ellipse cx="10" cy="8" rx="3" ry="2" fill="white" opacity="0.2" />
      {/* Check */}
      <path d="M8 14 L12 18 L20 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
