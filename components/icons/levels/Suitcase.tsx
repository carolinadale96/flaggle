// Tourist — suitcase
export default function Suitcase({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="8" y="12" width="16" height="14" rx="2" fill="#6366f1" />
      <rect x="8" y="12" width="16" height="14" rx="2" stroke="#4338ca" strokeWidth="1.5" />
      {/* Stripe */}
      <rect x="8" y="18" width="16" height="2" fill="#4338ca" />
      {/* Handle */}
      <path d="M12 12V9a4 4 0 0 1 8 0v3" stroke="#4338ca" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Latches */}
      <rect x="14" y="17" width="4" height="4" rx="1" fill="#a5b4fc" />
      {/* Wheels */}
      <circle cx="11" cy="26.5" r="1.5" fill="#4338ca" />
      <circle cx="21" cy="26.5" r="1.5" fill="#4338ca" />
      {/* Sticker */}
      <circle cx="22" cy="14" r="2" fill="#f59e0b" />
      <text x="22" y="14.8" textAnchor="middle" fontSize="3" fill="white" fontWeight="bold">✈</text>
    </svg>
  );
}
