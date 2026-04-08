// Traveler — airplane
export default function Airplane({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Body */}
      <path d="M16 4c1.5 0 3 1.5 3 4v6l8 4v3l-8-2v4l2 1.5v2l-5-1.5-5 1.5v-2l2-1.5v-4l-8 2v-3l8-4V8c0-2.5 1.5-4 3-4z" fill="#38bdf8" />
      {/* Wing shine */}
      <path d="M16 4c1 0 2 1 2.5 3H16V4z" fill="#7dd3fc" />
      {/* Nose */}
      <ellipse cx="16" cy="4.5" rx="2" ry="1" fill="#0ea5e9" />
      {/* Windows */}
      <circle cx="14" cy="11" r="1" fill="#e0f2fe" />
      <circle cx="16" cy="11" r="1" fill="#e0f2fe" />
      <circle cx="18" cy="11" r="1" fill="#e0f2fe" />
    </svg>
  );
}
