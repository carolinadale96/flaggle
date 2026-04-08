// Ambassador — medal with ribbon
export default function Medal({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="medal-ribbon-l" x1="11" y1="4" x2="11" y2="14" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        <linearGradient id="medal-ribbon-r" x1="21" y1="4" x2="21" y2="14" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
        <linearGradient id="medal-face" x1="16" y1="12" x2="16" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      {/* Ribbon left */}
      <path d="M13 4 L16 4 L16 14 L11 14 Z" fill="url(#medal-ribbon-l)" />
      {/* Ribbon right */}
      <path d="M16 4 L19 4 L21 14 L16 14 Z" fill="url(#medal-ribbon-r)" />
      {/* Ribbon fold/knot */}
      <path d="M12 4 L20 4 L20 6 L16 8 L12 6 Z" fill="#6d28d9" />
      {/* Medal circle */}
      <circle cx="16" cy="21" r="8" fill="url(#medal-face)" />
      <circle cx="16" cy="21" r="8" stroke="#d97706" strokeWidth="1.5" fill="none" />
      {/* Inner ring */}
      <circle cx="16" cy="21" r="5.5" stroke="#fbbf24" strokeWidth="0.8" fill="none" opacity="0.6" />
      {/* Star */}
      <path d="M16 16.5l.9 2.7h2.8l-2.3 1.7.9 2.7-2.3-1.7-2.3 1.7.9-2.7-2.3-1.7h2.8z" fill="#fef9c3" />
    </svg>
  );
}
